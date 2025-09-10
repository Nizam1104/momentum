// hooks/useLoadingStates.ts
import { useMemo } from 'react';

/**
 * Utility hook for managing non-blocking loading states
 * This hook helps components easily check loading states and disable inputs appropriately
 */

interface UseLoadingStatesProps {
  // Global loading states (for initial data fetching)
  initialLoading?: boolean;

  // Item-specific operation states
  isCreating?: boolean;
  isUpdating?: Record<string, boolean>;
  isDeleting?: Record<string, boolean>;

  // Additional operation states (optional)
  isStatusUpdating?: Record<string, boolean>;
  isProgressUpdating?: Record<string, boolean>;
}

interface UseLoadingStatesReturn {
  // Check if any global operation is in progress
  isAnyGlobalOperationInProgress: boolean;

  // Check if specific item operations are in progress
  isItemUpdating: (itemId: string) => boolean;
  isItemDeleting: (itemId: string) => boolean;
  isItemStatusUpdating: (itemId: string) => boolean;
  isItemProgressUpdating: (itemId: string) => boolean;

  // Check if any operation is in progress for a specific item
  isItemBusy: (itemId: string) => boolean;

  // Check if any operation is in progress globally
  isAnyOperationInProgress: boolean;

  // Get disabled state for form inputs
  getInputDisabledState: (itemId?: string) => boolean;

  // Get loading indicator visibility
  shouldShowLoadingIndicator: (type: 'initial' | 'create' | 'item', itemId?: string) => boolean;
}

export const useLoadingStates = ({
  initialLoading = false,
  isCreating = false,
  isUpdating = {},
  isDeleting = {},
  isStatusUpdating = {},
  isProgressUpdating = {}
}: UseLoadingStatesProps): UseLoadingStatesReturn => {

  const isItemUpdating = (itemId: string): boolean => {
    return isUpdating[itemId] || false;
  };

  const isItemDeleting = (itemId: string): boolean => {
    return isDeleting[itemId] || false;
  };

  const isItemStatusUpdating = (itemId: string): boolean => {
    return isStatusUpdating[itemId] || false;
  };

  const isItemProgressUpdating = (itemId: string): boolean => {
    return isProgressUpdating[itemId] || false;
  };

  const isItemBusy = (itemId: string): boolean => {
    return (
      isItemUpdating(itemId) ||
      isItemDeleting(itemId) ||
      isItemStatusUpdating(itemId) ||
      isItemProgressUpdating(itemId)
    );
  };

  const isAnyGlobalOperationInProgress = useMemo(() => {
    return initialLoading || isCreating;
  }, [initialLoading, isCreating]);

  const isAnyOperationInProgress = useMemo(() => {
    const hasAnyUpdating = Object.values(isUpdating).some(Boolean);
    const hasAnyDeleting = Object.values(isDeleting).some(Boolean);
    const hasAnyStatusUpdating = Object.values(isStatusUpdating).some(Boolean);
    const hasAnyProgressUpdating = Object.values(isProgressUpdating).some(Boolean);

    return (
      isAnyGlobalOperationInProgress ||
      hasAnyUpdating ||
      hasAnyDeleting ||
      hasAnyStatusUpdating ||
      hasAnyProgressUpdating
    );
  }, [
    isAnyGlobalOperationInProgress,
    isUpdating,
    isDeleting,
    isStatusUpdating,
    isProgressUpdating
  ]);

  const getInputDisabledState = (itemId?: string): boolean => {
    if (initialLoading) return true; // Disable during initial data fetch
    if (isCreating) return true; // Disable during creation
    if (itemId && isItemBusy(itemId)) return true; // Disable for specific item operations
    return false;
  };

  const shouldShowLoadingIndicator = (type: 'initial' | 'create' | 'item', itemId?: string): boolean => {
    switch (type) {
      case 'initial':
        return initialLoading;
      case 'create':
        return isCreating;
      case 'item':
        return itemId ? isItemBusy(itemId) : false;
      default:
        return false;
    }
  };

  return {
    isAnyGlobalOperationInProgress,
    isItemUpdating,
    isItemDeleting,
    isItemStatusUpdating,
    isItemProgressUpdating,
    isItemBusy,
    isAnyOperationInProgress,
    getInputDisabledState,
    shouldShowLoadingIndicator
  };
};

/**
 * Usage Examples:
 *
 * // In a component that displays a list of items
 * const { notes, isNoteCreating, isNoteUpdating, isNoteDeleting, notesInitialLoading } = useDayStore();
 * const loadingStates = useLoadingStates({
 *   initialLoading: notesInitialLoading,
 *   isCreating: isNoteCreating,
 *   isUpdating: isNoteUpdating,
 *   isDeleting: isNoteDeleting
 * });
 *
 * // Disable form inputs during operations
 * <input
 *   disabled={loadingStates.getInputDisabledState()}
 *   placeholder="Add new note..."
 * />
 *
 * // Disable specific item actions
 * <button
 *   disabled={loadingStates.isItemBusy(note.id)}
 *   onClick={() => updateNote(note.id, updates)}
 * >
 *   Update Note
 * </button>
 *
 * // Show subtle loading indicators instead of blocking the UI
 * {loadingStates.shouldShowLoadingIndicator('item', note.id) && (
 *   <span className="opacity-50">Updating...</span>
 * )}
 *
 * // Show create loading indicator
 * {loadingStates.shouldShowLoadingIndicator('create') && (
 *   <span className="text-blue-500">Creating...</span>
 * )}
 */
