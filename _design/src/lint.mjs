// Lint .dc.html artboards against SPEC.md format rules. Usage: node src/lint.mjs <file...>
import { readFileSync } from 'node:fs';
const LIGHT = new Set(['#F2F0EB','#EAE7E0','#FFFFFF','#121212','#5A5A5A','#CFCCC4','#E6297A','#6A5CFF','#FFFEFC']);
const DARK = new Set(['#141414','#1A1A1A','#1C1C1C','#F2F0EB','#9A9A9A','#2E2E2E','#FF3D8F','#7C6CFF']);
const RGBA_OK = ['rgba(230,41,122,0.18)','rgba(106,92,255,0.14)','rgba(18,18,18,0.10)','rgba(242,240,235,0)',
                 'rgba(255,61,143,0.30)','rgba(124,108,255,0.22)','rgba(0,0,0,0.55)','rgba(20,20,20,0)'];
let bad = 0;
for (const f of process.argv.slice(2)) {
  const s = readFileSync(f, 'utf8'); const issues = [];
  const isSystem = /System\.dc\.html$/.test(f), isDark = /Dark\.dc\.html$/.test(f);
  const allowed = isSystem ? new Set([...LIGHT, ...DARK]) : isDark ? DARK : LIGHT;
  const hexes = new Set((s.match(/#[0-9A-Fa-f]{6}\b/g) || []).map(h => h.toUpperCase()));
  for (const h of hexes) if (!allowed.has(h)) issues.push(`colour not in spec: ${h}`);
  for (const r of new Set(s.match(/rgba?\([^)]*\)/g) || [])) if (!RGBA_OK.includes(r.replace(/\s+/g, ''))) issues.push(`rgba not in spec: ${r}`);
  if (s.match(/#[0-9A-Fa-f]{3}\b(?![0-9A-Fa-f])/g)?.some(h => !/^#[0-9A-Fa-f]{6}/.test(h))) issues.push('3-digit hex present');
  if (/data-dc-script/.test(s)) issues.push('has data-dc-script');
  if (/\{\{/.test(s)) issues.push('has {{');
  if ((s.match(/<script/g) || []).length !== 1 || !s.includes('<script src="./support.js"></script>')) issues.push('script tag(s) wrong');
  if (!/<x-dc>[\s\S]*<\/x-dc>/.test(s)) issues.push('missing x-dc');
  if (/<[a-z]+[^>]*\s[a-z-]+=(?!")[^\s>]/i.test(s)) issues.push('unquoted attribute');
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(s)) issues.push('emoji present');
  for (const m of s.matchAll(/<img[^>]*src=("?)([^"\s>]+)\1/g)) if (!/^(blazer|shades|bus|topdown)\.avif$/.test(m[2]) || m[1] !== '"') issues.push(`img src: ${m[2]}`);
  const opens = (s.match(/<div\b/g) || []).length, closes = (s.match(/<\/div>/g) || []).length;
  if (opens !== closes) issues.push(`div mismatch open=${opens} close=${closes}`);
  const spans = (s.match(/<span\b/g) || []).length, spanc = (s.match(/<\/span>/g) || []).length;
  if (spans !== spanc) issues.push(`span mismatch open=${spans} close=${spanc}`);
  console.log(`${f}: ${issues.length ? issues.join('; ') : 'ok'} (${(s.length/1024).toFixed(0)} KB)`);
  bad += issues.length;
}
process.exit(bad ? 1 : 0);
