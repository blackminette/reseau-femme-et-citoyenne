'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Modal from '@/components/Modal';
import { CalendarDays, FileText, PencilLine, Plus, Trash2 } from 'lucide-react';
import {
    listerActualites,
    sauvegarderActualite,
    supprimerActualite,
    type ActualiteFormatee,
} from './actions';

type FormState = {
    id?: string;
    titre: string;
    tag: string;
    datePublication: string;
    extrait: string;
    ctaLabel: string;
    ctaHref: string;
    ordre: string;
    estPublic: boolean;
};

const FORM_VIDE: FormState = {
    titre: '',
    tag: 'EVENT',
    datePublication: '',
    extrait: '',
    ctaLabel: 'Lire la suite',
    ctaHref: '/ateliers',
    ordre: '1',
    estPublic: true,
};

function formatterDate(dateIso: string) {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(dateIso));
}

export default function AdminBlogPage() {
    const [actualites, setActualites] = useState<ActualiteFormatee[]>([]);
    const [chargement, setChargement] = useState(true);
    const [modalOuverte, setModalOuverte] = useState(false);
    const [form, setForm] = useState<FormState>(FORM_VIDE);
    const [erreur, setErreur] = useState<string | null>(null);

    useEffect(() => {
        let actif = true;

        const charger = async () => {
            const res = await listerActualites();

            if (!actif) {
                return;
            }

            if (res.success && res.data) {
                setActualites(res.data);
            }

            setChargement(false);
        };

        void charger();

        return () => {
            actif = false;
        };
    }, []);

    const chargerActualites = async () => {
        setChargement(true);
        const res = await listerActualites();
        if (res.success && res.data) {
            setActualites(res.data);
        }
        setChargement(false);
    };

    const ouvrirCreation = () => {
        setForm(FORM_VIDE);
        setErreur(null);
        setModalOuverte(true);
    };

    const ouvrirEdition = (actualite: ActualiteFormatee) => {
        setForm({
            id: actualite.id,
            titre: actualite.titre,
            tag: actualite.tag,
            datePublication: actualite.datePublication,
            extrait: actualite.extrait,
            ctaLabel: actualite.ctaLabel,
            ctaHref: actualite.ctaHref,
            ordre: String(actualite.ordre),
            estPublic: actualite.estPublic,
        });
        setErreur(null);
        setModalOuverte(true);
    };

    const gererSauvegarde = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const res = await sauvegarderActualite(form);

        if (res.success) {
            setModalOuverte(false);
            await chargerActualites();
            return;
        }

        setErreur(res.error ?? 'Une erreur est survenue.');
    };

    const gererSuppression = async (id: string) => {
        if (!confirm('Supprimer définitivement cette actualité ?')) {
            return;
        }

        const res = await supprimerActualite(id);
        if (res.success) {
            await chargerActualites();
            return;
        }

        setErreur(res.error ?? 'Impossible de supprimer.');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Gestion des actualités
                        </h1>
                        <p className="text-sm text-slate-500">
                            Créez, classez et publiez les contenus visibles sur la page publique.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={ouvrirCreation}
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        <Plus className="h-4 w-4" />
                        Nouvelle actualité
                    </button>
                </div>
            </div>

            {erreur ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {erreur}
                </div>
            ) : null}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {chargement ? (
                    <div className="flex h-40 items-center justify-center text-slate-500">
                        Chargement des actualités...
                    </div>
                ) : actualites.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                        Aucune actualité enregistrée pour le moment.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {actualites.map((actualite) => (
                            <article
                                key={actualite.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-indigo-200 hover:bg-white"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
                                                {actualite.tag}
                                            </span>
                                            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                                {formatterDate(actualite.datePublication)}
                                            </span>
                                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${actualite.estPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                                {actualite.estPublic ? 'Publié' : 'Brouillon'}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-slate-900">
                                            {actualite.titre}
                                        </h2>

                                        <p className="max-w-4xl text-sm leading-6 text-slate-600">
                                            {actualite.extrait}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                            <span className="inline-flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                CTA: {actualite.ctaLabel}
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4" />
                                                Ordre: {actualite.ordre}
                                            </span>
                                            <span className="text-slate-400">
                                                {actualite.ctaHref}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => ouvrirEdition(actualite)}
                                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
                                        >
                                            <PencilLine className="h-4 w-4" />
                                            Modifier
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => gererSuppression(actualite.id)}
                                            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <Modal
                isOpen={modalOuverte}
                onClose={() => setModalOuverte(false)}
                title={form.id ? 'Modifier une actualité' : 'Nouvelle actualité'}
            >
                <form onSubmit={gererSauvegarde} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-1">
                            <span className="text-sm font-medium text-slate-700">Titre</span>
                            <input
                                type="text"
                                value={form.titre}
                                onChange={(e) => setForm((current) => ({ ...current, titre: e.target.value }))}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                required
                            />
                        </label>
                        <label className="space-y-1">
                            <span className="text-sm font-medium text-slate-700">Tag</span>
                            <input
                                type="text"
                                value={form.tag}
                                onChange={(e) => setForm((current) => ({ ...current, tag: e.target.value }))}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm uppercase outline-none focus:border-indigo-500"
                                required
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-1">
                            <span className="text-sm font-medium text-slate-700">Date de publication</span>
                            <input
                                type="date"
                                value={form.datePublication}
                                onChange={(e) => setForm((current) => ({ ...current, datePublication: e.target.value }))}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                required
                            />
                        </label>
                        <label className="space-y-1">
                            <span className="text-sm font-medium text-slate-700">Ordre</span>
                            <input
                                type="number"
                                value={form.ordre}
                                onChange={(e) => setForm((current) => ({ ...current, ordre: e.target.value }))}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                min={1}
                                required
                            />
                        </label>
                    </div>

                    <label className="space-y-1 block">
                        <span className="text-sm font-medium text-slate-700">Extrait</span>
                        <textarea
                            value={form.extrait}
                            onChange={(e) => setForm((current) => ({ ...current, extrait: e.target.value }))}
                            className="min-h-28 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                            required
                        />
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-1">
                            <span className="text-sm font-medium text-slate-700">CTA</span>
                            <input
                                type="text"
                                value={form.ctaLabel}
                                onChange={(e) => setForm((current) => ({ ...current, ctaLabel: e.target.value }))}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                            />
                        </label>
                        <label className="space-y-1">
                            <span className="text-sm font-medium text-slate-700">Lien CTA</span>
                            <input
                                type="text"
                                value={form.ctaHref}
                                onChange={(e) => setForm((current) => ({ ...current, ctaHref: e.target.value }))}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                            />
                        </label>
                    </div>

                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                        <input
                            type="checkbox"
                            checked={form.estPublic}
                            onChange={(e) => setForm((current) => ({ ...current, estPublic: e.target.checked }))}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                        />
                        <span className="text-sm text-slate-700">Publier sur le site public</span>
                    </label>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalOuverte(false)}
                            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
