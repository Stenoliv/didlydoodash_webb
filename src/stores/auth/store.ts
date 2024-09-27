import { Tokens, User } from "@/utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// import { authStorage } from "./storage";

export interface AuthStoreState {
    user: User | null;
    setUser: (user: User | null) => void;
    tokens: Tokens | null;
    setTokens: (tokens: Tokens | null) => void;
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            tokens: null,
            setTokens: (tokens) => set({ tokens })
        }),{
            name: "auth-store",
            // storage: createJSONStorage(() => authStorage)
            storage: createJSONStorage(() => localStorage)
        }
    )
)