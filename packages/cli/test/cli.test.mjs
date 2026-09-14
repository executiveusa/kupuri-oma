import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync, rmSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const cli = resolve(here, '../dist/index.js')

test('creates a Spanish-first draft with approval gates', () => {
  const raw = execFileSync(
    process.execPath,
    [cli, 'brief', '--name', 'Café OMA', '--goal', 'Lanzar sitio', '--locale', 'es-MX'],
    { encoding: 'utf8' },
  )
  const result = JSON.parse(raw)
  assert.equal(result.locale, 'es-MX')
  assert.equal(result.state, 'DRAFT')
  assert.deepEqual(result.approvalRequiredFor, ['publish', 'spend', 'share'])
})

test('emits an MCP configuration', () => {
  const raw = execFileSync(process.execPath, [cli, 'mcp-config', '--locale', 'en'], {
    encoding: 'utf8',
  })
  const result = JSON.parse(raw)
  assert.equal(result.mcpServers['kupuri-oma'].env.OMA_LOCALE, 'en')
})

test('renders a safe, Spanish-first intent preview', () => {
  const out = resolve(here, 'preview-output.html')
  execFileSync(process.execPath, [
    cli,
    'preview',
    '--name',
    '<Café OMA>',
    '--goal',
    'Lanzar & revisar',
    '--locale',
    'es-MX',
    '--out',
    out,
  ])
  const html = readFileSync(out, 'utf8')
  assert.match(html, /VISTA PREVIA · BORRADOR/)
  assert.match(html, /&lt;Café OMA&gt;/)
  assert.match(html, /Lanzar &amp; revisar/)
  rmSync(out)
})
