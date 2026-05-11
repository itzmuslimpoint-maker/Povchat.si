import { create } from 'zustand'
import { Message, ChatSession } from '../types'
import { mockChatHistory } from '../data/mockChats'

interface ChatState {
  sessions: ChatSession[]
  currentMessages: Message[]
  isTyping: boolean
  isSidebarOpen: boolean

  addMessage: (msg: Message) => void
  setMessages: (msgs: Message[]) => void
  setTyping: (typing: boolean) => void
  clearMessages: () => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleLike: (messageId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: mockChatHistory,
  currentMessages: [],
  isTyping: false,
  isSidebarOpen: true,

  addMessage: (msg) =>
    set((state) => ({
      currentMessages: [...state.currentMessages, msg],
    })),

  setMessages: (msgs) => set({ currentMessages: msgs }),

  setTyping: (typing) => set({ isTyping: typing }),

  clearMessages: () => set({ currentMessages: [] }),

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  toggleLike: (messageId) =>
    set((state) => ({
      currentMessages: state.currentMessages.map((msg) =>
        msg.id === messageId ? { ...msg, liked: !msg.liked } : msg
      ),
    })),
}))
