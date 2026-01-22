'use client';

import { Button } from '@/shadcn_data/components/ui/button';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ContactForm() {
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
		<>
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
		</>
	);
}
