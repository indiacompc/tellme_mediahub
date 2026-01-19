import {
	FaFacebookF,
	FaInstagram,
	FaYoutube,
	FaLinkedin,
	FaPinterest,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer className="w-full bg-gray-800 text-gray-300">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Main Footer Content */}
				<div className="py-4 sm:py-6 lg:py-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
						{/* About The Company */}
						<section className="space-y-4">
							<h2 className="text-lg sm:text-xl font-semibold">About The Company</h2>
							<ul className="space-y-2 text-sm sm:text-base">
								<li>TELLME DIGIINFOTECH PVT LTD</li>
								<li>tellmemediahub.com</li>
								<li>CIN: U72900PN2016PTC217592</li>
							</ul>
						</section>

						{/* Find Us */}
						<section className="space-y-4">
							<h2 className="text-lg sm:text-xl font-semibold">Find Us</h2>
							<address className="not-italic space-y-2 text-sm sm:text-base">
								<p>Office No. 228, B Wing,</p>
								<p>Akshay Complex, Dhole Patil Road,</p>
								<p>Pune - 411001,</p>
								<p>Maharashtra, India</p>
							</address>
						</section>

						{/* Location Map */}
						<section className="space-y-4">
							<h2 className="text-lg sm:text-xl font-semibold">Location Map</h2>
							<div className="w-full overflow-hidden rounded-lg">
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3782.819044800587!2d73.8704232!3d18.5370777!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1df117160bd%3A0xb4d52baabbd93eed!2sTellme%20Digiinfotech%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1722407994735!5m2!1sen!2sin"
									width="100%"
									height="200"
									style={{ border: 0 }}
									allowFullScreen={true}
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
									className="w-full"
								></iframe>
							</div>
						</section>

						{/* Connect With Us */}
						<section className="space-y-4">
							<h2 className="text-lg sm:text-xl font-semibold">Connect With Us</h2>
							<div className="space-y-4">
								<ul className="flex justify-start items-center gap-3 sm:gap-4">
									<li>
										<Link
											target="_blank"
											href="https://www.facebook.com/Tellme360/"
											title="Tellme Digiinfotech Facebook"
											className="hover:text-white transition-colors"
										>
											<FaFacebookF size={20} />
										</Link>
									</li>
									<li>
										<Link
											target="_blank"
											href="https://x.com/TeamIndiacom"
											title="Tellme Digiinfotech Twitter"
											className="hover:text-white transition-colors"
										>
											<FaXTwitter size={20} />
										</Link>
									</li>
									<li>
										<Link
											target="_blank"
											href="https://www.instagram.com/tellme360/"
											title="Tellme Digiinfotech Instagram"
											className="hover:text-white transition-colors"
										>
											<FaInstagram size={20} />
										</Link>
									</li>
									<li>
										<Link
											target="_blank"
											href="https://www.youtube.com/channel/UCtp_qdzendr0tf5_tpR9vPg"
											title="Tellme Digiinfotech YouTube Channel"
											className="hover:text-white transition-colors"
										>
											<FaYoutube size={20} />
										</Link>
									</li>
									<li>
										<Link
											target="_blank"
											href="https://www.linkedin.com/company/tellme-digiinfotech-private-limited/"
											title="Tellme Digiinfotech LinkedIn Page"
											className="hover:text-white transition-colors"
										>
											<FaLinkedin size={20} />
										</Link>
									</li>
									<li>
										<Link
											target="_blank"
											href="https://www.pinterest.co.uk/Tellme360/"
											title="Tellme Digiinfotech Pinterest Page"
											className="hover:text-white transition-colors"
										>
											<FaPinterest size={20} />
										</Link>
									</li>
								</ul>
								<ul className="space-y-2 text-sm sm:text-base">
									<li>
										<a href="tel:+917030238122" className="hover:text-white transition-colors">
											+91 703 023 8122
										</a>
									</li>
									<li>
										<a href="mailto:tellmedigi@outlook.com" className="hover:text-white transition-colors">
											tellmedigi@outlook.com
										</a>
									</li>
								</ul>
							</div>
						</section>
					</div>
				</div>

				{/* Footer Bottom */}
				<div className="border-t border-gray-700 py-6">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
						<p className="text-sm text-center sm:text-left">
							© 2024-25&nbsp;
							<Link href="/" className="hover:text-white hover:underline transition-colors">
								Tellme Digiinfotech Pvt. Ltd.
							</Link>
							&nbsp;All Rights Reserved.
						</p>
						<ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
							<li>
								<Link href="/about-us" className="hover:text-white hover:underline transition-colors">
									About
								</Link>
							</li>
							<li>
								<Link href="/contact" className="hover:text-white hover:underline transition-colors">
									Contact
								</Link>
							</li>
							<li>
								<Link href="/terms-and-conditions" className="hover:text-white hover:underline transition-colors">
									Terms &amp; Conditions
								</Link>
							</li>
							<li>
								<Link href="/privacy-policy" className="hover:text-white hover:underline transition-colors">
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