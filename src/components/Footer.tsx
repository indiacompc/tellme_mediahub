import Link from 'next/link';
import {
	FaFacebookF,
	FaInstagram,
	FaLinkedin,
	FaPinterest,
	FaYoutube
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
	return (
		<footer className='w-full bg-gray-800 text-gray-300'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Main Footer Content */}
				<div className='py-4 sm:py-6 lg:py-8'>
					<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10'>
						{/* About The Company */}
						<section className='space-y-4'>
							<h2 className='text-lg font-semibold font-quicksand sm:text-xl'>
								About The Company
							</h2>
							<ul className='space-y-2 text-sm sm:text-base'>
								<li>TELLME DIGIINFOTECH PVT LTD</li>
								<li>tellmemediahub.com</li>
								<li>CIN: U72900PN2016PTC217592</li>
							</ul>
						</section>

						{/* Find Us */}
						<section className='space-y-4'>
							<h2 className='text-lg font-semibold font-quicksand sm:text-xl'>Find Us</h2>
							<address className='space-y-2 text-sm not-italic sm:text-base'>
								<p>Office No. 228, B Wing,</p>
								<p>Akshay Complex, Dhole Patil Road,</p>
								<p>Pune - 411001,</p>
								<p>Maharashtra, India</p>
							</address>
						</section>

						{/* Location Map */}
						<section className='space-y-4'>
							<h2 className='text-lg font-semibold font-quicksand sm:text-xl'>Location Map</h2>
							<div className='w-full overflow-hidden rounded-lg'>
								<iframe
									src='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3782.819044800587!2d73.8704232!3d18.5370777!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1df117160bd%3A0xb4d52baabbd93eed!2sTellme%20Digiinfotech%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1722407994735!5m2!1sen!2sin'
									width='100%'
									height='200'
									style={{ border: 0 }}
									allowFullScreen={true}
									loading='lazy'
									referrerPolicy='no-referrer-when-downgrade'
									className='w-full'
								></iframe>
							</div>
						</section>

						{/* Connect With Us */}
						<section className='space-y-4'>
							<h2 className='text-lg font-semibold font-quicksand sm:text-xl'>
								Connect With Us
							</h2>
							<div className='space-y-4'>
								<ul className='flex items-center justify-start gap-3 sm:gap-4'>
									<li>
										<Link
											target='_blank'
											href='https://www.facebook.com/Tellme360/'
											title='Tellme Digiinfotech Facebook'
											className='transition-colors hover:text-white'
										>
											<FaFacebookF size={20} />
										</Link>
									</li>
									<li>
										<Link
											target='_blank'
											href='https://x.com/TeamIndiacom'
											title='Tellme Digiinfotech Twitter'
											className='transition-colors hover:text-white'
										>
											<FaXTwitter size={20} />
										</Link>
									</li>
									<li>
										<Link
											target='_blank'
											href='https://www.instagram.com/tellme360/'
											title='Tellme Digiinfotech Instagram'
											className='transition-colors hover:text-white'
										>
											<FaInstagram size={20} />
										</Link>
									</li>
									<li>
										<Link
											target='_blank'
											href='https://www.youtube.com/channel/UCtp_qdzendr0tf5_tpR9vPg'
											title='Tellme Digiinfotech YouTube Channel'
											className='transition-colors hover:text-white'
										>
											<FaYoutube size={20} />
										</Link>
									</li>
									<li>
										<Link
											target='_blank'
											href='https://www.linkedin.com/company/tellme-digiinfotech-private-limited/'
											title='Tellme Digiinfotech LinkedIn Page'
											className='transition-colors hover:text-white'
										>
											<FaLinkedin size={20} />
										</Link>
									</li>
									<li>
										<Link
											target='_blank'
											href='https://www.pinterest.co.uk/Tellme360/'
											title='Tellme Digiinfotech Pinterest Page'
											className='transition-colors hover:text-white'
										>
											<FaPinterest size={20} />
										</Link>
									</li>
								</ul>
								<ul className='space-y-2 text-sm sm:text-base'>
									<li>
										<a
											href='tel:+917030238122'
											className='transition-colors hover:text-white'
										>
											+91 703 023 8122
										</a>
									</li>
									<li>
										<a
											href='mailto:tellmedigi@outlook.com'
											className='transition-colors hover:text-white'
										>
											tellmedigi@outlook.com
										</a>
									</li>
								</ul>
							</div>
						</section>
					</div>
				</div>

				{/* Footer Bottom */}
				<div className='border-t border-gray-700 py-6'>
					<div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
						<p className='text-center text-sm sm:text-left'>
							© 2024-25&nbsp;
							<Link
								href='/'
								className='transition-colors hover:text-white hover:underline'
							>
								Tellme Digiinfotech Pvt. Ltd.
							</Link>
							&nbsp;All Rights Reserved.
						</p>
						<ul className='flex flex-wrap items-center justify-center gap-4 text-sm sm:gap-6'>
							<li>
								<Link
									href='/about-us'
									className='transition-colors hover:text-white hover:underline'
								>
									About
								</Link>
							</li>
							<li>
								<Link
									href='/contact'
									className='transition-colors hover:text-white hover:underline'
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									href='/terms-and-conditions'
									className='transition-colors hover:text-white hover:underline'
								>
									Terms &amp; Conditions
								</Link>
							</li>
							<li>
								<Link
									href='/privacy-policy'
									className='transition-colors hover:text-white hover:underline'
								>
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
