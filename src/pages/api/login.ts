import type { APIContext } from "astro"
import { verify } from "@node-rs/argon2"
import { randomBytes } from "crypto"
import { getDb } from "@/utils/db"
import { sessions, users } from "@/models/schema"
import { eq } from "drizzle-orm"

export async function POST(context: APIContext): Promise<Response> {
  try {
    const db = getDb()

    const formData = await context.request.formData()
    const email = formData.get("email")
    const password = formData.get("password")

    if (typeof email !== "string" || typeof password !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400 }
      )
    }

    // Check if user exists and has a password_hash
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .execute()
      .then((res) => res[0])

    if (!existingUser || !existingUser.password_hash) {
      return new Response(
        JSON.stringify({ error: "Incorrect email or password" }),
        { status: 400 }
      )
    }

    // Verify the password
    const validPassword = await verify(
      existingUser.password_hash,
      password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }
    )

    // Return error if password is incorrect
    if (!validPassword) {
      return new Response(
        JSON.stringify({ error: "Incorrect email or password" }),
        { status: 400 }
      )
    }

    // Create a new session
    const sessionId = randomBytes(32).toString("hex")

    // Set session expiration time (e.g., 30 days from now)
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

    // Insert the new session into the database
    await db.insert(sessions).values({
      id: sessionId,
      user_id: existingUser.id,
      expires_at: expiresAt,
    })

    // Set the session cookie
    context.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: "lax",
      expires: new Date(expiresAt),
      path: "/",
    })

    return new Response();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    )
  }
}
