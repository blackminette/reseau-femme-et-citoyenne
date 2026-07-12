import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// On lit .env.local (le même fichier que Next.js et le seed)
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});