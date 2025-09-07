// lib/supabase-browser-client.ts
import { createBrowserClient } from "@supabase/ssr"; // Recommended for Next.js client components
import { generateSupabaseJWT } from "@/actions/serverActions/shared";

// --- Client-side JWT Caching Mechanism ---
let cachedJWT: string | null = null;
let jwtExpiry: number | null = null; // Unix timestamp in milliseconds when the JWT expires
let jwtGenerationPromise: Promise<string> | null = null; // To prevent concurrent calls to generateSupabaseJWT

// The expiry time for the JWT, matching your server-side setting (30 minutes)
const JWT_EXPIRY_DURATION_MS = 20 * 60 * 1000;

/**
 * Fetches a Supabase JWT, either from cache or by generating a new one.
 * It handles caching and prevents concurrent calls to the server action.
 * @returns A Promise that resolves with the Supabase JWT.
 */
async function getCachedOrNewSupabaseJWT(): Promise<string> {
  const now = Date.now();

  // 1. Check if we have a valid cached JWT
  if (cachedJWT && jwtExpiry && now < jwtExpiry) {
    // console.log("Using cached Supabase JWT."); // For debugging
    return cachedJWT;
  }

  // 2. If a JWT is currently being generated, wait for that process to complete
  if (jwtGenerationPromise) {
    // console.log("Waiting for ongoing Supabase JWT generation..."); // For debugging
    return jwtGenerationPromise;
  }

  // 3. No valid cached JWT and no ongoing generation, so initiate a new generation
  // console.log("Initiating new Supabase JWT generation..."); // For debugging
  jwtGenerationPromise = (async () => {
    try {
      const newJWT = await generateSupabaseJWT();

      // Update the cache with the new JWT and its expiry time
      cachedJWT = newJWT;
      // Calculate expiry based on 'now' when the generation started, plus the duration
      jwtExpiry = now + JWT_EXPIRY_DURATION_MS;
      // console.log("New Supabase JWT generated and cached."); // For debugging
      return newJWT;
    } finally {
      // Clear the promise once it resolves or rejects, allowing new generations later
      jwtGenerationPromise = null;
    }
  })();

  return jwtGenerationPromise;
}

/**
 * Creates and returns a Supabase client instance for browser-side usage.
 * It uses a cached or newly generated JWT for authorization.
 * @returns A Supabase client instance.
 */
export const getSupabaseClient = async function () {
  // Get the JWT, utilizing the caching and concurrency-prevention logic
  const supabaseJWT = await getCachedOrNewSupabaseJWT();

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseJWT}`,
        },
      },
    }
  );
};
