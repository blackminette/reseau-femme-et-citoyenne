import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  dotenv.config({ path: '.env' });
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('🌱 [Seed] Début du nettoyage et de l\'initialisation des utilisateurs...');

  // 1. Nettoyage de Supabase Auth (Suppression de TOUS les utilisateurs)
  try {
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000
    });

    if (listError) throw listError;

    if (users && users.length > 0) {
      console.log(`❌ Suppression de ${users.length} utilisateur(s) de Supabase Auth...`);
      for (const user of users) {
        await supabaseAdmin.auth.admin.deleteUser(user.id);
      }
    }
  } catch (err) {
    console.error('⚠️ Erreur lors du nettoyage de Supabase Auth:', err);
  }

  // 2. Nettoyage des tables Prisma (Cascade configurée dans le schéma pour lier Utilisateur)
  try {
    console.log('❌ Nettoyage de la table Utilisateur de la base de données...');
    await prisma.utilisateur.deleteMany({});
  } catch (err) {
    console.error('⚠️ Erreur lors du nettoyage de PostgreSQL:', err);
  }

  // 3. Définition des utilisateurs de test
  const utilisateursDeTest = [
    {
      email: 'admin@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'admin',
      nom: 'IPSSI',
      prenom: 'Johanna',
      role: 'ADMIN',
      telephone: '0601020304',
    },
    {
      email: 'membre@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'membre',
      nom: 'Dupont',
      prenom: 'Jean',
      role: 'MEMBRE',
      telephone: '0611223344',
    },
    {
      email: 'intervenant@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'intervenant',
      nom: 'Martin',
      prenom: 'Sophie',
      role: 'INTERVENANT',
      telephone: '0622334455',
    },
    {
      email: 'partenaire@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'partenaire',
      nom: 'Asso',
      prenom: 'Partenaire',
      role: 'PARTENAIRE',
      telephone: '0633445566',
    },
    {
      email: 'benevole@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'benevole',
      nom: 'Bernard',
      prenom: 'Lucas',
      role: 'BENEVOLE',
      telephone: '0644556677',
    },
    {
      email: 'enfant@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'enfant',
      nom: 'Petit',
      prenom: 'Thomas',
      role: 'ENFANT',
      telephone: '0655667788',
    },
    {
      email: 'etudiant@rfc06.fr',
      motDePasse: 'PassAsso123!',
      username: 'etudiant',
      nom: 'Grand',
      prenom: 'Emma',
      role: 'ETUDIANT',
      telephone: '0666778899',
    },
  ];

  // 4. Création des utilisateurs
  console.log('👥 Création des utilisateurs de test...');
  for (const u of utilisateursDeTest) {
    try {
      // Création dans Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.motDePasse,
        email_confirm: true,
      });

      if (authError || !authData.user) {
        console.error(`⚠️ Impossible de créer ${u.email} sur Supabase Auth:`, authError?.message);
        continue;
      }

      // Création correspondante dans Prisma PostgreSQL
      await prisma.utilisateur.create({
        data: {
          id: authData.user.id,
          email: u.email,
          username: u.username,
          nom: u.nom,
          prenom: u.prenom,
          role: u.role,
          telephone: u.telephone,
          isActive: true,
        },
      });

      console.log(`✅ Utilisateur créé : ${u.prenom} ${u.nom} (${u.role})`);
    } catch (error) {
      console.error(`⚠️ Échec de l'insertion pour l'utilisateur ${u.email}:`, error);
    }
  }

  console.log('🌱 [Seed] Initialisation des utilisateurs terminée avec succès !');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });