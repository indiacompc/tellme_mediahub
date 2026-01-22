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
	  preload="auto"
	  id="myVideo"
	  className="absolute inset-0 w-full h-full object-cover min-h-full min-w-full"
	  style={{
		objectFit: 'cover',
		width: '100%',
		height: '100%',
	  }}
	>
	  <source src="/bg_video.mp4" type="video/mp4" />
	</video>
  );
};

export default VideoBackground;
