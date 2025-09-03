// lib/supabase-client.ts
import { auth } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"
import { generateSupabaseJWT } from "@/lib/supabaseAccessToken"

export async function getSupabaseClient() {
  const session = await auth()
  
  if (!session?.user?.id) {
    // Return client without auth for unauthenticated requests
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  
  // Generate JWT only when needed
  const supabaseJWT = generateSupabaseJWT(session.user.id)
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { 
        headers: { 
          Authorization: `Bearer ${supabaseJWT}` 
        } 
      },
    }
  )
}
