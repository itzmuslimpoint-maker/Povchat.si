import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Compass,
  Home,
  User,
  Plus,
  X,
  Sparkles,
  Clock,
} from 'lucide-react'
import { useChatStore } from '../../stores/chatStore'
import { getCharacterById } from '../../data/characters'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/dashboard', label: 'Dashboard', icon: User },
]

export default function Sidebar() {
  const location = useLocation()
  const { isSidebarOpen, setSidebarOpen, sessions } = useChatStore()

  const formatTime = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime()
    if (diff < 60000) return 'now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    return `${Math.floor(diff / 86400000)}d`
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col
          bg-dark-100/95 backdrop-blur-xl border-r border-white/[0.07]
          transition-transform duration-300 ease-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-pink via-accent-purple to-accent-blue flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">
              POVChat
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 text-text-secondary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 py-4">
          <Link
            to="/explore"
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl
              bg-gradient-to-r from-accent-pink/10 via-accent-purple/10 to-accent-blue/10
              border border-accent-purple/20 hover:border-accent-purple/40
              text-white font-semibold text-sm transition-all duration-300
              hover:shadow-lg hover:shadow-accent-purple/10"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-accent-purple/15 text-white border border-accent-purple/20'
                      : 'text-text-secondary hover:text-white hover:bg-white/[0.04]'
                  }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto mt-6 px-4">
          <div className="flex items-center gap-2 px-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Recent Chats
            </span>
          </div>
          <div className="space-y-1">
            {sessions.map((session) => {
              const char = getCharacterById(session.characterId)
              if (!char) return null
              return (
                <Link
                  key={session.id}
                  to={`/chat/${char.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                    hover:bg-white/[0.04] transition-all duration-200 group"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={char.img}
                      alt={char.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                    />
                    {char.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-green rounded-full border-2 border-dark-100" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white truncate">
                        {char.name}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {formatTime(session.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary truncate mt-0.5">
                      {session.lastMessage}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-white/[0.07]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-200/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">Free Plan</p>
              <p className="text-[10px] text-text-muted">50/100 messages</p>
            </div>
            <Link
              to="/dashboard"
              className="text-[10px] font-bold text-accent-purple hover:text-accent-pink transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
