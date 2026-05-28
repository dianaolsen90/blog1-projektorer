import { readFileSync, writeFileSync, readdirSync } from "fs";

const FOOT_TAGLINE_OLD =
  "Vi granskar, testar och förklarar konsumentelektronik utan reklamlöften. Alla produkter köps med egna medel och testas i verkliga hem.";
const FOOT_TAGLINE_NEW =
  "Vi granskar, testar och förklarar konsumentelektronik utan reklamlöften. Alla produkter köps med egna medel och testas i verkliga hem.";
const COPYRIGHT_OLD = "&copy; 2026 TeknikPulsen.se, Oberoende teknikblogg";
const COPYRIGHT_NEW = "&copy; 2026 TeknikPulsen.se · Vi testar utan att kompromissa";

const COMPARISON_TITLE = "MiniLux Pro vs MiniLux Pro 2: vilken ska du välja 2026?";
const COMPARISON_OLD_FULL =
  "MiniLux Pro vs MiniLux Pro 2: är 500 kr skillnaden värd det?";
const COMPARISON_META =
  "Jämför MiniLux Pro och MiniLux Pro 2. Vi hjälper dig välja rätt modell utan onödig uppgradering.";

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>`;

const MASTHEAD = `<div class="masthead"><div class="masthead-inner"><span>Oberoende teknikjournalistik sedan 2023</span><span>Ingen reklam, inga sponsrade recensioner</span></div></div>`;

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

function add2026(title) {
  if (/\b2026\b/.test(title)) return title;
  if (title.trim().endsWith("?")) return `${title.trim()} (2026)`;
  return `${title.trim()} 2026`;
}

/** @type {Record<string, { h1: string, date: string, skip2026?: boolean }>} */
const TEKNIKPULS_ARTICLES = {
  "projiceringsduk.html": {
    h1: "Välja projiceringsduk: storlek, material och vad du behöver",
    date: "2 april 2026",
  },
  "utomhusbio.html": {
    h1: "Utomhusbio på terrassen: en praktisk startguide",
    date: "8 april 2026",
  },
  "forsta-projektor-tips.html": {
    h1: "6 saker du bör veta innan du köper din första projektor",
    date: "14 april 2026",
  },
  "android-projektor.html": {
    h1: "Android i projektorer: vad du faktiskt kan göra med det",
    date: "19 april 2026",
  },
  "ansi-lumen.html": {
    h1: "Vad betyder ANSI Lumen och hur många behöver du?",
    date: "24 april 2026",
  },
  "wifi-5-vs-6.html": {
    h1: "WiFi 5 vs WiFi 6 i projektorer: spelar det verkligen roll?",
    date: "28 april 2026",
  },
  "kontrastratio.html": {
    h1: "Kontrastratio i projektorer: vad siffran faktiskt betyder",
    date: "3 maj 2026",
  },
  "sovrum-projektor.html": {
    h1: "Komplett guide: projicering i sovrummet utan att störa",
    date: "8 maj 2026",
  },
  "projektor-eller-tv.html": {
    h1: "Projektor eller TV: vilket passar ditt hem bäst?",
    date: "12 maj 2026",
  },
  "minilux-test.html": {
    h1: "MiniLux Pro testad: kompakt projektor till 1 499 kr",
    date: "18 maj 2026",
  },
  "minilux-vs-pro.html": {
    h1: COMPARISON_TITLE,
    date: "22 maj 2026",
    skip2026: true,
  },
  "minilux-pro-test.html": {
    h1: "MiniLux Pro genomtestad: 200 ANSI Lumen och 130 tums bild",
    date: "24 maj 2026",
  },
  "minilux-pro-2-test.html": {
    h1: "MiniLux Pro 2 testad: uppgraderingen till 390 ANSI och native 1080P",
    date: "26 maj 2026",
  },
};

/** Older ProjektorTips projector pages - dates before april 2026 */
const LEGACY_PROJECTOR_UPDATES = {
  "keystone-guide.html": { date: "19 april 2026" },
  "projiceringsduk-guide.html": { date: "14 april 2026" },
  "4k-vs-1080p.html": { date: "24 april 2026" },
  "wifi-streaming.html": { date: "28 april 2026" },
  "optimera-rummet.html": { date: "8 april 2026" },
  "ljud-projektor.html": { date: "12 maj 2026" },
  "projektor-vs-tv.html": { date: "3 maj 2026" },
  "projektor-gaming.html": { date: "8 maj 2026" },
  "minilux-pro-2-vs-pro.html": { date: "18 maj 2026" },
};

const MONTHS_BEFORE_APRIL =
  /\b(?:jan|feb|mar|dec|nov|okt|sep|aug|jul|jun)\s+\d{4}\b|\b\d{1,2}\s+(?:jan|feb|mar|dec|nov|okt)\s+2026\b/i;

function displayTitle(file, data) {
  return data.skip2026 ? data.h1 : add2026(data.h1);
}

function cardTitle(file) {
  const data = TEKNIKPULS_ARTICLES[file];
  if (!data) return null;
  const t = displayTitle(file, data);
  if (file === "minilux-pro-test.html")
    return "MiniLux Pro genomtestad: 200 ANSI och 130 tums bild 2026";
  if (file === "minilux-pro-2-test.html")
    return "MiniLux Pro 2 testad: 390 ANSI och native 1080P (2026)";
  if (file === "minilux-test.html")
    return "MiniLux Pro testad: nätansluten kompakt projektor (2026)";
  if (file === "ansi-lumen.html")
    return "Vad betyder ANSI Lumen och hur många behöver du? (2026)";
  return t;
}

function getCardCatalog() {
  const cards = {
    "minilux-pro-test.html": {
      pill: "p-test",
      label: "Test",
      img: "ci-test",
      excerpt:
        "Vi testade MiniLux Pro i fyra veckor. 200 ANSI Lumen, XGA-upplösning och 180 graders roterbar lins. Är den värd 1 499 kr?",
      author: "PB",
      authorName: "Per Bergman",
    },
    "minilux-pro-2-test.html": {
      pill: "p-test",
      label: "Test",
      img: "ci-test",
      excerpt:
        "Tre veckors test. Native 1080P, WiFi 6 och 5W HiFi. Är uppgraderingen till 1 999 kr värd det?",
      author: "PB",
      authorName: "Per Bergman",
    },
    "minilux-test.html": {
      pill: "p-test",
      label: "Test",
      img: "ci-test",
      excerpt:
        "Kompakt modell till 1 499 kr. 200 ANSI Lumen, 130 tum och över 4 000 appar. Kräver nätström.",
      author: "PB",
      authorName: "Per Bergman",
    },
    "minilux-vs-pro.html": {
      pill: "p-jmf",
      label: "Jämförelse",
      img: "ci-jmf",
      excerpt:
        "200 ANSI mot 390 ANSI. XGA mot native 1080P. Vi jämför båda modellerna sida vid sida.",
      author: "AS",
      authorName: "Anna Svensson",
    },
    "projektor-eller-tv.html": {
      pill: "p-guide",
      label: "Guide",
      img: "ci-guide",
      excerpt:
        "En ärlig genomgång av båda alternativen. Storlek per krona, bildkvalitet och flexibilitet.",
      author: "AS",
      authorName: "Anna Svensson",
    },
    "ansi-lumen.html": {
      pill: "p-tek",
      label: "Teknik",
      img: "ci-tek",
      excerpt:
        "Siffrorna på förpackningen säger sällan hela sanningen. Vi reder ut vad du faktiskt behöver veta.",
      author: "AS",
      authorName: "Anna Svensson",
    },
    "forsta-projektor-tips.html": {
      pill: "p-tips",
      label: "Tips",
      img: "ci-tips",
      excerpt:
        "Det där som sällan står i produktbeskrivningarna. Våra experter delar med sig av vad de önskar att de visste från början.",
      author: "AS",
      authorName: "Anna Svensson",
    },
    "sovrum-projektor.html": {
      pill: "p-guide",
      label: "Guide",
      img: "ci-guide",
      excerpt:
        "180 graders roterbar lins, hörlurar och keystone. Allt du behöver för en perfekt sovrumsupplevelse.",
      author: "AS",
      authorName: "Anna Svensson",
    },
    "wifi-5-vs-6.html": {
      pill: "p-tek",
      label: "Teknik",
      img: "ci-tek",
      excerpt: "Marknadsföringsnummer eller verklig skillnad? Vi testar i verkliga hem.",
      author: "PB",
      authorName: "Per Bergman",
    },
    "utomhusbio.html": {
      pill: "p-tips",
      label: "Tips",
      img: "ci-tips",
      excerpt:
        "Film på 120 tum mot husväggen. Enklare än du tror och imponerar alltid på gäster.",
      author: "AS",
      authorName: "Anna Svensson",
    },
    "android-projektor.html": {
      pill: "p-tek",
      label: "Teknik",
      img: "ci-tek",
      excerpt:
        "Streaming, spegling och appar. Vi går igenom vad inbyggt Android innebar i praktiken.",
      author: "PB",
      authorName: "Per Bergman",
    },
    "kontrastratio.html": {
      pill: "p-tek",
      label: "Teknik",
      img: "ci-tek",
      excerpt:
        "En av de mest använda specifikationerna i marknadsföring och minst förstådda av köpare.",
      author: "PB",
      authorName: "Per Bergman",
    },
    "projiceringsduk.html": {
      pill: "p-guide",
      label: "Guide",
      img: "ci-guide",
      excerpt:
        "En vit vägg funkar. Men rätt duk gör det bättre. Vi går igenom vad som faktiskt spelar roll.",
      author: "AS",
      authorName: "Anna Svensson",
    },
  };

  const out = {};
  for (const [href, meta] of Object.entries(cards)) {
    const data = TEKNIKPULS_ARTICLES[href];
    const title = cardTitle(href);
    const rt = READ_TIMES[href] ? `<span class="sep"></span><span>${READ_TIMES[href]}</span>` : "";
    out[href] = `<a class="card" href="${href}">
      <div class="card-img ${meta.img}">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill ${meta.pill}">${meta.label}</span><span class="card-date">${data.date}</span></div><div class="card-title">${title}</div>
        <p class="card-excerpt">${meta.excerpt}</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs ${meta.author === "PB" ? "pb" : ""}">${meta.author}</div> ${meta.authorName}</div>${rt.replace('<span class="sep"></span>', "") ? "" : ""}</div>
      </div>
    </a>`;
    if (READ_TIMES[href]) {
      out[href] = out[href].replace(
        "</div>\n      </div>\n    </a>",
        `<span class="sep"></span><span>${READ_TIMES[href]}</span></div>\n      </div>\n    </a>`
      );
      out[href] = out[href].replace(
        `<div class="card-foot"><div class="card-auth"><div class="av-xs`,
        `<div class="card-foot"><div class="card-auth"><div class="av-xs`
      );
    }
    // fix card foot read time
    out[href] = `<a class="card" href="${href}">
      <div class="card-img ${meta.img}">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill ${meta.pill}">${meta.label}</span><span class="card-date">${data.date}</span></div><div class="card-title">${title}</div>
        <p class="card-excerpt">${meta.excerpt}</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs ${meta.author === "PB" ? "pb" : ""}">${meta.author}</div> ${meta.authorName}</div>${READ_TIMES[href] ? `<span class="sep"></span><span>${READ_TIMES[href]}</span>` : ""}</div>
      </div>
    </a>`;
  }
  return out;
}

function sidebarHome() {
  const items = [
    ["minilux-pro-2-test.html", "MiniLux Pro 2 test", "Test", "26 maj 2026"],
    ["minilux-pro-test.html", "MiniLux Pro test", "Test", "24 maj 2026"],
    ["minilux-vs-pro.html", "MiniLux Pro vs Pro 2", "Jämförelse", "22 maj 2026"],
    ["projektor-eller-tv.html", "Projektor eller TV", "Guide", "12 maj 2026"],
    ["ansi-lumen.html", "ANSI Lumen guide", "Teknik", "24 april 2026"],
  ];
  const list = items
    .map(
      ([href, title, cat, date], i) =>
        `<li><a class="sb-item" href="${href}"><span class="sb-num">${String(i + 1).padStart(2, "0")}</span><div><div class="sb-item-title">${href === "minilux-vs-pro.html" ? COMPARISON_TITLE : title}</div><div class="sb-item-meta">${cat} · ${date}</div></div></a></li>`
    )
    .join("\n");
  return `<aside class="home-sidebar">
<div class="sb-block"><div class="sb-title">Mest läst</div><ul class="sb-list">
${list}
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

function nav(active) {
  const links = [
    ["tester.html", "Tester"],
    ["guider.html", "Guider"],
    ["tips.html", "Tips"],
    ["jamforelser.html", "Jämförelser"],
    ["teknik.html", "Teknik"],
  ];
  const items = links
    .map(
      ([href, label]) =>
        `<li><a href="${href}"${href === active ? ' class="active"' : ""}>${label}</a></li>`
    )
    .join("");
  return `${MASTHEAD}
<nav class="site-nav"><div class="nav-inner">
<a class="nav-brand" href="index.html"><span class="logo-mark">TP</span><span class="logo-text">TeknikPulsen</span></a>
<ul class="nav-links">${items}</ul>
<button class="nav-toggle" type="button" aria-label="Meny"><span></span><span></span><span></span></button>
<a href="nyhetsbrev.html" class="nav-newsletter">Nyhetsbrev</a>
</div></nav>`;
}

function footer() {
  return `<footer class="site-footer"><div class="foot-inner"><div class="foot-top">
<div><a class="foot-brand" href="index.html"><span class="logo-mark">TP</span><span class="logo-text">TeknikPulsen</span></a>
<p class="foot-tagline">${FOOT_TAGLINE_NEW}</p></div>
<div class="foot-col"><h4>Populära artiklar</h4><ul>
<li><a href="minilux-pro-test.html">MiniLux Pro recension</a></li>
<li><a href="minilux-pro-2-test.html">MiniLux Pro 2 recension</a></li>
<li><a href="minilux-vs-pro.html">MiniLux Pro vs MiniLux Pro 2</a></li>
<li><a href="projektor-eller-tv.html">Projektor eller TV</a></li>
<li><a href="ansi-lumen.html">ANSI Lumen guide</a></li>
<li><a href="forsta-projektor-tips.html">6 saker innan köp</a></li></ul></div>
<div class="foot-col"><h4>Kategorier</h4><ul>
<li><a href="tester.html">Tester</a></li><li><a href="guider.html">Guider</a></li><li><a href="tips.html">Tips</a></li>
<li><a href="jamforelser.html">Jämförelser</a></li><li><a href="teknik.html">Teknik</a></li></ul></div></div>
<div class="foot-bottom">
<span>${COPYRIGHT_NEW}</span>
<div class="foot-bottom-links"><a href="om-oss.html">Om oss</a><span> · </span><a href="kontakt.html">Kontakt</a><span> · </span><a href="integritetspolicy.html">Integritetspolicy</a></div>
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

const CATEGORY_META = {
  "tester.html": {
    title: "Tester",
    subtitle:
      "Oberoende recensioner av miniprojektorer, testade i verkliga hem, utan betalda rekommendationer.",
  },
  "guider.html": {
    title: "Guider",
    subtitle:
      "Steg-för-steg-guider som hjälper dig välja, inställera och få ut det mesta av din projektor.",
  },
  "tips.html": {
    title: "Tips",
    subtitle:
      "Snabba och praktiska råd från våra experter, det som sällan står i produktbeskrivningarna.",
  },
  "jamforelser.html": {
    title: "Jämförelser",
    subtitle:
      "Modell mot modell. Vi hjälper dig avgöra om uppgraderingen är värd pengarna.",
  },
  "teknik.html": {
    title: "Teknik",
    subtitle:
      "Vi förklarar specifikationerna bakom marknadsföringen så du förstår vad som faktiskt spelar roll.",
  },
};

const CATEGORY_ARTICLES = {
  "tester.html": ["minilux-pro-test.html", "minilux-pro-2-test.html", "minilux-test.html"],
  "guider.html": ["projektor-eller-tv.html", "sovrum-projektor.html", "projiceringsduk.html"],
  "tips.html": ["forsta-projektor-tips.html", "utomhusbio.html"],
  "jamforelser.html": ["minilux-vs-pro.html"],
  "teknik.html": ["ansi-lumen.html", "wifi-5-vs-6.html", "android-projektor.html", "kontrastratio.html"],
};

function buildIndex() {
  const cardMap = getCardCatalog();
  const cardHtml = [
    "minilux-pro-test.html",
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
    .map((href) => cardMap[href])
    .join("\n");

  const feat = TEKNIKPULS_ARTICLES["minilux-pro-2-test.html"];
  const featTitle = "MiniLux Pro 2 testad: 390 ANSI och native 1080P (2026)";

  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>TeknikPulsen | Elektronik, projektorer och smarta hem</title>
<meta name="description" content="Vi granskar och testar konsumentelektronik utan reklamlöften. Guider, tester och tips om projektorer."/>
${FONT}
<link rel="stylesheet" href="site.css"/>
</head>
<body>
${nav(null)}
${filterBar("index.html")}
<div class="home-shell">
<div class="home-main">
<a class="featured-card" href="minilux-pro-2-test.html">
<div class="featured-text">
<div class="featured-top">
<div class="featured-author-row"><span class="av-sm">PB</span><span>Per Bergman</span><span class="sep"></span><span>${feat.date}</span><span class="sep"></span><span>14 min</span></div>
<span class="pill p-test">Test</span>
<h2 class="featured-title">${featTitle}</h2>
<p class="featured-excerpt">Vi testade MiniLux Pro 2 i tre veckor. Native 1080P, 390 ANSI Lumen, WiFi 6 och 5W HiFi. Är uppgraderingen värd 500 kr?</p>
</div>
<div class="featured-bottom">
<div class="featured-rating"><span class="stars">★★★★★</span><span class="score">4.6</span></div>
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

function buildCategoryPage(file) {
  const meta = CATEGORY_META[file];
  const cardMap = getCardCatalog();
  const cards = CATEGORY_ARTICLES[file].map((href) => cardMap[href]).filter(Boolean).join("\n");
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

function optimizeHtml(html) {
  html = html.replace(/[ \t]+$/gm, "");
  html = html.replace(/<!--(?!\[if)[\s\S]*?-->\s*/g, "");
  html = html.replace(/\n{3,}/g, "\n\n");
  return html;
}

function applyGlobal(html) {
  html = html.split(FOOT_TAGLINE_OLD).join(FOOT_TAGLINE_NEW);
  html = html.split(COPYRIGHT_OLD).join(COPYRIGHT_NEW);
  html = html.split("MiniLux vs MiniLux Pro").join(COMPARISON_TITLE);
  html = html.split(COMPARISON_OLD_FULL).join(COMPARISON_TITLE);
  return html;
}

function updateTeknikpulsArticle(file) {
  const data = TEKNIKPULS_ARTICLES[file];
  if (!data) return;
  let html = readFileSync(file, "utf8");
  const title = displayTitle(file, data);

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title} | TeknikPulsen</title>`);
  html = html.replace(/<h1>[^<]*<\/h1>/, `<h1>${title}</h1>`);

  if (file === "minilux-vs-pro.html") {
    html = html.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${COMPARISON_META}"`
    );
  }

  html = html.replace(
    /(<div class="meta-bar">[\s\S]*?<span class="sep"><\/span><span>)[^<]+(<\/span><span class="sep"><\/span><span>\d+ min)/,
    `$1${data.date}$2`
  );

  html = applyGlobal(html);
  html = optimizeHtml(html);
  writeFileSync(file, html, "utf8");
  console.log("Article", file);
}

function updateLegacyArticle(file, date) {
  let html = readFileSync(file, "utf8");
  if (!html.includes("art-meta")) return;

  html = html.replace(
    /(<div class="art-meta">[\s\S]*?<span class="dot"><\/span><span>)[^<]+(<\/span><span class="dot"><\/span>)/,
    `$1${date}$2`
  );

  const h1Match = html.match(/<h1>([^<]+)<\/h1>/);
  if (h1Match && !/\b2026\b/.test(h1Match[1])) {
    const newH1 = add2026(h1Match[1]);
    html = html.replace(/<h1>[^<]*<\/h1>/, `<h1>${newH1}</h1>`);
    html = html.replace(/<title>[^<]*<\/title>/, (m) => {
      const site = m.includes("ProjektorTips") ? "ProjektorTips.se" : "TeknikPulsen";
      return `<title>${newH1} | ${site}</title>`;
    });
  }

  html = applyGlobal(html);
  html = optimizeHtml(html);
  writeFileSync(file, html, "utf8");
  console.log("Legacy", file);
}

function replaceSidebarBlock(html) {
  const newSidebar = sidebarHome().replace(
    '<div class="sb-block newsletter-box">',
    "<!-- newsletter -->"
  );
  const articleSidebar = newSidebar
    .replace("home-sidebar", "article-sidebar")
    .replace(
      "<!-- newsletter -->",
      `<div class="sb-block newsletter-box"><h3>Nyhetsbrev</h3><p>Få nya tester och guider direkt i inkorgen. Ingen spam.</p>
<input type="email" placeholder="din@email.se"/><button type="button">Prenumerera</button></div>`
    );

  html = html.replace(/<aside class="(?:home|article)-sidebar">[\s\S]*?<\/aside>/, articleSidebar);
  return html;
}

// Regenerate TeknikPulsen index + category pages
writeFileSync("index.html", optimizeHtml(buildIndex()), "utf8");
console.log("Updated index.html (TeknikPulsen)");

for (const cat of Object.keys(CATEGORY_META)) {
  writeFileSync(cat, optimizeHtml(buildCategoryPage(cat)), "utf8");
  console.log("Updated", cat);
}

for (const file of Object.keys(TEKNIKPULS_ARTICLES)) {
  updateTeknikpulsArticle(file);
}

for (const [file, { date }] of Object.entries(LEGACY_PROJECTOR_UPDATES)) {
  try {
    updateLegacyArticle(file, date);
  } catch {
    /* skip missing */
  }
}

// All remaining HTML: global + optimize + sidebar on TeknikPulsen pages with old sidebar
const SKIP = new Set(["index.html", ...Object.keys(CATEGORY_META), ...Object.keys(TEKNIKPULS_ARTICLES)]);

for (const file of readdirSync(".").filter((f) => f.endsWith(".html"))) {
  if (SKIP.has(file)) continue;
  let html = readFileSync(file, "utf8");
  const before = html;
  html = applyGlobal(html);

  if (html.includes('class="site-nav"') && html.includes("sb-list")) {
    html = replaceSidebarBlock(html);
  }

  // Update card-date and sb-item-meta dates for TeknikPulsen article hrefs
  for (const [href, data] of Object.entries(TEKNIKPULS_ARTICLES)) {
    const title = cardTitle(href) || displayTitle(href, data);
    html = html.replace(
      new RegExp(
        `(href="${href.replace(".", "\\.")}"[\\s\\S]*?<span class="card-date">)[^<]+`,
        "g"
      ),
      `$1${data.date}`
    );
    html = html.replace(
      new RegExp(
        `(href="${href.replace(".", "\\.")}"[\\s\\S]*?<div class="card-title">)[^<]+`,
        "g"
      ),
      `$1${title}`
    );
    html = html.replace(
      new RegExp(
        `(href="${href.replace(".", "\\.")}"[\\s\\S]*?<div class="sb-item-meta">[^·]+· )[^<]+`,
        "g"
      ),
      `$1${data.date}`
    );
    html = html.replace(
      new RegExp(`(href="${href.replace(".", "\\.")}"[\\s\\S]*?<div class="rel-title">)[^<]+`, "g"),
      `$1${title}`
    );
  }

  html = optimizeHtml(html);
  if (html !== before) {
    writeFileSync(file, html, "utf8");
    console.log("Patched", file);
  }
}

console.log("Done.");
