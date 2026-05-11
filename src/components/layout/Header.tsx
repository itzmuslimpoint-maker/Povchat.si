import { Link } from 'react-router-dom'
import { Menu, Bell, Search } from 'lucide-react'
import { useChatStore } from '../../stores/chatStore'

export default function Header() {
  const { toggleSidebar } = useChatStore()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 glass border-b border-white/[0.07]">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors text-text-secondary hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-200 border border-white/[0.07] min-w-[280px]">
          <Search className="w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search characters, chats..."
            className="bg-transparent text-sm text-white placeholder-text-muted outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors text-text-secondary hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-pink rounded-full" />
        </button>
        <Link
          to="/login"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full
            border border-white/[0.12] text-sm font-semibold text-white
            hover:border-accent-purple/40 transition-all duration-300"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="btn-primary text-xs py-2 px-4"
        >
          Start Free
        </Link>
      </div>
    </header>
  )
}
