'use client';

import tellme_logo from '@/assets/images/tellme_logo.png';
import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';
import Link from 'next/link';

const TermsAndConditions = () => {
	return (
		<main className='bg-background min-h-screen'>
			<div className='text-foreground relative w-full overflow-hidden'>
				<div className='absolute top-0 right-0 left-0 z-20'>
					<Navbar tellme_logo={tellme_logo} />
				</div>

				<section className='px-4 pt-24 pb-12 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
					<div className='mx-auto max-w-4xl'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className='mb-8'
						>
							<h1 className='mb-4 text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl'>
								Terms And Conditions
							</h1>
						</motion.div>

						<motion.section
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='space-y-8'
						>
							<div className='space-y-4'>
								<p className='text-base leading-relaxed sm:text-lg'>
									Please read these Terms and Conditions of Use carefully before
									using this Website. If you do not agree to all of these Terms
									and Conditions of Use, do not use this Website. TellMe
									Digiinfotech Private Limited (&quot;TellMe&quot;) may revise
									and update these Terms and Conditions from time to time. Your
									continued usage of the Website is considered as an implied
									acceptance of the changes and that you agree to abide by these
									terms for usage of this Website.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='1-introduction'
								>
									1. Introduction
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									Welcome to{' '}
									<Link
										href='https://tellmemediahub.com'
										className='font-semibold hover:underline'
									>
										https://tellmemediahub.com
									</Link>{' '}
									(the &quot;Website&quot;). These terms and conditions
									(&quot;Terms&quot;) govern your use of our website and any
									digital media content (Images, Videos, logos, graphic etc)
									showcased through it. By accessing or using the Website, you
									agree to be bound by these Terms.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='2-use-of-the-website'
								>
									2. Use of the Website
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									You agree to use the Website in accordance with all applicable
									laws and regulations. You must not use the Website for any
									unlawful or prohibited purpose.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='3-intellectual-property-rights'
								>
									3. Intellectual Property Rights
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									All content on the Website, including but not limited to text,
									graphics, logos, images, videos, and software, is the property
									of{' '}
									<Link
										href='https://tellmemediahub.com'
										className='font-semibold hover:underline'
									>
										https://tellmemediahub.com
									</Link>{' '}
									or its content suppliers and is protected by applicable
									copyright and trademark laws. You may not use, reproduce, or
									distribute any content without our express written permission.
									All intellectual property rights related to our digital media
									content are strictly restricted to us.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='4-user-accounts'
								>
									4. User Accounts
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									To access certain features of the Website, you may be required
									to create an account. You are responsible for maintaining the
									confidentiality of your account information and for all
									activities that occur under your account. You agree to notify
									us immediately of any unauthorized use of your account.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='5-user-conduct'
								>
									5. User Conduct
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									You agree not to:
								</p>
								<ul className='list-inside list-disc space-y-2 text-base sm:text-lg'>
									<li>
										Post or transmit any content that is unlawful, harmful,
										threatening, abusive, harassing, defamatory, vulgar,
										obscene, or otherwise objectionable.
									</li>
									<li>
										Impersonate any person or entity, or falsely state or
										otherwise misrepresent your affiliation with a person or
										entity.
									</li>
									<li>
										Engage in any activity that interferes with or disrupts the
										Website or the servers and networks connected to the
										Website.
									</li>
								</ul>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='6-privacy-policy'
								>
									6. Privacy Policy
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									Your use of the Website is also governed by our Privacy
									Policy, which can be found{' '}
									<Link
										href='/privacy-policy'
										className='font-semibold hover:underline'
									>
										here
									</Link>
									. By using the Website, you consent to the collection and use
									of your information as outlined in the Privacy Policy.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='7-limitation-of-liability'
								>
									7. Limitation of Liability
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									To the fullest extent permitted by applicable law,{' '}
									<Link
										href='https://tellmemediahub.com'
										className='font-semibold hover:underline'
									>
										https://tellmemediahub.com
									</Link>{' '}
									shall not be liable for any indirect, incidental, special,
									consequential, or punitive damages, or any loss of profits or
									revenues, whether incurred directly or indirectly, or any loss
									of data, use, goodwill, or other intangible losses, resulting
									from:
								</p>
								<ul className='list-inside list-disc space-y-2 text-base sm:text-lg'>
									<li>Your use or inability to use the Website.</li>
									<li>
										Any unauthorized access to or use of our servers and/or any
										personal information stored therein.
									</li>
									<li>
										Any bugs, viruses, trojan horses, or the like that may be
										transmitted to or through our Website by any third party.
									</li>
									<li>
										Any errors or omissions in any content or for any loss or
										damage of any kind incurred as a result of your use of any
										content posted, emailed, transmitted, or otherwise made
										available via the Website.
									</li>
								</ul>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='8-indemnification'
								>
									8. Indemnification
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									You agree to indemnify, defend, and hold harmless{' '}
									<Link
										href='https://tellmemediahub.com'
										className='font-semibold hover:underline'
									>
										https://tellmemediahub.com
									</Link>
									, its officers, directors, employees, agents, and affiliates,
									from and against any claims, liabilities, damages, losses, and
									expenses, including, without limitation, reasonable legal and
									accounting fees, arising out of or in any way connected with
									your access to or use of the Website or your violation of
									these Terms.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='9-termination'
								>
									9. Termination
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									We reserve the right to terminate or suspend your account and
									access to the Website at our sole discretion, without notice
									and liability, for any reason, including if you breach these
									Terms.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='10-changes-to-the-terms'
								>
									10. Changes to the Terms
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									We may modify these Terms at any time. Any changes will be
									effective immediately upon posting the revised Terms on the
									Website. Your continued use of the Website following the
									posting of changes constitutes your acceptance of such
									changes.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='11-governing-law'
								>
									11. Governing Law
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									These Terms shall be governed by and construed in accordance
									with the laws of India, and the parties submit to the
									exclusive jurisdiction of the courts of Pune without regard to
									its conflict of law principles.
								</p>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='12-contact-information'
								>
									12. Contact Information
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									If you have any questions about these Terms, please contact us
									at:
								</p>
								<div className='space-y-2 text-base sm:text-lg'>
									<p>To, The Legal Department,</p>
									<p>TellMe Digiinfotech Private Limited,</p>
									<p>Office No. 218, Akshay Complex,</p>
									<p>Dhole Patil Road, Pune - 411002</p>
									<p>
										Email id:{' '}
										<Link
											href='mailto:tellmedigi@outlook.com'
											className='font-semibold hover:underline'
										>
											tellmedigi@outlook.com
										</Link>
									</p>
									<p>
										Mob No.:{' '}
										<Link
											href='tel:+917030238122'
											className='font-semibold hover:underline'
										>
											+91 7030238122
										</Link>
									</p>
								</div>
							</div>

							<div className='border-border space-y-4 border-t pt-6'>
								<h2
									className='text-2xl font-semibold sm:text-3xl'
									id='13-entire-agreement'
								>
									13. Entire Agreement
								</h2>
								<p className='text-base leading-relaxed sm:text-lg'>
									These Terms constitute the entire agreement between you and
									the website regarding your use of this Website and supersede
									any prior agreements between you and the website. use of this
									Website and supersede any prior agreements between you and the
									website.
								</p>
							</div>
						</motion.section>
					</div>
				</section>
			</div>
		</main>
	);
};

export default TermsAndConditions;
