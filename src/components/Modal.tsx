// * src/components/Modal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Bloque le défilement de la page en arrière-plan lorsque la modal est ouverte
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        /* Grand conteneur fixe, centré au milieu de l'écran avec un arrière-plan assombri */
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">

            {/* Arrière-plan cliquable pour fermer la modal */}
            <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

            {/* La boîte blanche centrale (Fiche Profil) */}
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[85vh]">

                {/* En-tête de la Pop-up */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
                    <h3 className="text-base font-bold text-slate-800 m-0">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-base font-bold cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Zone de contenu interne défilable */}
                <div className="flex-1 overflow-y-auto p-5 text-slate-600 text-sm bg-white">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}