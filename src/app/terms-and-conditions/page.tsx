import { siteUrl } from '@/auth/ConfigManager';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

export default function TermsAndConditionsPage() {
	return (
		<div className='mx-6 py-6'>
			<Link
				href='/'
				className='text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors'
			>
				<IoArrowBack className='h-4 w-4' />
				Back to Home
			</Link>
			<div className='mx-10 text-sm leading-relaxed text-foreground'>
				<h2 className='font-cinzel text-base font-semibold'>Effective Date:</h2>
				<p className='mb-3'>1st July 2025</p>

				<p className='mb-4'>
					Welcome to the website of Tellme Digiinfotech Private Limited
					(&quot;Tellme&quot;, &quot;we&quot;, &quot;our&quot; or
					&quot;us&quot;), accessible at&nbsp;
					<Link href={"https://youtellme.ai"} className='text-blue-600 underline' target='_blank' rel='noopener noreferrer'>
						youtellme.ai
					</Link>
					&nbsp; (&quot;Website&quot;). By accessing or using this Website, you
					agree to comply with and be bound by the following Terms and
					Conditions (&quot;Terms&quot;). If you do not agree to these Terms,
					please do not use the Website.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					1. Company Information
				</h3>
				<p className='mb-4'>
					This Website is operated by Tellme Digiinfotech Private Limited, a
					company registered under the Companies Act, 2013, with its registered
					office at:
					<br />
					218, Akshay Complex, Dhole Patil Road, Pune - 411001, Maharashtra,
					India
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					2. Scope of Services
				</h3>
				<p className='mb-2'>
					The Website offers a digital showcase of Tellme&apos;s experiential
					creations, including but not limited to:
				</p>
				<ul className='mb-4 list-disc pl-5'>
					<li>High-quality photography and videography content</li>
					<li>Digital media and artistic assets for reference</li>
					<li>Immersive and interactive content formats (2D, 3D, VR, AR)</li>
				</ul>
				<p className='mb-4'>
					All content is either created by or licensed to Tellme and is
					protected under intellectual property laws.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					3. Intellectual Property Rights
				</h3>
				<p className='mb-2'>
					All content on this Website, including text, graphics, photos, videos,
					logos, trademarks, and digital creations, are the intellectual
					property of Tellme or its licensors or the respective departments
					which have authorised the shoot. You may not:
				</p>
				<ul className='mb-4 list-disc pl-5'>
					<li>
						Copy, reproduce, download, distribute, transmit, display, or create
						derivative works
					</li>
					<li>
						Use any content for commercial gain without our prior written
						consent
					</li>
					<li>Use bots, spiders, or similar data extraction tools</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>4. User Conduct</h3>
				<p className='mb-2'>
					You agree not to upload, publish, transmit, or distribute content
					that:
				</p>
				<ul className='mb-4 list-disc pl-5'>
					<li>Infringes intellectual property or privacy rights</li>
					<li>Is unlawful, defamatory, or obscene</li>
					<li>Promotes harmful or misleading information</li>
					<li>Contains viruses or malicious code</li>
					<li>Misrepresents your identity</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>
					5. Licensing of Digital Content
				</h3>
				<p className='mb-4'>
					When you purchase or license any digital asset, including but not
					limited to having your photographs inserted on it through AI or any
					other means, you obtain a limited, non-exclusive license to use the
					content for permitted purposes. Ownership of the underlying
					intellectual property remains with Tellme or the designated creator or
					the department authorising unless otherwise specified in writing or
					through smart contract.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					6. Submissions and Feedback
				</h3>
				<p className='mb-2'>
					If you submit reviews, suggestions, or creative inputs:
				</p>
				<ul className='mb-4 list-disc pl-5'>
					<li>
						You grant Tellme an irrevocable, worldwide, royalty-free license to
						use, reproduce, and distribute such content
					</li>
					<li>You confirm you have the right to submit the content</li>
					<li>You waive any claims against Tellme arising from such usage</li>
					<li>
						Your reviews, suggestions or creative inputs shall not be violative
						of any laws , rules and regulations of India in force.TellMe shall
						not be responsible for any reviews / inputs given by you and
						published in this site or any other digital media sourced from this
						site ( through GenAI).
					</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>
					7. Disclaimer of Warranties
				</h3>
				<p className='mb-2'>
					The Website and its content are provided &quot;as is&quot; and
					&quot;as available&quot; without warranties of any kind. Tellme does
					not warrant:
				</p>
				<ul className='mb-4 list-disc pl-5'>
					<li>Continuous, uninterrupted access to the Website</li>
					<li>Accuracy, completeness, or reliability of content</li>
					<li>Virus-free operation</li>
				</ul>
				<p className='mb-4'>
					Use of the Website and reliance on its content is at your own risk.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					8. Limitation of Liability
				</h3>
				<p className='mb-2'>
					Under no circumstances will Tellme be liable for:
				</p>
				<ul className='mb-4 list-disc pl-5'>
					<li>Indirect or consequential damages</li>
					<li>Loss of data, profits, or business opportunities</li>
					<li>Any amount exceeding INR 10,000 in aggregate</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>9. Indemnity</h3>
				<p className='mb-2'>
					You agree to indemnify and hold harmless Tellme, its directors,
					officers, and affiliates, from any claims arising from:
				</p>
				<ul className='mb-4 list-disc pl-5'>
					<li>Violation of these Terms</li>
					<li>Use or misuse of content</li>
					<li>Infringement of any third-party rights</li>
					<li>
						Any legal action initiated against TellMe resulting from your not
						complying with the terms and conditions of this web site or the law
						in force from time to time.
					</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>
					10. Governing Law & Dispute Resolution
				</h3>
				<p className='mb-2'>
					These Terms shall be governed by and interpreted in accordance with
					the laws of India. Any disputes shall be resolved as follows:
				</p>
				<ul className='mb-4 list-disc pl-5'>
					<li>First, through mutual negotiation within 45 working days</li>
					<li>
						Then, by binding arbitration in Pune, Maharashtra, under the
						Arbitration and Conciliation Act, 1996
					</li>
					<li>
						Failing which, the courts of Pune, Maharashtra shall have exclusive
						jurisdiction
					</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>
					11. Modifications and Termination
				</h3>
				<p className='mb-4'>
					Tellme reserves the right to modify these Terms at any time without
					prior notice. Continued use of the Website after such changes
					constitutes acceptance of the modified Terms. We also reserve the
					right to terminate or restrict access to any user for violations of
					these Terms.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>12. Contact</h3>
				<p className='mb-2'>
					For queries or complaints related to these Terms, reach us at:
				</p>
				<ul className='mb-4 list-disc pl-5'>
					<li>
						<strong>Email:</strong>&nbsp;
						<a
							href='mailto:tellmedigi@outlook.com'
							className='text-blue-600 underline'
						>
							tellmedigi@outlook.com
						</a>
					</li>
					<li>
						<strong>Address:</strong> 218, Akshay Complex, Dhole Patil Road,
						Pune - 411001, Maharashtra
					</li>
				</ul>
			</div>
		</div>
	);
}
