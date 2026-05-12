import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Phone, MoreVertical, Info, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import TypingIndicator from '../components/chat/TypingIndicator'
import { getCharacterById } from '../data/characters'
import { getAIResponse, getSmartFallback } from '../lib/gemini'
import { useChatStore } from '../stores/chatStore'
import { Message } from '../types'

const QUICK_PROMPTS = [
  { label: '😂 Joke', msg: 'Tell me a really good joke!' },
  { label: '💕 Flirt', msg: 'Say something flirty' },
  { label: '🥺 Comfort', msg: 'I had a really bad day today' },
  { label: '🎭 Roleplay', msg: "Let's do a fun roleplay" },
  { label: '🤫 Secret', msg: 'Tell me your deepest secret' },
  { label: '✨ Vibe', msg: 'What makes you unique?' },
]

export default function ChatPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const character = getCharacterById(id || '')
  const { currentMessages, addMessage, isTyping, setTyping, clearMessages } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showCharInfo, setShowCharInfo] = useState(false)

  useEffect(() => {
    if (!character) {
      navigate('/explore')
      return
    }
    clearMessages()
    // Send greeting after a short delay
    const timer = setTimeout(() => {
      const greeting: Message = {
        id: `msg-greeting-${Date.now()}`,
        role: 'assistant',
        content: character.greeting,
        timestamp: new Date(),
      }
      addMessage(greeting)
    }, 500)

    return () => clearTimeout(timer)
  }, [id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, isTyping])

  const handleSend = async (text: string) => {
    if (!character || isTyping) return

    // Add user message
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    addMessage(userMsg)
    setTyping(true)

    // Capture current history BEFORE the async call (includes all previous messages)
    // getAIResponse will append the new userMessage itself
    const historySnapshot = [...currentMessages]

    // Small delay for natural feel
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800))

    try {
      const reply = await getAIResponse(character, historySnapshot, text)
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }
      addMessage(aiMsg)
    } catch (error: unknown) {
      const err = error as Error
      console.error('Chat error:', err.message)
      // Fall back to smart responses
      const fallbackReply = getSmartFallback(text, character)
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date(),
      }
      addMessage(aiMsg)

      if (err.message === 'bad_key') {
        toast.error('AI key issue — using smart mode')
      } else if (err.message === 'rate_limit') {
        toast.error('Too many messages — wait a moment')
      }
      // For other errors, stay silent (fallback handles it)
    } finally {
      setTyping(false)
    }
  }

  if (!character) return null

  return (
    <div className="fixed inset-0 flex flex-col bg-dark z-50">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_35%_at_50%_0%,rgba(168,85,247,0.04),transparent_60%)]" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-3 sm:px-4 py-3 glass border-b border-white/[0.07] flex-shrink-0">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-dark-200 border border-white/[0.07] text-white hover:border-accent-purple/30 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <Link to={`/character/${character.id}`} className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={character.img}
              alt={character.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-accent-pink/50"
            />
            {character.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-green rounded-full border-2 border-dark" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-display text-sm font-bold truncate">{character.name}, {character.age}</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse-soft" />
              <span className="text-[10px] text-accent-green font-semibold">Online</span>
              <span className="text-[10px] text-text-muted ml-1 hidden sm:inline">· Gemini AI</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setShowCharInfo(!showCharInfo)}
            className="p-2 rounded-full bg-dark-200 border border-white/[0.07] text-text-secondary hover:text-white hover:border-accent-purple/30 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-dark-200 border border-white/[0.07] text-text-secondary hover:text-white transition-colors hidden sm:flex">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-dark-200 border border-white/[0.07] text-text-secondary hover:text-white transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Character Info Panel (slide down) */}
      <AnimatePresence>
        {showCharInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/[0.05] bg-dark-100/80 backdrop-blur-md flex-shrink-0"
          >
            <div className="px-4 py-3 flex items-center gap-3">
              <img
                src={character.img}
                alt={character.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{character.bio}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {character.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                to={`/character/${character.id}`}
                className="text-[10px] font-bold text-accent-purple hover:text-accent-pink transition-colors flex-shrink-0"
              >
                View Profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Prompts */}
      <div className="flex gap-2 px-3 sm:px-4 py-2.5 overflow-x-auto border-b border-white/[0.05] bg-dark-100/50 flex-shrink-0 scrollbar-hide">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.label}
            onClick={() => handleSend(prompt.msg)}
            disabled={isTyping}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold
              bg-dark-200 border border-white/[0.07] text-text-secondary
              hover:border-accent-purple/30 hover:text-white hover:bg-accent-purple/5
              transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
              active:scale-95"
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 flex flex-col gap-3 relative z-10">
        {currentMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} character={character} />
        ))}
        <AnimatePresence>
          {isTyping && <TypingIndicator character={character} />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  )
}
