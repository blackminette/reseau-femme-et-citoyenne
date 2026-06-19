// * src/components/EnfantHeader.tsx
import { type LucideIcon } from "lucide-react";
import ChipEnfant from "@/components/ChipEnfant";

/** Barre du haut des pages enfant : titre (icône optionnelle) + sous-titre, et pastille profil à droite. */
type Props = { titre: string; sousTitre: string; Icon?: LucideIcon };

export default function EnfantHeader({ titre, sousTitre, Icon }: Props) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
                <h1 className="flex items-center gap-2 text-[26px] font-bold tracking-tight text-violet-950">
                    {Icon && <Icon className="h-6 w-6 text-violet-600" aria-hidden />}
                    <span>{titre}</span>
                </h1>
                <p className="text-[13px] text-violet-600">{sousTitre}</p>
            </div>
            <ChipEnfant />
        </div>
    );
}
