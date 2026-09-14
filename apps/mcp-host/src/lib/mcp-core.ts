export type RpcRequest = {
  jsonrpc?: string
  id?: string | number | null
  method?: string
  params?: unknown
}
type RpcResponse = {
  jsonrpc: '2.0'
  id: string | number | null
  result?: unknown
  error?: { code: number; message: string }
}

const tools = [
  {
    name: 'oma_prepare_brief',
    title: 'Preparar brief bilingüe',
    description:
      'Prepara un brief de proyecto en español de México primero. Devuelve un borrador; no publica, comparte ni cobra.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 120 },
        goal: { type: 'string', minLength: 10, maxLength: 2000 },
        audience: { type: 'string', maxLength: 500 },
        locale: { type: 'string', enum: ['es-MX', 'en'], default: 'es-MX' },
      },
      required: ['name', 'goal'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  },
  {
    name: 'oma_audit_design',
    title: 'Revisar diseño',
    description: 'Revisa código visual con reglas OMA y devuelve hallazgos. No cambia el código.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', minLength: 1, maxLength: 50000 },
        context: { type: 'string', maxLength: 1000 },
      },
      required: ['code'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  },
]

const text = (value: unknown) => ({
  content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
  structuredContent: value,
})
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const argString = (args: Record<string, unknown>, key: string, min = 1, max = 2000) => {
  const value = args[key]
  if (typeof value !== 'string' || value.trim().length < min || value.length > max)
    throw new Error(`Invalid ${key}`)
  return value.trim()
}

export function handleMcp(request: RpcRequest): RpcResponse | null {
  const id = request.id ?? null
  if (request.jsonrpc !== '2.0' || typeof request.method !== 'string')
    return { jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid Request' } }
  if (request.method === 'notifications/initialized') return null
  if (request.method === 'initialize')
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2025-06-18',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'kupuri-oma', version: '0.2.0' },
        instructions:
          'Español de México primero. Las herramientas disponibles sólo preparan y revisan borradores; no publican, comparten ni cobran.',
      },
    }
  if (request.method === 'ping') return { jsonrpc: '2.0', id, result: {} }
  if (request.method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools } }
  if (request.method !== 'tools/call')
    return { jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } }

  try {
    if (
      !isRecord(request.params) ||
      typeof request.params.name !== 'string' ||
      !isRecord(request.params.arguments)
    )
      throw new Error('Invalid tool call')
    const args = request.params.arguments
    if (request.params.name === 'oma_prepare_brief') {
      const name = argString(args, 'name', 1, 120)
      const goal = argString(args, 'goal', 10, 2000)
      const audience = typeof args.audience === 'string' ? args.audience.trim().slice(0, 500) : ''
      const locale = args.locale === 'en' ? 'en' : 'es-MX'
      const result =
        locale === 'en'
          ? {
              state: 'DRAFT',
              locale,
              project: { name, goal, audience },
              next: 'Review and correct the brief before building.',
              approvalRequiredFor: ['publish', 'share', 'spend'],
            }
          : {
              estado: 'BORRADOR',
              idioma: locale,
              proyecto: { nombre: name, objetivo: goal, audiencia: audience },
              siguiente: 'Revisa y corrige el brief antes de construir.',
              requiereAprobacionPara: ['publicar', 'compartir', 'gastar'],
            }
      return { jsonrpc: '2.0', id, result: text(result) }
    }
    if (request.params.name === 'oma_audit_design') {
      const code = argString(args, 'code', 1, 50000)
      const violations: string[] = []
      if (/backdrop-blur/.test(code)) violations.push('Glassmorphism: remove backdrop-blur.')
      if (/bg-gradient|bg-linear/.test(code))
        violations.push('Gradient background: use a solid surface.')
      if (/animate-bounce|animate-ping/.test(code))
        violations.push('Decorative animation: remove bounce/ping.')
      return {
        jsonrpc: '2.0',
        id,
        result: text({
          passed: violations.length === 0,
          score: Math.max(0, 10 - violations.length * 2),
          violations,
          context: typeof args.context === 'string' ? args.context : undefined,
        }),
      }
    }
    return { jsonrpc: '2.0', id, error: { code: -32602, message: 'Unknown tool' } }
  } catch (error) {
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32602, message: error instanceof Error ? error.message : 'Invalid params' },
    }
  }
}
