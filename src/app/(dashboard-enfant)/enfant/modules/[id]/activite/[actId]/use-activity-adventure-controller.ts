'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import {
    obtenirDetailsActiviteDepuisDB,
    obtenirDetailsModuleDepuisDB,
    sauvegarderResultatActivite,
} from '../../../actions';
import {
    GENERIC_ADVENTURE_FALLBACK,
    buildNapoleonContentFromDb,
    getNapoleonInitialStepIndex,
    type InputExerciseData,
    type MatchExerciseData,
    type ModuleContent,
    type OrderExerciseData,
    type SortExerciseData,
} from './activity-data';

type ActivityAdventureControllerInput = {
    id: string;
    actId: string;
};

type ActivityAdventureControllerOutput = {
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
    isModuleResolutionPending: boolean;
};

function createGenericContent(moduleLabel: string, moduleDescription?: string): ModuleContent {
    return {
        ...GENERIC_ADVENTURE_FALLBACK,
        titreGlobal: moduleLabel,
        description: moduleDescription || GENERIC_ADVENTURE_FALLBACK.description,
        step1: {
            ...GENERIC_ADVENTURE_FALLBACK.step1,
            soustitre: moduleLabel,
            texte: moduleDescription || GENERIC_ADVENTURE_FALLBACK.step1.texte,
        },
        step2: {
            ...GENERIC_ADVENTURE_FALLBACK.step2,
            boxTitre: moduleLabel,
            texte: moduleDescription || GENERIC_ADVENTURE_FALLBACK.step2.texte,
        },
        step3: {
            ...GENERIC_ADVENTURE_FALLBACK.step3,
            texte: `Le module ${moduleLabel} est en attente de contenu détaillé depuis la base de données.`,
        },
    };
}

export function useActivityAdventureController({
    id,
    actId,
}: ActivityAdventureControllerInput): ActivityAdventureControllerOutput {
    const router = useRouter();
    const [resolvedModuleId, setResolvedModuleId] = useState<string | null>(null);
    const [content, setContent] = useState<ModuleContent>(GENERIC_ADVENTURE_FALLBACK);
    const isNapoleonModule = resolvedModuleId === 'napoleon';
    const activeModuleId = resolvedModuleId ?? id;
    const isModuleResolutionPending = resolvedModuleId === null;
    const [stepIndex, setStepIndex] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [exerciceChecked, setExerciceChecked] = useState(false);
    const [exerciceSuccess, setExerciceSuccess] = useState(false);
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [orderedItemsState, setOrderedItemsState] = useState<string[] | null>(null);
    const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
    const [sortedItems, setSortedItems] = useState<Record<string, string>>({});
    const [activeSortItemIndex, setActiveSortItemIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    const napoleonImages = {
        step1: '/images/enfants/napoleon/napoleon_lecon_1_qui_etait_napoleon.png',
        step2: '/images/enfants/napoleon/napoleon_lecon_2_napoleon_et_son_epoque.png',
        step3: '/images/enfants/napoleon/napoleon_lecon_3_comprendre_avec_methode.png',
        step4: '/images/enfants/napoleon/napoleon_lecon_4_les_limites_a_connaitre.png',
        exercice: '/images/enfants/napoleon/napoleon_exercice_remettre_dans_l_ordre.png',
        quiz: '/images/enfants/napoleon/napoleon_quiz_reviser_napoleon.png',
    } as const;

    const step1ImagePath = isNapoleonModule ? napoleonImages.step1 : '';
    const step2ImagePath = isNapoleonModule ? napoleonImages.step2 : '';
    const step3NapoleonImages = isNapoleonModule ? [napoleonImages.step3, napoleonImages.step4] : [];
    const step4ImagePath = isNapoleonModule ? napoleonImages.exercice : '';
    const quizImagePath = isNapoleonModule ? napoleonImages.quiz : '';

    useEffect(() => {
        let cancelled = false;

        async function loadModuleFromDb() {
            try {
                const moduleDetails = await obtenirDetailsModuleDepuisDB(id);
                if (cancelled) return;

                if (moduleDetails?.slug === 'napoleon' || moduleDetails?.label?.toLowerCase().includes('napoléon')) {
                    setResolvedModuleId('napoleon');
                } else if (moduleDetails?.slug) {
                    setResolvedModuleId(moduleDetails.slug);
                } else {
                    setResolvedModuleId(id);
                }

                if (moduleDetails?.slug === 'napoleon' || moduleDetails?.label?.toLowerCase().includes('napoléon')) {
                    const activitiesDetails = await Promise.all(
                        moduleDetails.activites.map((activity) => obtenirDetailsActiviteDepuisDB(activity.id))
                    );

                    if (cancelled) {
                        return;
                    }

                    setContent(buildNapoleonContentFromDb(moduleDetails, activitiesDetails));
                    setStepIndex(getNapoleonInitialStepIndex(actId));
                } else if (moduleDetails) {
                    setContent(createGenericContent(moduleDetails.label, moduleDetails.description || undefined));
                    setStepIndex(0);
                }
            } catch {
                if (!cancelled) {
                    setResolvedModuleId(id);
                    setContent(createGenericContent(id));
                    setStepIndex(0);
                }
            }
        }

        loadModuleFromDb();

        return () => {
            cancelled = true;
        };
    }, [id, actId]);

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

    const orderedItems = content.exercice.type === 'order'
        ? (orderedItemsState ?? [...content.exercice.data.initialOrder])
        : [];

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

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (exerciceChecked) return;
        const newOrder = [...orderedItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newOrder.length) return;

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
            const userVal = (inputAnswers[q.key] || '').trim().toLowerCase();
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
            setStepIndex(5);
        }
    };

    const handleSaveAdventure = async () => {
        const finalScoreString = `${score}/${content.quiz.length}`;
        const isPerfect = score === content.quiz.length;

        const savedData = {
            completed: true,
            score: finalScoreString,
            parfait: isPerfect
        };

        localStorage.setItem(`rfc_enfant_act_${actId}`, JSON.stringify(savedData));

        const isMock = isNaN(Number(actId));
        if (!isMock) {
            try {
                await sauvegarderResultatActivite(actId, score);
            } catch (err) {
                console.error('Erreur de sauvegarde de l\'activité sur la BDD:', err);
            }
        }

        router.push(`/enfant/modules/${id}`);
    };

    return {
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
        isModuleResolutionPending,
    };
}
