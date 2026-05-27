// * src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Page d'accueil principale du projet (Racine "/").
 * Transformée en panneau de test pour piloter et valider le Middleware RBAC.
 */
export default function HomePageTest() {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-md border border-slate-200 p-8">

                {/* En-tête explicatif */}
                <header className="text-center mb-8">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                        Environnement de Test
                    </span>
                    <h1 className="text-3xl font-extrabold text-slate-800 mt-3">
                        Validation des Redirections (RBAC)
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        Utilise les boutons ci-dessous pour tester l'étanchéité des routes.
                        Le <strong>Middleware</strong> interceptera ta demande et te redirigera selon ton rôle Supabase.
                    </p>
                </header>

                {/* Grille des boutons vers les Dashboards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                    {/* Bouton Espace Partenaire */}
                    <Link
                        href="/partenaire"
                        className="flex flex-col p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all group"
                    >
                        <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                            💼 Espace Partenaire
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                            Réservation de créneaux & paiement
                        </span>
                    </Link>

                    {/* Bouton Espace Membre */}
                    <Link
                        href="/membre"
                        className="flex flex-col p-4 bg-white border border-slate-200 rounded-lg hover:border-amber-500 hover:shadow-sm transition-all group"
                    >
                        <span className="font-bold text-slate-700 group-hover:text-amber-600 transition-colors">
                            💡 Espace Membre
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                            Gestion famille & Boîte à idées
                        </span>
                    </Link>

                    {/* Bouton Espace Étudiant */}
                    <Link
                        href="/etudiant"
                        className="flex flex-col p-4 bg-white border border-slate-200 rounded-lg hover:border-emerald-500 hover:shadow-sm transition-all group"
                    >
                        <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                            🎓 Espace Étudiant
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                            Cours & Quiz en autonomie
                        </span>
                    </Link>

                    {/* Bouton Console Admin */}
                    <Link
                        href="/admin"
                        className="flex flex-col p-4 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-all group"
                    >
                        <span className="font-bold text-white group-hover:text-red-400 transition-colors">
                            ⚙️ Console Admin
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                            Zone ultra-sécurisée souveraine
                        </span>
                    </Link>

                </div>

                {/* Note technique d'accompagnement */}
                <footer className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-xs text-slate-600">
                    <p className="font-semibold text-slate-700 mb-1">💡 Comment tester le comportement ?</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Si tu n'es pas connecté :</strong> Cliquer sur n'importe quel bouton doit te renvoyer automatiquement vers la page <code className="bg-slate-200 px-1 rounded">/login</code> (car aucune session n'existe).</li>
                        <li><strong>Si ton collègue t'injecte un rôle :</strong> Le middleware te laissera entrer uniquement sur l'espace correspondant et te bloquera les 3 autres.</li>
                    </ul>
                </footer>

            </div>
        </div>
    );
}