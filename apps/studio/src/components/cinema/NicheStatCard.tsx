import { Card } from '@kupuri/design-system'
import { cn } from '@kupuri/design-system'

interface NicheStatCardProps {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: 'true' }>
  accentClass?: string
}

export function NicheStatCard({
  label,
  value,
  icon: Icon,
  accentClass = 'text-violet-400',
}: NicheStatCardProps) {
  return (
    <Card className="flex items-start gap-4 p-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800">
        <Icon className={cn('h-4 w-4', accentClass)} aria-hidden="true" />
      </div>
      <div>
        <p className="text-xl font-bold text-neutral-50 tabular-nums">{value}</p>
        <p className="mt-0.5 text-xs font-medium text-neutral-400">{label}</p>
      </div>
    </Card>
  )
}
