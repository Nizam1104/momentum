// actions/clientActions/notes.ts
"use client";
import { getSupabaseClient } from '@/lib/supabase';
import { ActionResult, Note, NoteType } from './types';
import { nanoid } from 'nanoid';

const toNote = (note: any): Note => {
    return {
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined,
    };
};

export async function getAllNotes(userId: string): Promise<ActionResult<Note[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .select(`
        *,
        day:Day(userId)
      `)
      .or(`dayId.is.null,day.userId.eq.${userId}`)
      .eq('isArchived', false)
      .order('isPinned', { ascending: false })
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toNote) : [] };
  } catch (error) {
    console.error('Error in getAllNotes:', error);
    return { success: false, error: 'Failed to fetch notes' };
  }
}

export async function getNotesByDay(dayId: string): Promise<ActionResult<Note[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .select('*')
      .eq('dayId', dayId)
      .eq('isArchived', false)
      .order('isPinned', { ascending: false })
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching notes by day:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toNote) : [] };
  } catch (error) {
    console.error('Error in getNotesByDay:', error);
    return { success: false, error: 'Failed to fetch notes by day' };
  }
}

export async function getNotesByProject(projectId: string): Promise<ActionResult<Note[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .select('*')
      .eq('projectId', projectId)
      .eq('isArchived', false)
      .order('isPinned', { ascending: false })
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching notes by project:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toNote) : [] };
  } catch (error) {
    console.error('Error in getNotesByProject:', error);
    return { success: false, error: 'Failed to fetch notes by project' };
  }
}

export async function getNoteById(noteId: string): Promise<ActionResult<Note>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .select('*')
      .eq('id', noteId)
      .single();

    if (error) {
      console.error('Error fetching note:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toNote(data) : undefined };
  } catch (error) {
    console.error('Error in getNoteById:', error);
    return { success: false, error: 'Failed to fetch note' };
  }
}

export async function createNote(
  noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<Note>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .insert({ ...noteData, id: nanoid() })
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toNote(data) : undefined };
  } catch (error) {
    console.error('Error in createNote:', error);
    return { success: false, error: 'Failed to create note' };
  }
}

export async function updateNote(
  noteId: string,
  updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ActionResult<Note>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toNote(data) : undefined };
  } catch (error) {
    console.error('Error in updateNote:', error);
    return { success: false, error: 'Failed to update note' };
  }
}

export async function deleteNote(noteId: string): Promise<ActionResult<boolean>> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from('Note')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting note:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('Error in deleteNote:', error);
    return { success: false, error: 'Failed to delete note' };
  }
}

export async function toggleNotePin(noteId: string): Promise<ActionResult<Note>> {
  try {
    const supabase = await getSupabaseClient();
    
    // First get the current pin status
    const { data: currentNote } = await supabase
      .from('Note')
      .select('isPinned')
      .eq('id', noteId)
      .single();

    if (!currentNote) {
      return { success: false, error: 'Note not found' };
    }

    const { data, error } = await supabase
      .from('Note')
      .update({
        isPinned: !currentNote.isPinned,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling note pin:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toNote(data) : undefined };
  } catch (error) {
    console.error('Error in toggleNotePin:', error);
    return { success: false, error: 'Failed to toggle note pin' };
  }
}

export async function archiveNote(noteId: string): Promise<ActionResult<Note>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .update({
        isArchived: true,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      console.error('Error archiving note:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toNote(data) : undefined };
  } catch (error) {
    console.error('Error in archiveNote:', error);
    return { success: false, error: 'Failed to archive note' };
  }
}

export async function unarchiveNote(noteId: string): Promise<ActionResult<Note>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .update({
        isArchived: false,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      console.error('Error unarchiving note:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? toNote(data) : undefined };
  } catch (error) {
    console.error('Error in unarchiveNote:', error);
    return { success: false, error: 'Failed to unarchive note' };
  }
}

export async function getArchivedNotes(userId: string): Promise<ActionResult<Note[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .select(`
        *,
        day:Day(userId)
      `)
      .or(`dayId.is.null,day.userId.eq.${userId}`)
      .eq('isArchived', true)
      .order('updatedAt', { ascending: false });

    if (error) {
      console.error('Error fetching archived notes:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toNote) : [] };
  } catch (error) {
    console.error('Error in getArchivedNotes:', error);
    return { success: false, error: 'Failed to fetch archived notes' };
  }
}

export async function getNotesByType(userId: string, type: NoteType): Promise<ActionResult<Note[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .select(`
        *,
        day:Day(userId)
      `)
      .or(`dayId.is.null,day.userId.eq.${userId}`)
      .eq('type', type)
      .eq('isArchived', false)
      .order('isPinned', { ascending: false })
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching notes by type:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toNote) : [] };
  } catch (error) {
    console.error('Error in getNotesByType:', error);
    return { success: false, error: 'Failed to fetch notes by type' };
  }
}

export async function getPinnedNotes(userId: string): Promise<ActionResult<Note[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .select(`
        *,
        day:Day(userId)
      `)
      .or(`dayId.is.null,day.userId.eq.${userId}`)
      .eq('isPinned', true)
      .eq('isArchived', false)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching pinned notes:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toNote) : [] };
  } catch (error) {
    console.error('Error in getPinnedNotes:', error);
    return { success: false, error: 'Failed to fetch pinned notes' };
  }
}

export async function searchNotes(userId: string, searchTerm: string): Promise<ActionResult<Note[]>> {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('Note')
      .select(`
        *,
        day:Day(userId)
      `)
      .or(`dayId.is.null,day.userId.eq.${userId}`)
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .eq('isArchived', false)
      .order('isPinned', { ascending: false })
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error searching notes:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? data.map(toNote) : [] };
  } catch (error) {
    console.error('Error in searchNotes:', error);
    return { success: false, error: 'Failed to search notes' };
  }
}