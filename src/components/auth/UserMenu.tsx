import React, { useState, useRef, useEffect } from 'react'
import { User, LogOut, Settings, FileText, BarChart3, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  if (!user) return null

  const userDisplayName = user.user_metadata?.full_name || 
                         user.user_metadata?.first_name || 
                         user.email?.split('@')[0] || 
                         'User'

  const userInitials = userDisplayName
    .split(' ')
    .map((name: string) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-semibold text-sm">
          {userInitials}
        </div>
        <span className="text-white font-medium hidden sm:block">{userDisplayName}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-black border border-white/20 rounded-2xl shadow-xl z-50">
          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-bold">
                {userInitials}
              </div>
              <div>
                <div className="text-white font-semibold">{userDisplayName}</div>
                <div className="text-gray-400 text-sm">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/cases"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <FileText className="h-5 w-5" />
              <span>My Cases</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>

            <div className="border-t border-white/10 my-2"></div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu