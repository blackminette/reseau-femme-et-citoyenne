# Verification de livraison de Milo

Ce document sert de fiche de controle avant et apres la mise en ligne de
Milo. Le terme technique « smoke test » designe ici une verification courte
des parcours critiques, pas une validation complete du projet.

Ce document doit etre execute apres le deploiement sur la vraie URL de
production. Il ne contient aucun identifiant ni secret. Le responsable du
deploiement doit remplacer uniquement la valeur de `$baseUrl` par l URL HTTPS
officielle fournie par l equipe.

## 1. Conditions necessaires

Ne pas lancer ce test avec `localhost` si l objectif est de valider la
production. La cible doit executer Next.js cote serveur et disposer des
variables suivantes cote serveur :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` si une valeur particuliere est utilisee
- `MILO_TRUSTED_ORIGIN`, avec l URL HTTPS publique exacte du site, par exemple
  `https://www.exemple.fr`

La cle Gemini ne doit jamais etre ajoutee a une variable `NEXT_PUBLIC_*`, a un
commit ou a un log.

## 2. Controles HTTP sans connexion

Executer dans PowerShell. La commande ne renvoie que le statut et la cible de
redirection, pas les cookies ni les autres en-tetes :

```powershell
$baseUrl = "https://URL-DE-PRODUCTION-A-REMPLACER"

$assistantHeaders = curl.exe -sS -D - -o NUL "$baseUrl/assistant.html"
$assistantStatus = ($assistantHeaders | Select-String '^HTTP/' | Select-Object -Last 1).ToString()
$assistantLocation = ($assistantHeaders | Select-String '^location:' | Select-Object -Last 1).ToString()

if ($assistantStatus -notmatch '307') {
  throw "La redirection assistant.html est inattendue."
}

if ($assistantLocation -notmatch '/enfant/assistant') {
  throw "La cible de redirection est inattendue."
}

$legacyChildPages = @(
  '/ateliers-enfant.html', '/badges-enfant.html', '/espace-enfant.html',
  '/exercice.html', '/gestion-enfant.html', '/lecon.html', '/module.html',
  '/profil-enfant.html', '/quiz.html', '/video.html'
)

foreach ($path in $legacyChildPages) {
  $headers = curl.exe -sS -D - -o NUL "$baseUrl$path"
  $status = ($headers | Select-String '^HTTP/' | Select-Object -Last 1).ToString()
  $location = ($headers | Select-String '^location:' | Select-Object -Last 1).ToString()
  if ($status -notmatch '307' -or $location -notmatch '/enfant') {
    throw "La maquette historique $path reste accessible directement."
  }
}

$unauthStatus = curl.exe -sS -o NUL -w "%{http_code}" `
  -X POST `
  -H "Content-Type: application/json" `
  --data '{"message":"Bonjour Milo"}' `
  "$baseUrl/api/ai-chat"

if ($unauthStatus -ne "401") {
  throw "Le statut sans session est inattendu : $unauthStatus"
}
```

Resultats attendus :

- `/assistant.html` redirige vers `/enfant/assistant` ;
- les anciennes maquettes enfant redirigent vers `/enfant` ;
- l API refuse une requete sans session avec `401` ;
- aucune cle, cookie ou erreur interne n apparait dans la sortie.

## 3. Verification dans le navigateur

Utiliser un compte enfant de test fourni par l equipe. Ne jamais inscrire son
mot de passe dans ce document.

1. Ouvrir `/login`.
2. Se connecter avec le compte enfant de test.
3. Ouvrir `/enfant/assistant` ou le bouton Milo depuis `/enfant`.
4. Envoyer une question pedagogique connue.
5. Verifier qu une reponse est affichee sans erreur console.
6. Envoyer une question inconnue avec Gemini active et verifier la reponse.
7. Desactiver temporairement la cle Gemini dans l environnement de test et
   verifier qu une reponse de secours est affichee.
8. Ajouter temporairement `{` dans la cle `sessionStorage` de l historique,
   recharger la page et verifier que le widget reste utilisable.
9. Se deconnecter puis verifier qu une nouvelle requete API est refusee.

## 4. Criteres de validation

| Controle | Resultat attendu |
| --- | --- |
| Redirection de la page historique | `307` vers `/enfant/assistant` |
| Maquettes enfant historiques | `307` vers `/enfant` |
| API sans session | `401` |
| Origine web etrangere | `403` |
| Session enfant valide | Reponse Milo affichee |
| Gemini indisponible | Reponse pedagogique de secours |
| Historique invalide | Widget utilisable apres rechargement |
| Erreur serveur | Aucun secret ni detail interne affiche |
| Rate limit | `429` apres le seuil documente |

Un seul resultat inattendu bloque la validation de production. Il faut
conserver la date, l URL, le commit deploye, le resultat de chaque controle et
une capture non sensible si une anomalie est rencontree. Le rapport doit
indiquer clairement « valide », « bloque » ou « non teste » pour chaque ligne.

## 5. Procedure de retour arriere

Si Milo provoque une regression :

1. interrompre la livraison en cours ;
2. noter le commit deploye et l erreur exacte ;
3. redeployer la derniere version stable validee ;
4. verifier `/login`, `/enfant` et les routes API principales ;
5. creer une branche corrective et une nouvelle pull request, sans push force ;
6. ne pas modifier la base de production pour contourner un bug applicatif.

Le retour arriere doit etre valide par le responsable du deploiement. Cette PR
ne contient pas de migration de production.
