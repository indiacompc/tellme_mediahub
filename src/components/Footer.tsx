'use client';
import SiGooglemybusiness from '@/assets/icons/SiGooglemybusiness';
import logo from '@/assets/images/tellme_logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
// import { SiGooglemybusiness } from 'react-icons/si';
import { FaXTwitter } from 'react-icons/fa6';
import { ImFacebook2 } from 'react-icons/im';

// This site is best viewed at a resolution of 1920x1080 pixels and 100% to 125% scale for optimal experience.

const Footer = () => {
	return (
		<footer
			role='contentinfo'
			className='w-full bg-[#121212] py-5 text-[#AF7423]'
		>
			<div className='container mx-auto px-10'>
				<div className='grid gap-12 sm:grid-cols-2 lg:grid-cols-4'>
					{/* Column 1: Logo and Company Info */}
					<div className='flex flex-col items-start space-y-4'>
						<div className='logo'>
							<Image
								src={logo}
								alt='tellme logo'
								className='h-auto rounded-2xl'
								height={60}
								priority={true}
							/>
						</div>
						<p className='mt-2 text-white'>
							Delivering Immersive Experiences and delighting consumers and
							empowering enterprises.
						</p>
						<p className='mt-auto pt-4 text-white'>
							&copy; Copyright 2025. Tellme Digiinfotech Pvt. Ltd.
						</p>
					</div>

					{/* Column 2: Quick Links */}
					<div className='flex flex-col items-center space-y-4 sm:items-start xl:ml-16 2xl:ml-32'>
						<h2 className='font-cinzel pb-3 text-2xl'>Quick Links</h2>
						<ul className='flex w-full flex-col items-center gap-3 font-light uppercase sm:items-start'>
							<li>
								<Link href='/' className='transition-colors hover:text-white'>
									Home
								</Link>
							</li>
							<li>
								<Link
									href='/about-us/'
									className='transition-colors hover:text-white'
								>
									About
								</Link>
							</li>
							{/* <li>
								<Link href="#" className="hover:text-white transition-colors">
									Services
								</Link>
							</li> */}
							{/* <li>
								<Link href="#" className="hover:text-white transition-colors">
									Blogs
								</Link>
							</li> */}
							<li>
								<Link
									href='/filter=photos/'
									className='transition-colors hover:text-white'
								>
									Photos
								</Link>
							</li>
							<li>
								<Link
									href='/?filter=videos/'
									className='transition-colors hover:text-white'
								>
									Videos
								</Link>
							</li>
							{/* <li>
								<Link
									href='/india/vr/'
									className='transition-colors hover:text-white'
								>
									VR 360°
								</Link>
							</li> */}
							<li>
								<Link
									href='/contact/'
									className='transition-colors hover:text-white'
								>
									Contact Us
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3: Licence */}
					<div className='flex flex-col items-center space-y-4 sm:items-start xl:ml-10 2xl:ml-20'>
						<h2 className='font-cinzel pb-3 text-2xl'></h2>
						<ul className='flex w-full flex-col items-center gap-3 font-light uppercase sm:items-start'>
							<li>
								<Link
									href='/privacy-policy'
									className='transition-colors hover:text-white'
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href='/terms-and-conditions/'
									className='transition-colors hover:text-white'
								>
									Terms of Service
								</Link>
							</li>
							{/* <li>
								<Link href="#" className="hover:text-white transition-colors">
									Cookie Policy
								</Link>
							</li> */}
							{/* <li>
								<Link
									href='/cancellation-refund-policy'
									className='transition-colors hover:text-white'
								>
									Refund Policy
								</Link>
							</li> */}
						</ul>
					</div>

					{/* Column 4: Follow Us and Contact */}
					<div className='flex flex-col items-center space-y-4 sm:items-start'>
						<h2 className='font-cinzel pb-3 text-2xl uppercase'>
							Follow us now
						</h2>
						<div className='flex justify-center gap-5 pb-5 sm:justify-start'>
							<Link
								href='https://www.instagram.com/tellme360/'
								aria-label='Instagram'
								title='Instagram'
								target='_blank'
								rel='noopener noreferrer'
							>
								<FaInstagram className='text-2xl transition-colors hover:text-white' />
							</Link>
							<Link
								href='https://www.facebook.com/Tellme360'
								aria-label='Facebook'
								title='Facebook'
								target='_blank'
								rel='noopener noreferrer'
							>
								<ImFacebook2 className='text-2xl transition-colors hover:text-white' />
							</Link>
							<Link
								href='https://www.youtube.com/@Tellme360'
								aria-label='YouTube'
								title='YouTube'
								target='_blank'
								rel='noopener noreferrer'
							>
								<FaYoutube className='text-2xl transition-colors hover:text-white' />
							</Link>
							<Link
								href='https://x.com/tellme_360'
								aria-label='Twitter'
								title='Twitter'
								target='_blank'
								rel='noopener noreferrer'
							>
								<FaXTwitter className='text-2xl transition-colors hover:text-white' />
							</Link>
							<Link
								href='https://in.pinterest.com/Tellme360/'
								aria-label='Pinterest'
								title='Pinterest'
								target='_blank'
								rel='noopener noreferrer'
							>
								<FaPinterest className='text-2xl transition-colors hover:text-white' />
							</Link>
							<Link
								href='https://www.google.com/search?q=tellme+digiinfotech+private+limited'
								aria-label='GMB'
								title='GMB'
								target='_blank'
								rel='noopener noreferrer'
							>
								<SiGooglemybusiness className='text-2xl transition-colors hover:text-white' />
							</Link>
						</div>

						{/* <h3 className="font-cinzel text-2xl pt-2">Contact Us</h3> */}
						<div className='flex w-full flex-col items-center gap-2 font-light sm:items-start'>
							<div className='text-center sm:text-left'>
								<p className='font-medium'>Registered & Corporate office:</p>
								<p>
									No. 218, B Wing, Akshay Complex, Dhole Patil Road, Pune -
									411001&nbsp;
								</p>
							</div>
							<div className='text-center sm:text-left'>
								<p>CIN: U72900PN2016PTC217592</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
