This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Intégration HelloAsso & Webhooks

Pour que les dons effectués via le formulaire HelloAsso soient automatiquement enregistrés en base de données, il est nécessaire de configurer un webhook dans votre espace HelloAsso.

### Configuration du Webhook HelloAsso :
1. Connectez-vous à votre compte **HelloAsso**.
2. Rendez-vous dans **Mon compte** ➔ **Intégrations et API** ➔ **Webhooks**.
3. Ajoutez une nouvelle URL de webhook pointant vers votre endpoint de production :
   ```
   https://<votre-domaine-de-production>.com/api/webhooks/helloasso
   ```
4. Sélectionnez l'événement à notifier : **Paiement** (Payment).
5. Sauvegardez la configuration.

Désormais, à chaque transaction réussie sur HelloAsso, les détails du donateur et du paiement seront synchronisés en base de données PostgreSQL/Supabase.
