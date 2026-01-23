'use client';

import HomeContent from "@/components/home-content"
import VideoBackground from "../components/VideoBackground"
import Navbar from "@/components/Navbar"
import tellme_logo from '@/assets/images/tellme_logo.png'
import { motion } from 'motion/react'

export default function Home() {
	const descriptionText = "Accelerate your creative projects with premium 4K stock footage—licensed in hours, not months. Choose from thousands of curated clips across travel, heritage, nature, and tourism themes with transparent pricing and usage rights.";
	const paragraphArray = descriptionText.split(' ');
	return (
		<main>
			<div className="relative w-full h-[80dvh] sm:h-155 lg:h-160 xl:h-170 2xl:h-190 overflow-hidden text-white">
				<VideoBackground />
				<div className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-1" />
				<div className="absolute top-0 left-0 right-0 z-20">
					<Navbar tellme_logo={tellme_logo} />
				</div>
				{/* <ThreeSixtyImage className="absolute w-full h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover rounded-xl" imageUrl="/preview2.jpg" /> */}
				<section className="content absolute top-0 left-0 right-0 bottom-0 z-10 flex flex-col justify-center items-start w-full h-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
					<div className="w-full max-w-7xl mx-auto">
						<h2
							className="font-semibold md:font-normal mb-4"
						>
							<motion.span
								className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{
									duration: 1,
									delay: 0
								}}
							>
								Welcome to&nbsp;
							</motion.span>
							<br />
							<motion.span
								className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{
									duration: 1,
									delay: 0.1
								}}
							>
								Tellme Media Hub
							</motion.span>
						</h2>
						<p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl py-3 sm:py-4 md:py-5 leading-relaxed max-w-full sm:max-w-2xl md:max-w-3xl wrap-break-word hyphens-none whitespace-normal">
							{paragraphArray.map((word, i) => (
								<motion.span
									key={i}
									className="inline"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.01, delay: i / 10 }}
								>
									{word}
									{i < paragraphArray.length - 1 ? ' ' : ''}
								</motion.span>
							))}
						</p> 
					</div>
				</section>
			</div>
			<HomeContent />
		</main>
	)
}
