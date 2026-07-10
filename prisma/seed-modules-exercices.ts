// seed-modules-exercices.ts
import { PrismaClient, Parcours, PublicCible, Difficulte } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
    dotenv.config({ path: '.env' });
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createModuleCoursExercice(
    titreMod: string,
    parcours: Parcours,
    intervenantId: string
) {
    const mod = await prisma.module.create({
        data: {
            titre: titreMod,
            parcours: [parcours],
            difficulte: Difficulte.FACILE,
            isPublished: true,
        }
    });

    const cours = await prisma.cours.create({
        data: {
            titre: `Cours de ${titreMod}`,
            moduleId: mod.id,
            intervenanteId: intervenantId,
        }
    });

    await prisma.exercice.create({
        data: {
            titre: `Exercice : ${titreMod}`,
            instructions: "Réalisez cette activité.",
            type: "PRATIQUE",
            coursId: cours.id,
        }
    });
}

async function main() {
    console.log("🌱 [Seed] Initialisation des modules...");

    const intervenant = await prisma.utilisateur.findFirst({ where: { role: 'INTERVENANT' } });
    if (!intervenant) return;

    await prisma.actualite.deleteMany({});
    await prisma.exercice.deleteMany({});
    await prisma.cours.deleteMany({});
    await prisma.module.deleteMany({});

    // Liste des parcours adultes
    const parcoursAdultes = [Parcours.NUMERIQUE_ADULTE, Parcours.ORAL, Parcours.BUREAUTIQUE];
    // Liste des parcours enfants (tous les autres du schema)
    const parcoursEnfants = [
        Parcours.COMPREHENSION_LECTURE, Parcours.ECO_CITOYENNETE,
        Parcours.EDUCATION_CIVIQUE, Parcours.NUMERIQUE,
        Parcours.ANGLAIS, Parcours.ROBOTIQUE
    ];

    // Création pour les adultes (2 modules par parcours)
    for (const p of parcoursAdultes) {
        for (let i = 1; i <= 2; i++) {
            await createModuleCoursExercice(`Module ${i} - ${p}`, p, intervenant.id);
        }
    }

    // Création pour les enfants (2 modules par parcours)
    for (const p of parcoursEnfants) {
        for (let i = 1; i <= 2; i++) {
            await createModuleCoursExercice(`Module ${i} - ${p}`, p, intervenant.id);
        }
    }

    console.log('✅ [Seed] Base initialisée avec 2 modules par parcours !');
}

main().then(async () => { await prisma.$disconnect(); await pool.end(); });