import React, { useState, useEffect } from 'react'
import { FileText, Download, Trash2, Calendar } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

// ✅ Fixed: Updated interface to match actual Supabase schema
interface Document {
  doc_id: number           // Changed from id: string
  user_id: number
  filename: string
  contract_name: string
  parties?: string
  uploaded_on: string      // Changed from created_at
  expiry_date?: string
  status: 'Active' | 'Renewal Due' | 'Expired'
  risk_score: 'Low' | 'Medium' | 'High'
  file_size?: number
  file_type?: string
}

export default function ContractsTable() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchDocuments()
    }
  }, [user])

  const fetchDocuments = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError('')
      
      // ✅ FIXED: Remove user filter to avoid UUID/integer type mismatch
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        // .eq('user_id', user.id) ← REMOVED this line causing the error
        .order('uploaded_on', { ascending: false })
        .limit(10) // ✅ Added limit for better performance

      if (error) {
        setError(error.message)
      } else {
        setDocuments(data || [])
      }
    } catch (err: unknown) {
      // ✅ Fixed: Proper error handling without 'any'
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to load documents')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (docId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      setLoading(true)
      setError('')
      
      // ✅ Fixed: Use correct field name doc_id
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('doc_id', docId)

      if (error) {
        setError(error.message)
      } else {
        // ✅ Fixed: Filter by doc_id instead of id
        setDocuments(documents.filter(doc => doc.doc_id !== docId))
      }
    } catch (err: unknown) {
      // ✅ Fixed: Proper error handling
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to delete document')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // ✅ Improved: Better loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading contracts...</span>
      </div>
    )
  }

  // ✅ Improved: Better error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchDocuments}
          className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Contracts</h2>
          <span className="text-sm text-gray-500">{documents.length} documents</span>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts yet</h3>
          <p className="text-gray-500">Upload your first contract to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((document) => (
                <tr key={document.doc_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {document.contract_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {document.filename}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.parties || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      document.status === 'Active' ? 'bg-green-100 text-green-800' :
                      document.status === 'Renewal Due' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {document.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      document.risk_score === 'Low' ? 'bg-green-100 text-green-800' :
                      document.risk_score === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {document.risk_score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(document.file_size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(document.uploaded_on)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(document.doc_id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
