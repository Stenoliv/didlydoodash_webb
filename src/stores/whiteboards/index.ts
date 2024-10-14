import { Whiteboard } from "@/utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface WhiteboardStoreState {
    whiteboards: Whiteboard[];
    setWhiteboards: (whiteboards: Whiteboard[]) => void;
    addWhiteboard: (kanban: Whiteboard) => void;
}

export const useWhiteboards = create<WhiteboardStoreState>()(persist((set) => ({
    whiteboards: [],
    setWhiteboards: (whiteboards) => set({ whiteboards: whiteboards }),
    addWhiteboard: (whiteboard) => set(state => ({
        whiteboards: [...state.whiteboards, whiteboard]
    })),
}), {
    name: "whiteboard-store",
    storage: createJSONStorage(() => localStorage),
    partialize: (state => ({
        whiteboards: state.whiteboards
    }))
}))