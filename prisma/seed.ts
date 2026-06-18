import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charge le fichier .env
dotenv.config({ path: '.env.local' });

// Configure le pool de connexion PostgreSQL natif
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialise Prisma avec l'adaptateur exige par la v7
const prisma = new PrismaClient({ adapter });

// Initialisation du client Supabase avec la cle d'administration (Service Role Key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('[SEED] Debut de la synchronisation Supabase + Prisma...');

  // 1. Liste de tous les comptes de test (un par role) avec mot de passe generique
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
      role: 'INTERVENANT',
      telephone: '0604050607',
    },
    {
      email: 'enfant@rfc06.fr',
      motDePasse: 'PassAsso123!',
      nom: 'Petit',
      prenom: 'Chlo\u00e9',
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

  // 2. Boucle pour creer sur Supabase Auth ET synchroniser dans Prisma via l'UUID genere
  for (const user of utilisateursDeTest) {
    let supabaseAuthId: string;

    // A. Creation/Verification du compte dans Supabase Auth (sans envoi d'email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.motDePasse,
      email_confirm: true // Valide le compte d'office pour eviter le blocage au login
    });

    if (authError) {
      // Si l'utilisateur existe deja sur Supabase Auth, on recupere simplement son UUID existant
      if (authError.message.includes('already exists') || authError.message.includes('email_exists')) {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const userExistant = listData?.users.find(u => u.email === user.email);

        if (!userExistant) {
          console.error(`[ERREUR] Impossible de recuperer l'UUID existant pour ${user.email}`);
          continue;
        }
        supabaseAuthId = userExistant.id;
      } else {
        console.error(`[ERREUR] Erreur Supabase Auth pour ${user.email}:`, authError.message);
        continue;
      }
    } else {
      // Si la creation est neuve, on extrait l'UUID genere par Supabase
      supabaseAuthId = authData.user.id;
    }

    // B. Execution de l'upsert Prisma indexe sur cet UUID
    await prisma.utilisateur.upsert({
      where: { id: supabaseAuthId }, // Utilise l'ID authentifie comme cle primaire
      update: {},
      create: {
        id: supabaseAuthId, // On force Prisma a s'aligner sur l'UUID de Supabase
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        telephone: user.telephone,
      },
    });

    console.log(`[COMPTE] Compte [${user.role}] pour ${user.prenom} ${user.nom} synchronise ! (Mdp: ${user.motDePasse})`);
  }

  console.log('[OK] Seeding termine avec succes et pret pour le login local !');
}

main()
  .catch((e) => {
    console.error('[ERREUR] Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    // Ferme proprement le pool a la fin
    await pool.end();
  });
