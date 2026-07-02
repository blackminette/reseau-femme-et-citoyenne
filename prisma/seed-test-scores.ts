// seed-test-scores.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement d'après la logique de ton seed d'origine
dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
    dotenv.config({ path: '.env' });
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Génération de données d'exercices et de scores fictifs...");

    // 1. Récupérer l'intervenant pour l'assigner aux cours
    const intervenant = await prisma.utilisateur.findFirst({
        where: { role: 'INTERVENANT' }
    });

    if (!intervenant) {
        console.error("❌ Annulation : Aucun intervenant trouvé en base.");
        return;
    }

    // 2. Récupérer l'enfant et l'étudiant créés par ton seed principal
    const etudiant = await prisma.utilisateur.findFirst({ where: { email: 'etudiant@rfc06.fr' } });
    const enfant = await prisma.utilisateur.findFirst({ where: { email: 'enfant@rfc06.fr' } });

    if (!etudiant || !enfant) {
        console.error("❌ Annulation : L'étudiant ou l'enfant de test est introuvable. Lance d'abord ton seed principal.");
        return;
    }

    // --- MODULE NUMÉRIQUE ADULTE (ID: 1) ---
    const coursAdulte = await prisma.cours.create({
        data: {
            titre: "Découverte du Système d'Exploitation",
            moduleId: 1,
            intervenanteId: intervenant.id,
            ordreDansModule: 1,
        }
    });

    const exoAdulte1 = await prisma.exercice.create({
        data: {
            titre: 'Quiz : Les raccourcis clavier essentiels',
            instructions: 'Associez chaque raccourci à sa fonction.',
            type: 'QUIZ',
            coursId: coursAdulte.id,
            ordre: 1,
        }
    });

    const exoAdulte2 = await prisma.exercice.create({
        data: {
            titre: 'Pratique : Gestion des dossiers et fichiers',
            instructions: 'Créez une arborescence propre pour vos documents.',
            type: 'PRATIQUE',
            coursId: coursAdulte.id,
            ordre: 2,
        }
    });

    // --- MODULE NUMÉRIQUE ENFANT (ID: 3) ---
    const coursEnfant = await prisma.cours.create({
        data: {
            titre: 'Premiers pas avec la Souris et le Clavier',
            moduleId: 3,
            intervenanteId: intervenant.id,
            ordreDansModule: 1,
        }
    });

    const exoEnfant1 = await prisma.exercice.create({
        data: {
            titre: 'Jeu : Précision du clic de souris',
            instructions: 'Cliquez sur les cibles mouvantes.',
            type: 'JEU',
            coursId: coursEnfant.id,
            ordre: 1,
        }
    });

    const exoEnfant2 = await prisma.exercice.create({
        data: {
            titre: 'Quiz : Les dangers d\'Internet',
            instructions: 'Identifiez les bonnes pratiques de navigation.',
            type: 'QUIZ',
            coursId: coursEnfant.id,
            ordre: 2,
        }
    });

    // 3. Insertion des Scores pour l'Étudiant (Emma Grand)
    await prisma.scoreQuiz.createMany({
        data: [
            {
                score: 85,
                etudiantId: etudiant.id,
                exerciceId: exoAdulte1.id,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            },
            {
                score: 45,
                etudiantId: etudiant.id,
                exerciceId: exoAdulte2.id,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
            },
            {
                score: 90,
                etudiantId: etudiant.id,
                exerciceId: exoAdulte2.id,
                createdAt: new Date(),
            }
        ]
    });

    // 4. Insertion des Scores pour l'Enfant (Thomas Petit)
    await prisma.scoreQuiz.createMany({
        data: [
            {
                score: 100,
                etudiantId: enfant.id,
                exerciceId: exoEnfant1.id,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            },
            {
                score: 60,
                etudiantId: enfant.id,
                exerciceId: exoEnfant2.id,
                createdAt: new Date(),
            }
        ]
    });

    console.log("✅ Scores et exercices injectés ! Vérifie le résultat sur page_7.tsx.");
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors du seeding de test :', e);
    })
    .finally(async () => {
        await pool.end(); // Ferme la connexion au pool pg
        await prisma.$disconnect();
    });