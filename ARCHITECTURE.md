# Arborescence des fichiers 


RESEAU-FEMME-ET-CITOYENNE/
├── prisma/               # Modèles de données et migrations
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app/              # Routes (App Router Next.js)
│   │   ├── (app-avec-header)/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/       # Composants UI
│   │   ├── Header.tsx
│   │   └── UserDropdown.tsx
│   ├── generated/        # Code généré (ex: Prisma Client)
│   ├── services/         # Logique métier et appels API
│   └── types/            # Définitions des types TypeScript
├── .env                  # Variables d'environnement
├── middleware.ts         # Protection des routes
└── ...                   # Fichiers de configuration (next.config.ts, etc.)
