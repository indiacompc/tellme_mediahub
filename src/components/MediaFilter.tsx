'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MediaFilter() {
	const pathname = usePathname();

	// Determine current active section
	let current = 'videos';
	if (pathname.includes('/shorts')) {
		current = 'shorts';
	} else if (pathname.includes('/images')) {
		current = 'images';
	}

	return (
		<div className='mb-6 flex justify-center sm:mb-8'>
			<div className='bg-muted/50 border-border inline-flex items-center rounded-lg border p-1 shadow-sm'>
				<Link
					href='/'
					className={`relative rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 sm:px-8 sm:py-2.5 sm:text-base ${
						current === 'videos'
							? 'bg-primary text-primary-foreground shadow-sm'
							: 'text-muted-foreground hover:text-foreground'
					}`}
				>
					Videos
				</Link>
				<Link
					href='/shorts'
					className={`relative rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 sm:px-8 sm:py-2.5 sm:text-base ${
						current === 'shorts'
							? 'bg-primary text-primary-foreground shadow-sm'
							: 'text-muted-foreground hover:text-foreground'
					}`}
				>
					Shorts
				</Link>
				<Link
					href='/images'
					className={`relative rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 sm:px-8 sm:py-2.5 sm:text-base ${
						current === 'images'
							? 'bg-primary text-primary-foreground shadow-sm'
							: 'text-muted-foreground hover:text-foreground'
					}`}
				>
					Images
				</Link>
			</div>
		</div>
	);
}
