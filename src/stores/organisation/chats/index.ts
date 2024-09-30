import { Chat } from "@/utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ChatStoreType {
    chats: Chat[],
    setChats: (chats: Chat[]) => void;
    addChat: (chat: Chat) => void;
    openChat: Chat | null,
    setOpenChat: (chat: Chat | null) => void;
}

export const useChatStore = create<ChatStoreType>()(persist((set) => ({
    chats: [],
    setChats: (chats) => set({ chats}),
    addChat: (chat) => set((state) => ({ chats: [...state.chats, chat ]})),
    openChat: null,
    setOpenChat: (chat) => set({ openChat: chat })
}), {
    name: "chat-store",
    storage: createJSONStorage(() => localStorage)
}))