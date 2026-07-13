import { Parcours } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { MiloActivityContext, MiloChatRequest } from "@/lib/milo/request";

export const MILO_MODULES = [
  "lecture",
  "numerique",
  "robotique",
  "anglais",
  "civique",
  "eco",
] as const;

export type MiloModule = (typeof MILO_MODULES)[number];

const PARCOURS_TO_MILO_MODULE: Record<string, MiloModule> = {
  COMPREHENSION_LECTURE: "lecture",
  NUMERIQUE: "numerique",
  ROBOTIQUE: "robotique",
  ANGLAIS: "anglais",
  EDUCATION_CIVIQUE: "civique",
  ECO_CITOYENNETE: "eco",
};

const MILO_MODULE_TO_PARCOURS: Record<MiloModule, Parcours> = {
  lecture: Parcours.COMPREHENSION_LECTURE,
  numerique: Parcours.NUMERIQUE,
  robotique: Parcours.ROBOTIQUE,
  anglais: Parcours.ANGLAIS,
  civique: Parcours.EDUCATION_CIVIQUE,
  eco: Parcours.ECO_CITOYENNETE,
};

function parseDatabaseId(value: string | null): number | null {
  if (!value || !/^[1-9]\d{0,8}$/.test(value)) return null;

  return Number(value);
}

function asExcerpt(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const excerpt = value.replace(/\s+/g, " ").trim().slice(0, 500);
  return excerpt || null;
}

function readPages(content: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(content)) return [];

  return content.filter(
    (page): page is Record<string, unknown> => Boolean(page) && typeof page === "object",
  );
}

// The database JSON can contain answer options and correct answers. The activity
// context built here keeps only pedagogical text and question wording.
export function buildMiloActivityContext(
  kind: MiloActivityContext["kind"],
  title: unknown,
  instructions: unknown,
  content: unknown,
): MiloActivityContext | null {
  const safeTitle = asExcerpt(title);
  const excerpts = [asExcerpt(instructions)];

  for (const page of readPages(content).slice(0, 3)) {
    const pageTitle = asExcerpt(page.titre);
    const pageText = asExcerpt(page.texteExplicatif) ?? asExcerpt(page.texte);
    const question = asExcerpt(page.question);

    if (pageTitle) excerpts.push(pageTitle);
    if (pageText) excerpts.push(pageText);
    if (question) excerpts.push(question);
  }

  const uniqueExcerpts = [...new Set(excerpts.filter((excerpt): excerpt is string => Boolean(excerpt)))].slice(0, 4);

  if (!safeTitle && uniqueExcerpts.length === 0) return null;

  return {
    kind,
    title: safeTitle ?? (kind === "lesson" ? "Lecon en cours" : "Exercice en cours"),
    excerpts: uniqueExcerpts,
  };
}

export function parseMiloModuleReference(value: string | null): MiloModule | null {
  return value && MILO_MODULES.includes(value as MiloModule)
    ? (value as MiloModule)
    : null;
}

export function mapParcoursToMiloModule(parcours: readonly string[]): MiloModule | null {
  for (const value of parcours) {
    const miloModule = PARCOURS_TO_MILO_MODULE[value];
    if (miloModule) return miloModule;
  }

  return null;
}

export type MiloResolvedContext = {
  module: MiloModule | null;
  activity: MiloActivityContext | null;
};

async function resolveActivityContext(activityReference: string): Promise<MiloResolvedContext> {
  const courseMatch = /^cours_(\d{1,9})$/.exec(activityReference);

  if (courseMatch) {
    const course = await prisma.cours.findFirst({
      where: {
        id: Number(courseMatch[1]),
        module: { public: "ENFANT", isPublished: true },
      },
      select: {
        titre: true,
        contenu: true,
        module: { select: { parcours: true } },
      },
    });

    return course
      ? {
          module: mapParcoursToMiloModule(course.module.parcours),
          activity: buildMiloActivityContext("lesson", course.titre, null, course.contenu),
        }
      : { module: null, activity: null };
  }

  const exerciseId = parseDatabaseId(activityReference);
  if (!exerciseId) return { module: null, activity: null };

  const exercise = await prisma.exercice.findFirst({
    where: {
      id: exerciseId,
      cours: { module: { public: "ENFANT", isPublished: true } },
    },
    select: {
      titre: true,
      instructions: true,
      contenu: true,
      cours: { select: { module: { select: { parcours: true } } } },
    },
  });

  return exercise
    ? {
        module: mapParcoursToMiloModule(exercise.cours.module.parcours),
        activity: buildMiloActivityContext(
          "exercise",
          exercise.titre,
          exercise.instructions,
          exercise.contenu,
        ),
      }
    : { module: null, activity: null };
}

// Route references come from the browser and are untrusted. The database lookup
// only returns a Milo category for published child content; it never exposes
// lesson content or another child's data.
export async function resolveMiloContext(
  request: MiloChatRequest,
): Promise<MiloResolvedContext> {
  try {
    if (request.activityReference) {
      const activityContext = await resolveActivityContext(request.activityReference);
      if (activityContext.module) return activityContext;
    }

    const moduleId = parseDatabaseId(request.moduleReference);
    if (moduleId) {
      const contentModule = await prisma.module.findFirst({
        where: { id: moduleId, public: "ENFANT", isPublished: true },
        select: { parcours: true },
      });

      return {
        module: contentModule ? mapParcoursToMiloModule(contentModule.parcours) : null,
        activity: null,
      };
    }

    const moduleReference = parseMiloModuleReference(request.moduleReference);
    if (!moduleReference) return { module: null, activity: null };

    const contentModule = await prisma.module.findFirst({
      where: {
        parcours: { has: MILO_MODULE_TO_PARCOURS[moduleReference] },
        public: "ENFANT",
        isPublished: true,
      },
      select: { parcours: true },
    });

    return {
      module: contentModule ? mapParcoursToMiloModule(contentModule.parcours) : null,
      activity: null,
    };
  } catch (error) {
    // A context lookup failure must not turn a child request into an unhandled 500.
    console.warn("[Milo] Contexte pedagogique indisponible.", error);
    return { module: null, activity: null };
  }
}

export async function resolveMiloModuleContext(
  request: MiloChatRequest,
): Promise<MiloModule | null> {
  return (await resolveMiloContext(request)).module;
}
