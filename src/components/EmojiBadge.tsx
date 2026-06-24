// * src/components/EmojiBadge.tsx
/**
 * Pastille d'emoji colorée pour l'espace enfant : carré aux coins très arrondis,
 * fond pastel, emoji centré. Donne le rendu coloré et ludique voulu par la maquette
 * (icônes « cartoon » plutôt que les traits fins de lucide).
 */

export type Tone =
    | "violet" | "blue" | "green" | "amber"
    | "pink" | "indigo" | "emerald" | "orange";

const TONES: Record<Tone, string> = {
    violet: "bg-violet-100",
    blue: "bg-sky-100",
    green: "bg-green-100",
    amber: "bg-amber-100",
    pink: "bg-pink-100",
    indigo: "bg-indigo-100",
    emerald: "bg-emerald-100",
    orange: "bg-orange-100",
};

// Palette par défaut pour colorer une liste de façon variée (effet « arc-en-ciel »).
export const TONE_CYCLE: Tone[] = ["violet", "blue", "green", "pink", "amber", "indigo"];

const SIZES = {
    sm: "h-10 w-10 rounded-[14px] text-xl",
    md: "h-12 w-12 rounded-2xl text-2xl",
    lg: "h-14 w-14 rounded-2xl text-[28px]",
} as const;

type Props = {
    emoji: string;
    tone?: Tone;
    size?: keyof typeof SIZES;
    className?: string;
};

export default function EmojiBadge({ emoji, tone = "violet", size = "md", className = "" }: Props) {
    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center leading-none transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${TONES[tone]} ${SIZES[size]} ${className}`}
            aria-hidden
        >
            {emoji}
        </span>
    );
}
