// * src/components/IconBadge.tsx
import { type LucideIcon } from "lucide-react";

/**
 * Pastille d'icône « enfantine » : carré aux coins très arrondis, fond pastel
 * coloré et léger relief (façon icône d'application). Utilisée partout dans
 * l'espace enfant pour donner un rendu coloré et ludique.
 */

export type Tone =
    | "violet" | "blue" | "green" | "amber"
    | "pink" | "indigo" | "emerald" | "orange";

// Fond pastel + couleur d'icône assortie, pour chaque teinte.
const TONES: Record<Tone, string> = {
    violet: "bg-violet-100 text-violet-600",
    blue: "bg-sky-100 text-sky-600",
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
    pink: "bg-pink-100 text-pink-600",
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
};

// Palette par défaut pour colorer une liste de façon variée (effet « arc-en-ciel »).
export const TONE_CYCLE: Tone[] = ["violet", "blue", "green", "pink", "amber", "indigo"];

const SIZES = {
    sm: "h-10 w-10 rounded-[14px]",
    md: "h-12 w-12 rounded-2xl",
    lg: "h-14 w-14 rounded-2xl",
} as const;

const ICON_SIZES = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
} as const;

type Props = {
    Icon: LucideIcon;
    tone?: Tone;
    size?: keyof typeof SIZES;
    className?: string;
};

export default function IconBadge({ Icon, tone = "violet", size = "md", className = "" }: Props) {
    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center ${TONES[tone]} ${SIZES[size]} ${className}`}
        >
            <Icon className={ICON_SIZES[size]} aria-hidden strokeWidth={2.25} />
        </span>
    );
}
