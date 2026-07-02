// * src/app/(dashboard-adultes)/admin/apprenants/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import {
    listerLesApprenants,
} from './actions';
import Modal from '@/components/Modal';
import { Eye, Pencil, Trash2, Search, ArrowUpDown, ChevronDown, UserCheck, UserX } from 'lucide-react';

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

    // Modals
    const [selectedApprenant, setSelectedApprenant] = useState<any>(null);
    const [modalViewIsOpen, setModalViewIsOpen] = useState(false);
    const [modalEditIsOpen, setModalEditIsOpen] = useState(false);

    // Form states
    const [editForm, setEditForm] = useState({ nom: '', prenom: '', telephone: '', role: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        chargerApprenants();
    }, []);

    useEffect(() => {
        filtrerEtTrier();
    }, [apprenants, searchQuery, roleFilter, sortConfig]);

    const chargerApprenants = async () => {
        const res = await listerLesApprenants();
        if (res.success && res.data) {
            setApprenants(res.data);
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

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Suivi des Apprenants</h1>
                    <p className="text-sm text-slate-500 font-medium">Gestion et suivi personnalisé des enfants et des étudiants.</p>
                </div>
            </div>

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
                                <th className="p-4">Contact / Responsable</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {filteredApprenants.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
                                        Aucun apprenant trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredApprenants.map((u) => (
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
                                        <td className="p-4 text-slate-600">
                                            {u.role === 'ENFANT' && u.tuteur ? (
                                                <span className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                                                    Tuteur: {u.tuteur.nom} {u.tuteur.prenom}
                                                </span>
                                            ) : (
                                                u.telephone || <span className="text-slate-400 text-xs">Non renseigné</span>
                                            )}
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