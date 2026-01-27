import { Open_Sans, Sofia, Ubuntu } from 'next/font/google';

export const openSansFont = Open_Sans({
	display: 'swap',
	weight: '400',
	subsets: ['latin'],
	preload: true,
	fallback: [
		'ui-sans-serif',
		'system-ui',
		'-apple-system',
		'BlinkMacSystemFont',
		'Segoe UI',
		'Roboto',
		'Helvetica Neue',
		'Arial',
		'Noto Sans',
		'sans-serif',
		'Apple Color Emoji',
		'Segoe UI Emoji',
		'Segoe UI Symbol',
		'Noto Color Emoji'
	]
});

export const ubuntuFont = Ubuntu({
	display: 'swap',
	weight: '400',
	subsets: ['latin'],
	preload: true,
	fallback: [
		'ui-sans-serif',
		'system-ui',
		'-apple-system',
		'BlinkMacSystemFont',
		'Segoe UI',
		'Roboto',
		'Helvetica Neue',
		'Arial',
		'Noto Sans',
		'sans-serif',
		'Apple Color Emoji',
		'Segoe UI Emoji',
		'Segoe UI Symbol',
		'Noto Color Emoji'
	]
});

export const sofiaFont = Sofia({
	display: 'swap',
	weight: '400',
	subsets: ['latin'],
	preload: true,
	fallback: [
		// 'cursive',
		'ui-sans-serif',
		'system-ui',
		'-apple-system',
		'BlinkMacSystemFont',
		'Segoe UI',
		'Roboto',
		'Helvetica Neue',
		'Arial',
		'Noto Sans',
		'sans-serif',
		'Apple Color Emoji',
		'Segoe UI Emoji',
		'Segoe UI Symbol',
		'Noto Color Emoji'
	]
});
