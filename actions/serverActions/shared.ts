"use server";
import { auth } from "@/lib/auth";
import jwt from "jsonwebtoken";

export const getSessionUser = async function () {
  const session = await auth();
  return session?.user;
};

// lib/supabase-utils.ts

export async function generateSupabaseJWT(): Promise<string> {
  const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;

  const session = await auth();

  if (!supabaseJwtSecret) {
    throw new Error("SUPABASE_JWT_SECRET is not configured");
  }

  if (session?.user.id) {
    const token = jwt.sign(
      {
        sub: session?.user.id,
        aud: "authenticated",
        role: "authenticated",
        iss: process.env.NEXT_PUBLIC_SUPABASE_URL,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 30, // 1 hour expiry
      },
      supabaseJwtSecret,
      { algorithm: "HS256" },
    );
    return token;
  }

  return "";
}
