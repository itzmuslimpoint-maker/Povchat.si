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
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/character/${character.id}`}
        className="block glass-card overflow-hidden group cursor-pointer
          hover:border-accent-purple/30 transition-all duration-300
          hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-purple/10"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={character.img}
            alt={character.name}
            loading="lazy"
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />

          {/* Online badge */}
          {character.isOnline && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark/70 backdrop-blur-md">
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse-soft" />
              <span className="text-[10px] font-bold text-white">Online</span>
            </div>
          )}

          {/* Gender */}
          <div
            className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${
                character.gender === 'female'
                  ? 'bg-accent-pink/20 border border-accent-pink/40 text-accent-pink'
                  : 'bg-accent-blue/20 border border-accent-blue/40 text-accent-blue'
              }`}
          >
            {character.gender === 'female' ? '♀' : '♂'}
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-3 left-3">
            <h3 className="font-display text-lg font-bold text-white">
              {character.name}, {character.age}
            </h3>
            <p
              className={`text-[11px] font-bold uppercase tracking-wider ${
                character.gender === 'female' ? 'text-accent-pink' : 'text-accent-blue'
              }`}
            >
              {character.role}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-3">
            {character.bio}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {character.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold
                  bg-accent-purple/10 border border-accent-purple/20 text-accent-purple"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-[11px] text-text-muted">
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
            className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-full
              bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue
              text-white text-xs font-bold transition-all duration-300
              hover:shadow-lg hover:shadow-accent-purple/30 hover:-translate-y-0.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat Now
          </Link>
        </div>
      </Link>
    </motion.div>
  )
}
