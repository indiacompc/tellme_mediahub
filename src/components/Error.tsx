'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
	message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
	return (
		<div className='flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20'>
			<div className='border-destructive/50 bg-destructive/10 w-full max-w-md rounded-lg border p-6 text-center sm:p-8'>
				<AlertCircle className='text-destructive mx-auto mb-4 h-12 w-12 sm:h-16 sm:w-16' />
				<h3 className='text-foreground mb-2 text-lg font-semibold sm:text-xl'>
					Unable to Load Videos
				</h3>
				<p className='text-muted-foreground text-sm sm:text-base'>{message}</p>
				<button
					onClick={() => window.location.reload()}
					className='bg-primary text-primary-foreground hover:bg-primary/90 mt-6 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200'
				>
					Try Again
				</button>
			</div>
		</div>
	);
}
