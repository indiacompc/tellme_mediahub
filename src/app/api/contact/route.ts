import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

// Detects single-token mixed-case random strings (the signature bot pattern).
// Real names/subjects/messages either contain whitespace or stay short.
function looksLikeGibberish(text: string): boolean {
	const t = text.trim();
	if (t.length < 12) return false;
	if (/\s/.test(t)) return false;
	const letters = t.replace(/[^a-zA-Z]/g, '');
	if (letters.length < 10) return false;
	const hasUpper = /[A-Z]/.test(letters);
	const hasLower = /[a-z]/.test(letters);
	if (!hasUpper || !hasLower) return false;
	// Count case transitions — random strings flip case often, real words don't.
	let transitions = 0;
	for (let i = 1; i < letters.length; i++) {
		const prevUpper = letters[i - 1] >= 'A' && letters[i - 1] <= 'Z';
		const curUpper = letters[i] >= 'A' && letters[i] <= 'Z';
		if (prevUpper !== curUpper) transitions++;
	}
	return transitions / letters.length > 0.25;
}

// Silent success — pretends the submission worked so bots don't learn to adapt.
function silentDrop() {
	return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, subject, message, website, elapsedMs } = body;

		// Honeypot tripped — bot filled the hidden field.
		if (typeof website === 'string' && website.trim() !== '') {
			return silentDrop();
		}

		// Form submitted faster than any human could type.
		if (typeof elapsedMs === 'number' && elapsedMs < 3000) {
			return silentDrop();
		}

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: 'Invalid email address' },
				{ status: 400 }
			);
		}

		// Gibberish in any visible field → drop silently.
		if (
			looksLikeGibberish(name) ||
			looksLikeGibberish(subject) ||
			looksLikeGibberish(message)
		) {
			return silentDrop();
		}

		const fromEmail =
			process.env.RESEND_FROM_EMAIL || 'Tellme Media <onboarding@resend.dev>';

		// Escape user input for HTML
		const safeName = escapeHtml(name);
		const safeEmail = escapeHtml(email);
		const safeSubject = escapeHtml(subject);
		const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

		// Email to company
		const companyEmailResult = await resend.emails.send({
			from: fromEmail,
			to: 'connect@youtellme.ai',
			cc: 'abhishek@youtellme.ai',
			subject: `Contact Form: ${safeSubject}`,
			html: `
				<h2>New Contact Form Submission</h2>
				<p><strong>Name:</strong> ${safeName}</p>
				<p><strong>Email:</strong> ${safeEmail}</p>
				<p><strong>Subject:</strong> ${safeSubject}</p>
				<p><strong>Message:</strong></p>
				<p>${safeMessage}</p>
			`,
			replyTo: email
		});

		if (companyEmailResult.error) {
			console.error('Company email sending error:', companyEmailResult.error);
			return NextResponse.json(
				{ error: 'Failed to send email' },
				{ status: 500 }
			);
		}

		// Confirmation email to user (only send if domain is verified)
		// For testing mode, Resend only allows sending to verified addresses
		try {
			const userEmailResult = await resend.emails.send({
				from: fromEmail,
				to: email,
				subject: 'Thank you for contacting Tellme Media',
				html: `
					<h2>Thank you for reaching out!</h2>
					<p>Dear ${safeName},</p>
					<p>We have received your message and will get back to you as soon as possible.</p>
					<p><strong>Your message:</strong></p>
					<p>${safeMessage}</p>
					<p>Best regards,<br>Tellme Media Team</p>
				`
			});

			if (userEmailResult.error) {
				console.warn(
					'User confirmation email could not be sent. Domain verification may be required.'
				);
			}
		} catch (userEmailError) {
			// If user email fails (e.g., domain not verified), log but don't fail the request
			// since the main email to company was sent successfully
			console.warn(
				'User confirmation email failed (domain may need verification):',
				userEmailError
			);
		}

		return NextResponse.json(
			{ message: 'Email sent successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Contact form error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
