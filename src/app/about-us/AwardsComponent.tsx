'use client';
import {
	Carousel,
	CarouselContent,
	CarouselItem
} from '@/shadcn_data/components/ui/carousel';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger
} from '@/shadcn_data/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Image from 'next/image';
import { useState } from 'react';

const AwardsComponentSection = ({ awards }: { awards: Array<string> }) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	return (
		<section className='px-2 pt-10 pb-20'>
			<p className='font-cinzel flex justify-center pb-20 text-2xl font-semibold uppercase'>
				Awards & Accomplishments
			</p>

			<Carousel className='w-full overflow-hidden'>
				<CarouselContent>
					{awards.map((award, index) => (
						<CarouselItem
							key={index}
							className='basis-full px-2 md:basis-1/2 xl:basis-1/3'
						>
							<Dialog>
								<DialogTrigger asChild>
									<div
										className='flex h-75 cursor-pointer items-center justify-center rounded-xl bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-105'
										onClick={() => setSelectedImage(award)}
									>
										<Image
											src={award}
											alt={`Award ${index + 1}`}
											className='h-full w-auto rounded-lg object-contain'
											width={0}
											height={0}
											sizes='100vw'
										/>
									</div>
								</DialogTrigger>
								<DialogContent className='max-h-[90vh] w-full max-w-[90vw] overflow-auto p-0'>
									<VisuallyHidden>
										<DialogTitle>Award Image Preview</DialogTitle>
									</VisuallyHidden>
									{selectedImage && (
										<Image
											src={selectedImage}
											alt='Full Award'
											width={1200}
											height={800}
											className='h-auto w-full object-contain'
										/>
									)}
								</DialogContent>
							</Dialog>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</section>
	);
};

export default AwardsComponentSection;
