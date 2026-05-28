import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));

function rebrand(content) {
  let s = content;
  s = s.replace(/TeknikPulsen\.se/gi, 'miniprojektortips.se');
  s = s.replace(/teknikpulsen\.se/gi, 'miniprojektortips.se');
  s = s.replace(/TeknikPulsen/g, 'Miniprojektortips');
  s = s.replace(/projektorguiden\.se/g, 'miniprojektortips.se');
  s = s.replace(/projektorguiden/g, 'miniprojektortips.se');
  s = s.replace(/ProjektorTips/g, 'Miniprojektortips');
  s = s.replace(/redaktion@teknikpulsen\.se/gi, 'redaktion@miniprojektortips.se');
  s = s.replace(/<span class="logo-mark">TP<\/span>/g, '<span class="logo-mark">MT</span>');
  s = s.replace(/Oberoende teknikguider sedan 2023/g, 'Oberoende miniprojektorguider sedan 2023');
  return s;
}

const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
let total = 0;

for (const file of htmlFiles) {
  const filePath = path.join(ROOT, file);
  const orig = fs.readFileSync(filePath, 'utf8');
  const next = rebrand(orig);
  if (next !== orig) {
    fs.writeFileSync(filePath, next);
    total++;
    console.log('updated', file);
  }
}

console.log('done', total, 'files');
