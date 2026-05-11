import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import Badge from '../components/ui/Badge'
import CharacterCard from '../components/characters/CharacterCard'
import { characters, categories, personalityFilters } from '../data/characters'

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPersonality, setSelectedPersonality] = useState('all')
  const [selectedGender, setSelectedGender] = useState<'all' | 'female' | 'male'>('all')
  const [visibleCount, setVisibleCount] = useState(20)

  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      const matchesSearch = !searchQuery || 
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.role.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || char.category === selectedCategory
      const matchesPersonality = selectedPersonality === 'all' || char.personality === selectedPersonality
      const matchesGender = selectedGender === 'all' || char.gender === selectedGender
      return matchesSearch && matchesCategory && matchesPersonality && matchesGender
    })
  }, [searchQuery, selectedCategory, selectedPersonality, selectedGender])

  const visibleCharacters = filteredCharacters.slice(0, visibleCount)

  return (
    <div className="min-h-screen py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Badge variant="purple" className="mb-4">
            <SlidersHorizontal className="w-3 h-3" /> Discover
          </Badge>
          <h1 className="font-display text-3xl md:text-4xl font-black mb-2">
            Explore <span className="gradient-text">Characters</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base">
            Find your perfect AI companion from our collection of unique personalities.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search characters by name, role, or bio..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-200 border border-white/[0.07]
                text-sm text-white placeholder-text-muted outline-none
                focus:border-accent-purple/40 transition-colors"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200
                ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue text-white shadow-lg shadow-accent-purple/20'
                    : 'bg-dark-200 border border-white/[0.07] text-text-secondary hover:text-white hover:border-accent-purple/30'
                }`}
            >
              {cat.icon} {cat.label} ({cat.count})
            </button>
          ))}
        </motion.div>

        {/* Personality + Gender Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 mb-8"
        >
          {personalityFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedPersonality(filter.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200
                ${
                  selectedPersonality === filter.id
                    ? 'bg-accent-purple/20 border border-accent-purple/40 text-accent-purple'
                    : 'bg-dark-300/50 border border-white/[0.05] text-text-muted hover:text-text-secondary'
                }`}
            >
              {filter.icon} {filter.label}
            </button>
          ))}

          <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

          {(['all', 'female', 'male'] as const).map((gender) => (
            <button
              key={gender}
              onClick={() => setSelectedGender(gender)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200
                ${
                  selectedGender === gender
                    ? 'bg-accent-purple/20 border border-accent-purple/40 text-accent-purple'
                    : 'bg-dark-300/50 border border-white/[0.05] text-text-muted hover:text-text-secondary'
                }`}
            >
              {gender === 'all' ? '👥 All' : gender === 'female' ? '💃 Girls' : '🕺 Boys'}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        <p className="text-xs text-text-muted mb-6">
          Showing {visibleCharacters.length} of {filteredCharacters.length} characters
        </p>

        {/* Characters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {visibleCharacters.map((char, i) => (
            <CharacterCard key={char.id} character={char} index={i} />
          ))}
        </div>

        {/* Empty State */}
        {filteredCharacters.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-text-secondary">No characters found matching your filters.</p>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredCharacters.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((prev) => prev + 20)}
              className="btn-secondary px-8 py-3"
            >
              Load More Characters ↓
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
