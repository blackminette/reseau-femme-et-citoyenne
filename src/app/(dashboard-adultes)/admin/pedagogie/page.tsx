// * src/app/(dashboard-adultes)/admin/pedagogie/page.tsx
'use client';

/** Page pour pour choisir et rediriger vers la bonne section (Adultes ou Enfants). */

import Link from 'next/link';
import React from 'react';
import {
    Baby,
    ArrowRight,
    GraduationCap,
    Laptop,
    BookOpen,
    HeartHandshake,
    Scale,
    Languages,
    Bot,
    Volume2
} from 'lucide-react';

export default function PedagogiePage() {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* En-tête de la page */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-violet-100 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-violet-600 mb-1">
                        <GraduationCap className="h-5 w-5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Espace Admin</span>
                    </div>
                    <h1 className="text-3xl font-bold text-violet-950 tracking-tight">Pédagogie & Programmes</h1>
                    <p className="text-sm text-violet-600 mt-1">
                        Gérez les parcours pédagogiques, suivez les inscriptions et configurez les cycles d'apprentissage.
                    </p>
                </div>
            </div>

            <div className="space-y-8">

                {/* ================= SECTION ADULTES ================= */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold text-violet-950">Parcours Adultes</h2>
                        <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
                            Insertion & Compétences
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Carte Numérique Adulte */}
                        <Link
                            href="/admin/pedagogie/numerique-adulte"
                            className="group relative flex flex-col bg-white border border-violet-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-violet-300 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                    <Laptop className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-violet-600 group-hover:bg-violet-100 transition-colors">
                                    Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h3 className="text-lg font-bold text-violet-900 group-hover:text-violet-700 transition-colors">
                                    Numérique (Adulte)
                                </h3>
                                <p className="text-sm text-violet-600 leading-relaxed">
                                    Ateliers de prise en main des outils informatiques, démarches en ligne et bases de la programmation.
                                </p>
                            </div>
                        </Link>

                        {/* Carte Expression & Compréhension Orale */}
                        <Link
                            href="/admin/pedagogie/oral"
                            className="group relative flex flex-col bg-white border border-violet-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-violet-300 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                    <Volume2 className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-violet-600 group-hover:bg-violet-100 transition-colors">
                                    Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h3 className="text-lg font-bold text-violet-900 group-hover:text-violet-700 transition-colors">
                                    Expression & Compréhension Orale
                                </h3>
                                <p className="text-sm text-violet-600 leading-relaxed">
                                    Ateliers d'expression, de communication et de fluidité à l'oral pour l'insertion sociale et pro.
                                </p>
                            </div>
                        </Link>

                        {/* Carte Bureautique (adulte) */}
                        <Link
                            href="/admin/pedagogie/bureautique"
                            className="group relative flex flex-col bg-white border border-violet-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-violet-300 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                    <Volume2 className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-violet-600 group-hover:bg-violet-100 transition-colors">
                                    Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h3 className="text-lg font-bold text-violet-900 group-hover:text-violet-700 transition-colors">
                                    Bureautique (Adulte)
                                </h3>
                                <p className="text-sm text-violet-600 leading-relaxed">
                                    Ateliers de bureautique etc ...
                                </p>
                            </div>
                        </Link>

                    </div>
                </div>

                {/* ================= SECTION ENFANTS ================= */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold text-violet-950">Parcours Enfants</h2>
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                            Éveil & Junior
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Carte Numérique */}
                        <Link
                            href="/admin/pedagogie/numerique"
                            className="group relative flex flex-col bg-white border border-violet-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-amber-200 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <Laptop className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors">
                                    Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h3 className="text-lg font-bold text-violet-900 group-hover:text-amber-600 transition-colors">
                                    Numérique
                                </h3>
                                <p className="text-sm text-violet-600 leading-relaxed">
                                    Initiation ludique à l'informatique, logique algorithmique et programmation par blocs avec Scratch.
                                </p>
                            </div>
                        </Link>

                        {/* Carte Robotique */}
                        <Link
                            href="/admin/pedagogie/robotique"
                            className="group relative flex flex-col bg-white border border-violet-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-amber-200 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors">
                                    Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h3 className="text-lg font-bold text-violet-900 group-hover:text-amber-600 transition-colors">
                                    Robotique Ludique
                                </h3>
                                <p className="text-sm text-violet-600 leading-relaxed">
                                    Découverte de la logique des capteurs, programmation de moteurs pas à pas et montage de mini-robots.
                                </p>
                            </div>
                        </Link>

                        {/* Carte Anglais */}
                        <Link
                            href="/admin/pedagogie/anglais"
                            className="group relative flex flex-col bg-white border border-violet-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-amber-200 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <Languages className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors">
                                    Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h3 className="text-lg font-bold text-violet-900 group-hover:text-amber-600 transition-colors">
                                    Anglais
                                </h3>
                                <p className="text-sm text-violet-600 leading-relaxed">
                                    Apprentissage de la langue anglaise via le jeu, les chansons et des ateliers interactifs adaptés aux enfants.
                                </p>
                            </div>
                        </Link>

                        {/* Carte Éco-Citoyenneté */}
                        <Link
                            href="/admin/pedagogie/eco-citoyennete"
                            className="group relative flex flex-col bg-white border border-violet-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-amber-200 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <HeartHandshake className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors">
                                    Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h3 className="text-lg font-bold text-violet-900 group-hover:text-amber-600 transition-colors">
                                    Éco-Citoyenneté
                                </h3>
                                <p className="text-sm text-violet-600 leading-relaxed">
                                    Sensibilisation au développement durable, à la biodiversité, au recyclage et aux écogestes quotidiens.
                                </p>
                            </div>
                        </Link>

                        {/* Carte Éducation Civique */}
                        <Link
                            href="/admin/pedagogie/education-civique"
                            className="group relative flex flex-col bg-white border border-violet-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-amber-200 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <Scale className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors">
                                    Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h3 className="text-lg font-bold text-violet-900 group-hover:text-amber-600 transition-colors">
                                    Éducation Civique
                                </h3>
                                <p className="text-sm text-violet-600 leading-relaxed">
                                    Découverte des valeurs républicaines, des institutions, des droits et des devoirs du citoyen en herbe.
                                </p>
                            </div>
                        </Link>

                        {/* Carte Compréhension Lecture */}
                        <Link
                            href="/admin/pedagogie/comprehension-lecture"
                            className="group relative flex flex-col bg-white border border-violet-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-amber-600 group-hover:bg-amber-50 transition-colors">
                                    Accéder <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h3 className="text-lg font-bold text-violet-900 group-hover:text-amber-600 transition-colors">
                                    Compréhension Lecture
                                </h3>
                                <p className="text-sm text-violet-600 leading-relaxed">
                                    Acquisition et consolidation du socle de compétences en lecture, analyse et compréhension de textes.
                                </p>
                            </div>
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    );
}