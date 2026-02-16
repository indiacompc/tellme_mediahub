'use client';

import tellme_logo from '@/assets/images/tellme_logo.png';
import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';
import Link from 'next/link';

const PrivacyPolicy = () => {
	return (
		<main className='bg-background min-h-screen'>
			<div className='text-foreground relative w-full overflow-hidden'>
				 

				<section className='px-4 pt-24 pb-12 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
					<div className='mx-auto max-w-4xl'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className='mb-8'
						>
							<h1 className='mb-4 text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl'>
								Privacy Policy
							</h1>
						</motion.div>

						<motion.section
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='space-y-8'
						>
							<div className='space-y-4'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='introduction'
								>
									Introduction
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									<Link
										href='https://tellmemediahub.com'
										className='font-semibold hover:underline'
									>
										tellmemediahub.com
									</Link>{' '}
									(&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
									committed to protecting the privacy of our users
									(&quot;you,&quot; &quot;your&quot;). This Privacy Policy
									explains how we collect, use, disclose, and safeguard your
									information when you visit our website -{' '}
									<Link
										href='https://tellmemediahub.com'
										className='font-semibold hover:underline'
									>
										tellmemediahub.com
									</Link>{' '}
									(the &quot;Website&quot;) and interact with our digital media
									content.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='information-we-collect'
								>
									Information We Collect
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									We may collect and process the following types of information:
								</p>
								<ul className='list-inside list-disc space-y-2 text-base sm:text-lg'>
									<li>
										Personal Information: When you create an account, subscribe
										to our newsletter, contact us, or interact with our digital
										media content, we may collect personal information such as
										your name, email address, mailing address, phone number, and
										any other contact details.
									</li>
									<li>
										Non-Personal Information: We may collect non-personal
										information such as browser type, device information, IP
										address, and browsing behavior through cookies and similar
										technologies.
									</li>
								</ul>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='how-we-use-your-information'
								>
									How We Use Your Information
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									By accepting this Privacy Policy and our Terms, you expressly
									consent to our use and disclosure of your Personal Information
									in the manner prescribed in this Privacy Policy. We use the
									information we collect for various purposes including:
								</p>
								<ul className='list-inside list-disc space-y-2 text-base sm:text-lg'>
									<li>To provide and maintain our website.</li>
									<li>
										To communicate with you, including sending updates and
										promotional materials.
									</li>
									<li>To improve our website and services.</li>
									<li>To comply with legal obligations.</li>
								</ul>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='disclosure-of-your-information'
								>
									Disclosure of Your Information
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									We may share your information with:
								</p>
								<ul className='list-inside list-disc space-y-2 text-base sm:text-lg'>
									<li>
										Service Providers: We may share your information with
										third-party service providers who perform services on our
										behalf, such as payment processing, email delivery, and data
										analysis.
									</li>
									<li>
										Legal Requirements: We may disclose your information if
										required to do so by law or in response to valid requests by
										public authorities.
									</li>
									<li>
										Business Transfers: In the event of a merger, acquisition,
										or sale of all or a portion of our assets, your information
										may be transferred.
									</li>
								</ul>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='security-of-your-information'
								>
									Security of Your Information
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									We use administrative, technical, and physical security
									measures to help protect your personal information. However,
									no electronic transmission or storage of information can be
									entirely secure, so we cannot guarantee absolute security.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='cookies-and-tracking-technologies'
								>
									Cookies and Tracking Technologies
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									We use cookies and similar tracking technologies to track
									activity on our Website and store certain information. You can
									instruct your browser to refuse all cookies or to indicate
									when a cookie is being sent. However, if you do not accept
									cookies, you may not be able to use some portions of our
									Website.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='your-data-protection-rights'
								>
									Your Data Protection Rights
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									Depending on your location, you may have the following rights
									regarding your personal data:
								</p>
								<ul className='list-inside list-disc space-y-2 text-base sm:text-lg'>
									<li>
										The right to access - You have the right to request copies
										of your personal data.
									</li>
									<li>
										The right to rectification - You have the right to request
										that we correct any information you believe is inaccurate or
										complete information you believe is incomplete.
									</li>
									<li>
										The right to erasure - You have the right to request that we
										erase your personal data under certain conditions.
									</li>
									<li>
										The right to restrict processing - You have the right to
										request that we restrict the processing of your personal
										data under certain conditions.
									</li>
									<li>
										The right to object to processing - You have the right to
										object to our processing of your personal data under certain
										conditions.
									</li>
									<li>
										The right to data portability - You have the right to
										request that we transfer the data that we have collected to
										another organization or directly to you under certain
										conditions.
									</li>
								</ul>
								<p className='text-base leading-relaxed sm:text-lg'>
									To exercise these rights, please contact us at{' '}
									<Link
										href='mailto:tellmedigi@outlook.com'
										className='font-semibold hover:underline'
									>
										tellmedigi@outlook.com
									</Link>
									.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='your-consent'
								>
									Your Consent
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									By accepting this Privacy Policy and our Terms, you expressly
									consent to our use and disclosure of your Personal Information
									in the manner prescribed in this Privacy Policy.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='children-s-privacy'
								>
									Children&apos;s Privacy
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									Our Website is not intended for children under the age of 18.
									We do not knowingly collect personal information from children
									under 18. If we become aware that we have collected personal
									information from a child under 18, we will take steps to
									delete such information from our files as soon as possible.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='changes-to-this-privacy-policy'
								>
									Changes to This Privacy Policy
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									We may update our Privacy Policy from time to time. You are
									advised to review this Privacy Policy periodically for any
									changes.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='links-to-other-websites'
								>
									Links to Other Websites
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									Our Website has links that redirect you to our social
									networking pages such as Facebook, Twitter, LinkedIn, YouTube,
									and other websites that may be added from time to time. Your
									visits and activity on those portals shall be governed by
									their own privacy policies. Please go through their privacy
									policies to get information on their privacy practices.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='contact-us'
								>
									Contact Us
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									If you have any questions about this Privacy Policy, please
									contact us at:
								</p>
								<div className='space-y-2 text-base sm:text-lg'>
									<p>TellMe Digiinfotech Private Limited</p>
									<p>Office No. 218, Akshay Complex,</p>
									<p>Dhole Patil Road, Pune - 411001</p>
									<p>
										Email:{' '}
										<Link
											href='mailto:tellmedigi@outlook.com'
											className='font-semibold hover:underline'
										>
											tellmedigi@outlook.com
										</Link>
									</p>
									<p>
										Phone:{' '}
										<Link
											href='tel:+917030238122'
											className='font-semibold hover:underline'
										>
											+91 7030238122
										</Link>
									</p>
								</div>
							</div>
						</motion.section>
					</div>
				</section>
			</div>
		</main>
	);
};

export default PrivacyPolicy;
