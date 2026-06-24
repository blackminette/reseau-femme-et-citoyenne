// * src/app/layout.tsx
import React from 'react';
import '@/app/globals.css';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-sans'
});

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
        <html lang="fr" className={geist.variable}>
            <body className={cn("antialiased bg-slate-100 text-slate-900 flex flex-col min-h-screen font-sans", geist.className)}>
                <main className="grow flex flex-col">
                    {/* On passe par un wrapper client pour décider conditionnellement d'afficher le Header/Footer */}
                    <AppLayoutWrapper>
                        {children}
                    </AppLayoutWrapper>
                </main>
            </body>
        </html>
    );
}