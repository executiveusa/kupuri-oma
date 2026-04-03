// packages/agent-orchestrator/src/bead-manager.ts
// Bead ID management — ZTE-YYYYMMDD-NNNN format

let _counter = 0;

function padded(n: number, digits = 4): string {
  return String(n).padStart(digits, '0');
}

/** Generate a new ZTE bead ID: ZTE-20260401-0001 */
export function generateBeadId(): string {
  const now = new Date();
  const date = [
    now.getFullYear(),
    padded(now.getMonth() + 1, 2),
    padded(now.getDate(), 2),
  ].join('');

  _counter = (_counter % 9999) + 1;
  return `ZTE-${date}-${padded(_counter)}`;
}

/** Reset counter (useful for tests) */
export function resetBeadCounter(): void {
  _counter = 0;
}
