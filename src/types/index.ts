export interface Character {
  id: string
  name: string
  age: number
  gender: 'female' | 'male'
  role: string
  bio: string
  description: string
  img: string
  personality: 'romantic' | 'adventurous' | 'intellectual' | 'funny'
  tags: string[]
  category: 'anime' | 'assistant' | 'roleplay' | 'companion' | 'creative'
  greeting: string
  messageCount: number
  rating: number
  isOnline: boolean
  isPublic: boolean
  createdBy?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  liked?: boolean
}

export interface ChatSession {
  id: string
  characterId: string
  messages: Message[]
  lastMessage: string
  lastMessageTime: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'premium'
  messagesUsed: number
  messagesLimit: number
  joinedAt: Date
  favoriteCharacters: string[]
}
