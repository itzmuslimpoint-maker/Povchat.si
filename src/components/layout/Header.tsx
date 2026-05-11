import { Link } from 'react-router-dom'
import { Menu, Bell, Search, Sparkles } from 'lucide-react'
import { useChatStore } from '../../stores/chatStore'

export default function Header() {
  const { toggleSidebar } = useChatStore()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6 glass border-b border-white/[0.07]">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors text-text-secondary hover:text-white active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo (visible when sidebar is closed on mobile) */}
        <Link to="/" className="flex items-center gap-1.5 md:hidden">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-pink via-accent-purple to-accent-blue flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="font-display text-base font-bold gradient-text">POVChat</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-200 border border-white/[0.07] min-w-[260px]">
          <Search className="w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search characters, chats..."
            className="bg-transparent text-sm text-white placeholder-text-muted outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search */}
        <button className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors text-text-secondary hover:text-white md:hidden active:scale-95">
          <Search className="w-5 h-5" />
        </button>

        <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors text-text-secondary hover:text-white active:scale-95">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-pink rounded-full" />
        </button>

        <Link
          to="/login"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full
            border border-white/[0.12] text-xs sm:text-sm font-semibold text-white
            hover:border-accent-purple/40 transition-all duration-300 active:scale-95"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="btn-primary text-[11px] sm:text-xs py-2 px-3 sm:px-4"
        >
          Start Free
        </Link>
      </div>
    </header>
  )
}
