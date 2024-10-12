import type { APIContext } from "astro"
import { getDb } from "@/utils/db"
import { sessions } from "@/models/schema"
import { eq } from "drizzle-orm"

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    })
  }

  const db = getDb()

  try {
    await db
      .delete(sessions)
      .where(eq(sessions.id, context.locals.session.id))
      .execute()

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    )
  }

  // Clear the session cookie
  context.cookies.delete("session", {
    path: "/",
  })

  return new Response()
}
