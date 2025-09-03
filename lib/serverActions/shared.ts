"use server"

import { NextRequest, NextResponse } from "next/server";

export const validateUserId = async function(req: NextRequest, userId: string) {
    const { searchParams } = new URL(req.nextUrl)
    const queryUId = searchParams.get('user_id')
    if(queryUId !== userId) {
        throw new Error('permission denied')
    }
    return queryUId
}
