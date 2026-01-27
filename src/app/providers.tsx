'use client';
// import { NextUIProvider } from "@nextui-org/react";
// import { SessionProvider } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// app/providers.tsx

// import { Fragment } from "react";
import { ThemeProvider } from '@/components/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
	// const router = useRouter();
	// return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
	// SessionProvider removed - NextAuth API route not configured
	// If you need authentication, create /api/auth/[...nextauth]/route.ts
	return (
		<ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
			{children}
		</ThemeProvider>
	);
}
