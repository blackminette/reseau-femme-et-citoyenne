// * src/app/(app-avec-header)/(dashboard)/admin/membres/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { listerTousLesUtilisateurs } from './actions';
import Modal from '@/components/Modal';

/**
 * Liste complète des membres avec des boutons pour les modifier ou les supprimer.
*/

export default function AdminMembresPage() {
    const [membres, setMembres] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [membreSelectionne, setMembreSelectionne] = useState<any | null>(null);

    useEffect(() => {
        async function chargerMembres() {
            const reponse = await listerTousLesUtilisateurs();
            if (reponse.success && reponse.data) {
                setMembres(reponse.data);
            }
            setIsLoading(false);
        }
        chargerMembres();
    }, []);

    if (isLoading) return <p className="text-slate-500">Chargement des membres...</p>;



    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Gestion des membres</h1>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-400 text-sm font-semibold">
                                <th className="pb-3">Nom / Prénom</th>
                                <th className="pb-3">Email</th>
                                <th className="pb-3">Rôle</th>
                                <th className="pb-3">Stats</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {membres.map((membre) => (
                                <tr key={membre.id} className="hover:bg-slate-50">

                                    {/* Colone nom/prénom avec indication du tuteur si c'est un enfant */}
                                    <td className="py-3 font-medium text-slate-900">
                                        <div>
                                            <p className="font-semibold text-slate-900">{membre.nom} {membre.prenom}</p>
                                            {membre.tuteur && (
                                                <p className="text-xs text-slate-400">Enfant de: {membre.tuteur.prenom}</p>
                                            )}
                                        </div>
                                    </td>

                                    {/* Colonne email */}
                                    <td className="py-3 text-slate-500">{membre.email}</td>

                                    {/* Colonne rôle avec badge de niveau pour les enfants */}
                                    <td className="py-3 text-slate-500"><div className="flex gap-1 items-center">
                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">
                                            {membre.role}
                                        </span>
                                        {membre.role === 'ENFANT' && (
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs">
                                                {membre.niveau}
                                            </span>
                                        )}
                                    </div></td>

                                    {/* Colonne stats avec icônes pour les enfants, réservations, cours animés et dons */}
                                    <td className="py-3">
                                        <div className="text-xs text-slate-500 space-y-0.5">
                                            {membre._count.enfants > 0 && <p>👶 {membre._count.enfants} enfant(s)</p>}
                                            {membre._count.reservations > 0 && <p>📅 {membre._count.reservations} réservation(s)</p>}
                                            {membre._count.coursAnimes > 0 && <p>👨‍🏫 {membre._count.coursAnimes} cours animés</p>}
                                            {membre._count.dons > 0 && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-medium text-[10px]">❤️ Donateur</span>}
                                        </div>
                                    </td>

                                    <td className="py-3">
                                        <button
                                            onClick={() => setMembreSelectionne(membre)}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                        >
                                            Détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* modal de détails du membre */}
            <Modal
                isOpen={membreSelectionne !== null}
                onClose={() => setMembreSelectionne(null)}
                title={`Fiche Profil — ${membreSelectionne?.prenom} ${membreSelectionne?.nom}`}
            >
                {membreSelectionne && (
                    <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">

                        {/* EN-TÊTE DE LA FICHE (Statut principal) */}
                        <div className="flex justify-between items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {membreSelectionne.nom} {membreSelectionne.prenom}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Inscrit(e) le {new Date(membreSelectionne.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
                                    {membreSelectionne.role}
                                </span>
                                {/* Si c'est un enfant, on affiche son niveau pédagogique */}
                                {membreSelectionne.role === 'ENFANT' && membreSelectionne.niveau && (
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-medium">
                                        {membreSelectionne.niveau.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* COORDONNÉES ET CONTACT */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                                Coordonnées de contact
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Adresse Email</span>
                                    <a href={`mailto:${membreSelectionne.email}`} className="text-sm font-medium text-blue-600 hover:underline break-all">
                                        {membreSelectionne.email}
                                    </a>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Téléphone</span>
                                    <p className="text-sm font-medium text-slate-700">
                                        {membreSelectionne.telephone ? (
                                            <a href={`tel:${membreSelectionne.telephone}`} className="hover:underline">{membreSelectionne.telephone}</a>
                                        ) : (
                                            <span className="text-slate-400 italic">Non renseigné</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* STRUCTURE ET ENTOURAGE FAMILIAL (Tuteur / Enfants) */}
                        {(membreSelectionne.tuteur || membreSelectionne._count.enfants > 0) && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                                    Structure familiale
                                </h4>

                                {/* Cas 1 : C'est un enfant rattaché à un tuteur (Parent) */}
                                {membreSelectionne.tuteur && (
                                    <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-lg flex items-center gap-2.5">
                                        <span className="text-lg">👨‍👩</span>
                                        <div>
                                            <span className="block text-[10px] font-bold text-amber-700 uppercase">Tuteur légal (Parent)</span>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {membreSelectionne.tuteur.prenom} {membreSelectionne.tuteur.nom}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Cas 2 : C'est un parent qui a des enfants inscrits */}
                                {membreSelectionne._count.enfants > 0 && (
                                    <div className="bg-sky-50/60 border border-sky-200 p-3 rounded-lg flex items-center gap-2.5">
                                        <span className="text-lg">👶</span>
                                        <div>
                                            <span className="block text-[10px] font-bold text-sky-700 uppercase">Foyer rattaché</span>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {membreSelectionne._count.enfants} enfant(s) enregistré(s) sur ce compte
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STATISTIQUES ET ENGAGEMENT SUR LA PLATEFORME */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                                Activité & Engagement
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Réservations aux ateliers */}
                                <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg text-center">
                                    <span className="block text-xl mb-1">📅</span>
                                    <span className="block text-xs text-slate-500 font-medium">Réservations</span>
                                    <span className="text-lg font-extrabold text-slate-800">{membreSelectionne._count.reservations}</span>
                                </div>

                                {/* Dons effectués */}
                                <div className={`border p-3 rounded-lg text-center ${membreSelectionne._count.dons > 0 ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-150'}`}>
                                    <span className="block text-xl mb-1">❤️</span>
                                    <span className="block text-xs text-slate-500 font-medium">Dons</span>
                                    <span className={`text-lg font-extrabold ${membreSelectionne._count.dons > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                                        {membreSelectionne._count.dons}
                                    </span>
                                </div>

                                {/* S'il est enseignant / animateur de cours */}
                                {membreSelectionne.role === 'INTERVENANT' || membreSelectionne._count.coursAnimes > 0 ? (
                                    <div className="bg-indigo-50/50 border border-indigo-200 p-3 rounded-lg text-center col-span-2">
                                        <span className="text-xs text-indigo-700 font-bold uppercase tracking-wide block mb-1">
                                            👨‍🏫 Panel Enseignant / Intervenant
                                        </span>
                                        <p className="text-sm text-slate-700 font-medium">
                                            Anime actuellement <span className="font-bold text-indigo-600">{membreSelectionne._count.coursAnimes}</span> cours / ateliers.
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* PIED DE MODAL (Actions complémentaires) */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                            <span className="text-[10px] font-mono text-slate-300 break-all select-all">
                                UID: {membreSelectionne.id}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setMembreSelectionne(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </Modal>
        </>
    );
}