import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare, Star, Heart, Shield, Users, ArrowLeft } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { getCharacterById, characters } from '../data/characters'
import CharacterCard from '../components/characters/CharacterCard'

export default function CharacterProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const character = getCharacterById(id || '')

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-text-secondary">Character not found</p>
          <Link to="/explore" className="btn-primary mt-4 inline-flex">
            Browse Characters
          </Link>
        </div>
      </div>
    )
  }

  const similarCharacters = characters
    .filter((c) => c.id !== character.id && c.personality === character.personality)
    .slice(0, 4)

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }

  return (
    <div className="min-h-screen py-6 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden mb-8"
        >
          <div className="relative">
            {/* Cover Image */}
            <div className="h-48 md:h-64 overflow-hidden">
              <img
                src={character.img}
                alt={character.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-dark-200/50 to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6 -mt-16">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                <div className="relative">
                  <img
                    src={character.img}
                    alt={character.name}
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-dark-200 shadow-2xl"
                  />
                  {character.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-green rounded-full border-3 border-dark-200" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="font-display text-2xl md:text-3xl font-black">
                      {character.name}, {character.age}
                    </h1>
                    <Badge variant={character.gender === 'female' ? 'pink' : 'blue'}>
                      {character.gender === 'female' ? '♀' : '♂'}
                    </Badge>
                  </div>
                  <p className={`text-sm font-bold ${character.gender === 'female' ? 'text-accent-pink' : 'text-accent-blue'}`}>
                    {character.role}
                  </p>
                  <p className="text-sm text-text-secondary mt-2 max-w-lg leading-relaxed">
                    {character.description}
                  </p>
                </div>

                <Link
                  to={`/chat/${character.id}`}
                  className="btn-primary px-8 py-3 flex-shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat Now
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats & Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-bold text-text-secondary mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </div>
                <span className="text-sm font-bold">{formatCount(character.messageCount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Star className="w-4 h-4 text-accent-gold" />
                  Rating
                </div>
                <span className="text-sm font-bold">{character.rating.toFixed(1)} / 5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Heart className="w-4 h-4 text-accent-pink" />
                  Favorites
                </div>
                <span className="text-sm font-bold">{formatCount(Math.floor(character.messageCount * 0.3))}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Users className="w-4 h-4" />
                  Users Chatting
                </div>
                <span className="text-sm font-bold">{Math.floor(Math.random() * 500 + 100)}</span>
              </div>
            </div>
          </motion.div>

          {/* Personality & Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-bold text-text-secondary mb-4">Personality</h3>
            <Badge variant="purple" className="mb-4 capitalize">
              {character.personality}
            </Badge>
            <div className="flex flex-wrap gap-2 mt-3">
              {character.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-accent-purple/10 border border-accent-purple/20 text-accent-purple"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.05]">
              <p className="text-xs text-text-muted">Category</p>
              <p className="text-sm font-semibold capitalize mt-1">{character.category}</p>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-bold text-text-secondary mb-4">About</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {character.bio}
            </p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Shield className="w-3.5 h-3.5" />
              <span>Safe & Private Conversations</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse-soft" />
              <span className="text-xs text-accent-green font-semibold">Currently Online</span>
            </div>
          </motion.div>
        </div>

        {/* Similar Characters */}
        {similarCharacters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-display text-xl font-bold mb-4">
              Similar <span className="gradient-text">Characters</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarCharacters.map((char, i) => (
                <CharacterCard key={char.id} character={char} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
