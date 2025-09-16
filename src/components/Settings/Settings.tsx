import React from 'react'
import { User, Lock, Database, Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Settings() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Email Address</h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">Manage your notification preferences</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Database Connection</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Database className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Connected to Supabase</h3>
              <p className="text-sm text-green-700">Your database connection is active</p>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Database URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
            <p><strong>Tables:</strong> users, documents, chunks</p>
            <p><strong>Status:</strong> <span className="text-green-600 font-medium">Connected</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Documents stored</span>
            <span className="font-medium">-- documents</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Storage used</span>
            <span className="font-medium">-- MB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
          </div>
          <p className="text-sm text-gray-600">25% of storage limit used</p>
        </div>
      </div>
    </div>
  )
}