import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useChatStore } from '../../stores/chatStore'

export default function MainLayout() {
  const { isSidebarOpen } = useChatStore()

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-72' : 'ml-0'
        }`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
