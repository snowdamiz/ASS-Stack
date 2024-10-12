/// <reference path="../.astro/types.d.ts" />
declare module "better-sqlite3";

interface Session {
	id: string;
	expires_at: number;
	user_id: string;
}

interface User {
	id: string;
	email: string;
	password_hash: string;
	created_at: number;
	updated_at: number;
}

declare namespace App {
	interface Locals extends Record<string, any> {
		session: Session | null
		user: User | null
	}	
}