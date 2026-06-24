// * src/components/EnfantHeader.tsx
import { type LucideIcon } from "lucide-react";
import ChipEnfant from "@/components/ChipEnfant";
import IconBadge from "@/components/IconBadge";

/** Barre du haut des pages enfant : titre (icône optionnelle) + sous-titre, et pastille profil à droite. */
type Props = { titre: string; sousTitre: string; Icon?: LucideIcon };

export default function EnfantHeader({ titre, sousTitre, Icon }: Props) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-3">
                {Icon && <IconBadge Icon={Icon} tone="violet" size="md" />}
                <div>
                    <h1 className="text-[26px] font-bold tracking-tight text-violet-950">{titre}</h1>
                    <p className="text-[13px] text-violet-600">{sousTitre}</p>
                </div>
            </div>
            <ChipEnfant />
        </div>
    );
}
