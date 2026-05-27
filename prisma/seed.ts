import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

// Charge le fichier .env
dotenv.config();

// Configure le pool de connexion PostgreSQL natif
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialise Prisma avec l'adaptateur exigé par la v7
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 (Seeding) ...');

  const adminEmail = 'admin@rfc06.fr';
  const adminId = 'd7586b2b-db15-4af4-b930-5dd152cb32ab'; 

  const admin = await prisma.utilisateur.upsert({
    where: { id: adminId },
    update: {}, 
    create: {   
      id: adminId, 
      email: adminEmail,
      nom: 'IPSSI',
      prenom: 'Johanna',
      role: 'ADMIN',
      telephone: '0601020304',
    },
  });

  console.log(`👤 Admin ${admin.prenom} ${admin.nom} synchronisé avec succès !`);
  console.log('✅ Seeding terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    // Ferme proprement le pool à la fin
    await pool.end();
  });