'use client';

import React, { useState, useEffect } from 'react';
import { Smile, Palette, Check } from 'lucide-react';

import { modifierUtilisateurAvatar } from '../app/(dashboard-enfant)/enfant/modules/actions';

const EMOJIS = ['🦊', '🚀', '🐼', '🧙', '👾', '🦁', '🦄', '🦖', '🎨', '⚽', '🌟', '🍕'];
const COLORS = [
    { name: 'Bleu', class: 'bg-[#b6e3f4] text-sky-900 border-[#a4d7ea]', code: '#b6e3f4' },
    { name: 'Violet', class: 'bg-[#e2d5ff] text-indigo-900 border-[#d4c3ff]', code: '#e2d5ff' },
    { name: 'Rose', class: 'bg-[#ffd0e2] text-pink-900 border-[#ffbcd5]', code: '#ffd0e2' },
    { name: 'Jaune', class: 'bg-[#ffeaa7] text-amber-950 border-[#ffe38c]', code: '#ffeaa7' },
    { name: 'Vert', class: 'bg-[#cbf4c9] text-emerald-950 border-[#b8edb6]', code: '#cbf4c9' },
    { name: 'Orange', class: 'bg-[#ffd3b6] text-orange-950 border-[#ffbf99]', code: '#ffd3b6' },
];

export default function ChildAvatarEditor({ initialAvatar }: { initialAvatar?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState('🦊');
    const [selectedBg, setSelectedBg] = useState(COLORS[0].code);

    // Load initial configuration
    useEffect(() => {
        const savedEmoji = localStorage.getItem('rfc_enfant_avatar_emoji');
        const savedBg = localStorage.getItem('rfc_enfant_avatar_bg');
        if (savedEmoji) {
            setSelectedEmoji(savedEmoji);
        } else if (initialAvatar) {
            const parts = initialAvatar.split(' ');
            if (parts[0]) setSelectedEmoji(parts[0]);
        }
        
        if (savedBg) {
            setSelectedBg(savedBg);
        } else if (initialAvatar) {
            const parts = initialAvatar.split(' ');
            const bgPart = parts[1] || '';
            const bgCode = bgPart.replace('bg-[', '').replace(']', '');
            if (bgCode) setSelectedBg(bgCode);
        }
    }, [initialAvatar]);

    const handleSave = async (emoji: string, bg: string) => {
        setSelectedEmoji(emoji);
        setSelectedBg(bg);
        localStorage.setItem('rfc_enfant_avatar_emoji', emoji);
        localStorage.setItem('rfc_enfant_avatar_bg', bg);
        
        // Save to Database
        const currentBgClass = COLORS.find(c => c.code === bg)?.class || COLORS[0].class;
        // Format as: "emoji bg-[colorCode]"
        const bgPart = currentBgClass.split(' ').find(w => w.startsWith('bg-')) || 'bg-[#b6e3f4]';
        const formatted = `${emoji} ${bgPart}`;
        await modifierUtilisateurAvatar(formatted);

        // Dispatch custom event to notify layout layout header
        window.dispatchEvent(new Event('rfc_enfant_avatar_changed'));
        setIsOpen(false);
    };

    const currentBgClass = COLORS.find(c => c.code === selectedBg)?.class || COLORS[0].class;

    return (
        <div className="relative">
            {/* Clickable Display Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-2xl bg-white border border-violet-100 hover:border-violet-300 py-1.5 pl-1.5 pr-3 shadow-xs hover:shadow-sm transition-all text-left"
                title="Changer mon avatar"
            >
                <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-lg select-none shadow-inner transition-transform active:scale-95 ${currentBgClass}`}>
                    {selectedEmoji}
                </div>
                <div>
                    <div className="text-[10px] font-black text-violet-500 uppercase tracking-widest leading-none">Avatar</div>
                    <div className="text-xs font-bold text-slate-700 leading-tight mt-0.5 flex items-center gap-1">
                        Modifier <span className="text-[9px] opacity-60">⚙️</span>
                    </div>
                </div>
            </button>

            {/* Modal Overlay / Popup panel */}
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-xs"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 mt-3 z-50 w-72 rounded-3xl border border-violet-150 bg-white p-5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="mb-4">
                            <h4 className="text-sm font-black text-violet-950 flex items-center gap-1.5">
                                <Smile className="h-4 w-4 text-violet-600" /> Choisis ton emoji :
                            </h4>
                            <div className="grid grid-cols-6 gap-2 mt-2">
                                {EMOJIS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => handleSave(emoji, selectedBg)}
                                        className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg hover:bg-slate-50 transition-all border ${
                                            selectedEmoji === emoji ? 'border-violet-500 bg-violet-50/50 scale-105 shadow-2xs' : 'border-slate-100'
                                        }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-black text-violet-950 flex items-center gap-1.5">
                                <Palette className="h-4 w-4 text-violet-600" /> Couleur de fond :
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.code}
                                        onClick={() => handleSave(selectedEmoji, color.code)}
                                        className={`h-7 w-7 rounded-full border transition-all relative flex items-center justify-center ${color.class} ${
                                            selectedBg === color.code ? 'scale-110 shadow-xs border-violet-600 ring-2 ring-violet-200' : 'border-slate-200'
                                        }`}
                                        title={color.name}
                                    >
                                        {selectedBg === color.code && (
                                            <Check className="h-3 w-3 absolute" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
