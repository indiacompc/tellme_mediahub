import { Metadata } from 'next';
import { siteUrl } from '@/auth/ConfigManager';

export const metadata: Metadata = {
	title: 'Image Gallery | Tellme Media',
	description: 'Browse our extensive collection of high-quality stock images organized by category. Find the perfect image for your project from our curated gallery of professional photography.',
	keywords: 'stock images, stock photos, image gallery, photography, professional images, image library, Tellme Media',
	alternates: {
		canonical: `${siteUrl.replace(/\/$/, '')}/images`
	},
	openGraph: {
		title: 'Image Gallery | Tellme Media',
		description: 'Browse our extensive collection of high-quality stock images organized by category.',
		type: 'website',
		url: `${siteUrl.replace(/\/$/, '')}/images`,
		siteName: 'Tellme Media'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Image Gallery | Tellme Media',
		description: 'Browse our extensive collection of high-quality stock images organized by category.'
	}
};

export default function ImagesLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
