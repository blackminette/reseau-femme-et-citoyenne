// * src/app/(dashboard-adultes)/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { compterUtilisateurs, compterContenu, recupererModulesPedagogiques } from './actions';
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
    Loader2,
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

    const [nombreContenus, setNombreContenus] = useState(0);
    const [nombreLecon, setNombreLecon] = useState(0);
    const [nombreExercice, setNombreExercice] = useState(0);
    const [nombreModule, setNombreModule] = useState(0);

    const [modules, setModules] = useState<ModulePedagogique[]>([]);

    async function chargerDonneesDashboard() {
        try {
            const [membre, enfant, partenaire, contenu, modulesRes] = await Promise.all([
                compterUtilisateurs('MEMBRE'),
                compterUtilisateurs('ENFANT'),
                compterUtilisateurs('PARTENAIRE'),
                compterContenu(),
                recupererModulesPedagogiques()
            ]);

            if (membre.success && membre.data) setNombreMembres(membre.data.count);
            if (enfant.success && enfant.data) setNombreEnfants(enfant.data.count);
            if (partenaire.success && partenaire.data) setNombrePartenaires(partenaire.data.count);
            if (contenu.success && contenu.data) setNombreContenus(contenu.data);

            if (modulesRes.success && modulesRes.data) {
                setModules(modulesRes.data);
            }

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
            {/* EN-TÊTE PRINCIPAL */}
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-5">
                <h1 className="text-3xl font-bold text-violet-950 tracking-tight">Console d'Administration</h1>
                <p className="text-sm text-slate-500">Vue d'ensemble de l'association, gestion des adhésions et suivi des programmes.</p>
            </div>

            {/* SECTION VUE D'ENSEMBLE / STATISTIQUES */}
            <section className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Vue d'ensemble</h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
                    {/* Carte Statistique : Membres */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex items-center gap-4 transition-all hover:border-violet-300">
                        <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                            <Users className="h-6 w-6" />
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

                    {/* Carte Statistique : Enfants */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex items-center gap-4 transition-all hover:border-violet-300">
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

                    {/* Carte Statistique : Partenaires */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex items-center gap-4 transition-all hover:border-violet-300">
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

                    {/* Carte Statistique : Contenus */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex items-center gap-4 transition-all hover:border-violet-300">
                        <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            {isLoading ? (
                                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                            ) : (
                                <span className="text-2xl font-bold text-violet-950 tracking-tight">{nombreContenus}</span>
                            )}
                            <p className="text-xs font-medium text-slate-500">Contenus publiés</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 1 : ACTIONS RAPIDES */}
            <section className="mt-10">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Actions rapides</h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
                    {/* Gérer les membres */}
                    <Link href="/admin/membres" className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-violet-400 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                <Users className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-violet-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-violet-950 transition-colors">Gérer les membres</h4>
                        <p className="text-xs text-slate-500 mt-1">Inscriptions, rôles RBAC et fiches personnelles</p>
                    </Link>

                    {/* Gérer les ateliers */}
                    <Link href="/admin/ateliers" className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-violet-400 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-violet-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-violet-950 transition-colors">Gérer les ateliers</h4>
                        <p className="text-xs text-slate-500 mt-1">Planification, présence et calendriers</p>
                    </Link>

                    {/* Gérer la pédagogie */}
                    <Link href="/admin/pedagogie" className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-violet-400 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-violet-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-violet-950 transition-colors">Gérer la pédagogie</h4>
                        <p className="text-xs text-slate-500 mt-1">Édition des structures globales de cours</p>
                    </Link>
                </div>
            </section>

            {/* SECTION 2 : MODULES PÉDAGOGIQUES DYNAMIQUES */}
            <section className="mt-12 mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Modules pédagogiques</h3>

                {isLoading ? (
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" /> Chargement des modules...
                    </div>
                ) : modules.length === 0 ? (
                    <p className="text-sm text-slate-500 mt-4">Aucun module configuré pour le moment.</p>
                ) : (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
                        {modules.map((module) => {
                            const { Icone } = extraireConfigurationModule(module.titre);

                            const hrefUrl = module.public === "ADULTE"
                                ? `/admin/pedagogie/adultes/${module.id}`
                                : `/admin/pedagogie/enfants/${module.id}`;

                            return (
                                <Link
                                    key={module.id}
                                    href={hrefUrl}
                                    className="group flex items-center justify-between bg-white border border-slate-200 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-violet-400 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200">
                                            <Icone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-base font-bold text-slate-800 group-hover:text-violet-700 transition-colors">
                                                    {module.titre}
                                                </h4>
                                                {/* Badges unifiés en Violet avec variations de nuances de fond */}
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${module.public === 'ADULTE'
                                                    ? 'bg-violet-100 text-violet-700'
                                                    : 'bg-violet-50 text-violet-500 border border-violet-100'
                                                    }`}>
                                                    {module.public === 'ADULTE' ? 'Adulte' : 'Enfant'}
                                                </span>
                                            </div>
                                            {module.description && (
                                                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                                    {module.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}