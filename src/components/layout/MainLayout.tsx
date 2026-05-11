import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useChatStore } from '../../stores/chatStore'

export default function MainLayout() {
  const { isSidebarOpen } = useChatStore()

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-dark">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-72' : 'ml-0'
        }`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
