// * src/components/HeroBanner.tsx
import { type ReactNode } from "react";

/** Bandeau dégradé violet avec cercles décoratifs, partagé par les pages enfant. */
export default function HeroBanner({ children }: { children: ReactNode }) {
    return (
        <section className="relative mt-6 flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[20px] bg-gradient-to-br from-violet-500 to-purple-600 p-7 text-white">
            <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full bg-white/[0.07]" aria-hidden />
            <div className="pointer-events-none absolute right-32 -bottom-20 h-36 w-36 rounded-full bg-white/5" aria-hidden />
            {children}
        </section>
    );
}
