import type { APIContext } from "astro"
import { randomBytes } from "crypto"
import { hash } from "@node-rs/argon2"
import { getDb } from "@/utils/db"
import { users, sessions } from "@/models/schema"

export async function POST(context: APIContext): Promise<Response> {
  const db = getDb()

  try {
    const formData = await context.request.formData()

    // Validate email
    const email = formData.get("email")
    if (typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
      })
    }

    // Validate password
    const password = formData.get("password")
    if (typeof password !== "string") {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 400,
      })
    }

    // Hash the password
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    // Generate a unique user ID
    const userId = randomBytes(15).toString("hex")

    try {
      // Insert the new user into the database
      await db
        .insert(users)
        .values({
          id: userId,
          email,
          password_hash: passwordHash,
          created_at: Date.now(),
          updated_at: Date.now(),
        })

      // Create a new session
      const sessionId = randomBytes(32).toString("hex")

      // Set session expiration time (e.g., 30 days from now)
      const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

      // Insert the new session into the database
      await db.insert(sessions).values({
        id: sessionId,
        user_id: userId,
        expires_at: expiresAt,
      })

      // Set the session cookie
      context.cookies.set("session", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: new Date(expiresAt),
        path: "/",
      })

      return new Response()
    } catch (e: any) {
      if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return new Response(
          JSON.stringify({ error: "Email already used" }),
          { status: 400 }
        )
      }

      return new Response(
        JSON.stringify({ error: "An unknown error occurred" }),
        { status: 500 }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    )
  }
}
