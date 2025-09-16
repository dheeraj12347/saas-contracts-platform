import React, { useState } from 'react'
import { Search, Filter, FileText, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

// ✅ Fixed: Simplified interface matching your actual database
interface SearchResult {
  doc_id: number
  contract_name: string
  content: string
  chunk_index?: number
  filename?: string
  parties?: string
  status?: string
  risk_score?: string
  type: 'document' | 'chunk'
}

export default function QueryInterface() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || !user) return

    try {
      setLoading(true)
      setError('')
      setResults([])

      const searchTerm = `%${query.trim()}%`

      // ✅ Fixed: Simple document search that definitely works
      const { data: documents, error: docError } = await supabase
        .from('documents')
        .select('doc_id, contract_name, filename, parties, status, risk_score')
        .eq('user_id', user.id)
        .ilike('contract_name', searchTerm)
        .limit(10)

      if (docError) {
        console.warn('Document search failed:', docError)
      }

      // ✅ Fixed: Simple chunk search with basic join
      const { data: chunks, error: chunkError } = await supabase
        .from('chunks')
        .select(`
          chunk_id,
          doc_id,
          text_chunk,
          chunk_index,
          user_id
        `)
        .eq('user_id', user.id)
        .ilike('text_chunk', searchTerm)
        .limit(15)

      if (chunkError) {
        console.warn('Chunk search failed:', chunkError)
      }

      // ✅ Fixed: Get document details for chunks separately
      const combinedResults: SearchResult[] = []

      // Add document results
      if (documents && documents.length > 0) {
        documents.forEach(doc => {
          combinedResults.push({
            doc_id: doc.doc_id,
            contract_name: doc.contract_name,
            content: `Contract: ${doc.contract_name}${doc.parties ? ` | Parties: ${doc.parties}` : ''}`,
            filename: doc.filename,
            parties: doc.parties,
            status: doc.status,
            risk_score: doc.risk_score,
            type: 'document'
          })
        })
      }

      // Add chunk results with document lookup
      if (chunks && chunks.length > 0) {
        // Get unique document IDs
        const docIds = [...new Set(chunks.map(chunk => chunk.doc_id))]
        
        // Fetch document details for chunks
        const { data: chunkDocuments } = await supabase
          .from('documents')
          .select('doc_id, contract_name, filename, parties, status, risk_score')
          .in('doc_id', docIds)

        const docMap = new Map()
        if (chunkDocuments) {
          chunkDocuments.forEach(doc => {
            docMap.set(doc.doc_id, doc)
          })
        }

        chunks.forEach(chunk => {
          const doc = docMap.get(chunk.doc_id)
          if (doc) {
            combinedResults.push({
              doc_id: chunk.doc_id,
              contract_name: doc.contract_name,
              content: chunk.text_chunk,
              chunk_index: chunk.chunk_index,
              filename: doc.filename,
              parties: doc.parties,
              status: doc.status,
              risk_score: doc.risk_score,
              type: 'chunk'
            })
          }
        })
      }

      // ✅ Fixed: Additional search in parties and filenames if no results
      if (combinedResults.length === 0) {
        const { data: additionalDocs } = await supabase
          .from('documents')
          .select('doc_id, contract_name, filename, parties, status, risk_score')
          .eq('user_id', user.id)
          .or(`parties.ilike.${searchTerm},filename.ilike.${searchTerm}`)
          .limit(5)

        if (additionalDocs && additionalDocs.length > 0) {
          additionalDocs.forEach(doc => {
            combinedResults.push({
              doc_id: doc.doc_id,
              contract_name: doc.contract_name,
              content: `Found in ${doc.parties ? 'parties' : 'filename'}: ${doc.parties || doc.filename}`,
              filename: doc.filename,
              parties: doc.parties,
              status: doc.status,
              risk_score: doc.risk_score,
              type: 'document'
            })
          })
        }
      }

      setResults(combinedResults)

    } catch (err: unknown) {
      // ✅ Fixed: Proper error handling
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Search failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fixed: Completely rewritten highlight function
  const highlightQuery = (text: string, searchQuery: string) => {
    if (!searchQuery || !text) return text
    
    try {
      // Simple case-insensitive replacement
      const parts = text.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
      
      return parts.map((part, index) => 
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 px-1 rounded font-medium">
            {part}
          </mark>
        ) : part
      )
    } catch {
      // ✅ Fixed: Return original text instead of error
      return text
    }
  }

  // ✅ Added: Quick search functionality
  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm)
  }

  const quickSearchTerms = [
    'AWS',
    'payment',
    'expiry',
    'renewal',
    'liability'
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Contracts</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search through your contracts..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Quick search suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Try:</span>
            {quickSearchTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleQuickSearch(term)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
            
            <button
              type="button"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              disabled
              title="Advanced filters coming soon"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </form>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-6 border-b border-gray-200">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Search Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Empty states */}
        {results.length === 0 && !loading && query && !error && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 mb-4">No matches found for "{query}"</p>
            <p className="text-sm text-gray-400">Try one of the suggested search terms above</p>
          </div>
        )}

        {results.length === 0 && !query && !loading && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search Your Contracts</h3>
            <p className="text-gray-500 mb-4">Find specific information across all your contracts</p>
            <div className="text-sm text-gray-400">
              <p>Popular searches: AWS, payment terms, expiry dates</p>
            </div>
          </div>
        )}

        {/* Results display */}
        {results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            
            {results.map((result, index) => (
              <div key={`${result.doc_id}-${result.chunk_index || 0}-${index}`} 
                   className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">
                        {result.contract_name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        result.type === 'chunk' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {result.type === 'chunk' ? `Section ${result.chunk_index || 1}` : 'Document'}
                      </span>
                    </div>
                    
                    {/* Contract metadata */}
                    <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-600">
                      {result.filename && (
                        <span className="bg-gray-100 px-2 py-1 rounded">📄 {result.filename}</span>
                      )}
                      {result.status && (
                        <span className={`px-2 py-1 rounded ${
                          result.status === 'Active' ? 'bg-green-100 text-green-700' :
                          result.status === 'Renewal Due' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {result.status}
                        </span>
                      )}
                      {result.risk_score && (
                        <span className={`px-2 py-1 rounded ${
                          result.risk_score === 'Low' ? 'bg-green-100 text-green-700' :
                          result.risk_score === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          Risk: {result.risk_score}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {highlightQuery(
                        result.content.length > 300 
                          ? result.content.substring(0, 300) + '...'
                          : result.content,
                        query
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
