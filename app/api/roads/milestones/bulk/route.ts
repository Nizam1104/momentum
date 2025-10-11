import { NextRequest, NextResponse } from "next/server";
import { createMilestonesFromJSON } from "@/lib/serverActions/road";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roadId, milestones } = body;

    if (!roadId || !milestones) {
      return NextResponse.json(
        { error: "roadId and milestones are required" },
        { status: 400 }
      );
    }

    const result = await createMilestonesFromJSON(roadId, milestones);

    return NextResponse.json({
      success: true,
      milestones: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Bulk milestones API error:", error);

    const message = error instanceof Error ? error.message : "Failed to create milestones";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}