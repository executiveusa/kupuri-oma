#!/usr/bin/env bash
# secret-scanner.sh — SECRET_GUARD circuit breaker
# Fails if hardcoded secrets are detected in source files.
# Run before every commit.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Patterns that suggest hardcoded secrets
SECRET_PATTERNS=(
  'sk-[a-zA-Z0-9]{20,}'
  'pk_live_[a-zA-Z0-9]+'
  'pk_test_[a-zA-Z0-9]+'
  'rk_live_[a-zA-Z0-9]+'
  'whsec_[a-zA-Z0-9]+'
  'AKIA[0-9A-Z]{16}'
  'neo4j\+s://[^"]+:[^@]+@'
  'postgresql://[^"]+:[^@]+@'
  'redis://:[^@]+@'
  'ey[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'
)

SCAN_DIRS=('apps' 'packages' 'services' 'scripts')

EXCLUDE_PATTERNS=(
  'node_modules'
  '.next'
  'dist'
  'build'
  '.git'
  '.env.example'
  'secret-scanner.sh'
  '*.test.*'
  '*.spec.*'
)

found_secrets=0

echo ""
echo "──────────────────────────────────────────"
echo "  SECRET_GUARD SCANNER"
echo "──────────────────────────────────────────"
echo ""

for dir in "${SCAN_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    continue
  fi

  exclude_args=()
  for exc in "${EXCLUDE_PATTERNS[@]}"; do
    exclude_args+=(--exclude-dir="$exc" --exclude="$exc")
  done

  for pattern in "${SECRET_PATTERNS[@]}"; do
    matches=$(grep -rn -E "$pattern" "$dir" \
      --include="*.ts" \
      --include="*.tsx" \
      --include="*.js" \
      --include="*.py" \
      --include="*.rs" \
      --include="*.json" \
      "${exclude_args[@]}" 2>/dev/null || true)

    if [ -n "$matches" ]; then
      echo -e "${RED}✗ Potential secret pattern '${pattern}' found:${NC}"
      echo "$matches" | sed 's/\(.\{80\}\).*/\1…/' | while IFS= read -r line; do
        echo "  $line"
        ((found_secrets++)) || true
      done
      echo ""
    fi
  done
done

if [ $found_secrets -gt 0 ]; then
  echo -e "${RED}✗ SECRET_GUARD: $found_secrets potential secret(s) detected. Move to environment vault.${NC}"
  echo ""
  exit 1
else
  echo -e "${GREEN}✓ SECRET_GUARD: Clean. No hardcoded secrets detected.${NC}"
  echo ""
  exit 0
fi
