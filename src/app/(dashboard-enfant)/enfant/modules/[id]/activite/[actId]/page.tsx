// * src/app/(dashboard-enfant)/enfant/modules/[id]/activite/[actId]/page.tsx
'use client';

import React, { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    ChevronLeft, Star, Trophy, Check, RotateCcw, 
    Sparkles, Brush, Eraser, Trash2, BookOpen, AlertCircle,
    HelpCircle
} from 'lucide-react';
import { MODULES } from '@/lib/enfant-data';
import { obtenirDetailsActiviteDepuisDB, sauvegarderResultatActivite, obtenirDetailsModuleDepuisDB } from '../../../actions';

// Types de données
type Question = {
    q: string;
    options: string[];
    answer: number; // Index de la bonne réponse
    explication: string;
};

type LeconSlide = {
    titre: string;
    texte: string;
    imagePlaceholder: string; // Emoji de l'image
    bgColor: string;
};

// Base de données des leçons et quiz interactifs
const LEÇONS_DATA: Record<string, LeconSlide[]> = {
    l1: [
        { titre: "Les voyelles joyeuses", texte: "Les lettres A, E, I, O, U, Y sont les voyelles ! Elles donnent de la voix aux mots. Par exemple : A comme 'Abeille' et O comme 'Ours'.", imagePlaceholder: "🐝 🐻", bgColor: "bg-emerald-50" },
        { titre: "Les consonnes compagnes", texte: "Toutes les autres lettres sont des consonnes. Elles s'associent aux voyelles pour former des sons. B et A font 'BA' !", imagePlaceholder: "📚 ✏️", bgColor: "bg-teal-50" },
        { titre: "La chanson de l'alphabet", texte: "Répète après nous : A, B, C, D, E, F, G... Tu connais maintenant le secret des mots !", imagePlaceholder: "🎵 ✨", bgColor: "bg-violet-50" }
    ],
    n1: [
        { titre: "Découvrir la souris", texte: "La souris te permet de diriger le pointeur à l'écran. Fais un 'Clic gauche' pour choisir un élément, et un double-clic pour ouvrir un jeu !", imagePlaceholder: "🖱️ 🎯", bgColor: "bg-blue-50" },
        { titre: "Apprivoiser le clavier", texte: "Le clavier sert à écrire des lettres et des chiffres. Utilise la touche 'Espace' pour faire des trous entre les mots, et 'Entrée' pour aller à la ligne.", imagePlaceholder: "⌨️ ✍️", bgColor: "bg-indigo-50" },
        { titre: "Attention à ton écran !", texte: "Il est important de garder tes yeux à bonne distance de l'écran et de faire des pauses régulières pour jouer dehors !", imagePlaceholder: "🌳 🏃‍♂️", bgColor: "bg-sky-50" }
    ],
    r1: [
        { titre: "C'est quoi un robot ?", texte: "Un robot est une machine intelligente qui peut faire des tâches toute seule. Il obéit aux instructions (le code) données par les humains !", imagePlaceholder: "🤖 🧠", bgColor: "bg-purple-50" },
        { titre: "Les capteurs : les yeux du robot", texte: "Pour ne pas foncer dans les murs, le robot utilise des capteurs de distance ou de lumière. C'est comme ses yeux !", imagePlaceholder: "👀 📡", bgColor: "bg-pink-50" },
        { titre: "Les moteurs : les jambes du robot", texte: "Pour bouger ses roues ou ses bras mécaniques, le robot utilise des petits moteurs électriques très précis.", imagePlaceholder: "⚙️ ⚡", bgColor: "bg-violet-50" }
    ],
    c1: [
        { titre: "Le drapeau tricolore", texte: "Le drapeau français a trois couleurs verticales : le Bleu, le Blanc et le Rouge. Le blanc représente le roi historique, et le bleu et le rouge représentent la ville de Paris.", imagePlaceholder: "🇫🇷 🗼", bgColor: "bg-amber-50" },
        { titre: "La devise républicaine", texte: "Notre devise est : 'Liberté, Égalité, Fraternité'. Cela veut dire que nous sommes tous libres, tous égaux face à la loi, et que nous devons nous entraider comme des frères et sœurs !", imagePlaceholder: "🤝 ❤️", bgColor: "bg-orange-50" },
        { titre: "La Marianne et le 14 Juillet", texte: "Marianne est la dame qui représente la République. Le 14 Juillet, c'est la fête nationale avec les feux d'artifice !", imagePlaceholder: "🎆 🎇", bgColor: "bg-red-50" }
    ],
    e1: [
        { titre: "Pourquoi trier les déchets ?", texte: "Trier permet de recycler nos déchets pour fabriquer de nouvelles choses sans polluer la Terre. C'est un super geste pour la planète !", imagePlaceholder: "♻️ 🌍", bgColor: "bg-emerald-50" },
        { titre: "Le bac jaune", texte: "Dans le bac jaune, on jette les emballages en plastique, les boîtes de conserve en métal, et les cartons !", imagePlaceholder: "🟡 🥫", bgColor: "bg-yellow-50" },
        { titre: "Le bac vert et le compost", texte: "Dans le bac vert, on dépose le verre (bouteilles, pots). Et les épluchures de fruits et légumes vont au compost pour nourrir les plantes !", imagePlaceholder: "🟢 🍎", bgColor: "bg-green-50" }
    ]
};

const QUIZ_DATA: Record<string, Question[]> = {
    l2: [
        { q: "Quel mot contient le son 'OU' ?", options: ["Chocolat", "Poule", "Chapeau"], answer: 1, explication: "P-ou-le s'écrit avec 'OU', comme dans le mot rouge !" },
        { q: "Quel mot contient le son 'CH' ?", options: ["Chien", "Maison", "Jardin"], answer: 0, explication: "Ch-ien commence par le son 'CH' !" },
        { q: "Quel mot s'écrit avec la voyelle 'A' ?", options: ["Stylo", "Maman", "Fleur"], answer: 1, explication: "M-a-m-a-n contient deux fois la voyelle 'A' !" }
    ],
    n2: [
        { q: "Que faire si un inconnu te parle sur Internet ?", options: ["Lui répondre gentiment", "Ignorer et le dire tout de suite à mes parents", "Lui donner mon nom complet"], answer: 1, explication: "Il ne faut jamais parler aux inconnus en ligne et toujours prévenir un adulte !" },
        { q: "Ton mot de passe doit être...", options: ["Facile à deviner (ex: 12345)", "Secret pour tout le monde sauf mes parents", "Partagé avec mes meilleurs copains"], answer: 1, explication: "Un bon mot de passe doit rester secret pour protéger tes données !" },
        { q: "Quelle règle est la meilleure pour les écrans ?", options: ["Y passer toute la soirée", "Faire des pauses et jouer dehors", "Ne jamais s'arrêter avant d'avoir fini"], answer: 1, explication: "Passer du temps dehors et faire des pauses est essentiel pour ta santé !" }
    ],
    r2: [
        { q: "Pour faire avancer un robot vers l'avant, quelle flèche utiliser ?", options: ["La flèche Gauche", "La flèche Haut", "La flèche Droite"], answer: 1, explication: "La flèche du haut dirige le robot vers l'avant !" },
        { q: "À quoi sert un capteur de distance sur un robot ?", options: ["À chanter des chansons", "À détecter les obstacles pour les éviter", "À faire clignoter ses lumières"], answer: 1, explication: "Le capteur mesure la distance pour éviter les collisions !" },
        { q: "Qui donne l'intelligence et le programme au robot ?", options: ["Le robot lui-même", "Le programmeur humain", "Une prise électrique"], answer: 1, explication: "C'est l'humain qui écrit le code pour programmer le robot !" }
    ],
    a1: [
        { q: "Quelle est la couleur du soleil en anglais ?", options: ["Red", "Blue", "Yellow"], answer: 2, explication: "Le soleil est jaune, ce qui se dit 'Yellow' en anglais !" },
        { q: "Comment dit-on 'Vert' en anglais ?", options: ["Green", "Black", "Pink"], answer: 0, explication: "Vert se dit 'Green' !" },
        { q: "Quelle couleur donne le mélange du 'Red' et du 'Blue' ?", options: ["Orange", "Purple", "White"], answer: 1, explication: "Rouge + Bleu donne du violet, qui se dit 'Purple' !" }
    ],
    c2: [
        { q: "Quelle est la devise républicaine de la France ?", options: ["Liberté, Égalité, Fraternité", "Travail, Famille, Patrie", "Union, Paix, Progrès"], answer: 0, explication: "Notre devise nationale est Liberté, Égalité, Fraternité !" },
        { q: "À l'école, que doit-on faire en priorité ?", options: ["Crier plus fort que le maître", "Respecter et écouter les autres", "Garder tous les jouets pour soi"], answer: 1, explication: "Le respect mutuel permet d'apprendre dans une bonne ambiance !" }
    ],
    e2: [
        { q: "Pendant que je me brosse les dents, je dois...", options: ["Laisser couler l'eau", "Fermer le robinet d'eau", "Jouer avec la brosse à dents"], answer: 1, explication: "Fermer le robinet évite de gaspiller de précieux litres d'eau !" },
        { q: "Quel déchet peut-on composter dans le jardin ?", options: ["Une canette de soda", "Une bouteille plastique", "Une épluchure de banane"], answer: 2, explication: "Les restes de fruits et légumes sont biodégradables et parfaits pour le compost !" }
    ]
};

const EXERCICES_INSTRUCTIONS: Record<string, string> = {
    l3: "Dessine Lulu le petit lapin en plein milieu d'une belle forêt verte !",
    n3: "Dessine un grand écran d'ordinateur avec ton jeu vidéo ou site préféré à l'intérieur !",
    r3: "Laisse parler ton imagination et dessine un robot du futur plein de boutons et d'antennes !",
    a3: "Dessine le drapeau du Royaume-Uni (l'Union Jack) en bleu, blanc et rouge !",
    c3: "Dessine le drapeau tricolore de la France (Bleu, Blanc, Rouge) planté devant la tour Eiffel !",
    e3: "Dessine notre magnifique planète Terre entourée d'arbres, de fleurs et d'un grand soleil !"
};

type PageParams = Promise<{ id: string; actId: string }>;

export default function EnfantActivityPage({ params }: { params: PageParams }) {
    const { id, actId } = use(params);
    const router = useRouter();
    
    const [displayModule, setDisplayModule] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // États communs
    const [currentStep, setCurrentStep] = useState(0); // Index de slide ou question
    const [isFinished, setIsFinished] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // États dynamiques pour l'activité
    const [slides, setSlides] = useState<LeconSlide[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [instruction, setInstruction] = useState<string>("");
    const [activityType, setActivityType] = useState<'lecon' | 'quiz' | 'exercice' | null>(null);

    // États pour les Quiz
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    const isLecon = activityType === 'lecon';
    const isQuiz = activityType === 'quiz';
    const isExercice = activityType === 'exercice';

    const isMock = isNaN(Number(actId));

    useEffect(() => {
        if (!id || !actId) return;

        async function loadData() {
            setLoading(true);

            if (isMock) {
                setDisplayModule(MODULES.find((m) => m.id === id) || null);
                setSlides(LEÇONS_DATA[actId] || []);
                setQuestions(QUIZ_DATA[actId] || []);
                setInstruction(EXERCICES_INSTRUCTIONS[actId] || "");
                if (LEÇONS_DATA[actId] !== undefined) setActivityType('lecon');
                else if (QUIZ_DATA[actId] !== undefined) setActivityType('quiz');
                else if (EXERCICES_INSTRUCTIONS[actId] !== undefined) setActivityType('exercice');
                setLoading(false);
            } else {
                try {
                    // Charger le module
                    const dbMod = await obtenirDetailsModuleDepuisDB(id);
                    if (dbMod) {
                        const staticMod = MODULES.find(m => m.id === dbMod.slug) || {
                            id: id,
                            label: dbMod.label,
                            from: "#66bb6a",
                            to: "#2e7d32"
                        };
                        setDisplayModule(staticMod);
                    }

                    // Charger l'exercice
                    const actData = await obtenirDetailsActiviteDepuisDB(actId);
                    if (actData) {
                        if (actData.type === 'LECON') {
                            setSlides(actData.contenu as LeconSlide[]);
                            setActivityType('lecon');
                        } else if (actData.type === 'QUIZ') {
                            const qList = JSON.parse(actData.instructions);
                            setQuestions(qList);
                            setActivityType('quiz');
                        } else if (actData.type === 'DESSIN') {
                            setInstruction(actData.instructions);
                            setActivityType('exercice');
                        }
                    }
                } catch (e) {
                    console.error("Erreur de chargement de l'activité depuis la BDD:", e);
                }
                setLoading(false);
            }
        }

        loadData();
    }, [id, actId, isMock]);

    // États pour le Canvas de dessin (Exercices)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState('#6d5ba8'); // Violet par défaut
    const [brushSize, setBrushSize] = useState(5);
    const [isEraser, setIsEraser] = useState(false);

    // Déclencheur de confettis
    useEffect(() => {
        if (isFinished) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isFinished]);

    // ─── Logique de Dessin (Canvas) ───
    useEffect(() => {
        if (!isExercice || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Remplir en blanc par défaut
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, [isExercice]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const coords = getEventCoords(e, canvas);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const coords = getEventCoords(e, canvas);
        ctx.lineTo(coords.x, coords.y);
        ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getEventCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            if (e.touches.length === 0) return { x: 0, y: 0 };
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        } else {
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // ─── Enregistrement de l'activité ───
    const handleSaveActivity = async () => {
        let savedData = {};
        let scoreToSave = 1;
        if (isLecon) {
            savedData = { completed: true };
        } else if (isQuiz) {
            savedData = { 
                completed: true, 
                score: `${score}/${questions.length}`,
                parfait: score === questions.length
            };
            scoreToSave = score;
        } else if (isExercice) {
            savedData = { completed: true };
        }

        localStorage.setItem(`rfc_enfant_act_${actId}`, JSON.stringify(savedData));

        if (!isMock) {
            try {
                await sauvegarderResultatActivite(actId, scoreToSave);
            } catch (err) {
                console.error("Erreur de sauvegarde de l'activité sur la BDD:", err);
            }
        }

        router.push(`/enfant/modules/${id}`);
    };

    // ─── Logique Quiz ───
    const handleAnswerQuiz = (index: number) => {
        if (selectedOption !== null) return; // Empêcher de recliquer
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
                <p className="mt-4 text-violet-500">Chargement de ton activité...</p>
            </div>
        );
    }

    if (!displayModule) return null;


    return (
        <div className="text-violet-900 max-w-3xl mx-auto pb-8 relative">
            {/* ─── Confettis Emojis (Pure CSS/JS simple animation) ─── */}
            {showConfetti && (
                <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
                    <div className="absolute animate-bounce text-6xl">🎉 🥳 🌟 💫 🎈</div>
                </div>
            )}

            {/* ─── Header de l'activité ─── */}
            <div className="flex items-center justify-between border-b border-violet-100 pb-4 mb-6">
                <Link 
                    href={`/enfant/modules/${id}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-violet-600 hover:text-violet-900"
                >
                    <ChevronLeft className="h-4 w-4" /> Quitter l'activité
                </Link>
                <div className="text-sm font-bold text-violet-500 uppercase tracking-widest">
                    {displayModule.label}
                </div>
            </div>

            {/* ─── 1. INTERFACE LEÇON ─── */}
            {isLecon && !isFinished && (
                <div className="rounded-3xl border border-violet-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600">
                            <BookOpen className="h-4 w-4" /> Lecture Leçon
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
                                <Check className="h-4 w-4" /> Terminer la leçon !
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ─── 2. INTERFACE QUIZ ─── */}
            {isQuiz && !isFinished && (
                <div className="rounded-3xl border border-violet-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-extrabold text-violet-600">
                            <HelpCircle className="h-4 w-4" /> Quiz Interactif
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

            {/* ─── 3. INTERFACE EXERCICE (DESSIN CANVAS) ─── */}
            {isExercice && !isFinished && (
                <div className="rounded-3xl border border-violet-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 bg-purple-50 p-4 rounded-2xl border border-purple-100/50">
                        <Sparkles className="h-5 w-5 text-purple-600 shrink-0" />
                        <div>
                            <div className="text-xs font-bold text-purple-950">Mission créative :</div>
                            <p className="text-xs text-purple-800 leading-normal">{instruction}</p>
                        </div>
                    </div>

                    {/* Canvas Container */}
                    <div className="relative border-2 border-dashed border-violet-200 rounded-2xl overflow-hidden bg-white shadow-inner">
                        <canvas
                            ref={canvasRef}
                            width={650}
                            height={400}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-auto touch-none bg-white cursor-crosshair"
                        />
                    </div>

                    {/* Boîte à outils de dessin */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 p-4 bg-violet-50/50 rounded-2xl border border-violet-100/50">
                        {/* Palette de couleurs */}
                        <div className="flex flex-wrap gap-2">
                            {['#6d5ba8', '#29b6f6', '#ec407a', '#66bb6a', '#ff7043', '#f97c7c', '#000000'].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        setBrushColor(color);
                                        setIsEraser(false);
                                    }}
                                    className={`h-7 w-7 rounded-full transition-transform ${brushColor === color && !isEraser ? 'scale-110 ring-2 ring-violet-400' : ''}`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                            {/* Gomme */}
                            <button
                                onClick={() => setIsEraser(true)}
                                className={`flex h-7 w-7 items-center justify-center rounded-full bg-white border border-violet-200 text-violet-600 transition-transform ${isEraser ? 'scale-110 ring-2 ring-violet-400' : ''}`}
                                title="Gomme"
                            >
                                <Eraser className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Taille de pinceau */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-violet-600">Pinceau :</span>
                            <input
                                type="range"
                                min={2}
                                max={20}
                                value={brushSize}
                                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                className="w-24 accent-violet-600"
                            />
                            <span className="text-xs font-bold text-violet-700">{brushSize}px</span>
                        </div>

                        {/* Actions Canvas */}
                        <div className="flex gap-2">
                            <button
                                onClick={clearCanvas}
                                className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors"
                                title="Effacer tout le dessin"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setIsFinished(true)}
                            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-xs font-black text-white hover:from-violet-700 hover:to-purple-700 shadow-md flex items-center gap-1.5"
                        >
                            <Check className="h-4 w-4" /> Enregistrer mon dessin !
                        </button>
                    </div>
                </div>
            )}

            {/* ─── 4. INTERFACE DE SUCCÈS (FIN DE L'ACTIVITÉ) ─── */}
            {isFinished && (
                <div className="rounded-3xl border border-violet-200 bg-white p-8 shadow-sm text-center flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-6 border border-amber-200/50 shadow-inner">
                        <Trophy className="h-8 w-8 animate-bounce" />
                    </div>

                    <h2 className="text-2xl font-black text-violet-950 mb-2">Hourra ! Activité complétée !</h2>
                    
                    {isLecon && (
                        <p className="text-sm text-violet-600 max-w-md mb-6 leading-relaxed">
                            Félicitations, tu as lu toute la leçon ! Tu as acquis de nouvelles connaissances. Prêt à tester ton savoir sur l'exercice suivant ?
                        </p>
                    )}

                    {isQuiz && (
                        <div className="mb-6">
                            <p className="text-sm text-violet-600 max-w-md leading-relaxed mb-4">
                                Tu as répondu à toutes les questions !
                            </p>
                            <div className="inline-flex flex-col items-center bg-violet-50 rounded-2xl px-6 py-4 border border-violet-100/50">
                                <span className="text-xs font-bold text-violet-500 uppercase tracking-widest">Ton score final</span>
                                <span className="text-3xl font-black text-violet-950 mt-1">{score} / {questions.length}</span>
                                {score === questions.length ? (
                                    <span className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-current text-amber-500" /> Score Parfait ! Magnifique !
                                    </span>
                                ) : (
                                    <span className="text-xs font-semibold text-violet-600 mt-2">
                                        Tu as fait du bon travail !
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {isExercice && (
                        <p className="text-sm text-violet-600 max-w-md mb-6 leading-relaxed">
                            Ton dessin a été bien enregistré ! Tu as fait preuve d'une superbe créativité.
                        </p>
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
                                <RotateCcw className="h-4 w-4" /> Recommencer le quiz
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
