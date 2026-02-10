'use client';

import { loadImagesFromJSON, searchImagesInDatabase } from '@/lib/actions';
import type { ImageCategory } from '@/types/image';
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
	const [categories, setCategories] = useState<ImageCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	useEffect(() => {
		const loadImages = async () => {
			try {
				setLoading(true);
				setError(null);

				if (searchQuery && searchQuery.trim().length > 0) {
					const searchResults = await searchImagesInDatabase(searchQuery);
					setCategories(searchResults);
				} else {
					const imageCategories = await loadImagesFromJSON();
					setCategories(imageCategories);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load images');
			} finally {
				setLoading(false);
			}
		};

		loadImages();
	}, [searchQuery]);

	// Reset selected category when categories change (e.g. searching)
	useEffect(() => {
		setSelectedCategory('all');
	}, [categories]);

	const validCategories = categories
		.map((cat) => ({
			...cat,
			images: cat.images.filter((img) => img.src)
		}))
		.filter((cat) => cat.images.length > 0);

	const displayedCategories =
		selectedCategory === 'all'
			? validCategories
			: validCategories.filter((cat) => cat.categoryId === selectedCategory);

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

	if (validCategories.length === 0) {
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
			{/* Category Dropdown Filter */}
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
					{validCategories.map((category) => (
						<option key={category.categoryId} value={category.categoryId}>
							{category.categoryName}
						</option>
					))}
				</select>
			</div>

			<div className='grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3'>
				{displayedCategories.map((category) => (
					<CategoryCard key={category.categoryId} category={category} />
				))}
			</div>
		</div>
	);
}
