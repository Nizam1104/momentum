import { getSupabaseClient } from "@/lib/supabase";
import {
  LearningTopic,
  LearningConcept,
  LearningTopicStatus,
  LearningConceptStatus,
  Note,
  NoteType,
} from "@/types/states";

import { nanoid } from "nanoid";

// Learning Topic Actions
export async function fetchLearningTopics(
  userId: string,
): Promise<LearningTopic[]> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("LearningTopic")
    .select(
      `
      *,
      concepts:LearningConcept(*,
        notes:Note(*)
      )
    `,
    )
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching learning topics:", error);
    throw new Error(`Failed to fetch learning topics: ${error.message}`);
  }

  return (
    data?.map((topic) => ({
      ...topic,
      createdAt: new Date(topic.createdAt),
      updatedAt: topic.updatedAt ? new Date(topic.updatedAt) : null,
      startDate: topic.startDate ? new Date(topic.startDate) : null,
      targetDate: topic.targetDate ? new Date(topic.targetDate) : null,
      completedAt: topic.completedAt ? new Date(topic.completedAt) : null,
      concepts:
        topic.concepts?.map((concept: any) => ({
          ...concept,
          createdAt: new Date(concept.createdAt),
          updatedAt: concept.updatedAt ? new Date(concept.updatedAt) : null,
          startDate: concept.startDate ? new Date(concept.startDate) : null,
          completedAt: concept.completedAt
            ? new Date(concept.completedAt)
            : null,
          resources: concept.resources || [],
          notes: concept.notes || [],
        })) || [],
    })) || []
  );
}

export async function createLearningTopic(
  topicData: Omit<LearningTopic, "id" | "createdAt" | "updatedAt" | "concepts">,
): Promise<LearningTopic> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("LearningTopic")
    .insert({ ...topicData, id: nanoid() })
    .select()
    .single();

  if (error) {
    console.error("Error creating learning topic:", error);
    throw new Error(`Failed to create learning topic: ${error.message}`);
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    startDate: data.startDate ? new Date(data.startDate) : null,
    targetDate: data.targetDate ? new Date(data.targetDate) : null,
    completedAt: data.completedAt ? new Date(data.completedAt) : null,
    concepts: [],
  };
}

export async function updateLearningTopic(
  topicId: string,
  updates: Partial<
    Omit<LearningTopic, "id" | "createdAt" | "updatedAt" | "concepts">
  >,
): Promise<LearningTopic> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("LearningTopic")
    .update(updates)
    .eq("id", topicId)
    .select()
    .single();

  if (error) {
    console.error("Error updating learning topic:", error);
    throw new Error(`Failed to update learning topic: ${error.message}`);
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    startDate: data.startDate ? new Date(data.startDate) : null,
    targetDate: data.targetDate ? new Date(data.targetDate) : null,
    completedAt: data.completedAt ? new Date(data.completedAt) : null,
  };
}

export async function deleteLearningTopic(topicId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from("LearningTopic")
    .delete()
    .eq("id", topicId);

  if (error) {
    console.error("Error deleting learning topic:", error);
    throw new Error(`Failed to delete learning topic: ${error.message}`);
  }
}

// Learning Concept Actions
export async function fetchLearningConcepts(
  topicId: string,
): Promise<LearningConcept[]> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("LearningConcept")
    .select(
      `
      *,
      notes:Note(*)
    `,
    )
    .eq("topicId", topicId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching learning concepts:", error);
    throw new Error(`Failed to fetch learning concepts: ${error.message}`);
  }

  return (
    data?.map((concept) => ({
      ...concept,
      createdAt: new Date(concept.createdAt),
      updatedAt: concept.updatedAt ? new Date(concept.updatedAt) : null,
      startDate: concept.startDate ? new Date(concept.startDate) : null,
      completedAt: concept.completedAt ? new Date(concept.completedAt) : null,
      resources: concept.resources || [],
      notes: concept.notes || [],
    })) || []
  );
}

export async function createLearningConcept(
  conceptData: Omit<LearningConcept, "id" | "createdAt" | "updatedAt">,
): Promise<LearningConcept> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("LearningConcept")
    .insert({ ...conceptData, id: nanoid() })
    .select(
      `
      *,
      notes:Note(*)
    `,
    )
    .single();

  if (error) {
    console.error("Error creating learning concept:", error);
    throw new Error(`Failed to create learning concept: ${error.message}`);
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    startDate: data.startDate ? new Date(data.startDate) : null,
    completedAt: data.completedAt ? new Date(data.completedAt) : null,
    resources: data.resources || [],
    notes: data.notes || [],
  };
}

export async function updateLearningConcept(
  conceptId: string,
  updates: Partial<Omit<LearningConcept, "id" | "createdAt" | "updatedAt">>,
): Promise<LearningConcept> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("LearningConcept")
    .update(updates)
    .eq("id", conceptId)
    .select(
      `
      *,
      notes:Note(*)
    `,
    )
    .single();

  if (error) {
    console.error("Error updating learning concept:", error);
    throw new Error(`Failed to update learning concept: ${error.message}`);
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    startDate: data.startDate ? new Date(data.startDate) : null,
    completedAt: data.completedAt ? new Date(data.completedAt) : null,
    resources: data.resources || [],
    notes: data.notes || [],
  };
}

export async function deleteLearningConcept(conceptId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase
    .from("LearningConcept")
    .delete()
    .eq("id", conceptId);

  if (error) {
    console.error("Error deleting learning concept:", error);
    throw new Error(`Failed to delete learning concept: ${error.message}`);
  }
}

// Bulk operations
export async function fetchUserLearningData(userId: string): Promise<{
  topics: LearningTopic[];
  concepts: LearningConcept[];
}> {
  const topics = await fetchLearningTopics(userId);

  // Get all concepts for all topics
  const allConcepts: LearningConcept[] = [];
  for (const topic of topics) {
    const concepts = await fetchLearningConcepts(topic.id);
    allConcepts.push(...concepts);
  }

  return { topics, concepts: allConcepts };
}

// Statistics and analytics
export async function getLearningStats(userId: string): Promise<{
  totalTopics: number;
  activeTopics: number;
  completedTopics: number;
  totalConcepts: number;
  completedConcepts: number;
  totalHoursSpent: number;
  averageProgress: number;
}> {
  const { topics, concepts } = await fetchUserLearningData(userId);

  const totalTopics = topics.length;
  const activeTopics = topics.filter(
    (t) => t.status === LearningTopicStatus.ACTIVE,
  ).length;
  const completedTopics = topics.filter(
    (t) => t.status === LearningTopicStatus.COMPLETED,
  ).length;

  const totalConcepts = concepts.length;
  const completedConcepts = concepts.filter(
    (c) =>
      c.status === LearningConceptStatus.COMPLETED ||
      c.status === LearningConceptStatus.MASTERED,
  ).length;

  const totalHoursSpent = concepts.reduce(
    (sum, concept) => sum + (concept.timeSpent || 0),
    0,
  );
  const averageProgress =
    totalTopics > 0
      ? topics.reduce((sum, topic) => sum + topic.progress, 0) / totalTopics
      : 0;

  return {
    totalTopics,
    activeTopics,
    completedTopics,
    totalConcepts,
    completedConcepts,
    totalHoursSpent,
    averageProgress,
  };
}

// Note Management for Learning Concepts
export async function createConceptNote(
  userId: string,
  conceptId: string,
  noteData: {
    title?: string;
    content: string;
    type?: NoteType;
  },
): Promise<Note> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("Note")
    .insert({
      id: nanoid(),
      userId,
      conceptId,
      title: noteData.title,
      content: noteData.content,
      type: noteData.type || NoteType.LEARNING,
      isPinned: false,
      isArchived: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating concept note:", error);
    throw new Error(`Failed to create concept note: ${error.message}`);
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
  };
}

export async function fetchConceptNotes(conceptId: string): Promise<Note[]> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("Note")
    .select("*")
    .eq("conceptId", conceptId)
    .eq("isArchived", false)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching concept notes:", error);
    throw new Error(`Failed to fetch concept notes: ${error.message}`);
  }

  return (
    data?.map((note) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: note.updatedAt ? new Date(note.updatedAt) : null,
    })) || []
  );
}

export async function updateConceptNote(
  noteId: string,
  updates: Partial<{
    title?: string;
    content: string;
    type: NoteType;
    isPinned: boolean;
  }>,
): Promise<Note> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("Note")
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    console.error("Error updating concept note:", error);
    throw new Error(`Failed to update concept note: ${error.message}`);
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
  };
}

export async function deleteConceptNote(noteId: string): Promise<void> {
  const supabase = await getSupabaseClient();

  const { error } = await supabase.from("Note").delete().eq("id", noteId);

  if (error) {
    console.error("Error deleting concept note:", error);
    throw new Error(`Failed to delete concept note: ${error.message}`);
  }
}

export async function archiveConceptNote(noteId: string): Promise<Note> {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase
    .from("Note")
    .update({
      isArchived: true,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    console.error("Error archiving concept note:", error);
    throw new Error(`Failed to archive concept note: ${error.message}`);
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
  };
}
