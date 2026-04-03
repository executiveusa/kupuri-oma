import { z } from 'zod'

/**
 * Environment variable schema for all Kupuri OMA services.
 * Extend per-app by merging additional schemas with this base.
 */
export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export type BaseEnv = z.infer<typeof baseEnvSchema>

export const webEnvSchema = baseEnvSchema.extend({
  // Auth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // Database
  DATABASE_URL: z.string().url(),

  // Graph
  NEO4J_URI: z.string(),
  NEO4J_USER: z.string(),
  NEO4J_PASSWORD: z.string(),

  // Public (client-visible)
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['es-MX', 'en']).default('es-MX'),
})

export type WebEnv = z.infer<typeof webEnvSchema>

/**
 * Validate env at startup. Call from next.config or app root.
 */
export function validateEnv<T extends z.ZodTypeAny>(schema: T): z.infer<T> {
  const result = schema.safeParse(process.env)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    console.error('❌  Invalid environment variables:', errors)
    throw new Error('Invalid environment variables')
  }
  return result.data
}
