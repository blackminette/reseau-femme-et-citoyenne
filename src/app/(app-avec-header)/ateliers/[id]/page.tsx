// src/app/(app-avec-header)/ateliers/[id]/page.tsx
import React from 'react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AtelierDetailPage({ params }: PageProps) {
    // On récupère l'id depuis l'URL de manière asynchrone (Standard Next.js 15+)
    const { id } = await params;

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Bouton Retour */}
                <Link href="/ateliers" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 gap-2 mb-6 transition-colors">
                    ⬅️ Retour aux ateliers
                </Link>

                {/* Boîte de contenu principale */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Fiche Atelier</span>
                        <h1 className="text-3xl font-extrabold text-slate-900">Détails de l'Atelier</h1>
                    </div>

                    {/* Bannière d'alerte temporaire */}
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl space-y-1">
                        <p className="font-semibold">🔌 Connexion Prisma en attente</p>
                        <p className="text-amber-700">
                            Tu as cliqué sur l'atelier ayant l'identifiant unique <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold text-amber-900">{id}</code>.
                            Plus tard, une simple requête Prisma nous permettra d'afficher dynamiquement le vrai texte de cet atelier spécifique.
                        </p>
                    </div>

                    <p className="text-slate-600 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>

                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <span className="text-sm text-slate-500">Pour vous inscrire, veuillez vous connecter à votre espace membre.</span>
                        <Link href="/login" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors shrink-0">
                            S'inscrire à l'atelier
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}