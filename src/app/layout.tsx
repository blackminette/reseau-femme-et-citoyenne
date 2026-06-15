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
        <html lang="fr" className={cn("font-sans", geist.variable)}>
            <body className="antialiased bg-slate-100 text-slate-900 min-h-screen flex flex-col">
                <Header />
                {/* C'est ici que Next.js viendra injecter tes différentes pages */}
                <main className='flex-1 flex flex-col'>
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}