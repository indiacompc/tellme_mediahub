'use client';

import ImageGrid from '@/components/ImageGrid';
import SearchBar from '@/components/SearchBar';
import {
	getAllCategories,
	getImagesByCategorySlug,
	searchImagesInDatabase
} from '@/lib/actions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import CategoryImagesFilter from './[category]/CategoryImagesFilter';
import MasonryLayout from './[category]/MasonryLayout';

// Simple in-memory cache to avoid refetching per session
const categoryCache: Record<string, { images: any[]; total: number }> = {};

function ImagesPageContent() {
	const searchParams = useSearchParams();
	const filter = searchParams.get('filter');
	const page = searchParams.get('page');
	const stateFilter = searchParams.get('state') || undefined;
	const cityFilter = searchParams.get('city') || undefined;
	const searchParam = searchParams.get('q') || '';

	const [searchQuery, setSearchQuery] = useState(searchParam);
	const [searching, setSearching] = useState(false);
	const [filteredImages, setFilteredImages] = useState<any[]>([]);
	const [searchMode, setSearchMode] = useState(!!searchParam);
	const [searchCategories, setSearchCategories] = useState<any[]>([]);
	const [categoryName, setCategoryName] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [totalImages, setTotalImages] = useState(0);
	const [currentPage] = useState(page ? parseInt(page) : 1);
	const lastLoadKeyRef = useRef('');

// Reduced limit to minimize bandwidth usage
const limit = 8;

// Normalize helper (single definition)
const normalize = (val: string | undefined | null) =>
	(val || '').toString().toLowerCase().trim().replace(/\s+/g, '-');

	// When arriving with a q param (e.g., from category card), fetch search results
	useEffect(() => {
		const hydrateSearchFromQuery = async () => {
			if (!searchParam.trim()) return;
			// If already loaded, skip
			if (searchCategories.length > 0) return;
			setSearching(true);
			try {
				const results = await searchImagesInDatabase(searchParam.trim());
				setSearchCategories(results);
				setSearchMode(true);
				setSearchQuery(searchParam);
				// If we are already on a category (filter present), scope to it
				if (filter) {
					const target = normalize(filter);
					const match = results.find((cat: any) => {
						const slug = normalize(cat.categorySlug);
						const id = normalize(cat.categoryId);
						const name = normalize(cat.categoryName);
						return slug === target || id === target || name === target;
					});
					if (match) {
						const imgs = match.images ?? [];
						setFilteredImages(imgs);
						setCategoryName(match.categoryName ?? '');
						setTotalImages(imgs.length);
						setSearchMode(true);
					}
				}
			} catch (error) {
				console.error('Error hydrating search from query param:', error);
				setSearchCategories([]);
			} finally {
				setSearching(false);
			}
		};

		void hydrateSearchFromQuery();
	}, [searchParam, searchCategories.length, filter]);

	useEffect(() => {
		const loadFilteredImages = async () => {
			if (!filter) {
				setFilteredImages([]);
				setCategoryName('');
				setSearchCategories([]);
				return;
			}

			// Skip identical reloads to prevent flicker on back navigation
			const loadKey = `${filter}|${normalize(searchQuery)}|${stateFilter || ''}|${
				cityFilter || ''
			}|${currentPage}`;
			if (lastLoadKeyRef.current === loadKey) {
				return;
			}

			setLoading(true);
			try {
				const categories = await getAllCategories();
				const category = categories.find((cat) => cat.slug === filter);

				if (category) {
					setCategoryName(category.name);
					const pageNumber = currentPage;
					const skip = (pageNumber - 1) * limit;

					// If we are in search mode, filter the search subset for this category
					if (searchQuery.trim()) {
						if (searchCategories.length > 0) {
							const target = normalize(filter);
							const match = searchCategories.find((cat: any) => {
								const slug = normalize(cat.categorySlug);
								const id = normalize(cat.categoryId);
								const name = normalize(cat.categoryName);
								return slug === target || id === target || name === target;
							});

							const images = (match as any)?.images ?? [];
							setFilteredImages(images);
							setTotalImages(images.length);
						} else {
							// While search results are loading, avoid flashing all images
							setFilteredImages([]);
							setTotalImages(0);
						}
					} else {
						const { images, total } = await getImagesByCategorySlug(
							filter,
							limit,
							skip,
							stateFilter,
							cityFilter
						);
						setFilteredImages(images);
						setTotalImages(total);
					}

					// If we are coming from a search, keep search mode so masonry shows search subset
					setSearchMode(!!searchQuery);
					lastLoadKeyRef.current = loadKey;
				} else {
					setFilteredImages([]);
					setCategoryName('');
					setSearchCategories([]);
					setSearchMode(false);
				}
			} catch (error) {
				console.error('Error loading filtered images:', error);
				setFilteredImages([]);
				setSearchCategories([]);
				setSearchMode(false);
			} finally {
				setLoading(false);
			}
		};

		loadFilteredImages();
	}, [filter, currentPage, stateFilter, cityFilter, searchQuery, searchCategories]);

	const handleSearch = async (query: string) => {
		setSearching(true);
		setSearchQuery(query);
		setSearchMode(!!query.trim());

		// If user clears search, also clear q from URL for consistency
		const url = new URL(window.location.href);
		if (query.trim()) {
			url.searchParams.set('q', query.trim());
		} else {
			url.searchParams.delete('q');
		}
		window.history.replaceState({}, '', url.toString());

		// When searching, load search results and cache them
		if (query.trim()) {
			try {
				const results = await searchImagesInDatabase(query.trim());
				setSearchCategories(results);
			} catch (error) {
				console.error('Error searching images:', error);
				setSearchCategories([]);
			}
		} else {
			setSearchCategories([]);
		}

		// Reset searching state after a short delay to trigger the grid update
		setTimeout(() => setSearching(false), 100);
	};

	// If filter is present, show filtered images
	if (filter) {
		return (
			<main className='min-h-screen'>
				<div className='relative container mx-auto px-4 py-4 sm:px-6 sm:py-8 lg:px-8'>
					{categoryName && (
						<div className='mb-4 flex items-center gap-3 sm:mb-6'>
							<Link
								href='/?filter=images'
								className='flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100'
								aria-label='Back to images'
							>
								<LuArrowLeft className='text-foreground h-5 w-5 sm:h-6 sm:w-6' />
							</Link>
							<h1 className='font-cinzel text-foreground text-xl font-semibold sm:text-2xl'>
								{categoryName}
								{stateFilter && (
									<span className='text-muted-foreground ml-2 text-base font-normal'>
										• {stateFilter}
									</span>
								)}
								{cityFilter && (
									<span className='text-muted-foreground ml-2 text-base font-normal'>
										• {cityFilter}
									</span>
								)}
							</h1>
							<CategoryImagesFilter categorySlug={filter} />
						</div>
					)}

					{loading ? (
						<div className='flex min-h-[75dvh] w-full items-center justify-center'>
							<p>Loading...</p>
						</div>
					) : (
						<Suspense>
							<MasonryLayout
								images={filteredImages}
								categorySlug={filter}
								pageNumber={currentPage}
								totalPages={Math.ceil(totalImages / limit)}
								limit={limit}
								searchQuery={searchMode ? searchQuery : undefined}
							/>
						</Suspense>
					)}
				</div>
			</main>
		);
	}

	// Default view - show all categories
	return (
		<main className='container mx-auto px-4 py-8'>
			<div className='mb-8 space-y-4'>
				<h1 className='font-cinzel text-foreground text-4xl font-bold md:text-5xl'>
					Image Gallery
				</h1>
				<p className='text-muted-foreground text-lg'>
					Explore our collection of beautiful images organized by category
				</p>
			</div>

			<div className='mb-8'>
				<SearchBar
					onSearch={handleSearch}
					placeholder='Search image categories...'
				/>
			</div>

			<ImageGrid searchQuery={searchQuery} searching={searching} />
		</main>
	);
}

export default function ImagesPage() {
	return (
		<Suspense
			fallback={
				<main className='container mx-auto px-4 py-8'>
					<div className='flex min-h-[75dvh] w-full items-center justify-center'>
						<p>Loading...</p>
					</div>
				</main>
			}
		>
			<ImagesPageContent />
		</Suspense>
	);
}
