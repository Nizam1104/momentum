import { create } from "zustand"

export interface AppState {
    splashed: boolean,
    setSplashed: (status: boolean) => void
}

export const useAppStore = create<AppState>((set, get) => ({
    splashed: false,
    setSplashed: (isSplashed) => set({ splashed: isSplashed })
}))
