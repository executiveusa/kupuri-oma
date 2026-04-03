'use client'

import * as React from 'react'
import { motion, type Variants } from 'framer-motion'
import { cn } from '../lib/cn'

// ─── Shared variants ─────────────────────────────────────────────────────────

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
}

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

// ─── FadeUp ──────────────────────────────────────────────────────────────────

interface FadeUpProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  once?: boolean
}

/**
 * Reveals content with fade + subtle upward motion.
 * Use for section entries, headlines, feature cards.
 */
export function FadeUp({ delay, once = true, className, children, ...props }: FadeUpProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={fadeUpVariants}
      {...(delay !== undefined ? { transition: { delay } } : {})}
      className={cn(className)}
      {...(props as unknown as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  once?: boolean
}

export function FadeIn({ delay, once = true, className, children, ...props }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={fadeInVariants}
      {...(delay !== undefined ? { transition: { delay } } : {})}
      className={cn(className)}
      {...(props as unknown as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}

// ─── StaggerGroup ─────────────────────────────────────────────────────────────

interface StaggerGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  once?: boolean
}

/**
 * Wraps a list of items in a stagger container.
 * Each direct child with `data-stagger` will animate in sequence.
 */
export function StaggerGroup({ once = true, className, children, ...props }: StaggerGroupProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={staggerContainer}
      className={cn(className)}
      {...(props as unknown as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}

// ─── StaggerItem ─────────────────────────────────────────────────────────────

export function StaggerItem({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      variants={fadeUpVariants}
      className={cn(className)}
      {...(props as unknown as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}

// ─── TextReveal ──────────────────────────────────────────────────────────────

interface TextRevealProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  once?: boolean
}

/**
 * Word-by-word text reveal for hero headlines.
 * Cinematic, intentional — not decorative.
 */
export function TextReveal({ text, as: Tag = 'h1', className, once = true }: TextRevealProps) {
  const words = text.split(' ')

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={staggerContainer}
      className={cn('inline', className)}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={fadeUpVariants}
          className="inline-block mr-[0.25em]"
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}
