import HomeContent from "@/components/home-content"
import VideoBackground from "../components/VideoBackground"
import Navbar from "@/components/Navbar"
import tellme_logo from '@/assets/images/tellme_logo.png'

export default function Home() {
	return (
		<main>
			<div className="relative w-full h-[80dvh] sm:h-125 lg:h-130 xl:h-150 2xl:h-190 overflow-hidden text-white">
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
							<span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">Welcome to&nbsp;</span>
							<br />
							<span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">Tellme Media Hub</span>
						</h2>
						<p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl py-3 sm:py-4 md:py-5 leading-relaxed max-w-full sm:max-w-2xl md:max-w-3xl">
							Accelerate your creative projects with premium 4K stock footage—licensed in hours, not months.
							Choose from thousands of curated clips across travel, heritage, nature, and tourism themes with
							transparent pricing and usage rights.
						</p> 
					</div>
				</section>
			</div>
			<HomeContent />
		</main>
	)
}
