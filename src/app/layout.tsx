// * src/app/layout.tsx
import React from 'react';
import '@/app/globals.css';
import Header from '@/components/Header';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';

export const metadata = {
    title: 'Mon Projet Association',
    description: 'Application de gestion avec contrôle des rôles (RBAC)',
};

/**
 * Root Layout obligatoire (Server Component).
 * Il contient les balises html, body et les métadonnées.
 */

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className="antialiased bg-slate-100 text-slate-900 flex flex-col min-h-screen">
                <Header />
                <main className="grow flex flex-col">
                    {/* On passe par un wrapper client pour décider conditionnellement d'afficher le Footer */}
                    <AppLayoutWrapper>
                        {children}
                    </AppLayoutWrapper>
                </main>
            </body>
        </html>
    );
}