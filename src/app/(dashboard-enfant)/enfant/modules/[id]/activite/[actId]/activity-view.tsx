'use client';

import React, { type Dispatch, type SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, CheckCircle2, MoveDown, MoveUp, RotateCcw, Sparkles, Star, XCircle } from 'lucide-react';
import { MODULES } from '@/lib/enfant-data';
import type {
    InputExerciseData,
    InputQuestion,
    MatchExerciseData,
    MatchItem,
    ModuleContent,
    SortCategory,
    SortExerciseData,
    SortItem,
} from './activity-data';

type ActivityAdventureViewProps = {
  id: string;
  content: ModuleContent;
  activeModuleId: string;
  stepIndex: number;
  showConfetti: boolean;
  step1ImagePath: string;
  step2ImagePath: string;
  step3NapoleonImages: string[];
  step4ImagePath: string;
  quizImagePath: string;
  exerciceChecked: boolean;
  exerciceSuccess: boolean;
  selectedLeft: string | null;
  matches: Record<string, string>;
  orderedItems: string[];
  inputAnswers: Record<string, string>;
  sortedItems: Record<string, string>;
  activeSortItemIndex: number;
  quizIndex: number;
  selectedOption: number | null;
  showExplanation: boolean;
  score: number;
  handleSelectLeft: (leftId: string) => void;
  handleSelectRight: (rightId: string) => void;
  handleResetMatch: () => void;
  verifyMatch: () => void;
  moveItem: (index: number, direction: 'up' | 'down') => void;
  verifyOrder: () => void;
  handleResetOrder: () => void;
  handleInputChange: (key: string, val: string) => void;
  verifyInput: () => void;
  handleResetInput: () => void;
  handleSortItem: (categoryId: string) => void;
  handleResetSort: () => void;
  handleAnswerQuiz: (index: number) => void;
  handleNextQuiz: () => void;
  handleSaveAdventure: () => void;
  setStepIndex: Dispatch<SetStateAction<number>>;
  setQuizIndex: Dispatch<SetStateAction<number>>;
  setSelectedOption: Dispatch<SetStateAction<number | null>>;
  setShowExplanation: Dispatch<SetStateAction<boolean>>;
  setExerciceChecked: Dispatch<SetStateAction<boolean>>;
  setExerciceSuccess: Dispatch<SetStateAction<boolean>>;
  setScore: Dispatch<SetStateAction<number>>;
};

export default function ActivityAdventureView(props: ActivityAdventureViewProps) {
  const {
    id,
    content,
    activeModuleId,
    stepIndex,
    showConfetti,
    step1ImagePath,
    step2ImagePath,
    step3NapoleonImages,
    step4ImagePath,
    quizImagePath,
    exerciceChecked,
    exerciceSuccess,
    selectedLeft,
    matches,
    orderedItems,
    inputAnswers,
    sortedItems,
    activeSortItemIndex,
    quizIndex,
    selectedOption,
    showExplanation,
    score,
    handleSelectLeft,
    handleSelectRight,
    handleResetMatch,
    verifyMatch,
    moveItem,
    verifyOrder,
    handleResetOrder,
    handleInputChange,
    verifyInput,
    handleResetInput,
    handleSortItem,
    handleResetSort,
    handleAnswerQuiz,
    handleNextQuiz,
    handleSaveAdventure,
    setStepIndex,
    setQuizIndex,
    setSelectedOption,
    setShowExplanation,
    setExerciceChecked,
    setExerciceSuccess,
    setScore,
  } = props;

  const staticModInfo = MODULES.find((m) => m.id === id) || { from: '#6d5ba8', to: '#5b4a98' };
  const steps = [
    { label: 'Leçon 1/3', desc: 'Découvrir' },
    { label: 'Leçon 2/3', desc: 'Observer' },
    { label: 'Leçon 3/3', desc: 'Comprendre' },
    { label: 'Exercice', desc: 'S\'entraîner' },
    { label: 'Quiz', desc: 'Se tester' }
  ];
    return (
        <div className="text-violet-900 max-w-6xl mx-auto pb-12 px-4 relative">
            {/* Confettis Emojis */}
            {showConfetti && (
                <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
                    <div className="absolute text-5xl md:text-7xl animate-bounce tracking-widest bg-white/20 backdrop-blur-xs rounded-2xl p-4 shadow-xl">
                        🎉 🥳 🌟 💫 🎈 🏆
                    </div>
                </div>
            )}

            {/* ─── CARTE PRINCIPALE GÉANTE (CONTIENT TOUT LE MODULE) ─── */}
            <div className="bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 flex flex-col justify-between min-h-[580px]">

                {/* 1. Header de la carte : Titre à gauche, Timeline à droite */}
                <div className="border-b border-slate-100 pb-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* Module Info */}
                    <div className="flex items-center gap-3">
                        <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                            style={{ backgroundImage: `linear-gradient(135deg, ${staticModInfo.from}, ${staticModInfo.to})` }}
                        >
                            📚
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-800 leading-none">{content.titreGlobal}</h2>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{content.description}</p>
                        </div>
                    </div>

                    {/* Timeline horizontale intégrée dans le header de la carte */}
                    {stepIndex < 5 && (
                        <nav className="flex items-center gap-1 md:gap-3 text-[10px]">
                            {steps.map((st, i) => {
                                const isActive = stepIndex === i;
                                const isDone = stepIndex > i;
                                return (
                                    <React.Fragment key={i}>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black transition-all ${isActive
                                                    ? 'bg-violet-600 text-white ring-4 ring-violet-100 scale-105'
                                                    : isDone
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {isDone ? <Check className="h-3 w-3" /> : i + 1}
                                            </span>
                                            <span className={`font-black hidden sm:inline ${isActive ? 'text-violet-900' : 'text-slate-400'}`}>
                                                {st.label}
                                            </span>
                                        </div>
                                        {i < steps.length - 1 && (
                                            <span className="text-slate-200 font-bold ml-1">─</span>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </nav>
                    )}
                </div>

                {/* 2. Corps de la carte : Changement en fonction du stepIndex */}
                <div className="flex-grow flex flex-col justify-center py-6">

                    {/* ── STEP 0 : LEÇON 1/3 (DÉCOUVRIR) ── */}
                    {stepIndex === 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left Side Content */}
                            <div className="space-y-6 flex flex-col justify-between h-full">
                                <div className="space-y-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1 text-[10px] font-black text-violet-700 uppercase tracking-widest">
                                        Leçon 1/3
                                    </span>
                                    <h1 className="text-2xl md:text-3xl font-black text-violet-950 leading-tight">
                                        {content.step1.soustitre}
                                    </h1>
                                    <p className="text-sm md:text-base text-violet-850 leading-relaxed font-medium">
                                        {content.step1.texte}
                                    </p>
                                </div>

                                {/* Exemple Box (si spécifié, ex: aspirateur robot pour la robotique) */}
                                {content.step1.exempleText ? (
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between gap-4 mt-4">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-violet-700 uppercase tracking-widest block">Exemple</span>
                                            <p className="text-xs text-slate-700 font-bold leading-normal">{content.step1.exempleText}</p>
                                        </div>
                                        {content.step1.exempleImage && (
                                            <Image src={content.step1.exempleImage} alt="Exemple" width={56} height={56} className="h-14 w-14 object-contain rounded-lg shrink-0" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 border border-amber-100/50 p-4 rounded-2xl flex items-start gap-3 mt-4">
                                        <Star className="h-5 w-5 text-amber-500 shrink-0 fill-amber-500" />
                                        <div>
                                            <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-wider">À retenir</h4>
                                            <p className="text-xs text-amber-800 font-bold mt-0.5">{content.step1.aRetenir}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side Illustration */}
                                <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 border border-violet-100/50 rounded-3xl p-6 flex items-center justify-center shadow-inner min-h-[300px] max-h-[360px] overflow-hidden">
                                    <Image
                                        src={content.step1.imageUrl ?? step1ImagePath}
                                        alt={content.step1.soustitre}
                                        width={520}
                                        height={260}
                                        className="max-h-[260px] object-contain rounded-2xl hover:scale-102 transition-transform duration-500"
                                    />
                            </div>
                        </div>
                    )}

                    {/* ── STEP 1 : LEÇON 2/3 (OBSERVER) ── */}
                    {stepIndex === 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left Side: Cahier ligné */}
                            <div className="bg-yellow-50/40 border border-yellow-100 rounded-3xl p-6 shadow-xs relative overflow-hidden min-h-[280px] flex flex-col justify-between">
                                <div className="absolute top-0 bottom-0 left-8 w-px bg-rose-200" />
                                <div className="pl-6 space-y-3 font-serif">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-0.5 text-[9px] font-black text-violet-700 uppercase tracking-widest font-sans">
                                        Leçon 2/3
                                    </span>
                                    <h3 className="text-lg font-bold text-violet-900 border-b border-yellow-200 pb-1">{content.step2.boxTitre}</h3>
                                    <p className="text-xs leading-6 text-slate-800 whitespace-pre-line font-medium">
                                        {content.step2.texte}
                                    </p>
                                </div>

                                {/* Ligne de diagramme horizontal spécifique pour le fonctionnement du robot */}
                                {activeModuleId === 'robotique' && (
                                    <div className="pl-6 mt-4 grid grid-cols-3 gap-2 border-t border-yellow-200/50 pt-4 text-center font-sans">
                                        <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col items-center">
                                            <span className="text-xl mb-1">👁️</span>
                                            <span className="text-[9px] font-black text-slate-800 leading-tight">1. Il reçoit une info</span>
                                        </div>
                                        <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col items-center">
                                            <span className="text-xl mb-1">💻</span>
                                            <span className="text-[9px] font-black text-slate-800 leading-tight">2. Il traite l&apos;info</span>
                                        </div>
                                        <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col items-center">
                                            <span className="text-xl mb-1">⚙️</span>
                                            <span className="text-[9px] font-black text-slate-800 leading-tight">3. Il agit</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Image + À retenir */}
                            <div className="flex flex-col gap-5 justify-between h-full">
                                <div className="bg-violet-50/40 border border-violet-100 rounded-3xl p-5 flex items-center justify-center shadow-inner min-h-[160px] max-h-[200px] overflow-hidden">
                                    <Image
                                        src={content.step2.imageUrl ?? step2ImagePath}
                                        alt={content.step2.boxTitre}
                                        width={320}
                                        height={150}
                                        className="max-h-[150px] object-contain rounded-xl animate-pulse"
                                        style={{ animationDuration: '3s' }}
                                    />
                                </div>

                                <div className="bg-violet-50 border border-violet-100 p-5 rounded-2xl">
                                    <h4 className="text-[10px] font-black text-violet-800 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                        <Star className="h-4 w-4 fill-violet-400 text-violet-400" /> À retenir
                                    </h4>
                                    <ul className="space-y-1.5 text-xs text-violet-950 font-bold">
                                        {content.step2.aRetenir.map((a, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-violet-500 font-bold">•</span>
                                                <span>{a}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Badges ou Bullet list facultatifs */}
                                {content.step2.badges && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {content.step2.badges.map((b, idx) => (
                                            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-2.5 flex flex-col items-center justify-center text-center shadow-xs">
                                                <span className="text-2xl mb-1">{b.emoji}</span>
                                                <span className="text-[9px] font-black text-violet-900 leading-tight">{b.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2 : LEÇON 3/3 (COMPRENDRE) ── */}
                    {stepIndex === 2 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left Side: Points Clés */}
                            <div className="space-y-6 flex flex-col justify-between h-full">
                                <div className="space-y-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1 text-[10px] font-black text-violet-700 uppercase tracking-widest">
                                        Leçon 3/3
                                    </span>
                                    <h2 className="text-xl md:text-2xl font-black text-violet-950 leading-tight">
                                        Comprendre
                                    </h2>
                                    <p className="text-xs text-violet-800 leading-relaxed font-bold">{content.step3.texte}</p>
                                </div>

                                <div className="bg-white border border-violet-100 rounded-2xl p-5 shadow-xs space-y-3">
                                    <h4 className="text-[10px] font-black text-violet-800 uppercase tracking-widest">Points clés :</h4>
                                    {content.step3.pointsCles.map((pt, idx) => (
                                        <div key={idx} className="flex gap-2.5 items-start">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                                <Check className="h-3 w-3" />
                                            </span>
                                            <p className="text-xs text-violet-950 font-bold leading-normal">{pt}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side: thought bubbles + image OR Robot labels diagram */}
                            <div className="space-y-4">
                                {activeModuleId === 'robotique' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-violet-50/20 border border-violet-100 rounded-3xl p-5 shadow-inner">
                                        <div className="flex justify-center">
                                            <Image
                                                src="/images/enfants/quiz_robot.png"
                                                alt="Robot parts"
                                                width={320}
                                                height={180}
                                                className="max-h-[180px] object-contain"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-2 rounded-r-lg">
                                                <h5 className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Capteurs</h5>
                                                <p className="text-[8px] text-emerald-700 font-bold leading-tight">Ils perçoivent le monde.</p>
                                            </div>
                                            <div className="bg-orange-50 border-l-4 border-orange-400 p-2 rounded-r-lg">
                                                <h5 className="text-[9px] font-black text-orange-800 uppercase tracking-widest">Unité de contrôle</h5>
                                                <p className="text-[8px] text-orange-700 font-bold leading-tight">Elle réfléchit et prend des décisions.</p>
                                            </div>
                                            <div className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded-r-lg">
                                                <h5 className="text-[9px] font-black text-blue-800 uppercase tracking-widest">Actionneurs</h5>
                                                <p className="text-[8px] text-blue-700 font-bold leading-tight">Ils réalisent des actions.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeModuleId === 'napoleon' ? (
                                    <div className="space-y-4">
                                        {(() => {
                                            const napoleonStepImages = content.step3.imageUrl
                                                ? [content.step3.imageUrl, step3NapoleonImages[1] ?? step3NapoleonImages[0]].filter(Boolean) as string[]
                                                : step3NapoleonImages;
                                            return (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {napoleonStepImages.map((src, index) => (
                                                <div
                                                    key={src}
                                                    className="relative min-h-[150px] overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm"
                                                >
                                                    <Image
                                                        src={src}
                                                        alt={index === 0
                                                            ? 'Méthode pour analyser un personnage historique'
                                                            : 'Illustration des limites du pouvoir et des libertés'}
                                                        fill
                                                        className="object-contain p-3"
                                                        sizes="(min-width: 640px) 18vw, 100vw"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                            );
                                        })()}

                                        <div className="grid grid-cols-2 gap-2">
                                            {content.step3.bulles.map((b, idx) => (
                                                <div key={idx} className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-3 shadow-xs relative">
                                                    <span className="absolute -top-2 -left-2 text-xs">💬</span>
                                                    <p className="text-[10px] font-black text-violet-950 leading-relaxed">{b}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {content.step3.objectif && (
                                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 flex gap-2 items-center mt-3">
                                                <span className="text-xl">🎯</span>
                                                <p className="text-[10px] font-extrabold text-emerald-800 whitespace-pre-line leading-normal">{content.step3.objectif}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-2">
                                            {content.step3.bulles.map((b, idx) => (
                                                <div key={idx} className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-3 shadow-xs relative">
                                                    <span className="absolute -top-2 -left-2 text-xs">💬</span>
                                                    <p className="text-[10px] font-black text-violet-950 leading-relaxed">{b}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {content.step3.objectif && (
                                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 flex gap-2 items-center mt-3">
                                                <span className="text-xl">🎯</span>
                                                <p className="text-[10px] font-extrabold text-emerald-800 whitespace-pre-line leading-normal">{content.step3.objectif}</p>
                                            </div>
                                        )}

                                        <div className="text-center pt-2">
                                            <span className="text-5xl animate-pulse inline-block">{content.step3.illustration}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3 : EXERCICE GUIDÉ ── */}
                    {stepIndex === 3 && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left Side Interaction */}
                            <div className="lg:col-span-8 space-y-4">
                                {/* Match Exercise */}
                                {content.exercice.type === 'match' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            {((content.exercice.data as MatchExerciseData).left).map((item: MatchItem) => {
                                                const isSelected = selectedLeft === item.id;
                                                const matchedRightId = matches[item.id];
                                                const matchedRight = (content.exercice.data as MatchExerciseData).right.find((r: MatchItem) => r.id === matchedRightId);

                                                return (
                                                    <button
                                                        key={item.id}
                                                        disabled={exerciceChecked}
                                                        onClick={() => handleSelectLeft(item.id)}
                                                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between font-bold text-xs ${isSelected
                                                                ? 'border-violet-600 bg-violet-50 text-violet-900 shadow-sm'
                                                                : matchedRightId
                                                                    ? 'border-emerald-200 bg-emerald-50/20 text-slate-800'
                                                                    : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        <span>{item.text}</span>
                                                        {matchedRight && (
                                                            <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-md font-black shrink-0 ml-2">
                                                                Lié !
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="space-y-2">
                                            {((content.exercice.data as MatchExerciseData).right).map((item: MatchItem) => {
                                                const isMatchTarget = Object.values(matches).includes(item.id);
                                                return (
                                                    <button
                                                        key={item.id}
                                                        disabled={exerciceChecked || !selectedLeft}
                                                        onClick={() => handleSelectRight(item.id)}
                                                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all font-semibold text-xs ${isMatchTarget
                                                                ? 'border-emerald-300 bg-emerald-50/20 text-emerald-800 font-bold'
                                                                : selectedLeft
                                                                    ? 'border-violet-200 hover:border-violet-400 bg-violet-50/10 text-slate-700'
                                                                    : 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {item.text}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Order Exercise */}
                                {content.exercice.type === 'order' && (
                                    <div className="space-y-2 max-w-xl">
                                        {orderedItems.map((item: string, idx: number) => (
                                            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-bold">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-black text-[10px]">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-slate-800">{item}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        disabled={exerciceChecked || idx === 0}
                                                        onClick={() => moveItem(idx, 'up')}
                                                        className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30"
                                                    >
                                                        <MoveUp className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        disabled={exerciceChecked || idx === orderedItems.length - 1}
                                                        onClick={() => moveItem(idx, 'down')}
                                                        className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30"
                                                    >
                                                        <MoveDown className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Input Exercise */}
                                {content.exercice.type === 'input' && (
                                    <div className="space-y-4 max-w-xl">
                                        {(content.exercice.data as InputExerciseData).questions.map((q: InputQuestion, idx: number) => (
                                            <div key={idx} className="space-y-1">
                                                <label className="block text-xs font-black text-violet-900">{q.label}</label>
                                                <input
                                                    type="text"
                                                    disabled={exerciceChecked}
                                                    placeholder={q.placeholder}
                                                    value={inputAnswers[q.key] || ""}
                                                    onChange={(e) => handleInputChange(q.key, e.target.value)}
                                                    className="w-full border border-violet-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-violet-500 outline-hidden font-bold"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Sort Exercise */}
                                {content.exercice.type === 'sort' && (
                                    <div className="max-w-xl">
                                        {activeSortItemIndex < content.exercice.data.items.length && !exerciceChecked ? (
                                            <div className="text-center space-y-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-4">
                                                    <p className="text-base font-black text-violet-950">
                                                    &quot;{(content.exercice.data as SortExerciseData).items[activeSortItemIndex].text}&quot;
                                                </p>
                                                <div className="flex justify-center gap-3">
                                                    {((content.exercice.data as SortExerciseData).categories).map((cat: SortCategory) => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => handleSortItem(cat.id)}
                                                            className={`px-4 py-2.5 rounded-xl border-2 font-black text-xs hover:scale-102 transition-all ${cat.bg}`}
                                                        >
                                                            {cat.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-4 text-xs font-bold text-violet-900">
                                                Tous les gestes ont été classés. Clique sur Vérifier !
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-3 text-left">
                                            {((content.exercice.data as SortExerciseData).categories).map((cat: SortCategory) => (
                                                <div key={cat.id} className={`rounded-xl border p-3 ${cat.bg}`}>
                                                    <h5 className="font-black text-[10px] mb-2">{cat.title}</h5>
                                                    <ul className="space-y-1 text-[10px] font-bold">
                                                        {((content.exercice.data as SortExerciseData).items).map((item: SortItem) => {
                                                            if (sortedItems[item.id] !== cat.id) return null;
                                                            return (
                                                                <li key={item.id} className="bg-white/80 px-2 py-1 rounded-lg border border-slate-100">
                                                                    • {item.text}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* RÉSULTAT EXERCICE */}
                                {exerciceChecked && (
                                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${exerciceSuccess
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                            : 'bg-rose-50 border-rose-200 text-rose-800'
                                        }`}>
                                        {exerciceSuccess ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                                        )}
                                        <div>
                                            <h4 className="text-xs font-black uppercase">
                                                {exerciceSuccess ? "C'est parfait !" : "Quelques erreurs !"}
                                            </h4>
                                            <p className="text-[10px] font-semibold mt-0.5">
                                                {exerciceSuccess
                                                    ? "Tu as réussi l'exercice guidé. Tu es prêt pour l'étape du quiz !"
                                                    : "Recommence pour trouver la bonne solution."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side Decoration */}
                            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-violet-50/20 border border-violet-100 rounded-3xl p-6 shadow-inner max-h-[300px] overflow-hidden">
                                {activeModuleId === 'robotique' ? (
                                    <div className="flex flex-col items-center text-center">
                                        <Image
                                            src="/images/enfants/exercice_generic.png"
                                            alt="Activité robotique"
                                            width={320}
                                            height={160}
                                            className="max-h-[160px] object-contain rounded-2xl"
                                        />
                                        <div className="mt-4 bg-white border border-violet-100 px-3 py-1.5 rounded-2xl text-[10px] font-black text-violet-700 shadow-xs">
                                            Quel est le bon ordre ? 🤔
                                        </div>
                                    </div>
                                ) : activeModuleId === 'napoleon' ? (
                                    <Image
                                        src={step4ImagePath}
                                        alt="Exercice de chronologie sur Napoléon"
                                        width={360}
                                        height={180}
                                        className="max-h-[180px] object-contain rounded-2xl hover:scale-102 transition-transform duration-300"
                                    />
                                ) : (
                                    <Image
                                        src="/images/enfants/exercice_generic.png"
                                        alt="Activité"
                                        width={360}
                                        height={180}
                                        className="max-h-[180px] object-contain rounded-2xl hover:scale-102 transition-transform duration-300"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4 : QUIZ (10 QUESTIONS) ── */}
                    {stepIndex === 4 && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
                            {/* Left Side: Questions */}
                            <div className="lg:col-span-8 space-y-4">
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                                    <div
                                        className="bg-violet-600 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${((quizIndex + 1) / content.quiz.length) * 100}%` }}
                                    />
                                </div>

                                <div className="p-5 bg-violet-50/50 rounded-2xl border border-violet-100/50">
                                    <h2 className="text-xs font-black text-violet-500 uppercase tracking-widest mb-1.5">Question {quizIndex + 1} sur {content.quiz.length}</h2>
                                    <h3 className="text-sm md:text-base font-black text-violet-950 leading-snug">
                                        {content.quiz[quizIndex].q}
                                    </h3>
                                </div>

                                <div className="grid gap-2">
                                    {content.quiz[quizIndex].options.map((option, idx) => {
                                        const isCorrectAnswer = idx === content.quiz[quizIndex].answer;
                                        const isSelected = selectedOption === idx;

                                        let optionStyle = 'border-slate-200 hover:border-violet-400 hover:bg-violet-50/20';
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
                                                key={idx}
                                                disabled={selectedOption !== null}
                                                onClick={() => handleAnswerQuiz(idx)}
                                                className={`w-full text-left rounded-xl border p-3.5 text-xs font-bold transition-all flex items-center justify-between ${optionStyle}`}
                                            >
                                                <span>{option}</span>
                                                {selectedOption !== null && isCorrectAnswer && (
                                                    <Check className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {showExplanation && (
                                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2.5">
                                        <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-[10px] font-black text-amber-900">
                                                {selectedOption === content.quiz[quizIndex].answer ? "Bien joué ! 🌟" : "Presque ! 😉"}
                                            </div>
                                            <p className="text-xs text-amber-800 font-semibold mt-0.5 leading-relaxed">
                                                {content.quiz[quizIndex].explication}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Robot helper */}
                            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-violet-50/30 border border-violet-100 rounded-3xl p-6 shadow-inner max-h-[300px]">
                                <Image
                                    src={quizImagePath}
                                    alt={activeModuleId === 'napoleon' ? 'Quiz de révision sur Napoléon' : 'Robot assistant'}
                                    width={320}
                                    height={160}
                                    className="max-h-[160px] object-contain animate-bounce"
                                    style={{ animationDuration: '3s' }}
                                />
                                <span className="text-[9px] font-black text-violet-500 mt-3 uppercase tracking-widest bg-white border border-violet-100 px-3 py-1 rounded-full shadow-xs">
                                    Aide Robot 🤖
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 5 : RESULTAT FINAL / BADGE ── */}
                    {stepIndex === 5 && (
                        <div className="text-center max-w-xl mx-auto space-y-6">
                            <div className="flex justify-center">
                                <Image
                                    src="/images/enfants/result_robot.png"
                                    alt="Félicitations !"
                                    width={360}
                                    height={180}
                                    className="max-h-[180px] object-contain animate-bounce"
                                    style={{ animationDuration: '4s' }}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <h2 className="text-2xl md:text-3xl font-black text-violet-950">
                                    {score >= 8 ? "Well done ! Félicitations !" : "Quiz Terminé !"}
                                </h2>
                                <p className="text-xs font-black text-violet-600 uppercase tracking-widest">
                                    Tu as réussi ton aventure {content.titreGlobal} !
                                </p>
                            </div>

                            <div className="bg-slate-50/60 rounded-2xl border border-slate-100 p-5 max-w-sm mx-auto shadow-xs">
                                <span className="block text-[9px] font-black uppercase text-slate-400 tracking-widest">Ton score final</span>
                                <span className="text-3xl md:text-4xl font-black text-emerald-600">
                                    {score} <span className="text-lg text-slate-400">/ {content.quiz.length}</span>
                                </span>
                                <p className="text-[11px] font-bold text-violet-950 mt-2">
                                    {score === 10 && "Excellent ! Un score parfait de champion ! 🌟"}
                                    {score >= 8 && score < 10 && "Super travail ! Tu as très bien compris ! 👏"}
                                    {score >= 5 && score < 8 && "Pas mal ! Revois la leçon pour faire encore mieux ! 👍"}
                                    {score < 5 && "Recommence l&apos;aventure pour améliorer ton score. Courage ! 💪"}
                                </p>
                            </div>

                            {/* Étoiles d'évaluation */}
                            <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map((starIdx) => {
                                    const starThreshold = starIdx * 2;
                                    const isGold = score >= starThreshold;
                                    return (
                                        <Star
                                            key={starIdx}
                                            className={`h-6 w-6 ${isGold ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'
                                                }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Pied de la carte (Footer) : Navigation interne sous les colonnes */}
                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                    {/* Bouton Retour (interne au wizard) */}
                    {stepIndex > 0 && stepIndex < 5 ? (
                        <button
                            onClick={() => {
                                if (stepIndex === 4 && quizIndex > 0) {
                                    setQuizIndex(quizIndex - 1);
                                    setSelectedOption(null);
                                    setShowExplanation(false);
                                } else {
                                    setStepIndex(stepIndex - 1);
                                }
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 shadow-xs transition-all"
                        >
                            ← Retour
                        </button>
                    ) : (
                        <Link
                            href={`/enfant/modules/${id}`}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 shadow-xs transition-all"
                        >
                            ← Quitter
                        </Link>
                    )}

                    {/* Pagination Dots (uniquement pour les leçons 1/3, 2/3, 3/3) */}
                    {stepIndex < 3 && (
                        <div className="flex gap-2">
                            {[0, 1, 2].map((dotIdx) => (
                                <button
                                    key={dotIdx}
                                    onClick={() => setStepIndex(dotIdx)}
                                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${stepIndex === dotIdx ? 'bg-violet-600 w-6' : 'bg-slate-200'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Bouton Suivant ou Sauvegarder */}
                    {stepIndex < 3 ? (
                        <button
                            onClick={() => setStepIndex(stepIndex + 1)}
                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-black text-white hover:bg-violet-700 shadow-md transition-all"
                        >
                            {stepIndex === 2 ? "Passer à l'exercice" : "Suivant"} →
                        </button>
                    ) : stepIndex === 3 ? (
                        <div className="flex gap-2">
                            {exerciceChecked && !exerciceSuccess && (
                                <button
                                    onClick={() => {
                                        if (content.exercice.type === 'match') handleResetMatch();
                                        else if (content.exercice.type === 'order') handleResetOrder();
                                        else if (content.exercice.type === 'input') handleResetInput();
                                        else if (content.exercice.type === 'sort') handleResetSort();
                                    }}
                                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" /> Recommencer
                                </button>
                            )}

                            {!exerciceChecked ? (
                                <button
                                    onClick={() => {
                                        if (content.exercice.type === 'match') verifyMatch();
                                        else if (content.exercice.type === 'order') verifyOrder();
                                        else if (content.exercice.type === 'input') verifyInput();
                                        else if (content.exercice.type === 'sort') verifyInput(); // triggers check
                                    }}
                                    className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-black text-white hover:bg-emerald-700 shadow-md"
                                >
                                    Vérifier
                                </button>
                            ) : (
                                <button
                                    disabled={!exerciceSuccess}
                                    onClick={() => setStepIndex(4)}
                                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-black text-white hover:bg-violet-700 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Passer au Quiz →
                                </button>
                            )}
                        </div>
                    ) : stepIndex === 4 ? (
                        <button
                            disabled={selectedOption === null}
                            onClick={handleNextQuiz}
                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-black text-white hover:bg-violet-700 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            {quizIndex < content.quiz.length - 1 ? "Suivant" : "Terminer"} →
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setStepIndex(0);
                                    setScore(0);
                                    setQuizIndex(0);
                                    setSelectedOption(null);
                                    setShowExplanation(false);
                                    setExerciceChecked(false);
                                    setExerciceSuccess(false);
                                }}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <RotateCcw className="h-4 w-4 inline-block mr-1" /> Recommencer
                            </button>
                                <button
                                    onClick={handleSaveAdventure}
                                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-xs font-black text-white hover:from-emerald-600 hover:to-green-700 shadow-md transition-all"
                                >
                                Continuer l&apos;aventure →
                                </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── TIMELINE DE NAVIGATION HORIZONTALE COMPLÈTE EN BAS (HORS DE LA CARTE) ─── */}
            <div className="mt-8 border border-slate-100 bg-white rounded-2xl p-4 flex flex-wrap items-center justify-center gap-2 md:gap-4 shadow-sm max-w-4xl mx-auto text-xs font-bold text-slate-400">
                {/* Module title with robot/theme icon */}
                <div className="flex items-center gap-2 text-slate-800 font-black">
                    <span className="text-base">🤖</span>
                    <span>{content.titreGlobal}</span>
                    <span className="text-slate-300 ml-1 font-normal">&gt;</span>
                </div>

                {/* Steps List */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[11px]">
                    {[
                        { idx: 0, label: "Leçon 1/3", icon: "📖" },
                        { idx: 1, label: "Leçon 2/3", icon: "🔍" },
                        { idx: 2, label: "Leçon 3/3", icon: "💡" },
                        { idx: 3, label: "Exercice", icon: "🎮" },
                        { idx: 4, label: "Quiz", icon: "🎯" },
                        { idx: 5, label: "Résultat", icon: "🏆" }
                    ].map((step, sIdx) => {
                        const isActive = stepIndex === step.idx;
                        const isCompleted = stepIndex > step.idx;

                        return (
                            <React.Fragment key={step.idx}>
                                {sIdx > 0 && <span className="text-slate-300">→</span>}
                                <div
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${isActive
                                            ? 'text-indigo-600 bg-indigo-50 font-black scale-105'
                                            : isCompleted
                                                ? 'text-slate-700 font-bold'
                                                : 'text-slate-350 opacity-60'
                                        }`}
                                >
                                    <span>{step.icon}</span>
                                    <span>{step.label}</span>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
