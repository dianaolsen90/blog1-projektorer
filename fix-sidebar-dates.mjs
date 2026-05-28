import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SB = {
  'miniprojektor-se-recension.html': 'Recension · 24 maj 2026',
  'miniprojektor-se-omdome.html': 'Omdöme · 26 maj 2026',
  'minilux-pro-2-test.html': 'Recension · 22 maj 2026',
  'minilux-pro-test.html': 'Recension · 20 maj 2026',
  'minilux-vs-pro.html': 'Jämförelse · 16 maj 2026',
  'projektor-eller-tv.html': 'Guide · 8 maj 2026',
  'ansi-lumen.html': 'Teknik · 4 maj 2026',
  'sovrum-projektor.html': 'Guide · 28 apr 2026',
  'forsta-projektor-tips.html': 'Tips · 1 apr 2026',
};

for (const f of fs.readdirSync(ROOT).filter((x) => x.endsWith('.html'))) {
  let s = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (!s.includes('site.css')) continue;
  let changed = false;
  for (const [href, meta] of Object.entries(SB)) {
    const re = new RegExp(
      `(href="${href.replace(/\./g, '\\.')}"[^>]*>[\\s\\S]*?sb-item-meta">)[^<]+`,
      'g'
    );
    const n = s.replace(re, `$1${meta}`);
    if (n !== s) {
      s = n;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(path.join(ROOT, f), s);
    console.log('sidebar', f);
  }
}
