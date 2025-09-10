"use client";
import { useState, useMemo } from "react";
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
import MDEditor from "@uiw/react-md-editor";
import {
  Pencil,
  Save,
  Trash2,
  PlusCircle,
  FileText,
  BookOpen
} from "lucide-react";
import { useDayStore } from "@/stores/day";
import { NoteType } from "@/actions/clientActions/types";

export default function DayNotes() {
  const {
    selectedDay,
    notes,
    notesLoading,
    notesError,
    createNoteAsync,
    updateNoteAsync,
    deleteNoteAsync,
  } = useDayStore();

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Set initial active note when notes are loaded
  useMemo(() => {
    if (notes.length > 0 && !activeNoteId) {
      // Prioritize "Learnings" note or the first pinned note
      const learningsNote = notes.find(note =>
        note.title === "Learnings" && note.type === NoteType.LEARNING
      );
      const firstNote = learningsNote || notes[0];
      setActiveNoteId(firstNote.id);
    }
  }, [notes, activeNoteId]);

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId),
    [notes, activeNoteId]
  );

  const handleAddNote = async () => {
    if (!selectedDay) return;

    await createNoteAsync(selectedDay.id, {
      title: "New Note",
      content: "",
      type: NoteType.GENERAL,
    });

    // Find the newly created note and set it as active
    const newNote = notes[0]; // Newly created note should be first
    if (newNote) {
      setActiveNoteId(newNote.id);
      setIsEditMode(true);
    }
  };

  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (!activeNote) return;
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (!activeNoteId || !activeNote) return;

    // Don't allow deletion of the default Learnings note
    if (activeNote.title === "Learnings" && activeNote.type === NoteType.LEARNING) {
      return;
    }

    await deleteNoteAsync(activeNoteId);

    // Select another note after deletion
    const remainingNotes = notes.filter(n => n.id !== activeNoteId);
    if (remainingNotes.length > 0) {
      setActiveNoteId(remainingNotes[0].id);
    } else {
      setActiveNoteId(null);
    }
    setIsEditMode(false);
  };

  const updateActiveNote = async (field: "title" | "content", value: string) => {
    if (!activeNoteId) return;

    await updateNoteAsync(activeNoteId, { [field]: value });
  };

  if (notesLoading) {
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

  return (
    <div className="space-y-4">
      {/* Note Navigation Tabs */}
      <div className="flex items-center gap-2 border-b pb-2">
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
          disabled={notesLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Note Content */}
      {activeNote ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center gap-4">
              {isEditMode ? (
                <Input
                  value={activeNote.title || ""}
                  onChange={(e) => updateActiveNote("title", e.target.value)}
                  placeholder="Note title"
                  className="text-2xl font-bold p-0 h-auto border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              ) : (
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {activeNote.title === "Learnings" && activeNote.type === NoteType.LEARNING && (
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    )}
                    {activeNote.title || "Untitled Note"}
                  </CardTitle>
                  <CardDescription>
                    Last updated: {activeNote.updatedAt?.toLocaleString() || activeNote.createdAt.toLocaleString()}
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
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                {/* Don't show delete button for the default Learnings note */}
                {!(activeNote.title === "Learnings" && activeNote.type === NoteType.LEARNING) && (
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none" data-color-mode="dark">
              <MDEditor
                key={activeNote.id}
                value={activeNote.content}
                onChange={(value) => updateActiveNote("content", value || "")}
                height={400}
                preview={isEditMode ? "live" : "preview"}
                hideToolbar={!isEditMode}
                visibleDragbar={isEditMode}
                previewOptions={{
                  style: { backgroundColor: "transparent" },
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
