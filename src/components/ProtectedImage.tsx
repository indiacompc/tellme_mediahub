'use client';

import ImageWithLoading from '@/components/ImageWithLoading';
import { useEffect, useRef, useState } from 'react';

interface ProtectedImageProps {
	src: string;
	alt: string;
	width: number;
	height: number;
	className?: string;
	style?: React.CSSProperties;
	sizes?: string;
	priority?: boolean;
	unoptimized?: boolean;
}

export default function ProtectedImage({
	src,
	alt,
	width,
	height,
	className,
	style,
	sizes,
	priority,
	unoptimized
}: ProtectedImageProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [imageLoaded, setImageLoaded] = useState(false);

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

		// Prevent common screenshot shortcuts (though these can't be fully prevented)
		const handleKeyDown = (e: KeyboardEvent) => {
			// Prevent Print Screen (can't fully block but can show warning)
			if (e.key === 'PrintScreen') {
				e.preventDefault();
			}
		};

		const container = containerRef.current;
		if (container) {
			container.addEventListener('contextmenu', handleContextMenu);
			container.addEventListener('dragstart', handleDragStart);
			container.addEventListener('selectstart', handleSelectStart);
			document.addEventListener('keydown', handleKeyDown);

			return () => {
				container.removeEventListener('contextmenu', handleContextMenu);
				container.removeEventListener('dragstart', handleDragStart);
				container.removeEventListener('selectstart', handleSelectStart);
				document.removeEventListener('keydown', handleKeyDown);
			};
		}
	}, []);

	// Add invisible watermark overlay using canvas
	useEffect(() => {
		if (!imageLoaded || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size
		canvas.width = width;
		canvas.height = height;

		// Create invisible watermark pattern
		ctx.globalAlpha = 0.01; // Very transparent
		ctx.fillStyle = '#000000';
		ctx.font = '12px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		// Add watermark text pattern across the image
		const watermarkText = 'Tellme360';
		const spacing = 200;

		for (let x = 0; x < width; x += spacing) {
			for (let y = 0; y < height; y += spacing) {
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(-45 * (Math.PI / 180));
				ctx.fillText(watermarkText, 0, 0);
				ctx.restore();
			}
		}

		// Add additional pattern
		ctx.globalAlpha = 0.005;
		for (let x = spacing / 2; x < width; x += spacing) {
			for (let y = spacing / 2; y < height; y += spacing) {
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(45 * (Math.PI / 180));
				ctx.fillText(watermarkText, 0, 0);
				ctx.restore();
			}
		}
	}, [imageLoaded, width, height]);

	return (
		<div
			ref={containerRef}
			className='relative select-none'
			style={{
				userSelect: 'none',
				WebkitUserSelect: 'none',
				MozUserSelect: 'none',
				msUserSelect: 'none'
			}}
		>
			{/* Main Image */}
			<div className='relative' style={{ pointerEvents: 'none' }}>
				<ImageWithLoading
					src={src}
					alt={alt}
					width={width}
					height={height}
					className={className}
					style={
						{
							...style,
							userSelect: 'none',
							WebkitUserDrag: 'none',
							KhtmlUserDrag: 'none',
							MozUserDrag: 'none',
							OUserDrag: 'none',
							userDrag: 'none',
							pointerEvents: 'none'
						} as React.CSSProperties
					}
					sizes={sizes}
					priority={priority}
					unoptimized={unoptimized}
					onLoad={() => setImageLoaded(true)}
				/>
			</div>

			{/* Invisible Watermark Canvas Overlay */}
			<canvas
				ref={canvasRef}
				className='pointer-events-none absolute inset-0 z-10'
				style={{
					mixBlendMode: 'multiply',
					opacity: 0.1
				}}
			/>

			{/* Additional Protection Layer */}
			<div
				className='pointer-events-none absolute inset-0 z-20'
				style={{
					background: 'transparent',
					userSelect: 'none',
					WebkitUserSelect: 'none'
				}}
				onDragStart={(e) => e.preventDefault()}
				onContextMenu={(e) => e.preventDefault()}
			/>
		</div>
	);
}
