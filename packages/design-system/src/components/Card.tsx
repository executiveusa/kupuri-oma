'use client'

import * as React from 'react'
import { cn } from '../lib/cn'

// Law 5 — Cards: max rounded-xl (12px)
// Law 6 — Shadows: 0 2px 8px rgba(0,0,0,0.1)

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  premium?: boolean
}

export function Card({ className, hover, premium, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-800 bg-neutral-900 p-5',
        hover && 'transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-800/80',
        premium && 'border-yellow-800/40 bg-yellow-950/20',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold text-neutral-100', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('mt-1 text-sm text-neutral-400', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  )
}
