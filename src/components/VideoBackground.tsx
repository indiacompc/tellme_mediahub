'use client';
import React from 'react';

const VideoBackground: React.FC = () => {
	return (
		<video
			autoPlay
			muted
			loop
			controls={false}
			onContextMenu={(e) => e.preventDefault()}
			playsInline
			preload='auto'
			id='myVideo'
			className='absolute inset-0 h-full min-h-full w-full min-w-full object-cover'
			style={{
				objectFit: 'cover',
				width: '100%',
				height: '100%'
			}}
		>
			<source src='/homepage_hero_section_background.webm' type='video/mp4' />
		</video>
	);
};

export default VideoBackground;
