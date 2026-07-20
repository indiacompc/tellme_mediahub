"""Enrich image_listings.json with GEO content fields for SEO.

Problem this solves
-------------------
Only 8 of ~1,315 public images have geo_summary / geo_context / geo_faq /
geo_tags populated. The image detail page template already renders these
fields ("About this image", "Where it fits", an FAQ, related-topic chips)
and emits FAQPage JSON-LD — but with the fields empty, ~1,307 pages render
just a title + short description, which Google files under
"Discovered - currently not indexed" (thin content). Populating these fields
turns those dead pages into substantial, indexable ones.

What it does
------------
For every public image that has a `src` but is missing GEO fields, it asks
Claude to generate:
  - geo_summary : 1-2 factual sentences (the visible "About this image" text)
  - geo_context : one short paragraph on where the subject fits / its significance
  - geo_faq     : 3 question/answer pairs (powers the FAQ section + FAQ rich results)
  - geo_tags    : 6-8 related-topic tags

Structured outputs guarantee valid JSON per image (no parsing/repair needed).
Generation is grounded strictly on the existing title/description/location so
the model does not invent dates, dimensions, prices, or statistics about the
real places depicted.

Safety / resumability
---------------------
  - Only fills images whose GEO fields are empty, so re-running skips finished
    work — safe to stop (Ctrl-C) and resume.
  - Writes image_listings.json back to disk every SAVE_EVERY images, so a crash
    loses at most that many.
  - --limit N  : process only N images (use `--limit 5` first to review quality).
  - --dry-run  : generate + print, but do NOT write the JSON file.

Setup
-----
  pip install anthropic pydantic
  set ANTHROPIC_API_KEY=sk-ant-...      (or run `ant auth login`)
  python enrich_geo_content.py --limit 5 --dry-run     # review a sample first
  python enrich_geo_content.py                          # full run (resumable)

Cost note: defaults to claude-opus-4-8. Pass `--model claude-sonnet-5` to cut
cost roughly in half for this bulk descriptive task with little quality loss.
"""

from __future__ import annotations

import argparse
import json
import sys
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import List

try:
    import anthropic
    from pydantic import BaseModel, Field
except ImportError:
    sys.exit(
        "Missing dependencies. Run:  pip install anthropic pydantic\n"
        "Then set ANTHROPIC_API_KEY (or run `ant auth login`)."
    )

JSON_PATH = Path(__file__).with_name("public") / "image_listings.json"
DEFAULT_MODEL = "claude-opus-4-8"
WORKERS = 6          # concurrent requests; well under the API rate limit
SAVE_EVERY = 20      # flush image_listings.json to disk every N completions
MAX_TOKENS = 1500


# ── Structured output schema ────────────────────────────────────────────────
class FaqItem(BaseModel):
    question: str
    answer: str


class GeoContent(BaseModel):
    geo_summary: str = Field(
        description="1-2 factual sentences describing what the image shows and "
        "where. Visible on the page as 'About this image'. ~120-180 chars."
    )
    geo_context: str = Field(
        description="One short paragraph (~2-4 sentences) on the subject's "
        "significance or where it fits — the place, era, or theme. No invented "
        "dates/dimensions/statistics."
    )
    geo_faq: List[FaqItem] = Field(
        description="Exactly 3 question/answer pairs a viewer might ask about "
        "the location or subject. Answers 1-3 sentences, factual, no invented specifics."
    )
    geo_tags: List[str] = Field(
        description="6-8 short related-topic tags (places, themes, subjects). "
        "Lowercase or title case, no hashtags."
    )


SYSTEM_PROMPT = (
    "You write concise, factual metadata for a stock-photo licensing site. "
    "You are given a single image's title, editorial description, location, and "
    "category. Produce SEO/GEO content grounded ONLY in what you are given plus "
    "well-established general knowledge about the named place. Do NOT invent "
    "specific dates, measurements, prices, visitor numbers, or statistics. If a "
    "fact is uncertain, keep it general. Write for someone deciding whether to "
    "license the image; be informative, not promotional."
)


def build_user_prompt(img: dict) -> str:
    loc = ", ".join(
        p for p in (img.get("captured_location"), img.get("city"), img.get("state")) if p
    )
    return (
        f"Title: {img.get('title', '')}\n"
        f"Description: {img.get('description', '')}\n"
        f"Location: {loc or 'Unknown'}\n"
        f"Category: {img.get('image_category_id') or img.get('category_slug') or 'Uncategorized'}\n\n"
        "Generate the GEO content for this image."
    )


def needs_enrichment(img: dict) -> bool:
    if img.get("status") != "public" or not img.get("src"):
        return False
    return not (
        img.get("geo_summary")
        and img.get("geo_context")
        and img.get("geo_faq")
        and img.get("geo_tags")
    )


def enrich_one(client: "anthropic.Anthropic", model: str, img: dict) -> GeoContent:
    resp = client.messages.parse(
        model=model,
        max_tokens=MAX_TOKENS,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": build_user_prompt(img)}],
        output_format=GeoContent,
    )
    return resp.parsed_output


def main() -> None:
    ap = argparse.ArgumentParser(description="Enrich image_listings.json with GEO SEO fields.")
    ap.add_argument("--model", default=DEFAULT_MODEL, help=f"Claude model (default {DEFAULT_MODEL})")
    ap.add_argument("--limit", type=int, default=0, help="Process at most N images (0 = all)")
    ap.add_argument("--workers", type=int, default=WORKERS, help=f"Concurrent requests (default {WORKERS})")
    ap.add_argument("--dry-run", action="store_true", help="Generate and print, but do not write the JSON")
    args = ap.parse_args()

    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))

    # Index targets by position so we can write results straight back into `data`.
    targets = [i for i, img in enumerate(data) if needs_enrichment(img)]
    if args.limit:
        targets = targets[: args.limit]

    total_public = sum(1 for img in data if img.get("status") == "public" and img.get("src"))
    already = total_public - sum(1 for img in data if needs_enrichment(img))
    print(f"Public images with src : {total_public}")
    print(f"Already enriched       : {already}")
    print(f"To enrich this run     : {len(targets)}  (model={args.model}, dry_run={args.dry_run})")
    if not targets:
        print("Nothing to do.")
        return

    client = anthropic.Anthropic()
    lock = threading.Lock()
    done = 0
    failed: List[int] = []

    def work(idx: int):
        geo = enrich_one(client, args.model, data[idx])
        return idx, geo

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(work, idx): idx for idx in targets}
        for fut in as_completed(futures):
            idx = futures[fut]
            try:
                _, geo = fut.result()
                img = data[idx]
                img["geo_summary"] = geo.geo_summary
                img["geo_context"] = geo.geo_context
                img["geo_faq"] = [qa.model_dump() for qa in geo.geo_faq]
                img["geo_tags"] = geo.geo_tags
                done += 1
                if args.dry_run:
                    print(f"\n--- {img.get('slug')}")
                    print(f"  summary: {geo.geo_summary}")
                    print(f"  tags   : {', '.join(geo.geo_tags)}")
            except Exception as e:  # noqa: BLE001 - keep going, record failures
                failed.append(idx)
                print(f"  ! failed {data[idx].get('slug')}: {type(e).__name__}: {e}")

            if not args.dry_run and done and done % SAVE_EVERY == 0:
                with lock:
                    JSON_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
                print(f"  …saved ({done}/{len(targets)})")

    if not args.dry_run:
        JSON_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\nEnriched {done}/{len(targets)}. Failed: {len(failed)}.")
    if failed:
        print("Re-run to retry failures (finished images are skipped automatically).")


if __name__ == "__main__":
    main()
