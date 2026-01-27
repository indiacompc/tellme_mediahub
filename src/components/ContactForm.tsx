'use client';

import { Button } from '@/shadcn_data/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ContactForm() {
	const searchParams = useSearchParams();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: ''
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const subjectParam = searchParams.get('subject');
		if (subjectParam) {
			setFormData((prev) => ({
				...prev,
				subject: decodeURIComponent(subjectParam)
			}));
		}
	}, [searchParams]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
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
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
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
				message: ''
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
				<div className='mb-6 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'>
					<p className='text-green-800 dark:text-green-200'>
						Thank you! Your message has been sent successfully. We'll get back
						to you soon.
					</p>
				</div>
			)}
			{error && (
				<div className='mb-6 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
					<p className='text-red-800 dark:text-red-200'>{error}</p>
				</div>
			)}
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div>
					<label htmlFor='name' className='mb-2 block text-sm font-medium'>
						Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={formData.name}
						onChange={handleChange}
						required
						className='border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
						placeholder='Your name'
					/>
				</div>

				<div>
					<label htmlFor='email' className='mb-2 block text-sm font-medium'>
						Email
					</label>
					<input
						type='email'
						id='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
						required
						className='border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
						placeholder='your.email@example.com'
					/>
				</div>

				<div>
					<label htmlFor='subject' className='mb-2 block text-sm font-medium'>
						Subject
					</label>
					<input
						type='text'
						id='subject'
						name='subject'
						value={formData.subject}
						onChange={handleChange}
						required
						className='border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
						placeholder='What is this regarding?'
					/>
				</div>

				<div>
					<label htmlFor='message' className='mb-2 block text-sm font-medium'>
						Message
					</label>
					<textarea
						id='message'
						name='message'
						value={formData.message}
						onChange={handleChange}
						required
						rows={6}
						className='border-border bg-background text-foreground focus:ring-ring w-full resize-none rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
						placeholder='Your message...'
					/>
				</div>

				<Button type='submit' className='w-full' size='lg' disabled={loading}>
					{loading ? 'Sending...' : 'Send Message'}
				</Button>
			</form>
		</>
	);
}
