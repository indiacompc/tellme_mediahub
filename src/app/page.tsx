import HomeContent from "@/components/home-content"
import VideoBackground from "../components/VideoBackground"
import Navbar from "@/components/Navbar"
import tellme_logo from '@/assets/images/tellme_logo.png'

export default function Home() {
	return (
		<main>
			<div className="relative w-full h-[80dvh] sm:h-125 lg:h-160 xl:h-[180] 2xl:h-[205] overflow-hidden text-white">
				<VideoBackground />
				<div className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-1" />
				<div className="absolute top-0 left-0 right-0 z-20">
					<Navbar tellme_logo={tellme_logo} />
				</div>
				{/* <ThreeSixtyImage className="absolute w-full h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover rounded-xl" imageUrl="/preview2.jpg" /> */}
				<section className="content absolute top-0 left-0 right-0 bottom-0 z-10 flex flex-col justify-center items-start container mx-auto w-full h-auto">
					<h2
						className="#animate-typing #overflow-hidden whitespace-nowrap text-xl sm:text-7xl font-semibold sm:font-normal"
					// style={{
					//   fontFamily: sofiaFont.style.fontFamily,
					// }}
					>
						<span className="text-sm sm:text-5xl">Welcome to&nbsp;</span>
						<br />
						<span>Tellme Media Hub</span>
					</h2>
					<span className="text-sm sm:text-xl py-5 leading-relaxed wrap-break-word max-w-[90%]">
						Accelerate your creative projects with premium 4K stock footage—licensed in hours, not months.
						Choose from thousands of curated clips across travel, heritage, nature, and tourism themes with
						transparent pricing and usage rights.
					</span> 
				</section>
			</div>
			<HomeContent />
		</main>
	)
}
