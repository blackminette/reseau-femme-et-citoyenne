// * src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
} else {
    // Configure le pool de connexion PostgreSQL natif comme dans le seed
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL
    });
    const adapter = new PrismaPg(pool);

    // Initialise Prisma avec l'adaptateur requis
    prismaInstance = new PrismaClient({ adapter });

    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance;
    }
}

export const prisma = prismaInstance;