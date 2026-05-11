import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Message, Character } from '../../types'
import { useChatStore } from '../../stores/chatStore'

interface ChatMessageProps {
  message: Message
  character: Character
}

export default function ChatMessage({ message, character }: ChatMessageProps) {
  const { toggleLike } = useChatStore()
  const isUser = message.role === 'user'

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-2.5 max-w-[82%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
    >
      {/* Avatar */}
      {!isUser ? (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
          <img src={character.img} alt={character.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-sm">
          👤
        </div>
      )}

      {/* Bubble */}
      <div className="space-y-1">
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words
            ${
              isUser
                ? 'bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue text-white rounded-br-sm'
                : 'bg-dark-200 border border-white/[0.07] text-text-primary rounded-bl-sm'
            }`}
        >
          {message.content}
        </div>

        {/* Meta */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? 'justify-end' : ''}`}>
          <span className="text-[10px] text-text-muted">{formatTime(message.timestamp)}</span>
          {!isUser && (
            <button
              onClick={() => toggleLike(message.id)}
              className="transition-transform hover:scale-125"
            >
              <Heart
                className={`w-3 h-3 transition-colors ${
                  message.liked ? 'text-accent-pink fill-accent-pink' : 'text-text-muted'
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
