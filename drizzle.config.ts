import { DB } from '@/assets/constants'
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/models/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.NODE_ENV === 'production' ? DB.PROD : DB.DEV
  }
} satisfies Config
