'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { obtenirDetailsActiviteDepuisDB, obtenirDetailsModuleDepuisDB, sauvegarderResultatActivite } from '../../../actions';
import ActivityAdventureView from './activity-view';
import {
    MODULES_ADVENTURES,
    buildNapoleonContentFromDb,
    getNapoleonInitialStepIndex,
    type InputExerciseData,
    type MatchExerciseData,
    type ModuleContent,
    type OrderExerciseData,
    type SortExerciseData,
} from './activity-data';
type PageParams = Promise<{ id: string; actId: string }>;

export default function EnfantActivityPage({ params }: { params: PageParams }) {
    const { id, actId } = use(params);
    const router = useRouter();
    const [resolvedModuleId, setResolvedModuleId] = useState<string | null>(
        MODULES_ADVENTURES[id] ? id : null
    );

    // Détermination du module ID de l'aventure (sert à cibler le bon contenu statique)
    const isNapoleonModule = resolvedModuleId === 'napoleon';
    const activeModuleId = resolvedModuleId ?? 'lecture';
    const [napoleonContent, setNapoleonContent] = useState<ModuleContent>(MODULES_ADVENTURES.napoleon);
    const content = isNapoleonModule ? napoleonContent : (MODULES_ADVENTURES[activeModuleId] ?? MODULES_ADVENTURES.lecture);
    const isModuleResolutionPending = !MODULES_ADVENTURES[id] && resolvedModuleId === null;
    const [stepIndex, setStepIndex] = useState(() => (
        isNapoleonModule ? getNapoleonInitialStepIndex(actId) : 0
    )); // 0: Découvrir, 1: Observer, 2: Comprendre, 3: Exercice, 4: Quiz, 5: Résultat
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function resolveModuleFromDb() {
            if (MODULES_ADVENTURES[id]) {
                if (!cancelled) {
                    setResolvedModuleId(id);
                }
                return;
            }

            try {
                const moduleDetails = await obtenirDetailsModuleDepuisDB(id);
                if (cancelled) return;

                if (moduleDetails?.slug === 'napoleon' || moduleDetails?.label?.toLowerCase().includes('napoléon')) {
                    setResolvedModuleId('napoleon');
                } else if (moduleDetails?.slug && MODULES_ADVENTURES[moduleDetails.slug]) {
                    setResolvedModuleId(moduleDetails.slug);
                } else if (moduleDetails?.slug) {
                    setResolvedModuleId(moduleDetails.slug);
                } else {
                    setResolvedModuleId('lecture');
                }
            } catch {
                if (!cancelled) {
                    setResolvedModuleId('lecture');
                }
            }
        }

        resolveModuleFromDb();

        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        let cancelled = false;

        async function loadNapoleonContent() {
            if (!isNapoleonModule) {
                return;
            }

            try {
                const moduleDetails = await obtenirDetailsModuleDepuisDB('napoleon');
                if (!moduleDetails || cancelled) {
                    return;
                }

                const activitiesDetails = await Promise.all(
                    moduleDetails.activites.map((activity) => obtenirDetailsActiviteDepuisDB(activity.id))
                );

                if (cancelled) {
                    return;
                }

                setNapoleonContent(buildNapoleonContentFromDb(moduleDetails, activitiesDetails));
                setStepIndex(getNapoleonInitialStepIndex(actId));
            } catch (error) {
                console.warn('[Napoleon] Utilisation du contenu de secours pendant le chargement DB.', error);
            }
        }

        loadNapoleonContent();

        return () => {
            cancelled = true;
        };
    }, [isNapoleonModule, id, actId]);

    const napoleonImages = {
        step1: '/images/enfants/napoleon/napoleon_lecon_1_qui_etait_napoleon.png',
        step2: '/images/enfants/napoleon/napoleon_lecon_2_napoleon_et_son_epoque.png',
        step3: '/images/enfants/napoleon/napoleon_lecon_3_comprendre_avec_methode.png',
        step4: '/images/enfants/napoleon/napoleon_lecon_4_les_limites_a_connaitre.png',
        exercice: '/images/enfants/napoleon/napoleon_exercice_remettre_dans_l_ordre.png',
        quiz: '/images/enfants/napoleon/napoleon_quiz_reviser_napoleon.png',
    } as const;

    const step1ImagePath = isNapoleonModule
        ? napoleonImages.step1
        : activeModuleId === 'robotique'
            ? '/images/enfants/quiz_robot.png'
            : `/images/enfants/${activeModuleId}_decouvrir.png`;
    const step2ImagePath = isNapoleonModule
        ? napoleonImages.step2
        : activeModuleId === 'robotique'
            ? '/images/enfants/robotic_arm.png'
            : `/images/enfants/${activeModuleId}_observer.png`;
    const step3NapoleonImages = isNapoleonModule ? [napoleonImages.step3, napoleonImages.step4] : [];
    const step4ImagePath = isNapoleonModule ? napoleonImages.exercice : '/images/enfants/exercice_generic.png';
    const quizImagePath = isNapoleonModule ? napoleonImages.quiz : '/images/enfants/quiz_robot.png';

    // États pour l'Exercice Interactif
    const [exerciceChecked, setExerciceChecked] = useState(false);
    const [exerciceSuccess, setExerciceSuccess] = useState(false);

    // --- États Exercice 'match' (Civique / Numérique) ---
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({});

    // --- États Exercice 'order' (Anglais / Robotique) ---
    const [orderedItemsState, setOrderedItemsState] = useState<string[] | null>(null);
    const orderedItems = content.exercice.type === 'order'
        ? (orderedItemsState ?? [...content.exercice.data.initialOrder])
        : [];

    // --- États Exercice 'input' (Lecture) ---
    const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

    // --- États Exercice 'sort' (Éco-citoyenneté) ---
    const [sortedItems, setSortedItems] = useState<Record<string, string>>({}); // itemId -> categoryId
    const [activeSortItemIndex, setActiveSortItemIndex] = useState(0);

    // États pour le Quiz
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    // Lancer des confettis lors du résultat final
    useEffect(() => {
        if (stepIndex === 5) {
            const showTimer = window.setTimeout(() => setShowConfetti(true), 0);
            const hideTimer = window.setTimeout(() => setShowConfetti(false), 5000);
            return () => {
                window.clearTimeout(showTimer);
                window.clearTimeout(hideTimer);
            };
        }
    }, [stepIndex]);

    if (isModuleResolutionPending) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-violet-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
                <p className="mt-4 text-violet-500">Chargement de ton aventure...</p>
            </div>
        );
    }

    // ─── LOGIQUE EXERCICE : MATCH ───
    const handleSelectLeft = (leftId: string) => {
        if (exerciceChecked) return;
        setSelectedLeft(leftId);
    };

    const handleSelectRight = (rightId: string) => {
        if (exerciceChecked || !selectedLeft) return;
        setMatches(prev => ({
            ...prev,
            [selectedLeft]: rightId
        }));
        setSelectedLeft(null);
    };

    const handleResetMatch = () => {
        setMatches({});
        setExerciceChecked(false);
        setExerciceSuccess(false);
        setSelectedLeft(null);
    };

    const verifyMatch = () => {
        const expected = (content.exercice.data as MatchExerciseData).pairs;
        const totalExpected = Object.keys(expected).length;
        let correctCount = 0;

        for (const [l, r] of Object.entries(expected)) {
            if (matches[l] === r) correctCount++;
        }

        setExerciceSuccess(correctCount === totalExpected);
        setExerciceChecked(true);
    };

    // ─── LOGIQUE EXERCICE : ORDER ───
    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (exerciceChecked) return;
        const newOrder = [...orderedItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newOrder.length) return;

        // Échange
        const temp = newOrder[index];
        newOrder[index] = newOrder[targetIndex];
        newOrder[targetIndex] = temp;
        setOrderedItemsState(newOrder);
    };

    const verifyOrder = () => {
        const expected = (content.exercice.data as OrderExerciseData).correctOrder;
        let isCorrect = true;
        for (let i = 0; i < expected.length; i++) {
            if (orderedItems[i] !== expected[i]) {
                isCorrect = false;
                break;
            }
        }
        setExerciceSuccess(isCorrect);
        setExerciceChecked(true);
    };

    const handleResetOrder = () => {
        setOrderedItemsState([...(content.exercice.data as OrderExerciseData).initialOrder]);
        setExerciceChecked(false);
        setExerciceSuccess(false);
    };

    // ─── LOGIQUE EXERCICE : INPUT ───
    const handleInputChange = (key: string, val: string) => {
        if (exerciceChecked) return;
        setInputAnswers(prev => ({
            ...prev,
            [key]: val
        }));
    };

    const verifyInput = () => {
        const questionsList = (content.exercice.data as InputExerciseData).questions;
        let allCorrect = true;

        for (const q of questionsList) {
            const userVal = (inputAnswers[q.key] || "").trim().toLowerCase();
            // Vérifier si la réponse de l'utilisateur contient un des mots acceptés
            const isMatch = q.correct.some((word: string) => userVal.includes(word.toLowerCase()));
            if (!isMatch) {
                allCorrect = false;
            }
        }

        setExerciceSuccess(allCorrect);
        setExerciceChecked(true);
    };

    const handleResetInput = () => {
        setInputAnswers({});
        setExerciceChecked(false);
        setExerciceSuccess(false);
    };

    // ─── LOGIQUE EXERCICE : SORT ───
    const handleSortItem = (categoryId: string) => {
        if (exerciceChecked) return;
        const items = (content.exercice.data as SortExerciseData).items;
        const currentItem = items[activeSortItemIndex];

        setSortedItems(prev => ({
            ...prev,
            [currentItem.id]: categoryId
        }));

        if (activeSortItemIndex < items.length - 1) {
            setActiveSortItemIndex(activeSortItemIndex + 1);
        } else {
            // Tous triés, on vérifie
            let allCorrect = true;
            const updatedSorted: Record<string, string> = {
                ...sortedItems,
                [currentItem.id as string]: categoryId
            };
            for (const item of items) {
                if (updatedSorted[item.id as string] !== item.category) {
                    allCorrect = false;
                }
            }
            setExerciceSuccess(allCorrect);
            setExerciceChecked(true);
        }
    };

    const handleResetSort = () => {
        setSortedItems({});
        setActiveSortItemIndex(0);
        setExerciceChecked(false);
        setExerciceSuccess(false);
    };

    // ─── LOGIQUE QUIZ ───
    const handleAnswerQuiz = (index: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);
        setShowExplanation(true);
        if (index === content.quiz[quizIndex].answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuiz = () => {
        setSelectedOption(null);
        setShowExplanation(false);
        if (quizIndex < content.quiz.length - 1) {
            setQuizIndex(quizIndex + 1);
        } else {
            // Fin de l'aventure
            setStepIndex(5);
        }
    };

    // Enregistrer en BDD ou LocalStorage
    const handleSaveAdventure = async () => {
        const finalScoreString = `${score}/${content.quiz.length}`;
        const isPerfect = score === content.quiz.length;

        const savedData = {
            completed: true,
            score: finalScoreString,
            parfait: isPerfect
        };

        // Sauvegarder pour l'enfant dans le localStorage
        localStorage.setItem(`rfc_enfant_act_${actId}`, JSON.stringify(savedData));

        const isMock = isNaN(Number(actId));
        if (!isMock) {
            try {
                await sauvegarderResultatActivite(actId, score);
            } catch (err) {
                console.error("Erreur de sauvegarde de l'activité sur la BDD:", err);
            }
        }

        router.push(`/enfant/modules/${id}`);
    };
    return (
        <ActivityAdventureView
            id={id}
            content={content}
            activeModuleId={activeModuleId}
            stepIndex={stepIndex}
            showConfetti={showConfetti}
            step1ImagePath={step1ImagePath}
            step2ImagePath={step2ImagePath}
            step3NapoleonImages={step3NapoleonImages}
            step4ImagePath={step4ImagePath}
            quizImagePath={quizImagePath}
            exerciceChecked={exerciceChecked}
            exerciceSuccess={exerciceSuccess}
            selectedLeft={selectedLeft}
            matches={matches}
            orderedItems={orderedItems}
            inputAnswers={inputAnswers}
            sortedItems={sortedItems}
            activeSortItemIndex={activeSortItemIndex}
            quizIndex={quizIndex}
            selectedOption={selectedOption}
            showExplanation={showExplanation}
            score={score}
            handleSelectLeft={handleSelectLeft}
            handleSelectRight={handleSelectRight}
            handleResetMatch={handleResetMatch}
            verifyMatch={verifyMatch}
            moveItem={moveItem}
            verifyOrder={verifyOrder}
            handleResetOrder={handleResetOrder}
            handleInputChange={handleInputChange}
            verifyInput={verifyInput}
            handleResetInput={handleResetInput}
            handleSortItem={handleSortItem}
            handleResetSort={handleResetSort}
            handleAnswerQuiz={handleAnswerQuiz}
            handleNextQuiz={handleNextQuiz}
            handleSaveAdventure={handleSaveAdventure}
            setStepIndex={setStepIndex}
            setQuizIndex={setQuizIndex}
            setSelectedOption={setSelectedOption}
            setShowExplanation={setShowExplanation}
            setExerciceChecked={setExerciceChecked}
            setExerciceSuccess={setExerciceSuccess}
            setScore={setScore}
        />
    );
}
