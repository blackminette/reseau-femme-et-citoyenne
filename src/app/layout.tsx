// * src/app/layout.tsx
import React from 'react';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
            <body className="antialiased bg-slate-100 text-slate-900">
                <Header />
                {/* C'est ici que Next.js viendra injecter tes différentes pages */}
                <main className='flex-grow'>
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}