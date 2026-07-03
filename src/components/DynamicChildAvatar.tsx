'use client';

import React, { useState, useEffect } from 'react';

const COLORS = [
    { name: 'Bleu', class: 'bg-[#b6e3f4] text-sky-900 border-[#a4d7ea]', code: '#b6e3f4' },
    { name: 'Violet', class: 'bg-[#e2d5ff] text-indigo-900 border-[#d4c3ff]', code: '#e2d5ff' },
    { name: 'Rose', class: 'bg-[#ffd0e2] text-pink-900 border-[#ffbcd5]', code: '#ffd0e2' },
    { name: 'Jaune', class: 'bg-[#ffeaa7] text-amber-950 border-[#ffe38c]', code: '#ffeaa7' },
    { name: 'Vert', class: 'bg-[#cbf4c9] text-emerald-950 border-[#b8edb6]', code: '#cbf4c9' },
    { name: 'Orange', class: 'bg-[#ffd3b6] text-orange-950 border-[#ffbf99]', code: '#ffd3b6' },
];

export default function DynamicChildAvatar({ initialName, initialAvatar }: { initialName: string; initialAvatar?: string }) {
    // Parse helper
    const parseAvatar = (raw: string) => {
        const parts = raw.split(' ');
        const emo = parts[0] || '🦊';
        const bgPart = parts[1] || '';
        const bg = bgPart.replace('bg-[', '').replace(']', '') || '#b6e3f4';
        return { emoji: emo, bg: bg };
    };

    const initial = parseAvatar(initialAvatar || '🦊 bg-[#b6e3f4]');
    const [emoji, setEmoji] = useState(initial.emoji);
    const [bgCode, setBgCode] = useState(initial.bg);

    const updateAvatar = () => {
        const savedEmoji = localStorage.getItem('rfc_enfant_avatar_emoji');
        const savedBg = localStorage.getItem('rfc_enfant_avatar_bg');
        if (savedEmoji) setEmoji(savedEmoji);
        if (savedBg) setBgCode(savedBg);
    };

    useEffect(() => {
        updateAvatar();
        window.addEventListener('rfc_enfant_avatar_changed', updateAvatar);
        return () => {
            window.removeEventListener('rfc_enfant_avatar_changed', updateAvatar);
        };
    }, []);

    const currentBgClass = COLORS.find(c => c.code === bgCode)?.class || COLORS[0].class;

    return (
        <div className="flex items-center gap-2">
            <div className={`h-9 w-9 rounded-full border-2 flex items-center justify-center text-lg select-none shadow-xs transition-all ${currentBgClass}`}>
                {emoji}
            </div>
            <div className="text-left hidden sm:block leading-tight">
                <div className="text-[9px] text-slate-400 font-bold">Bonjour !</div>
                <div className="text-xs font-extrabold text-slate-800 flex items-center gap-0.5">
                    {initialName} <span className="text-[10px] text-slate-400">▼</span>
                </div>
            </div>
        </div>
    );
}
