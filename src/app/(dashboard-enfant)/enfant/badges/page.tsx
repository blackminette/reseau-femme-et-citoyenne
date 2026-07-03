// * src/app/(dashboard-enfant)/enfant/badges/page.tsx
import React from 'react';
import Link from 'next/link';
import { 
    Award, Target, Star, Trophy, Crown, ChevronLeft, 
    Sparkles, CheckCircle2, Lock, HelpCircle 
} from 'lucide-react';
import { obtenirProfilEnfant, obtenirActiviteRecente } from '../modules/actions';

export const metadata = {
    title: 'Mes badges - Espace Enfant',
    description: 'Découvre toutes tes récompenses et les badges que tu as débloqués !',
};

export default async function EnfantBadgesPage() {
    const profile = await obtenirProfilEnfant();
    const recentScores = await obtenirActiviteRecente();

    const enfant = profile || {
        prenom: "Élève",
        nom: "",
        age: 9,
        initiales: "E",
        progression: 0,
        badgesObtenus: 0,
        difficultes: [],
        recommandations: []
    };

    const dbBadgesList = (enfant as any).badges || [];
    const dbBadgesMap = new Map<string, boolean>(dbBadgesList.map((b: any) => [b.label, true]));

    // Map DB status to badges
    const listBadges = [
        { 
            id: '1ers-pas',
            label: '1ers pas', 
            Icon: Target, 
            desc: 'Terminer sa première activité.', 
            obtenu: dbBadgesMap.has("1ers pas"),
            instruction: "Termine n'importe quelle leçon ou réponds à un quiz pour débloquer ce badge !"
        },
        { 
            id: 'score-parfait',
            label: 'Score parfait', 
            Icon: Star, 
            desc: 'Obtenir une note maximale à un quiz.', 
            obtenu: dbBadgesMap.has("Score parfait"),
            instruction: "Réponds correctement à toutes les questions d'un quiz !"
        },
        { 
            id: 'assidu',
            label: 'Assidu', 
            Icon: Trophy, 
            desc: 'Compléter la majorité du parcours.', 
            obtenu: dbBadgesMap.has("Assidu"),
            instruction: "Valide des leçons et des quiz pour atteindre 80% de progression globale !"
        },
        { 
            id: 'expert',
            label: 'Expert', 
            Icon: Crown, 
            desc: 'Compléter tout le parcours.', 
            obtenu: dbBadgesMap.has("Expert"),
            instruction: "Atteins 100% de progression sur tout ton parcours d'apprentissage !"
        },
    ];

    const badgesAcquisCount = listBadges.filter(b => b.obtenu).length;
    const progressionPourcent = Math.round((badgesAcquisCount / listBadges.length) * 100);

    return (
        <div className="text-violet-900">
            {/* ─── Bouton Retour ─── */}
            <div className="mb-4">
                <Link 
                    href="/enfant" 
                    className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3.5 py-2 text-xs font-bold text-violet-700 shadow-xs hover:bg-violet-50 hover:text-violet-900 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Retour au tableau de bord
                </Link>
            </div>

            {/* ─── Barre du haut : titre ─── */}
            <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                    <h1 className="flex items-center gap-2.5 text-[26px] font-bold tracking-tight text-violet-950">
                        <Award className="h-6 w-6 text-violet-600 animate-bounce" aria-hidden /> Mes badges
                    </h1>
                    <p className="text-[13px] text-violet-600">Retrouve ici toutes les récompenses que tu as gagnées en apprenant !</p>
                </div>
            </div>

            {/* ─── Section Progression des Badges ─── */}
            <section className="mt-6 rounded-2xl border border-violet-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                    <h2 className="text-sm font-extrabold text-violet-950">Ta progression de badges</h2>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-violet-100">
                            <div 
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" 
                                style={{ width: `${progressionPourcent}%` }} 
                            />
                        </div>
                        <div className="text-xl font-black text-amber-600">{badgesAcquisCount} / {listBadges.length}</div>
                    </div>
                </div>
                {badgesAcquisCount === listBadges.length ? (
                    <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200/50 p-4 shrink-0">
                        <Crown className="h-8 w-8 text-amber-500 animate-pulse" />
                        <div>
                            <div className="text-xs font-bold text-amber-800">Grand Champion !</div>
                            <div className="text-[11px] text-amber-700/80">Tu as débloqué tous les badges !</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-xs font-medium text-violet-500 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
                        Continue de t'entraîner pour décrocher le badge d'Expert !
                    </div>
                )}
            </section>

            {/* ─── Grille des Badges ─── */}
            <section className="mt-8 mb-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {listBadges.map(({ id, label, Icon, desc, obtenu, instruction }) => (
                        <div 
                            key={id}
                            className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-300 bg-white ${
                                obtenu 
                                    ? 'border-amber-200 bg-gradient-to-br from-amber-50/60 to-white shadow-xs hover:-translate-y-1 hover:shadow-md' 
                                    : 'border-slate-100 bg-slate-50/50 opacity-70'
                            }`}
                        >
                            {/* Ruban / Coin supérieur */}
                            {obtenu && (
                                <div className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center bg-amber-100 rounded-bl-3xl text-amber-600">
                                    <CheckCircle2 className="h-4 w-4 fill-amber-100" />
                                </div>
                            )}

                            <div>
                                {/* Cercle d'icône */}
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner ${
                                    obtenu 
                                        ? 'bg-amber-100/50 text-amber-500' 
                                        : 'bg-slate-200/50 text-slate-300'
                                }`}>
                                    <Icon className="h-8 w-8" />
                                </div>

                                <h3 className="mt-4 text-base font-extrabold text-violet-950 flex items-center gap-1.5">
                                    {label}
                                </h3>
                                <p className="mt-1.5 text-xs font-semibold text-violet-700">{desc}</p>
                                
                                {!obtenu && (
                                    <div className="mt-4 rounded-xl bg-violet-50/60 p-3 border border-violet-100/30">
                                        <div className="text-[10px] font-bold text-violet-500 uppercase tracking-wider flex items-center gap-1">
                                            <Lock className="h-3 w-3" /> Comment l'obtenir :
                                        </div>
                                        <p className="mt-1 text-[11px] leading-relaxed text-violet-600">{instruction}</p>
                                    </div>
                                )}
                            </div>

                            {obtenu && (
                                <div className="mt-6 flex items-center justify-between text-[11px] font-black text-amber-600 uppercase tracking-widest bg-amber-100/30 rounded-xl px-3 py-1.5">
                                    <span>Débloqué !</span>
                                    <span>🎉</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Historique / exploits récents ─── */}
            <section className="mt-8 rounded-2xl border border-violet-200 bg-white p-6 shadow-xs mb-8">
                <h3 className="text-base font-bold text-violet-950">Tes exploits récents</h3>
                <p className="text-[12px] text-violet-500 mt-1">Les dernières activités qui t'ont aidé(e) à progresser :</p>
                
                <div className="mt-4 space-y-3">
                    {recentScores.length > 0 ? (
                        recentScores.map((scoreObj) => (
                            <div key={scoreObj.id} className="flex items-center justify-between border-b border-violet-50 py-3 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${scoreObj.parfait ? 'bg-amber-50 text-amber-500' : 'bg-violet-50 text-violet-600'}`}>
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-extrabold text-violet-950">{scoreObj.nomActivite}</div>
                                        <div className="text-[10px] text-violet-400">{scoreObj.module} • {scoreObj.date}</div>
                                    </div>
                                </div>
                                <div className={`rounded-full px-3 py-1 text-xs font-bold ${scoreObj.parfait ? 'bg-emerald-50 text-emerald-600' : 'bg-violet-50 text-violet-600'}`}>
                                    Score : {scoreObj.score}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <HelpCircle className="h-8 w-8 text-violet-300 animate-pulse" />
                            <p className="mt-2 text-xs text-violet-500 font-semibold">Aucune activité enregistrée.</p>
                            <p className="text-[10px] text-violet-400">Termine ta première leçon ou ton premier quiz pour commencer ton aventure !</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
