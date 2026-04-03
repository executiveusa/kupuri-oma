/**
 * Remix pipeline logic.
 *
 * When a user remixes a project:
 *   1. Clone the project schema
 *   2. Assign new owner
 *   3. Record parent → child graph edge
 *   4. Increment parent remixCount in DB
 *   5. Open in builder with inherited style data
 */

import { z } from 'zod'

export const RemixRequestSchema = z.object({
  parentProjectId: z.string(),
  newOwnerId: z.string(),
  newTitle: z.string().min(1).max(200).optional(),
  targetLocale: z.enum(['es-MX', 'en']).optional().default('es-MX'),
})

export type RemixRequest = z.infer<typeof RemixRequestSchema>

export interface RemixResult {
  newProjectId: string
  parentProjectId: string
  builderUrl: string
}

/**
 * Create the remix metadata object.
 * Persistence (Prisma write + graph edge) is done by the caller
 * to keep this function pure and testable.
 */
export function createRemixMetadata(
  req: RemixRequest,
  parentData: {
    templateId?: string
    industry?: string
    vibes?: string[]
    motionFamily?: string[]
    screenshots?: string[]
  },
) {
  const newId = `project_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  return {
    id: newId,
    slug: `remix-${newId}`,
    parentProjectId: req.parentProjectId,
    authorId: req.newOwnerId,
    templateId: parentData.templateId,
    defaultLocale: req.targetLocale,
    status: 'DRAFT' as const,
    // Inherit style metadata for builder suggestions
    inheritedData: {
      industry: parentData.industry,
      vibes: parentData.vibes ?? [],
      motionFamily: parentData.motionFamily ?? [],
    },
  }
}
