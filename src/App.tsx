import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import LoginForm from './components/Auth/LoginForm'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import ContractsTable from './components/Contracts/ContractsTable'
import FileUpload from './components/Upload/FileUpload'
import QueryInterface from './components/Query/QueryInterface'
import Settings from './components/Settings/Settings'

const tabTitles = {
  contracts: 'Contracts',
  upload: 'Upload Documents',
  query: 'Search & Query',
  settings: 'Settings'
}

function App() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('contracts')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'contracts':
        return <ContractsTable />
      case 'upload':
        return <FileUpload />
      case 'query':
        return <QueryInterface />
      case 'settings':
        return <Settings />
      default:
        return <ContractsTable />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 lg:ml-0">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title={tabTitles[activeTab as keyof typeof tabTitles]}
        />
        
        <main className="p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  )
}

export default App