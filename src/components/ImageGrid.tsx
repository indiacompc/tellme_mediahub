'use client';

import {
	loadImageCategorySummaries,
	searchImagesInDatabase
} from '@/lib/actions';
import type { ImageCategory, ImageCategorySummary } from '@/types/image';
import { useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';
import ErrorState from './Error';
import VideoSkeleton from './VideoSkeleton';

interface ImageGridProps {
	searchQuery?: string;
	searching?: boolean;
}

export default function ImageGrid({
	searchQuery = '',
	searching = false
}: ImageGridProps) {
	// Use lightweight summaries for the default view
	const [categorySummaries, setCategorySummaries] = useState<
		ImageCategorySummary[]
	>([]);
	// Full categories only loaded when searching
	const [searchCategories, setSearchCategories] = useState<ImageCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	const isSearching = searchQuery && searchQuery.trim().length > 0;

	useEffect(() => {
		let isMounted = true;
		const loadData = async () => {
			try {
				setLoading(true);
				setError(null);

				if (isSearching) {
					const searchResults = await searchImagesInDatabase(searchQuery);
					if (!isMounted) return;
					setSearchCategories(searchResults);
				} else {
					// Use lightweight summaries — much faster than loading all images
					const summaries = await loadImageCategorySummaries();
					if (!isMounted) return;
					setCategorySummaries(summaries);
				}
			} catch (err) {
				if (!isMounted) return;
				setError(err instanceof Error ? err.message : 'Failed to load images');
			} finally {
				if (!isMounted) return;
				setLoading(false);
			}
		};

		loadData();
		return () => {
			isMounted = false;
		};
	}, [searchQuery, isSearching]);

	// Reset selected category when data changes
	useEffect(() => {
		setSelectedCategory('all');
	}, [categorySummaries, searchCategories]);

	// Determine what to display based on search state
	const displayItems = isSearching
		? searchCategories
				.map((cat) => ({
					...cat,
					images: cat.images.filter((img) => img.src)
				}))
				.filter((cat) => cat.images.length > 0)
				.map(
					(cat) =>
						({
							categoryId: cat.categoryId,
							categoryName: cat.categoryName,
							categorySlug:
								cat.categorySlug ||
								cat.categoryId.toLowerCase().replace(/\s+/g, '-'),
							imageCount: cat.images.length,
							thumbnailSrc: (
								cat.images.find((img) => img.priority === 1) || cat.images[0]
							).src,
							thumbnailTitle: (
								cat.images.find((img) => img.priority === 1) || cat.images[0]
							).title
						}) as ImageCategorySummary
				)
		: categorySummaries;

	const filteredItems =
		selectedCategory === 'all'
			? displayItems
			: displayItems.filter((item) => item.categoryId === selectedCategory);

	if (loading || searching) {
		return (
			<div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4'>
				{Array.from({ length: 8 }).map((_, i) => (
					<VideoSkeleton key={i} />
				))}
			</div>
		);
	}

	if (error) {
		return <ErrorState message={error} />;
	}

	if (displayItems.length === 0) {
		return (
			<ErrorState
				message={
					searchQuery
						? `No image categories found for "${searchQuery}"`
						: 'No image categories found'
				}
			/>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header with Title and Filter */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<h2 className='font-cinzel text-foreground text-2xl font-bold'>
					Images
				</h2>

				<select
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
					className='border-border bg-card text-foreground focus:border-primary focus:ring-primary w-full cursor-pointer rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:ring-1 focus:outline-none sm:w-64'
					aria-label='Filter by category'
				>
					<option value='all'>All Categories</option>
					{displayItems.map((item) => (
						<option key={item.categoryId} value={item.categoryId}>
							{item.categoryName}
						</option>
					))}
				</select>
			</div>

			<div className='grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3'>
				{filteredItems.map((item, index) => (
					<CategoryCard
						key={item.categoryId}
						category={item}
						searchQuery={searchQuery}
						priority={index < 2}
					/>
				))}
			</div>
		</div>
	);
}
