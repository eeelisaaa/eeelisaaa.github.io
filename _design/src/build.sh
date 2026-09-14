#!/bin/zsh
# Regenerate dark variants, lint every artboard, seed and check the canvas.
set -e
cd "$(dirname "$0")/.."
S=/private/tmp/claude-501/bundled-skills/2.1.266/be4c84d17e4df4aa76125e1a0076d0d6/design
for f in Main HomeMobile Links CV; do
  out=${f}Dark.dc.html; [ "$f" = Main ] && out=HomeDark.dc.html
  node src/darken.mjs $f.dc.html $out
done
node src/lint.mjs Main.dc.html HomeDark.dc.html HomeMobile.dc.html HomeMobileDark.dc.html Links.dc.html LinksDark.dc.html CV.dc.html CVDark.dc.html System.dc.html
node "$S/seed-canvas.mjs" --template "$S/payload.template.html" --out elisa-portfolio-redesign.html --title "Elisa Portfolio Redesign" \
  --artboard Main.dc.html --artboard HomeDark.dc.html --artboard HomeMobile.dc.html --artboard HomeMobileDark.dc.html \
  --artboard Links.dc.html --artboard LinksDark.dc.html --artboard CV.dc.html --artboard CVDark.dc.html --artboard System.dc.html \
  --artboard NeonDark.dc.html --artboard NeonLight.dc.html --artboard EditorialDark.dc.html --artboard EditorialLight.dc.html \
  --artboard ZineDark.dc.html --artboard ZineLight.dc.html --artboard WarmDark.dc.html --artboard WarmLight.dc.html \
  --image blazer.avif --image shades.avif --image bus.avif --image topdown.avif --canvas canvas.json
node "$S/seed-canvas.mjs" --check elisa-portfolio-redesign.html
