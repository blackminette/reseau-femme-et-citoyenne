// * src/components/ChipEnfant.tsx
import { ENFANT } from "@/lib/enfant-data";

/** Pastille profil de l'enfant (avatar initiales + nom + âge), en haut à droite des pages enfant. */
export default function ChipEnfant() {
    return (
        <div className="flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-[0_2px_12px_rgba(109,91,168,0.07)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                {ENFANT.initiales}
            </div>
            <div className="leading-tight">
                <div className="text-[13px] font-bold text-violet-950">{ENFANT.prenom} {ENFANT.nom}</div>
                <div className="text-[11px] text-violet-500">{ENFANT.age} ans</div>
            </div>
        </div>
    );
}
