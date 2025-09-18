"use client";
import { useState, useMemo, useEffect } from "react"; // Import useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import MarkdownEditor from "@/components/notes/MarkdownEditor";
import {
  Pencil,
  Save,
  Trash2,
  PlusCircle,
  FileText,
  BookOpen,
} from "lucide-react";
import { useDayStore } from "@/stores/day";
import { Note, NoteType } from "@/types/states";

export default function DayNotes() {
  const {
    selectedDay,
    notes,
    notesInitialLoading,
    notesError,
    createNoteAsync,
    updateNoteAsync,
    deleteNoteAsync,
  } = useDayStore();

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  // Local state for the note being edited
  const [localActiveNote, setLocalActiveNote] = useState<Note | null>(null);
  
  // Set initial active note when notes are loaded
  // This useMemo runs when notes or activeNoteId changes
  useMemo(() => {
    if (notes.length > 0 && !activeNoteId) {
      const learningsNote = notes.find(
        (note) => note.title === "Learnings" && note.type === NoteType.LEARNING,
      );
      const firstNote = learningsNote || notes[0];
      setActiveNoteId(firstNote.id);
    }
  }, [notes, activeNoteId]);

  // Derive the active note from the store's notes array
  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId),
    [notes, activeNoteId],
  );

  // Sync localActiveNote with activeNote from the store
  // This ensures local state is updated when a new note is selected,
  // or when the store's activeNote is updated (e.g., after a save operation).
  // It also exits edit mode when the active note changes.
  useEffect(() => {
    if (activeNote) {
      // Create a shallow copy to avoid direct mutation of the store's object
      setLocalActiveNote({ ...activeNote });
    } else {
      setLocalActiveNote(null);
    }
    // When activeNote changes (e.g., selecting a new note or after saving), exit edit mode
    setIsEditMode(false);
  }, [activeNote]);

  const handleAddNote = async () => {
    if (!selectedDay) return;

    // Create the note in the DB. Assuming createNoteAsync updates the store
    // and the new note becomes available in the `notes` array.
    await createNoteAsync(selectedDay.id, {
      title: "New Note",
      content: "",
      type: NoteType.GENERAL,
    });

    // After the store updates, the `useMemo` for `activeNote` and `useEffect` for `localActiveNote`
    // will automatically pick up the new note if it becomes the first one or is explicitly set.
    // The current logic relies on `notes[0]` being the new note.
    const newNote = notes[0];
    if (newNote) {
      setActiveNoteId(newNote.id);
      setIsEditMode(true); // Enter edit mode for the new note
    }
  };

  const handleSelectNote = (id: string) => {
    // If there are unsaved changes in localActiveNote and we are in edit mode,
    // you might want to prompt the user to save or discard here.
    // For now, switching notes will discard any unsaved local changes.
    setActiveNoteId(id);
    // setIsEditMode(false) is handled by the useEffect when activeNote changes
  };

  const handleSave = async () => {
    if (!localActiveNote || !activeNoteId) return;

    // Only call update if there are actual changes compared to the store's activeNote
    // This prevents unnecessary DB writes if nothing has changed.
    const currentStoreNote = notes.find((note) => note.id === activeNoteId);
    if (
      currentStoreNote &&
      (currentStoreNote.title !== localActiveNote.title ||
        currentStoreNote.content !== localActiveNote.content)
    ) {
      console.log(localActiveNote.content);
      await updateNoteAsync(activeNoteId, {
        title: localActiveNote.title || "",
        content: localActiveNote.content,
      });
    }
    setIsEditMode(false); // Exit edit mode after saving
  };

  const handleDelete = async () => {
    if (!activeNoteId || !activeNote) return;

    // Don't allow deletion of the default Learnings note
    if (
      activeNote.title === "Learnings" &&
      activeNote.type === NoteType.LEARNING
    ) {
      return;
    }

    await deleteNoteAsync(activeNoteId);

    // Select another note after deletion
    const remainingNotes = notes.filter((n) => n.id !== activeNoteId);
    if (remainingNotes.length > 0) {
      setActiveNoteId(remainingNotes[0].id);
    } else {
      setActiveNoteId(null);
    }
    // setIsEditMode(false) is handled by the useEffect when activeNote changes
  };

  // This function updates the local state, not the DB directly
  const updateLocalActiveNote = (field: "title" | "content", value: string) => {
    if (localActiveNote) {
      setLocalActiveNote((prev) => {
        if (!prev) return null;
        return { ...prev, [field]: value };
      });
    }
  };

  if (notesInitialLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (notesError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading notes</AlertTitle>
        <AlertDescription>{notesError}</AlertDescription>
      </Alert>
    );
  }

  if (!selectedDay) {
    return (
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertTitle>No Day Selected</AlertTitle>
        <AlertDescription>
          Please select a day to view and manage notes.
        </AlertDescription>
      </Alert>
    );
  }

  // Determine which note data to display/edit
  // When in edit mode, use the local state for inputs.
  // When not in edit mode, use the store's activeNote to show the saved version.
  const displayNote = isEditMode ? localActiveNote : activeNote;

  return (
    <div className="space-y-4">
      {/* Note Navigation Tabs */}
      <div className="flex items-center gap-2 -b pb-2">
        {notes.map((note) => (
          <Button
            key={note.id}
            variant={note.id === activeNoteId ? "default" : "ghost"}
            size="sm"
            onClick={() => handleSelectNote(note.id)}
            className="h-8 gap-2"
          >
            {note.title === "Learnings" && note.type === NoteType.LEARNING && (
              <BookOpen className="h-3 w-3" />
            )}
            {note.title || "Untitled"}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddNote}
          className="ml-auto h-8"
          disabled={notesInitialLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Note Content */}
      {displayNote ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center gap-4">
              {isEditMode ? (
                <Input
                  value={localActiveNote?.title || ""} // Bind to localActiveNote for editing
                  onChange={(e) =>
                    updateLocalActiveNote("title", e.target.value)
                  }
                  placeholder="Note title"
                  className="text-2xl font-bold p-0 h-auto -none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              ) : (
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {displayNote.title === "Learnings" && // Use displayNote for read-only title
                      displayNote.type === NoteType.LEARNING && (
                        <BookOpen className="h-5 w-5 text-blue-500" />
                      )}
                    {displayNote.title || "Untitled Note"}
                  </CardTitle>
                  <CardDescription>
                    Last updated:{" "}
                    {displayNote.updatedAt?.toLocaleString() || // Use displayNote for dates
                      displayNote.createdAt.toLocaleString()}
                  </CardDescription>
                </div>
              )}
              <div className="flex gap-2 flex-shrink-0">
                {isEditMode ? (
                  <Button variant="default" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditMode(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                {/* Don't show delete button for the default Learnings note */}
                {!(
                  displayNote.title === "Learnings" && // Use displayNote for check
                  displayNote.type === NoteType.LEARNING
                ) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="prose dark:prose-invert max-w-none"
              onDoubleClick={() => {
                if (!isEditMode) {
                  setIsEditMode(true);
                }
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  // Checks if Enter is pressed AND Control is held
                  handleSave();
                }
              }}
            >
              <MarkdownEditor
                key={displayNote.id} // Key should be stable, use displayNote.id
                value={displayNote.content} // Bind to displayNote for content
                onChange={(value) =>
                  updateLocalActiveNote("content", value || "")
                }
                height={400}
                preview={isEditMode ? "live" : "preview"}
                hideToolbar={!isEditMode}
                editable={isEditMode}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    handleSave();
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>No Notes Yet!</AlertTitle>
          <AlertDescription>
            Click the "New Note" button to create your first note for today.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
