'use client';
import ImageWithLoading from '@/components/ImageWithLoading';
import {
	getProtectedImageUrl,
	isFirebaseStorageUrl
} from '@/lib/imageProtection';
import { getNextPageImageListingsData } from '@/lib/utilsServerFunction';
import type { ImageListing } from '@/types/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useCallback, useEffect, useState } from 'react';

const MasonryLayout = ({
	images,
	categorySlug,
	pageNumber,
	totalPages,
	limit,
	searchQuery
}: {
	images: Array<ImageListing>;
	categorySlug: string;
	pageNumber: number;
	totalPages: number;
	limit: number;
	searchQuery?: string;
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const stateFilter = searchParams.get('state') || undefined;
	const cityFilter = searchParams.get('city') || undefined;
	const isSearchMode = !!searchQuery?.trim();
	const [allImages, setAllImages] = useState<ImageListing[]>(images);
	const [currentPage, setCurrentPage] = useState(pageNumber);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(currentPage < totalPages);

	// Update images when pageNumber changes
	useEffect(() => {
		setAllImages(images);
		setCurrentPage(pageNumber);
		setHasMore(pageNumber < totalPages);
	}, [images, pageNumber, totalPages]);

	const loadMore = useCallback(async () => {
		if (loading || !hasMore) return;

		setLoading(true);
		const nextPage = currentPage + 1;
		try {
			const newImages = await getNextPageImageListingsData(
				categorySlug,
				nextPage,
				limit,
				stateFilter,
				cityFilter
			);
			if (newImages.length > 0) {
				setAllImages((prev) => [...prev, ...newImages]);
				setCurrentPage(nextPage);
				setHasMore(nextPage < totalPages);

				// Update URL with page parameter
				const params = new URLSearchParams(searchParams.toString());
				params.set('page', nextPage.toString());
				router.push(`/images?${params.toString()}`, { scroll: false });
			} else {
				setHasMore(false);
			}
		} catch (error) {
			console.error('Error loading more images:', error);
			setHasMore(false);
		} finally {
			setLoading(false);
		}
	}, [
		currentPage,
		totalPages,
		categorySlug,
		loading,
		limit,
		hasMore,
		router,
		searchParams,
		stateFilter,
		cityFilter
	]);

	return (
		<Fragment>
			{allImages.length === 0 ? (
				<div className='flex min-h-[75dvh] w-full items-center justify-center'>
					<p>No Data Found Please Try Later</p>
				</div>
			) : (
				<Fragment>
					<div className='grid auto-rows-min grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
						{allImages.map((item) => {
							const isLandscape = item.width > item.height;
							const multiplier = isLandscape ? 10 : 9;
							const rowSpan = Math.ceil(
								(item.height / item.width) * multiplier
							);

							return (
								<div
									key={item.id}
									style={{
										gridRowEnd: `span ${rowSpan}`
									}}
								>
									<div className='group relative h-full w-full'>
								<ImageWithLoading
									src={
										isFirebaseStorageUrl(item.src)
											? getProtectedImageUrl(item.src)
											: item.src
									}
									width={Math.min(item.width, 800)}
									height={Math.min(item.height, 1200)}
									alt={(item as any).meta_title || item.title}
									className='h-full w-full rounded-lg object-cover shadow-lg transition-shadow duration-300 group-hover:shadow-xl dark:shadow-gray-900/50 dark:group-hover:shadow-gray-800/60'
									style={{
										aspectRatio: `${item.width} / ${item.height}`
									}}
									sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
									priority={item.priority === 1 && !isSearchMode}
									loading={item.priority === 1 && !isSearchMode ? 'eager' : 'lazy'}
									fetchPriority={item.priority === 1 && !isSearchMode ? 'high' : 'auto'}
									quality={72}
								/>
										<div className='absolute right-0 bottom-0 left-0 z-20 hidden rounded-b-lg bg-black/75 py-2 text-white group-hover:block'>
											<div className='flex w-full px-2'>
												<p>{item.title}</p>
											</div>
											<div className='flex w-full px-2'>
												<p className='w-full overflow-hidden text-sm font-light text-ellipsis whitespace-nowrap'>
													{item.captured_location &&
														item.captured_location.concat(', ')}
													{item.city && `${item.city}, `}
													{item.state}
												</p>
											</div>
										</div>
										<Link
											className='absolute inset-0'
											href={`/images/detail/${item.slug}${categorySlug ? `?filter=${categorySlug}` : ''}`}
											prefetch={false}
										/>
									</div>
								</div>
							);
						})}
					</div>

					{/* View More Button */}
					{hasMore && (
						<div className='col-span-full flex items-center justify-center p-4'>
							<button
								onClick={loadMore}
								disabled={loading}
								className='bg-primary text-primary-foreground hover:bg-primary/80 rounded-md px-6 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50'
							>
								{loading ? 'Loading...' : 'View More'}
							</button>
						</div>
					)}
					{!hasMore && allImages.length > 0 && (
						<div className='col-span-full flex items-center justify-center p-4'>
							<span className='text-muted-foreground'>No more images</span>
						</div>
					)}
				</Fragment>
			)}
		</Fragment>
	);
};

export default MasonryLayout;
