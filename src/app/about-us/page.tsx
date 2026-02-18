import incredibleIndia from '@/assets/images/clients/incredible_india.png';
import jandk from '@/assets/images/clients/jandk.jpg';
import nfdc from '@/assets/images/clients/nfdc.png';
import { siteUrl } from '@/auth/ConfigManager';
// import HeadingWithBreadCrumbs from '@/components/HeadingWithBreadCrumbs';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BiTargetLock } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import { LuUserRound } from 'react-icons/lu';
import { MdDraw, MdOutlineShoppingCart } from 'react-icons/md';
import type { AboutPage, WithContext } from 'schema-dts';
import AwardsComponentSection from './AwardsComponent';

export const metadata: Metadata = {
	title: 'About Us | Tellme Digiinfotech Pvt. Ltd.',
	description:
		"Discover Tellme Digiinfotech's journey from pioneering business listings to creating immersive VR experiences, digital content, and innovative data solutions.",
	keywords:
		'About Tellme Digiinfotech, company profile, VR experiences, business listings, digital solutions, immersive content, India tech company',
	openGraph: {
		title: 'About Us | Tellme Digiinfotech Pvt. Ltd.',
		description:
			"Learn about Tellme Digiinfotech's legacy in digital innovation, immersive VR storytelling, and empowering businesses with data-driven solutions.",
		url: '/about-us',
		siteName: 'Tellme Digiinfotech Pvt. Ltd.',
		locale: 'en_US',
		type: 'website'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'About Us | Tellme Digiinfotech Pvt. Ltd.',
		description:
			"Discover Tellme Digiinfotech's vision, journey, and expertise in VR, digital media, and business data solutions."
	}
};

const AboutUsPage = () => {
	const teamdirector = [
		{
			name: 'Sir. Natalino Duo',
			role: 'CO-PROMOTER',
			image: '/images/directors/natalino-duo.png',
			description:
				'Former CEO of Perfetti ValMelli India, Benneton India and Seat Spa, Italy. Honoured with Knighthood by the President of Italy'
		},
		{
			name: 'Dr. Madan Mohan Rao',
			role: 'Director',
			image: '/images/directors/Directores-Image-1.png',
			description:
				"Research Director, Charter Member of TiE, BIG APC's Innovation Officer. Ex-Communication Director UN. Digital geek from IIT Mumbai and doctorate from MIT."
		},
		{
			name: 'Dr. Sanjivv Gandhi',
			role: 'Director',
			image: '/images/directors/Directores-Image-3.png',
			description:
				'Expertise in Finance & Management. Serving as a Corporate Consultant in various Boards and companies.'
		},
		{
			name: 'V. Srinivasa Rao',
			role: 'Co-Promoter & CEO',
			image: '/images/directors/mr.-rao-photo.png',
			description:
				'Fellow Member, Institute of Company Secretaries of India - corporate governance & management specialist. Driving experiential digital media and Location Intelligence platforms, harnessing VR/AR and AI-powered solutions to transform travel, tourism, business learning, and community engagement.'
		}
	];

	const advisors = [
		{
			name: 'Mr. Rahul Kulkarni',
			image: '/images/directors/rahul-kulkarni.png',
			description:
				'Google first product manager in India - Google Maps. Holds 9 patents. Currently co-founder and partner at DoNew, a social startup. Core strength: product innovation.'
		},
		{
			name: 'Mr. Ashay Agrawal',
			image: '/images/directors/rahul-agrawal.png',
			description:
				'An IIT grad passionate about Big Data and its deployment. Seasoned product manager with a strong entrepreneurial background.'
		},
		{
			name: 'Mrs. Saswati dev Galli',
			image: '/images/directors/saswati-dev.png',
			description:
				'Domain expertise in the hospitality industry and dealing with international buying houses retailers across the globe'
		}
	];

	const features = [
		{
			icon: <LuUserRound className='pb-4 text-[65px]' />,
			title: 'Curated by our experts',
			description:
				'Suspendisse tempus rhoncus enim pellentesque est vehicula vitae eget.'
		},
		{
			icon: <MdDraw className='pb-4 text-[65px]' />,
			title: 'Creative',
			description:
				'Suspendisse tempus rhoncus enim pellentesque est vehicula vitae eget.'
		},
		{
			icon: <BiTargetLock className='pb-4 text-[65px]' />,
			title: 'Dedicated',
			description:
				'Suspendisse tempus rhoncus enim pellentesque est vehicula vitae eget.'
		},
		{
			icon: <MdOutlineShoppingCart className='pb-4 text-[65px]' />,
			title: 'One cart shopping',
			description:
				'Suspendisse tempus rhoncus enim pellentesque est vehicula vitae eget.'
		}
	];

	const awards = [
		'/images/awards/Certificate_SBI_Hackathon.jpg',
		'/images/awards/awards-post.png',
		'/images/awards/Drone_Tellme_Newspaper-1.jpg',
		'/images/awards/1-1.png',
		'/images/awards/2-2.png',
		'/images/awards/3-2.png',
		'/images/awards/4.png',
		'/images/awards/Events-scaled-pypm4fspnlntp99dtaxmd136441pjozm4sngiewjvy.jpg'
	];

	const aboutPageJsonLd: WithContext<AboutPage> = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		url: `${siteUrl}/about-us`,
		name: 'About Us | Tellme Digiinfotech Pvt. Ltd.',
		description:
			"Discover Tellme Digiinfotech's journey from pioneering business listings to creating immersive VR experiences, digital content, and innovative data solutions.",
		keywords:
			'About Tellme Digiinfotech, company profile, VR experiences, business listings, digital solutions, immersive content, India tech company',
		about: {
			'@id': 'organization_schema' // Reference to your main Organization schema
		},
		mainEntity: {
			'@id': 'organization_schema' // Indicates the main entity of the page is the organization
		},
		inLanguage: 'en',
		publisher: {
			'@id': 'organization_schema'
		}
	};

	return (
		<main className='m-5 max-w-full px-4'>
			{/* Back Button */}
			<div className='pt-4 pb-4 sm:pt-4'>
				<Link
					href='/'
					className='text-muted-foreground hover:text-primary group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:gap-3 sm:text-base'
				>
					<FaArrowLeft className='h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1' />
					Back to Home
				</Link>
			</div>

			{/* <section id='about-us-slider' className='pt-2'>
				<AboutUsSlider />
			</section> */}

			<section className='font-poppins container mx-auto flex w-full flex-col items-center justify-center space-y-8 px-4 py-12 text-justify text-xl leading-relaxed font-light sm:leading-10'>
				<p>
					At TellMe, we build immersive visual narratives that redefine
					storytelling. Our expertise spans cinematic 360° videos,
					ultra-high-resolution aerial panoramas, and fully interactive VR
					environments. Whether delivered in 2D, 3D, or immersive formats, our
					work goes beyond sight—it evokes a true sense of presence and emotion.
				</p>

				<p>
					By blending Geo-Spatial Intelligence with compelling visuals, we
					create location-based and hyper-local data-driven insights that inform
					strategic decisions for business expansion or customer cluster
					identification. Our solutions have empowered government tourism
					boards, leading hotel chains, hospitals, heritage bodies, and other
					forward-thinking organizations to engage audiences more deeply and
					drive real-world impact.
				</p>

				<p>
					Beyond content creation, we deliver customised solutions for any
					digital media need—from intuitive mobile applications to
					analytics-driven platforms that evolve with your objectives.
				</p>

				<p>
					We introduce VR and AR elements for business, education, and learning
					purposes, crafting immersive experiences that boost engagement,
					enhance training outcomes, and deepen knowledge retention.
				</p>
			</section>

			<section className='grid w-full grid-cols-1 gap-5 px-2 pt-20 text-center sm:grid-cols-2 sm:gap-4 md:grid-cols-4'>
				{features.map((feature, index) => (
					<div
						key={index}
						className='flex w-full flex-col items-center justify-start'
					>
						{feature.icon}
						<h2 className='font-cinzel pb-3 text-2xl font-[520] uppercase'>
							{feature.title}
						</h2>
					</div>
				))}
			</section>

			<section id='our_team_section' className='px-2 pt-28'>
				<p className='font-cinzel flex justify-center pb-20 text-2xl font-semibold uppercase'>
					Promoters and Board
				</p>
				<div className='font-poppins grid w-full grid-cols-1 gap-5 text-center sm:grid-cols-2 sm:gap-4 md:grid-cols-4'>
					{teamdirector.map((member, index) => (
						<div
							key={index}
							className='flex w-full flex-col items-center justify-start'
						>
							<div className='relative mx-auto h-42 w-42 pb-4'>
								<Image
									src={member.image}
									alt={`${member.name} - ${member.role}`}
									width={250}
									height={250}
									className='h-full w-full rounded-full object-cover'
								/>
							</div>
							<h3 className='font-cinzel pb-2 text-xl font-[520] uppercase'>
								{member.name}
							</h3>
							<p className='text-muted-foreground mb-3 text-lg uppercase'>
								{member.role}
							</p>
							<p className='w-5/6 text-justify'>{member.description}</p>
						</div>
					))}
				</div>
			</section>

			<section id='our_advisors_section' className='px-2 pt-28'>
				<p className='font-cinzel flex justify-center pb-20 text-2xl font-semibold uppercase'>
					Board of Advisors & Investors
				</p>
				<div className='font-poppins grid w-full grid-cols-1 gap-5 text-center sm:grid-cols-2 sm:gap-4 md:grid-cols-3'>
					{advisors.map((advisor, index) => (
						<div
							key={index}
							className='flex w-full flex-col items-center justify-start'
						>
							<div className='relative mx-auto h-42 w-42 pb-4'>
								<Image
									src={advisor.image}
									alt={advisor.name}
									width={250}
									height={250}
									className='h-full w-full rounded-full object-cover'
								/>
							</div>
							<h3 className='font-cinzel pb-2 text-xl font-[520] uppercase'>
								{advisor.name}
							</h3>
							<p className='w-5/6 text-justify'>{advisor.description}</p>
						</div>
					))}
				</div>
			</section>

			<section id='empanelled_section' className='px-2 pt-28'>
				<p className='font-cinzel flex justify-center pb-20 text-2xl font-semibold uppercase'>
					Empanelled
				</p>
				<div className='grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-3'>
					<div className='font-poppins bg-card border-border flex flex-col items-center rounded-lg border p-6 shadow-md transition-shadow duration-300 hover:shadow-xl'>
						<Image
							src={nfdc}
							alt='NFDC logo'
							width={100}
							height={100}
							className='mb-4'
						/>
						<h3 className='font-cinzel text-xl font-semibold uppercase'>
							NFDC
						</h3>
						<p className='text-muted-foreground mt-2'>
							Tellme is privileged to be appointed as the official Digital Media
							Agency for multiple productions by the National Film Development
							Corporation Ltd (NFDC), the Government of India’s premier film
							development and promotion body under the Ministry of Information
							and Broadcasting.
						</p>
					</div>

					{/* MPTB */}
					<div className='font-poppins bg-card border-border flex flex-col items-center rounded-lg border p-6 shadow-md transition-shadow duration-300 hover:shadow-xl'>
						<Image
							src={incredibleIndia}
							alt='MPTB logo'
							width={100}
							height={100}
							className='mb-4'
						/>
						<h3 className='font-cinzel text-xl font-semibold uppercase'>
							MPTB
						</h3>
						<p className='text-muted-foreground mt-2'>
							TellMe has been empanelled as photographer and videographer by the
							Madhya Pradesh Tourism Board - Govt. of Madhya Pradesh, capturing
							the essence of MP with unmatched precision and artistry.
						</p>
					</div>

					{/* Kashmir Tourism */}
					<div className='font-poppins bg-card border-border flex flex-col items-center rounded-lg border p-6 shadow-md transition-shadow duration-300 hover:shadow-xl'>
						<Image
							src={jandk}
							alt='Kashmir Tourism logo'
							width={100}
							height={100}
							className='mb-4'
						/>
						<h3 className='font-cinzel text-xl font-semibold uppercase'>
							Kashmir Tourism
						</h3>
						<p className='text-muted-foreground mt-2'>
							TellMe has been empanelled as the Multimedia Agency by Directorate
							of Tourism, Kashmir, for showcasing the beauty of Jammu & Kashmir
							through immersive experiences.
						</p>
					</div>
				</div>
			</section>

			{/* <ClientsMarquee /> */}
			{/* <div className="mt-6">
				<ClientsSection />
			</div> */}

			<AwardsComponentSection awards={awards} />

			<section className='font-poppins mt-10 flex w-full flex-col items-center justify-start pb-20 text-center'>
				<div>
					<h2 className='font-cinzel px-2 pb-4 text-4xl uppercase sm:text-6xl'>
						Contact Us
					</h2>
					<p className='px-3 pb-4 font-light'>
						If you have any projects in mind say hello at&nbsp;
						<a
							href='mailto:tellmedigi@outlook.com'
							className='hover:text-primary underline'
						>
							tellmedigi@outlook.com
						</a>
						&nbsp; or just call us at{' '}
						<b className='font-semibold'>+91 703 023 8122</b>
					</p>
				</div>
				<div className='flex gap-2'>
					<Link
						href='/contact'
						className='bg-primary text-primary-foreground hover:bg-primary/80 items-center rounded-lg px-14 py-5 text-lg font-normal uppercase transition-colors'
					>
						Contact Us
					</Link>
				</div>
			</section>
			<script
				id='aboutPageSchema'
				key='aboutPageSchema'
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(aboutPageJsonLd).replace(/</g, '\\u003c')
				}}
			/>
		</main>
	);
};

export default AboutUsPage;
