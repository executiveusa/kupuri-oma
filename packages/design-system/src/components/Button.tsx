'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const buttonVariants = cva(
  // Base — Law 7: hover transitions only, 150ms
  'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        // Primary — violet CTA
        primary:
          'bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700',
        // Secondary — outlined
        secondary:
          'bg-transparent border border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:border-neutral-600',
        // Gold — premium action
        gold:
          'bg-yellow-500 text-neutral-950 font-semibold hover:bg-yellow-400 active:bg-yellow-600',
        // Ghost — low-emphasis
        ghost:
          'bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200',
        // Destructive
        destructive:
          'bg-red-700 text-white hover:bg-red-600 active:bg-red-800',
        // Link
        link:
          'bg-transparent text-violet-400 hover:text-violet-300 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        md: 'h-9 px-4 text-sm rounded-lg',
        lg: 'h-11 px-6 text-base rounded-lg',
        xl: 'h-13 px-8 text-lg rounded-lg',
        icon: 'h-9 w-9 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? loading}
        aria-disabled={disabled ?? loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Cargando…</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { buttonVariants }
