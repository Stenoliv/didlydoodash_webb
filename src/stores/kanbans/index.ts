import { Kanban } from "@/utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export interface KanbanStoreState {
    kanbans: Kanban[];
    setKanbans: (kanbans: Kanban[]) => void;
    addKanban: (kanban: Kanban) => void;
    removeKanban: (kanban: Kanban) => void;
}

export const useKanbanStore = create<KanbanStoreState>()(
    persist((set) => ({
        kanbans: [],
        setKanbans: (kanbans) => set({ kanbans: kanbans }),
        addKanban: (kanban) => set(state => ({
            kanbans: [...state.kanbans, kanban]
        })),
        removeKanban: (kanban) => set(state => ({
            kanbans: state.kanbans?.filter((f) => f.id !== kanban.id)
        }))
    }), {
        name: "kanban-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state => ({
            kanbans: state.kanbans
        }))
    })
)