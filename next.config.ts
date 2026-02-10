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
		// Add device sizes for better optimization
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		// Increase timeout for slow upstream servers
		formats: ['image/avif', 'image/webp'],
	},
	// Increase timeout for image optimization
	experimental: {
		optimizePackageImports: ['@/components'],
	},
};

export default nextConfig;
