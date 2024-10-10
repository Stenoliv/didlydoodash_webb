import { Whiteboard } from "@/utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface WhiteboardStoreState {
    whiteboards: Whiteboard[] | null;
    setWhiteboards: (whiteboards: Whiteboard[] | null) => void;
}

export const useWhiteboards = create<WhiteboardStoreState>()(persist((set) => ({
    whiteboards: [],
    setWhiteboards: (whiteboards) => set({ whiteboards: whiteboards }),
}), {
    name: "whiteboard-store",
    storage: createJSONStorage(() => localStorage),
    partialize: (state => ({
        whiteboards: state.whiteboards
    }))
}))