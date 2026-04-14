#!/usr/bin/env bash
# stub-detector.sh — ZTE Protocol enforcement
# Fails if any source file contains stub patterns: TODO, FIXME, mock data markers
# Run before every commit.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PATTERNS=(
  'TODO:'
  'FIXME:'
  'HACK:'
  'STUB:'
  'PLACEHOLDER'
  'mock_data'
  'fake_data'
  'hardcoded_secret'
)

SCAN_DIRS=(
  'apps'
  'packages'
  'services'
)

EXCLUDE_PATTERNS=(
  'node_modules'
  '.next'
  'dist'
  'build'
  '.git'
  '*.test.*'
  '*.spec.*'
  'stub-detector.sh'
)

found_issues=0
total_files=0

echo ""
echo "──────────────────────────────────────────"
echo "  ZTE STUB DETECTOR"
echo "──────────────────────────────────────────"
echo ""

for dir in "${SCAN_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    continue
  fi

  # Build exclude args
  exclude_args=()
  for exc in "${EXCLUDE_PATTERNS[@]}"; do
    exclude_args+=(--exclude-dir="$exc" --exclude="$exc")
  done

  for pattern in "${PATTERNS[@]}"; do
    matches=$(grep -rn "$pattern" "$dir" \
      --include="*.ts" \
      --include="*.tsx" \
      --include="*.js" \
      --include="*.jsx" \
      --include="*.py" \
      --include="*.rs" \
      "${exclude_args[@]}" 2>/dev/null || true)

    if [ -n "$matches" ]; then
      echo -e "${RED}✗ Found '$pattern' in:${NC}"
      echo "$matches" | while IFS= read -r line; do
        echo "  $line"
        ((found_issues++)) || true
      done
      echo ""
    fi
  done
done

if [ $found_issues -gt 0 ]; then
  echo -e "${RED}✗ STUB DETECTOR: $found_issues issue(s) found. Fix before committing.${NC}"
  echo ""
  exit 1
else
  echo -e "${GREEN}✓ STUB DETECTOR: Clean. No stubs detected.${NC}"
  echo ""
  exit 0
fi
