// * src/components/AppLayoutWrapper.tsx
'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isDashboardAdmin = pathname?.startsWith('/admin');

    return (
        <>
            <div className="grow flex flex-col w-full">
                {children}
            </div>
            {!isDashboardAdmin && <Footer />}
        </>
    );
}