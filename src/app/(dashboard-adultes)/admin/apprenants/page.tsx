// * src/app/(dashboard-adultes)/admin/apprenants/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import {
    listerLesApprenants,
} from './actions';
import Modal from '@/components/Modal';
import { Eye, Search, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, CheckCircle, Calendar, BookOpen, Layers } from 'lucide-react';

const ROLE_STYLES: Record<string, string> = {
    ETUDIANT: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    ENFANT: 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function SuiviApprenantsPage() {
    const [apprenants, setApprenants] = useState<any[]>([]);
    const [filteredApprenants, setFilteredApprenants] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('TOUS');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modals
    const [selectedApprenant, setSelectedApprenant] = useState<any>(null);
    const [modalViewIsOpen, setModalViewIsOpen] = useState(false);

    useEffect(() => {
        chargerApprenants();
    }, []);

    useEffect(() => {
        filtrerEtTrier();
        setCurrentPage(1);
    }, [apprenants, searchQuery, roleFilter, sortConfig]);

    const chargerApprenants = async () => {
        const res = await listerLesApprenants();
        if (res.success && res.data) {
            const donneesFormatees = res.data.map((u: any) => {
                const totalQuiz = u.ScoreQuiz?.length || 0;
                const scoreMoyen = totalQuiz > 0
                    ? Math.round(u.ScoreQuiz.reduce((acc: number, curr: any) => acc + curr.score, 0) / totalQuiz)
                    : null;
                return { ...u, totalQuiz, scoreMoyen };
            });
            setApprenants(donneesFormatees);
        }
    };

    const filtrerEtTrier = () => {
        let resultat = [...apprenants];

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            resultat = resultat.filter(u =>
                u.nom.toLowerCase().includes(query) ||
                u.prenom.toLowerCase().includes(query) ||
                u.username.toLowerCase().includes(query)
            );
        }

        if (roleFilter !== 'TOUS') {
            resultat = resultat.filter(u => u.role === roleFilter);
        }

        if (sortConfig) {
            resultat.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
                if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;

                if (typeof aValue === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            });
        }

        setFilteredApprenants(resultat);
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Calculs pour la pagination
    const totalItems = filteredApprenants.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredApprenants.slice(indexOfFirstItem, indexOfLastItem);

    const getScoreStyle = (score: number | null) => {
        if (score === null) return 'bg-slate-100 text-slate-400 border-slate-200';
        if (score >= 70) return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
        if (score >= 40) return 'bg-amber-50 text-amber-700 border-amber-200 font-bold';
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
    };

    // Formater l'affichage textuel du parcours
    const formatParcours = (parcoursArray: string[]) => {
        if (!parcoursArray || parcoursArray.length === 0) return 'Non spécifié';
        return parcoursArray.map(p => p.charAt(0) + p.slice(1).toLowerCase()).join(', ');
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
            {/* En-tête */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Suivi des Apprenants</h1>
                    <p className="text-sm text-slate-500 font-medium">Gestion et suivi personnalisé des enfants et des étudiants.</p>
                </div>
            </div>

            {/* --- BLOC STATISTIQUES GLOBALES --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Apprenants</span>
                    <span className="text-3xl font-extrabold text-slate-900 mt-2">{apprenants.length}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Étudiants (Adultes)</span>
                    <span className="text-3xl font-extrabold text-indigo-600 mt-2">
                        {apprenants.filter(u => u.role === 'ETUDIANT').length}
                    </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enfants</span>
                    <span className="text-3xl font-extrabold text-slate-700 mt-2">
                        {apprenants.filter(u => u.role === 'ENFANT').length}
                    </span>
                </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom ou pseudo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                    />
                </div>
                <div className="relative min-w-[160px]">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:outline-none focus:border-violet-500 focus:bg-white transition-all cursor-pointer font-medium"
                    >
                        <option value="TOUS">Tous les apprenants</option>
                        <option value="ENFANT">Enfants</option>
                        <option value="ETUDIANT">Étudiants</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('nom')}>
                                    <div className="flex items-center gap-1.5">Identité <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="p-4">Nom d'utilisateur</th>
                                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('role')}>
                                    <div className="flex items-center gap-1.5">Type <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('totalQuiz')}>
                                    <div className="flex items-center gap-1.5">Quiz faits <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('scoreMoyen')}>
                                    <div className="flex items-center gap-1.5">Moyenne Globale <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="p-4">Contact / Responsable</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
                                        Aucun apprenant trouvé.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-4 font-semibold text-slate-900">
                                            {u.nom.toUpperCase()} {u.prenom}
                                        </td>
                                        <td className="p-4 text-slate-500 font-medium">@{u.username}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${ROLE_STYLES[u.role] || 'bg-slate-100'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle size={15} className="text-slate-400" />
                                                {u.totalQuiz} quiz
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs border ${getScoreStyle(u.scoreMoyen)}`}>
                                                {u.scoreMoyen !== null ? `${u.scoreMoyen} %` : 'Aucun quiz'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            {u.role === 'ENFANT' && u.tuteur ? (
                                                <span className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                                                    Tuteur: {u.tuteur.nom} {u.tuteur.prenom}
                                                </span>
                                            ) : (
                                                u.telephone || <span className="text-slate-400 text-xs">Non renseigné</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedApprenant(u);
                                                    setModalViewIsOpen(true);
                                                }}
                                                className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                                                title="Voir l'historique détaillé"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Barre de pagination */}
                {totalItems > 0 && (
                    <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500">
                                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, totalItems)} sur {totalItems} apprenant(s)
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-400">Lignes :</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="bg-white border border-slate-200 text-xs rounded px-1.5 py-0.5 focus:outline-none focus:border-violet-500 text-slate-700 font-bold cursor-pointer"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === page
                                        ? 'bg-violet-600 text-white shadow-sm'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de prévisualisation - Historique détaillé */}
            <Modal
                isOpen={modalViewIsOpen}
                onClose={() => setModalViewIsOpen(false)}
                title={`Historique de progression : ${selectedApprenant?.prenom} ${selectedApprenant?.nom?.toUpperCase()}`}
                size="max-w-5xl" // <-- Ici, on force la modal à devenir très large uniquement pour cette page !
            >
                <div className="p-1 space-y-4 w-full max-h-[75vh] overflow-y-auto">
                    {!selectedApprenant?.ScoreQuiz || selectedApprenant.ScoreQuiz.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-medium">
                            Cet apprenant n'a pas encore validé d'exercices ou de quiz.
                        </div>
                    ) : (
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm table-auto">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                                            <th className="p-3 w-[15%]"><div className="flex items-center gap-1.5"><Layers size={14} /> Parcours</div></th>
                                            <th className="p-3 w-[25%]"><div className="flex items-center gap-1.5"><BookOpen size={14} /> Module</div></th>
                                            <th className="p-3 w-[35%]">Exercice / Cours</th>
                                            <th className="p-3 w-[12%] text-center">Score</th>
                                            <th className="p-3 w-[13%]"><div className="flex items-center gap-1.5"><Calendar size={14} /> Date</div></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                                        {[...selectedApprenant.ScoreQuiz]
                                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                            .map((sq: any) => (
                                                <tr key={sq.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="p-3 text-xs whitespace-nowrap">
                                                        <span className="bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-md font-bold">
                                                            {formatParcours(sq.exercice?.cours?.module?.parcours)}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-slate-900 font-semibold">
                                                        {sq.exercice?.cours?.module?.titre || <span className="text-slate-400 italic text-xs">Inconnu</span>}
                                                    </td>
                                                    <td className="p-3 text-slate-600">
                                                        <div className="font-semibold text-slate-800 break-words">{sq.exercice?.titre}</div>
                                                        <div className="text-xs text-slate-400 break-words">{sq.exercice?.cours?.titre}</div>
                                                    </td>
                                                    <td className="p-3 text-center whitespace-nowrap">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs border ${getScoreStyle(sq.score)}`}>
                                                            {sq.score} %
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-xs text-slate-400 whitespace-nowrap">
                                                        {new Date(sq.createdAt).toLocaleDateString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}