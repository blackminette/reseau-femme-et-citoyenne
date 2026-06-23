// * src/app/layout.tsx
import React from 'react';
import '@/app/globals.css';
import Header from '@/components/Header';
export const metadata = {
    title: 'Mon Projet Association',
    description: 'Application de gestion avec contrôle des rôles (RBAC)',
};

/**
 * Root Layout obligatoire (balises html/body).
 * Header global conservé ; pas de Footer global → les dashboards n'ont pas de footer
 * et la vitrine garde son propre VitrineFooter via (vitrine)/layout.tsx.
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
                    {children}
                </main>
            </body>
        </html>
    );
}