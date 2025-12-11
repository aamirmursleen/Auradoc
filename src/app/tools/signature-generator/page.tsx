'use client'

import React, { useState, useRef, useEffect } from 'react'
import { PenTool, Download, Trash2, Type, Palette, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SignatureGeneratorPage() {
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
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2)
    setHasSignature(false)
  }

  const downloadSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

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
      // Draw typed signature
      ctx.font = `60px "${selectedFont}", cursive`
      ctx.fillStyle = selectedColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(typedName, 300, 100)
    } else if (mode === 'draw' && hasSignature) {
      // Draw the canvas content
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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <PenTool className="w-4 h-4" />
            Free Signature Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Signature Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your digital signature in seconds.
            Draw by hand or type your name with beautiful fonts.
          </p>

          {/* Mode Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setMode('draw')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'draw'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <PenTool className="w-5 h-5" />
              Draw
            </button>
            <button
              onClick={() => setMode('type')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'type'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Type className="w-5 h-5" />
              Type
            </button>
          </div>

          {/* Signature Area */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-gray-500" />
                  <div className="flex gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColor === color ? 'scale-110 border-gray-400 ring-2 ring-offset-1 ring-gray-300' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={clearCanvas}
                className="flex items-center gap-1 px-3 py-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                  className="w-full h-[200px] cursor-crosshair touch-none border border-gray-200 rounded-lg"
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
                <p className="text-center text-sm text-gray-400 mt-2">
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
                  className="w-full text-center text-4xl border-b-2 border-gray-200 focus:border-pink-500 outline-none pb-2 mb-6 bg-transparent"
                  style={{ fontFamily: `"${selectedFont}", cursive`, color: selectedColor }}
                />

                {/* Font Selection */}
                <p className="text-sm text-gray-500 mb-3 text-center">Choose a font style:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {fonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => setSelectedFont(font.name)}
                      className={`px-4 py-2 rounded-lg text-lg transition-all ${
                        selectedFont === font.name
                          ? 'bg-pink-100 text-pink-700 border-2 border-pink-500'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
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
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={downloadSignature}
                disabled={mode === 'draw' ? !hasSignature : !typedName}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                Download Signature (PNG)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Use Your Signature For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'PDF Documents', desc: 'Sign contracts, agreements, and forms' },
              { title: 'Email Signatures', desc: 'Add a personal touch to your emails' },
              { title: 'Digital Artwork', desc: 'Sign your creative work and designs' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Sign Documents?
          </h2>
          <p className="text-pink-100 mb-8">
            Use our complete e-signature platform for legally binding signatures
          </p>
          <Link
            href="/sign-document"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 font-medium rounded-lg hover:shadow-lg transition-all"
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
