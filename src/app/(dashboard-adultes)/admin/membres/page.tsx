'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { listerLesUtilisateurs, modifierUtilisateur, supprimerUtilisateur } from './actions';
import Modal from '@/components/Modal';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ChevronDown, Plus, RotateCcw, UserCheck, UserX } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';

type MembreTuteur = {
    nom: string;
    prenom: string;
};

type MembreStatistiques = {
    enfants: number;
    reservations: number;
    coursAnimes: number;
    dons: number;
};

type MembreAdmin = {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string | null;
    role: string;
    createdAt: string | Date;
    tuteur?: MembreTuteur | null;
    _count: MembreStatistiques;
};

const ROLE_STYLES: Record<string, string> = {
    ADMIN: 'bg-rose-50 text-rose-700 border-rose-200',
    INTERVENANT: 'bg-violet-50 text-violet-700 border-violet-200',
    BENEVOLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PARTENAIRE: 'bg-amber-50 text-amber-700 border-amber-200',
    MEMBRE: 'bg-blue-50 text-blue-700 border-blue-200',
    ENFANT: 'bg-slate-50 text-slate-700 border-slate-200',
    ETUDIANT: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export default function AdminMembresPage() {
    const [membres, setMembres] = useState<MembreAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [membreSelectionne, setMembreSelectionne] = useState<MembreAdmin | null>(null);

    const [modalDetailsIsOpen, setModalDetailsIsOpen] = useState(false);
    const [modalModifierIsOpen, setModalModifierIsOpen] = useState(false);
    const [modalSupprimerIsOpen, setModalSupprimerIsOpen] = useState(false);
    const [modalCreerIsOpen, setModalCreerIsOpen] = useState(false);
    const [modalLotIsOpen, setModalLotIsOpen] = useState(false);

    const [filter, setFilter] = useState<string>("");
    const [trie, setTrie] = useState<string>('DECROISSANT');
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");

    const [modifierForm, setModifierForm] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        role: ''
    });

    const [creerForm, setCreerForm] = useState({
        nom: '',
        prenom: '',
        username: '',
        email: '',
        password: 'Password123!',
        telephone: '',
        role: 'MEMBRE'
    });

    const [lotForm, setLotForm] = useState({
        prefixe: '',
        role: 'ETUDIANT',
        nombre: 5
    });

    // Effet de "Debounce" : Attend 400ms après la fin de la saisie avant de déclencher la recherche
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const chargerMembres = useCallback(async () => {
        await Promise.resolve();
        setIsLoading(true);
        const termeRecherche = filter || debouncedSearch;
        const reponse = await listerLesUtilisateurs(trie, termeRecherche);

        if (reponse.success && reponse.data) {
            if (filter && debouncedSearch) {
                const searchLower = debouncedSearch.toLowerCase();
                const dataFiltree = reponse.data.filter((m: MembreAdmin) =>
                    m.nom?.toLowerCase().includes(searchLower) ||
                    m.prenom?.toLowerCase().includes(searchLower) ||
                    m.email?.toLowerCase().includes(searchLower)
                );
                setMembres(dataFiltree);
            } else {
                setMembres(reponse.data);
            }
        }
        setIsLoading(false);
    }, [debouncedSearch, filter, trie]);

    // Le tableau se rafraîchit dès qu'un filtre, le texte ou le tri change
    useEffect(() => {
        const timer = window.setTimeout(() => {
            void chargerMembres();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [chargerMembres]);

    const ouvrirModalModifier = (membre: MembreAdmin) => {
        setMembreSelectionne(membre);
        setModifierForm({
            nom: membre.nom,
            prenom: membre.prenom,
            telephone: membre.telephone || '',
            role: membre.role
        });
        setModalModifierIsOpen(true);
    };

    const handleModifierSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!membreSelectionne) return;

        const result = await modifierUtilisateur(membreSelectionne.id, modifierForm);
        if (result.success) {
            setModalModifierIsOpen(false);
            chargerMembres();
        } else {
            alert(result.error || "Erreur lors de la modification");
        }
    };

    const handleCreerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const usernameRegex = /^[a-zA-Z0-9_]+$/;

        if (!usernameRegex.test(creerForm.username)) {
            alert("Le nom d'utilisateur doit contenir uniquement des lettres, des chiffres ou des caractères de soulignement (_).");
            return;
        }

        const result = await creerUtilisateur(creerForm);

        if (result.success) {
            setModalCreerIsOpen(false);
            setCreerForm({
                nom: '',
                prenom: '',
                username: '',
                email: '',
                password: 'Password123!',
                telephone: '',
                role: 'MEMBRE'
            });
            chargerMembres();
        } else {
            alert(result.error || "Erreur lors de la création");
        }
    };

    const handleSupprimer = async () => {
        if (!membreSelectionne) return;

        if (membreSelectionne.id === currentAdminId) {
            alert("Action impossible : Vous ne pouvez pas supprimer votre propre compte.");
            return;
        }

        const result = await supprimerUtilisateur(membreSelectionne.id);
        if (result.success) {
            setModalSupprimerIsOpen(false);
            setMembreSelectionne(null);
            chargerMembres();
        } else {
            alert(result.error || "Erreur lors de la suppression");
        }
    };

    const membresFiltresEtTries = membres
        .filter((membre) => {
            const correspondRecherche =
                membre.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                membre.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
                membre.username.toLowerCase().includes(recherche.toLowerCase()) ||
                (membre.email && membre.email.toLowerCase().includes(recherche.toLowerCase()));

            const correspondRole = rolesSelectionnes.length === 0 || rolesSelectionnes.includes(membre.role);

            const statutMembre = membre.isActive ?? true;
            const correspondStatut =
                statutFiltre === 'TOUS' ||
                (statutFiltre === 'ACTIF' && statutMembre === true) ||
                (statutFiltre === 'INACTIF' && statutMembre === false);

            return correspondRecherche && correspondRole && correspondStatut;
        })
        .sort((a, b) => {
            if (tri === 'ALPHABETIQUE') {
                const nomA = `${a.nom} ${a.prenom}`.toLowerCase();
                const nomB = `${b.nom} ${b.prenom}`.toLowerCase();
                return nomA.localeCompare(nomB, 'fr');
            }

            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return tri === 'RECENT' ? dateB - dateA : dateA - dateB;
        })

    const indexDernierMembre = pageActuelle * membresParPage;
    const indexPremierMembre = indexDernierMembre - membresParPage;
    const membresAffiches = membresFiltresEtTries.slice(indexPremierMembre, indexDernierMembre);

    const totalPages = Math.ceil(membresFiltresEtTries.length / membresParPage);

    const handleLotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const prefixeRegex = /^[a-zA-Z_]+$/;

        if (!prefixeRegex.test(lotForm.prefixe)) {
            alert("Le préfixe doit contenir uniquement des lettres ou des caractères de soulignement (_).");
            setIsLoading(false);
            return;
        }

        const result = await creerUtilisateursEnLot(lotForm);

        if (result.success) {
            alert(result.message || "Les comptes ont été créés.");
            setModalLotIsOpen(false);
            setLotForm({ prefixe: '', role: 'ETUDIANT', nombre: 5 });
            await chargerMembres();
        } else {
            alert(result.error || "Une erreur est survenue lors de la création.");
            setIsLoading(false);
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (membresAffiches: any[]) => {
        if (selectedIds.length === membresAffiches.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(membresAffiches.map(m => m.id));
        }
    };

    const handleSuppressionMasse = async () => {
        if (selectedIds.length === 0) return;

        const confirmation = window.confirm(`Êtes-vous absolument sûr de vouloir supprimer définitivement ces ${selectedIds.length} membres ? Cette action est irréversible.`);

        if (confirmation) {
            setIsLoading(true);
            const res = await supprimerUtilisateursEnMasse(selectedIds);

            if (res.success) {
                alert(res.message);
                setSelectedIds([]);
                await chargerMembres();
            } else {
                alert(res.error);
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-violet-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-violet-950 tracking-tight">Gestion des Membres</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Visualisez, modifiez ou supprimez les membres de l'association ({membresFiltresEtTries.length} affichés)
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setModalLotIsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-xl shadow-sm font-medium text-sm transition-all cursor-pointer"
                    >
                        Création en lot
                    </button>

                    <button
                        onClick={() => setModalCreerIsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl shadow-md font-medium text-sm hover:bg-violet-700 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter un membre
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white p-4 rounded-2xl border border-violet-50 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom, identifiant..."
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400 text-slate-700"
                    />
                </div>

                {/* Filtre par rôle */}
                <div className="flex flex-col gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex-1 md:flex-initial">
                    {/* Ligne 1 : Filtrer par Rôles */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 px-1">Rôles :</span>
                        {Object.keys(ROLE_STYLES).map((role) => {
                            const estSelectionne = rolesSelectionnes.includes(role);
                            return (
                                <button
                                    key={role}
                                    onClick={() => handleToggleRole(role)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${estSelectionne
                                        ? `${ROLE_STYLES[role]} ring-2 ring-offset-1 ring-violet-500/20 scale-105`
                                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                                        }`}
                                >
                                    {role}
                                    {estSelectionne && <span className="ml-1 text-[10px]">✓</span>}
                                </button>
                            );
                        })}
                        {rolesSelectionnes.length > 0 && (
                            <button
                                onClick={() => setRolesSelectionnes([])}
                                className="text-xs text-violet-600 hover:text-violet-800 font-medium px-2 py-1 transition-colors cursor-pointer"
                            >
                                Effacer
                            </button>
                        )}
                    </div>

                    {/* Ligne 2 : Filtrer par Statut */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100/70">
                        <span className="text-xs font-semibold text-slate-500 px-1">Statut :</span>
                        <button
                            onClick={() => setStatutFiltre('TOUS')}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${statutFiltre === 'TOUS'
                                ? 'bg-white text-violet-700 shadow-sm border border-slate-200'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Tous
                        </button>
                        <button
                            onClick={() => setStatutFiltre('ACTIF')}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${statutFiltre === 'ACTIF'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm font-semibold'
                                : 'text-slate-400 hover:text-emerald-600'
                                }`}
                        >
                            Actifs
                        </button>
                        <button
                            onClick={() => setStatutFiltre('INACTIF')}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${statutFiltre === 'INACTIF'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm font-semibold'
                                : 'text-slate-400 hover:text-amber-600'
                                }`}
                        >
                            Désactivés
                        </button>
                    </div>
                </div>

                {/* 2. Colonne verticale pour le Tri ET la Suppression en masse */}
                <div className="flex flex-col gap-2 flex-1 sm:flex-initial">

                    {/* Le Sélecteur de Tri */}
                    <div className="relative">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <select
                            value={tri}
                            onChange={(e) => setTri(e.target.value as any)}
                            className="w-full sm:w-auto pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-650 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="RECENT">Date : Récent → Ancien</option>
                            <option value="ANCIEN">Date : Ancien → Récent</option>
                            <option value="ALPHABETIQUE">Nom : Ordre alphabétique (A-Z)</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* 💡 Le Bouton de Suppression en masse : Apparaît pile en dessous du Tri si des lignes sont cochées */}
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleSuppressionMasse}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer text-center flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200 disabled:opacity-50"
                        >
                            <span className="w-2 h-2 rounded-full bg-red-550 animate-pulse" />
                            Supprimer la sélection ({selectedIds.length})
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-500 font-medium">Chargement des membres...</p>
                    </div>
                ) : membresFiltresEtTries.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="text-slate-300 font-medium text-lg">Aucun membre trouvé</div>
                        <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                            Aucun résultat ne correspond à vos critères de recherche ou de filtrage.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3 px-4 text-left w-10">
                                        <input
                                            type="checkbox"
                                            checked={membresAffiches.length > 0 && membresAffiches.every(m => selectedIds.includes(m.id))}
                                            onChange={() => {
                                                const tousLesAffichesCoches = membresAffiches.every(m => selectedIds.includes(m.id));
                                                if (tousLesAffichesCoches) {
                                                    const idsAffiches = membresAffiches.map(m => m.id);
                                                    setSelectedIds(prev => prev.filter(id => !idsAffiches.includes(id)));
                                                } else {
                                                    const nouveauxIds = membresAffiches.map(m => m.id).filter(id => !selectedIds.includes(id));
                                                    setSelectedIds(prev => [...prev, ...nouveauxIds]);
                                                }
                                            }}
                                            className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-4 w-4 cursor-pointer"
                                        />
                                    </th>
                                    <th className="py-4 px-6">Membre</th>
                                    <th className="py-4 px-6">Identifiant</th>
                                    <th className="py-4 px-6">Rôle</th>
                                    <th className="py-4 px-6">Téléphone</th>
                                    <th className="py-4 px-6">Statistiques</th>
                                    <th className="py-4 px-6 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                                {membresAffiches.map((membre) => {
                                    const estActif = membre.isActive ?? true;

                                    return (
                                        <tr
                                            key={membre.id}
                                            // 💡 Effet visible : Si le compte est désactivé, la ligne est grisée, passe à 60% d'opacité et perd son effet hover violet
                                            className={`transition-colors group ${estActif
                                                ? 'hover:bg-slate-50/50'
                                                : 'bg-slate-50/40 opacity-60 filter grayscale-[20%]'
                                                }`}
                                        >
                                            <td className="py-4 px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(membre.id)}
                                                    onChange={() => handleSelectRow(membre.id)}
                                                    disabled={membre.id === currentAdminId}
                                                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-4 w-4 cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`font-semibold transition-colors ${estActif ? 'text-slate-900 group-hover:text-violet-950' : 'text-slate-500 line-through decoration-slate-400'
                                                        }`}>
                                                        {membre.nom.toUpperCase()} {membre.prenom}
                                                    </div>
                                                    {/* 💡 Symbole plus visible : Petit badge rouge si désactivé */}
                                                    {!estActif && (
                                                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 rounded animate-pulse">
                                                            INACTIF
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    Inscrit le {new Date(membre.createdAt).toLocaleDateString('fr-FR')}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-mono text-xs text-slate-500">
                                                @{membre.username}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5 items-center">
                                                    <span className={`px-2.5 py-0.5 border rounded-full text-xs font-semibold uppercase tracking-wide ${ROLE_STYLES[membre.role] || ROLE_STYLES.MEMBRE}`}>
                                                        {membre.role?.toLowerCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button
                                                        onClick={() => handleActive(membre.id, membre.isActive)}
                                                        disabled={membre.id === currentAdminId}
                                                        title={membre.id === currentAdminId ? "Vous ne pouvez pas désactiver votre propre compte" : (estActif ? "Désactiver le membre" : "Activer le membre")}
                                                        className={`p-2 rounded-lg transition-all transform hover:scale-110 cursor-pointer disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed ${estActif
                                                            ? "text-emerald-600 hover:bg-emerald-50"
                                                            : "text-amber-600 bg-amber-50/70 border border-amber-200 hover:bg-amber-100 shadow-sm"
                                                            }`}
                                                    >
                                                        {estActif ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => { handleReinitialiser(membre.username) }}
                                                        title="Réinitialiser le mot de passe"
                                                        className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all transform hover:scale-110 cursor-pointer"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setMembreSelectionne(membre);
                                                            setModalDetailsIsOpen(true);
                                                        }}
                                                        title="Voir les détails"
                                                        className="p-2 text-slate-500 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-all transform hover:scale-110 cursor-pointer"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => ouvrirModalModifier(membre)}
                                                        title="Modifier le membre"
                                                        className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all transform hover:scale-110 cursor-pointer"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setMembreSelectionne(membre);
                                                            setModalSupprimerIsOpen(true);
                                                        }}
                                                        disabled={membre.id === currentAdminId}
                                                        title={membre.id === currentAdminId ? "Vous ne pouvez pas supprimer votre propre compte" : "Supprimer le membre"}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110 cursor-pointer disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {membresFiltresEtTries.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 bg-white p-4 rounded-2xl border border-violet-100 shadow-sm animate-in fade-in duration-300">

                        {/* Nombre par page */}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>Afficher</span>
                            <select
                                value={membresParPage}
                                onChange={(e) => {
                                    setMembresParPage(Number(e.target.value));
                                    setPageActuelle(1); // Retour automatique page 1 car l'indexation change
                                }}
                                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer transition-all"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>membres par page</span>
                            <span className="text-xs text-slate-400 font-medium ml-1">
                                (Total : {membresFiltresEtTries.length})
                            </span>
                        </div>

                        {/* Navigation de page */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPageActuelle(prev => Math.max(prev - 1, 1))}
                                disabled={pageActuelle === 1}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-650 text-xs font-bold rounded-xl hover:bg-slate-50 active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-white disabled:active:scale-100 transition-all cursor-pointer"
                            >
                                Précédent
                            </button>

                            <div className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                Page <span className="font-bold text-violet-950">{pageActuelle}</span> sur <span className="font-bold text-slate-800">{totalPages || 1}</span>
                            </div>

                            <button
                                onClick={() => setPageActuelle(prev => Math.min(prev + 1, totalPages))}
                                disabled={pageActuelle === totalPages || totalPages === 0}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-650 text-xs font-bold rounded-xl hover:bg-slate-50 active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-white disabled:active:scale-100 transition-all cursor-pointer"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de détails */}
            <Modal isOpen={modalDetailsIsOpen} onClose={() => setModalDetailsIsOpen(false)} title="Détails du membre">
                {membreSelectionne && (
                    <div className="space-y-4 text-slate-700">
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Nom complet</div>
                                <div className="font-semibold text-slate-900 mt-0.5">{membreSelectionne.nom.toUpperCase()} {membreSelectionne.prenom}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Identifiant</div>
                                <div className="font-mono text-sm text-violet-700 mt-0.5">@{membreSelectionne.username}</div>
                            </div>
                        </div>

                        <div className="space-y-3 px-1">
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-400 font-medium">Rôle</span>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${ROLE_STYLES[membreSelectionne.role]}`}>
                                    {membreSelectionne.role}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-400 font-medium">Téléphone</span>
                                <span className="font-medium text-slate-800">{membreSelectionne.telephone || 'Non renseigné'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-400 font-medium">Date d'inscription</span>
                                <span className="font-medium text-slate-800">{new Date(membreSelectionne.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>

                            {membreSelectionne.tuteur && (
                                <div className="mt-4 p-3 bg-violet-50/50 rounded-xl border border-violet-100/50">
                                    <div className="text-xs font-bold text-violet-800 uppercase tracking-wider mb-1">Responsable Légal (Tuteur)</div>
                                    <div className="text-sm font-semibold text-slate-800">
                                        {membreSelectionne.tuteur.nom.toUpperCase()} {membreSelectionne.tuteur.prenom}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setModalDetailsIsOpen(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal de modification */}
            <Modal isOpen={modalModifierIsOpen} onClose={() => setModalModifierIsOpen(false)} title="Modifier le membre">
                <form onSubmit={handleModifierSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nom</label>
                            <input
                                type="text"
                                value={modifierForm.nom}
                                onChange={(e) => setModifierForm({ ...modifierForm, nom: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Prénom</label>
                            <input
                                type="text"
                                value={modifierForm.prenom}
                                onChange={(e) => setModifierForm({ ...modifierForm, prenom: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Téléphone</label>
                        <input
                            type="text"
                            value={modifierForm.telephone}
                            onChange={(e) => setModifierForm({ ...modifierForm, telephone: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rôle</label>
                        <select
                            value={modifierForm.role}
                            onChange={(e) => setModifierForm({ ...modifierForm, role: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-violet-500 transition-colors"
                        >
                            <option value="ADMIN">Administrateur</option>
                            <option value="INTERVENANT">Intervenant</option>
                            <option value="MEMBRE">Membre</option>
                            <option value="ENFANT">Enfant</option>
                            <option value="PARTENAIRE">Partenaire</option>
                            <option value="BENEVOLE">Bénévole</option>
                            <option value="ETUDIANT">Étudiant</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalModifierIsOpen(false)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-violet-600 text-white rounded-lg shadow-sm hover:bg-violet-700 text-sm font-medium transition-colors"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de suppression */}
            <Modal isOpen={modalSupprimerIsOpen} onClose={() => setModalSupprimerIsOpen(false)} title="Confirmer la suppression">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Êtes-vous sûr de vouloir supprimer définitivement le membre{' '}
                        <span className="font-semibold text-slate-900">
                            {membreSelectionne?.nom.toUpperCase()} {membreSelectionne?.prenom}
                        </span>{' '}
                        ? Cette action effacera également son compte d'authentification et est irréversible.
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={() => setModalSupprimerIsOpen(false)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSupprimer}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 text-sm font-medium transition-colors cursor-pointer"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de création */}
            <Modal isOpen={modalCreerIsOpen} onClose={() => setModalCreerIsOpen(false)} title="Créer un nouveau membre">
                <form onSubmit={handleCreerSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nom</label>
                            <input
                                type="text"
                                value={creerForm.nom}
                                onChange={(e) => setCreerForm({ ...creerForm, nom: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Prénom</label>
                            <input
                                type="text"
                                value={creerForm.prenom}
                                onChange={(e) => setCreerForm({ ...creerForm, prenom: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Identifiant (Lettres, chiffres, _ )</label>
                            <input
                                type="text"
                                value={creerForm.username}
                                onChange={(e) => setCreerForm({ ...creerForm, username: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                placeholder="ex: j_dupont99"
                                pattern="^[a-zA-Z0-9_]+$"
                                title="L'identifiant doit contenir uniquement des lettres (sans accents), des chiffres ou des underscores (_)."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Adresse Email</label>
                            <input
                                type="email"
                                value={creerForm.email}
                                onChange={(e) => setCreerForm({ ...creerForm, email: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                placeholder="ex: jean.dupont@mail.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mot de passe initial</label>
                            <input
                                type="text"
                                value={creerForm.password}
                                onChange={(e) => setCreerForm({ ...creerForm, password: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-sm focus:outline-none"
                                readOnly
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Téléphone</label>
                            <input
                                type="text"
                                value={creerForm.telephone}
                                onChange={(e) => setCreerForm({ ...creerForm, telephone: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                placeholder="ex: 0612345678"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rôle initial</label>
                        <select
                            value={creerForm.role}
                            onChange={(e) => setCreerForm({ ...creerForm, role: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-violet-500 transition-colors"
                        >
                            <option value="ADMIN">Administrateur</option>
                            <option value="INTERVENANT">Intervenant</option>
                            <option value="MEMBRE">Membre</option>
                            <option value="ENFANT">Enfant</option>
                            <option value="PARTENAIRE">Partenaire</option>
                            <option value="BENEVOLE">Bénévole</option>
                            <option value="ETUDIANT">Étudiant</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalCreerIsOpen(false)}
                            className="px-4 py-2 bg-violet-100 text-violet-800 rounded-lg text-sm font-medium hover:bg-violet-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-violet-600 text-white rounded-lg shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-medium transition-colors"
                        >
                            Ajouter
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de création en lot */}
            <Modal isOpen={modalLotIsOpen} onClose={() => setModalLotIsOpen(false)} title="Création de comptes en lot">
                <form onSubmit={handleLotSubmit} className="space-y-4">
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 border border-slate-100 rounded-xl leading-relaxed">
                        Cette option permet de créer plusieurs comptes d'un coup. Le préfixe doit contenir <span className="font-semibold text-violet-700">uniquement des lettres ou des caractères de soulignement (_)</span> (pas de chiffres, d'espaces ou de caractères spéciaux). Si vous indiquez <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-violet-700">etudiant_lycee</code>, les comptes créés auront pour identifiants <code className="font-mono">@etudiant_lycee1</code>, <code className="font-mono">@etudiant_lycee2</code>, etc. Le mot de passe initial sera automatiquement configuré sur <span className="font-semibold text-slate-700">"Password123!"</span> et l'accès obligera un changement à la première connexion.
                    </p>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Préfixe générique (Lettres et _ uniquement)</label>
                        <input
                            type="text"
                            value={lotForm.prefixe}
                            onChange={(e) => setLotForm({ ...lotForm, prefixe: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                            placeholder="ex: etudiant ou classe_a"
                            pattern="^[a-zA-Z_]+$"
                            title="Le préfixe doit contenir uniquement des lettres (sans accents) ou des underscores (_)."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nombre de comptes</label>
                            <input
                                type="number"
                                min={1}
                                max={50}
                                value={lotForm.nombre}
                                onChange={(e) => setLotForm({ ...lotForm, nombre: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rôle attribué</label>
                            <select
                                value={lotForm.role}
                                onChange={(e) => setLotForm({ ...lotForm, role: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-violet-500 transition-colors"
                            >
                                <option value="ADMIN">Administrateur</option>
                                <option value="INTERVENANT">Intervenant</option>
                                <option value="MEMBRE">Membre</option>
                                <option value="ENFANT">Enfant</option>
                                <option value="PARTENAIRE">Partenaire</option>
                                <option value="BENEVOLE">Bénévole</option>
                                <option value="ETUDIANT">Étudiant</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalLotIsOpen(false)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-violet-600 text-white rounded-lg shadow-sm hover:bg-violet-700 disabled:bg-violet-400 text-sm font-medium transition-colors"
                        >
                            {isLoading ? "Génération..." : "Générer les comptes"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
