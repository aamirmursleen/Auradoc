'use client'

import React, { useRef, useState, useEffect } from 'react'
import SignatureCanvasLib from 'react-signature-canvas'
import { Download, Check, RotateCcw, Palette, Upload, PenTool, Image } from 'lucide-react'

interface SignatureCanvasProps {
  onSignatureChange: (signature: string | null) => void
  width?: number
  height?: number
}

type SignatureMode = 'draw' | 'upload'

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange,
  width = 600,
  height = 200,
}) => {
  const signatureRef = useRef<SignatureCanvasLib>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEmpty, setIsEmpty] = useState(true)
  const [penColor, setPenColor] = useState('#1e293b')
  const [canvasWidth, setCanvasWidth] = useState(width)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [mode, setMode] = useState<SignatureMode>('draw')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const colors = [
    { name: 'Black', value: '#1e293b' },
    { name: 'Blue', value: '#1d4ed8' },
    { name: 'Navy', value: '#1e3a5f' },
  ]

  // Responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 4
        setCanvasWidth(Math.min(containerWidth, width))
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [width])

  const handleClear = () => {
    if (mode === 'draw' && signatureRef.current) {
      signatureRef.current.clear()
    }
    setUploadedImage(null)
    setIsEmpty(true)
    onSignatureChange(null)
  }

  const handleEnd = () => {
    if (signatureRef.current) {
      const isCanvasEmpty = signatureRef.current.isEmpty()
      setIsEmpty(isCanvasEmpty)
      if (!isCanvasEmpty) {
        const signatureData = signatureRef.current.toDataURL('image/png')
        onSignatureChange(signatureData)
      }
    }
  }

  const handleDownload = () => {
    let dataURL: string | null = null

    if (mode === 'draw' && signatureRef.current && !signatureRef.current.isEmpty()) {
      dataURL = signatureRef.current.toDataURL('image/png')
    } else if (mode === 'upload' && uploadedImage) {
      dataURL = uploadedImage
    }

    if (dataURL) {
      const link = document.createElement('a')
      link.download = 'signature.png'
      link.href = dataURL
      link.click()
    }
  }

  const handleColorChange = (color: string) => {
    setPenColor(color)
    setShowColorPicker(false)
  }

  const handleModeChange = (newMode: SignatureMode) => {
    if (newMode !== mode) {
      // Clear current signature when switching modes
      handleClear()
      setMode(newMode)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, etc.)')
        return
      }

      // Validate file size (2MB max for signature image)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataURL = event.target?.result as string
        setUploadedImage(dataURL)
        setIsEmpty(false)
        onSignatureChange(dataURL)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => handleModeChange('draw')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === 'draw'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <PenTool className="w-4 h-4" />
          Draw Signature
        </button>
        <button
          onClick={() => handleModeChange('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === 'upload'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">
            {mode === 'draw' ? 'Draw your signature below' : 'Upload your signature image'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Color Picker - only show in draw mode */}
          {mode === 'draw' && (
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors group"
                title="Change pen color"
              >
                <Palette className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
                <span
                  className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white"
                  style={{ backgroundColor: penColor }}
                />
              </button>
              {showColorPicker && (
                <div className="absolute top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="flex space-x-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorChange(color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          penColor === color.value ? 'border-primary-500 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Button - only show in upload mode */}
          {mode === 'upload' && (
            <button
              onClick={triggerFileInput}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors group"
              title="Upload signature image"
            >
              <Image className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
            </button>
          )}

          {/* Clear Button */}
          <button
            onClick={handleClear}
            disabled={isEmpty}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Clear signature"
          >
            <RotateCcw className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isEmpty}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Download signature"
          >
            <Download className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Canvas Container - Draw Mode */}
      {mode === 'draw' && (
        <div
          ref={containerRef}
          className={`signature-canvas-container ${!isEmpty ? 'has-signature' : ''}`}
        >
          <SignatureCanvasLib
            ref={signatureRef}
            penColor={penColor}
            canvasProps={{
              width: canvasWidth,
              height: height,
              className: 'signature-canvas rounded-xl cursor-crosshair',
              style: { width: '100%', height: `${height}px` },
            }}
            onEnd={handleEnd}
            minWidth={1}
            maxWidth={3}
            velocityFilterWeight={0.7}
          />

          {/* Signature Line */}
          <div className="absolute bottom-8 left-8 right-8 border-b-2 border-gray-300 pointer-events-none" />
          <span className="absolute bottom-2 left-8 text-xs text-gray-400">Sign above this line</span>

          {/* Status Indicator */}
          {!isEmpty && (
            <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium success-badge">
              <Check className="w-3 h-3" />
              <span>Signed</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Container - Upload Mode */}
      {mode === 'upload' && (
        <div
          ref={containerRef}
          className={`signature-canvas-container ${!isEmpty ? 'has-signature' : ''}`}
          style={{ minHeight: `${height}px` }}
        >
          {uploadedImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={uploadedImage}
                alt="Uploaded signature"
                className="max-w-full max-h-[180px] object-contain"
              />
              {/* Status Indicator */}
              <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium success-badge">
                <Check className="w-3 h-3" />
                <span>Uploaded</span>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerFileInput}
              className="w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ height: `${height}px` }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Click to upload signature image</p>
              <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 2MB</p>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center">
        {mode === 'draw'
          ? 'Use your mouse or touchscreen to draw your signature. Your signature will be legally binding.'
          : 'Upload a clear image of your signature. Transparent PNG images work best.'}
      </p>
    </div>
  )
}

export default SignatureCanvas
