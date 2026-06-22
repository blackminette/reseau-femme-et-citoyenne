# Actualites RFC06

## Objectif

La page publique `/actualites` affiche les actualites de l’association dans une mise en page simple et lisible.

## Donnees utilisees

La page lit les donnees depuis la table Prisma `Actualite`.

Champs utilises :

- `titre`
- `tag`
- `datePublication`
- `extrait`
- `ctaLabel`
- `ctaHref`
- `ordre`
- `estPublic`

## Seed de test

Le fichier `prisma/seed.ts` alimente la base avec 4 actualites de test.

Ce seed sert a :

- verifier que la page affiche bien des donnees ;
- tester l’ordre d’affichage ;
- verifier les titres, dates, extraits et boutons ;
- eviter une page vide pendant les tests locaux ;
- reproduire rapidement un jeu de donnees connu apres installation ou reset.

## Verification de la page

Pour verifier que la partie actualites fonctionne :

1. lancer le seed ;
2. verifier que la table `Actualite` contient des lignes ;
3. ouvrir `http://localhost:3000/actualites` ;
4. confirmer que les cartes s’affichent sans erreur.

Commande seed :

```powershell
npx prisma db seed
```

Controle Prisma :

```powershell
@'
import 'dotenv/config';
import { prisma } from './src/lib/prisma';

(async () => {
  const count = await prisma.actualite.count();
  const rows = await prisma.actualite.findMany({
    orderBy: [{ ordre: 'asc' }, { datePublication: 'desc' }, { id: 'asc' }],
    select: {
      id: true,
      titre: true,
      tag: true,
      estPublic: true,
      ordre: true,
    },
  });

  console.log(JSON.stringify({ count, rows }, null, 2));
})().finally(async () => {
  await prisma.$disconnect();
});
'@ | npx tsx -
```

## Ce qui a ete mis en place

- une table Prisma `Actualite` ;
- une migration pour cette table ;
- un seed de test pour la table ;
- une page publique branchee sur les donnees ;
- des actions admin pour gerer les actualites ;
- un fallback local si la lecture base echoue.

## Point de controle

La verification correcte consiste a prouver que :

- les donnees existent en base ;
- Prisma les lit correctement ;
- la page `/actualites` les affiche.
