// actions/clientActions/categories.ts
"use client";
import { getSupabaseClient } from "@/lib/supabase";
import { ActionResult, Category, Tag } from "./types";
import { nanoid } from "nanoid";

const toCategory = (category: any): Category => {
  return {
    ...category,
    createdAt: new Date(category.createdAt),
    updatedAt: category.updatedAt ? new Date(category.updatedAt) : undefined,
  };
};

const toTag = (tag: any): Tag => {
  return {
    ...tag,
    createdAt: new Date(tag.createdAt),
    updatedAt: tag.updatedAt ? new Date(tag.updatedAt) : undefined,
  };
};

// Category functions
export async function getAllCategories(
  userId: string,
): Promise<ActionResult<Category[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Category")
      .select("*")
      .eq("userId", userId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toCategory) : [] };
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getCategoryById(
  categoryId: string,
): Promise<ActionResult<Category>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Category")
      .select("*")
      .eq("id", categoryId)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toCategory(data) : undefined };
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    return { success: false, error: "Failed to fetch category" };
  }
}

export async function createCategory(
  categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">,
): Promise<ActionResult<Category>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Category")
      .insert({ ...categoryData, id: nanoid() })
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toCategory(data) : undefined };
  } catch (error) {
    console.error("Error in createCategory:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  categoryId: string,
  updates: Partial<Omit<Category, "id" | "createdAt" | "updatedAt" | "userId">>,
): Promise<ActionResult<Category>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Category")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", categoryId)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toCategory(data) : undefined };
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(
  categoryId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();

    // First, set categoryId to null for all related entities
    await Promise.all([
      supabase
        .from("Project")
        .update({ categoryId: null })
        .eq("categoryId", categoryId),
      supabase
        .from("Task")
        .update({ categoryId: null })
        .eq("categoryId", categoryId),
      supabase
        .from("Goal")
        .update({ categoryId: null })
        .eq("categoryId", categoryId),
      supabase
        .from("Note")
        .update({ categoryId: null })
        .eq("categoryId", categoryId),
    ]);

    // Then delete the category
    const { error } = await supabase
      .from("Category")
      .delete()
      .eq("id", categoryId);

    if (error) {
      console.error("Error deleting category:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

// Tag functions
export async function getAllTags(userId: string): Promise<ActionResult<Tag[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Tag")
      .select("*")
      .eq("userId", userId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching tags:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toTag) : [] };
  } catch (error) {
    console.error("Error in getAllTags:", error);
    return { success: false, error: "Failed to fetch tags" };
  }
}

export async function getTagById(tagId: string): Promise<ActionResult<Tag>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Tag")
      .select("*")
      .eq("id", tagId)
      .single();

    if (error) {
      console.error("Error fetching tag:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toTag(data) : undefined };
  } catch (error) {
    console.error("Error in getTagById:", error);
    return { success: false, error: "Failed to fetch tag" };
  }
}

export async function createTag(
  tagData: Omit<Tag, "id" | "createdAt" | "updatedAt">,
): Promise<ActionResult<Tag>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Tag")
      .insert({ ...tagData, id: nanoid() })
      .select()
      .single();

    if (error) {
      console.error("Error creating tag:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toTag(data) : undefined };
  } catch (error) {
    console.error("Error in createTag:", error);
    return { success: false, error: "Failed to create tag" };
  }
}

export async function updateTag(
  tagId: string,
  updates: Partial<Omit<Tag, "id" | "createdAt" | "updatedAt" | "userId">>,
): Promise<ActionResult<Tag>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("Tag")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", tagId)
      .select()
      .single();

    if (error) {
      console.error("Error updating tag:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toTag(data) : undefined };
  } catch (error) {
    console.error("Error in updateTag:", error);
    return { success: false, error: "Failed to update tag" };
  }
}

export async function deleteTag(tagId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();

    // First, delete all tag relationships
    await Promise.all([
      supabase.from("NoteTag").delete().eq("tagId", tagId),
      supabase.from("ProjectTag").delete().eq("tagId", tagId),
      supabase.from("TaskTag").delete().eq("tagId", tagId),
      supabase.from("GoalTag").delete().eq("tagId", tagId),
    ]);

    // Then delete the tag
    const { error } = await supabase.from("Tag").delete().eq("id", tagId);

    if (error) {
      console.error("Error deleting tag:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in deleteTag:", error);
    return { success: false, error: "Failed to delete tag" };
  }
}

// Tag relationship functions
export async function addTagToNote(
  noteId: string,
  tagId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from("NoteTag").insert({ noteId, tagId });

    if (error) {
      console.error("Error adding tag to note:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in addTagToNote:", error);
    return { success: false, error: "Failed to add tag to note" };
  }
}

export async function removeTagFromNote(
  noteId: string,
  tagId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from("NoteTag")
      .delete()
      .eq("noteId", noteId)
      .eq("tagId", tagId);

    if (error) {
      console.error("Error removing tag from note:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in removeTagFromNote:", error);
    return { success: false, error: "Failed to remove tag from note" };
  }
}

export async function addTagToProject(
  projectId: string,
  tagId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from("ProjectTag")
      .insert({ projectId, tagId });

    if (error) {
      console.error("Error adding tag to project:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in addTagToProject:", error);
    return { success: false, error: "Failed to add tag to project" };
  }
}

export async function removeTagFromProject(
  projectId: string,
  tagId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from("ProjectTag")
      .delete()
      .eq("projectId", projectId)
      .eq("tagId", tagId);

    if (error) {
      console.error("Error removing tag from project:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in removeTagFromProject:", error);
    return { success: false, error: "Failed to remove tag from project" };
  }
}

export async function addTagToTask(
  taskId: string,
  tagId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from("TaskTag").insert({ taskId, tagId });

    if (error) {
      console.error("Error adding tag to task:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in addTagToTask:", error);
    return { success: false, error: "Failed to add tag to task" };
  }
}

export async function removeTagFromTask(
  taskId: string,
  tagId: string,
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from("TaskTag")
      .delete()
      .eq("taskId", taskId)
      .eq("tagId", tagId);

    if (error) {
      console.error("Error removing tag from task:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error in removeTagFromTask:", error);
    return { success: false, error: "Failed to remove tag from task" };
  }
}
