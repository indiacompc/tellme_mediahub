import { siteUrl } from '@/auth/ConfigManager';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	const baseUrl = siteUrl.replace(/\/$/, '');

	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/api/', '/_next/']
			}
		],
		sitemap: `${baseUrl}/sitemap.xml`
	};
}
