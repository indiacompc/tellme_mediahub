import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'storage.googleapis.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'img.youtube.com',
				pathname: '/**',
			},
		],
		// Increase cache time to reduce repeated fetches
		minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
		// Optimized device sizes to reduce bandwidth - smaller sizes for mobile/tablet
		deviceSizes: [640, 750, 828, 1080, 1200],
		imageSizes: [16, 32, 48, 64, 96, 128, 256],
		// Increase timeout for slow upstream servers
		formats: ['image/avif', 'image/webp'],
	},
	// Increase timeout for image optimization
	experimental: {
		optimizePackageImports: ['@/components'],
	},
	compress: true,
	poweredByHeader: false,
};

export default nextConfig;
