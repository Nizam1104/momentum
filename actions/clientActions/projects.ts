// actions/clientActions/projects.ts
"use client";
import { getSupabaseClient } from "@/lib/supabase";
import { ActionResult, Project, ProjectStatus } from "./types";
import { nanoid } from "nanoid";

const toProject = (project: any): Project => {
    return {
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: project.updatedAt ? new Date(project.updatedAt) : undefined,
        startDate: project.startDate ? new Date(project.startDate) : undefined,
        dueDate: project.dueDate ? new Date(project.dueDate) : undefined,
        completedAt: project.completedAt ? new Date(project.completedAt) : undefined,
    };
};

export async function getAllProjects(
  userId: string,
): Promise<ActionResult<Project[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toProject) : [] };
  } catch (error) {
    console.error("Error in getAllProjects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function getProjectById(
  projectId: string,
): Promise<ActionResult<Project>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toProject(data) : undefined };
  } catch (error) {
    console.error("Error in getProjectById:", error);
    return { success: false, error: "Failed to fetch project" };
  }
}

export async function createProject(
  projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "progress">,
): Promise<ActionResult<Project>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Project")
      .insert({
        ...projectData,
        id: nanoid(),
        progress: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toProject(data) : undefined };
  } catch (error) {
    console.error("Error in createProject:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">>,
): Promise<ActionResult<Project>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Project")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      console.error("Error updating project:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toProject(data) : undefined };
  } catch (error) {
    console.error("Error in updateProject:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(
  projectId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();

    // First delete all tasks associated with this project
    await supabase.from("Task").delete().eq("projectId", projectId);

    // Then delete the project
    const { error } = await supabase
      .from("Project")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Error deleting project:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in deleteProject:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function getSubProjects(
  parentId: string,
): Promise<ActionResult<Project[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .eq("parentId", parentId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching sub-projects:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toProject) : [] };
  } catch (error) {
    console.error("Error in getSubProjects:", error);
    return { success: false, error: "Failed to fetch sub-projects" };
  }
}

export async function updateProjectProgress(
  projectId: string,
  progress: number,
): Promise<ActionResult<Project>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Project")
      .update({
        progress: Math.max(0, Math.min(100, progress)), // Ensure progress is between 0-100
        updatedAt: new Date().toISOString(),
        ...(progress === 100 && {
          completedAt: new Date().toISOString(),
          status: ProjectStatus.COMPLETED,
        }),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      console.error("Error updating project progress:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toProject(data) : undefined };
  } catch (error) {
    console.error("Error in updateProjectProgress:", error);
    return { success: false, error: "Failed to update project progress" };
  }
}

export async function getProjectsByStatus(
  userId: string,
  status: ProjectStatus,
): Promise<ActionResult<Project[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .eq("userId", userId)
      .eq("status", status)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching projects by status:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toProject) : [] };
  } catch (error) {
    console.error("Error in getProjectsByStatus:", error);
    return { success: false, error: "Failed to fetch projects by status" };
  }
}

export async function getProjectsByCategory(
  categoryId: string,
): Promise<ActionResult<Project[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .eq("categoryId", categoryId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching projects by category:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toProject) : [] };
  } catch (error) {
    console.error("Error in getProjectsByCategory:", error);
    return { success: false, error: "Failed to fetch projects by category" };
  }
}