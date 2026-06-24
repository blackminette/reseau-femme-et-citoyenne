import React from 'react';
import VitrineHeader from '@/components/vitrine/VitrineHeader';
import VitrineFooter from '@/components/vitrine/VitrineFooter';

export default function VitrineLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-300 text-black">
            <VitrineHeader />
            <main className="flex-1">{children}</main>
            <VitrineFooter />
        </div>
    );
}
