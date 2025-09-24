"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  StickyNote,
  Pin,
  Archive,
  Save,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MarkdownEditor from "@/components/notes/MarkdownEditor";

import { LearningConcept, Note, NoteType } from "@/types/states";
import {
  createConceptNote,
  updateConceptNote,
  deleteConceptNote,
  archiveConceptNote,
} from "@/actions/clientActions/learning";
import { useSession } from "next-auth/react";

const noteFormSchema = z.object({
  title: z.string().optional(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10000 characters"),
  type: z.nativeEnum(NoteType),
  isPinned: z.boolean(),
});

type NoteFormData = z.infer<typeof noteFormSchema>;

interface ConceptNotesListProps {
  concept: LearningConcept;
  notes: Note[];
  onNotesUpdate: (notes: Note[]) => void;
}

const NoteTypeColors = {
  [NoteType.GENERAL]: "text-gray-600",
  [NoteType.LEARNING]: "text-blue-600",
  [NoteType.IDEA]: "text-yellow-600",
  [NoteType.REFLECTION]: "text-purple-600",
  [NoteType.MEETING]: "text-green-600",
  [NoteType.PLANNING]: "text-orange-600",
};

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onSave,
  isEditing,
  onCancelEdit,
}: {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onToggleArchive: () => void;
  onSave: (data: NoteFormData) => void;
  isEditing: boolean;
  onCancelEdit: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: note.title || "",
      content: note.content,
      type: note.type,
      isPinned: note.isPinned,
    },
  });

  React.useEffect(() => {
    if (isEditing) {
      form.reset({
        title: note.title || "",
        content: note.content,
        type: note.type,
        isPinned: note.isPinned,
      });
    }
  }, [isEditing, note, form]);

  const handleSave = async (data: NoteFormData) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (isEditing) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            <span className="text-sm font-medium">
              {note.id === "new" ? "New Note" : "Edit Note"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="h-7 w-7 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Note title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NoteType.LEARNING}>
                          Learning
                        </SelectItem>
                        <SelectItem value={NoteType.IDEA}>Idea</SelectItem>
                        <SelectItem value={NoteType.REFLECTION}>
                          Reflection
                        </SelectItem>
                        <SelectItem value={NoteType.GENERAL}>
                          General
                        </SelectItem>
                        <SelectItem value={NoteType.PLANNING}>
                          Planning
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <MarkdownEditor
                        value={field.value}
                        onChange={(value) => field.onChange(value || "")}
                        height={300}
                        preview="live"
                        hideToolbar={false}
                        editable={true}
                        onDoubleClick={() => {
                          if (!isEditMode) {
                            setIsEditMode(true);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.ctrlKey) {
                            e.preventDefault();
                            form.handleSubmit(handleSave)();
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPinned"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Pin this note</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Note
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className={`group py-4 ${note.isArchived ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {note.isPinned && <Pin className="h-4 w-4 text-yellow-600" />}
          {note.isArchived && <Archive className="h-4 w-4 text-gray-500" />}
          <span className={`text-sm ${NoteTypeColors[note.type]}`}>
            {note.type.toLowerCase()}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePin}
            className="h-7 w-7 p-0"
          >
            <Pin
              className={`h-3 w-3 ${note.isPinned ? "text-yellow-600" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-7 w-7 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleArchive}
            className="h-7 w-7 p-0"
          >
            <Archive className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 w-7 p-0 text-red-600"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {note.title && (
        <h4 className="font-medium text-base mb-2">{note.title}</h4>
      )}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <MarkdownEditor
          value={note.content}
          onChange={() => {}}
          height={150}
          preview="preview"
          hideToolbar={true}
          editable={false}
          onDoubleClick={() => {
            if (!isEditMode) {
              setIsEditMode(true);
              onEdit();
            }
          }}
        />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {formatDate(note.createdAt)}
        {note.updatedAt &&
          note.updatedAt.getTime() !== note.createdAt.getTime() && (
            <span> • Updated {formatDate(note.updatedAt)}</span>
          )}
      </div>
    </div>
  );
};

export default function ConceptNotesList({
  concept,
  notes,
  onNotesUpdate,
}: ConceptNotesListProps) {
  const { data: session } = useSession();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateNote = () => {
    setIsCreating(true);
    setEditingNoteId(null);
  };

  const handleEditNote = (noteId: string) => {
    setEditingNoteId(noteId);
    setIsCreating(false);
  };

  const handleSaveNote = async (data: NoteFormData, noteId?: string) => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      let updatedNote: Note;

      if (noteId && noteId !== "new") {
        // Update existing note
        updatedNote = await updateConceptNote(noteId, {
          title: data.title,
          content: data.content,
          type: data.type,
          isPinned: data.isPinned,
        });

        const updatedNotes = notes.map((note) =>
          note.id === noteId ? updatedNote : note,
        );
        onNotesUpdate(updatedNotes);
      } else {
        // Create new note
        updatedNote = await createConceptNote(session.user.id, concept.id, {
          title: data.title,
          content: data.content,
          type: data.type,
        });

        const updatedNotes = [updatedNote, ...notes];
        onNotesUpdate(updatedNotes);
      }

      setIsCreating(false);
      setEditingNoteId(null);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    setLoading(true);
    try {
      await deleteConceptNote(noteId);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      onNotesUpdate(updatedNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (noteId: string) => {
    const noteToUpdate = notes.find((note) => note.id === noteId);
    if (!noteToUpdate) return;

    setLoading(true);
    try {
      const updatedNote = await updateConceptNote(noteId, {
        isPinned: !noteToUpdate.isPinned,
      });

      const updatedNotes = notes.map((note) =>
        note.id === noteId ? updatedNote : note,
      );
      onNotesUpdate(updatedNotes);
    } catch (error) {
      console.error("Error toggling pin:", error);
      alert("Failed to update note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleArchive = async (noteId: string) => {
    const noteToUpdate = notes.find((note) => note.id === noteId);
    if (!noteToUpdate) return;

    setLoading(true);
    try {
      if (!noteToUpdate.isArchived) {
        // Archive the note
        await archiveConceptNote(noteId);
        // Remove from list since we filter out archived notes
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        onNotesUpdate(updatedNotes);
      }
    } catch (error) {
      console.error("Error archiving note:", error);
      alert("Failed to archive note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingNoteId(null);
  };

  // Sort notes: pinned first, then by creation date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.isArchived && !b.isArchived) return 1;
    if (!a.isArchived && b.isArchived) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Notes ({notes.length})</h3>
        {!isCreating && (
          <Button
            onClick={handleCreateNote}
            size="sm"
            variant="outline"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        )}
      </div>

      {/* Create New Note Form */}
      {isCreating && (
        <div className="mb-4">
          <NoteCard
            note={{
              id: "new",
              title: "",
              content: "",
              type: NoteType.LEARNING,
              isPinned: false,
              isArchived: false,
              dayId: null,
              projectId: null,
              categoryId: null,
              createdAt: new Date(),
              updatedAt: null,
            }}
            onEdit={() => {}}
            onDelete={() => {}}
            onTogglePin={() => {}}
            onToggleArchive={() => {}}
            onSave={(data) => handleSaveNote(data)}
            isEditing={true}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      )}

      {/* Notes List */}
      {sortedNotes.length === 0 ? (
        <div className="text-center py-8">
          <StickyNote className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            No notes yet. Start capturing your insights.
          </p>
          {!isCreating && (
            <Button
              onClick={handleCreateNote}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => handleEditNote(note.id)}
              onDelete={() => handleDeleteNote(note.id)}
              onTogglePin={() => handleTogglePin(note.id)}
              onToggleArchive={() => handleToggleArchive(note.id)}
              onSave={(data) => handleSaveNote(data, note.id)}
              isEditing={editingNoteId === note.id}
              onCancelEdit={handleCancelEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
