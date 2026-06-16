// * src/app/layout.tsx
import React from 'react';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export const metadata = {
    title: 'Mon Projet Association',
    description: 'Application de gestion avec contrôle des rôles (RBAC)',
};

/**
 * Root Layout obligatoire. 
 * Il DOIT contenir les balises html et body pour tout le projet.
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className="antialiased bg-slate-100 text-slate-900 flex flex-col min-h-screen">
                {/* C'est ici que Next.js viendra injecter tes différentes pages */}
                <Header />
                <main className="grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}