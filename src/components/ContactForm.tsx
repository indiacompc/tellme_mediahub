'use client';

import { Button } from '@/shadcn_data/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Tells the form what mode it is in:
//   'licensing' - arrived from "Request Licensing & Pricing" CTA on an image page
//   'preview'   - arrived from "Download watermarked preview" CTA
//   'general'   - standard contact
type FormMode = 'licensing' | 'preview' | 'general';

const INTENDED_USE_OPTIONS = [
	{ value: '', label: 'Select intended use…' },
	{ value: 'editorial', label: 'Editorial (news, blog, magazine)' },
	{ value: 'commercial', label: 'Commercial (advertising, product)' },
	{ value: 'print', label: 'Print (books, posters, fine art prints)' },
	{ value: 'digital', label: 'Digital (website, app, social media)' },
	{ value: 'corporate', label: 'Corporate (presentations, reports)' },
	{ value: 'broadcast', label: 'Broadcast / Film / TV' },
	{ value: 'other', label: 'Other – specify in message' }
] as const;

export default function ContactForm() {
	const searchParams = useSearchParams();

	const [mode, setMode] = useState<FormMode>('general');
	const [imageName, setImageName] = useState('');

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
		// Licensing-specific fields (sent as part of message body)
		intendedUse: '',
		resolution: ''
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// ── Initialise from URL params ─────────────────────────────────────────
	useEffect(() => {
		const subjectParam = searchParams.get('subject');
		const typeParam = searchParams.get('type');
		const imageNameParam = searchParams.get('imageName');

		// Determine form mode from the `type` query param written by the CTA
		const resolvedMode: FormMode =
			typeParam === 'licensing'
				? 'licensing'
				: typeParam === 'preview'
					? 'preview'
					: 'general';
		setMode(resolvedMode);

		if (imageNameParam) {
			// Decode and trim to kill any stray whitespace — guards against
			// the "CourtyardGuide" concatenation bug at the source level.
			setImageName(decodeURIComponent(imageNameParam).trim());
		}

		if (subjectParam) {
			setFormData((prev) => ({
				...prev,
				subject: decodeURIComponent(subjectParam).trim()
			}));
		}
	}, [searchParams]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);

		// Build the full message body — for licensing requests, append the
		// structured licensing fields so the team gets a complete brief.
		let fullMessage = formData.message;
		if (mode === 'licensing' || mode === 'preview') {
			const extras = [
				imageName && `\nImage: ${imageName}`,
				formData.intendedUse &&
					`Intended use: ${
						INTENDED_USE_OPTIONS.find((o) => o.value === formData.intendedUse)
							?.label ?? formData.intendedUse
					}`,
				formData.resolution && `Print size / Resolution needed: ${formData.resolution}`
			]
				.filter(Boolean)
				.join('\n');
			if (extras) fullMessage = `${fullMessage}\n\n── Licensing Details ──\n${extras}`;
		}

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					subject: formData.subject,
					message: fullMessage
				})
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || 'Failed to send message');

			setSuccess(true);
			setFormData({
				name: '',
				email: '',
				subject: '',
				message: '',
				intendedUse: '',
				resolution: ''
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to send message');
		} finally {
			setLoading(false);
		}
	};

	const isLicensingMode = mode === 'licensing' || mode === 'preview';

	return (
		<>
			{/* ── Licensing context banner ─────────────────────────────────── */}
			{isLicensingMode && imageName && (
				<div className='border-primary/30 bg-primary/5 mb-6 rounded-lg border px-4 py-3'>
					<p className='text-muted-foreground text-xs font-medium uppercase tracking-wide'>
						{mode === 'preview' ? 'Preview request for' : 'Licensing inquiry for'}
					</p>
					<p className='text-foreground mt-0.5 font-semibold'>{imageName}</p>
				</div>
			)}

			{success && (
				<div className='mb-6 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'>
					<p className='text-green-800 dark:text-green-200'>
						{isLicensingMode
							? "Thank you! We've received your licensing inquiry and will respond with a quote within 1–2 business days."
							: "Thank you! Your message has been sent successfully. We'll get back to you soon."}
					</p>
				</div>
			)}
			{error && (
				<div className='mb-6 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
					<p className='text-red-800 dark:text-red-200'>{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-5'>
				{/* Name */}
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

				{/* Email */}
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

				{/* Image name — read-only when pre-filled from a licensing CTA */}
				{isLicensingMode && imageName && (
					<div>
						<label htmlFor='imageName' className='mb-2 block text-sm font-medium'>
							Image
						</label>
						<input
							type='text'
							id='imageName'
							name='imageName'
							value={imageName}
							readOnly
							className='border-border bg-muted text-foreground w-full cursor-default rounded-md border px-4 py-2 opacity-75'
							aria-readonly='true'
						/>
					</div>
				)}

				{/* Subject */}
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

				{/* Licensing-specific fields ─────────────────────────────────── */}
				{isLicensingMode && (
					<>
						{/* Intended use dropdown */}
						<div>
							<label
								htmlFor='intendedUse'
								className='mb-2 block text-sm font-medium'
							>
								Intended Use{' '}
								<span className='text-muted-foreground font-normal'>(required)</span>
							</label>
							<select
								id='intendedUse'
								name='intendedUse'
								value={formData.intendedUse}
								onChange={handleChange}
								required
								className='border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
							>
								{INTENDED_USE_OPTIONS.map((opt) => (
									<option key={opt.value} value={opt.value} disabled={opt.value === ''}>
										{opt.label}
									</option>
								))}
							</select>
						</div>

						{/* Print size / resolution */}
						<div>
							<label
								htmlFor='resolution'
								className='mb-2 block text-sm font-medium'
							>
								Print Size or Resolution Needed{' '}
								<span className='text-muted-foreground font-normal'>(optional)</span>
							</label>
							<input
								type='text'
								id='resolution'
								name='resolution'
								value={formData.resolution}
								onChange={handleChange}
								className='border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
								placeholder='e.g. A1 poster, 300 DPI, 4000 × 3000 px'
							/>
						</div>
					</>
				)}

				{/* Message */}
				<div>
					<label htmlFor='message' className='mb-2 block text-sm font-medium'>
						{isLicensingMode ? 'Additional Notes' : 'Message'}
					</label>
					<textarea
						id='message'
						name='message'
						value={formData.message}
						onChange={handleChange}
						required={!isLicensingMode}
						rows={isLicensingMode ? 4 : 6}
						className='border-border bg-background text-foreground focus:ring-ring w-full resize-none rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
						placeholder={
							isLicensingMode
								? 'Any additional details about your project or usage…'
								: 'Your message…'
						}
					/>
				</div>

				{/* Submit */}
				<Button
					id='btn-submit-contact'
					type='submit'
					className='w-full'
					size='lg'
					disabled={loading}
				>
					{loading
						? 'Sending…'
						: isLicensingMode
							? 'Send My Purchase Request'
							: 'Send Message'}
				</Button>
			</form>
		</>
	);
}
