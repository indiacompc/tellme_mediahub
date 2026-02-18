import { siteUrl } from '@/auth/ConfigManager';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

export default function PrivacyPolicyPage() {
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

				<h2 className='font-cinzel text-base font-semibold'>Last Updated:</h2>
				<p className='mb-3'>30th June 2025</p>

				<p className='mb-4'>
					This Privacy Policy explains how Tellme Digiinfotech Private Limited
					(&quot;Tellme&&quot;, &quot;we&&quot;, &quot;our&&quot;, or
					&quot;us&&quot;) collects, uses, shares, and protects personal and
					non-personal information of users of our website&nbsp;
					<Link href={"https://youtellme.ai"} className='text-blue-600 underline' target='_blank' rel='noopener noreferrer'>
						youtellme.ai
					</Link>
					&nbsp; (&quot;Website&quot;). By accessing or using the Website, you
					agree to the practices described in this policy.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					1. Company Details
				</h3>
				<p className='mb-4'>
					<strong>Tellme Digiinfotech Private Limited</strong>
					<br />
					Registered Office: 218, Akshay Complex, Dhole Patil Road, Pune -
					411001, Maharashtra, India
					<br />
					Contact Email:&nbsp;
					<a
						href='mailto:tellmedigi@outlook.com'
						className='text-blue-600 underline'
					>
						tellmedigi@outlook.com
					</a>
				</p>

				<h3 className='font-cinzel text-base font-semibold'>2. Scope</h3>
				<p className='mb-4'>
					This Privacy Policy applies to all users of the Website including
					individuals, professionals, business entities, and creators who
					interact with our content, register, or license experiential creations
					(e.g., images, videos, and 360° contents).
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					3. Information We Collect
				</h3>
				<h4 className='mt-2 text-sm font-semibold'>a) Personal Information</h4>
				<ul className='list-disc pl-5'>
					<li>Name, business/organization name</li>
					<li>Contact details: phone number, email, mailing address</li>
					<li>Professional or business category</li>
					<li>Geo-location data (e.g., latitude/longitude)</li>
					<li>Feedback, submissions, or correspondence with us</li>
				</ul>
				<p className='mt-2 mb-4'>
					<strong>Note:</strong> We do not intentionally collect or process
					Sensitive Personal Data or Information (SPDI) as defined under Indian
					IT Rules.
				</p>

				<h4 className='mt-2 text-sm font-semibold'>
					b) Non-Personal Information
				</h4>
				<ul className='mb-4 list-disc pl-5'>
					<li>IP address and browser type</li>
					<li>Usage behavior, page views, clicks</li>
					<li>Device information and location metadata</li>
					<li>Analytics and cookie data</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>
					4. How We Collect Information
				</h3>
				<ul className='mb-4 list-disc pl-5'>
					<li>Direct submissions via forms, registration, or contact pages</li>
					<li>Automated technologies such as cookies, analytics tools</li>
					<li>Public domain sources and licensed data repositories</li>
					<li>
						User-generated content including reviews, uploads, and comments
					</li>
					<li>
						Collaborative content from verified content creators and
						photographers
					</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>
					5. Use of Information
				</h3>
				<ul className='mb-2 list-disc pl-5'>
					<li>To verify, process, and publish submitted content</li>
					<li>To deliver services and user support</li>
					<li>To display digital creations</li>
					<li>To market new content and offers</li>
					<li>To improve Website performance and personalization</li>
					<li>To comply with legal and regulatory obligations</li>
				</ul>
				<p className='mb-4'>
					We may aggregate and share anonymized statistical data with third
					parties, partners, or sponsors.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					6. Sharing of Information
				</h3>
				<p className='mb-2'>Your personal information may be shared:</p>
				<ul className='mb-4 list-disc pl-5'>
					<li>With third-party service providers under contract</li>
					<li>With licensees and affiliates for lawful business purposes</li>
					<li>
						In case of legal requests by government or regulatory agencies
					</li>
					<li>
						During company restructuring, merger, or acquisition (with prior
						safeguards)
					</li>
				</ul>
				<p className='mb-4'>
					No personal data will be sold to third parties without your consent.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					7. User Submissions and Publications
				</h3>
				<ul className='mb-4 list-disc pl-5'>
					<li>
						You grant Tellme a worldwide, non-exclusive, royalty-free license to
						use, display, and distribute your submission
					</li>
					<li>
						You may withdraw consent to publish your content by contacting our
						Grievance Officer
					</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>
					8. Cookies and Tracking Technologies
				</h3>
				<ul className='mb-4 list-disc pl-5'>
					<li>Maintain user sessions and site preferences</li>
					<li>Provide content recommendations</li>
					<li>Collect analytics data</li>
					<li>Enable remarketing or targeted advertising</li>
				</ul>
				<p className='mb-4'>
					You may disable cookies in your browser settings, but this may limit
					Website functionality.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					9. Google Analytics & Third-Party Tools
				</h3>
				<p className='mb-4'>
					We use Google Analytics and related tools for traffic analysis. You
					may opt out using Google&apos;s Opt-Out Tool.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					10. Children&apos;s Privacy
				</h3>
				<p className='mb-4'>
					This Website is not intended for individuals under 18 years of age. If
					we discover such data, it will be deleted promptly.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					11. Data Retention and Security
				</h3>
				<ul className='mb-4 list-disc pl-5'>
					<li>Secure servers with password protection</li>
					<li>Access restrictions to authorized personnel only</li>
					<li>Regular audits and encryption practices</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>
					12. Cross-Border Data Transfers
				</h3>
				<p className='mb-4'>
					We ensure appropriate safeguards are in place if your information is
					stored or processed outside India.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					13. External Links
				</h3>
				<p className='mb-4'>
					Our Website may contain links to third-party websites. We are not
					responsible for their content or privacy practices.
				</p>

				<h3 className='font-cinzel text-base font-semibold'>14. User Rights</h3>
				<ul className='mb-4 list-disc pl-5'>
					<li>Access or review your data</li>
					<li>Request correction or deletion</li>
					<li>Withdraw previously granted consent</li>
					<li>Report data misuse or file complaints</li>
				</ul>

				<h3 className='font-cinzel text-base font-semibold'>
					15. Grievance Redressal
				</h3>
				<p className='mb-4'>
					<strong>Grievance Officer</strong>
					<br />
					Tellme Digiinfotech Private Limited
					<br />
					218, Akshay Complex, Dhole Patil Road, Pune - 411001, Maharashtra
					<br />
					📧 Email:&nbsp;
					<a
						href='mailto:tellmedigi@outlook.com'
						className='text-blue-600 underline'
					>
						tellmedigi@outlook.com
					</a>
				</p>

				<h3 className='font-cinzel text-base font-semibold'>
					16. Updates to this Policy
				</h3>
				<p>
					We may update this Privacy Policy from time to time. Continued use of
					the Website constitutes acceptance of the changes.
				</p>
			</div>
		</div>
	);
}
