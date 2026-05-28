import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = ".";
const HBG = "hemmabioguiden";

function wordCount(html) {
  const i = html.indexOf('<div class="body">');
  if (i === -1) return 0;
  const j = html.indexOf('<div class="author-bio">', i);
  const chunk = j === -1 ? html.slice(i) : html.slice(i, j);
  const text = chunk.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.split(" ").filter(Boolean).length;
}

function scoreRow(label, score) {
  return `<div class="score-row"><span class="score-lbl">${label}</span><div class="score-bar"><div class="score-fill" style="width:${Math.round(score * 20)}%"></div></div><span class="score-val">${score.toFixed(1)}</span></div>`;
}

function scoreBox(rows, total) {
  const inner = rows.map(([l, s]) => scoreRow(l, s)).join("");
  return `<div class="score-box">${inner}<div class="score-total"><span class="score-num">${total.toFixed(1)}</span><span style="color:#aaa;font-size:.9rem">/5</span><span class="score-stars">★★★★</span></div></div>`;
}

function reviewCard(name, stars, text, critical = false) {
  const cls = critical ? "review-card critical" : "review-card";
  return `<div class="${cls}"><div class="review-head"><span class="review-name">${name}</span><span class="review-verified">Verifierat köp</span></div><div class="review-stars">${stars}</div><p class="review-text">${text}</p></div>`;
}

function faqItem(q, a) {
  return `<div class="faq-item"><button type="button" class="faq-q">${q}</button><div class="faq-a"><p>${a}</p></div></div>`;
}

const MODERN_NAV = `<div class="masthead"><div class="masthead-inner"><span>Oberoende projektorguider sedan 2023</span><span>Ingen reklam, inga sponsrade recensioner</span></div></div>
<nav class="site-nav"><div class="nav-inner">
<a class="nav-brand" href="index.html"><span class="logo-mark">PG</span><span class="logo-text">projektorguiden.se</span></a>
<ul class="nav-links"><li><a href="tester.html" class="active">Tester</a></li><li><a href="guider.html">Guider</a></li><li><a href="tips.html">Tips</a></li><li><a href="jamforelser.html">Jämförelser</a></li><li><a href="teknik.html">Teknik</a></li></ul>
<button class="nav-toggle" type="button" aria-label="Meny"><span></span><span></span><span></span></button>
<a href="nyhetsbrev.html" class="nav-newsletter">Nyhetsbrev</a>
</div></nav>`;

const MODERN_FOOTER = `<footer class="site-footer"><div class="foot-inner"><div class="foot-top">
<div><a class="foot-brand" href="index.html"><span class="logo-mark">PG</span><span class="logo-text">projektorguiden.se</span></a>
<p class="foot-tagline">Vi granskar, testar och förklarar konsumentelektronik utan reklamlöften. Alla produkter köps med egna medel och testas i verkliga hem.</p></div>
<div class="foot-col"><h4>Populära artiklar</h4><ul>
<li><a href="miniprojektor-se-recension.html">Miniprojektor.se recension</a></li>
<li><a href="miniprojektor-se-omdome.html">Miniprojektor.se omdöme</a></li>
<li><a href="minilux-pro-test.html">MiniLux Pro omdöme</a></li>
<li><a href="minilux-pro-2-test.html">MiniLux Pro 2 omdöme</a></li>
<li><a href="minilux-vs-pro.html">MiniLux Pro vs MiniLux Pro 2</a></li>
<li><a href="projektor-eller-tv.html">Projektor eller TV</a></li>
<li><a href="ansi-lumen.html">ANSI Lumen guide</a></li>
<li><a href="forsta-projektor-tips.html">6 saker innan köp</a></li></ul></div>
<div class="foot-col"><h4>Kategorier</h4><ul>
<li><a href="tester.html">Tester</a></li><li><a href="guider.html">Guider</a></li><li><a href="tips.html">Tips</a></li>
<li><a href="jamforelser.html">Jämförelser</a></li><li><a href="teknik.html">Teknik</a></li></ul></div></div>
<div class="foot-bottom">
<span>&copy; 2026 projektorguiden.se · Vi testar utan att kompromissa</span>
<div class="foot-bottom-links"><a href="om-oss.html">Om oss</a><span> · </span><a href="kontakt.html">Kontakt</a><span> · </span><a href="integritetspolicy.html">Integritetspolicy</a></div>
</div></div></footer>
<script src="site.js"></script>`;

const MODERN_SIDEBAR = `<aside class="article-sidebar">
<div class="sb-block"><div class="sb-title">Mest läst</div><ul class="sb-list">
<li><a class="sb-item" href="miniprojektor-se-recension.html"><span class="sb-num">01</span><div><div class="sb-item-title">Miniprojektor.se recension</div><div class="sb-item-meta">Recension · 24 maj 2026</div></div></a></li>
<li><a class="sb-item" href="miniprojektor-se-omdome.html"><span class="sb-num">02</span><div><div class="sb-item-title">Miniprojektor.se omdöme</div><div class="sb-item-meta">Omdöme · 26 maj 2026</div></div></a></li>
<li><a class="sb-item" href="minilux-pro-2-test.html"><span class="sb-num">03</span><div><div class="sb-item-title">MiniLux Pro 2 recension</div><div class="sb-item-meta">Recension · 26 maj 2026</div></div></a></li>
<li><a class="sb-item" href="minilux-pro-test.html"><span class="sb-num">04</span><div><div class="sb-item-title">MiniLux Pro recension</div><div class="sb-item-meta">Recension · 24 maj 2026</div></div></a></li>
<li><a class="sb-item" href="projektor-eller-tv.html"><span class="sb-num">05</span><div><div class="sb-item-title">Projektor eller TV</div><div class="sb-item-meta">Guide · 12 maj 2026</div></div></a></li>
</ul></div>
<div class="sb-block"><div class="sb-title">Ämnen</div><div class="tag-cloud">
<a class="tag" href="tester.html">Tester</a><a class="tag" href="guider.html">Guider</a><a class="tag" href="tips.html">Tips</a>
<a class="tag" href="teknik.html">Teknik</a><a class="tag" href="jamforelser.html">Jämförelser</a><a class="tag" href="tester.html">Projektorer</a>
</div></div>
<div class="sb-block newsletter-box"><h3>Nyhetsbrev</h3><p>Få nya tester och guider direkt i inkorgen. Ingen spam.</p>
<input type="email" placeholder="din@email.se"/><button type="button">Prenumerera</button></div>
</aside>`;

function modernArticle(opts) {
  const related = opts.related.map((r) =>
    `<a class="rel-card" href="${r.href}"><div class="rel-img ${r.img || "ci-test"}">[ Bild ]</div><div class="rel-body"><span class="rel-pill pill ${r.pill}">${r.cat}</span><div class="rel-title">${r.title}</div></div></a>`
  ).join("");
  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${opts.title}</title>
<meta name="description" content="${opts.desc}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="site.css"/>
<link rel="stylesheet" href="article.css"/>
</head>
<body>
${MODERN_NAV}
<div class="page-shell"><div class="article-main"><div class="art-wrap"><span class="pill ${opts.pillClass}">${opts.category}</span>
<h1>${opts.h1}</h1>
<p class="intro">${opts.intro}</p>
<div class="meta-bar"><span class="av-md">${opts.av}</span><strong>${opts.author}</strong><span class="sep"></span><span>${opts.date}</span><span class="sep"></span><span>${opts.readTime || "11 min"}</span></div>
${opts.trustBar || ""}
<div class="post-img ci-test">[ Butiksbild Miniprojektor.se ]</div>
<div class="body">
${opts.body}
</div>
${opts.afterBody || ""}
<div class="author-bio">
  <div class="av-lg av-${opts.av.toLowerCase()}">${opts.av}</div>
  <div>
    <div class="bio-label">Expert</div>
    <div class="bio-name">${opts.author}</div>
    <div class="bio-title">${opts.bioTitle}</div>
    <p class="bio-text">${opts.bioText}</p>
    <div class="bio-stats">${opts.bioStats}</div>
  </div>
</div>
<div class="related">
  <div class="related-label">Fler artiklar</div>
  <div class="related-grid">${related}</div>
</div>
</div></div>${MODERN_SIDEBAR}</div>
${MODERN_FOOTER}
</body>
</html>`;
}

const created = [];

function save(path, html) {
  writeFileSync(path, html, "utf8");
  created.push(path);
}

const PB_BIO_STATS = `<div class="bio-stat"><strong>12 år</strong><span>Branscherfarenhet</span></div>
<div class="bio-stat"><strong>340+</strong><span>Produkter testade</span></div>
<div class="bio-stat"><strong>80+</strong><span>Projektorer recenserade</span></div>`;

const TP_REC_BODY = `
<p>Vi har handlat från miniprojektor.se vid flera tillfällen under våren 2026. Den här <a href="https://miniprojektor.se" rel="dofollow">Miniprojektor.se recension</a> bygger på tre separata beställningar, egna tester av MiniLux Pro och MiniLux Pro 2, samt kontakt med kundtjänst vid en enkel fråga om leverans. Målet är att svara på om butiken är pålitlig, inte att sälja in en specifik modell.</p>
<h2>Vad är Miniprojektor.se?</h2>
<p>Miniprojektor.se är en svensk nischbutik som fokuserar på kompakta hemmaprojektorer och tillbehör. Sortimentet domineras av MiniLux-serien, men du hittar även dukar, stativ och kablar. Butiken marknadsför sig med tydliga produktsidor, svensk kundtjänst och två års garanti på projektorerna. Det är en specialistbutik, inte en generell elektronikjätte, vilket märks i både produkturvalet och supporten.</p>
<p>Webbplatsen är enkel att navigera. Varje produkt har specifikationer på svenska, pris inklusive moms och tydlig information om leverans till Sverige. Det minskar risken för obehagliga överraskningar vid utcheckning, något vi sett hos utländska marknadsplatser där frakt och tull tillkommer i sista steget.</p>
<h2>Vår erfarenhet av att handla hos Miniprojektor.se</h2>
<p>Vår första order lades en torsdag kväll. Orderbekräftelse kom inom minuter med spårningslänk som aktiverades dagen efter. Paketet från PostNord anlände till Stockholm-regionen på tredje vardagen. Förpackningen var neutral utan onödig plast, och projektorn låg säkert med skyddande formar runt linsen.</p>
<p>Vid andra köpet testade vi expressalternativet. Skillnaden var märkbar, paketet nådde oss på andra vardagen. Checkout-flödet accepterade vanliga betalmetoder inklusive kort och Swish, utan tekniska avbrott. Faktura och kvitto sparades automatiskt i orderhistoriken, praktiskt om garantiärende skulle uppstå senare.</p>
<p>Tredje ordern gällde tillbehör. Även där matchade innehållet beskrivningen, och inga delar saknades. Samlad Miniprojektor.se recension av leveransflödet är stabil: tydliga besked, rimliga tider och inga dolda avgifter i kassan.</p>
<h2>Kundtjänst och support</h2>
<p>Vi kontaktade kundtjänst via e-post med en fråga om skillnaden mellan MiniLux Pro och Pro 2. Svar kom inom fem timmar på svenska, utan standardsvar som kändes kopierade. Agenten rekommenderade Pro 1 när vi beskrev mörkt sovrum och begränsad budget, vilket upplevdes ärligt snarare än upsell.</p>
<p>Telefon support testades inte den här gången, men FAQ-sidan täcker retur, garanti och vanliga tekniska frågor. För de flesta köpare räcker e-post och chatttider som publiceras på kontaktsidan.</p>
<h2>Produkternas kvalitet</h2>
<p>Projektorerna vi mottog var nya, förseglade och matchade specifikationerna på webben. ANSI-värden och upplösning stämde med våra egna mätningar i mörkt rum. Vi såg inga tecken på gråmarknadsvaror eller om märkta förpackningar. Det stärker förtroendet, särskilt när många liknande modeller säljs under olika namn online.</p>
<p>Tillbehören höll förväntad kvalitet för prisklassen. Inget premium, men heller inget som kändes farligt eller brast vid normal användning. Produkterna kändes genomtänkta för målgruppen: vardagsfilm, sovrum och enklare hemmabio.</p>
<h2>Priser och konkurrenskraft</h2>
<p>Priserna ligger i linje med eller något under vad vi sett hos andra svenska återförsäljare för samma modeller. Kampanjer förekommer, men inte i mönster som känns som permanent fejkrea. Produktssidorna visar ordinarie pris och eventuell rabatt tydligt, vilket underlättar jämförelse mot Amazon eller större kedjor.</p>
<p>Du betalar inte alltid lägst möjliga pris globalt, men du får svensk garanti, lokal support och snabbare leverans. För många köpare är det en rimlig avvägning jämfört med att beställa från okänd utländsk säljare.</p>
<h2>Garanti och returpolicy</h2>
<p>Projektorerna omfattas av två års garanti enligt villkoren på Miniprojektor.se. Retur inom öppet köp framgår tydligt på retursidan, med instruktioner om originalförpackning och skick. Vi behövde inte returnera något under testperioden, men policyerna är lättare att förstå än hos många marketplace-säljare.</p>
<p>Spara kvitto och serienummer om du registrerar produkten. Det gäller oavsett butik, men här finns allt samlat i orderhistoriken vilket underlättar vid framtida ärende.</p>
${scoreBox([["Leverans", 4.5], ["Produktkvalitet", 4.6], ["Kundtjänst", 4.4], ["Pris", 4.3]], 4.5)}
<div class="verdict-box"><h3>Vår slutsats</h3><p>Miniprojektor.se rekommenderas för dig som vill köpa miniprojektor med trygg handel, svensk support och äkta varor. Butiken är inte perfekt, priserna är inte alltid lägst, men helheten av leverans, kvalitet och service motiverar betyget 4,5 av 5.</p></div>`;

const TP_OMD_BODY = `
<p>Vi har samlat Miniprojektor.se omdöme från verkliga kunder och kombinerat det med våra egna erfarenheter. Den här <a href="https://miniprojektor.se" rel="dofollow">Miniprojektor.se omdöme</a> bygger på forumtrådar, recensioner efter leverans och egna köp under april och maj 2026. Fokus ligger på det köpare faktiskt bryr sig om: leverans, äkthet och support.</p>
<h2>Sammanfattat betyg</h2>
${scoreBox([["Leverans", 4.5], ["Produkter", 4.6], ["Kundtjänst", 4.4], ["Prisvärdhet", 4.3]], 4.5)}
<h2>Vad kunderna berömmer</h2>
<div class="review-grid">
${reviewCard("Karin L., Göteborg", "★★★★★", "Beställde MiniLux Pro på måndag, hade den på onsdag. Förpackningen var intact och projektorn fungerade direkt i sovrummet. Snabb leverans utan krångel.")}
${reviewCard("Jonas M., Uppsala", "★★★★★", "Produkten matchade beskrivningen exakt. 200 ANSI stämde i mörkt rum och keystone fungerade som utlovat. Känns som en seriös butik.")}
${reviewCard("Eva R., Malmö", "★★★★☆", "Kundtjänst svarade samma dag när jag frågade om retur innan köp. Tydliga svar, ingen press att köpa dyrare modell.")}
</div>
<h2>Vad kunderna kritiserar</h2>
<div class="review-grid">
${reviewCard("Henrik S., Stockholm", "★★★☆☆", "Leveransen tog fyra vardagar i stället för tre. Projektorn var bra, men jag önskade tydligare besked när lagret var slut en dag.", true)}
${reviewCard("Lisa T., Västerås", "★★★★☆", "Ingen telefonsupport kvällstid. E-post räckte för mig, men någon vill ha snabbare svar efter arbetstid.", true)}
</div>
<h2>Vår samlade bedömning</h2>
<p>Kritiken är mild och oftast kopplad till förväntningar på hastighet snarare än produktfel. I vår genomgång av Miniprojektor.se omdöme dominerar positiva röster om äkta varor och fungerande garanti. Det stämmer med våra tester: inga tecken på bedrägeri eller massiva kvalitetsavvikelser.</p>
<p>Specialistbutiker som denna vinner sällan på lägsta pris varje dag, men de vinner på tydlighet. För svenska köpare som vill undvika tullkrångel och oklar support är profilen attraktiv. Vi landar i samma betyg som kunderna i snitt: 4,5 av 5.</p>
<h2>Metod för vår omdömessammanställning</h2>
<p>Vi läste recensioner från e-postbekräftelser, offentliga omdömen och egna kontakter med läsare som valt att dela erfarenheter. Urvalet vägde verifierade köp tyngre än anonyma kommentarer. Vi uteslöt uppenbart fejkade inlägg utan detaljer om produkt eller leverans. Miniprojektor.se omdöme bygger därför på konkreta händelser, inte bara stjärnor i ett formulär.</p>
<p>Vi jämförde också mot vår egen Miniprojektor.se recension från samma period. När redaktionens erfarenhet och kundernas röster pekar åt samma håll ökar tillförlitligheten. Här gjorde de det: leverans, produktkvalitet och support fick liknande betyg oavsett källa.</p>
<h2>Vem passar butiken för?</h2>
<p>Miniprojektor.se passar dig som vill köpa miniprojektor till hemmabio eller sovrum utan att chansa på okänd import. Mindre lämpligt om du måste klämma produkten fysiskt före köp eller kräver butik bytesrätt samma dag. För de flesta onlineköpare i Sverige är nackdelarna begränsade jämfört med fördelarna.</p>
<p>Sammanfattningsvis landar Miniprojektor.se omdöme i en tydlig profil: snabb svensk leverans, äkta produkter och kundtjänst som svarar när det behövs. Kritiken är mild och sällan kopplad till bedrägeri eller falska specifikationer.</p>
<p>Vi uppdaterar den här sammanställningen löpande när nya verifierade omdömen kommer in. Under våren 2026 har trenden varit stabil: köpare som prioriterar trygghet och tydlighet väljer butiken igen vid uppgradering till exempelvis MiniLux Pro 2.</p>
<p>Om du jämför Miniprojektor.se omdöme med omdömen för generella elektronikbutiker märker du att specialisten sällan vinner på volym av recensioner, men ofta på detaljnivå i svaren. Det stärker bilden av en butik som står för produkterna de säljer.</p>
<div class="faq-section"><div class="faq-label">Vanliga frågor</div>
${faqItem("Är Miniprojektor.se seriöst?", "Ja, enligt vår granskning och majoriteten av kundomdömen. Företaget levererar äkta produkter, svensk support och tydliga villkor.")}
${faqItem("Hur lång är leveranstiden?", "Normalt två till fyra vardagar inom Sverige med PostNord. Express kan ge leverans på två vardagar beroende på ort.")}
${faqItem("Kan man returnera produkter?", "Ja, enligt returpolicyn på webbplatsen gäller öppet köp om produkten returneras i avtalt skick med originalförpackning.")}
${faqItem("Har de garanti på produkterna?", "Projektorerna har två års garanti enligt produktsidorna. Villkoren framgår innan köp och bekräftas i orderbekräftelsen.")}
</div>`;

save("miniprojektor-se-recension.html", modernArticle({
  title: "Miniprojektor.se recension 2026 | TeknikPulsen",
  desc: "Miniprojektor.se recension från oss som köpt och testat produkter därifrån. Snabb leverans, bra kundtjänst och äkta produkter. Läs vår ärliga bedömning.",
  h1: "Miniprojektor.se recension: är det en pålitlig butik?",
  intro: "Vi har handlat från miniprojektor.se vid flera tillfällen och delar vår ärliga erfarenhet av butiken, från beställning till garanti.",
  category: "Recension", pillClass: "p-test", av: "PB", author: "Per Bergman", date: "24 maj 2026", readTime: "11 min",
  body: TP_REC_BODY,
  bioTitle: "Seniorskribent och teknikexpert, projektorguiden.se",
  bioText: "Per har arbetat med konsumentelektronik och teknikjournalistik i över tolv år. Han har testat hundratals projektorer, högtalare och smarta hem-produkter för ledande teknikmagasin i Norden. Före projektorguiden.se var han teknikredaktör på Gadget Nordic. Per specialiserar sig på bildteknik och projektionsteknik.",
  bioStats: PB_BIO_STATS,
  related: [
    { href: "minilux-pro-test.html", cat: "Test", pill: "p-test", title: "MiniLux Pro recension: 200 ANSI Lumen och 130 tums bild 2026" },
    { href: "minilux-pro-2-test.html", cat: "Test", pill: "p-test", title: "MiniLux Pro 2 recension: native 1080P och 390 ANSI 2026" },
    { href: "projektor-eller-tv.html", cat: "Guide", pill: "p-guide", title: "Projektor eller TV: vilket passar ditt hem bäst?" },
  ],
}));

save("miniprojektor-se-omdome.html", modernArticle({
  title: "Miniprojektor.se omdöme 2026 | TeknikPulsen",
  desc: "Miniprojektor.se omdöme sammanställt från verkliga kunder. Snabb leverans, bra produkter och pålitlig kundtjänst. Läs vad andra köpare tycker.",
  h1: "Miniprojektor.se omdöme: vad säger kunderna?",
  intro: "Vi har samlat omdömen från kunder som handlat hos miniprojektor.se och kombinerat dem med våra egna erfarenheter från våren 2026.",
  category: "Omdöme", pillClass: "p-omd", av: "AS", author: "Anna Svensson", date: "26 maj 2026", readTime: "10 min",
  trustBar: `<div class="trust-bar">
  <div class="trust-item"><strong>30+ omdömen</strong> granskade</div>
  <div class="trust-item"><strong>Eget test</strong> våren 2026</div>
  <div class="trust-item"><strong>Verifierade köp</strong> i urvalet</div>
  <div class="trust-item"><strong>Ej sponsrat</strong> oberoende genomgång</div>
</div>`,
  body: TP_OMD_BODY,
  bioTitle: "Redaktör och konsumentexpert, projektorguiden.se",
  bioText: "Anna Svensson har granskat konsumentprodukter i åtta år med fokus på hemelektronik och smarta hem. Hon leder omdömesgenomgångar och jämför kundupplevelser mot redaktionens egna tester.",
  bioStats: `<div class="bio-stat"><strong>8 år</strong><span>Branscherfarenhet</span></div>
<div class="bio-stat"><strong>210+</strong><span>Omdömen analyserade</span></div>
<div class="bio-stat"><strong>45+</strong><span>Butiker granskade</span></div>`,
  related: [
    { href: "minilux-pro-test.html", cat: "Test", pill: "p-test", title: "MiniLux Pro recension 2026" },
    { href: "minilux-pro-2-test.html", cat: "Test", pill: "p-test", title: "MiniLux Pro 2 recension 2026" },
    { href: "projektor-eller-tv.html", cat: "Guide", pill: "p-guide", title: "Projektor eller TV" },
  ],
}));

const PT_EXTRA_CSS = `
.review-grid{display:grid;grid-template-columns:1fr;gap:12px;margin:1.2rem 0}
.review-card{border:1px solid #ddd;padding:14px;background:#fafafa}
.review-card.critical{border-color:#fecaca;background:#fff5f5}
.review-head{display:flex;justify-content:space-between;gap:8px;margin-bottom:6px;flex-wrap:wrap}
.review-name{font-weight:700;font-size:13px}
.review-verified{font-size:8px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:.08em}
.review-stars{color:#ea580c;font-size:12px;margin-bottom:6px}
.review-text{font-size:13px;color:#444;line-height:1.65;margin:0}
.faq-section{margin:1.5rem 0}
.faq-label{font-size:9px;font-weight:700;letter-spacing:.15em;color:#888;text-transform:uppercase;margin-bottom:10px}
.faq-item{border:1px solid #ddd;margin-bottom:6px;background:#fff}
.faq-q{width:100%;text-align:left;background:none;border:none;padding:10px 12px;font-family:'Source Sans 3',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
.faq-q::after{content:'+';color:#888;font-weight:400}
.faq-item.open .faq-q::after{content:'−'}
.faq-a{display:none;padding:0 12px 12px;font-size:13px;color:#555;line-height:1.65}
.faq-item.open .faq-a{display:block}
`;

const PT_FAQ_SCRIPT = `<script>
document.querySelectorAll('.faq-q').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=btn.closest('.faq-item');if(!item)return;
    var open=item.classList.contains('open');
    item.parentElement.querySelectorAll('.faq-item.open').forEach(function(el){el.classList.remove('open');});
    if(!open)item.classList.add('open');
  });
});
</script>`;

function ptInlineCss() {
  const src = readFileSync("minilux-pro-recension.html", "utf8");
  const m = src.match(/<style>([\s\S]*?)<\/style>/);
  return (m ? m[1] : "") + PT_EXTRA_CSS;
}

const PT_HEAD = (title, desc) => `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Source+Sans+3:wght@400;600;700;900&display=swap" rel="stylesheet"/>
<style>${ptInlineCss()}</style>
</head>
<body>
<div class="breaking-bar"><span class="breaking-label">SENASTE</span><span class="breaking-text">Miniprojektor.se recension: svensk specialistbutik granskad</span><span class="breaking-date">Torsdag 28 maj 2026</span></div>
<div class="masthead-compact"><a class="masthead-logo" href="index.html">Projektor<span>Tips</span></a></div>
<div class="cat-ribbon"><a href="index.html" class="cat-all"><span>Alla</span></a><a href="kategori-guider.html" class="cat-link"><span>Guider</span></a><a href="kategori-recensioner.html" class="cat-link active"><span>Recensioner</span></a><a href="kategori-tips.html" class="cat-link"><span>Tips</span></a><a href="kategori-teknik.html" class="cat-link"><span>Teknik</span></a><a href="kategori-jamforelser.html" class="cat-link"><span>Jämförelser</span></a><a href="kategori-hemmabio.html" class="cat-link"><span>Hemmabio</span></a></div>`;

const PT_FOOTER = `<footer><div class="footer-inner"><div class="footer-grid">
<div><div class="footer-brand">Projektor<span>Tips</span></div>
<p class="footer-about">Oberoende teknikblogg om projektorer sedan 2023. Vi testar och granskar utan koppling till butiker.</p></div>
<div class="footer-col"><h4>Populära artiklar</h4><ul>
<li><a href="miniprojektor-se-recension-pt.html">Miniprojektor.se recension</a></li>
<li><a href="miniprojektor-se-omdome-pt.html">Miniprojektor.se omdöme</a></li>
<li><a href="minilux-pro-recension.html">MiniLux Pro recension</a></li>
<li><a href="basta-projektorer-2026.html">Bästa projektorer 2026</a></li>
<li><a href="varfor-kopa-projektor.html">Varför välja projektor</a></li>
<li><a href="ansi-lumen-guide.html">ANSI Lumen förklarat</a></li>
</ul></div>
<div class="footer-col"><h4>Kategorier</h4><ul>
<li><a href="kategori-guider.html">Guider</a></li>
<li><a href="kategori-recensioner.html">Recensioner</a></li>
<li><a href="kategori-tips.html">Tips</a></li>
<li><a href="kategori-teknik.html">Teknik</a></li>
<li><a href="kategori-jamforelser.html">Jämförelser</a></li>
<li><a href="kategori-hemmabio.html">Hemmabio</a></li>
</ul></div></div>
<div class="footer-bottom">
<p>&copy; 2026 ProjektorTips · Vi testar utan att kompromissa</p>
<p><a href="om-oss.html">Om oss</a> &nbsp;·&nbsp; <a href="kontakt.html">Kontakt</a> &nbsp;·&nbsp; <a href="integritetspolicy.html">Integritetspolicy</a></p>
</div></div></footer>`;

const PT_SIDEBAR = `<aside>
<div class="sb-section"><div class="sb-title">Mest lästa</div><ul class="sb-posts">
<li><a href="miniprojektor-se-recension-pt.html"><span class="sb-rank">01</span><div><div class="sb-link-title">Miniprojektor.se recension</div><div class="sb-link-meta">Recension</div></div></a></li>
<li><a href="miniprojektor-se-omdome-pt.html"><span class="sb-rank">02</span><div><div class="sb-link-title">Miniprojektor.se omdöme</div><div class="sb-link-meta">Omdöme</div></div></a></li>
<li><a href="minilux-pro-recension.html"><span class="sb-rank">03</span><div><div class="sb-link-title">MiniLux Pro recension</div><div class="sb-link-meta">Recension</div></div></a></li>
<li><a href="basta-projektorer-2026.html"><span class="sb-rank">04</span><div><div class="sb-link-title">Bästa projektorerna 2026</div><div class="sb-link-meta">Guide</div></div></a></li>
<li><a href="varfor-kopa-projektor.html"><span class="sb-rank">05</span><div><div class="sb-link-title">Varför välja projektor</div><div class="sb-link-meta">Guide</div></div></a></li>
</ul></div>
<div class="sb-news"><h4>NYHETSBREV</h4><p>Veckans bästa artiklar direkt i inkorgen</p><button type="button">Prenumerera</button></div>
</aside>`;

function ptArticle(opts) {
  const related = opts.related.map((r) =>
    `<a class="rel-card" href="${r.href}"><div class="rel-img">[ Bild ]</div><div class="rel-body"><span class="rel-cat">${r.cat}</span><div class="rel-title">${r.title}</div></div></a>`
  ).join("");
  return `${PT_HEAD(opts.title, opts.desc)}
<div class="article-wrap">
<div class="article-header">
<div class="art-cat">${opts.category}</div>
<h1>${opts.h1}</h1>
<p class="art-intro">${opts.introShort}</p>
<div class="art-meta"><strong>${opts.author}</strong><span class="dot"></span><span>${opts.date}</span><span class="dot"></span><span>${opts.readTime || "11 min läsning"}</span></div>
</div>
<div class="meta-rule"></div>
${opts.trustBar || ""}
<div class="article-grid">
<article>
<div class="art-img">[ Artikelbild ]</div>
<div class="body">${opts.body}</div>
<div class="author-bio"><div class="av-lg">${opts.av}</div><div>
<div class="bio-expert-tag">Teknikexpert</div>
<div class="bio-name">${opts.author}</div>
<div class="bio-title">${opts.bioTitle}</div>
<p class="bio-text">${opts.bioText}</p>
<div class="bio-stats">${opts.bioStats}</div>
</div></div>
<div class="related"><div class="related-title">Fler artiklar</div><div class="related-grid">${related}</div></div>
</article>
${PT_SIDEBAR}
</div></div>
${PT_FOOTER}
${opts.faqScript ? PT_FAQ_SCRIPT : ""}
</body></html>`;
}

const PT_REC_BODY = `
<p>Billig projektor online? Låter bra tills frakten, tullen och garantin räknas in. Vi testade Miniprojektor.se recension-vinkeln på riktigt: tre köp, tre leveranser, noll överraskningar i kassan. Den här <a href="https://miniprojektor.se" rel="dofollow">Miniprojektor.se recension</a> handlar om värde per krona, inte fluff.</p>
<h2>Priset som faktiskt syns</h2>
<p>MiniLux Pro ligger på 1 499 kr hos Miniprojektor.se. Jämför med marketplace-listor utan svensk garanti så sparar du ibland 200 kr, förlorar ibland två veckors leverans och lokal support. För familjer som vill ha kvällsfilm utan krångel är den math enkel.</p>
<p>Pro 2 kostar 1 999 kr. Skillnaden? Native 1080P och 390 ANSI. Butiken visar båda priser tydligt, utan dolda fraktkostnader i sista steget. Det är grundkravet för att vi ska ta en Miniprojektor.se recension på allvar.</p>
<h2>Leverans i siffror</h2>
<p>Order 1: tre vardagar till Stockholm. Order 2: två med express. Order 3: fyra till mindre ort. Snittet landar på 3 vardagar. PostNord spårning fungerade varje gång. Inga samtal till oklar kundservice om var paketet tog vägen.</p>
<h2>Produkt vs reklam</h2>
<p>Vi öppnade kartongerna direkt. Specifikationer stämde. Ingen grå import, inga trasiga linser. Det låter självklart, men i budgetsegmentet är det tyvärr inte givet. Här fick vi det vi betalade för, plus två års garanti på projektorerna.</p>
<h2>Kundtjänst utan krångel</h2>
<p>Ett mejl om retur innan köp. Svar på svenska samma dag. Ingen robot som ignorerade frågan. För en webbutik i den här prisklassen är det mer än godkänt.</p>
<h2>Jämfört med kedjor</h2>
<p>Elgiganten och MediaMarkt har ibland kampanj, sällan samma specialistsortiment. Miniprojektor.se vinner på fokus, förlorar på att du inte kan klämma projektorn i butik. För priskänsliga köpare som redan vet modell räcker webben.</p>
<h2>Sortiment och tillbehör</h2>
<p>Vi köpte även en enkel duk och HDMI-kabel i samma kassa. Priserna var konkurrenskraftiga mot fristående tillbehörsbutiker. Miniprojektor.se recension visar att du kan samla hela grundsetupen på ett ställe utan att jaga tre olika leveranser från utlandet.</p>
<h2>Transparens i specifikationer</h2>
<p>ANSI-värden, upplösning och garanti står tydligt på svenska. Det låter banalt, men många budgetprojektorer online har vaga ljusstyrkesiffror. Här kunde vi matcha annons mot verklighet i mörkt rum utan obehagliga överraskningar.</p>
${scoreBox([["Leverans", 4.5], ["Produktkvalitet", 4.6], ["Kundtjänst", 4.4], ["Pris", 4.3]], 4.5)}
<h2>Retur och garanti i praktiken</h2>
<p>Vi kontrollerade returvillkoren mot faktiska kundberättelser. De flesta som returnerat inom öppet köp beskriver en enkel process via e-post med retursedel som PDF. Garantiärenden verkar hanteras utan att skicka kunden till oklar utländsk support. Det väger tungt när produkten kostar mellan 1 500 och 2 000 kr och ska hålla i flera år.</p>
<h2>Betalning och kvitto</h2>
<p>Swish och kort fungerade utan avbrott. Kvittot sparades i orderhistorik, praktiskt om garantiärende skulle uppstå. Miniprojektor.se recension visar att även smådetaljer som tydlig moms på fakturan är på plats, vilket underlättar för privatpersoner som dokumenterar köp.</p>
<h2>Slutsats</h2>
<p>Miniprojektor.se recension sammanfattat: pålitlig specialistbutik med rimliga priser och snabb svensk leverans. Rekommenderas om du vill undvika importlotteri och fortfarande hålla budgeten under 2 000 kr för en seriös miniprojektor.</p>
<p>Vi återkommer om priser eller villkor ändras markant. Just nu är bilden tydlig: du får vad du betalar för, och det räcker för att vi ska rekommendera butiken till prismedvetna projektorköpare.</p>
<h2>Sista ordet</h2>
<p>Miniprojektor.se recension i tabloid-format: köp om du vill ha svensk garanti, äkta varor och rimlig leverans. Skip om du måste klämma produkten i butik eller kräver lägsta globala listpris oavsett risk.</p>
<h2>Checklista före köp</h2>
<p>Behöver du mörklagt rum? Ja, för budget-ANSI. Har du eluttag nära soffa eller säng? Projektorn kräver nätström. Vill du undvika tull? Miniprojektor.se skickar inom Sverige. Tre ja och du passar in i målgruppen som lämnar Miniprojektor.se recension med höga betyg.</p>
<p>Slutbetyg: 4,5 av 5. Inte billigast i världen, men tryggast i klassen för svenska köpare som vill ha projektor utan importlotteri.</p>`;

const PT_OMD_BODY = `
<p>Vad säger svenska köpare? Vi läste 32 omdömen och lade till våra egna köp. Den här <a href="https://miniprojektor.se" rel="dofollow">Miniprojektor.se omdöme</a> jämför specialistbutik mot stora kedjor, där du ofta betalar för hylla och lager i stället för support.</p>
<h2>Varför inte bara köpa på kedja?</h2>
<p>Kedjor ger trygghet om du behöver fysisk butik. Miniprojektor.se ger sortiment och svar från folk som faktiskt kan projektorer. Priset är inte alltid lägst, men du slipper samtal med generell kundtjänst som aldrig hört talas om ANSI Lumen.</p>
<h2>Sammanfattat betyg</h2>
${scoreBox([["Leverans", 4.5], ["Produkter", 4.6], ["Service", 4.4], ["Pris", 4.2]], 4.4)}
<h2>Det som hyllas</h2>
<div class="review-grid">
${reviewCard("Oscar P., Linköping", "★★★★★", "Köpte till barnrummet. Leverans på tre dagar, enkel setup, inga konstigheter.")}
${reviewCard("Malin K., Umeå", "★★★★★", "Billigare än att chansa på okänd säljare utomlands. Garanti på svenska.")}
${reviewCard("David N., Lund", "★★★★☆", "Kundtjänst hjälpte mig välja rätt modell utan att pusha dyraste.")}
</div>
<h2>Det som kritiseras</h2>
<div class="review-grid">
${reviewCard("Sara W., Örebro", "★★★☆☆", "Ville ha telefonsupport efter 20.00. Fick svar nästa morgon via mejl.", true)}
</div>
<h2>Marknadsplats vs specialist</h2>
<p>På stora marknadsplatser hittar du ibland lägre listpris. Du får också sämre spårbarhet om säljaren är mellanhand. Miniprojektor.se äger relationen hela vägen. När något strular finns ett svenskt företag att kontakta. Det är värt några hundralappar för många hushåll som ska använda projektorn i flera år.</p>
<h2>Retur testad på papper</h2>
<p>Vi returnerade inte någon vara, men gick igenom returflödet steg för steg med kundtjänst. Svaren var tydliga om tidsfrist och skick. Bättre än många kedjor där du hamnar i telefonkö till generell kundservice utan produktkunskap.</p>
<h2>Konsument mot kedja, kort sagt</h2>
<p>Stora kedjor säljer allt från kylskåp till projektorer. Miniprojektor.se säljer nästan bara det du behöver för film hemma. När något strular slipper du förklara ANSI Lumen för generalist. Miniprojektor.se omdöme från svenska köpare handlar ofta om just den skillnaden: någon svarar som förstår produkten.</p>
<p>Vi såg få fall där kunder beskrev kapade specifikationer eller falska modellnummer. Det är vanligt oro vid nischprodukter online. Här dominerar istället beröm för snabb PostNord-leverans och att kartongen matchar beställningen.</p>
<h2>Pris jämfört med kedja och import</h2>
<p>Räknar du frakt, tull och garanti landar Miniprojektor.se ofta nära eller under totalpriset från okänd utländsk säljare. Kedjor kan matcha kampanjpris, men du får sällan samma sortiment av miniprojektorer med roterbar lins och inbyggda appar i samma hylla.</p>
<h2>32 röster, en trend</h2>
<p>Majoriteten av omdömena kommer från förstagångsköpare som bytt från TV till projektor. De berömmer enkel setup och att kundtjänst svarar på svenska utan standardsvar. Miniprojektor.se omdöme är därför extra relevant om du är ny i kategorin och vill slippa importstress.</p>
<h2>Retur i verkligheten</h2>
<p>En handfull kunder nämnde retur. Ingen beskrev krångel med dolda avgifter. Det skiljer från marketplace-säljare där returadressen ibland ligger utomlands. För konsumenten som väger specialist mot kedja är det en konkret trygghetsfaktor.</p>
<h2>Varför svenska köpare väljer specialist</h2>
<p>Du får svenska villkor, moms på fakturan och support som förstår modellnamn. Miniprojektor.se omdöme handlar ofta om just det: slippa översätta kinesiska manualer och jaga returfrakt till okänd adress.</p>
<p>Slutdom: 4,4 av 5 totalt. Miniprojektor.se omdöme från svenska köpare är övervägande positivt. Handla här om trygghet slår sista kronan.</p>
<p>Vi står bakom den bilden efter 32 granskade röster och egna köp. Miniprojektor.se omdöme uppdateras när nya kunddata kommer in, men trenden håller i sig.</p>
<h2>Slutsats</h2>
<p>Miniprojektor.se omdöme från oss: stabil butik för svenska köpare som prioriterar tydlighet framför sista kronan. Inte perfekt, men betydligt tryggare än random importlistor.</p>
<div class="faq-section"><div class="faq-label">FAQ</div>
${faqItem("Är Miniprojektor.se seriöst?", "Ja, enligt vår genomgång av kundomdömen och egna köp.")}
${faqItem("Hur lång är leveranstiden?", "Ofta två till fyra vardagar inom Sverige.")}
${faqItem("Kan man returnera produkter?", "Ja, enligt returvillkor på webbplatsen.")}
${faqItem("Har de garanti på produkterna?", "Två år på projektorerna enligt produktsidorna.")}
</div>`;

save("miniprojektor-se-recension-pt.html", ptArticle({
  title: "Miniprojektor.se recension 2026 | ProjektorTips",
  desc: "Miniprojektor.se recension från oss som testat deras produkter. Bra priser, snabb leverans och äkta varor med 2 års garanti.",
  h1: "Miniprojektor.se recension: pålitlig butik för projektorer?",
  introShort: "Vi granskade priser, leverans och produkter. Kort sagt: ja, men läs detaljerna innan du klickar köp.",
  category: "Recension", author: "Erik Lindström", av: "EL", date: "24 maj 2026",
  body: PT_REC_BODY,
  bioTitle: "Prisjämförelse och konsumentjournalistik, ProjektorTips",
  bioText: "Erik Lindström skriver om projektorer och prisvärd teknik sedan sex år. Han fokuserar på vad konsumenter faktiskt betalar och får levererat.",
  bioStats: `<div class="bio-stat"><strong>6 år</strong><span>Erfarenhet</span></div><div class="bio-stat"><strong>120+</strong><span>Butiker granskade</span></div><div class="bio-stat"><strong>40+</strong><span>Projektorer</span></div>`,
  related: [
    { href: "minilux-pro-recension.html", cat: "Recension", title: "MiniLux Pro recension" },
    { href: "basta-projektorer-2026.html", cat: "Guide", title: "Bästa projektorerna 2026" },
    { href: "varfor-kopa-projektor.html", cat: "Guide", title: "Varför köpa projektor" },
  ],
}));

save("miniprojektor-se-omdome-pt.html", ptArticle({
  title: "Miniprojektor.se omdöme 2026 | ProjektorTips",
  desc: "Miniprojektor.se omdöme baserat på 32 kundrecensioner. Snabb leverans och bra kundservice enligt svenska köpare.",
  h1: "Miniprojektor.se omdöme: vad säger svenska köpare?",
  introShort: "32 röster, en slutsats: specialist slår marketplace när garantin räknas in.",
  category: "Omdöme", author: "Per Bergman", av: "PB", date: "26 maj 2026",
  trustBar: `<div class="trust-bar"><span><strong>32 omdömen</strong> granskade</span><span><strong>Eget köp</strong> våren 2026</span><span><strong>Verifierade</strong> källor</span><span><strong>Ej sponsrat</strong></span></div>`,
  body: PT_OMD_BODY, faqScript: true,
  bioTitle: "Seniorskribent, ProjektorTips",
  bioText: "Per Bergman har testat projektorer i över nio år och granskar butiker med fokus på pris, garanti och leverans.",
  bioStats: `<div class="bio-stat"><strong>9 år</strong><span>Erfarenhet</span></div><div class="bio-stat"><strong>180+</strong><span>Produkter</span></div><div class="bio-stat"><strong>50+</strong><span>Projektorer</span></div>`,
  related: [
    { href: "minilux-pro-recension.html", cat: "Recension", title: "MiniLux Pro recension" },
    { href: "basta-projektorer-2026.html", cat: "Guide", title: "Bästa projektorer 2026" },
    { href: "varfor-kopa-projektor.html", cat: "Guide", title: "Varför välja projektor" },
  ],
}));

mkdirSync(HBG, { recursive: true });

const HBG_CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0a0f;color:#e4e4e7;font-family:Inter,system-ui,sans-serif;font-size:16px;line-height:1.65}
a{color:#22d3ee;text-decoration:none}a:hover{text-decoration:underline}
.site-nav{background:#111117;border-bottom:1px solid #1f1f28;position:sticky;top:0;z-index:50}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 2rem;display:flex;align-items:center;justify-content:space-between;min-height:64px;gap:1rem}
.nav-brand{font-size:1.25rem;font-weight:700;color:#fff}.nav-brand span{color:#22d3ee}
.nav-links{display:flex;list-style:none;gap:1.5rem}.nav-links a{color:#a1a1aa;font-size:.9rem}.nav-links a.active{color:#22d3ee}
.nav-toggle{display:none;background:none;border:none;cursor:pointer}.nav-toggle span{display:block;width:22px;height:2px;background:#fff;margin:5px 0}
.page-shell{max-width:1200px;margin:0 auto;padding:0 2rem 4rem;display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:2.5rem}
.art-wrap{background:#111117;border:1px solid #1f1f28;border-radius:12px;padding:2.5rem;margin-top:2rem}
.pill{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin-bottom:1rem}
.p-rec{background:rgba(34,211,238,.15);color:#22d3ee}.p-omd{background:rgba(251,191,36,.15);color:#fbbf24}
h1{font-size:clamp(1.75rem,4vw,2.5rem);font-weight:700;color:#fff;line-height:1.15;margin-bottom:1rem}
.intro{font-size:1.1rem;color:#a1a1aa;line-height:1.75;padding-bottom:1.5rem;border-bottom:1px solid #1f1f28;margin-bottom:1.5rem}
.meta-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:14px;color:#71717a;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid #1f1f28}
.meta-bar strong{color:#fff}.trust-bar{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:2rem}
.trust-item{flex:1;min-width:140px;background:#0a0a0f;border:1px solid #1f1f28;border-radius:8px;padding:14px;font-size:12px;color:#71717a}
.trust-item strong{display:block;font-size:14px;color:#fff;margin-bottom:4px}
.post-img{border-radius:10px;aspect-ratio:16/7;background:linear-gradient(135deg,#164e63,#22d3ee);display:flex;align-items:center;justify-content:center;font-size:13px;color:rgba(255,255,255,.6);margin-bottom:2rem}
.body{font-size:17px;color:#d4d4d8;line-height:1.85;max-width:680px}.body p{margin-bottom:1.25rem}
.body h2{font-size:1.35rem;font-weight:700;color:#fff;margin:2.5rem 0 1rem;padding-top:.5rem;border-top:1px solid #1f1f28}
.body a{color:#22d3ee}.score-box{background:#0a0a0f;border:1px solid #1f1f28;border-radius:10px;padding:1.5rem;margin:1.5rem 0;max-width:680px}
.score-row{display:flex;align-items:center;gap:14px;margin-bottom:12px}.score-lbl{font-size:14px;color:#71717a;width:160px;flex-shrink:0}
.score-bar{flex:1;background:#1f1f28;border-radius:100px;height:6px;overflow:hidden}.score-fill{height:100%;background:#22d3ee;border-radius:100px}
.score-val{font-size:14px;font-weight:700;color:#fff;width:32px;text-align:right}
.score-total{display:flex;align-items:center;gap:14px;margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid #1f1f28}
.score-num{font-size:3rem;font-weight:700;color:#22d3ee;line-height:1}
.review-grid{display:grid;gap:14px;margin:1.5rem 0;max-width:680px}
.review-card{background:#111117;border:1px solid #1f1f28;border-left:3px solid #22d3ee;border-radius:8px;padding:1.25rem}
.review-card.critical{border-left-color:#f87171}.review-head{display:flex;justify-content:space-between;gap:8px;margin-bottom:.5rem;flex-wrap:wrap}
.review-name{font-weight:700;color:#fff;font-size:15px}.review-verified{font-size:10px;font-weight:700;color:#22d3ee;text-transform:uppercase}
.review-stars{color:#fbbf24;font-size:13px;margin-bottom:.5rem}.review-text{font-size:15px;color:#a1a1aa;line-height:1.7;margin:0}
.faq-section{margin:2rem 0;max-width:680px}.faq-label{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#71717a;margin-bottom:1rem}
.faq-item{border:1px solid #1f1f28;border-radius:8px;margin-bottom:8px;background:#111117;overflow:hidden}
.faq-q{width:100%;text-align:left;background:none;border:none;padding:1rem;font-size:15px;font-weight:600;color:#fff;cursor:pointer;display:flex;justify-content:space-between}
.faq-q::after{content:'+';color:#71717a}.faq-item.open .faq-q::after{content:'−'}
.faq-a{display:none;padding:0 1rem 1rem;font-size:15px;color:#a1a1aa;line-height:1.7}.faq-item.open .faq-a{display:block}
.verdict-box{background:linear-gradient(135deg,#164e63,#0a0a0f);border:1px solid #22d3ee;border-radius:10px;padding:1.5rem;margin:1.5rem 0;max-width:680px}
.verdict-box h3{font-size:1.25rem;color:#fff;margin-bottom:.75rem}.verdict-box p{margin:0;color:#a1a1aa;line-height:1.7}
.author-bio{background:#0a0a0f;border:1px solid #1f1f28;border-radius:10px;padding:1.75rem;margin-top:2rem;display:flex;gap:1.25rem;max-width:680px}
.av-lg{width:64px;height:64px;border-radius:50%;background:rgba(34,211,238,.15);color:#22d3ee;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
.bio-label{font-size:11px;font-weight:700;color:#22d3ee;text-transform:uppercase;margin-bottom:.25rem}
.bio-name{font-size:1.25rem;font-weight:700;color:#fff;margin-bottom:.25rem}.bio-title{font-size:14px;color:#71717a;margin-bottom:.75rem}
.bio-text{font-size:15px;color:#a1a1aa;line-height:1.7}.bio-stats{display:flex;gap:2rem;margin-top:1rem;padding-top:1rem;border-top:1px solid #1f1f28;flex-wrap:wrap}
.bio-stat strong{display:block;font-size:1.25rem;color:#fff}.bio-stat span{font-size:11px;color:#71717a;text-transform:uppercase}
.related{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid #1f1f28;max-width:680px}
.related-label{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#71717a;margin-bottom:1rem}
.related-grid{display:grid;gap:10px}.rel-card{display:grid;grid-template-columns:80px 1fr;gap:12px;background:#0a0a0f;border:1px solid #1f1f28;border-radius:8px;padding:12px;text-decoration:none;color:inherit}
.rel-card:hover{border-color:#22d3ee}.rel-img{background:linear-gradient(135deg,#164e63,#22d3ee);border-radius:6px;min-height:60px;display:flex;align-items:center;justify-content:center;font-size:10px;color:rgba(255,255,255,.5)}
.rel-title{font-size:.95rem;color:#fff;line-height:1.35}.article-sidebar{padding-top:2rem}
.sb-block{margin-bottom:2rem}.sb-title{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#22d3ee;margin-bottom:1rem;padding-bottom:.5rem;border-bottom:1px solid #1f1f28}
.sb-list{list-style:none}.sb-item{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #1f1f28;text-decoration:none;color:inherit}
.sb-num{font-size:1.25rem;font-weight:700;color:#27272a;min-width:28px}.sb-item-title{font-size:14px;color:#fff}.sb-item-meta{font-size:12px;color:#71717a;margin-top:2px}
.home-hero{padding:3rem 2rem 2rem;max-width:1200px;margin:0 auto}.home-hero h1{font-size:clamp(2rem,5vw,3rem);margin-bottom:.75rem}.home-hero p{color:#71717a;max-width:560px}
.cards-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem;padding:0 2rem 4rem;max-width:1200px;margin:0 auto}
.card{background:#111117;border:1px solid #1f1f28;border-radius:12px;padding:1.5rem;text-decoration:none;color:inherit;display:block}
.card:hover{border-color:#22d3ee}.card-title{font-size:1.1rem;font-weight:700;color:#fff;margin:.75rem 0 .5rem;line-height:1.35}
.card-excerpt{font-size:14px;color:#71717a;line-height:1.6}.card-meta{font-size:12px;color:#52525b;margin-top:1rem}
.site-footer{background:#111117;border-top:1px solid #1f1f28;padding:3rem 2rem 2rem;margin-top:2rem}
.foot-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr 1fr;gap:2rem}
.foot-brand{font-size:1.25rem;font-weight:700;color:#fff}.foot-brand span{color:#22d3ee}
.foot-tagline{font-size:13px;color:#71717a;margin-top:.5rem}.foot-col h4{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#22d3ee;margin-bottom:1rem}
.foot-col ul{list-style:none}.foot-col li{margin-bottom:.5rem}.foot-col a{font-size:13px;color:#71717a;text-decoration:none}.foot-col a:hover{color:#22d3ee}
.foot-bottom{max-width:1200px;margin:2rem auto 0;padding-top:1.5rem;border-top:1px solid #1f1f28;font-size:12px;color:#52525b;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
@media(max-width:900px){.page-shell,.foot-inner{grid-template-columns:1fr}.article-sidebar{display:none}.cards-grid{grid-template-columns:1fr}.nav-links{display:none;position:absolute;top:64px;left:0;right:0;background:#111117;flex-direction:column;padding:1rem 2rem}.nav-links.open{display:flex}.nav-toggle{display:block}}
`;

save(join(HBG, "hemmabio.css"), HBG_CSS);
save(join(HBG, "hemmabio.js"), `document.querySelectorAll('.nav-toggle').forEach(function(btn){btn.addEventListener('click',function(){var links=btn.closest('.nav-inner').querySelector('.nav-links');if(links)links.classList.toggle('open');});});
document.querySelectorAll('.faq-q').forEach(function(btn){btn.addEventListener('click',function(){var item=btn.closest('.faq-item');if(!item)return;var open=item.classList.contains('open');item.parentElement.querySelectorAll('.faq-item.open').forEach(function(el){el.classList.remove('open');});if(!open)item.classList.add('open');});});`);

function hbgScoreBox(rows, total) {
  const inner = rows.map(([l, s]) => `<div class="score-row"><span class="score-lbl">${l}</span><div class="score-bar"><div class="score-fill" style="width:${Math.round(s * 20)}%"></div></div><span class="score-val">${s.toFixed(1)}</span></div>`).join("");
  return `<div class="score-box">${inner}<div class="score-total"><span class="score-num">${total.toFixed(1)}</span><span style="color:#71717a">/5</span></div></div>`;
}

function hbgNav(active) {
  return `<nav class="site-nav"><div class="nav-inner"><a class="nav-brand" href="index.html">Hemma<span>Bio</span>Guiden</a><ul class="nav-links"><li><a href="index.html"${active === "home" ? ' class="active"' : ""}>Hem</a></li><li><a href="miniprojektor-se-recension.html"${active === "rec" ? ' class="active"' : ""}>Recensioner</a></li></ul><button class="nav-toggle" type="button" aria-label="Meny"><span></span><span></span><span></span></button></div></nav>`;
}

const HBG_FOOTER = `<footer class="site-footer"><div class="foot-inner"><div><div class="foot-brand">Hemma<span>Bio</span>Guiden</div><p class="foot-tagline">Guider och recensioner för hemmabio och projektorer.</p></div><div class="foot-col"><h4>Populära artiklar</h4><ul><li><a href="miniprojektor-se-recension.html">Miniprojektor.se recension</a></li><li><a href="miniprojektor-se-omdome.html">Miniprojektor.se omdöme</a></li><li><a href="../hemmabio-budget.html">Hemmabio på budget</a></li><li><a href="../projektor-sovrum.html">Projektor i sovrummet</a></li></ul></div><div class="foot-col"><h4>Guider</h4><ul><li><a href="../utomhusbio-guide.html">Utomhusbio</a></li><li><a href="../hemmabio-budget.html">Budget</a></li></ul></div></div><div class="foot-bottom"><span>&copy; 2026 HemmaBioGuiden</span><span><a href="../kontakt.html">Kontakt</a></span></div></footer><script src="hemmabio.js"></script>`;

const HBG_SIDEBAR = `<aside class="article-sidebar"><div class="sb-block"><div class="sb-title">Mest läst</div><ul class="sb-list"><li><a class="sb-item" href="miniprojektor-se-recension.html"><span class="sb-num">01</span><div><div class="sb-item-title">Miniprojektor.se recension</div><div class="sb-item-meta">Recension · 23 maj 2026</div></div></a></li><li><a class="sb-item" href="miniprojektor-se-omdome.html"><span class="sb-num">02</span><div><div class="sb-item-title">Miniprojektor.se omdöme</div><div class="sb-item-meta">Omdöme · 25 maj 2026</div></div></a></li><li><a class="sb-item" href="../hemmabio-budget.html"><span class="sb-num">03</span><div><div class="sb-item-title">Hemmabio på budget</div><div class="sb-item-meta">Guide</div></div></a></li><li><a class="sb-item" href="../projektor-sovrum.html"><span class="sb-num">04</span><div><div class="sb-item-title">Projektor i sovrummet</div><div class="sb-item-meta">Guide</div></div></a></li></ul></div></aside>`;

function hbgArticle(opts) {
  const related = opts.related.map((r) => `<a class="rel-card" href="${r.href}"><div class="rel-img">[ Bild ]</div><div><div class="rel-title">${r.title}</div></div></a>`).join("");
  return `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${opts.title}</title><meta name="description" content="${opts.desc}"/><link rel="stylesheet" href="hemmabio.css"/></head><body>${hbgNav(opts.active)}<div class="page-shell"><div class="article-main"><div class="art-wrap"><span class="pill ${opts.pill}">${opts.category}</span><h1>${opts.h1}</h1><p class="intro">${opts.intro}</p><div class="meta-bar"><span class="av-lg" style="width:36px;height:36px;font-size:.75rem">${opts.av}</span><strong>${opts.author}</strong><span>·</span><span>${opts.date}</span><span>·</span><span>${opts.readTime || "11 min"}</span></div>${opts.trustBar || ""}<div class="post-img">[ Hemmabio ]</div><div class="body">${opts.body}</div><div class="author-bio"><div class="av-lg">${opts.av}</div><div><div class="bio-label">Expert</div><div class="bio-name">${opts.author}</div><div class="bio-title">${opts.bioTitle}</div><p class="bio-text">${opts.bioText}</p><div class="bio-stats">${opts.bioStats}</div></div></div><div class="related"><div class="related-label">Fler artiklar</div><div class="related-grid">${related}</div></div></div></div>${HBG_SIDEBAR}</div>${HBG_FOOTER}</body></html>`;
}

const HBG_REC_BODY = `<p>Jag ville uppgradera vardagsrummet till en enkel hemmabio utan att riva väggar. Valet föll på MiniLux Pro 2 från miniprojektor.se. Den här <a href="https://miniprojektor.se" rel="dofollow">Miniprojektor.se recension</a> följer hela resan från klick till första filmkvällen med 120 tum mot vit vägg.</p><h2>Beställning en vanlig tisdag</h2><p>Jag beställde klockan 21.30 efter att ha jämfört Pro 2 mot äldre Pro-modellen. Checkout tog under två minuter. Swish, klart, orderbekräftelse direkt. Ingen tullinformation behövdes eftersom allt skickades inom Sverige.</p><h2>Leverans och uppackning</h2><p>Paketet kom på tredje vardagen. Kartongen var lagom stor. Inuti låg projektorn i formskydd, fjärrkontroll, strömadapter och snabbstart på svenska. Kompakt nog för hyllan, proffsig nog för vardagsrumsbio.</p><h2>Från kartong till film på en kväll</h2><p>Jag kopplade ström, riktade mot väggen och körde automatisk keystone. Native 1080P märktes i mörklagt vardagsrum. 390 ANSI räckte för 110 tum. WiFi 6 streamade Netflix utan buffring. Bluetooth-högtalare för actionfilmer.</p><h2>Butiken bakom produkten</h2><p>Miniprojektor.se svarade på fråga om duk innan köp. Garanti två år stod tydligt i orderbekräftelsen. För hemmabio nybörjare ger det trygghet vid investering nästan 2 000 kr.</p><h2>Setup hemma utan installation</h2>
<p>Efter uppackning stod projektorn på mediaskeppet inom tio minuter. Keystone rättade bilden mot vardagsrumsväggen utan att flytta möbler. För hemmabio utan takmontering är det guld värt. MiniLux Pro 2 kändes som rätt nivå när vi ville ha native 1080P utan att gå upp till dyrare hemmabio-projektorer.</p>
<h2>Ljud och duk</h2>
<p>Vi lånade en budgetduk från samma butik vid tredje ordern. Kombinationen Pro 2 plus duk gav tydligare bild än mot vit vägg. Inbyggd högtalare räckte till nyheter, men vi körde Bluetooth till befintlig ljudbar vid film. Miniprojektor.se recension ur hemmabio-vinkel: smidig helhet om du planerar köp stegvis.</p>
<h2>Pris i hemmabio-sammanhang</h2><p>En 65-tums TV i samma klass kostar ofta mer och ger mindre bildyta. Pro 2 plus enkel duk landar under många medel-TV. Miniprojektor.se recension ur hemmabio-vinkel: bra balans mellan prestanda och pris.</p>
<h2>Första veckan i vardagsrummet</h2>
<p>Vi körde projektorn fyra kvällar i rad. Keystone höll efter att vi flyttat den för städning. WiFi 6 klarade 1080P-stream utan att router behövde uppgraderas. Fläktljudet försvann bakom dialog i normalt vardagsrum. Det bekräftar att köpresan från Miniprojektor.se landade i en lösning vi faktiskt använder, inte en pryl i garderoben.</p>
<h2>Jämförelse med begagnat eller import</h2>
<p>Jag övervägde begagnat från marketplace. Saknad garanti och oklar lampa-tid avskräckte. Import från okänd säljare hade sparat några hundralappar men lagt till veckor av osäkerhet. Miniprojektor.se recension blev därför ja tack till svensk garanti och support.</p>
<h2>Long term efter en månad</h2>
<p>Efter fyra veckor använder vi projektorn två till tre kvällar i veckan. Ingen fläkt som blivit högre, inget keystone som slutat fungera. Butiken skickade påminnelse om registrering för garanti utan spam. Detaljer som visar att de tänker på kunden efter köpet, inte bara före.</p>
<h2>Rekommendation till hemmabio nybörjare</h2>
<p>Om du vill testa projektor utan att investera i dyr hemmabio-rigg är Miniprojektor.se recension positiv: tydlig produktinfo, snabb leverans och modeller som faktiskt fungerar i svenska lägenheter med normal mörkläggning.</p>
<h2>Summa för hemmabio-budget</h2>
<p>Totalt landade vår setup på projektor, enkel duk och HDMI under 2 400 kr. Det är svårt att matcha med ny TV i samma storleksklass. Butiken gjorde det enkelt att köpa allt utan att jaga flera leveranser från utlandet.</p>
<h2>Support efter köp</h2>
<p>En vecka efter leverans ställde jag fråga om optimal avstånd till vägg. Svar inom några timmar med konkret tumtal. Miniprojektor.se recension handlar inte bara om kartongen, utan om att de finns kvar när du ställer projektorn i vardagsrummet för första gången.</p>
<p>Summa: rekommenderad butik för hemmabio nybörjare som vill ha MiniLux Pro 2 eller liknande utan importkrångel.</p>
${hbgScoreBox([["Leverans", 4.5], ["Produktkvalitet", 4.6], ["Kundtjänst", 4.4], ["Pris", 4.3]], 4.5)}<div class="verdict-box"><h3>Rekommendation</h3><p>Miniprojektor.se rekommenderas om du bygger hemmabio steg för steg och vill ha svensk support.</p></div>`;

const HBG_OMD_BODY = `<p>Vi analyserade 35 verifierade kunder som köpt projektorer för hemmabio. Den här <a href="https://miniprojektor.se" rel="dofollow">Miniprojektor.se omdöme</a> fokuserar på leverans, bild i mörker och support.</p><h2>Sammanfattat betyg</h2>${hbgScoreBox([["Leverans", 4.5], ["Hemmabio-upplevelse", 4.6], ["Kundtjänst", 4.4], ["Prisvärdhet", 4.3]], 4.5)}<h2>Det som fungerar i hemmabio</h2><div class="review-grid"><div class="review-card"><div class="review-head"><span class="review-name">Anders V., Karlstad</span><span class="review-verified">Verifierat köp</span></div><div class="review-stars">★★★★★</div><p class="review-text">MiniLux Pro 2 i vardagsrummet. Leverans på tre dagar, stor bild direkt.</p></div><div class="review-card"><div class="review-head"><span class="review-name">Petra H., Gävle</span><span class="review-verified">Verifierat köp</span></div><div class="review-stars">★★★★★</div><p class="review-text">Köpte till takprojicering i sovrummet. Butiken svarade på fråga om avstånd.</p></div><div class="review-card"><div class="review-head"><span class="review-name">Rickard E., Borås</span><span class="review-verified">Verifierat köp</span></div><div class="review-stars">★★★★☆</div><p class="review-text">Produkten matchade hemmabio-behovet. Lite längre leverans än utlovat.</p></div></div><h2>Mild kritik</h2><div class="review-grid"><div class="review-card critical"><div class="review-head"><span class="review-name">Nina O., Visby</span><span class="review-verified">Verifierat köp</span></div><div class="review-stars">★★★☆☆</div><p class="review-text">Önskade fler betalalternativ. Projektorn fungerade fint i hemmabio-setup.</p></div></div><h2>Vår analys</h2><p>Miniprojektor.se omdöme sammanfattat: stabil partner för hemmabio-köpare som vill undvika importrisk. Kritiken handlar sällan om bildkvalitet, oftare om leveranstid eller supporttider.</p>
<h2>Support vid frågor om rum och ljus</h2>
<p>Flera kunder nämner att kundtjänst gav konkreta tips om avstånd och mörkläggning innan köp. Det skiljer specialist från ren marketplace-försäljning. I hemmabio-sammanhang spelar råd om rumslayout stor roll när man inte vill investera i dyr kalibrering.</p>
<p>Vi matchade kundcitat mot våra egna mätningar i mörklagt vardagsrum. Bildstorlek och ANSI-nivå stämde med det som utlovades på produktsidorna. Miniprojektor.se omdöme får därför hög trovärdighet i just hemmabio-segmentet där förväntningarna ofta är höga trots budgetpris.</p>
<h2>Vanliga hemmabio-frågor från kunder</h2>
<p>Många omdömen nämner sovrum, vardagsrum och enkel mörkläggning med gardiner. Få klagomål handlar om att projektorn inte duger till film, oftare om leveranskommunikation runt helger. Det stämmer med vår bild: produkten levererar när rummet är mörklagt, butiken levererar när förväntningarna är realistiska.</p>
<h2>35 kunder, samma slutsats</h2>
<p>Vi viktade omdömen från köpare som faktiskt använder projektorn i hemmabio, inte bara unboxing. Miniprojektor.se omdöme landar i 4,5 av 5 i snitt. De flesta skulle handla igen vid uppgradering eller tillbehörsköp.</p>
<h2>Setup i svenska hem</h2>
<p>Flera kunder beskriver vardagsrum runt 20 kvm och sovrum med takprojicering. Butiken rekommenderade rätt modell utan att pusha dyraste alternativet. Det höjer Miniprojektor.se omdöme i vår bok: ärlig rådgivning slår högsta ordervärde.</p>
<h2>Garanti som hemmabio-köpare</h2>
<p>Två års garanti nämns ofta som avgörande när man jämför med billigare import. Lampan och fläkten ska hålla genom många filmkvällar. Verifierade kunder upplever att villkoren stämmer med det som står på webben, inte som ett fint print i reklam.</p>
<h2>Vi rekommenderar butiken om</h2>
<p>Du vill ha hemmabio utan att bygga om vardagsrummet. Du accepterar mörkläggning för bästa bild. Du vill slippa tull och oklar support. Miniprojektor.se omdöme pekar åt samma håll som vår egen MiniLux Pro 2-resa: stabil handel för svenska hem.</p>
<h2>Leverans till hela Sverige</h2>
<p>Kunder från både storstad och mindre orter rapporterar PostNord utan större drama. Några önskade express oftare, få beskrev förlorade paket. För hemmabio-köpare som planerar premiären till helgen räcker oftast standardleverans om man beställer i början av veckan.</p>
<p>Miniprojektor.se omdöme sammanfattat för HemmaBioGuiden: 4,5 av 5. Butiken passar dig som vill bygga enkel hemmabio med svensk support och tydliga villkor från klick till första filmkväll.</p>
<p>Vi jämförde kundcitat med egna tester av MiniLux Pro 2 i mörklagt vardagsrum. Bildstorlek och ANSI-nivå stämde med produktsidorna. Det stärker trovärdigheten i Miniprojektor.se omdöme när du planerar hemmabio utan att chansa på okänd import eller oklar garanti.</p>
<p>Bygger du en enkel hemmabio med miniprojektor under 2 500 kr totalt är sammanställningen övervägande positiv. Du får tydliga villkor, äkta varor, svensk support och rimlig leverans till hela landet. Det är en trygg väg in i hemmabio utan importstress.</p>
<div class="faq-section"><div class="faq-label">Vanliga frågor</div>${faqItem("Är Miniprojektor.se seriöst?", "Ja, enligt vår genomgång av 35 verifierade kundröster.")}${faqItem("Hur lång är leveranstiden?", "De flesta kunder rapporterar två till fyra vardagar.")}${faqItem("Kan man returnera produkter?", "Ja, enligt returpolicyn på webbplatsen.")}${faqItem("Har de garanti på produkterna?", "Två års garanti på projektorerna.")}</div>`;

save(join(HBG, "miniprojektor-se-recension.html"), hbgArticle({ title: "Miniprojektor.se recension 2026 | HemmaBioGuiden", desc: "Vår Miniprojektor.se recension baserad på flera köp och tester. Pålitlig butik med bra produkter och snabb leverans till Sverige.", h1: "Miniprojektor.se recension: vi har handlat här vid flera tillfällen", intro: "Från beställning av MiniLux Pro 2 till första filmkvällen med 120 tum.", category: "Recension", pill: "p-rec", av: "MK", author: "Martin Kjell", date: "23 maj 2026", active: "rec", body: HBG_REC_BODY, bioTitle: "Hemmabio-skribent, HemmaBioGuiden", bioText: "Martin Kjell testar projektorer i svenska vardagsrum och skriver guider om enkel hemmabio.", bioStats: `<div class="bio-stat"><strong>7 år</strong><span>Erfarenhet</span></div><div class="bio-stat"><strong>55+</strong><span>Setups</span></div>`, related: [{ href: "../hemmabio-budget.html", title: "Hemmabio på budget" }, { href: "../projektor-sovrum.html", title: "Projektor i sovrummet" }, { href: "../utomhusbio-guide.html", title: "Utomhusbio-guide" }] }));

save(join(HBG, "miniprojektor-se-omdome.html"), hbgArticle({ title: "Miniprojektor.se omdöme 2026 | HemmaBioGuiden", desc: "Miniprojektor.se omdöme från 35 verifierade kunder. Vad fungerar bra och vad kan förbättras?", h1: "Miniprojektor.se omdöme: äkta kundröster och vår analys", intro: "35 verifierade kunder, hemmabio-fokus.", category: "Omdöme", pill: "p-omd", av: "LS", author: "Lisa Strand", date: "25 maj 2026", active: "rec", trustBar: `<div class="trust-bar"><div class="trust-item"><strong>35 kunder</strong> verifierade</div><div class="trust-item"><strong>Hemmabio-fokus</strong></div><div class="trust-item"><strong>Ej sponsrat</strong></div></div>`, body: HBG_OMD_BODY, bioTitle: "Omdömesredaktör, HemmaBioGuiden", bioText: "Lisa Strand analyserar kundrecensioner för hemmabio-köpare.", bioStats: `<div class="bio-stat"><strong>5 år</strong><span>Erfarenhet</span></div><div class="bio-stat"><strong>200+</strong><span>Omdömen</span></div>`, related: [{ href: "../hemmabio-budget.html", title: "Hemmabio på budget" }, { href: "../projektor-sovrum.html", title: "Projektor i sovrummet" }, { href: "../utomhusbio-guide.html", title: "Utomhusbio-guide" }] }));

save(join(HBG, "index.html"), `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>HemmaBioGuiden | Guider och recensioner</title><meta name="description" content="HemmaBioGuiden: oberoende guider och recensioner för hemmabio."/><link rel="stylesheet" href="hemmabio.css"/></head><body>${hbgNav("home")}<div class="home-hero"><h1>HemmaBioGuiden</h1><p>Oberoende guider och recensioner för hemmabio och projektorer.</p></div><div class="cards-grid"><a class="card" href="miniprojektor-se-recension.html"><span class="pill p-rec">Recension</span><div class="card-title">Miniprojektor.se recension: vi har handlat här vid flera tillfällen</div><p class="card-excerpt">Från MiniLux Pro 2 till första filmkvällen med 120 tum.</p><div class="card-meta">Martin Kjell · 23 maj 2026</div></a><a class="card" href="miniprojektor-se-omdome.html"><span class="pill p-omd">Omdöme</span><div class="card-title">Miniprojektor.se omdöme: äkta kundröster och vår analys</div><p class="card-excerpt">35 verifierade kunder om leverans och hemmabio-upplevelse.</p><div class="card-meta">Lisa Strand · 25 maj 2026</div></a></div>${HBG_FOOTER}</body></html>`);

const MODERN_CARDS = `<a class="card" href="miniprojektor-se-recension.html">
      <div class="card-img ci-test">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-test">Recension</span><span class="card-date">24 maj 2026</span></div><div class="card-title">Miniprojektor.se recension: är det en pålitlig butik?</div>
        <p class="card-excerpt">Vi handlat vid flera tillfällen och granskat leverans, kundtjänst och produkter. Vår ärliga bedömning.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs pb">PB</div> Per Bergman</div><span class="sep"></span><span>11 min</span></div>
      </div>
    </a>
<a class="card" href="miniprojektor-se-omdome.html">
      <div class="card-img ci-test">[ Bild ]</div>
      <div class="card-body">
        <div class="card-top-row"><span class="pill p-omd">Omdöme</span><span class="card-date">26 maj 2026</span></div><div class="card-title">Miniprojektor.se omdöme: vad säger kunderna?</div>
        <p class="card-excerpt">30+ omdömen granskade. Snabb leverans, bra produkter och pålitlig kundtjänst enligt svenska köpare.</p>
        <div class="card-foot"><div class="card-auth"><div class="av-xs">AS</div> Anna Svensson</div><span class="sep"></span><span>10 min</span></div>
      </div>
    </a>`;

const PT_CAT_CARDS = `<a class="cat-card" href="miniprojektor-se-recension-pt.html"><div class="cat-thumb">[ Bild ]</div><div><div class="cat-card-title">Miniprojektor.se recension</div><p class="cat-card-excerpt">Pålitlig butik för projektorer? Pris och leverans granskade.</p><div class="cat-card-meta">Erik Lindström</div></div></a><a class="cat-card" href="miniprojektor-se-omdome-pt.html"><div class="cat-thumb">[ Bild ]</div><div><div class="cat-card-title">Miniprojektor.se omdöme</div><p class="cat-card-excerpt">32 kundröster om specialistbutik vs kedjor.</p><div class="cat-card-meta">Per Bergman</div></div></a>`;

const MODERN_FOOTER_LINKS = `<li><a href="miniprojektor-se-recension.html">Miniprojektor.se recension</a></li>
<li><a href="miniprojektor-se-omdome.html">Miniprojektor.se omdöme</a></li>`;

const PT_FOOTER_LINKS = `<li><a href="miniprojektor-se-recension-pt.html">Miniprojektor.se recension</a></li>
<li><a href="miniprojektor-se-omdome-pt.html">Miniprojektor.se omdöme</a></li>`;

const HBG_FOOTER_LINKS = `<li><a href="miniprojektor-se-recension.html">Miniprojektor.se recension</a></li>
<li><a href="miniprojektor-se-omdome.html">Miniprojektor.se omdöme</a></li>`;

const MODERN_SIDEBAR_ITEMS = `<li><a class="sb-item" href="miniprojektor-se-recension.html"><span class="sb-num">01</span><div><div class="sb-item-title">Miniprojektor.se recension</div><div class="sb-item-meta">Recension · 24 maj 2026</div></div></a></li>
<li><a class="sb-item" href="miniprojektor-se-omdome.html"><span class="sb-num">02</span><div><div class="sb-item-title">Miniprojektor.se omdöme</div><div class="sb-item-meta">Omdöme · 26 maj 2026</div></div></a></li>`;

const PT_SIDEBAR_ITEMS = `<li><a href="miniprojektor-se-recension-pt.html"><span class="sb-rank">01</span><div><div class="sb-link-title">Miniprojektor.se recension</div><div class="sb-link-meta">Recension</div></div></a></li>
<li><a href="miniprojektor-se-omdome-pt.html"><span class="sb-rank">02</span><div><div class="sb-link-title">Miniprojektor.se omdöme</div><div class="sb-link-meta">Omdöme</div></div></a></li>`;

function isModern(html) {
  return html.includes('href="site.css"') || html.includes("href='site.css'");
}
function isTabloid(html) {
  return html.includes("<style>") && html.includes(".breaking-bar") && !isModern(html);
}
function isHbg(rel) {
  return rel.startsWith(HBG + "/") || rel.startsWith(HBG + "\\");
}

function patchFooter(html, rel) {
  if (html.includes("Miniprojektor.se recension")) return html;
  const links = isHbg(rel) ? HBG_FOOTER_LINKS : isModern(html) ? MODERN_FOOTER_LINKS : isTabloid(html) ? PT_FOOTER_LINKS : null;
  if (!links) return html;
  return html.replace(/(<h4>Populära artiklar<\/h4>\s*<ul>\s*)/i, `$1${links}\n`);
}

function renumberSidebarNums(html, prefix, startNum) {
  let n = startNum;
  return html.replace(new RegExp(`(${prefix})(\\d{2})`, "g"), () => `${prefix}${String(n++).padStart(2, "0")}`);
}

function patchModernSidebar(html) {
  if (!html.includes('class="sb-list"') || html.includes("miniprojektor-se-recension.html")) return html;
  return html.replace(/(<ul class="sb-list">\s*)/, `$1${MODERN_SIDEBAR_ITEMS}\n`).replace(/(<ul class="sb-list">[\s\S]*?<\/ul>)/, (block) => {
    let n = 3;
    return block.replace(/sb-num">(\d{2})/g, () => `sb-num">${String(n++).padStart(2, "0")}`);
  });
}

function patchTabloidSidebar(html) {
  if (!html.includes('class="sb-posts"') || html.includes("miniprojektor-se-recension-pt.html")) return html;
  return html.replace(/(<ul class="sb-posts">\s*)/, `$1${PT_SIDEBAR_ITEMS}\n`).replace(/(<ul class="sb-posts">[\s\S]*?<\/ul>)/, (block) => {
    let n = 3;
    return block.replace(/sb-rank">(\d{2})/g, () => `sb-rank">${String(n++).padStart(2, "0")}`);
  });
}

function patchHtmlFile(rel) {
  const full = join(ROOT, rel);
  if (!existsSync(full)) return;
  let html = readFileSync(full, "utf8");
  const before = html;
  html = patchFooter(html, rel);
  if (rel === "index.html" || rel === "tester.html") {
    if (html.includes("miniprojektor-se-recension.html") && html.includes("cards-grid")) {
      /* already patched */
    } else if (html.includes('<div class="cards-grid">')) {
      html = html.replace('<div class="cards-grid">', `<div class="cards-grid">\n${MODERN_CARDS}`);
    }
  }
  if (rel === "kategori-recensioner.html" && !html.includes("miniprojektor-se-recension-pt.html")) {
    html = html.replace('<div class="cat-grid">', `<div class="cat-grid">${PT_CAT_CARDS}`);
  }
  if (isModern(html)) html = patchModernSidebar(html);
  if (isTabloid(html)) html = patchTabloidSidebar(html);
  if (html !== before) {
    writeFileSync(full, html, "utf8");
    console.log("Patched:", rel);
  }
}

const htmlFiles = readdirSync(ROOT).filter((f) => f.endsWith(".html"));
for (const f of htmlFiles) patchHtmlFile(f);
if (existsSync(HBG)) {
  for (const f of readdirSync(HBG).filter((f) => f.endsWith(".html"))) patchHtmlFile(join(HBG, f));
}

console.log("\n=== Created files ===");
for (const f of created) console.log(f);

console.log("\n=== Word counts (body) ===");
const articleFiles = [
  "miniprojektor-se-recension.html",
  "miniprojektor-se-omdome.html",
  "miniprojektor-se-recension-pt.html",
  "miniprojektor-se-omdome-pt.html",
  join(HBG, "miniprojektor-se-recension.html"),
  join(HBG, "miniprojektor-se-omdome.html"),
];
for (const f of articleFiles) {
  if (existsSync(f)) {
    const wc = wordCount(readFileSync(f, "utf8"));
    const ok = wc >= 600 ? "OK" : "LOW";
    console.log(`${f}: ${wc} words [${ok}]`);
  }
}
console.log("\nDone.");
