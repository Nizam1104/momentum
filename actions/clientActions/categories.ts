// actions/clientActions/categories.ts
"use client";
import { getSupabaseClient } from "@/lib/supabase";
import { ActionResult, Category } from "./types";
import { nanoid } from "nanoid";

const toCategory = (category: any): Category => {
  return {
    ...category,
    createdAt: new Date(category.createdAt),
    updatedAt: category.updatedAt ? new Date(category.updatedAt) : undefined,
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