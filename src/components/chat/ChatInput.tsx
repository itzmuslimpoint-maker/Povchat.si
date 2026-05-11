import { useState, useRef } from 'react'
import { Send, Smile, Mic, Paperclip } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

const EMOJIS = ['😊', '😂', '❤️', '😍', '🥺', '😎', '🔥', '✨', '💕', '😏', '🤔', '💪', '🎉', '🫂', '💙', '🌸', '👀', '🙈', '😭', '💀']

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!message.trim() || disabled) return
    onSend(message.trim())
    setMessage('')
    setShowEmoji(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji)
    inputRef.current?.focus()
  }

  return (
    <div className="border-t border-white/[0.07] bg-dark-100/95 backdrop-blur-xl">
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 p-3 border-b border-white/[0.05]">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="text-xl p-1 rounded-lg hover:bg-white/[0.05] transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <div className="flex items-center gap-2 p-3 md:p-4">
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className={`p-2.5 rounded-full transition-all duration-200 flex-shrink-0
            ${
              showEmoji
                ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                : 'bg-dark-200 border border-white/[0.07] text-text-secondary hover:text-white'
            }`}
        >
          <Smile className="w-5 h-5" />
        </button>

        <button className="p-2.5 rounded-full bg-dark-200 border border-white/[0.07] text-text-secondary hover:text-white transition-colors flex-shrink-0 hidden sm:flex">
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            className="w-full bg-dark-200 border border-white/[0.07] rounded-full px-5 py-2.5
              text-sm text-white placeholder-text-muted outline-none
              focus:border-accent-purple/40 transition-colors disabled:opacity-50"
          />
        </div>

        <button className="p-2.5 rounded-full bg-dark-200 border border-white/[0.07] text-text-secondary hover:text-white transition-colors flex-shrink-0 hidden sm:flex">
          <Mic className="w-5 h-5" />
        </button>

        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="p-2.5 rounded-full transition-all duration-300 flex-shrink-0
            bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue
            text-white shadow-lg shadow-accent-purple/30
            disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed
            hover:shadow-xl hover:shadow-accent-purple/40 hover:scale-105
            active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
