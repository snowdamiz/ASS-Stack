import { defineMiddleware } from "astro/middleware"
import { getDb } from "@/utils/db"
import { sessions, users } from "@/models/schema"
import { eq } from "drizzle-orm"
import { verifyRequestOrigin } from "@/lib/helpers"

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.method !== "GET") {
    const originHeader = context.request.headers.get("Origin")
    const hostHeader = context.request.headers.get("Host")
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return new Response(null, { status: 403 })
    }
  }

  // Use your session cookie name, e.g., "session"
  const sessionId = context.cookies.get("session")?.value ?? null
  if (!sessionId) {
    context.locals.user = null
    context.locals.session = null
    return next()
  }

  const db = getDb()

  // Retrieve the session from the database
  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1)
    .execute()
    .then((res) => res[0])

    // Session is invalid or expired
  if (!session || session.expires_at < Date.now()) {
    context.cookies.delete("session")
    context.locals.user = null
    context.locals.session = null
    return next()
  }

  // Retrieve the user associated with the session
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user_id))
    .limit(1)
    .execute()
    .then((res) => res[0])

  if (!user) {
    context.locals.user = null
    context.locals.session = null
    return next();
  }

  // Optionally refresh the session cookie expiration
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000
  context.cookies.set("session", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  })

  context.locals.session = session
  context.locals.user = user
  return next()
});
