import { create } from "zustand";

export interface KanbanArchiveStoreState {
    open: boolean;
    setOpen: (val: boolean) => void;
    toggleOpen: () => void;
}

export const useKanbanArchiveStore = create<KanbanArchiveStoreState>()((set) => ({
    open: false,
    setOpen: (val) => set({ open: val }),
    toggleOpen: () => set(state => ({ open: !state.open }))
}))