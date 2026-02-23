'use client';

import React from 'react';

const IframeClient = (
    props: React.JSX.IntrinsicAttributes &
        React.ClassAttributes<HTMLIFrameElement> &
        React.IframeHTMLAttributes<HTMLIFrameElement>
) => {
	const {
		suppressHydrationWarning,
		title,
		loading = 'lazy',
		...remainingProps
	} = { ...props };
	return (
		<iframe
			{...remainingProps}
			title={title || 'Embedded content'}
			loading={loading}
			suppressHydrationWarning={
				suppressHydrationWarning ? suppressHydrationWarning : true
			}
		/>
	);
};

export default IframeClient;
