'use client';

import tellme_logo from '@/assets/images/tellme_logo.png';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface ProtectedImageWrapperProps {
	children: React.ReactNode;
}

export default function ProtectedImageWrapper({
	children
}: ProtectedImageWrapperProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Prevent right-click context menu
		const handleContextMenu = (e: MouseEvent) => {
			e.preventDefault();
			return false;
		};

		// Prevent drag and drop
		const handleDragStart = (e: DragEvent) => {
			e.preventDefault();
			return false;
		};

		// Prevent text selection
		const handleSelectStart = (e: Event) => {
			e.preventDefault();
			return false;
		};

		// Prevent image dragging
		const handleDrag = (e: DragEvent) => {
			e.preventDefault();
			return false;
		};

		const container = containerRef.current;
		if (container) {
			container.addEventListener('contextmenu', handleContextMenu);
			container.addEventListener('dragstart', handleDragStart);
			container.addEventListener('selectstart', handleSelectStart);
			container.addEventListener('drag', handleDrag);

			// Also prevent on all images inside
			const images = container.querySelectorAll('img');
			images.forEach((img) => {
				img.addEventListener('dragstart', handleDragStart);
				img.addEventListener('contextmenu', handleContextMenu);
				img.style.userSelect = 'none';
				(img.style as any).webkitUserDrag = 'none';
				img.style.pointerEvents = 'none';
			});

			return () => {
				container.removeEventListener('contextmenu', handleContextMenu);
				container.removeEventListener('dragstart', handleDragStart);
				container.removeEventListener('selectstart', handleSelectStart);
				container.removeEventListener('drag', handleDrag);
				images.forEach((img) => {
					img.removeEventListener('dragstart', handleDragStart);
					img.removeEventListener('contextmenu', handleContextMenu);
				});
			};
		}
	}, []);

	return (
		<div
			ref={containerRef}
			className='relative h-full w-full'
			style={{
				userSelect: 'none',
				WebkitUserSelect: 'none',
				MozUserSelect: 'none',
				msUserSelect: 'none'
			}}
		>
			{children}
			{/* Visible watermark logos - appears in screenshots */}
			{/* Center watermark */}
			<div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
				<div className='relative opacity-25'>
					<Image
						src={tellme_logo}
						alt='Tellme360 Watermark'
						width={200}
						height={60}
						className='h-auto w-32 sm:w-40 md:w-48 lg:w-56'
						priority
						unoptimized
					/>
				</div>
			</div>
			{/* Top-left watermark */}
			<div className='pointer-events-none absolute top-4 left-4 z-10 opacity-20 sm:top-6 sm:left-6'>
				<Image
					src={tellme_logo}
					alt='Tellme360 Watermark'
					width={150}
					height={45}
					className='h-auto w-24 sm:w-32'
					priority
					unoptimized
				/>
			</div>
			{/* Bottom-right watermark */}
			<div className='pointer-events-none absolute right-4 bottom-4 z-10 opacity-20 sm:right-6 sm:bottom-6'>
				<Image
					src={tellme_logo}
					alt='Tellme360 Watermark'
					width={150}
					height={45}
					className='h-auto w-24 sm:w-32'
					priority
					unoptimized
				/>
			</div>
			{/* Additional watermark pattern for better protection */}
			<div
				className='pointer-events-none absolute inset-0 z-10'
				style={{
					background: `repeating-linear-gradient(
						45deg,
						transparent,
						transparent 150px,
						rgba(0,0,0,0.02) 150px,
						rgba(0,0,0,0.02) 151px
					)`,
					mixBlendMode: 'multiply'
				}}
				aria-hidden='true'
			/>
		</div>
	);
}
