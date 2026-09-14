// Generate the dark-mode variant of a light artboard by token substitution (see SPEC.md §1).
import { readFileSync, writeFileSync } from 'node:fs';
const [,, inFile, outFile] = process.argv;
const MAP = [
  ['#F2F0EB', '#141414'], ['#EAE7E0', '#1A1A1A'], ['#FFFFFF', '#1C1C1C'], ['#121212', '#F2F0EB'],
  ['#5A5A5A', '#9A9A9A'], ['#CFCCC4', '#2E2E2E'], ['#E6297A', '#FF3D8F'], ['#6A5CFF', '#7C6CFF'],
  ['#FFFEFC', '#141414'],
  ['rgba(230,41,122,0.18)', 'rgba(255,61,143,0.30)'], ['rgba(106,92,255,0.14)', 'rgba(124,108,255,0.22)'], ['rgba(230,41,122,', 'rgba(255,61,143,'], ['rgba(106,92,255,', 'rgba(124,108,255,'],
  ['rgba(18,18,18,0.10)', 'rgba(0,0,0,0.55)'], ['rgba(242,240,235,0)', 'rgba(20,20,20,0)'],
];
const MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>';
const SUN = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>';
let src = readFileSync(inFile, 'utf8');
// Two passes with placeholders so a mapped value is never re-mapped (e.g. #121212 -> #F2F0EB -> #141414).
MAP.forEach(([from], i) => {
  const ph = `@@T${i}@@`;
  src = src.split(from).join(ph).split(from.toLowerCase()).join(ph);
});
MAP.forEach(([, to], i) => { src = src.split(`@@T${i}@@`).join(to); });
src = src.split(MOON).join(SUN);
src = src.replace(/grayscale\(1\) contrast\(1\.08\)/g, 'grayscale(1) contrast(1.08) brightness(0.96)');
writeFileSync(outFile, src);
const found = src.match(/#(?:EAE7E0|FFFFFF|121212|5A5A5A|CFCCC4|E6297A|6A5CFF|FFFEFC)/gi) || [];
console.log(`${outFile}: ${found.length ? 'WARNING leaked light tokens: ' + [...new Set(found)].join(' ') : 'ok'}`);
