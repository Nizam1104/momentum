import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  LearningTopic,
  LearningConcept,
  LearningTopicStatus,
  LearningConceptStatus,
  Priority,
} from "@/types/states";

interface LearningState {
  // Topics
  topics: LearningTopic[];
  selectedTopic: LearningTopic | null;
  topicsLoading: boolean;
  topicsError: string | null;

  // Concepts
  concepts: LearningConcept[];
  selectedConcept: LearningConcept | null;
  conceptsLoading: boolean;
  conceptsError: string | null;

  // UI State
  isCreatingTopic: boolean;
  isCreatingConcept: boolean;
  isEditingTopic: boolean;
  isEditingConcept: boolean;

  // Actions - Topics
  setTopics: (topics: LearningTopic[]) => void;
  addTopic: (topic: LearningTopic) => void;
  updateTopic: (topicId: string, updates: Partial<LearningTopic>) => void;
  deleteTopic: (topicId: string) => void;
  setSelectedTopic: (topic: LearningTopic | null) => void;
  setTopicsLoading: (loading: boolean) => void;
  setTopicsError: (error: string | null) => void;

  // Actions - Concepts
  setConcepts: (concepts: LearningConcept[]) => void;
  addConcept: (concept: LearningConcept) => void;
  updateConcept: (conceptId: string, updates: Partial<LearningConcept>) => void;
  deleteConcept: (conceptId: string) => void;
  setSelectedConcept: (concept: LearningConcept | null) => void;
  setConceptsLoading: (loading: boolean) => void;
  setConceptsError: (error: string | null) => void;

  // Actions - UI
  setIsCreatingTopic: (isCreating: boolean) => void;
  setIsCreatingConcept: (isCreating: boolean) => void;
  setIsEditingTopic: (isEditing: boolean) => void;
  setIsEditingConcept: (isEditing: boolean) => void;

  // Complex Actions
  fetchTopics: (userId: string) => Promise<void>;
  fetchTopicConcepts: (topicId: string) => Promise<void>;
  createTopic: (
    topic: Omit<LearningTopic, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  createConcept: (
    concept: Omit<LearningConcept, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateTopicProgress: (topicId: string) => void;

  // Reset functions
  resetTopics: () => void;
  resetConcepts: () => void;
  resetAll: () => void;
}

const initialState = {
  // Topics
  topics: [],
  selectedTopic: null,
  topicsLoading: false,
  topicsError: null,

  // Concepts
  concepts: [],
  selectedConcept: null,
  conceptsLoading: false,
  conceptsError: null,

  // UI State
  isCreatingTopic: false,
  isCreatingConcept: false,
  isEditingTopic: false,
  isEditingConcept: false,
};

export const useLearningStore = create<LearningState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Topics Actions
      setTopics: (topics) => set({ topics }),

      addTopic: (topic) =>
        set((state) => ({
          topics: [...state.topics, topic],
        })),

      updateTopic: (topicId, updates) =>
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId ? { ...topic, ...updates } : topic,
          ),
          selectedTopic:
            state.selectedTopic?.id === topicId
              ? { ...state.selectedTopic, ...updates }
              : state.selectedTopic,
        })),

      deleteTopic: (topicId) =>
        set((state) => ({
          topics: state.topics.filter((topic) => topic.id !== topicId),
          selectedTopic:
            state.selectedTopic?.id === topicId ? null : state.selectedTopic,
          // Also remove concepts for this topic
          concepts: state.concepts.filter(
            (concept) => concept.topicId !== topicId,
          ),
        })),

      setSelectedTopic: (topic) => set({ selectedTopic: topic }),
      setTopicsLoading: (loading) => set({ topicsLoading: loading }),
      setTopicsError: (error) => set({ topicsError: error }),

      // Concepts Actions
      setConcepts: (concepts) => set({ concepts }),

      addConcept: (concept) =>
        set((state) => ({
          concepts: [...state.concepts, concept],
        })),

      updateConcept: (conceptId, updates) =>
        set((state) => ({
          concepts: state.concepts.map((concept) =>
            concept.id === conceptId ? { ...concept, ...updates } : concept,
          ),
          selectedConcept:
            state.selectedConcept?.id === conceptId
              ? { ...state.selectedConcept, ...updates }
              : state.selectedConcept,
        })),

      deleteConcept: (conceptId) =>
        set((state) => ({
          concepts: state.concepts.filter(
            (concept) => concept.id !== conceptId,
          ),
          selectedConcept:
            state.selectedConcept?.id === conceptId
              ? null
              : state.selectedConcept,
        })),

      setSelectedConcept: (concept) => set({ selectedConcept: concept }),
      setConceptsLoading: (loading) => set({ conceptsLoading: loading }),
      setConceptsError: (error) => set({ conceptsError: error }),

      // UI Actions
      setIsCreatingTopic: (isCreating) => set({ isCreatingTopic: isCreating }),
      setIsCreatingConcept: (isCreating) =>
        set({ isCreatingConcept: isCreating }),
      setIsEditingTopic: (isEditing) => set({ isEditingTopic: isEditing }),
      setIsEditingConcept: (isEditing) => set({ isEditingConcept: isEditing }),

      // Complex Actions
      fetchTopics: async (userId: string) => {
        const { setTopicsLoading, setTopicsError, setTopics } = get();

        try {
          setTopicsLoading(true);
          setTopicsError(null);

          // Import the action dynamically to avoid circular dependencies
          const { fetchLearningTopics } = await import(
            "@/actions/clientActions/learning"
          );
          const topics = await fetchLearningTopics(userId);
          setTopics(topics);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch topics";
          setTopicsError(errorMessage);
          console.error("Error fetching learning topics:", error);
        } finally {
          setTopicsLoading(false);
        }
      },

      fetchTopicConcepts: async (topicId: string) => {
        const { setConceptsLoading, setConceptsError, setConcepts } = get();

        try {
          setConceptsLoading(true);
          setConceptsError(null);

          // Import the action dynamically to avoid circular dependencies
          const { fetchLearningConcepts } = await import(
            "@/actions/clientActions/learning"
          );
          const concepts = await fetchLearningConcepts(topicId);
          setConcepts(concepts);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch concepts";
          setConceptsError(errorMessage);
          console.error("Error fetching learning concepts:", error);
        } finally {
          setConceptsLoading(false);
        }
      },

      createTopic: async (topicData) => {
        const {
          setTopicsLoading,
          setTopicsError,
          addTopic,
          setIsCreatingTopic,
        } = get();

        try {
          setTopicsLoading(true);
          setTopicsError(null);

          // Import the action dynamically to avoid circular dependencies
          const { createLearningTopic } = await import(
            "@/actions/clientActions/learning"
          );
          const newTopic = await createLearningTopic(topicData);

          addTopic(newTopic);
          setIsCreatingTopic(false);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create topic";
          setTopicsError(errorMessage);
          console.error("Error creating learning topic:", error);
          throw error;
        } finally {
          setTopicsLoading(false);
        }
      },

      createConcept: async (conceptData) => {
        const {
          setConceptsLoading,
          setConceptsError,
          addConcept,
          setIsCreatingConcept,
        } = get();

        try {
          setConceptsLoading(true);
          setConceptsError(null);

          // Import the action dynamically to avoid circular dependencies
          const { createLearningConcept } = await import(
            "@/actions/clientActions/learning"
          );
          const newConcept = await createLearningConcept(conceptData);

          addConcept(newConcept);
          setIsCreatingConcept(false);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create concept";
          setConceptsError(errorMessage);
          console.error("Error creating learning concept:", error);
          throw error;
        } finally {
          setConceptsLoading(false);
        }
      },

      updateTopicProgress: (topicId: string) => {
        const { topics, concepts, updateTopic } = get();
        const topic = topics.find((t) => t.id === topicId);
        if (!topic) return;

        const topicConcepts = concepts.filter((c) => c.topicId === topicId);
        if (topicConcepts.length === 0) return;

        // Calculate progress based on concept completion
        const completedConcepts = topicConcepts.filter(
          (c) =>
            c.status === LearningConceptStatus.COMPLETED ||
            c.status === LearningConceptStatus.MASTERED,
        );
        const progress = Math.round(
          (completedConcepts.length / topicConcepts.length) * 100,
        );

        // Calculate total time spent
        const actualHours = topicConcepts.reduce(
          (total, concept) => total + (concept.timeSpent || 0),
          0,
        );

        // Update status based on progress
        let status = topic.status;
        if (progress === 100 && status !== LearningTopicStatus.COMPLETED) {
          status = LearningTopicStatus.COMPLETED;
        } else if (progress > 0 && status === LearningTopicStatus.ON_HOLD) {
          status = LearningTopicStatus.ACTIVE;
        }

        updateTopic(topicId, {
          progress,
          actualHours,
          status,
          completedAt: progress === 100 ? new Date() : topic.completedAt,
        });
      },

      // Reset functions
      resetTopics: () =>
        set({
          topics: [],
          selectedTopic: null,
          topicsLoading: false,
          topicsError: null,
        }),

      resetConcepts: () =>
        set({
          concepts: [],
          selectedConcept: null,
          conceptsLoading: false,
          conceptsError: null,
        }),

      resetAll: () => set({ ...initialState }),
    }),
    {
      name: "learning-store",
    },
  ),
);
