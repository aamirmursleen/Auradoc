'use client'

import React, { useState, useRef, useEffect } from 'react'
import { PenTool, Download, Trash2, Type, Palette, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function SignatureGeneratorPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [mode, setMode] = useState<'draw' | 'type'>('draw')
  const [typedName, setTypedName] = useState('')
  const [selectedFont, setSelectedFont] = useState('Dancing Script')
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [hasSignature, setHasSignature] = useState(false)

  const fonts = [
    { name: 'Dancing Script', style: 'cursive' },
    { name: 'Great Vibes', style: 'cursive' },
    { name: 'Pacifico', style: 'cursive' },
    { name: 'Satisfy', style: 'cursive' },
    { name: 'Sacramento', style: 'cursive' },
  ]

  const colors = ['#000000', '#1e40af', '#0f766e', '#7c2d12', '#581c87']

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set display size
    const rect = canvas.getBoundingClientRect()
    canvas.style.width = '100%'
    canvas.style.height = '200px'

    // Set actual size in memory
    canvas.width = rect.width * 2
    canvas.height = 200 * 2

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = selectedColor
    ctx.lineWidth = 2

    // Fill with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  // Update stroke color when changed
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = selectedColor
  }, [selectedColor])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    setHasSignature(true)

    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    // Clear typed name first (works for both modes)
    setTypedName('')
    setHasSignature(false)

    // Clear canvas if available (for draw mode)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Reset transform and clear entire canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Restore scale for drawing
    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = selectedColor
    ctx.lineWidth = 2
  }

  const downloadSignature = async () => {
    // Create a new canvas for download
    const downloadCanvas = document.createElement('canvas')
    downloadCanvas.width = 600
    downloadCanvas.height = 200
    const ctx = downloadCanvas.getContext('2d')
    if (!ctx) return

    // Fill with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 600, 200)

    if (mode === 'type' && typedName) {
      // Wait for fonts to be ready
      try {
        await document.fonts.ready
      } catch (e) {
        console.log('Font loading error:', e)
      }

      // Draw typed signature
      ctx.font = `60px "${selectedFont}", cursive`
      ctx.fillStyle = selectedColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(typedName, 300, 100)
    } else if (mode === 'draw' && hasSignature) {
      const canvas = canvasRef.current
      if (!canvas) {
        alert('Canvas not found!')
        return
      }
      // Draw the canvas content - source is scaled 2x so use full dimensions
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 600, 200)
    } else {
      alert('Please create a signature first!')
      return
    }

    // Download
    const link = document.createElement('a')
    link.download = 'my-signature.png'
    link.href = downloadCanvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'PDF Tools', href: '/tools' },
            { label: 'Signature Generator' },
          ]} />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
            <PenTool className="w-4 h-4" />
            Free Signature Tool
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-4`}>
            Signature Generator
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-8 max-w-2xl mx-auto`}>
            Create your digital signature in seconds.
            Draw by hand or type your name with beautiful fonts.
          </p>

          {/* Mode Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setMode('draw')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'draw'
                  ? `${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'}`
                  : `${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'} ${isDark ? 'text-gray-400' : 'text-gray-500'} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'} border ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`
              }`}
            >
              <PenTool className="w-5 h-5" />
              Draw
            </button>
            <button
              onClick={() => setMode('type')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'type'
                  ? `${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'}`
                  : `${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'} ${isDark ? 'text-gray-400' : 'text-gray-500'} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'} border ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`
              }`}
            >
              <Type className="w-5 h-5" />
              Type
            </button>
          </div>

          {/* Signature Area */}
          <div className={`max-w-2xl mx-auto ${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'} rounded-2xl shadow-lg overflow-hidden border ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
            {/* Toolbar */}
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Palette className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className="flex gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColor === color ? `scale-110 ${isDark ? 'border-gray-400' : 'border-gray-500'} ring-2 ring-offset-1 ring-gray-300` : `${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={clearCanvas}
                className={`flex items-center gap-1 px-3 py-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors`}
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Clear</span>
              </button>
            </div>

            {/* Canvas / Type Area */}
            {mode === 'draw' ? (
              <div className="p-4">
                <canvas
                  ref={canvasRef}
                  className={`w-full h-[200px] cursor-crosshair touch-none border ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} rounded-lg`}
                  style={{
                    background: 'white',
                    backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                    backgroundSize: '100% 40px'
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                  Draw your signature above using mouse or touch
                </p>
              </div>
            ) : (
              <div className="p-8">
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => {
                    setTypedName(e.target.value)
                    setHasSignature(!!e.target.value)
                  }}
                  placeholder="Type your name..."
                  className={`w-full text-center text-4xl border-b-2 ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} ${isDark ? 'focus:border-[#c4ff0e]' : 'focus:border-[#4C00FF]'} outline-none pb-2 mb-6 bg-transparent ${isDark ? 'placeholder:text-gray-600' : 'placeholder:text-gray-400'}`}
                  style={{ fontFamily: `"${selectedFont}", cursive`, color: selectedColor }}
                />

                {/* Font Selection */}
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-3 text-center`}>Choose a font style:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {fonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => setSelectedFont(font.name)}
                      className={`px-4 py-2 rounded-lg text-lg transition-all ${
                        selectedFont === font.name
                          ? `${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'} border-2 ${isDark ? 'border-[#c4ff0e]' : 'border-[#4C00FF]'}`
                          : `${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} ${isDark ? 'text-gray-400' : 'text-gray-500'} ${isDark ? 'hover:bg-[#3a3a3a]' : 'hover:bg-[#E0D4FF]'} border-2 border-transparent`
                      }`}
                      style={{ fontFamily: `"${font.name}", ${font.style}` }}
                    >
                      {typedName || 'Signature'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Download Button */}
            <div className={`p-4 ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'} border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <button
                onClick={downloadSignature}
                disabled={mode === 'draw' ? !hasSignature : !typedName}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${isDark ? 'bg-[#c4ff0e] text-black' : 'bg-[#4C00FF] text-white'} font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Download className="w-5 h-5" />
                Download Signature (PNG)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className={`py-16 px-4 ${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-[#26065D]'} mb-12`}>
            Use Your Signature For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'PDF Documents', desc: 'Sign contracts, agreements, and forms' },
              { title: 'Email Signatures', desc: 'Add a personal touch to your emails' },
              { title: 'Digital Artwork', desc: 'Sign your creative work and designs' },
            ].map((item, idx) => (
              <div key={idx} className={`text-center p-6 rounded-2xl ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'}`}>
                <div className={`w-12 h-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-[#EDE5FF]'} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <CheckCircle className={`w-6 h-6 ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'}`} />
                </div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-2`}>{item.title}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 px-4 ${isDark ? 'bg-[#252525]' : 'bg-white border border-gray-200'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#26065D]'} mb-4`}>
            Ready to Sign Documents?
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-500'} mb-8`}>
            Use our complete e-signature platform for legally binding signatures
          </p>
          <Link
            href="/sign-document"
            className={`inline-flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-[#1F1F1F]' : 'bg-gray-50'} ${isDark ? 'text-[#c4ff0e]' : 'text-[#4C00FF]'} font-medium rounded-lg hover:shadow-lg transition-all`}
          >
            Sign Documents Now
            <PenTool className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Load Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Pacifico&family=Sacramento&family=Satisfy&display=swap"
        rel="stylesheet"
      />
    </div>
  )
}
