'use client'

import React, { useEffect, useState } from 'react';
import { listerTousLesUtilisateurs, modifierUtilisateur, supprimerUtilisateur } from './actions';
import Modal from '@/components/Modal';
import { Eye, Pencil, Trash2, Search, Filter } from 'lucide-react';

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

        setIsLoading(true);
        const reponse = await modifierUtilisateur(membreSelectionne.id, formData);

        if (reponse.success) {
            setModalModifierIsOpen(false);
            setMembreSelectionne(null);
            await chargerMembres();
        } else {
            alert(reponse.error || "Une erreur est survenue.");
            setIsLoading(false);
        }
    };

    const handleSupprimer = async () => {
        if (!membreSelectionne) return;

        setIsLoading(true);
        const reponse = await supprimerUtilisateur(membreSelectionne.id);

        if (reponse.success) {
            setModalSupprimerIsOpen(false);
            setMembreSelectionne(null);
            await chargerMembres();
        } else {
            alert(reponse.error || "Une erreur est survenue.");
            setIsLoading(false);
        }
    };

    if (isLoading && membres.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-violet-600 font-medium animate-pulse">Chargement des membres de l'association...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-violet-950 tracking-tight">Gestion des membres</h1>
                <p className="text-sm text-violet-600/80 mt-1">
                    Visualisez, modifiez les rôles et gérez les profils des familles, intervenants et administrateurs du réseau.
                </p>
            </div>

            <div className="mb-6 p-4 bg-white border border-violet-100 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-3 w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Rechercher un membre (nom, prénom, email...)"
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    />
                </div>

                <div className="relative min-w-[220px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select
                        name="filter"
                        id="filter"
                        className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Tous les rôles</option>
                        <option value="ADMIN">Administrateur</option>
                        <option value="INTERVENANT">Intervenant</option>
                        <option value="MEMBRE">Membre</option>
                        <option value="ENFANT">Enfant</option>
                        <option value="PARTENAIRE">Partenaire</option>
                        <option value="BENEVOLE">Bénévole</option>
                        <option value="ETUDIANT">Étudiant</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-violet-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Nom / Prénom</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">Statistiques</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-violet-900">
                            {membres.map((membre) => (
                                <tr key={membre.id} className="hover:bg-violet-50/40 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900">{membre.nom} {membre.prenom}</span>
                                            {membre.tuteur && (
                                                <span className="text-xs text-violet-500/90 mt-0.5">
                                                    👶 Enfant de : <span className="font-medium">{membre.tuteur.prenom}</span>
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-slate-600 font-normal">
                                        {membre.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            <span className={`px-2.5 py-0.5 border rounded-full text-xs font-semibold uppercase tracking-wide ${ROLE_STYLES[membre.role] || ROLE_STYLES.MEMBRE}`}>
                                                {membre.role?.toLowerCase()}
                                            </span>
                                            {membre.role === 'ENFANT' && membre.niveau && (
                                                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">
                                                    {membre.niveau}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs text-slate-600">
                                            {membre._count?.enfants > 0 && <span>👶 {membre._count.enfants} enfant(s)</span>}
                                            {membre._count?.reservations > 0 && <span>📅 {membre._count.reservations} réservation(s)</span>}
                                            {membre._count?.coursAnimes > 0 && <span className="text-violet-600 font-medium">👨‍🏫 {membre._count.coursAnimes} cours animés</span>}
                                            {membre._count?.dons > 0 && (
                                                <span className="w-fit px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded text-[11px] font-semibold">
                                                    ❤️ Donateur
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
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
                                                title="Supprimer le membre"
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={modalDetailsIsOpen}
                onClose={() => setModalDetailsIsOpen(false)}
                title={membreSelectionne ? `Fiche Profil — ${membreSelectionne.prenom} ${membreSelectionne.nom}` : "Fiche Profil"}
            >
                {membreSelectionne && (
                    <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
                        <div className="flex justify-between items-start bg-violet-50 p-4 rounded-xl border border-violet-200">
                            <div>
                                <h2 className="text-lg font-bold text-violet-950">
                                    {membreSelectionne.nom} {membreSelectionne.prenom}
                                </h2>
                                <p className="text-xs text-violet-600 mt-0.5">
                                    Inscrit(e) le {membreSelectionne.createdAt ? new Date(membreSelectionne.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Inconnue'}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="px-2.5 py-1 bg-violet-600 text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
                                    {membreSelectionne.role}
                                </span>
                                {membreSelectionne.role === 'ENFANT' && membreSelectionne.niveau && (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-medium">
                                        {membreSelectionne.niveau.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-500 border-b border-violet-100 pb-1">
                                Coordonnées de contact
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-lg border border-violet-200 shadow-sm">
                                    <span className="block text-[10px] font-bold text-violet-500 uppercase">Adresse Email</span>
                                    <a href={`mailto:${membreSelectionne.email}`} className="text-sm font-medium text-violet-600 hover:underline break-all">
                                        {membreSelectionne.email}
                                    </a>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-violet-200 shadow-sm">
                                    <span className="block text-[10px] font-bold text-violet-500 uppercase">Téléphone</span>
                                    <p className="text-sm font-medium text-violet-800">
                                        {membreSelectionne.telephone ? (
                                            <a href={`tel:${membreSelectionne.telephone}`} className="hover:underline">{membreSelectionne.telephone}</a>
                                        ) : (
                                            <span className="text-violet-500 italic">Non renseigné</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {(membreSelectionne.tuteur || membreSelectionne._count?.enfants > 0) && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-violet-500 border-b border-violet-100 pb-1">
                                    Structure familiale
                                </h4>
                                {membreSelectionne.tuteur && (
                                    <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-lg flex items-center gap-2.5">
                                        <span className="text-lg">👨‍👩</span>
                                        <div>
                                            <span className="block text-[10px] font-bold text-amber-700 uppercase">Tuteur légal (Parent)</span>
                                            <p className="text-sm font-semibold text-violet-900">
                                                {membreSelectionne.tuteur.prenom} {membreSelectionne.tuteur.nom}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {membreSelectionne._count?.enfants > 0 && (
                                    <div className="bg-violet-50/60 border border-violet-200 p-3 rounded-lg flex items-center gap-2.5">
                                        <span className="text-lg">👶</span>
                                        <div>
                                            <span className="block text-[10px] font-bold text-violet-700 uppercase">Foyer rattaché</span>
                                            <p className="text-sm font-semibold text-violet-900">
                                                {membreSelectionne._count.enfants} enfant(s) enregistré(s) sur ce compte
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-500 border-b border-violet-100 pb-1">
                                Activité & Engagement
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-violet-50 border border-slate-150 p-3 rounded-lg text-center">
                                    <span className="block text-xl mb-1">📅</span>
                                    <span className="block text-xs text-violet-600 font-medium">Réservations</span>
                                    <span className="text-lg font-extrabold text-violet-900">{membreSelectionne._count?.reservations || 0}</span>
                                </div>
                                <div className={`border p-3 rounded-lg text-center ${membreSelectionne._count?.dons > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-violet-50 border-slate-150'}`}>
                                    <span className="block text-xl mb-1">❤️</span>
                                    <span className="block text-xs text-violet-600 font-medium">Dons</span>
                                    <span className={`text-lg font-extrabold ${membreSelectionne._count?.dons > 0 ? 'text-amber-600' : 'text-violet-900'}`}>
                                        {membreSelectionne._count?.dons || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-violet-100 mt-2">
                            <span className="text-[10px] font-mono text-violet-400 break-all select-all">
                                UID: {membreSelectionne.id}
                            </span>
                            <button
                                onClick={() => setModalDetailsIsOpen(false)}
                                className="px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-800 rounded-lg text-sm font-medium transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modalModifierIsOpen} onClose={() => setModalModifierIsOpen(false)} title="Modifier le membre">
                <form onSubmit={handleModifier} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-violet-800 mb-1">Nom</label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="w-full px-3 py-2 border border-violet-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm text-violet-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-violet-800 mb-1">Prénom</label>
                        <input
                            type="text"
                            value={formData.prenom}
                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                            className="w-full px-3 py-2 border border-violet-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm text-violet-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-violet-800 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-violet-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm text-violet-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-violet-800 mb-1">Téléphone</label>
                        <input
                            type="text"
                            value={formData.telephone}
                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                            className="w-full px-3 py-2 border border-violet-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm text-violet-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-violet-800 mb-1">Rôle</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-violet-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm text-violet-900"
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
                            className="px-4 py-2 bg-violet-100 text-violet-800 rounded-lg text-sm font-medium hover:bg-violet-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-violet-600 text-white rounded-lg shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-medium transition-colors"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={modalSupprimerIsOpen} onClose={() => setModalSupprimerIsOpen(false)} title="Confirmer la suppression">
                <div className="space-y-4">
                    <p className="text-sm text-violet-800">Êtes-vous sûr de vouloir supprimer <span className="font-bold">{membreSelectionne?.prenom} {membreSelectionne?.nom} ({membreSelectionne?.email})</span> ? Cette action est irréversible.</p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalSupprimerIsOpen(false)}
                            className="px-4 py-2 bg-violet-100 text-violet-800 rounded-lg text-sm font-medium hover:bg-violet-200 transition-colors"
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
        </div>
    );
}