import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Kanban, KanbanCategory } from "@/utils/types";


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
    updateCategory: (category: KanbanCategory) => void;
    updateCategoryName: (id: string, name: string) => void;
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
        selectKanban: (kanban) => set({ kanban: kanban }),
        // Category handling
        addCategory: (category) => set((state) => ({
            kanban: state.kanban ? { 
                ...state.kanban, 
                categories: [...state.kanban.categories, category] 
            } : null,
        })),
        updateCategory: (category) => set((state) => {
            if (!state.kanban) return state;
            const categoryIdx = state.kanban?.categories.findIndex((c) => c.id === category.id);
            if (categoryIdx !== -1) {
                const updatedCategories = state.kanban.categories;
                updatedCategories[categoryIdx] = { ...updatedCategories[categoryIdx], ...category };
                return { 
                    ...state,
                    kanban: { 
                        ...state.kanban, 
                        categories: updatedCategories
                    }
                };
            }
            return state;
        }),
        updateCategoryName: (id, name) => set((state) => {
            if (!state.kanban) return state;
            const categoryIndex = state.kanban.categories.findIndex((c) => c.id === id);
            if (categoryIndex === -1) return state;
            const updatedCategories = state.kanban.categories.map((category, index) => 
                index === categoryIndex ? { ...category, name } : category
            );
            return { 
                kanban: {
                    ...state.kanban,
                    categories: updatedCategories
                } 
            };
        }),
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