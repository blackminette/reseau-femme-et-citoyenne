// * src/app/(dashboard-adultes)/admin/page.tsx
//! Ne pas oublier de refaire les liens des modules pédagogiques quand les pages seront faites (actuellement, ils pointent tous vers /admin)
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { compterUtilisateurs, compterContenu } from './actions';
import {
    Users,
    Calendar,
    GraduationCap,
    BookOpen,
    Laptop,
    Cpu,
    Languages,
    Scale,
    Leaf,
    ArrowUpRight,
    Handshake,
    FileText,
    Baby,
} from 'lucide-react';

/**
 * Panneau d'administration général de l'association.
 * Ultra-sécurisé, accessible uniquement pour le rôle 'ADMIN'.
 */
export default function AdminDashboard() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [nombreMembres, setNombreMembres] = React.useState(0);
    const [nombreEnfants, setNombreEnfants] = React.useState(0);
    const [nombrePartenaires, setNombrePartenaires] = React.useState(0);
    const [nombreContenus, setNombreContenus] = React.useState(0);

    async function chargerDonneesDashboard() {
        try {
            const [membre, enfant, partenaire, contenu] = await Promise.all([
                compterUtilisateurs('MEMBRE'),
                compterUtilisateurs('ENFANT'),
                compterUtilisateurs('PARTENAIRE'),
                compterContenu()
            ]);

            if (membre.success && membre.data) setNombreMembres(membre.data.count);
            if (enfant.success && enfant.data) setNombreEnfants(enfant.data.count);
            if (partenaire.success && partenaire.data) setNombrePartenaires(partenaire.data.count);
            if (contenu.success && contenu.data) setNombreContenus(contenu.data);

        } catch (error) {
            console.error("Erreur lors du chargement des statistiques du dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        chargerDonneesDashboard();
    }, []);

    return (
        <div className="min-h-screen bg-violet-50 text-violet-900 p-8">
            {/* EN-TÊTE PRINCIPAL */}
            <div className="flex flex-col gap-1 border-b border-violet-200 pb-5">
                <h1 className="text-3xl font-bold text-violet-950 tracking-tight">Console d'Administration</h1>
                <p className="text-sm text-violet-600">Vue d'ensemble de l'association, gestion des adhésions et suivi des programmes.</p>
            </div>

            {/* SECTION VUE D'ENSEMBLE / STATISTIQUES */}
            <section className="mt-8">
                <h3 className="text-lg font-semibold text-violet-800 tracking-tight">Vue d'ensemble</h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">

                    {/* 1. Carte Statistique : Membres */}
                    <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xs flex items-center gap-4">
                        <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            {isLoading ? (
                                <div className="h-8 w-16 bg-violet-100 animate-pulse rounded" />
                            ) : (
                                <span className="text-2xl font-bold text-violet-950 tracking-tight">
                                    {nombreMembres}
                                </span>
                            )}
                            <p className="text-sm font-medium text-violet-600">Membres inscrits</p>
                        </div>
                    </div>

                    {/* 2. Carte Statistique : Enfants */}
                    <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xs flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <Baby className="h-6 w-6" />
                        </div>
                        <div>
                            {isLoading ? (
                                <div className="h-8 w-16 bg-violet-100 animate-pulse rounded" />
                            ) : (
                                <span className="text-2xl font-bold text-violet-950 tracking-tight">
                                    {nombreEnfants}
                                </span>
                            )}
                            <p className="text-sm font-medium text-violet-600">Enfants suivis</p>
                        </div>
                    </div>

                    {/* 3. Carte Statistique : Partenaires */}
                    <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xs flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <Handshake className="h-6 w-6" />
                        </div>
                        <div>
                            {isLoading ? (
                                <div className="h-8 w-16 bg-violet-100 animate-pulse rounded" />
                            ) : (
                                <span className="text-2xl font-bold text-violet-950 tracking-tight">
                                    {nombrePartenaires}
                                </span>
                            )}
                            <p className="text-sm font-medium text-violet-600">Partenaires</p>
                        </div>
                    </div>

                    {/* 4. Carte Statistique : Contenus */}
                    <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xs flex items-center gap-4">
                        <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            {isLoading ? (
                                <div className="h-8 w-16 bg-violet-100 animate-pulse rounded" />
                            ) : (
                                <span className="text-2xl font-bold text-violet-950 tracking-tight">
                                    {nombreContenus}
                                </span>
                            )}
                            <p className="text-sm font-medium text-violet-600">Contenus publiés</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* SECTION 1 : ACTIONS RAPIDES */}
            <section className="mt-8">
                <h3 className="text-lg font-semibold text-violet-800 tracking-tight">Actions rapides</h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">

                    {/* Carte : Gérer les membres */}
                    <Link href="/admin/membres" className="group block bg-white border border-violet-200 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:shadow-violet-100 hover:border-violet-500 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                <Users className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-violet-400 group-hover:text-violet-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-lg font-bold text-violet-950 group-hover:text-violet-600 transition-colors">
                            Gérer les membres
                        </h4>
                        <p className="text-sm text-violet-600 mt-1">
                            Créer, modifier, supprimer
                        </p>
                    </Link>

                    {/* Carte : Gérer les ateliers */}
                    <Link href="/admin/ateliers" className="group block bg-white border border-violet-200 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:shadow-violet-100 hover:border-violet-500 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-violet-400 group-hover:text-violet-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-lg font-bold text-violet-950 group-hover:text-violet-600 transition-colors">
                            Gérer les ateliers
                        </h4>
                        <p className="text-sm text-violet-600 mt-1">
                            Créer, modifier, supprimer
                        </p>
                    </Link>

                    {/* Carte : Gérer la pédagogie */}
                    <Link href="/admin/pedagogie" className="group block bg-white border border-violet-200 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:shadow-violet-100 hover:border-violet-500 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-violet-400 group-hover:text-violet-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-lg font-bold text-violet-950 group-hover:text-violet-600 transition-colors">
                            Gérer la pédagogie
                        </h4>
                        <p className="text-sm text-violet-600 mt-1">
                            Créer, modifier, supprimer
                        </p>
                    </Link>

                </div>
            </section>

            {/* SECTION 2 : MODULES PÉDAGOGIQUES */}
            <section className="mt-12 mb-8">
                <h3 className="text-lg font-semibold text-violet-800 tracking-tight">Modules pédagogiques</h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">

                    {/* Module 1 : Lecture & compréhension */}
                    <Link href="/admin" className="group block bg-white border border-violet-200 p-5 rounded-2xl shadow-xs hover:shadow-xl hover:shadow-violet-100 hover:border-violet-500 transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <h4 className="text-base font-bold text-violet-900 group-hover:text-violet-600 transition-colors">
                                Lecture & compréhension
                            </h4>
                        </div>
                    </Link>

                    {/* Module 2 : Numérique */}
                    <Link href="/admin" className="group block bg-white border border-violet-200 p-5 rounded-2xl shadow-xs hover:shadow-xl hover:shadow-violet-100 hover:border-violet-500 transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                <Laptop className="h-5 w-5" />
                            </div>
                            <h4 className="text-base font-bold text-violet-900 group-hover:text-violet-600 transition-colors">
                                Numérique
                            </h4>
                        </div>
                    </Link>

                    {/* Module 3 : Robotique */}
                    <Link href="/admin" className="group block bg-white border border-violet-200 p-5 rounded-2xl shadow-xs hover:shadow-xl hover:shadow-purple-100 hover:border-violet-500 transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                <Cpu className="h-5 w-5" />
                            </div>
                            <h4 className="text-base font-bold text-violet-900 group-hover:text-violet-600 transition-colors">
                                Robotique
                            </h4>
                        </div>
                    </Link>

                    {/* Module 4 : Anglais */}
                    <Link href="/admin" className="group block bg-white border border-violet-200 p-5 rounded-2xl shadow-xs hover:shadow-xl hover:shadow-amber-100 hover:border-amber-500 transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                <Languages className="h-5 w-5" />
                            </div>
                            <h4 className="text-base font-bold text-violet-900 group-hover:text-amber-600 transition-colors">
                                Anglais
                            </h4>
                        </div>
                    </Link>

                    {/* Module 5 : Éducation Civique */}
                    <Link href="/admin" className="group block bg-white border border-violet-200 p-5 rounded-2xl shadow-xs hover:shadow-xl hover:shadow-amber-100 hover:border-amber-500 transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                <Scale className="h-5 w-5" />
                            </div>
                            <h4 className="text-base font-bold text-violet-900 group-hover:text-amber-600 transition-colors">
                                Éducation civique
                            </h4>
                        </div>
                    </Link>

                    {/* Module 6 : Éco-citoyens */}
                    <Link href="/admin" className="group block bg-white border border-violet-200 p-5 rounded-2xl shadow-xs hover:shadow-xl hover:shadow-amber-100 hover:border-amber-500 transition-all duration-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                <Leaf className="h-5 w-5" />
                            </div>
                            <h4 className="text-base font-bold text-violet-900 group-hover:text-amber-600 transition-colors">
                                Éco-citoyens
                            </h4>
                        </div>
                    </Link>

                </div>
            </section>
        </div>
    );
}