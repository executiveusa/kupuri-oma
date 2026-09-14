const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!,
  )

export function renderPreview(input: { name: string; goal: string; locale: 'es-MX' | 'en' }) {
  const name = escapeHtml(input.name)
  const goal = escapeHtml(input.goal)
  const es = input.locale === 'es-MX'
  const copy = es
    ? {
        eyebrow: 'VISTA PREVIA · BORRADOR',
        title: name,
        goal,
        next: 'Siguiente paso',
        action: 'Revisa el objetivo. Ajusta el brief antes de construir.',
        safety: 'Nada se publicó, compartió ni cobró.',
      }
    : {
        eyebrow: 'PREVIEW · DRAFT',
        title: name,
        goal,
        next: 'Next step',
        action: 'Review the goal. Adjust the brief before building.',
        safety: 'Nothing was published, shared, or charged.',
      }

  return `<!doctype html>
<html lang="${input.locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} · Kupuri OMA</title>
<style>:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:#09090b;color:#fafafa}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px}.card{width:min(720px,100%);border:1px solid #3f3f46;border-radius:20px;background:#18181b;padding:clamp(28px,6vw,64px)}.eyebrow{color:#c4b5fd;font-size:12px;font-weight:700;letter-spacing:.14em}.goal{font-size:clamp(34px,7vw,68px);line-height:1.02;letter-spacing:-.04em;margin:18px 0 24px}.intent{font-size:18px;line-height:1.6;color:#d4d4d8}.next{margin-top:48px;padding-top:24px;border-top:1px solid #3f3f46}.next strong{display:block;margin-bottom:8px}.next p,.safety{color:#a1a1aa}.safety{font-size:13px;margin-top:28px}</style></head>
<body><main class="card"><div class="eyebrow">${copy.eyebrow}</div><h1 class="goal">${copy.title}</h1><p class="intent">${copy.goal}</p><section class="next"><strong>${copy.next}</strong><p>${copy.action}</p></section><p class="safety">${copy.safety}</p></main></body></html>`
}
