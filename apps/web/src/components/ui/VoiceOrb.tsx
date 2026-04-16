'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Loader2 } from 'lucide-react'

// ─── Web Speech API types ─────────────────────────────────────────────────────

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onresult: ((event: any) => void) | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onerror: ((event: any) => void) | null
    onend: (() => void) | null
    onstart: (() => void) | null
    start(): void
    stop(): void
    abort(): void
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type OrbState = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported'

interface VoiceOrbProps {
  locale: string
  idleLabel?: string
  listeningLabel?: string
  processingLabel?: string
  /** Where to route after voice capture. Defaults to /{locale}/studio */
  targetPath?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VoiceOrb({
  locale,
  idleLabel = 'Speak to create',
  listeningLabel = 'Listening…',
  processingLabel = 'Processing…',
  targetPath,
}: VoiceOrbProps) {
  const [orbState, setOrbState] = useState<OrbState>('idle')
  const [transcript, setTranscript] = useState('')
  const orbStateRef = useRef<OrbState>('idle')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const router = useRouter()

  // Thread-safe state setter (prevents stale closures in recognition callbacks)
  const setOrbStateSync = useCallback((s: OrbState) => {
    orbStateRef.current = s
    setOrbState(s)
  }, [])

  // Check for browser support on mount
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !('SpeechRecognition' in window) &&
      !('webkitSpeechRecognition' in window)
    ) {
      setOrbStateSync('unsupported')
    }
  }, [setOrbStateSync])

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!SR) return

    const recognition = new SR()
    recognition.lang = locale === 'es-MX' ? 'es-MX' : 'en-US'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => setOrbStateSync('listening')

    recognition.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('')
      setTranscript(text)

      if (e.results[e.results.length - 1].isFinal) {
        setOrbStateSync('processing')
        const destination = targetPath
          ? `/${locale}${targetPath}?voice=${encodeURIComponent(text)}`
          : `/${locale}/studio?voice=${encodeURIComponent(text)}`
        setTimeout(() => router.push(destination), 800)
      }
    }

    recognition.onerror = () => {
      setOrbStateSync('error')
      setTimeout(() => setOrbStateSync('idle'), 2200)
    }

    recognition.onend = () => {
      if (orbStateRef.current === 'listening') setOrbStateSync('idle')
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [locale, router, targetPath, setOrbStateSync])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setOrbStateSync('idle')
    setTranscript('')
  }, [setOrbStateSync])

  const handleClick = () => {
    if (orbState === 'listening') stopListening()
    else if (orbState === 'idle' || orbState === 'error') startListening()
  }

  const isActive = orbState === 'listening'
  const isProcessing = orbState === 'processing'
  const isError = orbState === 'error'

  const orbBg = isError
    ? 'oklch(16% 0.09 25)'
    : isActive
      ? 'oklch(22% 0.15 290)'
      : 'oklch(16% 0.07 290)'

  const orbBoxShadow = isActive
    ? '0 0 0 1.5px oklch(55% 0.22 290 / 0.8), 0 12px 40px oklch(50% 0.22 290 / 0.25)'
    : '0 0 0 1px oklch(38% 0.1 290 / 0.5), 0 4px 20px oklch(0% 0 0 / 0.35)'

  const label =
    orbState === 'listening'
      ? listeningLabel
      : orbState === 'processing'
        ? processingLabel
        : orbState === 'error'
          ? (locale === 'es-MX' ? 'Error de micrófono — intenta de nuevo' : 'Mic error — try again')
          : orbState === 'unsupported'
            ? (locale === 'es-MX' ? 'Voz no disponible en este navegador' : 'Voice unavailable in this browser')
            : transcript
              ? `"${transcript.slice(0, 48)}${transcript.length > 48 ? '…' : ''}"`
              : idleLabel

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Orb + ripples container */}
      <div className="relative flex h-28 w-28 items-center justify-center">
        {/* Ripple rings — listening state */}
        <AnimatePresence>
          {isActive &&
            [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-violet-500/25"
                initial={{ width: 112, height: 112, opacity: 0.55 }}
                animate={{ width: 220, height: 220, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2.2,
                  delay: i * 0.7,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                style={{ left: '50%', top: '50%', x: '-50%', y: '-50%' }}
              />
            ))}
        </AnimatePresence>

        {/* Breathing glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            background: isActive
              ? 'radial-gradient(circle, oklch(58% 0.24 290 / 0.18) 0%, transparent 70%)'
              : 'radial-gradient(circle, oklch(50% 0.20 290 / 0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: isActive ? [1, 1.12, 1] : [1, 1.05, 1],
            opacity: isActive ? [0.8, 1, 0.8] : [0.5, 0.85, 0.5],
          }}
          transition={{
            duration: isActive ? 1.1 : 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* The orb button */}
        <motion.button
          type="button"
          onClick={handleClick}
          disabled={isProcessing || orbState === 'unsupported'}
          aria-label={
            isActive
              ? locale === 'es-MX' ? 'Detener grabación' : 'Stop recording'
              : locale === 'es-MX' ? 'Activar micrófono' : 'Activate microphone'
          }
          className="relative z-10 flex h-[112px] w-[112px] cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: orbBg, boxShadow: orbBoxShadow }}
          whileTap={!isProcessing ? { scale: 0.95 } : {}}
          whileHover={!isActive && !isProcessing ? { scale: 1.04 } : {}}
          animate={orbState === 'idle' ? { scale: [1, 1.012, 1] } : {}}
          transition={orbState === 'idle' ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
              >
                <Loader2 size={30} className="animate-spin text-violet-300" aria-hidden="true" />
              </motion.div>
            ) : isActive ? (
              <motion.div
                key="wave"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex items-end gap-[4px]"
                style={{ height: 28 }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-violet-300"
                    animate={{ height: [6, 26, 6] }}
                    transition={{
                      duration: 0.65,
                      delay: i * 0.11,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
              >
                <Mic
                  size={30}
                  className={isError ? 'text-red-400' : 'text-violet-300'}
                  aria-hidden="true"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* State label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          className="max-w-[220px] text-center text-sm leading-snug text-neutral-500"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
