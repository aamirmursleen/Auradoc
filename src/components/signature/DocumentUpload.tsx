'use client'

import React, { useCallback, useState } from 'react'
import { Upload, File, X, FileText, Image, AlertCircle } from 'lucide-react'

interface DocumentUploadProps {
  onFileSelect: (file: File | null) => void
  maxSizeMB?: number
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onFileSelect,
  maxSizeMB = 25,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isValidFileType = (file: File): boolean => {
    // Check by MIME type
    const validMimeTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp'
    ]

    if (validMimeTypes.includes(file.type)) {
      return true
    }

    // Also check by file extension as fallback
    const fileName = file.name.toLowerCase()
    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp']

    return validExtensions.some(ext => fileName.endsWith(ext))
  }

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!isValidFileType(file)) {
      setError(`Invalid file type "${file.type || 'unknown'}". Please upload PDF, PNG, or JPG files.`)
      return false
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return false
    }

    setError(null)
    return true
  }

  const handleFile = (file: File) => {
    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size)

    if (validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    onFileSelect(null)
    setError(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return FileText
    }
    if (file.type.startsWith('image/')) {
      return Image
    }
    return File
  }

  const getFileTypeLabel = (file: File): string => {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return 'PDF'
    }
    const ext = file.name.split('.').pop()?.toUpperCase()
    return ext || 'FILE'
  }

  if (selectedFile) {
    const FileIcon = getFileIcon(selectedFile)

    return (
      <div className="border-2 border-primary-200 bg-primary-50 rounded-xl p-6 animate-in">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FileIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 truncate max-w-xs">
                {selectedFile.name}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                {formatFileSize(selectedFile.size)} • {getFileTypeLabel(selectedFile)}
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
            title="Remove file"
          >
            <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragging
            ? 'border-primary-500 bg-primary-50 scale-[1.02]'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,application/pdf,image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          <div className={`
            w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-colors duration-300
            ${isDragging ? 'bg-primary-100' : 'bg-gray-100'}
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-700">
              {isDragging ? 'Drop your document here' : 'Drag & drop your document'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or <span className="text-primary-600 font-medium">browse</span> to choose a file
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </span>
            <span className="flex items-center space-x-1">
              <Image className="w-4 h-4" />
              <span>PNG, JPG</span>
            </span>
            <span>Max {maxSizeMB}MB</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm animate-in">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export default DocumentUpload
