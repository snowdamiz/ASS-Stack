import type { InferSelectModel } from 'drizzle-orm'
import { users, sessions } from './schema.ts'

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;

export interface SqliteError {
  code: string;
  errno: number;
  sql?: string;
}