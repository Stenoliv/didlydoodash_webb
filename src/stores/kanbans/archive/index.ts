import { KanbanArchiveItem } from "@/utils/types";
import { create } from "zustand";

export interface KanbanArchiveStoreState {
    open: boolean;
    setOpen: (val: boolean) => void;
    toggleOpen: () => void;
    archive: KanbanArchiveItem[],
    setArchive: (data: KanbanArchiveItem[]) => void;
    addArchive: (data: KanbanArchiveItem) => void;
    removeArchive: (date: KanbanArchiveItem) => void;
}

export const useKanbanArchiveStore = create<KanbanArchiveStoreState>()((set) => ({
    open: false,
    setOpen: (val) => set({ open: val }),
    toggleOpen: () => set(state => ({ open: !state.open })),
    archive: [],
    setArchive: (data) => set({ archive: data}),
    addArchive: (data) => set(state => {
        const updatedArchive = state.archive;
        updatedArchive.push(data)
        return {
            ...state,
            archive: updatedArchive
        }
    }),
    removeArchive: (data) => set(state => {
        const updatedArchive = state.archive;
        updatedArchive.filter((a) => a.id === data.id)
        return {
            ...state,
            archive: updatedArchive
        }
    })
}))