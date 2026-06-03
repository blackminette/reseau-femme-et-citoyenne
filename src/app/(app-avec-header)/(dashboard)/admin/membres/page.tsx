// * src/app/(app-avec-header)/(dashboard)/admin/membres/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { listerTousLesUtilisateurs } from './actions';

/**
 * Liste complète des membres avec des boutons pour les modifier ou les supprimer.
*/

export default function AdminMembresPage() {
    const [membres, setMembres] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}