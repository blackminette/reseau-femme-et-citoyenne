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

// Initialise Prisma avec l'adaptateur exigÃ© par la v7
const prisma = new PrismaClient({ adapter });

// Initialisation du client Supabase avec la clÃ© d'administration (Service Role Key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('ðŸŒ± (Seeding) DÃ©but de la synchronisation Supabase + Prisma...');

  // 1. Liste de tous les comptes de test (un par rÃ´le) avec mot de passe gÃ©nÃ©rique
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
      prenom: 'ChloÃ©',
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

  // 2. Boucle pour crÃ©er sur Supabase Auth ET synchroniser dans Prisma via l'UUID gÃ©nÃ©rÃ©
  for (const user of utilisateursDeTest) {
    let supabaseAuthId: string;

    // A. CrÃ©ation/VÃ©rification du compte dans Supabase Auth (Sans envoi d'email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.motDePasse,
      email_confirm: true // Valide le compte d'office pour Ã©viter le blocage au login
    });

    if (authError) {
      // Si l'utilisateur existe dÃ©jÃ  sur Supabase Auth, on rÃ©cupÃ¨re simplement son UUID existant
      if (authError.message.includes('already exists') || authError.message.includes('email_exists')) {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const userExistant = listData?.users.find(u => u.email === user.email);
        
        if (!userExistant) {
          console.error(`âŒ Impossible de rÃ©cupÃ©rer l'UUID existant pour ${user.email}`);
          continue;
        }
        supabaseAuthId = userExistant.id;
      } else {
        console.error(`âŒ Erreur Supabase Auth pour ${user.email}:`, authError.message);
        continue;
      }
    } else {
      // Si la crÃ©ation est neuve, on extrait l'UUID gÃ©nÃ©rÃ© par Supabase
      supabaseAuthId = authData.user.id;
    }

    // B. ExÃ©cution de l'upsert Prisma indexÃ© sur cet UUID
    await prisma.utilisateur.upsert({
      where: { id: supabaseAuthId }, // Utilise l'ID authentifiÃ© comme clÃ© primaire
      update: {}, 
      create: {
        id: supabaseAuthId, // On force Prisma Ã  s'aligner sur l'UUID de Supabase
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        telephone: user.telephone,
      },
    });

    console.log(`ðŸ‘¤ Compte [${user.role}] pour ${user.prenom} ${user.nom} synchronisÃ© ! (Mdp: ${user.motDePasse})`);
  }

  console.log('âœ… Seeding terminÃ© avec succÃ¨s et prÃªt pour le login local !');
}

main()
  .catch((e) => {
    console.error('âŒ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    // Ferme proprement le pool Ã  la fin
    await pool.end();
  });