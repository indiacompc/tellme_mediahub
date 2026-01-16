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
	  preload="none"
	  id="myVideo"
	  className="absolute w-full h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
	>
	  <source src="/bg_video.mp4" type="video/mp4" />
	</video>
  );
};

export default VideoBackground;
