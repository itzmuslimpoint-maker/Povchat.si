import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Heart,
  Crown,
  Zap,
  TrendingUp,
  Clock,
  Star,
  Settings,
} from 'lucide-react'
import Badge from '../components/ui/Badge'
import { characters } from '../data/characters'
import { useChatStore } from '../stores/chatStore'
import { getCharacterById } from '../data/characters'

const mockUser = {
  name: 'User',
  email: 'user@povchat.ai',
  plan: 'free' as const,
  messagesUsed: 47,
  messagesLimit: 100,
  joinedAt: new Date('2025-01-15'),
  favoriteCharacters: ['f0', 'f2', 'm0', 'm3'],
}

export default function DashboardPage() {
  const { sessions } = useChatStore()

  const stats = [
    { label: 'Messages Sent', value: '47', icon: MessageSquare, color: 'from-accent-pink/20 to-accent-pink/5' },
    { label: 'Favorites', value: '4', icon: Heart, color: 'from-accent-purple/20 to-accent-purple/5' },
    { label: 'Conversations', value: `${sessions.length}`, icon: TrendingUp, color: 'from-accent-blue/20 to-accent-blue/5' },
    { label: 'Hours Chatting', value: '12', icon: Clock, color: 'from-accent-gold/20 to-accent-gold/5' },
  ]

  return (
    <div className="min-h-screen py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-3xl font-black mb-1">
                Welcome back, <span className="gradient-text">{mockUser.name}</span>
              </h1>
              <p className="text-sm text-text-secondary">Here's what's happening with your chats.</p>
            </div>
            <button className="btn-secondary px-4 py-2 text-xs gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card p-5 hover:border-accent-purple/20 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} border border-white/[0.07] flex items-center justify-center mb-3`}>
                <stat.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <p className="font-display text-2xl font-black">{stat.value}</p>
              <p className="text-xs text-text-secondary mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Plan & Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* Current Plan */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold">Current Plan</h3>
              <Badge variant="purple">
                <Crown className="w-3 h-3" /> Free
              </Badge>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-secondary">Messages used</span>
                <span className="font-bold">{mockUser.messagesUsed} / {mockUser.messagesLimit}</span>
              </div>
              <div className="h-2 rounded-full bg-dark-300 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue transition-all duration-500"
                  style={{ width: `${(mockUser.messagesUsed / mockUser.messagesLimit) * 100}%` }}
                />
              </div>
            </div>
            <button className="btn-primary w-full py-3 text-sm">
              <Zap className="w-4 h-4" />
              Upgrade to Pro — Unlimited Messages
            </button>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/explore"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-200/50 border border-white/[0.05] hover:border-accent-purple/20 transition-colors"
              >
                <Star className="w-5 h-5 text-accent-gold" />
                <span className="text-xs font-semibold">New Chat</span>
              </Link>
              <Link
                to="/explore"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-200/50 border border-white/[0.05] hover:border-accent-purple/20 transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-accent-green" />
                <span className="text-xs font-semibold">Trending</span>
              </Link>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-200/50 border border-white/[0.05] hover:border-accent-purple/20 transition-colors">
                <Heart className="w-5 h-5 text-accent-pink" />
                <span className="text-xs font-semibold">Favorites</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-200/50 border border-white/[0.05] hover:border-accent-purple/20 transition-colors">
                <Settings className="w-5 h-5 text-accent-blue" />
                <span className="text-xs font-semibold">Settings</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent Chats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="font-display text-xl font-bold mb-4">Recent Conversations</h2>
          <div className="space-y-2">
            {sessions.map((session) => {
              const char = getCharacterById(session.characterId)
              if (!char) return null
              return (
                <Link
                  key={session.id}
                  to={`/chat/${char.id}`}
                  className="flex items-center gap-4 p-4 glass-card hover:border-accent-purple/20 transition-all duration-300"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={char.img}
                      alt={char.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                    {char.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent-green rounded-full border-2 border-dark-100" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{char.name}</h4>
                      <span className="text-[10px] text-text-muted">
                        {new Date(session.lastMessageTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary truncate mt-0.5">
                      {session.lastMessage}
                    </p>
                  </div>
                  <MessageSquare className="w-4 h-4 text-text-muted flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Favorite Characters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display text-xl font-bold mb-4">
            Your <span className="gradient-text">Favorites</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockUser.favoriteCharacters.map((charId) => {
              const char = characters.find((c) => c.id === charId)
              if (!char) return null
              return (
                <Link
                  key={char.id}
                  to={`/chat/${char.id}`}
                  className="glass-card overflow-hidden group hover:border-accent-purple/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={char.img}
                    alt={char.name}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-3">
                    <h4 className="text-sm font-bold">{char.name}</h4>
                    <p className="text-[10px] text-text-secondary">{char.role}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
