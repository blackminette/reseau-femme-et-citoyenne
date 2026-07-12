// * src/app/(dashboard-adultes)/membre/modules/[id]/activite/[actId]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft, Star, Trophy, Check, RotateCcw,
    Sparkles, BookOpen, HelpCircle
} from 'lucide-react';
import { obtenirDetailsActiviteAdulte, sauvegarderResultatAdulte, obtenirDetailsModuleAdulte } from '../../../../actions';

type Question = {
    q: string;
    options: string[];
    answer: number;
    explication: string;
};

type LeconSlide = {
    titre: string;
    texte: string;
    imagePlaceholder: string;
    bgColor: string;
};

type PageParams = Promise<{ id: string; actId: string }>;

export default function AdulteActivityPage({ params }: { params: PageParams }) {
    const { id, actId } = use(params);
    const router = useRouter();

    const [displayModule, setDisplayModule] = useState<{ id: string; label: string } | null>(null);
    const [loading, setLoading] = useState(true);

    // États communs
    const [currentStep, setCurrentStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // États dynamiques pour l'activité
    const [slides, setSlides] = useState<LeconSlide[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [activityType, setActivityType] = useState<'lecon' | 'quiz' | null>(null);

    // États pour les Quiz
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    const isLecon = activityType === 'lecon';
    const isQuiz = activityType === 'quiz';

    useEffect(() => {
        if (!id || !actId) return;

        async function loadData() {
            setLoading(true);
            try {
                const dbMod = await obtenirDetailsModuleAdulte(id);
                if (dbMod) {
                    setDisplayModule({ id: dbMod.id, label: dbMod.label });
                }

                const actData = await obtenirDetailsActiviteAdulte(actId);
                if (actData) {
                    if (actData.type === 'LECON') {
                        setSlides(actData.contenu as LeconSlide[]);
                        setActivityType('lecon');
                    } else if (actData.type === 'QUIZ') {
                        const qList = JSON.parse(actData.instructions);
                        setQuestions(qList);
                        setActivityType('quiz');
                    }
                }
            } catch (e) {
                console.error("Erreur de chargement de l'activité:", e);
            }
            setLoading(false);
        }

        loadData();
    }, [id, actId]);

    // Confettis
    useEffect(() => {
        if (isFinished) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isFinished]);

    // Sauvegarde
    const handleSaveActivity = async () => {
        let scoreToSave = 1;
        if (isQuiz) {
            scoreToSave = score;
        }

        try {
            await sauvegarderResultatAdulte(actId, scoreToSave);
        } catch (err) {
            console.error("Erreur de sauvegarde:", err);
        }

        router.push(`/membre/modules/${id}`);
    };

    // Quiz
    const handleAnswerQuiz = (index: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);
        setShowExplanation(true);
        if (index === questions[currentStep].answer) {
            setScore(score + 1);
        }
    };

    const handleNextQuiz = () => {
        setSelectedOption(null);
        setShowExplanation(false);
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-violet-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                <p className="mt-4 text-violet-500">Chargement de l&apos;activité...</p>
            </div>
        );
    }

    if (!displayModule) {
        return (
            <div className="text-violet-900">
                <Link
                    href={`/membre/modules/${id}`}
                    className="group mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600"
                >
                    <ChevronLeft className="h-4 w-4" /> Retour au module
                </Link>
                <div className="rounded-2xl border-2 border-dashed border-violet-200 bg-white p-16 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-violet-300" />
                    <h3 className="mt-4 text-lg font-bold text-violet-950">Activité introuvable</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="text-violet-900 max-w-3xl mx-auto pb-8 relative">
            {/* Confettis */}
            {showConfetti && (
                <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
                    <div className="absolute animate-bounce text-6xl">🎉 🥳 🌟 💫 🎈</div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b border-violet-100 pb-4 mb-6">
                <Link
                    href={`/membre/modules/${id}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-violet-600 hover:text-violet-900"
                >
                    <ChevronLeft className="h-4 w-4" /> Quitter l&apos;activité
                </Link>
                <div className="text-sm font-bold text-violet-500 uppercase tracking-widest">
                    {displayModule.label}
                </div>
            </div>

            {/* 1. LEÇON */}
            {isLecon && !isFinished && slides.length > 0 && (
                <div className="rounded-3xl border border-violet-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600">
                            <BookOpen className="h-4 w-4" /> Leçon
                        </span>
                        <span className="text-xs font-bold text-violet-400">Étape {currentStep + 1} / {slides.length}</span>
                    </div>

                    <div className={`rounded-2xl ${slides[currentStep].bgColor} p-8 flex flex-col items-center text-center shadow-inner min-h-[300px] justify-center transition-all duration-300`}>
                        <div className="text-6xl mb-6 select-none animate-pulse">{slides[currentStep].imagePlaceholder}</div>
                        <h2 className="text-xl font-black text-violet-950 mb-4">{slides[currentStep].titre}</h2>
                        <p className="text-sm md:text-base leading-relaxed text-violet-800 max-w-md">{slides[currentStep].texte}</p>
                    </div>

                    <div className="mt-6 flex justify-between items-center gap-4">
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            disabled={currentStep === 0}
                            className="rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Précédent
                        </button>
                        {currentStep < slides.length - 1 ? (
                            <button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-extrabold text-white hover:bg-violet-700 shadow-md"
                            >
                                Page suivante
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsFinished(true)}
                                className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-xs font-black text-white hover:from-emerald-600 hover:to-green-700 shadow-md flex items-center gap-1"
                            >
                                <Check className="h-4 w-4" /> Terminer la leçon
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 2. QUIZ */}
            {isQuiz && !isFinished && questions.length > 0 && (
                <div className="rounded-3xl border border-violet-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-extrabold text-violet-600">
                            <HelpCircle className="h-4 w-4" /> Quiz
                        </span>
                        <span className="text-xs font-bold text-violet-400">Question {currentStep + 1} / {questions.length}</span>
                    </div>

                    <div className="p-4 bg-violet-50/50 rounded-2xl border border-violet-100/50 mb-6">
                        <h2 className="text-base md:text-lg font-black text-violet-950 text-center leading-snug">
                            {questions[currentStep].q}
                        </h2>
                    </div>

                    <div className="grid gap-3">
                        {questions[currentStep].options.map((option, index) => {
                            const isCorrectAnswer = index === questions[currentStep].answer;
                            const isSelected = selectedOption === index;

                            let optionStyle = 'border-violet-200 hover:border-violet-400 hover:bg-violet-50/30';
                            if (selectedOption !== null) {
                                if (isCorrectAnswer) {
                                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                                } else if (isSelected) {
                                    optionStyle = 'border-rose-500 bg-rose-50 text-rose-800';
                                } else {
                                    optionStyle = 'border-slate-100 bg-slate-50 opacity-40';
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    disabled={selectedOption !== null}
                                    onClick={() => handleAnswerQuiz(index)}
                                    className={`w-full text-left rounded-2xl border p-4 text-sm font-semibold transition-all flex items-center justify-between ${optionStyle}`}
                                >
                                    <span>{option}</span>
                                    {selectedOption !== null && isCorrectAnswer && (
                                        <Check className="h-5 w-5 text-emerald-600" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {showExplanation && (
                        <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <div className="text-xs font-bold text-amber-900">
                                    {selectedOption === questions[currentStep].answer ? "Bien joué ! 🌟" : "Presque ! 😉"}
                                </div>
                                <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">{questions[currentStep].explication}</p>
                            </div>
                        </div>
                    )}

                    {selectedOption !== null && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleNextQuiz}
                                className="rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-extrabold text-white hover:bg-violet-700 shadow-md"
                            >
                                {currentStep < questions.length - 1 ? "Question suivante" : "Voir mes résultats"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* SUCCÈS */}
            {isFinished && (
                <div className="rounded-3xl border border-violet-200 bg-white p-8 shadow-sm text-center flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-6 border border-amber-200/50 shadow-inner">
                        <Trophy className="h-8 w-8 animate-bounce" />
                    </div>

                    <h2 className="text-2xl font-black text-violet-950 mb-2">Activité complétée !</h2>

                    {isLecon && (
                        <p className="text-sm text-violet-600 max-w-md mb-6 leading-relaxed">
                            Félicitations, vous avez terminé la leçon ! Prêt(e) à tester vos connaissances ?
                        </p>
                    )}

                    {isQuiz && (
                        <div className="mb-6">
                            <p className="text-sm text-violet-600 max-w-md leading-relaxed mb-4">
                                Vous avez répondu à toutes les questions !
                            </p>
                            <div className="inline-flex flex-col items-center bg-violet-50 rounded-2xl px-6 py-4 border border-violet-100/50">
                                <span className="text-xs font-bold text-violet-500 uppercase tracking-widest">Votre score</span>
                                <span className="text-3xl font-black text-violet-950 mt-1">{score} / {questions.length}</span>
                                {score === questions.length ? (
                                    <span className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-current text-amber-500" /> Score Parfait ! Magnifique !
                                    </span>
                                ) : (
                                    <span className="text-xs font-semibold text-violet-600 mt-2">
                                        Bon travail !
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        {isQuiz && score < questions.length && (
                            <button
                                onClick={() => {
                                    setCurrentStep(0);
                                    setScore(0);
                                    setSelectedOption(null);
                                    setShowExplanation(false);
                                    setIsFinished(false);
                                }}
                                className="rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-50 flex items-center gap-1.5"
                            >
                                <RotateCcw className="h-4 w-4" /> Recommencer
                            </button>
                        )}
                        <button
                            onClick={handleSaveActivity}
                            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-xs font-black text-white hover:from-violet-700 hover:to-purple-700 shadow-md"
                        >
                            Enregistrer et continuer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
