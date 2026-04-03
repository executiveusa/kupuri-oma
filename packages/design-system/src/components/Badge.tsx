'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const badgeVariants = cva(
  // Law 5 — badges use rounded-md NOT rounded-full
  'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium border',
  {
    variants: {
      variant: {
        default: 'bg-neutral-800 text-neutral-300 border-neutral-700',
        violet: 'bg-violet-950 text-violet-300 border-violet-800/40',
        gold: 'bg-yellow-950 text-yellow-300 border-yellow-800/40',
        success: 'bg-green-950 text-green-300 border-green-800/40',
        warning: 'bg-orange-950 text-orange-300 border-orange-800/40',
        error: 'bg-red-950 text-red-300 border-red-800/40',
        premium: 'bg-yellow-950/60 text-yellow-400 border-yellow-600/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'violet' && 'bg-violet-400',
            variant === 'gold' && 'bg-yellow-400',
            variant === 'success' && 'bg-green-400',
            variant === 'warning' && 'bg-orange-400',
            variant === 'error' && 'bg-red-400',
            variant === 'premium' && 'bg-yellow-400',
            (!variant || variant === 'default') && 'bg-neutral-400',
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
