'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';

// Bouton de déconnexion : ferme la session Supabase puis renvoie à l'accueil.
export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        router.push('/');
    };

    return (
        <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
            <LogOut className="w-4 h-4" aria-hidden /> Déconnexion
        </button>
    );
}
