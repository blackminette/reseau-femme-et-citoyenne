// * src/components/AdminSideMenu.tsx
'use client';

/**
 * DESCRIPTION :
 * Contenu du menu latéral de l'espace admin.
 * Fournit des liens de navigation simples étirés sur toute la largeur
 * du bloc pour s'adapter à la taille de la barre fixe.
 */

import Link from 'next/link';
import React from 'react';

export default function AdminSideMenu() {
    return (
        <div className="w-full flex flex-col gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                Navigation
            </h2>

            <section className="flex flex-col gap-1 w-full">
                <Link href="/admin" className="w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 rounded-lg transition-colors block">
                    Dashboard
                </Link>

                <Link href="/admin/membres" className="w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 rounded-lg transition-colors block">
                    Gérer les membres
                </Link>
            </section>
        </div>
    );
}