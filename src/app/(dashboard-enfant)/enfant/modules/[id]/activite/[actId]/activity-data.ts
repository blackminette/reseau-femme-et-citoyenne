import { obtenirDetailsActiviteDepuisDB, obtenirDetailsModuleDepuisDB } from '../../../actions';

// Types
export type Question = {
    q: string;
    options: string[];
    answer: number;
    explication: string;
};

export type MatchItem = {
    id: string;
    text: string;
};

export type MatchExerciseData = {
    left: MatchItem[];
    right: MatchItem[];
    pairs: Record<string, string>;
};

export type OrderExerciseData = {
    initialOrder: string[];
    correctOrder: string[];
};

export type InputQuestion = {
    label: string;
    placeholder: string;
    key: string;
    correct: string[];
};

export type InputExerciseData = {
    questions: InputQuestion[];
};

export type SortItem = {
    id: string;
    text: string;
    category: string;
};

export type SortCategory = {
    id: string;
    title: string;
    bg: string;
};

export type SortExerciseData = {
    items: SortItem[];
    categories: SortCategory[];
};

export type ExerciseContent =
    | { type: 'match'; data: MatchExerciseData }
    | { type: 'order'; data: OrderExerciseData }
    | { type: 'input'; data: InputExerciseData }
    | { type: 'sort'; data: SortExerciseData };

export type ModuleContent = {
    titreGlobal: string;
    description: string;
    themeColor: string;
    step1: {
        titre: string;
        soustitre: string;
        texte: string;
        emoji: string;
        aRetenir: string;
        imageUrl?: string | null;
        numeroPage?: number;
        exempleText?: string;
        exempleImage?: string;
    };
    step2: {
        soustitre: string;
        boxTitre: string;
        texte: string;
        emoji: string;
        aRetenir: string[];
        imageUrl?: string | null;
        numeroPage?: number;
        badges?: { label: string; emoji: string }[];
        bulletList?: string[];
    };
    step3: {
        soustitre: string;
        texte: string;
        pointsCles: string[];
        bulles: string[];
        illustration: string;
        imageUrl?: string | null;
        numeroPage?: number;
        objectif?: string;
    };
    exercice: {
        titre: string;
        type: 'match' | 'order' | 'input' | 'sort';
        data: ExerciseContent['data'];
    } & ExerciseContent;
    quiz: Question[];
};

export const GENERIC_ADVENTURE_FALLBACK: ModuleContent = {
    titreGlobal: 'Module',
    description: 'Contenu en cours de préparation',
    themeColor: 'from-slate-400 to-slate-600',
    step1: {
        titre: 'Découvrir',
        soustitre: 'Contenu en préparation',
        texte: 'Ce module sera bientôt alimenté depuis la base de données.',
        emoji: '📘',
        aRetenir: 'Le contenu de ce module est en cours de préparation.'
    },
    step2: {
        soustitre: 'Lis attentivement le texte suivant.',
        boxTitre: 'Contenu en préparation',
        texte: 'Les textes et activités de ce module seront chargés depuis la base de données.',
        emoji: '🧩',
        aRetenir: [
            'Le contenu sera géré depuis l\'administration.',
            'Les leçons et exercices apparaîtront ici quand ils seront publiés.'
        ]
    },
    step3: {
        soustitre: 'Récapitulons !',
        texte: 'Page en cours de préparation.',
        pointsCles: [
            'Le contenu sera bientôt disponible.',
            'La base de données alimentera cette page.',
            'Les activités apparaîtront quand elles seront prêtes.'
        ],
        bulles: [
            'Base de données',
            'Contenu admin',
            'Activité à venir',
            'Résultat'
        ],
        illustration: '🛠️'
    },
    exercice: {
        titre: 'Activité en préparation',
        type: 'order',
        data: {
            correctOrder: [
                'Étape 1',
                'Étape 2'
            ],
            initialOrder: [
                'Étape 2',
                'Étape 1'
            ]
        }
    },
    quiz: [
        {
            q: 'Le contenu est-il déjà prêt ?',
            options: ['Oui', 'Non'],
            answer: 0,
            explication: 'Cette page est un placeholder générique en attente de contenu complet depuis la base de données.'
        }
    ]
};
export type DetailedActivity = NonNullable<Awaited<ReturnType<typeof obtenirDetailsActiviteDepuisDB>>>;

export function getFirstSentence(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return '';
    const match = trimmed.match(/^[^.?!]+[.?!]?/);
    return (match?.[0] || trimmed).trim();
}

export function getNapoleonInitialStepIndex(actId: string) {
    const match = actId.match(/^cours_(\d+)$/);
    if (!match) return 0;

    const courseNumber = Number.parseInt(match[1], 10);
    if (Number.isNaN(courseNumber) || courseNumber <= 1) {
        return 0;
    }

    if (courseNumber === 2) {
        return 1;
    }

    return 2;
}

export function extractLesson(detail: DetailedActivity | null | undefined) {
    const fallbackTitle = detail?.titre || '';
    const rawContent = detail && Array.isArray(detail.contenu) ? detail.contenu : [];
    const first = rawContent[0] as {
        titre?: string;
        texte?: string;
        texteExplicatif?: string;
        imageUrl?: string | null;
        numeroPage?: number;
    } | undefined;

    return {
        title: first?.titre || fallbackTitle,
        text: first?.texteExplicatif || first?.texte || detail?.instructions || '',
        imageUrl: first?.imageUrl ?? null,
        numeroPage: first?.numeroPage
    };
}

function normalizeQuizContent(rawContent: unknown, fallback: Question[]): Question[] {
    if (!Array.isArray(rawContent) || rawContent.length === 0) {
        return fallback;
    }

    return rawContent.map((item, index) => {
        const fallbackQuestion = fallback[index] ?? fallback[0];
        const page = item as {
            q?: string;
            question?: string;
            options?: string[];
            answer?: number;
            explication?: string;
            reponseCorrecte?: string;
        };
        const options = Array.isArray(page.options) && page.options.length > 0 ? page.options.map(String) : fallbackQuestion.options;
        const question = page.q || page.question || fallbackQuestion.q;
        const explanation = page.explication || fallbackQuestion.explication || '';
        let answer = typeof page.answer === 'number' ? page.answer : -1;

        if (answer < 0 && typeof page.reponseCorrecte === 'string') {
            const normalizedCorrect = page.reponseCorrecte.trim().toLowerCase();
            const matchIndex = options.findIndex((option) => option.trim().toLowerCase() === normalizedCorrect);
            if (matchIndex >= 0) {
                answer = matchIndex;
            }
        }

        if (answer < 0) {
            answer = fallbackQuestion.answer;
        }

        return {
            q: question,
            options,
            answer,
            explication: explanation || (typeof page.reponseCorrecte === 'string' && page.reponseCorrecte.trim()
                ? `Réponse correcte : ${page.reponseCorrecte.trim()}`
                : fallbackQuestion.explication)
        };
    });
}

export function buildNapoleonContentFromDb(
    moduleDetails: NonNullable<Awaited<ReturnType<typeof obtenirDetailsModuleDepuisDB>>>,
    activitiesDetails: Array<DetailedActivity | null>
): ModuleContent {
    const lessons = activitiesDetails.filter((activity): activity is DetailedActivity => activity !== null && activity.type === 'LECON');
    const exercises = activitiesDetails.filter((activity): activity is DetailedActivity => activity !== null && activity.type !== 'LECON');

    const lesson1 = extractLesson(lessons[0]);
    const lesson2 = extractLesson(lessons[1]);
    const lesson3 = extractLesson(lessons[2]);
    const lesson4 = extractLesson(lessons[3]);
    const fallback = GENERIC_ADVENTURE_FALLBACK;

    const orderExercise = exercises.find((exercise) => exercise.type === 'ORDER');
    const quizExercise = exercises.find((exercise) => exercise.type === 'QUIZ');

    const orderData = orderExercise && typeof orderExercise.contenu === 'object' ? orderExercise.contenu : fallback.exercice.data;
    const quizData = Array.isArray(quizExercise?.contenu) ? quizExercise.contenu : fallback.quiz;

    const step2Retenir = [
        getFirstSentence(lesson2.text),
        getFirstSentence(lesson3.text),
        getFirstSentence(lesson4.text)
    ].filter((item): item is string => Boolean(item));

    return {
        titreGlobal: moduleDetails.label,
        description: moduleDetails.description || fallback.description,
        themeColor: fallback.themeColor,
        step1: {
            titre: fallback.step1.titre,
            soustitre: lesson1.title || fallback.step1.soustitre,
            texte: lesson1.text || fallback.step1.texte,
            emoji: fallback.step1.emoji,
            aRetenir: lesson1.text || fallback.step1.aRetenir,
            imageUrl: lesson1.imageUrl ?? null,
            numeroPage: lesson1.numeroPage
        },
        step2: {
            soustitre: fallback.step2.soustitre,
            boxTitre: lesson2.title || fallback.step2.boxTitre,
            texte: lesson2.text || fallback.step2.texte,
            emoji: fallback.step2.emoji,
            aRetenir: step2Retenir.length > 0 ? step2Retenir : fallback.step2.aRetenir,
            imageUrl: lesson2.imageUrl ?? null,
            numeroPage: lesson2.numeroPage
        },
        step3: {
            soustitre: fallback.step3.soustitre,
            texte: [lesson3.text, lesson4.text].filter(Boolean).join(' ') || fallback.step3.texte,
            pointsCles: [
                lesson3.text ? getFirstSentence(lesson3.text) : '',
                lesson4.text ? getFirstSentence(lesson4.text) : '',
                "L'histoire demande de la précision, pas du mythe."
            ].filter((item): item is string => Boolean(item)),
            bulles: [
                lesson3.title || 'Contexte',
                lesson4.title || 'Limites',
                'Analyser avec méthode',
                'Comparer les faits'
            ],
            illustration: fallback.step3.illustration,
            imageUrl: lesson3.imageUrl ?? null,
            numeroPage: lesson3.numeroPage
        },
        exercice: {
            titre: orderExercise?.titre || fallback.exercice.titre,
            type: 'order',
            data: orderData as OrderExerciseData
        },
        quiz: normalizeQuizContent(quizData, fallback.quiz)
    };
}
