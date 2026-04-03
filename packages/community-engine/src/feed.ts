/**
 * Community feed query helpers.
 * Abstracts Prisma queries for the public community feed.
 */

import type { Locale } from '@kupuri/localization'

export interface FeedFilter {
  locale?: Locale
  featured?: boolean
  industry?: string
  vibe?: string
  motionFamily?: string
  premium?: boolean
  orderBy?: 'latest' | 'featured' | 'remix_count'
  page?: number
  pageSize?: number
}

export interface FeedItem {
  id: string
  projectId: string
  title: string
  description?: string
  locale: string
  tags: string[]
  featured: boolean
  remixCount: number
  qualityScore?: number
  premiumOnly: boolean
  screenshotUrl?: string
  authorName?: string
  publishedAt: Date
}

/**
 * Build Prisma `where` clause from feed filters.
 * Caller injects the Prisma client — this package remains DB-agnostic.
 */
export function buildFeedWhere(filter: FeedFilter): Record<string, unknown> {
  const where: Record<string, unknown> = {
    moderationState: 'APPROVED',
  }

  if (filter.featured !== undefined) {
    where['featured'] = filter.featured
  }

  if (filter.locale) {
    where['locale'] = filter.locale
  }

  if (filter.premium !== undefined) {
    where['project'] = {
      ...((where['project'] as Record<string, unknown>) ?? {}),
      premiumOnly: filter.premium,
    }
  }

  if (filter.industry) {
    where['project'] = {
      ...((where['project'] as Record<string, unknown>) ?? {}),
      template: { industry: filter.industry },
    }
  }

  return where
}

export function buildFeedOrderBy(orderBy: FeedFilter['orderBy'] = 'latest') {
  switch (orderBy) {
    case 'featured':
      return [{ featured: 'desc' }, { publishedAt: 'desc' }]
    case 'remix_count':
      return [{ project: { remixCount: 'desc' } }]
    case 'latest':
    default:
      return [{ publishedAt: 'desc' }]
  }
}
