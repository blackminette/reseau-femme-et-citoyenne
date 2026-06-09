// * src/app/(app-avec-header)/(dashboard)/admin/ateliers/page.tsx
'use client'

/** Page pour gérer les ateliers : création, modification, suppression et déplacement sur un calendrier interactif. */

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { listerAteliers, sauvegarderAteliers, supprimerAteliers } from './actions';
import Modal from '@/components/Modal';

export default function AdminAteliersPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [chargement, setChargement] = useState(true);

    // États pour le formulaire de la Modal (Tampon)
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formStart, setFormStart] = useState('');
    const [formEnd, setFormEnd] = useState('');

    const chargerLesAteliers = async () => {
        setChargement(true);
        const res = await listerAteliers();
        if (res.success && res.data) {
            // On mappe (transforme) tes données Atelier pour FullCalendar
            const ateliersFormates = res.data.map((atelier: any) => ({
                id: atelier.id.toString(), // FullCalendar attend une chaîne pour l'ID
                title: atelier.titre,
                start: new Date(atelier.dateDebut).toISOString().slice(0, 16),
                end: new Date(atelier.dateFin).toISOString().slice(0, 16),
                extendedProps: {
                    description: atelier.description || '',
                }
            }));
            setEvents(ateliersFormates);
        }
        setChargement(false);
    };

    useEffect(() => {
        chargerLesAteliers();
    }, []);

    // Clic sur une case vide (Création d'un nouvel atelier)
    const handleDateSelect = (selectInfo: any) => {
        setSelectedEventId(null); // On remet à blanc l'ID pour indiquer une création
        setFormTitle('');
        setFormDescription('');
        // Extraction des dates au format requis par l'input datetime-local (YYYY-MM-DDTHH:MM)
        setFormStart(selectInfo.startStr.slice(0, 16));
        setFormEnd(selectInfo.endStr ? selectInfo.endStr.slice(0, 16) : selectInfo.startStr.slice(0, 16));
        setModalIsOpen(true);
    };

    // Clic sur un atelier existant (Modification / Suppression)
    const handleEventClick = (clickInfo: any) => {
        const event = clickInfo.event;
        setSelectedEventId(event.id);
        setFormTitle(event.title);
        setFormDescription(event.extendedProps.description || '');
        setFormStart(event.startStr.slice(0, 16));
        setFormEnd(event.endStr ? event.endStr.slice(0, 16) : event.startStr.slice(0, 16));
        setModalIsOpen(true);
    };

    // Changement automatique lors d'un Glisser-Déposer (Drag & Drop) ou d'un étirement
    const handleEventChange = async (changeInfo: any) => {
        const { event } = changeInfo;
        const res = await sauvegarderAteliers({
            id: event.id,
            title: event.title,
            description: event.extendedProps.description,
            start: new Date(event.startStr),
            end: new Date(event.endStr || event.startStr)
        });

        if (!res.success) {
            alert("Erreur lors du déplacement de l'atelier");
            changeInfo.revert(); // Annule le déplacement visuel si ça plante en BDD
        }
    };

    // Soumission du Formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await sauvegarderAteliers({
            id: selectedEventId || undefined,
            title: formTitle,
            description: formDescription,
            start: new Date(formStart),
            end: new Date(formEnd),
        });

        if (res.success) {
            setModalIsOpen(false);
            chargerLesAteliers();
        } else {
            alert("Une erreur est survenue lors de l'enregistrement.");
        }
    };

    // Suppression d'un atelier
    const handleSupprimer = async () => {
        if (!selectedEventId) return;

        if (confirm("Êtes-vous sûr de vouloir supprimer cet atelier ?")) {
            const res = await supprimerAteliers(selectedEventId);
            if (res.success) {
                setModalIsOpen(false);
                chargerLesAteliers();
            } else {
                alert("Impossible de supprimer cet atelier.");
            }
        }
    };
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestion des Ateliers</h1>
                    <p className="text-sm text-slate-500">Planifiez, modifiez et déplacez vos ateliers directement sur le planning interactif.</p>
                </div>
            </div>

            {chargement ? (
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek" // Affiche la vue semaine par default
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        locales={[frLocale]}
                        locale="fr" // Calendrier en français
                        timeZone="local"
                        events={events}
                        editable={true} // Active le Drag & Drop et l'étirement des événements
                        selectable={true} // Permet de cliquer/glisser sur des créneaux vides
                        selectMirror={true}
                        dayMaxEvents={true}
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        eventDrop={handleEventChange} // Déclenché quand on glisse/déplace un événement
                        eventResize={handleEventChange} // Déclenché quand on étire la durée d'un événement
                        slotMinTime="08:00:00" // Heure de début visible (8h)
                        slotMaxTime="20:00:00" // Heure de fin visible (20h)
                        allDaySlot={false} // Désactive la ligne "Toute la journée" pour gagner de la place
                        height="auto"
                    />
                </div>
            )}

            {/* Modal Formulaire d'Atelier */}
            <Modal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                title={selectedEventId ? "Modifier l'Atelier" : "Planifier un Atelier"}
            >
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'atelier</label>
                        <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Ex: Atelier Peinture, Cours de Yoga..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optionnel)</label>
                        <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Ajouter des précisions sur l'atelier..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date & Heure de début</label>
                            <input
                                type="datetime-local"
                                value={formStart}
                                onChange={(e) => setFormStart(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date & Heure de fin</label>
                            <input
                                type="datetime-local"
                                value={formEnd}
                                onChange={(e) => setFormEnd(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-5 mt-6 border-t border-slate-100">
                        {selectedEventId ? (
                            <button
                                type="button"
                                onClick={handleSupprimer}
                                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
                            >
                                Supprimer l'atelier
                            </button>
                        ) : <div />}

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setModalIsOpen(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                            >
                                {selectedEventId ? "Enregistrer" : "Créer l'atelier"}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}