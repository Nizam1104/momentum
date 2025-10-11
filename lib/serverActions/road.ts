"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prismaClient";
import type { Road, Milestone, RoadStatus } from "@prisma/client";
import { auth } from "@/lib/auth";

// Road Actions
export async function getRoads(userId: string): Promise<Road[]> {
  try {
    const roads = await prisma.road.findMany({
      where: { userId },
      include: {
        milestones: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return roads;
  } catch (error) {
    console.error("Error fetching roads:", error);
    throw new Error("Failed to fetch roads");
  }
}

export async function getRoadById(id: string): Promise<Road & { milestones: Milestone[] } | null> {
  try {
    const road = await prisma.road.findUnique({
      where: { id },
      include: {
        milestones: {
          orderBy: { order: "asc" },
        },
      },
    });

    return road;
  } catch (error) {
    console.error("Error fetching road:", error);
    throw new Error("Failed to fetch road");
  }
}

export async function createRoad(data: {
  title: string;
  description?: string;
  startDate?: Date;
  dueDate?: Date;
}): Promise<Road> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const road = await prisma.road.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    return road;
  } catch (error) {
    console.error("Error creating road:", error);
    throw new Error("Failed to create road");
  }
}

export async function updateRoad(
  id: string,
  data: {
    title?: string;
    description?: string;
    startDate?: Date;
    dueDate?: Date;
    status?: RoadStatus;
    progress?: number;
    completedAt?: Date;
  }
): Promise<Road> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify ownership
    const existingRoad = await prisma.road.findUnique({
      where: { id },
    });

    if (!existingRoad || existingRoad.userId !== session.user.id) {
      throw new Error("Road not found or unauthorized");
    }

    const road = await prisma.road.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard");
    return road;
  } catch (error) {
    console.error("Error updating road:", error);
    throw new Error("Failed to update road");
  }
}

export async function deleteRoad(id: string): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify ownership
    const existingRoad = await prisma.road.findUnique({
      where: { id },
    });

    if (!existingRoad || existingRoad.userId !== session.user.id) {
      throw new Error("Road not found or unauthorized");
    }

    await prisma.road.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting road:", error);
    throw new Error("Failed to delete road");
  }
}

// Milestone Actions
export async function createMilestone(data: {
  title: string;
  description?: string;
  roadId: string;
  order?: number;
}): Promise<Milestone> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify road ownership
    const road = await prisma.road.findUnique({
      where: { id: data.roadId },
    });

    if (!road || road.userId !== session.user.id) {
      throw new Error("Road not found or unauthorized");
    }

    // If order is not provided, put it at the end
    if (data.order === undefined) {
      const maxOrder = await prisma.milestone.findFirst({
        where: { roadId: data.roadId },
        orderBy: { order: "desc" },
      });
      data.order = maxOrder ? maxOrder.order + 1 : 0;
    }

    const milestone = await prisma.milestone.create({
      data,
    });

    // Update road progress
    await updateRoadProgress(data.roadId);

    revalidatePath("/dashboard");
    return milestone;
  } catch (error) {
    console.error("Error creating milestone:", error);
    throw new Error("Failed to create milestone");
  }
}

export async function updateMilestone(
  id: string,
  data: {
    title?: string;
    description?: string;
    isCompleted?: boolean;
    completedAt?: Date;
    order?: number;
  }
): Promise<Milestone> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Get milestone to verify ownership through road
    const existingMilestone = await prisma.milestone.findUnique({
      where: { id },
      include: { road: true },
    });

    if (!existingMilestone || existingMilestone.road.userId !== session.user.id) {
      throw new Error("Milestone not found or unauthorized");
    }

    // If marking as completed, set completedAt
    if (data.isCompleted && !existingMilestone.isCompleted) {
      data.completedAt = new Date();
    } else if (!data.isCompleted) {
      const date = new Date()
      data.completedAt = date
    }

    const milestone = await prisma.milestone.update({
      where: { id },
      data,
    });

    // Update road progress
    await updateRoadProgress(existingMilestone.roadId);

    revalidatePath("/dashboard");
    return milestone;
  } catch (error) {
    console.error("Error updating milestone:", error);
    throw new Error("Failed to update milestone");
  }
}

export async function deleteMilestone(id: string): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Get milestone to verify ownership through road
    const existingMilestone = await prisma.milestone.findUnique({
      where: { id },
      include: { road: true },
    });

    if (!existingMilestone || existingMilestone.road.userId !== session.user.id) {
      throw new Error("Milestone not found or unauthorized");
    }

    const roadId = existingMilestone.roadId;

    await prisma.milestone.delete({
      where: { id },
    });

    // Update road progress
    await updateRoadProgress(roadId);

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting milestone:", error);
    throw new Error("Failed to delete milestone");
  }
}

// Helper function to update road progress based on completed milestones
async function updateRoadProgress(roadId: string): Promise<void> {
  try {
    const milestones = await prisma.milestone.findMany({
      where: { roadId },
    });

    if (milestones.length === 0) {
      await prisma.road.update({
        where: { id: roadId },
        data: { progress: 0 },
      });
      return;
    }

    const completedCount = milestones.filter((m) => m.isCompleted).length;
    const progress = Math.round((completedCount / milestones.length) * 100);

    const isAllCompleted = completedCount === milestones.length;
    const road = await prisma.road.findUnique({
      where: { id: roadId },
    });

    if (road && road.status !== "COMPLETED" && isAllCompleted) {
      await prisma.road.update({
        where: { id: roadId },
        data: {
          progress,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    } else if (road && road.status === "COMPLETED" && !isAllCompleted) {
      await prisma.road.update({
        where: { id: roadId },
        data: {
          progress,
          status: "ACTIVE",
          completedAt: null,
        },
      });
    } else {
      await prisma.road.update({
        where: { id: roadId },
        data: { progress },
      });
    }
  } catch (error) {
    console.error("Error updating road progress:", error);
  }
}

export async function reorderMilestones(
  roadId: string,
  milestoneIds: string[]
): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify road ownership
    const road = await prisma.road.findUnique({
      where: { id: roadId },
    });

    if (!road || road.userId !== session.user.id) {
      throw new Error("Road not found or unauthorized");
    }

    // Update milestone orders
    await Promise.all(
      milestoneIds.map((milestoneId, index) =>
        prisma.milestone.update({
          where: { id: milestoneId },
          data: { order: index },
        })
      )
    );

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error reordering milestones:", error);
    throw new Error("Failed to reorder milestones");
  }
}

export async function createMilestonesFromJSON(
  roadId: string,
  milestonesData: Array<{ title: string; description?: string }>
): Promise<Milestone[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify road ownership
    const road = await prisma.road.findUnique({
      where: { id: roadId },
    });

    if (!road || road.userId !== session.user.id) {
      throw new Error("Road not found or unauthorized");
    }

    // Validate input data
    if (!Array.isArray(milestonesData) || milestonesData.length === 0) {
      throw new Error("Milestones data must be a non-empty array");
    }

    // Validate each milestone object
    for (const milestone of milestonesData) {
      if (!milestone.title || typeof milestone.title !== 'string' || milestone.title.trim() === '') {
        throw new Error("Each milestone must have a non-empty title");
      }
      if (milestone.description && typeof milestone.description !== 'string') {
        throw new Error("Description must be a string if provided");
      }
    }

    // Get the current max order to place new milestones at the end
    const maxOrder = await prisma.milestone.findFirst({
      where: { roadId },
      orderBy: { order: "desc" },
    });

    let startOrder = maxOrder ? maxOrder.order + 1 : 0;

    // Create milestones with proper order
    const milestones = await Promise.all(
      milestonesData.map((milestoneData, index) =>
        prisma.milestone.create({
          data: {
            title: milestoneData.title.trim(),
            description: milestoneData.description?.trim() || null,
            roadId,
            order: startOrder + index,
          },
        })
      )
    );

    // Update road progress
    await updateRoadProgress(roadId);

    revalidatePath("/dashboard");
    return milestones;
  } catch (error) {
    console.error("Error creating milestones from JSON:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create milestones");
  }
}