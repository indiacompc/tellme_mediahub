'use client';

import Navbar from '@/components/Navbar';
import tellme_logo from '@/assets/images/tellme_logo.png';
import { Button } from '@/shadcn_data/components/ui/button';
import { motion } from 'motion/react';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ContactPage() {
	const searchParams = useSearchParams();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const subjectParam = searchParams.get('subject');
		if (subjectParam) {
			setFormData((prev) => ({
				...prev,
				subject: decodeURIComponent(subjectParam),
			}));
		}
	}, [searchParams]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to send message');
			}

			setSuccess(true);
			setFormData({
				name: '',
				email: '',
				subject: '',
				message: '',
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to send message');
		} finally {
			setLoading(false);
		}
	};

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
								{success && (
									<div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
										<p className="text-green-800 dark:text-green-200">
											Thank you! Your message has been sent successfully. We'll get back to you soon.
										</p>
									</div>
								)}
								{error && (
									<div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
										<p className="text-red-800 dark:text-red-200">{error}</p>
									</div>
								)}
								<form onSubmit={handleSubmit} className="space-y-6">
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium mb-2"
										>
											Name
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											required
											className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
											placeholder="Your name"
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium mb-2"
										>
											Email
										</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											required
											className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
											placeholder="your.email@example.com"
										/>
									</div>

									<div>
										<label
											htmlFor="subject"
											className="block text-sm font-medium mb-2"
										>
											Subject
										</label>
										<input
											type="text"
											id="subject"
											name="subject"
											value={formData.subject}
											onChange={handleChange}
											required
											className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
											placeholder="What is this regarding?"
										/>
									</div>

									<div>
										<label
											htmlFor="message"
											className="block text-sm font-medium mb-2"
										>
											Message
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleChange}
											required
											rows={6}
											className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
											placeholder="Your message..."
										/>
									</div>

									<Button type="submit" className="w-full" size="lg" disabled={loading}>
										{loading ? 'Sending...' : 'Send Message'}
									</Button>
								</form>
							</motion.div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}