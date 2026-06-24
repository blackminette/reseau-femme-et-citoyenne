// * src/app/layout.tsx
import React from 'react';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


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
        <html lang="fr" className={geist.variable}>
            <body className={cn("antialiased bg-slate-100 text-slate-900 flex flex-col min-h-screen font-sans", geist.className)}>
                {/* C'est ici que Next.js viendra injecter tes différentes pages */}
                <Header />
                <main className="grow flex flex-col">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}