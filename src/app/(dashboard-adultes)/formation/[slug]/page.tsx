// * src/app/(dashboard-adultes)/formation/[slug]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import Parcours from '../Parcours';
import { getModule } from '../modules-data';

/**
 * Affiche le parcours d'un module défini dans modules-data (moteur générique).
 * Client component : tout reste côté navigateur, on évite de sérialiser les
 * composants d'icônes entre serveur et client.
 */
export default function ModuleParcoursPage() {
    const params = useParams();
    const slug = String(params?.slug ?? '');
    const module = getModule(slug);

    // Module inexistant ou pas encore de contenu (ex: « Bientôt disponible »).
    if (!module || !module.etapes) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-500">
                    <Clock className="h-7 w-7" />
                </div>
                <h1 className="mt-4 text-xl font-black text-violet-950">Module bientôt disponible</h1>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Ce module n&apos;est pas encore prêt. Reviens bientôt — d&apos;autres parcours arrivent !
                </p>
                <Link href="/formation" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md hover:from-violet-700 hover:to-purple-700">
                    <ArrowLeft className="h-4 w-4" /> Retour au catalogue
                </Link>
            </div>
        );
    }

    return <Parcours module={module} />;
}
