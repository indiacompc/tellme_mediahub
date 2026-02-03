/* eslint-disable */
import type { Config } from 'tailwindcss';
// @ts-ignore - Tailwind config uses CommonJS in some cases
// import DarkModeStratergy from 'typ'
// import { nextui } from "@nextui-org/react";
// import flowbite from "flowbite-react/tailwind";
// const flowbite = require("flowbite-react");
// import flowbite from "flowbite/plugin";
// import plugin from 'tailwindcss/plugin';
// const {heroui} = require("@heroui/theme");
// const darkModeStatergies: DarkModeStrategy = ['class']
// import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
	darkMode: 'class',
	content: [
		// "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
		'./src/**/*.{ts,tsx}'
		// "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
		// "./node_modules/@heroui/theme/dist/components/breadcrumbs.{js,ts,jsx,tsx}",
	],
	prefix: '',
	theme: {
		// debugScreens: {
		// 	position: [
		// 		'bottom',
		// 		'left'
		// 	],
		// 	style: {
		// 		backgroundColor: '#C0FFEE',
		// 		color: 'bundlack'
		// 	}
		// },
		//  container: {
		// 		screens: {
		// 			'2xl': '1536px',
		// 		},
		// 	},
		// screens: {
		// 	'xs': '475px',
		// 	...defaultTheme.screens
		// },
		screens: {
			xs: '360px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
			'3xl': '1920px' // optional
		},
		extend: {
			// screens: {
			// 	'2xl': {
			// 		min: '1400px'
			// 	}
			// },

			fontFamily: {
				cinzel: ['var(--font-cinzel)'],
				poppins: ['var(--font-poppins)'],
				quicksand: ['var(--font-quicksand)'],
				primary: ['var(--font-primary)'],
				heading: ['var(--font-heading)'],
				secondary: ['var(--font-secondary)'],
				// caledea: [
				// 	'var(--font-caledea)'
				// ],
				aileron: ['var(--font-aileron)'],
				abel: ['var(--font-abel)'],
				'catchy-mager': ['var(--font-catchy-mager)'],
				'tan-angleton': ['var(--font-tan-angleton)']
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
					'6': 'hsl(var(--chart-6))',
					'7': 'hsl(var(--chart-7))',
					'8': 'hsl(var(--chart-8))',
					'9': 'hsl(var(--chart-9))',
					'10': 'hsl(var(--chart-10))',
					'11': 'hsl(var(--chart-11))',
					'12': 'hsl(var(--chart-12))',
					'13': 'hsl(var(--chart-13))',
					'14': 'hsl(var(--chart-14))',
					'15': 'hsl(var(--chart-15))',
					'16': 'hsl(var(--chart-16))',
					'17': 'hsl(var(--chart-17))',
					'18': 'hsl(var(--chart-18))',
					'19': 'hsl(var(--chart-19))',
					'20': 'hsl(var(--chart-20))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				typing: {
					'0%': {
						width: '0%',
						visibility: 'hidden'
					},
					'100%': {
						width: '100%'
					}
				},
				blink: {
					'50%': {
						borderColor: 'transparent'
					},
					'100%': {
						borderColor: 'white'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				fadein: {
					'0%': {
						opacity: '0',
						transform: 'translateY(100px)',
						filter: 'blur(33px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)',
						filter: 'blur(0)'
					}
				},
				runningTime: {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				}
			},
			animation: {
				typing: 'typing 2s steps(20) infinite alternate, blink .7s infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				fadein: 'fadein 1s ease-in-out forwards',
				runningTime: 'runningTime 7s linear forwards'
			}
		}
	},
	plugins: [
		// require('@tailwindcss/typography'),
		// require('@tailwindcss/forms'),
		// flowbite,
		// require("@headlessui/tailwindcss"),
		// require('@vidstack/react/tailwind.cjs')({
		// 	// Optimize output by specifying player selector.
		// 	selector: '.media-player',
		// 	// Change the media variants prefix.
		// 	prefix: 'media'
		// })

		// require('tailwindcss-react-aria-components'),
		// require("tailwindcss-animate"),
		// require('tailwindcss-debug-screens'),
		// plugin(({ addVariant }: any) => {
		// 	addVariant('fullscreen', '&:fullscreen');
		// 	addVariant('group-fullscreen', ':merge(.group):fullscreen &');
		// 	addVariant('peer-fullscreen', ':merge(.peer):fullscreen ~ &');
		// }),
		// heroui()
		// nextui()
	]
};

export default config;
