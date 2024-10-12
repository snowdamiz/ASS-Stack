import { Lucia } from "lucia"
import { getDb } from "@/utils/db"
import { type User } from "@/models/types"
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite"

const db = getDb()

const adapter = new BetterSqlite3Adapter(db, {
	user: "user",
	session: "session"
})

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: import.meta.env.PROD
		}
	},
	getUserAttributes: (attributes) => ({
		email: attributes.email
	})
})

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: Omit<User, "id">
	}
}