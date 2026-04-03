import { getSession } from '../driver'

/**
 * Find templates that share vibe, motion family, or industry with a given project.
 * Used by the Design Composer Agent for graph-backed template search.
 */
export async function findRelatedTemplates(params: {
  vibes?: string[]
  industry?: string
  motionFamily?: string
  locale?: string
  limit?: number
}): Promise<Array<{ templateId: string; name: string; score: number }>> {
  const session = getSession()
  const { vibes = [], industry, motionFamily, locale = 'es-MX', limit = 10 } = params

  try {
    const result = await session.run(
      `
      MATCH (t:Template)
      OPTIONAL MATCH (t)-[:BELONGS_TO_INDUSTRY]->(i:Industry {name: $industry})
      OPTIONAL MATCH (t)-[:SHARES_MOTION_FAMILY]->(m:MotionPattern {id: $motionFamily})
      OPTIONAL MATCH (t)-[:TAGGED_WITH]->(v:Vibe)
        WHERE v.name IN $vibes
      WITH t,
        count(DISTINCT i) * 3 AS industryScore,
        count(DISTINCT m) * 2 AS motionScore,
        count(DISTINCT v) AS vibeScore
      WHERE t.locales IS NULL OR $locale IN t.locales
      WITH t, (industryScore + motionScore + vibeScore) AS totalScore
      ORDER BY totalScore DESC
      LIMIT $limit
      RETURN t.id AS templateId, t.name AS name, totalScore AS score
      `,
      { industry: industry ?? null, motionFamily: motionFamily ?? null, vibes, locale, limit: neo4j.int(limit) },
    )

    return result.records.map((r) => ({
      templateId: r.get('templateId') as string,
      name: r.get('name') as string,
      score: (r.get('score') as { toNumber: () => number }).toNumber(),
    }))
  } finally {
    await session.close()
  }
}

/**
 * Record a remix edge between projects.
 * Creates parent → REMIXES → child relationship.
 */
export async function recordRemix(params: {
  parentProjectId: string
  childProjectId: string
  authorId: string
}): Promise<void> {
  const session = getSession()
  try {
    await session.run(
      `
      MERGE (parent:Project {id: $parentProjectId})
      MERGE (child:Project {id: $childProjectId})
      MERGE (child)-[:REMIXES {authorId: $authorId, at: datetime()}]->(parent)
      SET parent.remixCount = coalesce(parent.remixCount, 0) + 1
      `,
      params,
    )
  } finally {
    await session.close()
  }
}

/**
 * Upsert a project node in the graph with its metadata.
 */
export async function upsertProjectNode(params: {
  id: string
  title: string
  locale: string
  industry?: string
  vibes?: string[]
  motionFamily?: string[]
  qualityScore?: number
}): Promise<void> {
  const { id, title, locale, industry, vibes = [], motionFamily = [], qualityScore } = params
  const session = getSession()

  try {
    await session.run(
      `
      MERGE (p:Project {id: $id})
      SET p.title = $title,
          p.locale = $locale,
          p.qualityScore = $qualityScore,
          p.updatedAt = datetime()

      WITH p
      FOREACH (v IN $vibes |
        MERGE (vibe:Vibe {name: v})
        MERGE (p)-[:TAGGED_WITH]->(vibe)
      )
      FOREACH (mf IN $motionFamily |
        MERGE (m:MotionPattern {id: mf})
        MERGE (p)-[:SHARES_MOTION_FAMILY]->(m)
      )
      `,
      { id, title, locale, qualityScore: qualityScore ?? null, vibes, motionFamily },
    )

    if (industry) {
      await session.run(
        `
        MATCH (p:Project {id: $id})
        MERGE (i:Industry {name: $industry})
        MERGE (p)-[:BELONGS_TO_INDUSTRY]->(i)
        `,
        { id, industry },
      )
    }
  } finally {
    await session.close()
  }
}

// Lazy import to avoid circular deps
import neo4j from 'neo4j-driver'
