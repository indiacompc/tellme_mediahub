'use client';

import { Button } from '@/shadcn_data/components/ui/button';
import type { ImageListing } from '@/types/image';
import {
	Calendar,
	Image as ImageIcon,
	MapPin,
	Navigation2,
	Ruler,
	Tag
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface ImageDetailsFullProps {
	image: ImageListing;
}

export default function ImageDetailsFull({ image }: ImageDetailsFullProps) {
	const [showFullDescription, setShowFullDescription] = useState(false);

	const capturedDate = useMemo(() => {
		if (!image.captured_date) return null;
		try {
			const formatter = new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				timeZone: 'UTC'
			});
			return formatter.format(new Date(image.captured_date));
		} catch {
			return image.captured_date;
		}
	}, [image.captured_date]);

	const createdDate = useMemo(() => {
		if (!image.created_at) return null;
		try {
			const formatter = new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				timeZone: 'UTC'
			});
			return formatter.format(new Date(image.created_at));
		} catch {
			return image.created_at;
		}
	}, [image.created_at]);

	// Truncate description to first 300 characters
	const truncatedDescription = image.description
		? image.description.substring(0, 300)
		: '';
	const hasMoreContent = image.description && image.description.length > 300;

	// Build location string
	const locationParts = [];
	if (image.captured_location) locationParts.push(image.captured_location);
	if (image.city) locationParts.push(image.city);
	if (image.state) locationParts.push(image.state);
	const fullLocation = locationParts.join(', ');

	return (
		<div className='flex flex-col gap-6 sm:gap-8 lg:flex-row lg:gap-10 xl:gap-12'>
			{/* Main Content */}
			<main className='w-full lg:w-2/3 xl:w-[65%] 2xl:w-[70%]'>
				{/* Image Title */}
				<div className='mb-4 sm:mb-6'>
					<h1 className='text-foreground font-cinzel mb-2 text-2xl font-semibold sm:mb-3 sm:text-2xl lg:text-3xl xl:text-4xl'>
						{image.title}
					</h1>
					{image.image_category_id && (
						<p className='text-muted-foreground text-sm capitalize sm:text-base'>
							{image.image_category_id}
						</p>
					)}
				</div>

				{/* Image Description with View More/Less */}
				{image.description && (
					<div className='mb-6 sm:mb-8 lg:mb-10'>
						<h2 className='font-quicksand mb-3 text-lg font-semibold sm:mb-4 sm:text-xl lg:text-2xl'>
							Description
						</h2>
						<div className='text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap sm:text-base'>
							{showFullDescription ? (
								<div>
									<div>{image.description}</div>
									<button
										onClick={() => setShowFullDescription(false)}
										className='text-primary mt-2 ml-1 inline-block font-semibold hover:underline'
									>
										View less
									</button>
								</div>
							) : (
								<div>
									{truncatedDescription}
									{hasMoreContent && (
										<button
											onClick={() => setShowFullDescription(true)}
											className='text-primary ml-1 font-semibold hover:underline'
										>
											View more
										</button>
									)}
								</div>
							)}
						</div>
					</div>
				)}

				{/* Purchase Button */}
				<div className='mb-6 sm:mb-8 lg:mb-10'>
					<Link
						href={`/contact?subject=${encodeURIComponent(`Purchase request for image: ${image.title}`)}`}
					>
						<Button
							size='lg'
							className='px-6 py-5 text-base font-semibold sm:px-8 sm:py-6 sm:text-lg lg:px-10 lg:py-7 lg:text-xl'
						>
							Purchase Image
						</Button>
					</Link>
				</div>

				{/* Image Info */}
				<div className='border-t pt-6 sm:pt-8'>
					<div className='grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 sm:gap-6 sm:text-base'>
						{fullLocation && (
							<div className='flex items-start gap-2'>
								<MapPin className='text-muted-foreground mt-1 h-4 w-4 shrink-0' />
								<div>
									<span className='text-muted-foreground'>Location:</span>
									<span className='text-foreground ml-2'>{fullLocation}</span>
								</div>
							</div>
						)}
						{capturedDate && (
							<div className='flex items-start gap-2'>
								<Calendar className='text-muted-foreground mt-1 h-4 w-4 shrink-0' />
								<div>
									<span className='text-muted-foreground'>Captured:</span>
									<span className='text-foreground ml-2'>{capturedDate}</span>
								</div>
							</div>
						)}
						{image.image_category_id && (
							<div className='flex items-start gap-2'>
								<Tag className='text-muted-foreground mt-1 h-4 w-4 shrink-0' />
								<div>
									<span className='text-muted-foreground'>Category:</span>
									<span className='text-foreground ml-2 capitalize'>
										{image.image_category_id}
									</span>
								</div>
							</div>
						)}
						{image.width && image.height && (
							<div>
								<span className='text-muted-foreground'>Dimensions:</span>
								<span className='text-foreground ml-2'>
									{image.width} × {image.height} px
								</span>
							</div>
						)}
					</div>
				</div>
			</main>

			{/* Sidebar */}
			<aside className='w-full lg:w-1/3 xl:w-[35%] 2xl:w-[30%]'>
				<div className='bg-card border-border rounded-lg border p-4 sm:p-6 lg:p-8'>
					<h3 className='font-quicksand mb-4 text-lg font-semibold sm:mb-6 sm:text-xl lg:text-2xl'>
						Image Details
					</h3>
					<div className='space-y-3 text-sm sm:space-y-4 sm:text-base'>
						{image.image_category_id && (
							<div className='flex items-start gap-2'>
								<Tag className='text-muted-foreground mt-1 h-4 w-4 shrink-0' />
								<div className='flex-1'>
									<span className='text-muted-foreground mb-1 block sm:mb-2'>
										Category
									</span>
									<span className='text-foreground font-medium capitalize'>
										{image.image_category_id}
									</span>
								</div>
							</div>
						)}
						{image.latitude &&
							image.longitude &&
							image.latitude !== 0 &&
							image.longitude !== 0 && (
								<div className='flex items-start gap-2'>
									<Navigation2 className='text-muted-foreground mt-1 h-4 w-4 shrink-0' />
									<div className='flex-1'>
										<span className='text-muted-foreground mb-1 block sm:mb-2'>
											Coordinates
										</span>
										<div className='text-foreground space-y-1'>
											<div>
												<span className='text-muted-foreground text-xs'>
													Latitude:
												</span>{' '}
												<span className='font-medium'>{image.latitude}</span>
											</div>
											<div>
												<span className='text-muted-foreground text-xs'>
													Longitude:
												</span>{' '}
												<span className='font-medium'>{image.longitude}</span>
											</div>
										</div>
									</div>
								</div>
							)}
						{image.width && image.height && (
							<div className='flex items-start gap-2'>
								<Ruler className='text-muted-foreground mt-1 h-4 w-4 shrink-0' />
								<div className='flex-1'>
									<span className='text-muted-foreground mb-1 block sm:mb-2'>
										Dimensions
									</span>
									<span className='text-foreground'>
										{image.width} × {image.height} pixels
									</span>
								</div>
							</div>
						)}
						{image.id && (
							<div className='flex items-start gap-2'>
								<ImageIcon className='text-muted-foreground mt-1 h-4 w-4 shrink-0' />
								<div className='flex-1'>
									<span className='text-muted-foreground mb-1 block sm:mb-2'>
										Image ID
									</span>
									<span className='text-foreground font-mono text-xs'>
										{image.id}
									</span>
								</div>
							</div>
						)}
						{createdDate && (
							<div className='flex items-start gap-2'>
								<Calendar className='text-muted-foreground mt-1 h-4 w-4 shrink-0' />
								<div className='flex-1'>
									<span className='text-muted-foreground mb-1 block sm:mb-2'>
										Added
									</span>
									<span className='text-foreground'>{createdDate}</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</aside>
		</div>
	);
}
