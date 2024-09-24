import { User } from "@/utils/types";
import { create } from "zustand";

export interface AuthStoreState {
    user: User | null;
}

export const useAuthStore = create<AuthStoreState>()((get, set) => ({
    user: null,
}))