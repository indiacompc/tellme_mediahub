import json
import math
import os

with open('public/image_listings.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Sort them or just process sequentially
# data length should be around 1320

# Let's create a directory for the blocks
os.makedirs('seo_blocks_for_claude', exist_ok=True)

blocks = []
block_size = 10
total_blocks = math.ceil(len(data) / block_size)

for i in range(0, len(data), block_size):
    chunk = data[i:i+block_size]
    block_num = i // block_size + 1
    
    block_text = f'--- SEO Block {block_num} of {total_blocks} ---\n'
    block_text += 'Please review the following images and generate the best new SEO meta tags (Meta Title, Meta Description, Meta Keywords) for each item.\n\n'
    
    for item in chunk:
        title = item.get('title', 'N/A')
        loc_cap = item.get('captured_location', '')
        city = item.get('city', '')
        state = item.get('state', '')
        location = f"{loc_cap}, {city}, {state}".strip(", ")
        
        description = item.get('description', 'N/A')
        current_meta_title = item.get('meta_title', 'N/A')
        current_meta_desc = item.get('meta_description', 'N/A')
        current_meta_keywords = item.get('meta_keywords', 'N/A')
        
        block_text += f'''Image ID: {item.get('id')}
Title: {title}
Location: {location}
Description: {description}
Current Meta Title: {current_meta_title}
Current Meta Description: {current_meta_desc}
Current Meta Keywords: {current_meta_keywords}

'''
    # We can either save them all in one big file or save them in a directory per file.
    # The prompt says "make 10 blocks of all images in one folder". I will generate individual files in one folder "seo_blocks_for_claude".
    # Wait, the prompt: "make 10 blocks of all images in one folder".
    # Does the prompt mean "make blocks of 10 for all images in the folder" or "create 10 folders"? Let's re-read:
    # "make 10 blocks of all images in one folder which content title , location and as per you think needed to get best new seo meta tags"
    # Actually, it likely means "Make blocks around 10 images each" or "groups of 10 items" just like the history says ("track the workflow for these images in blocks of 10").
    
    with open(f'seo_blocks_for_claude/block_{block_num:03d}.txt', 'w', encoding='utf-8') as f:
        f.write(block_text)

print(f'Generated {block_num} blocks into seo_blocks_for_claude directory.')
