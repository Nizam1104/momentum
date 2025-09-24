import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prismaClient"
import { validateUserId } from "@/lib/serverActions/shared"

export async function GET(request: NextRequest) {

  try {
    const session = await auth()
  const userId = await validateUserId(request, session?.user.id || '')
  
  const dbUser = await prisma.user.findUnique({
    where: {
      id: userId || ''
    }
  })

  return NextResponse.json(dbUser)
  } catch (error: unknown) {
    return NextResponse.json({error: error instanceof Error ? error.message : 'Unknown error'}, { status: 500 })
  }
}
