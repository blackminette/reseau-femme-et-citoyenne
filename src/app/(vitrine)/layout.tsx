import React from 'react';

export default function VitrineLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-[#eedeff] text-[#2b1459]">
            <main className="flex-1">{children}</main>
        </div>
    );
}
