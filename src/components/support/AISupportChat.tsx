'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const AISupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am Mamasign Support Agent. How can I help you today?\n\nYou can ask me about:\n• How to sign documents\n• How to send documents for signature\n• Account and billing questions\n• Any errors you are facing',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I am having trouble right now. Please try again in a moment.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please check your internet connection and try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatMessage = (content: string) => {
    // Convert bullet points and line breaks to proper formatting
    return content.split('\n').map((line, i) => {
      if (line.startsWith('•') || line.startsWith('-')) {
        return (
          <li key={i} className="ml-4 list-disc">
            {line.replace(/^[•-]\s*/, '')}
          </li>
        )
      }
      if (line.match(/^\d+[\.\)]/)) {
        return (
          <li key={i} className="ml-4 list-decimal">
            {line.replace(/^\d+[\.\)]\s*/, '')}
          </li>
        )
      }
      if (line.trim() === '') {
        return <br key={i} />
      }
      return <p key={i} className="mb-1">{line}</p>
    })
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-[999]"
          title="Need help? Chat with us!"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-[1000] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden transition-all ${
            isMinimized ? 'h-14' : 'h-[85vh] sm:h-[500px]'
          } sm:w-96`}
        >
          {/* Close Button - Always visible at top right */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 z-10 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
            title="Close chat"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Header */}
          <div className="flex items-center p-4 bg-muted border-b border-border pr-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Mamasign Support</h3>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[350px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted text-foreground rounded-tl-sm'
                      }`}
                    >
                      <div className="text-sm leading-relaxed">
                        {formatMessage(message.content)}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question..."
                    className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="w-11 h-11 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Send className="w-5 h-5 text-primary-foreground" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Powered by Mamasign AI
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default AISupportChat
