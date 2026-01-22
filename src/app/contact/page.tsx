'use client';

import Navbar from '@/components/Navbar';
import tellme_logo from '@/assets/images/tellme_logo.png';
import { motion } from 'motion/react';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Suspense } from 'react';
import ContactForm from '@/components/contact-form'; 

export default function ContactPage() {

	return (
		<main className="min-h-screen bg-background">
			<div className="relative w-full overflow-hidden text-foreground">
				<div className="absolute top-0 left-0 right-0 z-20">
					<Navbar tellme_logo={tellme_logo} />
				</div>

				<section className="pt-24 pb-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
					<div className="max-w-7xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-center mb-12"
						>
							<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">
								Contact Us
							</h1>
							<p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
								Have a question or want to get in touch? We'd love to hear from you.
							</p>
						</motion.div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="space-y-6"
							>
								<div>
									<h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
									<p className="text-muted-foreground mb-8">
										Fill out the form and we'll get back to you as soon as possible.
									</p>
								</div>

								<div className="space-y-4">
									<div className="flex items-start gap-4">
										<div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
											<FaEnvelope className="text-primary" />
										</div>
										<div>
											<h3 className="font-semibold mb-1">Email</h3>
											<a
												href="mailto:digital@tellmedigi.com"
												className="text-muted-foreground hover:text-primary transition-colors"
											>
												digital@tellmedigi.com
											</a>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
											<FaMapMarkerAlt className="text-primary" />
										</div>
										<div>
											<h3 className="font-semibold mb-1">Location</h3>
											<p className="text-muted-foreground">
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
								<Suspense fallback={<div className="text-muted-foreground">Loading form...</div>}>
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