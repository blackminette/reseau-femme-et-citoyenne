// * src/app/(app-sans-header)/enfant/ateliers/page.tsx
import {
    Palette, MapPin, Baby, CreditCard, Banknote,
    Check, Clock, X, CalendarDays, Users, Sparkles, HelpCircle,
} from "lucide-react";
import { obtenirProfilEnfant } from "../modules/actions";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Mes ateliers",
    description: "Tes ateliers réservés et les propositions pour ton âge.",
};

// Style du statut d'une réservation (bordure gauche + pastille).
const STATUT: Record<string, { border: string; pill: string; Icon: typeof Check }> = {
    "CONFIRMED": { border: "border-l-emerald-500", pill: "bg-emerald-50 text-emerald-600", Icon: Check },
    "PENDING": { border: "border-l-amber-500", pill: "bg-amber-50 text-amber-600", Icon: Clock },
    "REFUSED": { border: "border-l-rose-500", pill: "bg-rose-50 text-rose-600", Icon: X },
};

// Map des icônes d'ateliers par défaut
const DEFAULT_ICONS: Record<string, typeof Palette> = {
    "peinture": Palette,
    "couture": Palette,
    "argile": Palette
};

export default async function EnfantAteliersPage() {
    const profile = await obtenirProfilEnfant();
    const enfant = profile || {
        prenom: "Élève",
        nom: "",
        age: 9,
        initiales: "E",
        id: "mock-id"
    };

    // Charger les réservations réelles de cet enfant depuis la base de données
    const reservations = await prisma.reservation.findMany({
        where: {
            utilisateurId: (enfant as any).id || "mock-id"
        },
        include: {
            atelier: {
                include: {
                    lieu: true
                }
            }
        },
        orderBy: {
            dateReservation: "desc"
        }
    });

    // Charger les ateliers proposés (catalogue d'ateliers non privés)
    const tousAteliers = await prisma.atelier.findMany({
        where: {
            estPrive: false,
            dateDebut: {
                gt: new Date()
            }
        },
        include: {
            lieu: true
        },
        orderBy: {
            dateDebut: "asc"
        }
    });

    // Transformer le catalogue pour le format attendu par la vue enfant
    const proposes = tousAteliers.map(a => {
        const dateFormatted = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(a.dateDebut));
        const heureFormatted = `${new Date(a.dateDebut).getHours()}h00 – ${new Date(a.dateFin).getHours()}h00`;
        
        return {
            id: a.id.toString(),
            titre: a.titre,
            Icon: DEFAULT_ICONS[a.titre.toLowerCase()] || Palette,
            couleur: "#9b8cff",
            desc: a.description || "Découvre cet atelier passionnant !",
            ageMin: 6,
            ageMax: 12,
            date: dateFormatted,
            heure: heureFormatted,
            places: a.placesMax,
            lieu: a.lieu.nom
        };
    });

    return (
        <div className="text-violet-900">

            {/* ─── Barre du haut : titre + chip enfant ─── */}
            <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                    <h1 className="flex items-center gap-2 text-[26px] font-bold tracking-tight text-violet-950">
                        <Palette className="h-6 w-6 text-violet-600" aria-hidden /> Mes ateliers
                    </h1>
                    <p className="text-[13px] text-violet-600">Retrouve ici tes ateliers réservés et les propositions pour ton âge.</p>
                </div>
                <div className="flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-[0_2px_12px_rgba(109,91,168,0.07)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                        {enfant.initiales}
                    </div>
                    <div className="leading-tight">
                        <div className="text-[13px] font-bold text-violet-950">{enfant.prenom} {enfant.nom}</div>
                        <div className="text-[11px] text-violet-500">{enfant.age} ans</div>
                    </div>
                </div>
            </div>

            {/* ─── Stat : nombre d'ateliers réservés ─── */}
            <div className="mt-6 flex max-w-[220px] items-center gap-4 rounded-2xl border border-violet-200 bg-white p-5 shadow-xs">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                    <Palette className="h-6 w-6" aria-hidden />
                </div>
                <div>
                    <span className="text-2xl font-bold tracking-tight text-violet-950">{reservations.length}</span>
                    <p className="text-sm font-medium text-violet-600">Ateliers réservés</p>
                </div>
            </div>

            {/* ─── Ateliers réservés ─── */}
            <section className="mt-8">
                <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-violet-800">
                    <CalendarDays className="h-5 w-5 text-violet-600" aria-hidden /> Mes ateliers réservés
                </h3>
                <div className="mt-4 grid gap-3">
                    {reservations.length > 0 ? (
                        reservations.map((r) => {
                            const st = STATUT[r.statut] || STATUT["PENDING"];
                            const day = new Date(r.atelier.dateDebut).getDate();
                            const month = new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(new Date(r.atelier.dateDebut)).toUpperCase();
                            const year = new Date(r.atelier.dateDebut).getFullYear();
                            
                            return (
                                <div key={r.id} className={`flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-violet-200 border-l-4 bg-white shadow-xs ${st.border}`}>
                                    {/* Bloc date */}
                                    <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center bg-gradient-to-br from-violet-50 to-violet-100 p-4 text-center sm:min-w-[92px] gap-2 sm:gap-0">
                                        <div className="flex items-baseline sm:block gap-1.5">
                                            <div className="text-xl sm:text-2xl font-extrabold leading-none text-violet-700">{day}</div>
                                            <div className="text-[11px] font-semibold uppercase text-violet-500">{month}</div>
                                        </div>
                                        <div className="text-[10px] text-violet-400">{year}</div>
                                    </div>
                                    {/* Corps */}
                                    <div className="flex-1 p-4">
                                        <div className="flex items-center gap-2 font-bold text-violet-950">
                                            <Palette className="h-[18px] w-[18px] text-violet-600" aria-hidden /> {r.atelier.titre}
                                        </div>
                                        <div className="mt-1.5 space-y-1 text-[12.5px] text-violet-500">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden /> {r.atelier.lieu.nom}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" aria-hidden /> Enregistré</span>
                                                <span className="text-violet-300">·</span> Demandé le {new Intl.DateTimeFormat('fr-FR').format(new Date(r.dateReservation))}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Statut */}
                                    <div className="flex items-center px-4 pb-4 sm:pb-0 sm:pr-4">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${st.pill}`}>
                                            <st.Icon className="h-3.5 w-3.5" aria-hidden /> {r.statut === "CONFIRMED" ? "Confirmé" : r.statut === "PENDING" ? "En attente" : "Refusé"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white border border-violet-100 rounded-2xl p-6 text-center text-xs font-semibold text-violet-500">
                            Tu n'as aucun atelier réservé pour l'instant. Demande à tes parents de t'inscrire à une activité !
                        </div>
                    )}
                </div>
            </section>

            {/* ─── Séparateur ─── */}
            <div className="my-7 flex items-center gap-3 text-sm font-bold text-violet-500">
                <div className="h-px flex-1 bg-violet-200" />
                <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" aria-hidden /> Ateliers proposés pour ton âge</span>
                <div className="h-px flex-1 bg-violet-200" />
            </div>

            {/* ─── Catalogue proposé ─── */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-violet-400">
                Ce qui est proposé pour toi — si quelque chose te plaît, parle-en à tes parents !
                <span className="rounded-full bg-violet-50 px-3 py-0.5 text-[12px] font-semibold text-violet-600">{enfant.age} ans</span>
            </div>

            <section className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {proposes.length > 0 ? (
                    proposes.map((a) => (
                        <div key={a.id} className="flex gap-3.5 rounded-2xl border border-violet-200 bg-white p-4 shadow-xs">
                            <div
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                                style={{ backgroundColor: `${a.couleur}22`, color: a.couleur }}
                            >
                                <a.Icon className="h-6 w-6" aria-hidden />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-bold text-violet-950">{a.titre}</div>
                                <div className="mt-1 text-[11.5px] leading-snug text-violet-500">{a.desc}</div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600"><CalendarDays className="h-3 w-3" aria-hidden /> {a.date}</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600"><Clock className="h-3 w-3" aria-hidden /> {a.heure}</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600"><MapPin className="h-3 w-3" aria-hidden /> {a.lieu}</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600"><Users className="h-3 w-3" aria-hidden /> {a.places} places</span>
                                </div>
                                <span className="mt-2 inline-block rounded-full bg-gradient-to-r from-violet-500 to-purple-400 px-2.5 py-0.5 text-[10.5px] font-semibold text-white">{a.ageMin} – {a.ageMax} ans</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white border border-violet-100 rounded-2xl p-6 text-center text-xs font-semibold text-violet-400">
                        Aucun atelier disponible dans le catalogue pour le moment.
                    </div>
                )}
            </section>
        </div>
    );
}
