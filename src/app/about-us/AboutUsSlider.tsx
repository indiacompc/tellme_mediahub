'use client';

import type { CarouselApi } from '@/shadcn_data/components/ui/carousel';
import {
	Carousel,
	CarouselContent,
	CarouselItem
} from '@/shadcn_data/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface AboutUsSliderProps {
	slides?: string[];
}

export default function AboutUsSlider({
	slides = [
		'/images/about_us_bg/1.png',
		'/images/about_us_bg/2.png',
		'/images/about_us_bg/3.png',
		'/images/about_us_bg/4.png'
	]
}: AboutUsSliderProps) {
	const [api, setApi] = useState<CarouselApi>();
	return (
		<div className='w-full'>
			<Carousel
				className='group relative mx-auto w-full overflow-hidden'
				setApi={setApi}
				opts={{
					align: 'start',
					loop: true
				}}
				plugins={[
					Autoplay({
						delay: 3000,
						stopOnMouseEnter: true,
						stopOnInteraction: false
					})
				]}
			>
				<CarouselContent className='mx-0'>
					{slides.map((src, index) => (
						<CarouselItem key={index} className='w-full px-0'>
							<div className='relative h-25 w-full sm:h-62.5 md:h-75 lg:h-112.5'>
								<Image
									src={src || '/placeholder.svg'}
									alt={`Team Image ${index + 1}`}
									fill
									sizes='100vw'
									className='object-cover'
									priority={index === 0}
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				{/* Hide default arrows and add custom ones */}
				{/* <CarouselPrevious className="left-4 bg-transparent border-0 opacity-0 outline-none group-hover:opacity-100 transition-opacity duration-300" />
        <CarouselNext className="right-4 bg-transparent border-0 opacity-0 outline-none group-hover:opacity-100 transition-opacity duration-300" /> */}
				{api && (
					<>
						<button
							onClick={() => api.scrollPrev()}
							className='absolute top-1/2 left-[0%] z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 disabled:group-hover:opacity-0'
						>
							<IoIosArrowBack className='h-8 w-8' />
						</button>

						<button
							onClick={() => api.scrollNext()}
							className='absolute top-1/2 right-[0%] z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100'
						>
							<IoIosArrowForward className='h-8 w-8' />
						</button>
					</>
				)}
			</Carousel>
		</div>
	);
}
