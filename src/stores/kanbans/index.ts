import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Kanban, KanbanCategory, KanbanItem } from "@/utils/types";


export interface KanbanStoreState {
    kanbans: Kanban[];
    setKanbans: (kanbans: Kanban[]) => void;
    addKanban: (kanban: Kanban) => void;
    removeKanban: (kanban: Kanban) => void;

    // selected
    kanban: Kanban | null
    selectKanban: (kanban: Kanban | null) => void;

    // Kanban handling:
    updateKanban: (updates: any) => void;

    // Category handling:
    addCategory: (category: KanbanCategory) => void;
    updateCategory: (category: KanbanCategory) => void;
    updateCategoryName: (id: string, name: string) => void;
    removeCategory: (category: KanbanCategory) => void;

    // Item handling:
    addItem: (id: string, item: KanbanItem) => void;
    moveItem: (id: string, oldId: string, newId: string) => void;
    updateItem: (id: string, itemId: string, updates: any) => void;
    removeItem: (id: string, itemId: string) => void;
    getItem: (id: string, itemId: string) => KanbanItem | null;
}

export const useKanbanStore = create<KanbanStoreState>()(
    persist((set, get) => ({
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

        // Kanban handling
        updateKanban: (updates) => set(state => {
            if (!state.kanban) return state;
            return {
                ...state,
                kanban: { ...state.kanban, ...updates }
            }
        }),

        // Category handling
        addCategory: (category) => set((state) => {
            const newCategory = {...category, items: []}
            return {
                ...state,
                kanban: state.kanban ? { 
                ...state.kanban, 
                categories: [...state.kanban.categories, newCategory] 
            } : null,
        }
        }),
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

        // Item handling:
        addItem: (id, item) => set(state => {
            if (!state.kanban || state.kanban.categories && state.kanban.categories.length <= 0) return state
            const categoryIndex = state.kanban.categories.findIndex((k) => k.id === id);
            if (categoryIndex !== -1) {
                const updatedKanban = {
                    ...state.kanban,
                    categories: [
                        ...state.kanban.categories.slice(0, categoryIndex),
                        {
                            ...state.kanban.categories[categoryIndex],
                            items: [...state.kanban.categories[categoryIndex].items || [], item]
                        },
                        ...state.kanban.categories.slice(categoryIndex + 1)
                    ]
                }
                return {
                    ...state,
                    kanban: updatedKanban
                }
            }
            return state
        }),
        moveItem: (id, oldId, newId) => set(state => {
            if (!state.kanban || !state.kanban.categories) return state;
            const oldCategoryIndex = state.kanban.categories.findIndex(k => k.id === oldId);
            const newCategoryIndex = state.kanban.categories.findIndex(k => k.id === newId);
            if (oldCategoryIndex !== -1 && newCategoryIndex !== -1) {
                // Find the item in the old category
                const item = state.kanban.categories[oldCategoryIndex].items.find(i => i.id === id);
                if (!item) return state;

                // Remove the item from the old category
                const updatedOldCategory = {
                    ...state.kanban.categories[oldCategoryIndex],
                    items: state.kanban.categories[oldCategoryIndex].items.filter(i => i.id !== id),
                };

                // Add the item to the new category
                const updatedNewCategory = {
                    ...state.kanban.categories[newCategoryIndex],
                    items: [...state.kanban.categories[newCategoryIndex].items || [], item],
                };

                // Update the categories array by replacing the old and new categories
                const updatedCategories = [...state.kanban.categories];
                updatedCategories[oldCategoryIndex] = updatedOldCategory;
                updatedCategories[newCategoryIndex] = updatedNewCategory;
                // Return the updated state
                return {
                    ...state,
                    kanban: {
                            ...state.kanban,
                            categories: updatedCategories,
                },
            }}
            return state;
        }),
        removeItem: (id, itemId) => set(state => {
            if (!state.kanban || !state.kanban.categories) return state;
            const categoryIndex = state.kanban.categories.findIndex((k) => k.id === id);
            if (categoryIndex !== -1) {
                const updatedKanban = {
                    ...state.kanban,
                    categories: [
                        ...state.kanban.categories.slice(0, categoryIndex),
                        {
                            ...state.kanban.categories[categoryIndex],
                            items: state.kanban.categories[categoryIndex].items.filter((i) => i.id !== itemId)
                        },
                        ...state.kanban.categories.slice(categoryIndex + 1)
                    ]
                };
                return {
                    kanbans: state.kanbans,
                    kanban: updatedKanban
                }
            }
            return state;
        }),
        updateItem: (id, itemId, updates) => set(state => {
            if (!state.kanban || !state.kanban.categories) return state;
            const categoryIndex = state.kanban.categories.findIndex((k) => k.id === id);
            if (categoryIndex !== -1) {
                const updatedKanban = {
                    ...state.kanban,
                    categories: [
                        ...state.kanban.categories.slice(0, categoryIndex),
                        {
                            ...state.kanban.categories[categoryIndex],
                            items: state.kanban.categories[categoryIndex].items.map((i) => {
                                if (i.id === itemId) return { ...i, ...updates };
                                else return i;
                            })
                        },
                        ...state.kanban.categories.slice(categoryIndex + 1)
                    ]
                };
                return {
                    kanbans: state.kanbans,
                    kanban: updatedKanban
                }
            }
            return state;
        }),
        getItem: (id, itemId) => get().kanban?.categories.find((c) => c.id === id)?.items.find((i) => i.id === itemId) || null,
        }), {
        name: "kanban-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state => ({
            kanbans: state.kanbans,
            kanban: state.kanban
        }))
    })
)