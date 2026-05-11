import { motion } from 'framer-motion'
import { Character } from '../../types'

interface TypingIndicatorProps {
  character: Character
}

export default function TypingIndicator({ character }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-2.5 self-start"
    >
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
        <img src={character.img} alt={character.name} className="w-full h-full object-cover" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-dark-200 border border-white/[0.07] flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-accent-purple"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.8,
              delay: i * 0.15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
