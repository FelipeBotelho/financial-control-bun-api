import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

console.log('EEENV', env.DATABASE_URL)
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
})
