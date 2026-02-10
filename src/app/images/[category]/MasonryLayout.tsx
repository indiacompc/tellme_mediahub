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
	limit
}: {
	images: Array<ImageListing>;
	categorySlug: string;
	pageNumber: number;
	totalPages: number;
	limit: number;
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [allImages, setAllImages] = useState(images);
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
				limit
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
		searchParams
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
											width={item.width}
											height={item.height}
											alt={item.title}
											className='h-full w-full rounded-lg object-cover shadow-lg transition-shadow duration-300 group-hover:shadow-xl dark:shadow-gray-900/50 dark:group-hover:shadow-gray-800/60'
											style={{
												aspectRatio: `${item.width} / ${item.height}`
											}}
											sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
											loading='lazy'
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
								className='rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
							>
								{loading ? 'Loading...' : 'View More'}
							</button>
						</div>
					)}
					{!hasMore && allImages.length > 0 && (
						<div className='col-span-full flex items-center justify-center p-4'>
							<span className='text-gray-500'>No more images</span>
						</div>
					)}
				</Fragment>
			)}
		</Fragment>
	);
};

export default MasonryLayout;
