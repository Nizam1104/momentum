"use client"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

import { splash } from "@/actions/app"

export default function AppInitialiser({ children }: { children: React.ReactNode }) {

  const { data: session } = useSession()

  useEffect(() => {
    async function start() {
      
      if (session?.user) {
        const userId = session.user?.id || null
        splash({userId})
      }
    }
    start()
  }, [session?.user])

  return (
    children
  )
}
