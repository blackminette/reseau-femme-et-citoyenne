// * src/app/(dashboard-adultes)/(dashboard)/admin/pedagogie/page.tsx
'use client';

/** Page pour pour choisir et rediriger vers la bonne section (Adultes ou Enfants). */

import Link from 'next/link';
import React from 'react';
import { GraduationCap, Users, Baby, ArrowRight, BookOpen, Settings } from 'lucide-react';

export default function PedagogiePage() {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* En-tête de la page */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <GraduationCap className="h-5 w-5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Espace Admin</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pédagogie & Programmes</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Gérez les parcours pédagogiques, suivez les inscriptions et configurez les cycles d'apprentissage.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Section Adultes */}
                <Link
                    href="/admin/pedagogie/adultes"
                    className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 text-left"
                >
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                            <Users className="h-6 w-6" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                            Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                    </div>

                    <div className="mt-5 space-y-1">
                        <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            Section Adultes
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Gestion des cours continus, ateliers thématiques, plannings de formation et suivi des niveaux pédagogiques pour adultes.
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex gap-4 text-xs font-medium text-slate-400">
                        <div className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" /> Niveaux & Modules
                        </div>
                    </div>
                </Link>

                {/* Section Enfants */}
                <Link
                    href="/admin/pedagogie/enfants"
                    className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-orange-200 transition-all duration-200 text-left"
                >
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-200">
                            <Baby className="h-6 w-6" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full group-hover:text-orange-600 group-hover:bg-orange-50 transition-colors">
                            Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                    </div>

                    <div className="mt-5 space-y-1">
                        <h2 className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                            Section Enfants
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Suivi des cycles d'éveil, cours juniors, gestion des groupes d'âge, autorisations parentales et fiches de progression.
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex gap-4 text-xs font-medium text-slate-400">
                        <div className="flex items-center gap-1">
                            <Settings className="h-3.5 w-3.5" /> Groupes par Âge
                        </div>
                    </div>
                </Link>

            </div>

            {/* Optionnel (pour remplir l'espace) */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-800">Note d'administration</h4>
                        <p className="text-xs text-slate-500">Informations importantes pour l'administration du programme pédagogique.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}