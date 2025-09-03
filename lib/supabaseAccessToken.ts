// lib/supabase-utils.ts
import jwt from 'jsonwebtoken'

export function generateSupabaseJWT(userId: string): string {
  const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET
  
  if (!supabaseJwtSecret) {
    throw new Error('SUPABASE_JWT_SECRET is not configured')
  }
  
  return jwt.sign(
    {
      sub: userId,
      aud: 'authenticated',
      role: 'authenticated',
      iss: process.env.NEXT_PUBLIC_SUPABASE_URL,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 5), // 1 hour expiry
    },
    supabaseJwtSecret,
    { algorithm: 'HS256' }
  )
}
