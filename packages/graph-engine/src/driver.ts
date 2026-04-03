/**
 * Kupuri OMA Graph Schema
 *
 * Nodes and edge types for the graph knowledge layer.
 * Backed by Neo4j.
 *
 * Node types
 * ----------
 * Project, Template, Component, MotionPattern, ColorSystem,
 * Industry, Locale, Asset, Prompt, BuildRun, CommunityPost,
 * QualityScore, AgentTask, User
 *
 * Edge types
 * ----------
 * USES, REMIXES, TRANSLATES_TO, INSPIRED_BY, BELONGS_TO_INDUSTRY,
 * SHARES_MOTION_FAMILY, MATCHES_VIBE, PRODUCED_BY, VERIFIED_BY,
 * SUPERSEDES, AUTHORED_BY, TAGGED_WITH
 */

import neo4j, { type Driver, type Session } from 'neo4j-driver'

let _driver: Driver | null = null

export function getDriver(): Driver {
  if (!_driver) {
    const uri = process.env['NEO4J_URI']
    const user = process.env['NEO4J_USER']
    const password = process.env['NEO4J_PASSWORD']

    if (!uri || !user || !password) {
      throw new Error('Neo4j environment variables are not set (NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)')
    }

    _driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  }
  return _driver
}

export function getSession(database = 'neo4j'): Session {
  return getDriver().session({ database })
}

export async function closeDriver(): Promise<void> {
  if (_driver) {
    await _driver.close()
    _driver = null
  }
}

// ─── Constraint / Index setup ────────────────────────────────────────────────

/** Run once during migration / seed to create graph constraints */
export async function setupConstraints(): Promise<void> {
  const session = getSession()
  try {
    const constraints = [
      'CREATE CONSTRAINT project_id IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE',
      'CREATE CONSTRAINT template_id IF NOT EXISTS FOR (t:Template) REQUIRE t.id IS UNIQUE',
      'CREATE CONSTRAINT component_id IF NOT EXISTS FOR (c:Component) REQUIRE c.id IS UNIQUE',
      'CREATE CONSTRAINT industry_name IF NOT EXISTS FOR (i:Industry) REQUIRE i.name IS UNIQUE',
      'CREATE CONSTRAINT locale_code IF NOT EXISTS FOR (l:Locale) REQUIRE l.code IS UNIQUE',
      'CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE',
      'CREATE CONSTRAINT motion_pattern_id IF NOT EXISTS FOR (m:MotionPattern) REQUIRE m.id IS UNIQUE',
    ]

    for (const query of constraints) {
      await session.run(query)
    }
  } finally {
    await session.close()
  }
}
