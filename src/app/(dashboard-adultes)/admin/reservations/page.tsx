// * src/app/(dashboard-adultes)/admin/reservations/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    recupererToutesLesReservations,
    recupererStatsReservations,
    changerStatutReservation,
    ReservationFormatee
} from './actions';
import {
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    Search,
    SlidersHorizontal,
    ArrowLeft,
    User,
    BookOpen
} from 'lucide-react';

export default function AdminReservations() {
    const [isLoading, setIsLoading] = useState(true);
    const [recherche, setRecherche] = useState('');
    const [filtreStatut, setFiltreStatut] = useState<string>('TOUS');

    const [stats, setStats] = useState({ total: 0, enAttente: 0, aujourdhui: 0 });
    const [reservations, setReservations] = useState<ReservationFormatee[]>([]);

    async function chargerDonnees() {
        try {
            setIsLoading(true);
            const [resReservations, resStats] = await Promise.all([
                recupererToutesLesReservations(),
                recupererStatsReservations()
            ]);

            if (resReservations.success && resReservations.data) {
                setReservations(resReservations.data);
            }
            if (resStats.success && resStats.data) {
                setStats(resStats.data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        chargerDonnees();
    }, []);

    const modifierStatut = async (id: string, nouveauStatut: 'CONFIRMED' | 'CANCELLED') => {
        const response = await changerStatutReservation(id, nouveauStatut);
        if (response.success) {
            // Mise à jour optimiste/locale de l'état
            setReservations(prev =>
                prev.map(res => res.id === id ? { ...res, statut: nouveauStatut } : res)
            );
            // Re-calculer les petits compteurs à la volée
            setStats(prev => ({
                ...prev,
                enAttente: nouveauStatut === 'CONFIRMED' || nouveauStatut === 'CANCELLED'
                    ? Math.max(0, prev.enAttente - 1)
                    : prev.enAttente
            }));
        } else {
            alert(response.error || "Une erreur est survenue");
        }
    };

    const reservationsFiltrees = reservations.filter(res => {
        const correspondRecherche =
            res.membreNom.toLowerCase().includes(recherche.toLowerCase()) ||
            res.atelierNom.toLowerCase().includes(recherche.toLowerCase()) ||
            (res.enfantNom && res.enfantNom.toLowerCase().includes(recherche.toLowerCase()));

        const correspondStatut = filtreStatut === 'TOUS' || res.statut === filtreStatut;

        return correspondRecherche && correspondStatut;
    });

    return (
        <div className="min-h-screen bg-violet-50 text-violet-900 p-8">

            {/* EN-TÊTE */}
            <div className="flex flex-col gap-4 border-b border-violet-200 pb-5">
                <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-600 transition-colors w-fit">
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la console
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-violet-950 tracking-tight">Gestion des Réservations</h1>
                    <p className="text-sm text-violet-600 mt-1">Validez ou annulez les inscriptions des membres et de leurs enfants aux ateliers.</p>
                </div>
            </div>

            {/* CARTES STATS */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl">
                <div className="bg-white border border-violet-200 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        {isLoading ? <div className="h-8 w-12 bg-violet-100 animate-pulse rounded" /> : <span className="text-2xl font-bold text-violet-950">{stats.aujourdhui}</span>}
                        <p className="text-sm font-medium text-violet-600">Demandes aujourd'hui</p>
                    </div>
                </div>

                <div className="bg-white border border-violet-200 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        {isLoading ? <div className="h-8 w-12 bg-violet-100 animate-pulse rounded" /> : <span className="text-2xl font-bold text-violet-950">{stats.enAttente}</span>}
                        <p className="text-sm font-medium text-violet-600">En attente (PENDING)</p>
                    </div>
                </div>

                <div className="bg-white border border-violet-200 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        {isLoading ? <div className="h-8 w-12 bg-violet-100 animate-pulse rounded" /> : <span className="text-2xl font-bold text-violet-950">{stats.total}</span>}
                        <p className="text-sm font-medium text-violet-600">Total historique</p>
                    </div>
                </div>
            </div>

            {/* FILTRES */}
            <div className="mt-8 max-w-5xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500" />
                    <input
                        type="text"
                        placeholder="Rechercher un parent, un enfant, un atelier..."
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        className="w-full bg-white border border-violet-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-violet-900 placeholder-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <SlidersHorizontal className="h-4 w-4 text-violet-500 shrink-0" />
                    <select
                        value={filtreStatut}
                        onChange={(e) => setFiltreStatut(e.target.value)}
                        className="bg-white border border-violet-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-violet-500 text-violet-800 font-medium"
                    >
                        <option value="TOUS">Tous les statuts</option>
                        <option value="CONFIRMED">Confirmés</option>
                        <option value="PENDING">En attente</option>
                        <option value="CANCELLED">Annulés</option>
                    </select>
                </div>
            </div>

            {/* TABLEAU */}
            <div className="mt-4 max-w-5xl bg-white border border-violet-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-violet-50 border-b border-violet-200 text-xs font-bold uppercase tracking-wider text-violet-600">
                                <th className="p-4 pl-6">Inscrit / Adhérent</th>
                                <th className="p-4">Atelier convoqué</th>
                                <th className="p-4">Date de l'événement</th>
                                <th className="p-4">Statut BDD</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td className="p-4 pl-6"><div className="h-4 bg-violet-100 rounded w-32 mb-2" /><div className="h-3 bg-violet-100 rounded w-24" /></td>
                                        <td className="p-4"><div className="h-4 bg-violet-100 rounded w-40" /></td>
                                        <td className="p-4"><div className="h-4 bg-violet-100 rounded w-28" /></td>
                                        <td className="p-4"><div className="h-6 bg-violet-100 rounded-full w-20" /></td>
                                        <td className="p-4 pr-6 text-right"><div className="h-8 bg-violet-100 rounded-lg w-20 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : reservationsFiltrees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-violet-500 font-medium">Aucune réservation trouvée.</td>
                                </tr>
                            ) : (
                                reservationsFiltrees.map((res) => (
                                    <tr key={res.id} className="hover:bg-violet-50/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-violet-950 flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5 text-violet-500" />
                                                    {res.membreNom}
                                                </span>
                                                {res.enfantNom && (
                                                    <span className="text-xs text-violet-600 bg-violet-50/60 font-medium px-1.5 py-0.5 rounded mt-1 w-fit">
                                                        Pour l'enfant : {res.enfantNom}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 font-medium text-violet-800">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-violet-500 shrink-0" />
                                                {res.atelierNom}
                                            </div>
                                        </td>

                                        <td className="p-4 text-violet-700 font-medium">
                                            <div className="flex flex-col">
                                                <span>{new Date(res.dateAtelier).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="text-xs text-violet-500 font-normal">à {res.heureAtelier}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            {res.statut === 'CONFIRMED' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                                    Confirmé
                                                </span>
                                            )}
                                            {res.statut === 'PENDING' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                                    En attente
                                                </span>
                                            )}
                                            {res.statut === 'CANCELLED' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                                    Annulé
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                {res.statut === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => modifierStatut(res.id, 'CONFIRMED')}
                                                            className="px-2.5 py-1.5 text-xs font-bold bg-violet-50 hover:bg-violet-600 text-violet-600 hover:text-white rounded-lg transition-colors"
                                                        >
                                                            Accepter
                                                        </button>
                                                        <button
                                                            onClick={() => modifierStatut(res.id, 'CANCELLED')}
                                                            className="p-1.5 text-violet-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {res.statut === 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => modifierStatut(res.id, 'CANCELLED')}
                                                        className="px-2.5 py-1.5 text-xs font-medium border border-violet-200 hover:border-amber-200 text-violet-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                    >
                                                        Annuler
                                                    </button>
                                                )}
                                                {res.statut === 'CANCELLED' && (
                                                    <span className="text-xs text-violet-500 italic">Aucune action</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}