#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { writeFile } from 'node:fs/promises'
import { renderPreview } from './preview.js'

const ES = {
  help: `Kupuri OMA CLI (vista previa privada)\n\nUso:\n  oma brief --name <nombre> --goal <objetivo> [--locale es-MX|en] [--out brief.json]\n  oma preview --name <nombre> --goal <objetivo> [--out preview.html]
  oma mcp-config [--out mcp.json]\n  oma doctor\n\nNada se publica ni se cobra desde esta CLI.`,
  missing: 'Faltan --name y --goal.',
  ready: 'Listo para conectar con el servidor MCP de Kupuri OMA.',
}
const EN = {
  help: `Kupuri OMA CLI (private preview)\n\nUsage:\n  oma brief --name <name> --goal <goal> [--locale es-MX|en] [--out brief.json]\n  oma preview --name <nombre> --goal <objetivo> [--out preview.html]
  oma preview --name <name> --goal <goal> [--out preview.html]
  oma mcp-config [--out mcp.json]\n  oma doctor\n\nThis CLI does not publish or charge anything.`,
  missing: '--name and --goal are required.',
  ready: 'Ready to connect to the Kupuri OMA MCP server.',
}

const [command = 'help', ...rest] = process.argv.slice(2)
const parsed = parseArgs({
  args: rest,
  options: {
    name: { type: 'string' },
    goal: { type: 'string' },
    locale: { type: 'string', default: 'es-MX' },
    out: { type: 'string' },
  },
  allowPositionals: true,
  strict: false,
})
const locale = parsed.values.locale === 'en' ? 'en' : 'es-MX'
const copy = locale === 'en' ? EN : ES
const emit = async (value: unknown) => {
  const text = `${JSON.stringify(value, null, 2)}\n`
  if (typeof parsed.values.out === 'string') {
    await writeFile(parsed.values.out, text, 'utf8')
    console.log(parsed.values.out)
  } else process.stdout.write(text)
}

if (command === 'brief') {
  if (!parsed.values.name || !parsed.values.goal) {
    console.error(copy.missing)
    process.exitCode = 1
  } else
    await emit({
      schemaVersion: '1.0',
      locale,
      project: { name: parsed.values.name, goal: parsed.values.goal },
      state: 'DRAFT',
      approvalRequiredFor: ['publish', 'spend', 'share'],
      createdAt: new Date().toISOString(),
    })
} else if (command === 'preview') {
  if (typeof parsed.values.name !== 'string' || typeof parsed.values.goal !== 'string') {
    console.error(copy.missing)
    process.exitCode = 1
  } else {
    const html = renderPreview({ name: parsed.values.name, goal: parsed.values.goal, locale })
    const out = typeof parsed.values.out === 'string' ? parsed.values.out : 'oma-preview.html'
    await writeFile(out, html, 'utf8')
    console.log(out)
  }
} else if (command === 'mcp-config') {
  await emit({
    mcpServers: {
      'kupuri-oma': {
        command: 'pnpm',
        args: ['--filter', '@kupuri/mcp-server', 'start'],
        env: { OMA_LOCALE: locale },
      },
    },
  })
} else if (command === 'doctor') {
  console.log(`Node ${process.versions.node}`)
  console.log(copy.ready)
} else console.log(copy.help)
