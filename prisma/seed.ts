import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charge le fichier .env
dotenv.config({ path: '.env' });

// Configure le pool de connexion PostgreSQL natif
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialise Prisma avec l'adaptateur exigé par la v7
const prisma = new PrismaClient({ adapter });

// Initialisation du client Supabase avec la clé anonyme
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  console.log('🌱 (Seeding) Début de la synchronisation Supabase + Prisma...');

  // 1. Liste de tous les comptes de test (un par rôle) avec mot de passe générique
  const utilisateursDeTest = [
    {
      email: 'admin@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'IPSSI',
      prenom: 'Johanna',
      role: 'ADMIN',
      telephone: '0601020304',
    },
    {
      email: 'membre@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Martin',
      prenom: 'Lucas',
      role: 'MEMBRE',
      telephone: '0602030405',
    },
    {
      email: 'partenaire@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Dubois',
      prenom: 'Thomas',
      role: 'PARTENAIRE',
      telephone: '0603040506',
    },
    {
      email: 'intervenante@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Robert',
      prenom: 'Sarah',
      role: 'INTERVENANTE',
      telephone: '0604050607',
    },
    {
      email: 'enfant@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Petit',
      prenom: 'Chloé',
      role: 'ENFANT',
      telephone: null,
    },
    {
      email: 'benevole@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Lemoine',
      prenom: 'Antoine',
      role: 'BENEVOLE',
      telephone: '0605060708',
    }
  ];

  // 2. Boucle pour créer sur Supabase Auth ET synchroniser dans Prisma via l'UUID généré
  for (const user of utilisateursDeTest) {
    let supabaseAuthId: string;

    // A. Création/Vérification du compte dans Supabase Auth (Sans envoi d'email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.motDePasse,
      email_confirm: true // Valide le compte d'office pour éviter le blocage au login
    });

    if (authError) {
      // Si l'utilisateur existe déjà sur Supabase Auth, on récupère simplement son UUID existant
      if (authError.message.includes('already exists') || authError.message.includes('email_exists')) {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const userExistant = listData?.users.find(u => u.email === user.email);
        
        if (!userExistant) {
          console.error(`❌ Impossible de récupérer l'UUID existant pour ${user.email}`);
          continue;
        }
        supabaseAuthId = userExistant.id;
      } else {
        console.error(`❌ Erreur Supabase Auth pour ${user.email}:`, authError.message);
        continue;
      }
    } else {
      // Si la création est neuve, on extrait l'UUID généré par Supabase
      supabaseAuthId = authData.user.id;
    }

    // B. Exécution de l'upsert Prisma indexé sur cet UUID
    await prisma.utilisateur.upsert({
      where: { id: supabaseAuthId }, // Utilise l'ID authentifié comme clé primaire
      update: {}, 
      create: {
        id: supabaseAuthId, // On force Prisma à s'aligner sur l'UUID de Supabase
        email: user.email,
        username: user.email.split('@')[0],
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        telephone: user.telephone,
      },
    });

    console.log(`👤 Compte [${user.role}] pour ${user.prenom} ${user.nom} synchronisé ! (Mdp: ${user.motDePasse})`);
  }

  console.log('✅ Seeding terminé avec succès et prêt pour le login local !');
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