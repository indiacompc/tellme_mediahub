'use client';

import ContactForm from '@/components/ContactForm';
import { motion } from 'motion/react';
import { Suspense } from 'react';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactPage() {
	return (
		<main className='bg-background min-h-screen'>
			<div className='text-foreground relative w-full overflow-hidden'>
				<section className='px-4 pt-24 pb-12 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
					<div className='mx-auto max-w-7xl'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className='mb-12 text-center'
						>
							<h1 className='mb-4 text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl'>
								Contact Us
							</h1>
							<p className='text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg md:text-xl'>
								Have a question or want to get in touch? We'd love to hear from
								you.
							</p>
						</motion.div>

						<div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12'>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className='space-y-6'
							>
								<div>
									<h2 className='mb-6 text-2xl font-semibold'>Get in Touch</h2>
									<p className='text-muted-foreground mb-8'>
										Fill out the form and we'll get back to you as soon as
										possible.
									</p>
								</div>

								<div className='space-y-4'>
									<div className='flex items-start gap-4'>
										<div className='bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full'>
											<FaEnvelope className='text-primary' />
										</div>
										<div>
											<h3 className='mb-1 font-semibold'>Email</h3>
											<a
												href='mailto:digital@tellmedigi.com'
												className='text-muted-foreground hover:text-primary transition-colors'
											>
												digital@tellmedigi.com
											</a>
										</div>
									</div>

									<div className='flex items-start gap-4'>
										<div className='bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full'>
											<FaMapMarkerAlt className='text-primary' />
										</div>
										<div>
											<h3 className='mb-1 font-semibold'>Location</h3>
											<p className='text-muted-foreground'>
												Tellme Digiinfotech Private Limited
											</p>
										</div>
									</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.3 }}
							>
								<Suspense
									fallback={
										<div className='text-muted-foreground'>Loading form...</div>
									}
								>
									<ContactForm />
								</Suspense>
							</motion.div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
