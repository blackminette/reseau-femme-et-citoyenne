// * src/app/layout.tsx
import React from 'react';
import '@/app/globals.css';
export const metadata = {
    title: 'Mon Projet Association',
    description: 'Application de gestion avec contrôle des rôles (RBAC)',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className="antialiased bg-slate-100 text-slate-900 flex flex-col min-h-screen">
                {children}
            </body>
        </html>
    );
}