'use client';

import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import PlainAnimatedBackground from './plain-animated-background';

interface WithLayoutProps {
    children: ReactNode;
}

export default function WithLayout({ children }: WithLayoutProps) {
    const router = useRouter();
    const pathname = router.pathname;

    // Define which routes should use which layout
    const getLayout = () => {
        // Routes that should use plain-animated-background
        if (pathname === '/archive' || pathname === '/gen-qr') {
            return <PlainAnimatedBackground />;
        }
        
        // Default: no layout
        return null;
    };

    return (
        <>
            {getLayout()}
            {children}
        </>
    );
}
