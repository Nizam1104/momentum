# Loading States Migration Guide

## Overview

This guide explains the new loading states pattern implemented across all Zustand stores to improve user experience by eliminating hard blocking loading states that cause unnecessary re-renders and poor UX.

## Problems with Previous Implementation

### Before (Hard Loading States)
- **Blocking UI**: Single `loading: boolean` state blocked entire components
- **Poor UX**: Users couldn't interact with anything during operations
- **Unnecessary Re-renders**: Loading state changes triggered full component re-renders
- **Confusing States**: Multiple loading states (`loading`, `notesLoading`, `tasksLoading`) were confusing

### Issues Identified
```typescript
// ❌ Old Pattern - Causes blocking UI
interface OldState {
  loading: boolean; // Blocks entire UI
  notesLoading: boolean; // Blocks notes section
  tasksLoading: boolean; // Blocks tasks section
}

// Usage caused poor UX
const updateNote = async (noteId, updates) => {
  setLoading(true); // ❌ Blocks everything
  await updateDayNote(noteId, updates);
  setLoading(false); // ❌ Finally unblocks after operation
};
```

## New Pattern: Non-Blocking Loading States

### Principles
1. **Initial Loading Only**: Use `initialLoading` only for essential first-time data fetching
2. **Item-Specific Operations**: Track operations per item using Record<string, boolean>
3. **Non-Blocking**: Operations don't block unrelated UI elements
4. **Granular Control**: Each operation type is tracked separately

### New State Structure
```typescript
// ✅ New Pattern - Non-blocking and granular
interface NewState {
  // Only for initial data fetch (first load)
  initialLoading: boolean;
  
  // Non-blocking operation tracking
  isCreating: boolean;
  isUpdating: Record<string, boolean>; // { noteId: true, ... }
  isDeleting: Record<string, boolean>; // { noteId: true, ... }
  
  // Helper methods
  isItemUpdating: (id: string) => boolean;
  isItemDeleting: (id: string) => boolean;
}
```

## Store-by-Store Changes

### 1. Day Store (Most Complex)
```typescript
// Before: Multiple blocking loading states
interface OldDayState {
  loading: boolean;          // ❌ Blocked everything
  notesLoading: boolean;     // ❌ Blocked notes section
  tasksLoading: boolean;     // ❌ Blocked tasks section
}

// After: Granular non-blocking states
interface NewDayState {
  // Initial loading only
  initialLoading: boolean;
  notesInitialLoading: boolean;
  tasksInitialLoading: boolean;
  
  // Non-blocking operation tracking
  isDayUpdating: Record<string, boolean>;
  isNoteCreating: boolean;
  isNoteUpdating: Record<string, boolean>;
  isNoteDeleting: Record<string, boolean>;
  isTaskCreating: boolean;
  isTaskUpdating: Record<string, boolean>;
  isTaskDeleting: Record<string, boolean>;
  
  // Helper getters
  isDayBeingUpdated: (dayId: string) => boolean;
  isNoteBeingUpdated: (noteId: string) => boolean;
  isTaskBeingUpdated: (taskId: string) => boolean;
}
```

### 2. Project Store
```typescript
interface ProjectState {
  initialLoading: boolean; // Only for fetchProjects
  
  // Operation states
  isCreating: boolean;
  isUpdating: Record<string, boolean>;
  isDeleting: Record<string, boolean>;
  isProgressUpdating: Record<string, boolean>;
  
  // Helper methods
  isItemBeingUpdated: (projectId: string) => boolean;
  isItemBeingDeleted: (projectId: string) => boolean;
  isProgressBeingUpdated: (projectId: string) => boolean;
}
```

## Implementation Examples

### 1. Async Operations Pattern
```typescript
// ✅ New Pattern
const updateNoteAsync = async (noteId: string, updates) => {
  get().setNoteUpdating(noteId, true);  // Only disable this note
  set({ notesError: null });            // Clear errors without blocking
  
  try {
    const result = await updateDayNote(noteId, updates);
    if (result.success) {
      // Update state optimistically
      set((state) => ({
        notes: state.notes.map((n) => 
          n.id === noteId ? result.data! : n
        ),
      }));
    } else {
      set({ notesError: result.error });
    }
  } catch (error) {
    set({ notesError: "Failed to update note" });
  } finally {
    get().setNoteUpdating(noteId, false); // Re-enable this note
  }
};
```

### 2. State Setters Pattern
```typescript
// Helper methods for managing operation states
setItemUpdating: (id: string, isUpdating: boolean) =>
  set((state) => ({
    isUpdating: isUpdating
      ? { ...state.isUpdating, [id]: true }
      : { ...state.isUpdating, [id]: false },
  })),

setItemDeleting: (id: string, isDeleting: boolean) =>
  set((state) => ({
    isDeleting: isDeleting
      ? { ...state.isDeleting, [id]: true }
      : { ...state.isDeleting, [id]: false },
  })),
```

## Usage in Components

### 1. Using the useLoadingStates Hook
```typescript
import { useLoadingStates } from '@/hooks/useLoadingStates';

function NotesComponent() {
  const { 
    notes, 
    isNoteCreating, 
    isNoteUpdating, 
    isNoteDeleting, 
    notesInitialLoading 
  } = useDayStore();
  
  const loadingStates = useLoadingStates({
    initialLoading: notesInitialLoading,
    isCreating: isNoteCreating,
    isUpdating: isNoteUpdating,
    isDeleting: isNoteDeleting
  });

  return (
    <div>
      {/* Show initial loading only for first load */}
      {loadingStates.shouldShowLoadingIndicator('initial') && (
        <div>Loading notes...</div>
      )}
      
      {/* Create form - disable during creation */}
      <form>
        <input
          disabled={loadingStates.getInputDisabledState()}
          placeholder="Add new note..."
        />
        <button 
          disabled={loadingStates.shouldShowLoadingIndicator('create')}
          type="submit"
        >
          {loadingStates.shouldShowLoadingIndicator('create') ? 'Creating...' : 'Create Note'}
        </button>
      </form>
      
      {/* Notes list */}
      {notes.map(note => (
        <div key={note.id}>
          <input
            disabled={loadingStates.isItemBusy(note.id)}
            defaultValue={note.content}
            onBlur={(e) => updateNote(note.id, { content: e.target.value })}
          />
          
          <button
            disabled={loadingStates.isItemDeleting(note.id)}
            onClick={() => deleteNote(note.id)}
          >
            {loadingStates.isItemDeleting(note.id) ? 'Deleting...' : 'Delete'}
          </button>
          
          {/* Subtle loading indicator */}
          {loadingStates.isItemUpdating(note.id) && (
            <span className="text-blue-500 text-sm">Saving...</span>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 2. Direct Store Usage
```typescript
function TaskComponent({ task }) {
  const { 
    isTaskUpdating, 
    updateTaskAsync,
    isTaskBeingUpdated 
  } = useDayStore();
  
  const isThisTaskUpdating = isTaskBeingUpdated(task.id);

  return (
    <div className={isThisTaskUpdating ? 'opacity-75' : ''}>
      <input
        disabled={isThisTaskUpdating}
        defaultValue={task.title}
        onBlur={(e) => updateTaskAsync(task.id, { title: e.target.value })}
      />
      
      {isThisTaskUpdating && (
        <span className="text-sm text-blue-500">Updating...</span>
      )}
    </div>
  );
}
```

## Benefits of New Pattern

### 1. Better User Experience
- ✅ Users can interact with unrelated items while one item is being updated
- ✅ No blocking spinners that prevent all interactions
- ✅ Immediate feedback on specific items being processed
- ✅ Smooth, non-interrupting workflow

### 2. Performance Improvements
- ✅ Fewer component re-renders
- ✅ Only affected items update their state
- ✅ Better React optimization opportunities
- ✅ Reduced layout thrashing

### 3. Developer Experience
- ✅ Clear separation of concerns
- ✅ Easy to debug specific operation states
- ✅ Consistent pattern across all stores
- ✅ Helper hooks for common patterns

## Migration Checklist

### For Existing Components:
1. ✅ Replace `loading` checks with `initialLoading` for first-time data fetching
2. ✅ Use item-specific loading states for operations (`isItemUpdating(id)`)
3. ✅ Implement `useLoadingStates` hook for complex loading logic
4. ✅ Replace blocking loading indicators with subtle, non-blocking ones
5. ✅ Disable only relevant inputs during operations

### For New Components:
1. ✅ Use `useLoadingStates` hook from the start
2. ✅ Implement proper disabled states for inputs
3. ✅ Show subtle loading indicators instead of blocking overlays
4. ✅ Handle initial loading separately from operation loading

## Best Practices

### Do's ✅
- Use `initialLoading` only for essential first-time data fetching
- Disable specific inputs during their related operations
- Show subtle, non-blocking loading indicators
- Use item-specific operation tracking
- Provide immediate visual feedback for operations

### Don'ts ❌
- Don't use global loading states for CRUD operations
- Don't block entire UI sections for single item operations
- Don't show heavy loading overlays for updates/deletes
- Don't prevent users from interacting with unrelated items
- Don't use loading states as the primary form of user feedback

## Common Patterns

### 1. Form Input Handling
```typescript
// ✅ Good: Only disable input being updated
<input
  disabled={loadingStates.isItemUpdating(item.id)}
  onBlur={(e) => updateItem(item.id, { field: e.target.value })}
/>

// ❌ Bad: Disable all inputs
<input
  disabled={loading} // Blocks everything
  onBlur={(e) => updateItem(item.id, { field: e.target.value })}
/>
```

### 2. Button States
```typescript
// ✅ Good: Specific button feedback
<button
  disabled={loadingStates.isItemDeleting(item.id)}
  onClick={() => deleteItem(item.id)}
>
  {loadingStates.isItemDeleting(item.id) ? 'Deleting...' : 'Delete'}
</button>
```

### 3. Visual Feedback
```typescript
// ✅ Good: Subtle, non-blocking indicators
<div className={loadingStates.isItemBusy(item.id) ? 'opacity-75' : ''}>
  {/* Item content */}
  {loadingStates.isItemUpdating(item.id) && (
    <span className="text-sm text-blue-500">Saving...</span>
  )}
</div>
```

This new pattern ensures your app feels fast, responsive, and never blocks users from continuing their work while operations are in progress.