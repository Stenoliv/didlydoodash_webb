import { Chat } from "@/utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ChatStoreType {
    chats: Chat[],
    setChats: (chats: Chat[]) => void;
    addChat: (chat: Chat) => void;
    chatId: string | null
    selectChat: (chat: string | null) => void;
}

export const useChatStore = create<ChatStoreType>()(persist((set) => ({
    chats: [],
    setChats: (chats) => set({ chats}),
    addChat: (chat) => set((state) => ({ chats: [...state.chats, chat ]})),
    chatId: null,
    selectChat: (chat) => set({ chatId: chat })
}), {
    name: "chat-store",
    storage: createJSONStorage(() => localStorage),
    partialize: ((state) => ({
        chats: state.chats,
        openChat: state.chatId  
    }))
}))