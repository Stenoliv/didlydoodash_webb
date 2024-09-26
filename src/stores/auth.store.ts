import { User } from "@/utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthStoreState {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user })
        }),{
            name: "auth-store",
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)