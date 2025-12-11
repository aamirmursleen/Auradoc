'use client'

import React, { useState, useRef, useEffect } from 'react'
import { PenTool, Download, Trash2, Type, Palette, Undo, CheckCircle } from 'lucide-react'
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = selectedColor
    ctx.lineWidth = 2
  }, [selectedColor])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    setHasSignature(true)

    const rect = canvas.getBoundingClientRect()
    let x, y
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let x, y
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

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

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const downloadSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (mode === 'type' && typedName) {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `48px "${selectedFont}", cursive`
      ctx.fillStyle = selectedColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(typedName, canvas.offsetWidth / 2, canvas.offsetHeight / 2)
    }

    const link = document.createElement('a')
    link.download = 'my-signature.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
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
                  : 'bg-white text-gray-600 hover:bg-gray-100'
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
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Type className="w-5 h-5" />
              Type
            </button>
          </div>

          {/* Signature Area */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-gray-500" />
                  <div className="flex gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          selectedColor === color ? 'scale-125 border-gray-400' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={clearCanvas}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Clear</span>
              </button>
            </div>

            {/* Canvas / Type Area */}
            {mode === 'draw' ? (
              <canvas
                ref={canvasRef}
                className="w-full h-48 cursor-crosshair touch-none"
                style={{ background: 'linear-gradient(#f9fafb 1px, transparent 1px)' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
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
                  className="w-full text-center text-4xl border-b-2 border-gray-200 focus:border-pink-500 outline-none pb-2 mb-6"
                  style={{ fontFamily: `"${selectedFont}", cursive`, color: selectedColor }}
                />

                {/* Font Selection */}
                <div className="flex flex-wrap justify-center gap-2">
                  {fonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => setSelectedFont(font.name)}
                      className={`px-4 py-2 rounded-lg text-lg transition-all ${
                        selectedFont === font.name
                          ? 'bg-pink-100 text-pink-700 border-2 border-pink-500'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={{ fontFamily: `"${font.name}", ${font.style}` }}
                    >
                      Signature
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
                Download Signature
              </button>
            </div>
          </div>

          {/* Hidden canvas for typed signature */}
          {mode === 'type' && (
            <canvas ref={canvasRef} className="hidden" width="600" height="200" />
          )}
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
