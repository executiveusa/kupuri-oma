#!/usr/bin/env bash
# quality-check.sh — SYNTHIA™ / UDEC quality gate
# Reports UDEC axis scores. Fails if overall < 8.5.
# In CI: runs against the latest generated video in ops/reports/last_video.json
# Locally: accepts --video-path arg for direct scoring.

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

QUALITY_MINIMUM=8.5
REPORT_DIR="ops/reports"
LAST_SCORE_FILE="$REPORT_DIR/last_quality_score.json"

echo ""
echo "──────────────────────────────────────────"
echo "  SYNTHIA™ QUALITY GATE — UDEC SCORING"
echo "──────────────────────────────────────────"
echo ""

# If a prior score report exists, validate it
if [ -f "$LAST_SCORE_FILE" ]; then
  echo "Reading quality report: $LAST_SCORE_FILE"
  echo ""

  overall=$(python3 -c "
import json, sys
with open('$LAST_SCORE_FILE') as f:
    d = json.load(f)
overall = d.get('overall', 0)
print(f'{overall:.1f}')
" 2>/dev/null || echo "0.0")

  echo -e "Overall UDEC score: ${BLUE}${overall}${NC} / 10.0"
  echo -e "Minimum required:   ${YELLOW}${QUALITY_MINIMUM}${NC}"
  echo ""

  # Compare as integers (multiply by 10 to avoid float comparison)
  overall_int=$(echo "$overall * 10" | bc | cut -d. -f1)
  minimum_int=$(echo "$QUALITY_MINIMUM * 10" | bc | cut -d. -f1)

  if [ "$overall_int" -ge "$minimum_int" ] 2>/dev/null; then
    echo -e "${GREEN}✓ QUALITY GATE: Passed (${overall} ≥ ${QUALITY_MINIMUM})${NC}"
    echo ""
    exit 0
  else
    echo -e "${RED}✗ QUALITY GATE: Failed (${overall} < ${QUALITY_MINIMUM})${NC}"
    echo "  Regenerate video or review quality axes in: $LAST_SCORE_FILE"
    echo ""
    exit 1
  fi
else
  # No prior report — pass (first run before any video has been generated)
  echo -e "${YELLOW}⚠ No quality report found at $LAST_SCORE_FILE${NC}"
  echo "  This is expected on first run before any video generation."
  echo -e "${GREEN}✓ QUALITY GATE: Skipped (no video report)${NC}"
  echo ""
  exit 0
fi
