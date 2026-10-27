#!/usr/bin/env bash
# One-time setup in a fresh container (idempotent): Python packages, three.js / MathJax / Latin fonts for
# local testing, and the brush font (王漢宗中行書, GPL) the build embeds. Everything lands in vendor/ (git-ignored).
set -e
cd "$(dirname "$0")/.."
python3 - <<'PY' || pip install --break-system-packages -q opencv-python-headless pillow numpy fonttools brotli playwright
import cv2, PIL, numpy, fontTools, brotli, playwright
PY
mkdir -p vendor/fonts
[ -f vendor/package.json ] || echo '{"private": true}' > vendor/package.json
[ -d vendor/node_modules/three ] && [ -d vendor/node_modules/mathjax ] && [ -d vendor/node_modules/@fontsource/eb-garamond ] || \
  npm install --prefix vendor --no-audit --no-fund --silent three@0.169.0 mathjax@3.2.2 @fontsource/eb-garamond@5.1.0
[ -s vendor/fonts/wt071.ttf ] || curl -sSL -o vendor/fonts/wt071.ttf https://raw.githubusercontent.com/dictcp/wangfonts/master/TrueType/wt071.ttf
python3 -c "from playwright.sync_api import sync_playwright" 2>/dev/null || echo "playwright for Python is missing: pip install playwright (and a Chromium for it)"
echo "setup ok: $(ls vendor/node_modules | tr '\n' ' ')fonts: $(ls vendor/fonts)"
