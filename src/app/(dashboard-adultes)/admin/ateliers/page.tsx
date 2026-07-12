// * src/app/(dashboard-adultes)/admin/ateliers/page.tsx
'use client'

declare module '@fullcalendar/react';
declare module '@fullcalendar/daygrid';
declare module '@fullcalendar/timegrid';
declare module '@fullcalendar/interaction';
declare module '@fullcalendar/core/locales/fr';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { Calendar, Loader2, Plus, Trash2, X, Users, MapPin } from 'lucide-react';
import { listerAteliers, sauvegarderAteliers, supprimerAteliers, listerLieux } from './actions';
import Modal from '@/components/Modal';

export default function AdminAteliersPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [lieux, setLieux] = useState<any[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [chargement, setChargement] = useState(true);

    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formStart, setFormStart] = useState('');
    const [formEnd, setFormEnd] = useState('');

    const [formPlacesMax, setFormPlacesMax] = useState<number>(15);
    const [formLieuId, setFormLieuId] = useState<string>('');
    const [formNouveauLieuNom, setFormNouveauLieuNom] = useState<string>('');
    const [formNouveauLieuAdresse, setFormNouveauLieuAdresse] = useState<string>('');

    const chargerDonnees = async () => {
        setChargement(true);
        try {
            const [resAteliers, resLieux] = await Promise.all([listerAteliers(), listerLieux()]);

            if (resLieux.success && resLieux.data) {
                setLieux(resLieux.data);
            }

            if (resAteliers.success && resAteliers.data) {
                const ateliersFormates = resAteliers.data.map((atelier: any) => ({
                    id: atelier.id.toString(),
                    title: atelier.titre,
                    start: new Date(atelier.dateDebut).toISOString().slice(0, 16),
                    end: new Date(atelier.dateFin).toISOString().slice(0, 16),
                    extendedProps: {
                        description: atelier.description || '',
                        placesMax: atelier.placesMax,
                        lieuId: atelier.lieuId
                    }
                }));
                setEvents(ateliersFormates);
            }
        } catch (error) {
            console.error("Erreur chargement donnees:", error);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerDonnees();
    }, []);

    const resetFormulaire = () => {
        setSelectedEventId(null);
        setFormTitle('');
        setFormDescription('');
        setFormPlacesMax(15);
        setFormLieuId('');
        setFormNouveauLieuNom('');
        setFormNouveauLieuAdresse('');
    };

    const handleDateSelect = (selectInfo: any) => {
        resetFormulaire();
        setFormStart(selectInfo.startStr.slice(0, 16));
        setFormEnd(selectInfo.endStr ? selectInfo.endStr.slice(0, 16) : selectInfo.startStr.slice(0, 16));
        setModalIsOpen(true);
    };

    const handleEventClick = (clickInfo: any) => {
        const event = clickInfo.event;
        setSelectedEventId(event.id);
        setFormTitle(event.title);
        setFormDescription(event.extendedProps.description || '');
        setFormStart(event.startStr.slice(0, 16));
        setFormEnd(event.endStr ? event.endStr.slice(0, 16) : event.startStr.slice(0, 16));
        setFormPlacesMax(event.extendedProps.placesMax || 15);
        setFormLieuId(event.extendedProps.lieuId || '');
        setFormNouveauLieuNom('');
        setFormNouveauLieuAdresse('');
        setModalIsOpen(true);
    };

    const handleEventChange = async (changeInfo: any) => {
        const { event } = changeInfo;
        const res = await sauvegarderAteliers({
            id: event.id,
            title: event.title,
            description: event.extendedProps.description,
            start: new Date(event.startStr),
            end: new Date(event.endStr || event.startStr),
            placesMax: event.extendedProps.placesMax || 15,
            lieuId: event.extendedProps.lieuId
        });

        if (!res.success) {
            alert("Erreur lors du déplacement de l'atelier");
            changeInfo.revert();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle || !formStart || !formEnd || !formLieuId) {
            alert("Veuillez remplir les champs obligatoires (Titre, Dates et Lieu)");
            return;
        }
        if (formLieuId === "nouveau" && (!formNouveauLieuNom.trim() || !formNouveauLieuAdresse.trim())) {
            alert("Veuillez renseigner le nom et l'adresse du nouveau lieu");
            return;
        }

        const res = await sauvegarderAteliers({
            id: selectedEventId || undefined,
            title: formTitle,
            description: formDescription,
            start: new Date(formStart),
            end: new Date(formEnd),
            placesMax: formPlacesMax,
            lieuId: formLieuId,
            nouveauLieuNom: formLieuId === "nouveau" ? formNouveauLieuNom : undefined,
            nouveauLieuAdresse: formLieuId === "nouveau" ? formNouveauLieuAdresse : undefined
        });

        if (res.success) {
            setModalIsOpen(false);
            chargerDonnees();
        } else {
            alert("Une erreur est survenue lors de l'enregistrement.");
        }
    };

    const handleSupprimer = async () => {
        if (!selectedEventId) return;

        if (confirm("Êtes-vous sûr de vouloir supprimer cet atelier ?")) {
            const res = await supprimerAteliers(selectedEventId);
            if (res.success) {
                setModalIsOpen(false);
                chargerDonnees();
            } else {
                alert("Impossible de supprimer cet atelier.");
            }
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 text-violet-900 min-h-screen">
            {/* EN-TÊTE PRINCIPAL */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl border border-violet-100 hidden sm:block">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-violet-950 tracking-tight">Gestion des Ateliers</h1>
                        <p className="text-sm text-slate-500 mt-1">Planifiez, modifiez et déplacez vos ateliers directement sur le planning interactif.</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        resetFormulaire();
                        const maintenant = new Date().toISOString().slice(0, 16);
                        setFormStart(maintenant);
                        setFormEnd(maintenant);
                        setModalIsOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all shadow-xs cursor-pointer active:scale-98 self-start sm:self-center"
                >
                    <Plus className="h-4 w-4" />
                    Nouvel atelier
                </button>
            </div>

            {/* ZONE CALENDRIER / CHARGEMENT */}
            {chargement ? (
                <div className="flex flex-col justify-center items-center h-[500px] bg-white rounded-2xl border border-slate-200/80 shadow-xs gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Chargement du planning...</p>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs calendrier">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        locales={[frLocale]}
                        locale="fr"
                        timeZone="local"
                        events={events}
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        eventDrop={handleEventChange}
                        eventResize={handleEventChange}
                        slotMinTime="08:00:00"
                        slotMaxTime="20:00:00"
                        allDaySlot={false}
                        height="auto"
                    />

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .calendrier {
                            --fc-border-color: #e2dff0;
                            --fc-daygrid-event-dot-width: 8px;
                            --fc-event-bg-color: #7c3aed;
                            --fc-event-border-color: #6d28d9;
                            --fc-event-text-color: #ffffff;
                            --fc-button-bg-color: #ffffff;
                            --fc-button-border-color: #d8d4f2;
                            --fc-button-text-color: #1e1b4b; 
                            --fc-button-hover-bg-color: #f5f3ff;
                            --fc-button-hover-border-color: #a78bfa;
                            --fc-button-active-bg-color: #ede9fe;
                            --fc-button-active-border-color: #8b5cf6;
                            --fc-today-bg-color: #eee9ff !important; 
                        }
                        .calendrier .fc-timegrid-slots td, 
                        .calendrier .fc-daygrid-day {
                            background-color: #faf9ff;
                        }
                        .calendrier .fc-toolbar-title {
                            font-size: 1.25rem !important;
                            font-weight: 700 !important;
                            color: #1e1b4b !important;
                            letter-spacing: -0.025em;
                            text-transform: capitalize;
                        }
                        .calendrier .fc-button {
                            border-radius: 0.75rem !important;
                            font-size: 0.875rem !important;
                            font-weight: 600 !important;
                            padding: 0.5rem 0.875rem !important;
                            box-shadow: 0 1px 2px 0 rgba(124, 58, 237, 0.05) !important;
                            transition: all 0.2s;
                            text-transform: capitalize;
                        }
                        .calendrier .fc-button-primary:not(:disabled).fc-button-active,
                        .calendrier .fc-button-primary:not(:disabled):active {
                            background-color: #7c3aed !important;
                            color: #ffffff !important;
                            border-color: #6d28d9 !important;
                        }
                        .calendrier .fc-button-group {
                            gap: 4px;
                        }
                        .calendrier .fc-col-header-cell {
                            background-color: #f5f3ff !important;
                            padding: 12px 0 !important;
                            border-bottom: 2px solid #c0b6f2 !important;
                        }
                        .calendrier .fc-col-header-cell-cushion {
                            color: #4c1d95 !important;
                            font-weight: 700 !important;
                            font-size: 0.875rem;
                            text-decoration: none !important;
                        }
                        .calendrier .fc-timegrid-slot-label-cushion {
                            color: #6d28d9 !important;
                            font-size: 0.75rem !important;
                            font-weight: 500;
                        }
                        .calendrier .fc-timegrid-event, .calendrier .fc-daygrid-event {
                            border-radius: 8px !important;
                            padding: 4px 6px !important;
                            border: none !important;
                            border-left: 4px solid #4c1d95 !important;
                            background-color: #7c3aed !important;
                            box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.2), 0 2px 4px -2px rgba(124, 58, 237, 0.2) !important;
                        }
                        .calendrier .fc-event-title {
                            font-weight: 600 !important;
                            font-size: 0.75rem !important;
                            color: #ffffff !important;
                        }
                        .calendrier .fc-event-time {
                            font-size: 0.7rem !important;
                            color: #f3e8ff !important;
                            font-weight: 500;
                        }
                    `}} />
                </div>
            )}

            {/* Modal Formulaire d'Atelier */}
            <Modal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                title={selectedEventId ? "Modifier l'Atelier" : "Planifier un Atelier"}
            >
                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-violet-800 mb-1.5">Nom de l'atelier</label>
                        <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-violet-900 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400"
                            placeholder="Ex: Atelier Numérique pour débutants"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-violet-800 mb-1.5">Description (Optionnel)</label>
                        <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-violet-900 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400"
                            placeholder="Détails, prérequis ou informations pour l'intervenant..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-violet-800 mb-1.5">Début</label>
                            <input
                                type="datetime-local"
                                value={formStart}
                                onChange={(e) => setFormStart(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-violet-900 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-violet-800 mb-1.5">Fin</label>
                            <input
                                type="datetime-local"
                                value={formEnd}
                                onChange={(e) => setFormEnd(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-violet-900 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* SELECTION DU LIEU */}
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-800 mb-1.5">
                                <MapPin className="h-4 w-4 text-violet-400" /> Lieu de l'atelier
                            </label>
                            <select
                                required
                                value={formLieuId}
                                onChange={(e) => setFormLieuId(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-violet-900 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all bg-white"
                            >
                                <option value="" disabled>-- Sélectionner un lieu --</option>
                                {lieux.map((lieu) => (
                                    <option key={lieu.id} value={lieu.id}>
                                        {lieu.nom}
                                    </option>
                                ))}
                                <option value="nouveau" className="text-violet-600 font-semibold">+ Ajouter un nouveau lieu</option>
                            </select>
                        </div>

                        {/* PLACES MAXIMUM */}
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-800 mb-1.5">
                                <Users className="h-4 w-4 text-violet-400" /> Places maximum
                            </label>
                            <input
                                type="number"
                                min={1}
                                required
                                value={formPlacesMax}
                                onChange={(e) => setFormPlacesMax(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-violet-900 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Formulaire imbriqué pour la création d'un nouveau lieu */}
                    {formLieuId === "nouveau" && (
                        <div className="p-4 bg-violet-50/50 border border-violet-100 rounded-xl space-y-4 animate-fadeIn">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-violet-800 mb-1">Nom du nouveau Lieu</label>
                                <input
                                    type="text"
                                    required={formLieuId === "nouveau"}
                                    value={formNouveauLieuNom}
                                    onChange={(e) => setFormNouveauLieuNom(e.target.value)}
                                    placeholder="Ex: Salle Polyvalente, Centre culturel..."
                                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-violet-900 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all bg-white placeholder:text-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-violet-800 mb-1">Adresse ou descriptif du lieu</label>
                                <input
                                    type="text"
                                    required={formLieuId === "nouveau"}
                                    value={formNouveauLieuAdresse}
                                    onChange={(e) => setFormNouveauLieuAdresse(e.target.value)}
                                    placeholder="Ex: 12 Rue de la République, 06000 Nice"
                                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-violet-900 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all bg-white placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    )}

                    {/* PIED DE MODAL ET ACTIONS */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-5 mt-6 border-t border-slate-100">
                        {selectedEventId ? (
                            <button
                                type="button"
                                onClick={handleSupprimer}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer active:scale-98 shadow-xs"
                            >
                                <Trash2 className="h-4 w-4" />
                                Supprimer l'atelier
                            </button>
                        ) : <div className="hidden sm:block" />}

                        <div className="flex gap-2.5 justify-end">
                            <button
                                type="button"
                                onClick={() => setModalIsOpen(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all cursor-pointer active:scale-98"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all cursor-pointer active:scale-98 shadow-xs"
                            >
                                {selectedEventId ? "Enregistrer les modifications" : "Créer l'atelier"}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}