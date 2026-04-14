import Link from 'next/link'
import { VideoOff } from 'lucide-react'
import { cn } from '@kupuri/design-system'

interface NicheEmptyStateProps {
  message: string
  hint: string
  cta: string
  href: string
  compact?: boolean
  accentClass?: string
}

export function NicheEmptyState({
  message,
  hint,
  cta,
  href,
  compact = false,
  accentClass = 'bg-violet-600 hover:bg-violet-500',
}: NicheEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-800 text-center',
        compact ? 'px-4 py-8' : 'px-8 py-14',
      )}
    >
      <VideoOff
        className={cn('text-neutral-700', compact ? 'h-7 w-7' : 'h-9 w-9')}
        aria-hidden="true"
      />
      <div>
        <p className={cn('font-medium text-neutral-400', compact ? 'text-xs' : 'text-sm')}>
          {message}
        </p>
        {!compact && (
          <p className="mt-1 text-xs text-neutral-600">{hint}</p>
        )}
      </div>
      <Link
        href={href}
        className={cn(
          'inline-flex items-center rounded-lg px-3 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950',
          accentClass,
          compact ? 'h-7 text-xs' : 'h-9 text-sm',
        )}
      >
        {cta}
      </Link>
    </div>
  )
}
