import { Chat, ChatMember } from "@/utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ChatStoreType {
    chats: Chat[],
    openChatId: string | null
    selectChat: (chat: string | null) => void;
    addMember: (id: string, user: ChatMember) => void;
    removeMember: (id: string, user: ChatMember) => void;
    setChats: (chats: Chat[]) => void;
    addChat: (chat: Chat) => void;
}

export const useChatStore = create<ChatStoreType>()(persist((set) => ({
    chats: [],
    openChatId: null,
    selectChat: (chat) => set({ openChatId: chat }),
    addMember: (id, user) => set((state) => {
        const updatedChats = state.chats.map((chat) => {
            if (chat.id === id) {
              // Return a new chat object with the updated members array
                return {
                    ...chat,
                    members: [...chat.members, user]
                };
            }
            return chat; // Return the unchanged chat
        }); 
        return { chats: updatedChats };
    }),
    removeMember: (id, user) => set((state) => {
        const updatedChats = state.chats.map((chat) => {
            if (chat.id === id) {
              // Return a new chat object with the updated members array
                return {
                    ...chat,
                    members: chat.members.filter((member) => member.id !== user.id)
                };
            }
            return chat; // Return the unchanged chat
        }); 
        return { chats: updatedChats };
    }),
    setChats: (chats) => set({ chats }),
    addChat: (chat) => set((state) => ({ chats: [...state.chats, { ...chat, unread: 0 } ]})),
}), {
    name: "chat-store",
    storage: createJSONStorage(() => localStorage),
    partialize: ((state) => ({
        chats: state.chats,
        chatId: state.openChatId  
    }))
}))