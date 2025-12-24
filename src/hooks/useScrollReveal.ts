'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', triggerOnce = true } = options
  const ref = useRef<T>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsRevealed(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isRevealed }
}

// Component wrapper for easier use
export function ScrollReveal({
  children,
  className = '',
  animation = 'scroll-reveal',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  animation?: 'scroll-reveal' | 'scroll-reveal-left' | 'scroll-reveal-right' | 'scroll-reveal-scale'
  delay?: number
}) {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`${animation} ${isRevealed ? 'revealed' : ''} ${className}`}
      style={{ transitionDelay: delay ? `${delay}s` : undefined }}
    >
      {children}
    </div>
  )
}
