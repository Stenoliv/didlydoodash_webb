import { Kanban, KanbanCategory } from "@/utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export interface KanbanStoreState {
    kanbans: Kanban[];
    setKanbans: (kanbans: Kanban[]) => void;
    addKanban: (kanban: Kanban) => void;
    removeKanban: (kanban: Kanban) => void;

    // selected
    kanban: Kanban | null
    selectKanban: (kanban: Kanban | null) => void;
    // Category handling
    addCategory: (category: KanbanCategory) => void;
    removeCategory: (category: KanbanCategory) => void;
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
        })),

        // Select kanba
        kanban: null,
        selectKanban: (kanban) => set((state) => {
                if (!kanban) return { kanban: null}
                const selectedKanban = state.kanbans.find((k) => k.id === kanban.id);
                return { kanban: selectedKanban || null}
            }),
        // Category handling
        addCategory: (category) => set((state) => ({
            kanban: state.kanban ? { 
                ...state.kanban, 
                categories: [...state.kanban.categories, category] 
            } : null,
        })),
        removeCategory: (category) => set((state) => ({
            kanban: state.kanban ? { 
                ...state.kanban, 
                categories: state.kanban.categories.filter((cat) => cat.id !== category.id)
            } : null,
        })),

        }), {
        name: "kanban-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state => ({
            kanbans: state.kanbans,
            kanban: state.kanban
        }))
    })
)