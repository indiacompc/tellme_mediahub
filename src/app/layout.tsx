import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
// import tellme_logo from '@/assets/images/tellme_logo.png'
// import Footer from "@/components/Footer";
import { ubuntuFont } from '@/assets/fonts';
// import Navbar from "@/components/Navbar";
// import Footer from '@/components/Footer';
// import dynamic from "next/dynamic";
// import { GoogleAnalytics } from '@next/third-parties/google';
// import { Organization, WebSite, WithContext } from 'schema-dts';
import tellme_logo from '@/assets/images/tellme_logo.png';
import { organizationJsonLd, websiteJsonLd } from '@/lib/globalVariables';

// const Navbar = dynamic(() => import('@/components/Navbar'), {
//   ssr: false
// })

export const fetchCache = 'default-no-store';

// export const revalidate = 60;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  //maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ebe8db' },
    //{ media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tellmemediahub.com'),
  title: 'Tellme Media Hub',
  description: `${websiteJsonLd.description}`,
  keywords: `${websiteJsonLd.keywords}`,
  generator: 'Next.js',
  applicationName: 'Tellme Media Hub',
  referrer: 'origin-when-cross-origin',

  authors: [{ name: 'Shrikant Dhayaje', url: 'https://github.com/shriekdj' }],
  creator: 'Indiacom And Tellme Digiinfotech Web Development Team 2024',
  publisher: 'Tellme Digiinfotech Private Limited',
  verification: {
    // google: 'z-6w4swAqLN2x43xos67AMnpmPe2ilYVVNo9a5oRzLw',
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
      'apple-mobile-web-app-capable': 'yes',
    },
  },
  // manifest: '/manifest.json',
  icons: {
    apple: '/icon-192x192.png',
  },
  openGraph: {
    title: 'Tellme Media Hub',
    description: `${websiteJsonLd.description}`,
    siteName: 'Tellme Media Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tellme Media Hub',
    description: `${websiteJsonLd.description}`,
    creator: '@TeamIndiacom',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
      'max-snippet': -1,
    },
  },
  appLinks: {
    web: {
      url: 'https://tellmemediahub.com',
      should_fallback: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <head>
        <link rel="preload" href={tellme_logo.src} />
      </head> */}
      <body
        style={{
          // backgroundImage: `url(${bgImage.src})`,
          fontFamily: ubuntuFont.style.fontFamily,
        }}
        className="w-full"
      >
        <Providers>
          {/* <Navbar tellme_logo={tellme_logo} /> */}
          {children}
          {/* <Footer /> */}
          <script
            id="globalWebSiteSchema"
            key="globalWebSiteSchema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteJsonLd),
            }}
          />
          <script
            id="globalOrganizationSchema"
            key="globalOrganizationSchema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd),
            }}
          />
        </Providers>
      </body>
      {/* <GoogleAnalytics gaId="G-0ZTPKHTLJV" /> */}
    </html>
  );
}
