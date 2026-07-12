'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { compterUtilisateurs, compterContenu } from './actions';
import {
    User,
    Users,
    UsersRound,
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
    Volume2,
    Bot,
    HeartHandshake,
    ArrowRight,
    ShieldAlert,
    UserCheck,
    BookMarked,
    FileCode,
    Layers
} from 'lucide-react';

interface ModulePedagogique {
    id: number;
    titre: string;
    description: string | null;
    public: string;
    createdAt: Date;
}

const extraireConfigurationModule = (titre: string) => {
    const titreMinuscule = titre.toLowerCase();

    if (titreMinuscule.includes('lect') || titreMinuscule.includes('compr')) {
        return { Icone: BookOpen };
    }
    if (titreMinuscule.includes('numér') || titreMinuscule.includes('ordinateur')) {
        return { Icone: Laptop };
    }
    if (titreMinuscule.includes('robot') || titreMinuscule.includes('techno')) {
        return { Icone: Cpu };
    }
    if (titreMinuscule.includes('angl') || titreMinuscule.includes('lang')) {
        return { Icone: Languages };
    }
    if (titreMinuscule.includes('civiq') || titreMinuscule.includes('droit')) {
        return { Icone: Scale };
    }
    if (titreMinuscule.includes('éco') || titreMinuscule.includes('climat') || titreMinuscule.includes('environ')) {
        return { Icone: Leaf };
    }

    return { Icone: BookOpen };
};

export default function AdminDashboard() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [nombreMembres, setNombreMembres] = useState(0);
    const [nombreEnfants, setNombreEnfants] = useState(0);
    const [nombrePartenaires, setNombrePartenaires] = useState(0);
    const [nombreBenevoles, setNombreBenevoles] = useState(0);
    const [nombreIntervenants, setNombreIntervenants] = useState(0);
    const [nombreAdmin, setNombreAdmin] = useState(0);
    const [nombreEtudiant, setNombreEtudiant] = useState(0);
    const [nombreUtilisateur, setNombreUtilisateur] = useState(0);

    const [nombreContenus, setNombreContenus] = useState(0);
    const [nombreCours, setNombreCours] = useState(0);
    const [nombreExercice, setNombreExercice] = useState(0);
    const [nombreModule, setNombreModule] = useState(0);

    async function chargerDonneesDashboard() {
        try {
            const [membre, enfant, partenaire, benevole, intervenant, admin, etudiant, tous, contenu] = await Promise.all([
                compterUtilisateurs('MEMBRE'),
                compterUtilisateurs('ENFANT'),
                compterUtilisateurs('PARTENAIRE'),
                compterUtilisateurs('BENEVOLE'),
                compterUtilisateurs('INTERVENANT'),
                compterUtilisateurs('ADMIN'),
                compterUtilisateurs('ETUDIANT'),
                compterUtilisateurs('ALL'),
                compterContenu(),
            ]);

            if (membre.success && membre.data) setNombreMembres(membre.data);
            if (enfant.success && enfant.data) setNombreEnfants(enfant.data);
            if (partenaire.success && partenaire.data) setNombrePartenaires(partenaire.data);
            if (benevole.success && benevole.data) setNombreBenevoles(benevole.data);
            if (intervenant.success && intervenant.data) setNombreIntervenants(intervenant.data);
            if (admin.success && admin.data) setNombreAdmin(admin.data);
            if (etudiant.success && etudiant.data) setNombreEtudiant(etudiant.data);
            if (tous.success && tous.data) setNombreUtilisateur(tous.data);

            if (contenu.success && contenu.data) setNombreContenus(contenu.data);
            if (contenu.success && contenu.dataCours) setNombreCours(contenu.dataCours);
            if (contenu.success && contenu.dataExercice) setNombreExercice(contenu.dataExercice);
            if (contenu.success && contenu.dataModule) setNombreModule(contenu.dataModule);

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
        <div className="min-h-screen bg-slate-50/50 text-violet-900 p-6 md:p-8">
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-5">
                <h1 className="text-3xl font-bold text-violet-950 tracking-tight">Console d'Administration</h1>
                <p className="text-sm text-slate-500">Vue d'ensemble de l'association, gestion des adhésions et suivi des programmes.</p>
            </div>

            <section className="mt-8 space-y-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Statistiques des Utilisateurs</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreMembres}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Membres inscrits</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <Baby className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreEnfants}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Enfants suivis</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <Handshake className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombrePartenaires}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Partenaires</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <HeartHandshake className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreBenevoles}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Bénévoles</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <UserCheck className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreIntervenants}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Intervenants</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreEtudiant}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Étudiants</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreAdmin}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Administrateurs</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <UsersRound className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreUtilisateur}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Nombre total d'utilisateurs</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Statistiques Pédagogiques</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreContenus}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Contenus globaux</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <Layers className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreModule}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Modules créés</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <BookMarked className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreCours}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Leçons publiées</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all duration-200 hover:border-violet-300">
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                <FileCode className="h-6 w-6" />
                            </div>
                            <div>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                                ) : (
                                    <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreExercice}</span>
                                )}
                                <p className="text-xs font-medium text-slate-500">Exercices interactifs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-10">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Actions rapides</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
                    <Link href="/admin/membres" className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-violet-400 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                <Users className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-violet-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-violet-950 transition-colors">Gérer les membres</h4>
                        <p className="text-xs text-slate-500 mt-1">Inscriptions, rôles RBAC et fiches personnelles</p>
                    </Link>

                    <Link href="/admin/ateliers" className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-violet-400 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-violet-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-violet-950 transition-colors">Gérer les ateliers</h4>
                        <p className="text-xs text-slate-500 mt-1">Planification, présence et calendriers</p>
                    </Link>

                    <Link href="/admin/pedagogie" className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-violet-400 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-violet-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-violet-950 transition-colors">Gérer la pédagogie</h4>
                        <p className="text-xs text-slate-500 mt-1">Édition des structures globales de cours</p>
                    </Link>
                </div>
            </section>

            <section className="mt-12 mb-8 space-y-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400">
                            Parcours Pédagogiques Adultes
                        </h3>
                        <span className="text-[10px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                            Insertion & Autonomie
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link
                            href="/admin/pedagogie/numerique-adulte"
                            className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-violet-400 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                    <Laptop className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-violet-700 group-hover:bg-violet-100 transition-colors duration-200">
                                    Gérer <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-violet-950 transition-colors">
                                    Numérique (Adulte)
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Ateliers informatiques, démarches administratives en ligne et compétences numériques clés pour les adultes.
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/pedagogie/oral"
                            className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-violet-400 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                    <Volume2 className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-violet-700 group-hover:bg-violet-100 transition-colors duration-200">
                                    Gérer <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-violet-950 transition-colors">
                                    Expression & Compréhension Orale
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Ateliers d'expression, de communication et d'intégration linguistique pour le public adulte.
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/pedagogie/bureautique"
                            className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-violet-300 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                    <Volume2 className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-violet-500 bg-violet-50 px-2.5 py-1 rounded-full group-hover:text-violet-600 group-hover:bg-violet-100 transition-colors">
                                    Gérer <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-violet-950 transition-colors">
                                    Bureautique (Adulte)
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Ateliers de bureautique etc ...
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 pt-5">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500">
                            Parcours Pédagogiques Enfants
                        </h3>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            Éveil & Juniors
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link
                            href="/admin/pedagogie/numerique"
                            className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <Laptop className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full group-hover:text-amber-800 group-hover:bg-amber-100 transition-colors duration-200">
                                    Gérer <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-950 transition-colors">
                                    Numérique
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Initiation ludique aux outils numériques et logique de programmation adaptée aux enfants.
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/pedagogie/robotique"
                            className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full group-hover:text-amber-800 group-hover:bg-amber-100 transition-colors duration-200">
                                    Gérer <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-950 transition-colors">
                                    Robotique Ludique
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Ateliers de découverte de l'électronique, d'assemblage et de programmation de mini-robots.
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/pedagogie/anglais"
                            className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <Languages className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full group-hover:text-amber-800 group-hover:bg-amber-100 transition-colors duration-200">
                                    Gérer <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-950 transition-colors">
                                    Anglais
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Apprentissage de la langue de manière immersive et interactive par le jeu pour les juniors.
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/pedagogie/eco-citoyennete"
                            className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <HeartHandshake className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full group-hover:text-amber-800 group-hover:bg-amber-100 transition-colors duration-200">
                                    Gérer <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-950 transition-colors">
                                    Éco-Citoyenneté
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Sensibilisation à l'environnement, à la biodiversité et aux écogestes citoyens dès le plus jeune âge.
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/pedagogie/education-civique"
                            className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <Scale className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full group-hover:text-amber-800 group-hover:bg-amber-100 transition-colors duration-200">
                                    Gérer <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-950 transition-colors">
                                    Éducation Civique
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Découverte des valeurs, institutions républicaines et des notions de vivre-ensemble.
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/pedagogie/comprehension-lecture"
                            className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full group-hover:text-amber-800 group-hover:bg-amber-100 transition-colors duration-200">
                                    Gérer <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="mt-5 space-y-1">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-950 transition-colors">
                                    Compréhension Lecture
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Soutien à la lecture, analyse d’histoires et consolidation du socle de vocabulaire des enfants.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}