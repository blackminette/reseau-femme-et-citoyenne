import { Parcours } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { MiloChatRequest } from "@/lib/milo/request";

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

async function resolveActivityModule(activityReference: string): Promise<MiloModule | null> {
  const courseMatch = /^cours_(\d{1,9})$/.exec(activityReference);

  if (courseMatch) {
    const course = await prisma.cours.findFirst({
      where: {
        id: Number(courseMatch[1]),
        module: { public: "ENFANT", isPublished: true },
      },
      select: { module: { select: { parcours: true } } },
    });

    return course ? mapParcoursToMiloModule(course.module.parcours) : null;
  }

  const exerciseId = parseDatabaseId(activityReference);
  if (!exerciseId) return null;

  const exercise = await prisma.exercice.findFirst({
    where: {
      id: exerciseId,
      cours: { module: { public: "ENFANT", isPublished: true } },
    },
    select: { cours: { select: { module: { select: { parcours: true } } } } },
  });

  return exercise
    ? mapParcoursToMiloModule(exercise.cours.module.parcours)
    : null;
}

// Route references come from the browser and are untrusted. The database lookup
// only returns a Milo category for published child content; it never exposes
// lesson content or another child's data.
export async function resolveMiloModuleContext(
  request: MiloChatRequest,
): Promise<MiloModule | null> {
  if (request.activityReference) {
    const activityModule = await resolveActivityModule(request.activityReference);
    if (activityModule) return activityModule;
  }

  const moduleId = parseDatabaseId(request.moduleReference);
  if (moduleId) {
    const contentModule = await prisma.module.findFirst({
      where: { id: moduleId, public: "ENFANT", isPublished: true },
      select: { parcours: true },
    });

    return contentModule ? mapParcoursToMiloModule(contentModule.parcours) : null;
  }

  const moduleReference = parseMiloModuleReference(request.moduleReference);
  if (!moduleReference) return null;

  const contentModule = await prisma.module.findFirst({
    where: {
      parcours: { has: MILO_MODULE_TO_PARCOURS[moduleReference] },
      public: "ENFANT",
      isPublished: true,
    },
    select: { parcours: true },
  });

  return contentModule ? mapParcoursToMiloModule(contentModule.parcours) : null;
}
