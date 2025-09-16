import React from 'react'
import { FileText, Upload, Search, Settings, LogOut, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onToggle: () => void
}

const navigation = [
  { id: 'contracts', name: 'Contracts', icon: FileText },
  { id: 'upload', name: 'Upload', icon: Upload },
  { id: 'query', name: 'Query', icon: Search },
  { id: 'settings', name: 'Settings', icon: Settings },
]

export default function Sidebar({ activeTab, onTabChange, isOpen, onToggle }: SidebarProps) {
  // ✅ Fixed: Use 'logout' instead of 'signOut' to match your useAuth hook
  const { logout, user } = useAuth()

  const handleSignOut = async () => {
    try {
      await logout()
      // Optionally close sidebar after logout
      if (isOpen) {
        onToggle()
      }
    } catch (error: unknown) {
      // ✅ Fixed: Proper error handling without 'any'
      console.error('Logout failed:', error)
    }
  }

  // ✅ Fixed: Handle mobile navigation clicks without window access issues
  const handleNavClick = (tabId: string) => {
    onTabChange(tabId)
    // Close sidebar on mobile after navigation - use media query instead
    if (isOpen) {
      onToggle()
    }
  }

  return (
    <>
      {/* Mobile overlay - ✅ Fixed: Better z-index and mobile-only */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - ✅ Fixed: Better responsive behavior */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header - ✅ Fixed: Better mobile close button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Contracts</h1>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation - ✅ Fixed: Better navigation handling */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left 
                    transition-all duration-200 font-medium
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </nav>

          {/* User section - ✅ Fixed: Better user display and error handling */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-semibold text-sm">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Member
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-500">Loading user...</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

