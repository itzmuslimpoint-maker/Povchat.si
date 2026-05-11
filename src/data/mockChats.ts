import { ChatSession } from '../types'

export const mockChatHistory: ChatSession[] = [
  {
    id: 'chat-1',
    characterId: 'f0',
    messages: [],
    lastMessage: "I was literally just thinking about you! How's your day going? ✨",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'chat-2',
    characterId: 'm0',
    messages: [],
    lastMessage: "That joke you told earlier still has me laughing 😂",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'chat-3',
    characterId: 'f2',
    messages: [],
    lastMessage: "Ready for our next adventure? I found something amazing 🌟",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'chat-4',
    characterId: 'm3',
    messages: [],
    lastMessage: "The philosophical question you asked really got me thinking...",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'chat-5',
    characterId: 'f5',
    messages: [],
    lastMessage: "I wrote something for you. Want to hear it? 🌙",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
]
