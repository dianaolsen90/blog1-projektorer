import { readFileSync, writeFileSync, readdirSync } from "fs";

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>`;

const READ_TIMES = {
  "minilux-pro-test.html": "13 min",
  "minilux-pro-2-test.html": "14 min",
  "minilux-test.html": "10 min",
  "minilux-vs-pro.html": "12 min",
  "projektor-eller-tv.html": "9 min",
  "ansi-lumen.html": "8 min",
  "forsta-projektor-tips.html": "7 min",
  "sovrum-projektor.html": "10 min",
  "wifi-5-vs-6.html": "8 min",
  "utomhusbio.html": "8 min",
  "android-projektor.html": "9 min",
  "kontrastratio.html": "8 min",
  "projiceringsduk.html": "9 min",
};

const CATEGORY_ARTICLES = {
  "tester.html": ["minilux-pro-test.html", "minilux-pro-2-test.html", "minilux-test.html"],
  "guider.html": ["projektor-eller-tv.html", "sovrum-projektor.html", "projiceringsduk.html"],
  "tips.html": ["forsta-projektor-tips.html", "utomhusbio.html"],
  "jamforelser.html": ["minilux-vs-pro.html"],
  "teknik.html": ["ansi-lumen.html", "wifi-5-vs-6.html", "android-projektor.html", "kontrastratio.html"],
};

const CATEGORY_META = {
  "tester.html": {
    title: "Tester",
    subtitle: "Oberoende recensioner av miniprojektorer, testade i verkliga hem, utan betalda rekommendationer.",
  },
  "guider.html": {
    title: "Guider",
    subtitle: "Steg-för-steg-guider som hjälper dig välja, inställera och få ut det mesta av din projektor.",
  },
  "tips.html": {
    title: "Tips",
    subtitle: "Snabba och praktiska råd från våra experter, det som sällan står i produktbeskrivningarna.",
  },
  "jamforelser.html": {
    title: "Jämförelser",
    subtitle: "Modell mot modell. Vi hjälper dig avgöra om uppgraderingen är värd pengarna.",
  },
  "teknik.html": {
    title: "Teknik",
    subtitle: "Vi förklarar specifikationerna bakom marknadsföringen så du förstår vad som faktiskt spelar roll.",
  },
};

function activeFor(file) {
  const map = {
    "index.html": null,
    "tester.html": "tester.html",
    "guider.html": "guider.html",
    "tips.html": "tips.html",
    "jamforelser.html": "jamforelser.html",
    "teknik.html": "teknik.html",
  };
  if (map[file]) return map[file];
  if (file.includes("minilux") && file.includes("test")) return "tester.html";
  if (["projektor-eller-tv", "sovrum-projektor", "projiceringsduk", "forsta-projektor"].some((x) => file.includes(x)))
    return file.includes("forsta-projektor") ? "tips.html" : "guider.html";
  if (["utomhusbio"].some((x) => file.includes(x))) return "tips.html";
  if (file.includes("minilux-vs-pro")) return "jamforelser.html";
  if (["ansi-lumen", "wifi-5", "android-projektor", "kontrastratio"].some((x) => file.includes(x)))
    return "teknik.html";
  return null;
}

function nav(active) {
  const links = [
    ["tester.html", "Tester"],
    ["guider.html", "Guider"],
    ["tips.html", "Tips"],
    ["jamforelser.html", "Jämförelser"],
    ["teknik.html", "Teknik"],
  ];
  const items = links
    .map(([href, label]) => `<li><a href="${href}"${href === active ? ' class="active"' : ""}>${label}</a></li>`)
    .join("");
  return `<nav class="site-nav"><div class="nav-inner">
<a class="nav-brand" href="index.html"><span class="logo-mark">TP</span><span class="logo-text">TeknikPulsen</span></a>
<ul class="nav-links">${items}</ul>
<button class="nav-toggle" type="button" aria-label="Meny"><span></span><span></span><span></span></button>
<button class="nav-newsletter" type="button">Nyhetsbrev</button>
</div></nav>`;
}

function footer() {
  return `<footer class="site-footer"><div class="foot-inner"><div class="foot-top">
<div><a class="foot-brand" href="index.html"><span class="logo-mark">TP</span><span class="logo-text">TeknikPulsen</span></a>
<p class="foot-tagline">Oberoende blogg om elektronik, projektorer och smarta hem. Guider, tester och tips från erfarna experter.</p></div>
<div class="foot-col"><h4>Populära artiklar</h4><ul>
<li><a href="minilux-pro-test.html">MiniLux Pro test</a></li>
<li><a href="minilux-pro-2-test.html">MiniLux Pro 2 test</a></li>
<li><a href="minilux-vs-pro.html">MiniLux vs MiniLux Pro</a></li>
<li><a href="projektor-eller-tv.html">Projektor eller TV</a></li>
<li><a href="ansi-lumen.html">ANSI Lumen guide</a></li>
<li><a href="forsta-projektor-tips.html">6 saker innan köp</a></li></ul></div>
<div class="foot-col"><h4>Kategorier</h4><ul>
<li><a href="tester.html">Tester</a></li><li><a href="guider.html">Guider</a></li><li><a href="tips.html">Tips</a></li>
<li><a href="jamforelser.html">Jämförelser</a></li><li><a href="teknik.html">Teknik</a></li></ul></div></div>
<div class="foot-bottom">
<span>&copy; 2026 TeknikPulsen.se, Oberoende teknikblogg</span>
<div class="foot-bottom-links"><a href="#">Om oss</a><span>·</span><a href="#">Kontakt</a><span>·</span><a href="#">Integritetspolicy</a></div>
</div></div></footer>
<script src="site.js"></script>`;
}

function filterBar(activeHref) {
  const pills = [
    ["index.html", "Alla"],
    ["tester.html", "Tester"],
    ["guider.html", "Guider"],
    ["tips.html", "Tips"],
    ["teknik.html", "Teknik"],
    ["jamforelser.html", "Jämförelser"],
  ];
  return `<div class="filter-bar">${pills
    .map(
      ([href, label]) =>
        `<a class="filter-pill${href === activeHref ? " active" : ""}" href="${href}">${label}</a>`
    )
    .join("")}</div>`;
}

function sidebarHome() {
  return `<aside class="home-sidebar">
<div class="sb-block"><div class="sb-title">Mest läst</div><ul class="sb-list">
<li><a class="sb-item" href="minilux-pro-test.html"><span class="sb-num">01</span><div><div class="sb-item-title">MiniLux Pro test</div><div class="sb-item-meta">Test · 18 jan 2026</div></div></a></li>
<li><a class="sb-item" href="minilux-pro-2-test.html"><span class="sb-num">02</span><div><div class="sb-item-title">MiniLux Pro 2 test</div><div class="sb-item-meta">Test · 5 feb 2026</div></div></a></li>
<li><a class="sb-item" href="minilux-vs-pro.html"><span class="sb-num">03</span><div><div class="sb-item-title">MiniLux vs MiniLux Pro</div><div class="sb-item-meta">Jämförelse · 12 feb 2026</div></div></a></li>
<li><a class="sb-item" href="projektor-eller-tv.html"><span class="sb-num">04</span><div><div class="sb-item-title">Projektor eller TV</div><div class="sb-item-meta">Guide · 8 feb 2026</div></div></a></li>
<li><a class="sb-item" href="ansi-lumen.html"><span class="sb-num">05</span><div><div class="sb-item-title">ANSI Lumen guide</div><div class="sb-item-meta">Teknik · 25 jan 2026</div></div></a></li>
</ul></div>
<div class="sb-block"><div class="sb-title">Ämnen</div><div class="tag-cloud">
<a class="tag" href="tester.html">Tester</a><a class="tag" href="guider.html">Guider</a><a class="tag" href="tips.html">Tips</a>
<a class="tag" href="teknik.html">Teknik</a><a class="tag" href="jamforelser.html">Jämförelser</a><a class="tag" href="tester.html">Projektorer</a>
<a class="tag" href="wifi-5-vs-6.html">WiFi</a><a class="tag" href="ansi-lumen.html">4K</a><a class="tag" href="forsta-projektor-tips.html">Ljud</a>
<a class="tag" href="minilux-pro-test.html">Budget</a><a class="tag" href="sovrum-projektor.html">Sovrum</a><a class="tag" href="projektor-eller-tv.html">Hemmabio</a>
</div></div>
<div class="sb-block newsletter-box"><h3>Nyhetsbrev</h3><p>Få nya tester och guider direkt i inkorgen. Ingen spam.</p>
<input type="email" placeholder="din@email.se"/><button type="button">Prenumerera</button></div>
</aside>`;
}

function sidebarArticle() {
  return `<aside class="article-sidebar">
<div class="sb-block"><div class="sb-title">Mest läst</div><ul class="sb-list">
<li><a class="sb-item" href="minilux-pro-test.html"><span class="sb-num">01</span><div><div class="sb-item-title">MiniLux Pro test</div><div class="sb-item-meta">Test · 18 jan 2026</div></div></a></li>
<li><a class="sb-item" href="minilux-pro-2-test.html"><span class="sb-num">02</span><div><div class="sb-item-title">MiniLux Pro 2 test</div><div class="sb-item-meta">Test · 5 feb 2026</div></div></a></li>
<li><a class="sb-item" href="minilux-vs-pro.html"><span class="sb-num">03</span><div><div class="sb-item-title">MiniLux vs MiniLux Pro</div><div class="sb-item-meta">Jämförelse · 12 feb 2026</div></div></a></li>
<li><a class="sb-item" href="projektor-eller-tv.html"><span class="sb-num">04</span><div><div class="sb-item-title">Projektor eller TV</div><div class="sb-item-meta">Guide · 8 feb 2026</div></div></a></li>
<li><a class="sb-item" href="ansi-lumen.html"><span class="sb-num">05</span><div><div class="sb-item-title">ANSI Lumen guide</div><div class="sb-item-meta">Teknik · 25 jan 2026</div></div></a></li>
</ul></div>
<div class="sb-block"><div class="sb-title">Ämnen</div><div class="tag-cloud">
<a class="tag" href="tester.html">Tester</a><a class="tag" href="guider.html">Guider</a><a class="tag" href="tips.html">Tips</a>
<a class="tag" href="teknik.html">Teknik</a><a class="tag" href="jamforelser.html">Jämförelser</a><a class="tag" href="tester.html">Projektorer</a>
<a class="tag" href="wifi-5-vs-6.html">WiFi</a><a class="tag" href="ansi-lumen.html">4K</a><a class="tag" href="forsta-projektor-tips.html">Ljud</a>
<a class="tag" href="minilux-pro-test.html">Budget</a><a class="tag" href="sovrum-projektor.html">Sovrum</a><a class="tag" href="projektor-eller-tv.html">Hemmabio</a>
</div></div>
<div class="sb-block newsletter-box"><h3>Nyhetsbrev</h3><p>Få nya tester och guider direkt i inkorgen. Ingen spam.</p>
<input type="email" placeholder="din@email.se"/><button type="button">Prenumerera</button></div>
</aside>`;
}

function ensureHead(html) {
  html = html.replace(/<style>[\s\S]*?<\/style>\n?/g, "");
  if (!html.includes("fonts.googleapis.com")) {
    html = html.replace(/<meta name="description"[^/]*\/>\n/, (m) => m + FONT + "\n");
  }
  if (!html.includes('href="site.css"')) {
    html = html.replace(FONT + "\n", FONT + `\n<link rel="stylesheet" href="site.css"/>\n`);
  }
  return html;
}

function replaceNavFooter(html, file) {
  html = html.replace(/<nav[\s\S]*?<\/nav>\n?/g, nav(activeFor(file)) + "\n");
  html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>\n?(?:<script src="site\.js"><\/script>\n?)?/g, footer() + "\n");
  return html;
}

function addReadTimeToCard(card) {
  const hrefMatch = card.match(/href="([^"]+)"/);
  if (!hrefMatch) return card;
  const href = hrefMatch[1];
  const readTime = READ_TIMES[href];
  if (!readTime) return card;
  if (card.includes(readTime)) return card;
  return card.replace(
    /(<div class="card-foot"><div class="card-auth">[\s\S]*?<\/div>)(<\/div>)/,
    `$1<span class="sep"></span><span>${readTime}</span>$2`
  );
}

function buildIndex() {
  const cardHtml = [
    "minilux-pro-2-test.html",
    "minilux-test.html",
    "minilux-vs-pro.html",
    "projektor-eller-tv.html",
    "ansi-lumen.html",
    "forsta-projektor-tips.html",
    "sovrum-projektor.html",
    "wifi-5-vs-6.html",
    "utomhusbio.html",
    "android-projektor.html",
    "kontrastratio.html",
    "projiceringsduk.html",
  ]
    .map((href) => getCardCatalog()[href])
    .join("\n");

  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>TeknikPulsen | Elektronik, projektorer och smarta hem</title>
<meta name="description" content="Oberoende blogg om elektronik och projektorer. Guider, tester och tips från erfarna experter."/>
${FONT}
<link rel="stylesheet" href="site.css"/>
</head>
<body>
${nav(null)}
${filterBar("index.html")}
<div class="home-shell">
<div class="home-main">
<a class="featured-card" href="minilux-pro-test.html">
<div class="featured-text">
<div class="featured-top">
<div class="featured-author-row"><span class="av-sm">PB</span><span>Per Bergman</span><span class="sep"></span><span>18 jan 2026</span><span class="sep"></span><span>13 min</span></div>
<span class="pill p-test">Test</span>
<h2 class="featured-title">MiniLux Pro genomtestad: 200 ANSI och 130 tums bild</h2>
<p class="featured-excerpt">Vi testade MiniLux Pro i fyra veckor. 200 ANSI Lumen, XGA-upplösning och 180 graders roterbar lins. Är den värd 1 499 kr?</p>
</div>
<div class="featured-bottom">
<div class="featured-rating"><span class="stars">★★★★</span><span class="score">4.3</span></div>
<span class="read-link">Läs artikeln</span>
</div>
</div>
<div class="featured-img">[ Produktbild ]</div>
</a>
<div class="cards-grid">
${cardHtml}
</div>
</div>
${sidebarHome()}
</div>
${footer()}
</body>
</html>`;
}

function getCardCatalog() {
  const raw = {
    "minilux-pro-test.html": `<a class="card" href="minilux-pro-test.html">
      <div class="card-img ci-test">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-test">Test</span><span class="card-date">18 jan 2026</span></div><div class="card-title">MiniLux Pro genomtestad: 200 ANSI och 130 tums bild</div>
        <p class="card-excerpt">Vi testade MiniLux Pro i fyra veckor. 200 ANSI Lumen, XGA-upplösning och 180 graders roterbar lins. Är den värd 1 499 kr?</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs pb">PB</div> Per Bergman</div></div>
      </div>
    </a>`,
    "minilux-pro-2-test.html": `<a class="card" href="minilux-pro-2-test.html">
      <div class="card-img ci-test">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-test">Test</span><span class="card-date">5 feb 2026</span></div><div class="card-title">MiniLux Pro 2 testad: 390 ANSI och native 1080P</div>
        <p class="card-excerpt">Tre veckors test. Native 1080P, WiFi 6 och 5W HiFi. Är uppgraderingen till 1 999 kr värd det?</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs pb">PB</div> Per Bergman</div></div>
      </div>
    </a>`,
    "minilux-test.html": `<a class="card" href="minilux-test.html">
      <div class="card-img ci-test">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-test">Test</span><span class="card-date">1 feb 2026</span></div><div class="card-title">MiniLux Pro testad: nätansluten kompakt projektor</div>
        <p class="card-excerpt">Kompakt modell till 1 499 kr. 200 ANSI Lumen, 130 tum och över 4 000 appar. Kräver nätström.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs pb">PB</div> Per Bergman</div></div>
      </div>
    </a>`,
    "minilux-vs-pro.html": `<a class="card" href="minilux-vs-pro.html">
      <div class="card-img ci-jmf">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-jmf">Jämförelse</span><span class="card-date">12 feb 2026</span></div><div class="card-title">MiniLux Pro vs MiniLux Pro 2: är 500 kr skillnaden värd det?</div>
        <p class="card-excerpt">200 ANSI mot 390 ANSI. XGA mot native 1080P. Vi jämför båda modellerna sida vid sida.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs">AS</div> Anna Svensson</div></div>
      </div>
    </a>`,
    "projektor-eller-tv.html": `<a class="card" href="projektor-eller-tv.html">
      <div class="card-img ci-guide">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-guide">Guide</span><span class="card-date">8 feb 2026</span></div><div class="card-title">Projektor eller TV: vilket passar ditt hem bäst?</div>
        <p class="card-excerpt">En ärlig genomgång av båda alternativen. Storlek per krona, bildkvalitet och flexibilitet.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs">AS</div> Anna Svensson</div></div>
      </div>
    </a>`,
    "ansi-lumen.html": `<a class="card" href="ansi-lumen.html">
      <div class="card-img ci-tek">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-tek">Teknik</span><span class="card-date">25 jan 2026</span></div><div class="card-title">Vad betyder ANSI Lumen och hur många behöver du?</div>
        <p class="card-excerpt">Siffrorna på förpackningen säger sällan hela sanningen. Vi reder ut vad du faktiskt behöver veta.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs">AS</div> Anna Svensson</div></div>
      </div>
    </a>`,
    "forsta-projektor-tips.html": `<a class="card" href="forsta-projektor-tips.html">
      <div class="card-img ci-tips">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-tips">Tips</span><span class="card-date">14 jan 2026</span></div><div class="card-title">6 saker du bör veta innan du köper din första projektor</div>
        <p class="card-excerpt">Det där som sällan står i produktbeskrivningarna. Våra experter delar med sig av vad de önskar att de visste från början.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs">AS</div> Anna Svensson</div></div>
      </div>
    </a>`,
    "sovrum-projektor.html": `<a class="card" href="sovrum-projektor.html">
      <div class="card-img ci-guide">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-guide">Guide</span><span class="card-date">2 jan 2026</span></div><div class="card-title">Komplett guide: projicering i sovrummet utan att störa</div>
        <p class="card-excerpt">180 graders roterbar lins, hörlurar och keystone. Allt du behöver för en perfekt sovrumsupplevelse.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs">AS</div> Anna Svensson</div></div>
      </div>
    </a>`,
    "wifi-5-vs-6.html": `<a class="card" href="wifi-5-vs-6.html">
      <div class="card-img ci-tek">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-tek">Teknik</span><span class="card-date">8 jan 2026</span></div><div class="card-title">WiFi 5 vs WiFi 6 i projektorer: spelar det verkligen roll?</div>
        <p class="card-excerpt">Marknadsföringsnummer eller verklig skillnad? Vi testar i verkliga hem.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs pb">PB</div> Per Bergman</div></div>
      </div>
    </a>`,
    "utomhusbio.html": `<a class="card" href="utomhusbio.html">
      <div class="card-img ci-tips">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-tips">Tips</span><span class="card-date">12 dec 2025</span></div><div class="card-title">Utomhusbio på terrassen: en praktisk startguide</div>
        <p class="card-excerpt">Film på 120 tum mot husväggen. Enklare än du tror och imponerar alltid på gäster.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs">AS</div> Anna Svensson</div></div>
      </div>
    </a>`,
    "android-projektor.html": `<a class="card" href="android-projektor.html">
      <div class="card-img ci-tek">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-tek">Teknik</span><span class="card-date">5 dec 2025</span></div><div class="card-title">Android i projektorer: vad du faktiskt kan göra med det</div>
        <p class="card-excerpt">Streaming, spegling och appar. Vi går igenom vad inbyggt Android innebar i praktiken.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs pb">PB</div> Per Bergman</div></div>
      </div>
    </a>`,
    "kontrastratio.html": `<a class="card" href="kontrastratio.html">
      <div class="card-img ci-tek">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-tek">Teknik</span><span class="card-date">3 nov 2025</span></div><div class="card-title">Kontrastratio i projektorer: vad siffran faktiskt betyder</div>
        <p class="card-excerpt">En av de mest använda specifikationerna i marknadsföring och minst förstådda av köpare.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs pb">PB</div> Per Bergman</div></div>
      </div>
    </a>`,
    "projiceringsduk.html": `<a class="card" href="projiceringsduk.html">
      <div class="card-img ci-guide">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-guide">Guide</span><span class="card-date">25 okt 2025</span></div><div class="card-title">Välja projiceringsduk: storlek, material och vad du behöver</div>
        <p class="card-excerpt">En vit vägg funkar. Men rätt duk gör det bättre. Vi går igenom vad som faktiskt spelar roll.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs">AS</div> Anna Svensson</div></div>
      </div>
    </a>`,
  };
  const map = {};
  for (const [href, card] of Object.entries(raw)) {
    map[href] = addReadTimeToCard(card);
  }
  return map;
}

function extractCardsFromIndex(_html) {
  return getCardCatalog();
}

function buildCategoryPage(file) {
  const meta = CATEGORY_META[file];
  const articles = CATEGORY_ARTICLES[file];
  const cardMap = getCardCatalog();
  const cards = articles.map((href) => cardMap[href]).filter(Boolean).join("\n");

  const existing = readFileSync(file, "utf8");
  const titleMatch = existing.match(/<title>([^<]+)<\/title>/);
  const descMatch = existing.match(/<meta name="description" content="([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : `${meta.title} | TeknikPulsen`;
  const description = descMatch ? descMatch[1] : meta.subtitle;

  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title>
<meta name="description" content="${description}"/>
${FONT}
<link rel="stylesheet" href="site.css"/>
</head>
<body>
${nav(file)}
<div class="cat-hero">
<div class="cat-hero-logo"><span class="logo-mark">TP</span></div>
<h1>${meta.title}</h1>
<p>${meta.subtitle}</p>
</div>
${filterBar(file)}
<div class="home-shell">
<div class="home-main">
<div class="cards-grid">
${cards}
</div>
</div>
${sidebarHome()}
</div>
${footer()}
</body>
</html>`;
}

function processArticle(html, file) {
  html = ensureHead(html);
  if (!html.includes("article.css")) {
    html = html.replace(
      '<link rel="stylesheet" href="site.css"/>',
      '<link rel="stylesheet" href="site.css"/>\n<link rel="stylesheet" href="article.css"/>'
    );
  }
  html = replaceNavFooter(html, file);

  if (!html.includes("page-shell")) {
    html = html.replace(
      /<div class="art-wrap">([\s\S]*)<\/div>\s*(?:<\/div>\s*)?<aside class="article-sidebar">[\s\S]*?<\/aside>\s*<\/div>\s*<footer/,
      `<div class="page-shell"><div class="article-main"><div class="art-wrap">$1</div></div>${sidebarArticle()}</div>\n<footer`
    );
    html = html.replace(
      /<div class="art-wrap">([\s\S]*)<\/div>\s*<footer/,
      `<div class="page-shell"><div class="article-main"><div class="art-wrap">$1</div></div>${sidebarArticle()}</div>\n<footer`
    );
  } else {
    html = html.replace(/<aside class="article-sidebar">[\s\S]*?<\/aside>/, sidebarArticle());
  }

  html = html.replace(/<div class="bio-label">Artikelförfattare<\/div>/g, '<div class="bio-label">Expert</div>');
  html = html.replace(/class="av-lg av-(pb|as)"/g, 'class="av-lg av-$1"');

  const pillMap = { Test: "p-test", Guide: "p-guide", Tips: "p-tips", Teknik: "p-tek", Jämförelse: "p-jmf" };
  html = html.replace(/<span class="rel-pill">([^<]+)<\/span>/g, (_, label) => {
    const cls = pillMap[label.trim()] || "p-test";
    return `<span class="rel-pill pill ${cls}">${label}</span>`;
  });

  return html;
}

function processIndex() {
  return buildIndex();
}

writeFileSync("index.html", buildIndex(), "utf8");
console.log("Updated index.html");

for (const catFile of Object.keys(CATEGORY_META)) {
  writeFileSync(catFile, buildCategoryPage(catFile), "utf8");
  console.log("Updated", catFile);
}

const articleFiles = readdirSync(".").filter(
  (f) => f.endsWith(".html") && !["index.html", "_index_source.html", ...Object.keys(CATEGORY_META)].includes(f)
);

for (const file of articleFiles) {
  let html = readFileSync(file, "utf8");
  if (html.includes("art-wrap") || html.includes('class="body"')) {
    html = processArticle(html, file);
    writeFileSync(file, html, "utf8");
    console.log("Updated", file);
  }
}

console.log("Done.");
