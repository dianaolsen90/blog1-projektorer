import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && fs.readFileSync(path.join(ROOT, f), 'utf8').includes('href="site.css"'));

const FOOT_POP = `<li><a href="minilux-pro-test.html">MiniLux Pro recension</a></li>
<li><a href="minilux-pro-2-test.html">MiniLux Pro 2 recension</a></li>
<li><a href="miniprojektor-se-recension.html">Miniprojektor.se recension</a></li>
<li><a href="basta-projektorer-2026.html">Bästa projektorer 2026</a></li>
<li><a href="projektor-eller-tv.html">Projektor eller TV</a></li>
<li><a href="ansi-lumen.html">ANSI Lumen guide</a></li>`;

const TAGLINE =
  'Vi granskar, testar och förklarar konsumentelektronik utan reklamlöften. Alla produkter köps med egna medel och testas i verkliga svenska hem.';

const DATES = {
  'miniprojektor-se-omdome.html': '26 maj 2026',
  'miniprojektor-se-recension.html': '24 maj 2026',
  'minilux-pro-2-test.html': '22 maj 2026',
  'minilux-pro-test.html': '20 maj 2026',
  'minilux-vs-pro.html': '16 maj 2026',
  'projektor-eller-tv.html': '8 maj 2026',
  'ansi-lumen.html': '4 maj 2026',
  'sovrum-projektor.html': '28 apr 2026',
  'utomhusbio.html': '24 apr 2026',
  'android-projektor.html': '20 apr 2026',
  'wifi-5-vs-6.html': '12 apr 2026',
  'kontrastratio.html': '8 apr 2026',
  'projiceringsduk.html': '4 apr 2026',
  'forsta-projektor-tips.html': '1 apr 2026',
  'minilux-test.html': '18 maj 2026',
};

const ANCHOR_LINKS = {
  'ansi-lumen.html': {
    pattern: /<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/,
    replace:
      '<a href="https://miniprojektor.se/products/minilux-pro-2-smart-miniprojektor-med-bluetooth-och-wifi-svart" rel="dofollow">MiniLux Pro 2 (1 999 kr)</a>',
  },
  'projektor-eller-tv.html': {
    pattern: /<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/,
    replace:
      '<a href="https://miniprojektor.se/products/minilux-pro-smart-miniprojektor" rel="dofollow">Läs mer om MiniLux Pro</a>',
  },
  'sovrum-projektor.html': {
    pattern: /<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/,
    replace:
      '<a href="https://miniprojektor.se/products/minilux-pro-smart-miniprojektor" rel="dofollow">se MiniLux Pro hos miniprojektor.se</a>',
  },
  'utomhusbio.html': {
    pattern: /<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/,
    replace:
      '<a href="https://miniprojektor.se/products/minilux-pro-smart-miniprojektor" rel="dofollow">MiniLux Pro hos återförsäljaren</a>',
  },
  'android-projektor.html': {
    pattern: /<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/,
    replace:
      '<a href="https://miniprojektor.se/products/minilux-pro-2-smart-miniprojektor-med-bluetooth-och-wifi-svart" rel="dofollow">Här hittar du MiniLux Pro 2</a>',
  },
  'kontrastratio.html': {
    pattern: /<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/,
    replace:
      '<a href="https://miniprojektor.se/products/minilux-pro-2-smart-miniprojektor-med-bluetooth-och-wifi-svart" rel="dofollow">vi testade MiniLux Pro 2</a>',
  },
  'projiceringsduk.html': {
    pattern: /<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/,
    replace:
      '<a href="https://miniprojektor.se/products/minilux-pro-smart-miniprojektor" rel="dofollow">MiniLux Pro (1 499 kr)</a>',
  },
  'wifi-5-vs-6.html': {
    pattern: /<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/,
    replace:
      '<a href="https://miniprojektor.se/products/minilux-pro-2-smart-miniprojektor-med-bluetooth-och-wifi-svart" rel="dofollow">MiniLux Pro 2 med WiFi 6</a>',
  },
  'forsta-projektor-tips.html': {
    pattern: /<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/,
    replace:
      '<a href="https://miniprojektor.se/products/minilux-pro-2-smart-miniprojektor-med-bluetooth-och-wifi-svart" rel="dofollow">Läs mer om MiniLux Pro 2</a>',
  },
  'minilux-test.html': {
    pattern: /<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/,
    replace:
      '<a href="https://miniprojektor.se/products/minilux-pro-smart-miniprojektor" rel="dofollow">MiniLux Pro hos miniprojektor.se</a>',
  },
};

const CTA_ARTICLES = new Set([
  'minilux-pro-test.html',
  'minilux-pro-2-test.html',
  'minilux-vs-pro.html',
  'miniprojektor-se-recension.html',
  'miniprojektor-se-omdome.html',
]);

const CTAS = {
  'minilux-pro-test.html': `<div class="article-cta">
  <div class="cta-label">Var kan jag köpa?</div>
  <p class="cta-title">MiniLux Pro</p>
  <p class="cta-subtitle">200 ANSI Lumen · 130 tums bild · 1 499 kr</p>
  <a href="https://miniprojektor.se/products/minilux-pro-smart-miniprojektor" rel="dofollow">Till MiniLux Pro →</a>
</div>`,
  'minilux-pro-2-test.html': `<div class="article-cta">
  <div class="cta-label">Testad och rekommenderad</div>
  <p class="cta-title">MiniLux Pro 2 — 1 999 kr</p>
  <p class="cta-subtitle">390 ANSI Lumen · 150 tums bild · WiFi 6</p>
  <a href="https://miniprojektor.se/products/minilux-pro-2-smart-miniprojektor-med-bluetooth-och-wifi-svart" rel="dofollow">Köp hos miniprojektor.se</a>
</div>`,
  'minilux-vs-pro.html': `<div class="article-cta">
  <div class="cta-label">Vill du läsa mer?</div>
  <p class="cta-title">MiniLux Pro 2</p>
  <p class="cta-subtitle">Se aktuellt pris och tillgänglighet</p>
  <a href="https://miniprojektor.se/products/minilux-pro-2-smart-miniprojektor-med-bluetooth-och-wifi-svart" rel="dofollow">Läs mer om MiniLux Pro 2</a>
</div>`,
  'miniprojektor-se-recension.html': `<div class="article-cta">
  <div class="cta-label">Besök butiken</div>
  <p class="cta-title">Miniprojektor.se</p>
  <p class="cta-subtitle">Fri frakt · 2 års garanti · 4-7 dagars leverans</p>
  <a href="https://miniprojektor.se" rel="dofollow">Gå till Miniprojektor.se</a>
</div>`,
  'miniprojektor-se-omdome.html': `<div class="article-cta">
  <div class="cta-label">Handla tryggt</div>
  <p class="cta-title">Miniprojektor.se</p>
  <p class="cta-subtitle">Fri frakt · Swish och Klarna · Svar inom 24h</p>
  <a href="https://miniprojektor.se" rel="dofollow">Se produkterna hos Miniprojektor.se</a>
</div>`,
};

function applyGlobal(s) {
  s = s.replace(/projektorguiden\.se/g, 'TeknikPulsen.se');
  s = s.replace(/<span class="logo-mark">PG<\/span>/g, '<span class="logo-mark">TP</span>');
  s = s.replace(/Oberoende projektorguider sedan 2023/g, 'Oberoende teknikguider sedan 2023');
  s = s.replace(
    /<p class="foot-tagline">[\s\S]*?<\/p>/,
    `<p class="foot-tagline">${TAGLINE}</p>`
  );
  s = s.replace(
    /<span>&copy; 2026[^<]*<\/span>/,
    '<span>&copy; 2026 TeknikPulsen.se · Vi testar utan att kompromissa</span>'
  );
  s = s.replace(/, projektorguiden\.se/g, ', TeknikPulsen.se');
  s = s.replace(/Före projektorguiden\.se/g, 'Före TeknikPulsen');
  s = s.replace(
    /<div class="foot-col"><h4>Populära artiklar<\/h4><ul>[\s\S]*?<\/ul><\/div>/,
    `<div class="foot-col"><h4>Populära artiklar</h4><ul>\n${FOOT_POP}\n</ul></div>`
  );
  s = s.replace(/MiniLux Pro omdöme/g, 'MiniLux Pro recension');
  s = s.replace(/MiniLux Pro 2 omdöme/g, 'MiniLux Pro 2 recension');
  s = s.replace(/\u2014/g, '-');
  s = s.replace(/&mdash;/g, '-');
  return s;
}

function stripExtraProductLinks(s, file) {
  if (!CTA_ARTICLES.has(file)) return s;
  const intro = s.match(/<div class="body">([\s\S]*?)(?=<h2|<div class="score|<div class="article-cta|<div class="verdict)/);
  if (!intro) return s;
  const bodyStart = s.indexOf('<div class="body">');
  const authorIdx = s.indexOf('<div class="author-bio">');
  if (bodyStart < 0 || authorIdx < 0) return s;
  let body = s.slice(bodyStart, authorIdx);
  const introLink = body.match(/<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/);
  body = body.replace(/<a href="https:\/\/miniprojektor\.se\/products[^"]*" rel="dofollow">[^<]*<\/a>/g, '');
  if (introLink) {
    const p0 = body.indexOf('<p>');
    const p1 = body.indexOf('</p>', p0);
    if (p0 >= 0 && p1 > p0 && !body.slice(p0, p1).includes('miniprojektor.se')) {
      body = body.slice(0, p1) + ' ' + introLink[0] + body.slice(p1);
    }
  }
  return s.slice(0, bodyStart) + body + s.slice(authorIdx);
}

function updateCta(s, file) {
  if (!CTAS[file]) return s;
  s = s.replace(/<div class="article-cta">[\s\S]*?<\/div>\s*(?=<div class="author-bio">)/, CTAS[file] + '\n');
  return s;
}

function updateDate(s, file) {
  const d = DATES[file];
  if (!d) return s;
  s = s.replace(/<span>\d{1,2} (maj|apr) 2026<\/span>(?=[^<]*<\/div>\s*<div class="post-img|<\/div>\s*<div class="trust)/, `<span>${d}</span>`);
  s = s.replace(/(meta-bar[\s\S]*?<span>)\d{1,2} (maj|apr) 2026(<\/span>)/, `$1${d}$3`);
  s = s.replace(/(sb-item-meta[^>]*· )\d{1,2} (maj|apr) 2026/g, (m, p) => {
    if (file.includes('miniprojektor') && m.includes('Recension')) return `${p}${DATES['miniprojektor-se-recension.html']}`;
    if (file.includes('miniprojektor') && m.includes('Omdöme')) return `${p}${DATES['miniprojektor-se-omdome.html']}`;
    return `${p}${d}`;
  });
  return s;
}

function optimize(s) {
  s = s.replace(/[ \t]+$/gm, '');
  s = s.replace(/\n{3,}/g, '\n\n');
  s = s.replace(/<!--[\s\S]*?-->\n?/g, '');
  return s;
}

let n = 0;
for (const file of files) {
  let s = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const orig = s;
  s = applyGlobal(s);
  s = updateDate(s, file);
  if (ANCHOR_LINKS[file]) {
    const links = s.match(/<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/g) || [];
    if (links.length) {
      s = s.replace(ANCHOR_LINKS[file].pattern, ANCHOR_LINKS[file].replace);
      s = s.replace(/<a href="https:\/\/miniprojektor\.se[^"]*" rel="dofollow">[^<]*<\/a>/g, (m, i) => (i === 0 ? m : ''));
    }
  }
  if (CTA_ARTICLES.has(file)) s = stripExtraProductLinks(s, file);
  s = updateCta(s, file);
  s = optimize(s);
  if (s !== orig) {
    fs.writeFileSync(path.join(ROOT, file), s);
    n++;
    console.log('updated', file);
  }
}
console.log('done', n, 'files');
