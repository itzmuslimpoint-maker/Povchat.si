import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Phone, MoreVertical, Key, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import TypingIndicator from '../components/chat/TypingIndicator'
import { getCharacterById } from '../data/characters'
import { getAIResponse, getSmartFallback, hasApiKey, setGeminiKey } from '../lib/gemini'
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
  const { currentMessages, addMessage, setMessages, isTyping, setTyping, clearMessages } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showApiModal, setShowApiModal] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [apiStatus, setApiStatus] = useState<'idle' | 'connected' | 'fallback'>('idle')

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

    setApiStatus(hasApiKey() ? 'connected' : 'fallback')
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

    // Simulate realistic delay
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 1000))

    try {
      const reply = await getAIResponse(character, currentMessages, text)
      setApiStatus('connected')
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }
      addMessage(aiMsg)
    } catch (error: unknown) {
      const err = error as Error
      // Fall back to smart responses
      const fallbackReply = getSmartFallback(text, character)
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date(),
      }
      addMessage(aiMsg)
      setApiStatus('fallback')

      if (err.message === 'no_key') {
        // Silent - don't annoy user
      } else if (err.message === 'bad_key') {
        toast.error('Invalid API key. Tap 🔑 to update.')
      }
    } finally {
      setTyping(false)
    }
  }

  const handleSaveKey = () => {
    if (!apiKeyInput.trim()) return
    setGeminiKey(apiKeyInput.trim())
    setShowApiModal(false)
    setApiStatus('connected')
    toast.success('Gemini API key saved! AI mode active 🚀')
  }

  if (!character) return null

  return (
    <div className="fixed inset-0 flex flex-col bg-dark z-50">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_35%_at_50%_0%,rgba(168,85,247,0.05),transparent_60%)]" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-3 glass border-b border-white/[0.07] flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-dark-200 border border-white/[0.07] text-white hover:border-accent-purple/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

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
            <span className="text-[10px] text-accent-green font-semibold">Online · Gemini AI</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiModal(true)}
            className="p-2 rounded-full bg-dark-200 border border-white/[0.07] text-text-secondary hover:text-white hover:border-accent-purple/30 transition-colors"
            title="API Settings"
          >
            <Key className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-dark-200 border border-white/[0.07] text-text-secondary hover:text-white transition-colors hidden sm:flex">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-dark-200 border border-white/[0.07] text-text-secondary hover:text-white transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* API Status Pill */}
      <AnimatePresence>
        {apiStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold
              ${apiStatus === 'connected' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-gold/10 text-accent-gold'}`}
          >
            <Sparkles className="w-3 h-3" />
            {apiStatus === 'connected' ? 'Gemini AI Connected' : 'Smart Fallback Mode · Add API key for full AI'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Prompts */}
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto border-b border-white/[0.05] bg-dark-100/50 flex-shrink-0 scrollbar-hide">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.label}
            onClick={() => handleSend(prompt.msg)}
            disabled={isTyping}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold
              bg-dark-200 border border-white/[0.07] text-text-secondary
              hover:border-accent-purple/30 hover:text-white hover:bg-accent-purple/5
              transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 relative z-10">
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

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowApiModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 max-w-md w-full text-center"
            >
              <div className="text-4xl mb-4">🔑</div>
              <h2 className="font-display text-2xl font-black mb-2">
                <span className="gradient-text">Gemini API Key</span>
              </h2>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                Add your Google Gemini API key for full AI-powered conversations.
                Get a free key from{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener"
                  className="text-accent-purple hover:text-accent-pink transition-colors"
                >
                  aistudio.google.com
                </a>
              </p>

              <div className="bg-dark-200 rounded-xl p-4 mb-4 text-left text-xs text-text-secondary space-y-2">
                <p><span className="gradient-text font-bold">1.</span> Go to aistudio.google.com/apikey</p>
                <p><span className="gradient-text font-bold">2.</span> Click "Create API Key"</p>
                <p><span className="gradient-text font-bold">3.</span> Copy and paste it below</p>
              </div>

              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full px-5 py-3 rounded-full bg-dark-200 border border-white/[0.07]
                  text-sm text-white placeholder-text-muted outline-none
                  focus:border-accent-purple/40 transition-colors mb-4"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
              />

              <button
                onClick={handleSaveKey}
                className="btn-primary w-full py-3"
              >
                Save Key & Activate AI
              </button>

              <button
                onClick={() => setShowApiModal(false)}
                className="mt-3 text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                Skip — use smart fallback instead
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
