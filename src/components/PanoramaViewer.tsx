'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
// import { OrbitControls } from '@react-three/drei';
import { cn } from '@/shadcn_data/lib/utils';
import { DeviceOrientationControls } from '@react-three/drei';
import {
	createXRStore,
	useXRInputSourceState,
	XR,
	XROrigin
} from '@react-three/xr';
import * as THREE from 'three';

interface PanoramaViewerProps extends React.HTMLAttributes<HTMLDivElement> {
	imageUrl: string;
}
const Locomotion = () => {
	const controller = useXRInputSourceState('controller', 'right');
	const ref = useRef<THREE.Group>(null);
	useFrame((_, delta) => {
		if (ref.current == null || controller == null) {
			return;
		}
		const thumstickState = controller.gamepad['xr-standard-thumbstick'];
		if (thumstickState == null) {
			return;
		}
		ref.current.position.x += (thumstickState.xAxis ?? 0) * delta;
		ref.current.position.z += (thumstickState.yAxis ?? 0) * delta;
	});
	return <XROrigin ref={ref} />;
};

const store = createXRStore({
	emulate: false
});

// Custom Controls for zoom and manual camera rotation
const ManualControls = ({
	enabled,
	cameraRotation
}: {
	enabled: boolean;
	cameraRotation: React.RefObject<{ x: number; y: number }>;
}) => {
	const { camera, gl } = useThree();

	useEffect(() => {
		if (!('fov' in camera)) return;
		const cam = camera as THREE.PerspectiveCamera;

		let isDragging = false;
		let lastTouch: Touch | null = null;
		let lastDistance = 0;

		const handleWheel = (e: WheelEvent) => {
			if (!enabled) return;
			e.preventDefault(); // ⬅️ This line prevents the page from scrolling
			const delta = e.deltaY * 0.01;
			cam.fov = THREE.MathUtils.clamp(cam.fov + delta * 5, 30, 100);
			cam.updateProjectionMatrix();
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!enabled || !isDragging) return;
			cameraRotation.current.x += e.movementX * 0.002;
			cameraRotation.current.y += e.movementY * 0.002;
			cameraRotation.current.y = THREE.MathUtils.clamp(
				cameraRotation.current.y,
				-Math.PI / 2,
				Math.PI / 2
			);
		};

		const handleTouchStart = (e: TouchEvent) => {
			if (!enabled) return;
			if (e.touches.length === 1) {
				lastTouch = e.touches[0];
				isDragging = true;
			} else if (e.touches.length === 2) {
				lastDistance = getTouchDistance(e.touches[0], e.touches[1]);
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (!enabled) return;

			if (e.touches.length === 1 && isDragging && lastTouch) {
				const deltaX = e.touches[0].clientX - lastTouch.clientX;
				const deltaY = e.touches[0].clientY - lastTouch.clientY;
				cameraRotation.current.x += deltaX * 0.002;
				cameraRotation.current.y += deltaY * 0.002;
				cameraRotation.current.y = THREE.MathUtils.clamp(
					cameraRotation.current.y,
					-Math.PI / 2,
					Math.PI / 2
				);
				lastTouch = e.touches[0];
			} else if (e.touches.length === 2) {
				const newDistance = getTouchDistance(e.touches[0], e.touches[1]);
				const delta = lastDistance - newDistance;
				cam.fov = THREE.MathUtils.clamp(cam.fov + delta * 0.05, 30, 100);
				cam.updateProjectionMatrix();
				lastDistance = newDistance;
			}
		};

		const handleTouchEnd = () => {
			isDragging = false;
			lastTouch = null;
		};

		const getTouchDistance = (t1: Touch, t2: Touch) => {
			return Math.sqrt(
				Math.pow(t1.clientX - t2.clientX, 2) +
					Math.pow(t1.clientY - t2.clientY, 2)
			);
		};

		const handleMouseDown = (e: MouseEvent) => {
			if (e.button === 0) isDragging = true;
		};
		const handleMouseUp = () => {
			isDragging = false;
		};

		gl.domElement.addEventListener('wheel', handleWheel, { passive: false });
		gl.domElement.addEventListener('mousemove', handleMouseMove);
		gl.domElement.addEventListener('mousedown', handleMouseDown);
		gl.domElement.addEventListener('mouseup', handleMouseUp);
		gl.domElement.addEventListener('touchstart', handleTouchStart, {
			passive: false
		});
		gl.domElement.addEventListener('touchmove', handleTouchMove, {
			passive: false
		});
		gl.domElement.addEventListener('touchend', handleTouchEnd);

		return () => {
			gl.domElement.removeEventListener('wheel', handleWheel);
			gl.domElement.removeEventListener('mousemove', handleMouseMove);
			gl.domElement.removeEventListener('mousedown', handleMouseDown);
			gl.domElement.removeEventListener('mouseup', handleMouseUp);
			gl.domElement.removeEventListener('touchstart', handleTouchStart);
			gl.domElement.removeEventListener('touchmove', handleTouchMove);
			gl.domElement.removeEventListener('touchend', handleTouchEnd);
		};
	}, [enabled, camera, gl, cameraRotation]);

	useFrame(() => {
		camera.rotation.set(cameraRotation.current.y, cameraRotation.current.x, 0);
	});

	return null;
};

const SphereWithImageTexture = ({ imageUrl }: { imageUrl: string }) => {
	const [texture, setTexture] = useState<THREE.Texture | null>(null);

	useEffect(() => {
		new THREE.TextureLoader().load(
			imageUrl,
			(loadedTexture) => {
				loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
				loadedTexture.colorSpace = THREE.SRGBColorSpace;
				setTexture(loadedTexture);
			},
			undefined,
			(err) => {
				console.error('Failed to load texture:', err);
			}
		);
	}, [imageUrl]);

	if (!texture) return null;

	return (
		<mesh>
			<sphereGeometry args={[500, 60, 40]} />
			<meshBasicMaterial map={texture} side={THREE.BackSide} />
		</mesh>
	);
};

const PanoramaViewer = (props: PanoramaViewerProps) => {
	const { imageUrl, children, className, ...remianingProps } = props;
	// const cameraRotation = useRef({ x: 0, y: 0 });
	const cameraRotation = useRef({ x: THREE.MathUtils.degToRad(270), y: 0 });
	// const [orbitEnabled, setOrbitEnabled] = useState(true);

	return (
		<div className={cn('relative size-full', className)} {...remianingProps}>
			{/* SEO + Optimization */}
			{/* <Image
        id={imageId}
				src={imageUrl}
				alt="360 Panorama View"
				fill
				priority
				sizes="100vw"
				className={cn(
					'object-cover transition-opacity duration-700',
					canvasVisible ? 'opacity-0' : 'opacity-100 animate-pulse'
				)}
        onLoad={() => setCanvasVisible(true)}
			/> */}

			{/* Hidden img to be used for canvas texture */}
			{/* <img
				id={imageId}
				src={imageUrl}
				alt=""
				className="hidden"
				onLoad={() => setCanvasVisible(true)}
			/> */}
			{children && children}

			<Canvas
				// camera={{ position: [0, 0, 0.1], fov: 75 }}
				// onCreated={() => setCanvasVisible(true)}
				className='absolute inset-0 z-0 rounded-lg'
				camera={{ fov: 75, position: [0, 0, 0.1] }}
				onCreated={({ gl }) => {
					// setCanvasVisible(true)
					gl.outputColorSpace = THREE.SRGBColorSpace;
					gl.toneMapping = THREE.NoToneMapping;
				}}
				onContextMenu={(e) => e.preventDefault()}
			>
				<XR store={store}>
					<ambientLight />
					<ManualControls enabled={true} cameraRotation={cameraRotation} />
					<DeviceOrientationControls />
					<Locomotion />
					<SphereWithImageTexture imageUrl={imageUrl} />
				</XR>
				{/* <ambientLight /> */}
				{/* <ManualControls enabled={true} cameraRotation={cameraRotation} />
					<DeviceOrientationControls /> */}
			</Canvas>
			{/* <style jsx>{`
			.webxr-button { display: none !important; }
			`}</style> */}
		</div>
	);
};

export default PanoramaViewer;
