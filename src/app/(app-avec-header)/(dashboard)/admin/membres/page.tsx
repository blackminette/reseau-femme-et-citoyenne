// * src/app/(app-avec-header)/(dashboard)/admin/membres/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { listerTousLesUtilisateurs, modifierUtilisateur, supprimerUtilisateur } from './actions';
import Modal from '@/components/Modal';

export default function AdminMembresPage() {
    const [membres, setMembres] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [membreSelectionne, setMembreSelectionne] = useState<any | null>(null);

    const [modalDetailsIsOpen, setModalDetailsIsOpen] = useState(false);
    const [modalModifierIsOpen, setModalModifierIsOpen] = useState(false);
    const [modalSupprimerIsOpen, setModalSupprimerIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        role: ''
    });

    async function chargerMembres() {
        const reponse = await listerTousLesUtilisateurs();
        if (reponse.success && reponse.data) {
            setMembres(reponse.data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        chargerMembres();
    }, []);

    const ouvrirModalModifier = (membre: any) => {
        setMembreSelectionne(membre);
        setFormData({
            nom: membre.nom || '',
            prenom: membre.prenom || '',
            email: membre.email || '',
            telephone: membre.telephone || '',
            role: membre.role || 'MEMBRE'
        });
        setModalModifierIsOpen(true);
    };

    const handleModifier = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!membreSelectionne) return;

        setIsLoading(true); // Petit indicateur visuel
        const reponse = await modifierUtilisateur(membreSelectionne.id, formData);

        if (reponse.success) {
            alert("Membre mis à jour avec succès !");
            setModalModifierIsOpen(false);
            setMembreSelectionne(null);
            await chargerMembres(); // On rafraîchit la liste pour voir la modification en direct
        } else {
            alert(reponse.error || "Une erreur est survenue.");
            setIsLoading(false);
        }
    };

    const handleSupprimer = async () => {
        if (!membreSelectionne) return;

        const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer ${membreSelectionne.prenom} ${membreSelectionne.nom} ? Cette action est irréversible.`);
        if (!confirmation) return;

        setIsLoading(true);
        const reponse = await supprimerUtilisateur(membreSelectionne.id);

        if (reponse.success) {
            alert("Membre supprimé avec succès !");
            setModalSupprimerIsOpen(false);
            setMembreSelectionne(null);
            await chargerMembres();
        } else {
            alert(reponse.error || "Une erreur est survenue.");
            setIsLoading(false);
        }
    }

    if (isLoading && membres.length === 0) return <p className="text-slate-500 p-6">Chargement des membres...</p>;

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
                                <th className="pb-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {membres.map((membre) => (
                                <tr key={membre.id} className="hover:bg-slate-50">
                                    <td className="py-3 font-medium text-slate-900">
                                        <div>
                                            <p className="font-semibold text-slate-900">{membre.nom} {membre.prenom}</p>
                                            {membre.tuteur && (
                                                <p className="text-xs text-slate-400">Enfant de: {membre.tuteur.prenom}</p>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-3 text-slate-500">{membre.email}</td>

                                    <td className="py-3 text-slate-500">
                                        <div className="flex gap-1 items-center">
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">
                                                {membre.role}
                                            </span>
                                            {membre.role === 'ENFANT' && (
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs">
                                                    {membre.niveau}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-3">
                                        <div className="text-xs text-slate-500 space-y-0.5">
                                            {membre._count?.enfants > 0 && <p>👶 {membre._count.enfants} enfant(s)</p>}
                                            {membre._count?.reservations > 0 && <p>📅 {membre._count.reservations} réservation(s)</p>}
                                            {membre._count?.coursAnimes > 0 && <p>👨‍🏫 {membre._count.coursAnimes} cours animés</p>}
                                            {membre._count?.dons > 0 && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-medium text-[10px]">❤️ Donateur</span>}
                                        </div>
                                    </td>

                                    <td className="py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setMembreSelectionne(membre);
                                                    setModalDetailsIsOpen(true);
                                                }}
                                                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                                            >
                                                Détails
                                            </button>
                                            <button
                                                onClick={() => ouvrirModalModifier(membre)}
                                                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setMembreSelectionne(membre);
                                                    setModalSupprimerIsOpen(true);
                                                }}
                                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de détails du membre */}
            <Modal
                isOpen={modalDetailsIsOpen}
                onClose={() => setModalDetailsIsOpen(false)}
                title={membreSelectionne ? `Fiche Profil — ${membreSelectionne.prenom} ${membreSelectionne.nom}` : "Fiche Profil"}
            >
                {membreSelectionne && (
                    <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
                        <div className="flex justify-between items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {membreSelectionne.nom} {membreSelectionne.prenom}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Inscrit(e) le {membreSelectionne.createdAt ? new Date(membreSelectionne.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Inconnue'}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
                                    {membreSelectionne.role}
                                </span>
                                {membreSelectionne.role === 'ENFANT' && membreSelectionne.niveau && (
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-medium">
                                        {membreSelectionne.niveau.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                        </div>

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

                        {(membreSelectionne.tuteur || membreSelectionne._count?.enfants > 0) && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                                    Structure familiale
                                </h4>
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
                                {membreSelectionne._count?.enfants > 0 && (
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

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                                Activité & Engagement
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg text-center">
                                    <span className="block text-xl mb-1">📅</span>
                                    <span className="block text-xs text-slate-500 font-medium">Réservations</span>
                                    <span className="text-lg font-extrabold text-slate-800">{membreSelectionne._count?.reservations || 0}</span>
                                </div>
                                <div className={`border p-3 rounded-lg text-center ${membreSelectionne._count?.dons > 0 ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-150'}`}>
                                    <span className="block text-xl mb-1">❤️</span>
                                    <span className="block text-xs text-slate-500 font-medium">Dons</span>
                                    <span className={`text-lg font-extrabold ${membreSelectionne._count?.dons > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                                        {membreSelectionne._count?.dons || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                            <span className="text-[10px] font-mono text-slate-300 break-all select-all">
                                UID: {membreSelectionne.id}
                            </span>
                            <button
                                onClick={() => setModalDetailsIsOpen(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal de modification de membre sécurisée */}
            <Modal isOpen={modalModifierIsOpen} onClose={() => setModalModifierIsOpen(false)} title="Modifier le membre">
                <form onSubmit={handleModifier} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                        <input
                            type="text"
                            value={formData.prenom}
                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                        <input
                            type="text"
                            value={formData.telephone}
                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800"
                        >
                            <option value="PARTENAIRE">Partenaire</option>
                            <option value="INTERVENANT">Intervenant</option>
                            <option value="MEMBRE">Membre</option>
                            <option value="ADMIN">Admin</option>
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
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-colors"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de confirmation de suppression */}
            <Modal isOpen={modalSupprimerIsOpen} onClose={() => setModalSupprimerIsOpen(false)} title="Confirmer la suppression">
                <div className="space-y-4">
                    <p className="text-sm text-slate-700">Êtes-vous sûr de vouloir supprimer <span className="font-bold">{membreSelectionne?.prenom} {membreSelectionne?.nom} ({membreSelectionne?.email})</span> ? Cette action est irréversible.</p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalSupprimerIsOpen(false)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSupprimer}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}