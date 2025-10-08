import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Road, Milestone } from "@prisma/client";
import { getRoads } from "@/lib/serverActions/road";

interface RoadWithMilestones extends Road {
  milestones: Milestone[];
}

interface RoadStore {
  // State
  roads: RoadWithMilestones[];
  selectedRoad: RoadWithMilestones | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchRoads: (userId: string) => Promise<void>;
  setRoads: (roads: RoadWithMilestones[]) => void;
  setSelectedRoad: (road: RoadWithMilestones | null) => void;
  addRoad: (road: RoadWithMilestones) => void;
  updateRoad: (id: string, road: Partial<Road>) => void;
  deleteRoad: (id: string) => void;
  addMilestone: (roadId: string, milestone: Milestone) => void;
  updateMilestone: (roadId: string, milestoneId: string, milestone: Partial<Milestone>) => void;
  deleteMilestone: (roadId: string, milestoneId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  roads: [],
  selectedRoad: null,
  loading: false,
  error: null,
};

export const useRoadStore = create<RoadStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchRoads: async (userId: string) => {
        set({ loading: true, error: null }, false, "fetchRoads/start");

        try {
          const roads = await getRoads(userId) as RoadWithMilestones[];
          set({ roads, loading: false }, false, "fetchRoads/success");
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch roads",
            loading: false
          }, false, "fetchRoads/error");
        }
      },

      setRoads: (roads) => set({ roads }, false, "setRoads"),

      setSelectedRoad: (road) => set({ selectedRoad: road }, false, "setSelectedRoad"),

      addRoad: (road) => set(
        (state) => ({ roads: [...state.roads, road] }),
        false,
        "addRoad"
      ),

      updateRoad: (id, updatedRoad) => set(
        (state) => ({
          roads: state.roads.map((road) =>
            road.id === id ? { ...road, ...updatedRoad } : road
          ),
          selectedRoad:
            state.selectedRoad?.id === id
              ? { ...state.selectedRoad, ...updatedRoad }
              : state.selectedRoad,
        }),
        false,
        "updateRoad"
      ),

      deleteRoad: (id) => set(
        (state) => ({
          roads: state.roads.filter((road) => road.id !== id),
          selectedRoad: state.selectedRoad?.id === id ? null : state.selectedRoad,
        }),
        false,
        "deleteRoad"
      ),

      addMilestone: (roadId, milestone) => set(
        (state) => ({
          roads: state.roads.map((road) =>
            road.id === roadId
              ? { ...road, milestones: [...road.milestones, milestone] }
              : road
          ),
          selectedRoad:
            state.selectedRoad?.id === roadId
              ? { ...state.selectedRoad, milestones: [...state.selectedRoad.milestones, milestone] }
              : state.selectedRoad,
        }),
        false,
        "addMilestone"
      ),

      updateMilestone: (roadId, milestoneId, updatedMilestone) => set(
        (state) => ({
          roads: state.roads.map((road) =>
            road.id === roadId
              ? {
                  ...road,
                  milestones: road.milestones.map((milestone) =>
                    milestone.id === milestoneId
                      ? { ...milestone, ...updatedMilestone }
                      : milestone
                  ),
                }
              : road
          ),
          selectedRoad:
            state.selectedRoad?.id === roadId
              ? {
                  ...state.selectedRoad,
                  milestones: state.selectedRoad.milestones.map((milestone) =>
                    milestone.id === milestoneId
                      ? { ...milestone, ...updatedMilestone }
                      : milestone
                  ),
                }
              : state.selectedRoad,
        }),
        false,
        "updateMilestone"
      ),

      deleteMilestone: (roadId, milestoneId) => set(
        (state) => ({
          roads: state.roads.map((road) =>
            road.id === roadId
              ? {
                  ...road,
                  milestones: road.milestones.filter((milestone) => milestone.id !== milestoneId),
                }
              : road
          ),
          selectedRoad:
            state.selectedRoad?.id === roadId
              ? {
                  ...state.selectedRoad,
                  milestones: state.selectedRoad.milestones.filter(
                    (milestone) => milestone.id !== milestoneId
                  ),
                }
              : state.selectedRoad,
        }),
        false,
        "deleteMilestone"
      ),

      setLoading: (loading) => set({ loading }, false, "setLoading"),

      setError: (error) => set({ error }, false, "setError"),

      clearError: () => set({ error: null }, false, "clearError"),

      reset: () => set(initialState, false, "reset"),
    }),
    {
      name: "road-store",
    }
  )
);