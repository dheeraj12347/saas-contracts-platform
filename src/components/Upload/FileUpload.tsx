import React, { useState, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

interface UploadedFile {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

export default function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const { user } = useAuth()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const uploadFiles = newFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }))

    setFiles(prev => [...prev, ...uploadFiles])

    // Start uploading each file
    uploadFiles.forEach((uploadFile, index) => {
      uploadDocument(uploadFile.file, files.length + index)
    })
  }

  const uploadDocument = async (file: File, index: number) => {
    if (!user) return

    try {
      // Read file content
      const content = await readFileAsText(file)

      // Insert document into database
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          content: content,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type || 'application/octet-stream',
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Create chunks if content is large
      if (content && content.length > 1000) {
        await createChunks(data.id, content)
      }

      // Update file status
      setFiles(prev => prev.map((f, i) => 
        i === index 
          ? { ...f, progress: 100, status: 'success' as const }
          : f
      ))

    } catch (error) {
      setFiles(prev => prev.map((f, i) => 
        i === index 
          ? { 
              ...f, 
              progress: 0, 
              status: 'error' as const, 
              error: error instanceof Error ? error.message : 'Upload failed' 
            }
          : f
      ))
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  const createChunks = async (documentId: string, content: string) => {
    const chunkSize = 1000
    const chunks = []
    
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push({
        document_id: documentId,
        content: content.slice(i, i + chunkSize),
        chunk_index: Math.floor(i / chunkSize)
      })
    }

    await supabase.from('chunks').insert(chunks)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload Documents</h2>

      {/* Upload area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".txt,.pdf,.doc,.docx"
        />
        
        <div className="flex flex-col items-center">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-gray-500 mb-4">
            Support for PDF, DOC, DOCX, and TXT files
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Select Files
          </button>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-medium text-gray-900">Uploading Files</h3>
          {files.map((uploadFile, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadFile.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {uploadFile.status === 'uploading' && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {uploadFile.status === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}

              {uploadFile.status === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}

              <button
                onClick={() => removeFile(index)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}