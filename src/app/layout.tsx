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
    title: {
        default: 'Réseau Femme et Citoyenne | Solidarité & Inclusion',
        template: '%s | Réseau Femme et Citoyenne'
    },
    description: 'Association de Solidarité et d\'Éducation aux Alpes-Maritimes : inclusion, soutien aux femmes, éducation numérique et éco-citoyenneté des enfants.',
    keywords: ['association', 'Réseau Femme et Citoyenne', 'solidarité', 'éducation', 'numérique', 'Nice', 'Alpes-Maritimes'],
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
        <html lang="fr" data-scroll-behavior="smooth" className={geist.variable}>
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