import test from 'node:test'
import assert from 'node:assert/strict'
import { handleMcp } from '../dist-lib/mcp-core.js'

test('initializes with tools only', () => {
  const response = handleMcp({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} })
  assert.equal(response.result.serverInfo.name, 'kupuri-oma')
  assert.deepEqual(response.result.capabilities, { tools: { listChanged: false } })
})

test('lists only read-only staged tools', () => {
  const response = handleMcp({ jsonrpc: '2.0', id: 2, method: 'tools/list' })
  assert.deepEqual(
    response.result.tools.map((tool) => tool.name),
    ['oma_prepare_brief', 'oma_audit_design'],
  )
  assert.ok(response.result.tools.every((tool) => tool.annotations.readOnlyHint))
})

test('prepares a Spanish-first draft with approval gates', () => {
  const response = handleMcp({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'oma_prepare_brief',
      arguments: { name: 'Café Ixchel', goal: 'Presentar el menú y recibir visitas.' },
    },
  })
  assert.equal(response.result.structuredContent.estado, 'BORRADOR')
  assert.deepEqual(response.result.structuredContent.requiereAprobacionPara, [
    'publicar',
    'compartir',
    'gastar',
  ])
})
