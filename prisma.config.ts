import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

const isMigrationCommand = process.argv.some(arg => arg.includes('migrate') || arg.includes('db'));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: isMigrationCommand ? env('DIRECT_URL') : env('DATABASE_URL'),
  },
});