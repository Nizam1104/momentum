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
import MDEditor from "@uiw/react-md-editor";
import { Pencil, Save, Trash2, PlusCircle, FileText } from "lucide-react";

// Define the structure of a single note
type Note = {
  id: string;
  title: string;
  content: string;
  lastUpdated: Date;
};

// Initial data for demonstration purposes
const initialNotes: Note[] = [
  {
    id: "note-1",
    title: "My First Note",
    content: "This is a **preview** of the note content. Click 'Edit' to change it.",
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "note-2",
    title: "Shopping List",
    content: "- Milk\n- Bread\n- Eggs\n- *Maybe* some ice cream 🍦",
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];

export default function MultiNoteManager() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    initialNotes.length > 0 ? initialNotes[0].id : null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  // Memoize the active note to avoid re-finding it on every render
  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId),
    [notes, activeNoteId]
  );

  const handleAddNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "Untitled Note",
      content: "",
      lastUpdated: new Date(),
    };
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
    setIsEditMode(true); // Enter edit mode for the new note
  };

  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
    setIsEditMode(false); // Exit edit mode when switching notes
  };

  const handleSave = () => {
    if (!activeNote) return;

    // Update the lastUpdated timestamp on save
    const updatedNotes = notes.map((note) =>
      note.id === activeNoteId ? { ...note, lastUpdated: new Date() } : note
    );
    setNotes(updatedNotes);
    setIsEditMode(false);
    console.log("Note saved:", activeNote.title);
  };

  const handleDelete = () => {
    if (!activeNoteId) return;

    const noteIndex = notes.findIndex((note) => note.id === activeNoteId);
    const newNotes = notes.filter((note) => note.id !== activeNoteId);
    setNotes(newNotes);

    // If there are no notes left, set activeId to null
    if (newNotes.length === 0) {
      setActiveNoteId(null);
    } else {
      // Otherwise, select the previous note, or the first note if the deleted one was the first
      const newIndex = Math.max(0, noteIndex - 1);
      setActiveNoteId(newNotes[newIndex].id);
    }
    setIsEditMode(false);
    console.log("Note deleted:", activeNoteId);
  };

  // Generic handler to update any field of the active note
  const updateActiveNote = (field: "title" | "content", value: string) => {
    if (!activeNoteId) return;
    const updatedNotes = notes.map((note) =>
      note.id === activeNoteId ? { ...note, [field]: value } : note
    );
    setNotes(updatedNotes);
  };

  return (
    <div className="space-y-4">
      {/* Horizontal Note Title Tabs */}
      <div className="flex items-center gap-2 border-b pb-2">
        {notes.map((note) => (
          <Button
            key={note.id}
            variant={note.id === activeNoteId ? "default" : "ghost"}
            size="sm"
            onClick={() => handleSelectNote(note.id)}
            className="h-8"
          >
            {note.title}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={handleAddNote} className="ml-auto h-8">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Note Display Card */}
      {activeNote ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center gap-4">
              {isEditMode ? (
                <Input
                  value={activeNote.title}
                  onChange={(e) => updateActiveNote("title", e.target.value)}
                  placeholder="Note title"
                  className="text-2xl font-bold p-0 h-auto border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              ) : (
                <div>
                  <CardTitle>{activeNote.title || "Untitled Note"}</CardTitle>
                  <CardDescription>
                    <>Last updated: {activeNote.lastUpdated.toLocaleString()}</>
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
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none" data-color-mode="dark">
              <MDEditor
                key={activeNote.id} // Important: Use key to force re-mount on note switch
                value={activeNote.content}
                onChange={(value) => updateActiveNote("content", value || "")}
                height={400}
                preview={isEditMode ? "live" : "preview"} // 'live' is better for editing
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
        // Placeholder when no notes exist
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>No Notes Yet!</AlertTitle>
          <AlertDescription>
            Click the "+ New Note" button to create your first note.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
