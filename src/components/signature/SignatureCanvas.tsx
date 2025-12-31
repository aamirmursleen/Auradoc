'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import SignatureCanvasLib from 'react-signature-canvas'
import { Download, Check, RotateCcw, Palette, Upload, PenTool, Image, Camera, X, Loader2 } from 'lucide-react'

interface SignatureCanvasProps {
  onSignatureChange?: (signature: string | null) => void
  onSave?: (signature: string) => void
  onClear?: () => void
  initialSignature?: string
  width?: number
  height?: number
  compact?: boolean
}

type SignatureMode = 'draw' | 'upload' | 'camera'

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange,
  onSave,
  onClear,
  initialSignature,
  width = 600,
  height = 200,
  compact = false,
}) => {
  const signatureRef = useRef<SignatureCanvasLib>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isEmpty, setIsEmpty] = useState(!initialSignature)
  const [penColor, setPenColor] = useState('#1e293b')
  const [canvasWidth, setCanvasWidth] = useState(width)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [mode, setMode] = useState<SignatureMode>('draw')
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialSignature || null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Computed height based on compact mode
  const canvasHeight = compact ? 120 : height

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

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleClear = () => {
    if (mode === 'draw' && signatureRef.current) {
      signatureRef.current.clear()
    }
    setUploadedImage(null)
    setIsEmpty(true)
    if (onSignatureChange) onSignatureChange(null)
    if (onClear) onClear()
    stopCamera()
  }

  const handleEnd = () => {
    if (signatureRef.current) {
      const isCanvasEmpty = signatureRef.current.isEmpty()
      setIsEmpty(isCanvasEmpty)
      if (!isCanvasEmpty) {
        const signatureData = signatureRef.current.toDataURL('image/png')
        if (onSignatureChange) onSignatureChange(signatureData)
        if (onSave) onSave(signatureData)
      }
    }
  }

  const handleDownload = () => {
    let dataURL: string | null = null

    if (mode === 'draw' && signatureRef.current && !signatureRef.current.isEmpty()) {
      dataURL = signatureRef.current.toDataURL('image/png')
    } else if ((mode === 'upload' || mode === 'camera') && uploadedImage) {
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
      handleClear()
      setMode(newMode)
      setCameraError(null)
    }
  }

  // Remove background from image (extract signature)
  const removeBackground = useCallback((imageData: ImageData): ImageData => {
    const data = imageData.data

    // Find the dominant background color (assume it's the most common color near edges)
    const threshold = 200 // Pixels with brightness above this are considered background

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Calculate brightness
      const brightness = (r + g + b) / 3

      // If pixel is bright (likely background), make it transparent
      if (brightness > threshold) {
        data[i + 3] = 0 // Set alpha to 0 (transparent)
      } else {
        // Enhance dark pixels (signature) - make them more prominent
        const factor = Math.max(0, (threshold - brightness) / threshold)
        data[i] = Math.round(data[i] * factor) // R
        data[i + 1] = Math.round(data[i + 1] * factor) // G
        data[i + 2] = Math.round(data[i + 2] * factor) // B
        data[i + 3] = Math.round(255 * Math.min(1, factor * 2)) // Alpha
      }
    }

    return imageData
  }, [])

  // Process image to extract signature
  const processImage = useCallback((imageSrc: string) => {
    setIsProcessing(true)

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        setIsProcessing(false)
        return
      }

      // Set canvas size
      canvas.width = img.width
      canvas.height = img.height

      // Draw image
      ctx.drawImage(img, 0, 0)

      // Get image data and remove background
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const processedData = removeBackground(imageData)
      ctx.putImageData(processedData, 0, 0)

      // Convert to data URL
      const processedImage = canvas.toDataURL('image/png')
      setUploadedImage(processedImage)
      setIsEmpty(false)
      if (onSignatureChange) onSignatureChange(processedImage)
      if (onSave) onSave(processedImage)
      setIsProcessing(false)
    }

    img.onerror = () => {
      setIsProcessing(false)
      alert('Failed to process image')
    }

    img.src = imageSrc
  }, [onSignatureChange, removeBackground])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, etc.)')
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataURL = event.target?.result as string
        // Process the image to remove background
        processImage(dataURL)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Camera functions
  const startCamera = async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError('Unable to access camera. Please check permissions or use upload instead.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/png')

    // Stop camera and process the captured image
    stopCamera()
    processImage(imageData)
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      {/* Mode Selector */}
      <div className={`flex items-center justify-center gap-1 p-1 bg-gray-100 rounded-xl ${compact ? 'text-xs' : ''}`}>
        <button
          onClick={() => handleModeChange('draw')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === 'draw'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span className="hidden sm:inline">Draw</span>
        </button>
        <button
          onClick={() => handleModeChange('upload')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === 'upload'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </button>
        <button
          onClick={() => handleModeChange('camera')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === 'camera'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Camera</span>
        </button>
      </div>

      {/* Toolbar */}
      {!compact && (
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">
            {mode === 'draw' ? 'Draw your signature' : mode === 'upload' ? 'Upload signature image' : 'Capture with camera'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
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

          {mode === 'upload' && (
            <button
              onClick={triggerFileInput}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors group"
              title="Upload signature image"
            >
              <Image className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
            </button>
          )}

          <button
            onClick={handleClear}
            disabled={isEmpty && !isCameraActive}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Clear signature"
          >
            <RotateCcw className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
          </button>

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
      )}

      {/* Compact mode toolbar */}
      {compact && (
        <div className="flex items-center justify-end gap-2">
          {mode === 'draw' && (
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                title="Change pen color"
              >
                <Palette className="w-4 h-4 text-gray-600" />
              </button>
              {showColorPicker && (
                <div className="absolute top-full right-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="flex space-x-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorChange(color.value)}
                        className={`w-6 h-6 rounded-full border-2 ${
                          penColor === color.value ? 'border-primary-500' : 'border-gray-200'
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
          {mode === 'upload' && (
            <button onClick={triggerFileInput} className="p-1.5 rounded hover:bg-gray-200">
              <Image className="w-4 h-4 text-gray-600" />
            </button>
          )}
          <button onClick={handleClear} disabled={isEmpty && !isCameraActive} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50">
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-xl text-blue-700">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Extracting signature from image...</span>
        </div>
      )}

      {/* Draw Mode */}
      {mode === 'draw' && !isProcessing && (
        <div
          ref={containerRef}
          className={`signature-canvas-container ${!isEmpty ? 'has-signature' : ''}`}
        >
          <SignatureCanvasLib
            ref={signatureRef}
            penColor={penColor}
            canvasProps={{
              width: canvasWidth,
              height: canvasHeight,
              className: 'signature-canvas rounded-xl cursor-crosshair',
              style: { width: '100%', height: `${canvasHeight}px` },
            }}
            onEnd={handleEnd}
            minWidth={1}
            maxWidth={3}
            velocityFilterWeight={0.7}
          />
          <div className="absolute bottom-8 left-8 right-8 border-b-2 border-gray-300 pointer-events-none" />
          <span className="absolute bottom-2 left-8 text-xs text-gray-400">Sign above this line</span>
          {!isEmpty && (
            <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium success-badge">
              <Check className="w-3 h-3" />
              <span>Signed</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Mode */}
      {mode === 'upload' && !isProcessing && (
        <div
          ref={containerRef}
          className={`signature-canvas-container ${!isEmpty ? 'has-signature' : ''}`}
          style={{ minHeight: `${canvasHeight}px` }}
        >
          {uploadedImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-4" style={{ minHeight: `${canvasHeight}px` }}>
              <div className="bg-gray-100 p-4 rounded-lg" style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIElEQVQoU2NkYGD4z0AEYGRgYGBkIA5gwGpKpAYNlQIA3dgFATntO/MAAAAASUVORK5CYII=")' }}>
                <img
                  src={uploadedImage}
                  alt="Uploaded signature"
                  className="max-w-full max-h-[160px] object-contain"
                />
              </div>
              <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium success-badge">
                <Check className="w-3 h-3" />
                <span>Extracted</span>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerFileInput}
              className="w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ height: `${canvasHeight}px` }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Click to upload signature image</p>
              <p className="text-gray-400 text-sm mt-1">Background will be automatically removed</p>
            </div>
          )}
        </div>
      )}

      {/* Camera Mode */}
      {mode === 'camera' && !isProcessing && (
        <div
          ref={containerRef}
          className={`signature-canvas-container ${!isEmpty ? 'has-signature' : ''}`}
          style={{ minHeight: `${canvasHeight}px` }}
        >
          {cameraError ? (
            <div className="w-full flex flex-col items-center justify-center p-4" style={{ height: `${canvasHeight}px` }}>
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-600 font-medium text-center">{cameraError}</p>
              <button
                onClick={() => handleModeChange('upload')}
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Use Upload Instead
              </button>
            </div>
          ) : uploadedImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-4" style={{ minHeight: `${canvasHeight}px` }}>
              <div className="bg-gray-100 p-4 rounded-lg" style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIElEQVQoU2NkYGD4z0AEYGRgYGBkIA5gwGpKpAYNlQIA3dgFATntO/MAAAAASUVORK5CYII=")' }}>
                <img
                  src={uploadedImage}
                  alt="Captured signature"
                  className="max-w-full max-h-[160px] object-contain"
                />
              </div>
              <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium success-badge">
                <Check className="w-3 h-3" />
                <span>Captured</span>
              </div>
            </div>
          ) : isCameraActive ? (
            <div className="relative w-full" style={{ minHeight: `${canvasHeight}px` }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-xl"
                style={{ maxHeight: `${canvasHeight + 100}px` }}
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="absolute top-4 left-4 right-4 text-center text-white text-sm bg-black/50 py-2 rounded-lg">
                Position your signature in the frame
              </p>
            </div>
          ) : (
            <div
              onClick={startCamera}
              className="w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ height: `${canvasHeight}px` }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Click to open camera</p>
              <p className="text-gray-400 text-sm mt-1">Take a photo of your signature</p>
              <p className="text-gray-400 text-xs mt-1">Background will be automatically removed</p>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      {!compact && (
        <p className="text-xs text-gray-500 text-center">
          {mode === 'draw'
            ? 'Use your mouse or touchscreen to draw your signature.'
            : mode === 'upload'
            ? 'Upload a photo of your signature. Background will be removed automatically.'
            : 'Take a photo of your signature on paper. Background will be removed automatically.'}
        </p>
      )}
    </div>
  )
}

export default SignatureCanvas
