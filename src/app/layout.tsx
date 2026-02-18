import { cinzelFont, poppinsFont, quicksandFont } from '@/assets/fonts';
import tellme_logo from '@/assets/images/tellme_logo.png';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { organizationJsonLd, websiteJsonLd } from '@/lib/globalVariables';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const fetchCache = 'default-no-store';

// export const revalidate = 60;

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	//maximumScale: 1,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ebe8db' }
		//{ media: '(prefers-color-scheme: dark)', color: 'black' },
	],
	colorScheme: 'light'
};

export const metadata: Metadata = {
	metadataBase: new URL('https://tellme360.media'),
	title: 'Tellme Media',
	description: `${websiteJsonLd.description}`,
	keywords: `${websiteJsonLd.keywords}`,
	generator: 'Next.js',
	applicationName: 'Tellme Media',
	referrer: 'origin-when-cross-origin',

	authors: [{ name: 'Pratik Yawalkar', url: 'https://github.com/pratikviper' }],
	creator: 'Indiacom And Tellme Digiinfotech Web Development Team 2026',
	publisher: 'Tellme Digiinfotech Private Limited',
	verification: {
		google: 'dOSHHtiuVy9KXC8vLDa-nt25mKjl3CP1GZcukB53ENc',
		// yandex: 'b58b4822f9b89f2b',
		// <meta name="rating" key='rating' content="General" />
		// <meta name="Audience" key='Audience' content="General" />
		// <meta name="Language" key='Language' content="us-en" />
		// <meta name="distribution" key='distribution' content="global" />
		// <meta name="classification" key='classification' content="Business And Industry" />
		// <meta name="apple-mobile-web-app-capable" key='apple-mobile-web-app-capable' content="yes" />
		other: {
			rating: 'General',
			Audience: 'General',
			Language: 'us-en',
			distribution: 'global',
			classification: 'Business And Industry',
			'apple-mobile-web-app-capable': 'yes'
		}
	},
	// manifest: '/manifest.json',
	icons: {
		apple: '/icon-192x192.png'
	},
	openGraph: {
		title: 'Tellme Media',
		description: `${websiteJsonLd.description}`,
		siteName: 'Tellme Media',
		locale: 'en_US',
		type: 'website'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tellme Media',
		description: `${websiteJsonLd.description}`,
		creator: '@TeamIndiacom'
	},
	formatDetection: {
		email: false,
		address: false,
		telephone: false
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1
		}
	},
	appLinks: {
		web: {
			url: ' https://tellme360.media',
			should_fallback: true
		}
	}
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
			className={`${cinzelFont.variable} ${poppinsFont.variable} ${quicksandFont.variable}`}
		>
			{/* <head>
        <link rel="preload" href={tellme_logo.src} />
      </head> */}
			<body
				style={{
					fontFamily: poppinsFont.style.fontFamily
				}}
				className='w-full'
			>
				<Providers>
					<Navbar tellme_logo={tellme_logo} />
					{children}
					<Footer />
					<script
						id='globalWebSiteSchema'
						key='globalWebSiteSchema'
						type='application/ld+json'
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(websiteJsonLd)
						}}
					/>
					<script
						id='globalOrganizationSchema'
						key='globalOrganizationSchema'
						type='application/ld+json'
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(organizationJsonLd)
						}}
					/>
				</Providers>
				<Analytics />
				<SpeedInsights />
			</body>
			{/* <GoogleAnalytics gaId="G-0ZTPKHTLJV" /> */}
		</html>
	);
}
