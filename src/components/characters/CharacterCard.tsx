import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare, Star } from 'lucide-react'
import { Character } from '../../types'

interface CharacterCardProps {
  character: Character
  index?: number
}

export default function CharacterCard({ character, index = 0 }: CharacterCardProps) {
  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Link
        to={`/character/${character.id}`}
        className="block glass-card overflow-hidden group cursor-pointer
          hover:border-accent-purple/30 transition-all duration-300
          hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-purple/10
          active:scale-[0.98]"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={character.img}
            alt={character.name}
            loading="lazy"
            className="w-full h-44 sm:h-52 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" />

          {/* Online badge */}
          {character.isOnline && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark/70 backdrop-blur-md">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse-soft" />
              <span className="text-[9px] font-bold text-white">Online</span>
            </div>
          )}

          {/* Gender */}
          <div
            className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
              ${
                character.gender === 'female'
                  ? 'bg-accent-pink/25 border border-accent-pink/40 text-accent-pink'
                  : 'bg-accent-blue/25 border border-accent-blue/40 text-accent-blue'
              }`}
          >
            {character.gender === 'female' ? '♀' : '♂'}
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5">
            <h3 className="font-display text-sm sm:text-base font-bold text-white drop-shadow-md">
              {character.name}, {character.age}
            </h3>
            <p
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                character.gender === 'female' ? 'text-accent-pink' : 'text-accent-blue'
              }`}
            >
              {character.role}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-4">
          <p className="text-[11px] sm:text-xs text-text-secondary line-clamp-2 leading-relaxed mb-2.5">
            {character.bio}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {character.tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold
                  bg-accent-purple/10 border border-accent-purple/20 text-accent-purple"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-text-muted mb-2.5">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{formatCount(character.messageCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-accent-gold fill-accent-gold" />
              <span>{character.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Chat button */}
          <Link
            to={`/chat/${character.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 w-full py-2 sm:py-2.5 rounded-full
              bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue
              text-white text-[11px] sm:text-xs font-bold transition-all duration-300
              hover:shadow-lg hover:shadow-accent-purple/30 hover:-translate-y-0.5
              active:scale-95"
          >
            <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Chat Now
          </Link>
        </div>
      </Link>
    </motion.div>
  )
}
