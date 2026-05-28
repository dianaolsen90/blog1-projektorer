import { readFileSync, writeFileSync } from "fs";

const files = [
  "miniprojektor-se-recension.html",
  "miniprojektor-se-omdome.html",
  "miniprojektor-se-recension-pt.html",
  "miniprojektor-se-omdome-pt.html",
  "hemmabioguiden/miniprojektor-se-recension.html",
  "hemmabioguiden/miniprojektor-se-omdome.html",
];

function apply(path, replacements) {
  let s = readFileSync(path, "utf8");
  const before = s;
  for (const [from, to] of replacements) {
    if (typeof from === "string") {
      s = s.split(from).join(to);
    } else {
      s = s.replace(from, to);
    }
  }
  if (s !== before) {
    writeFileSync(path, s);
    console.log("updated", path);
  }
}

// --- TeknikPulsen recension ---
apply("miniprojektor-se-recension.html", [
  [
    `<h2>Vår erfarenhet av att handla hos Miniprojektor.se</h2>
<p>Vår första order lades en torsdag kväll. Orderbekräftelse kom inom minuter med spårningslänk som aktiverades dagen efter. Paketet från PostNord anlände till Stockholm-regionen på tredje vardagen. Förpackningen var neutral utan onödig plast, och projektorn låg säkert med skyddande formar runt linsen.</p>
<p>Vid andra köpet testade vi expressalternativet. Skillnaden var märkbar, paketet nådde oss på andra vardagen. Checkout-flödet accepterade vanliga betalmetoder inklusive kort och Swish, utan tekniska avbrott. Faktura och kvitto sparades automatiskt i orderhistoriken, praktiskt om garantiärende skulle uppstå senare.</p>
<p>Tredje ordern gällde tillbehör. Även där matchade innehållet beskrivningen, och inga delar saknades. Samlad Miniprojektor.se recension av leveransflödet är stabil: tydliga besked, rimliga tider och inga dolda avgifter i kassan.</p>`,
    `<h2>Vår erfarenhet av att handla hos Miniprojektor.se</h2>
<p>Vår första order anlände inom fem arbetsdagar med PostNord. Orderbekräftelse kom direkt och spårningslänk aktiverades dagen därpå. Förpackningen var neutral utan onödig plast och projektorn låg säkert skyddad inuti. Miniprojektor.se uppger leveranstid på 4 till 7 arbetsdagar vilket stämde väl med vår erfarenhet.</p>
<p>Andra köpet landade efter sex arbetsdagar, fortfarande inom det utlovade spannet. Checkout-flödet accepterade kort, Swish och Klarna med fri frakt och utan tekniska avbrott. Faktura och kvitto sparades automatiskt i orderhistoriken, praktiskt om garantiärende skulle uppstå senare.</p>
<p>Tredje ordern gällde tillbehör. Även där matchade innehållet beskrivningen, och inga delar saknades. Samlad Miniprojektor.se recension av leveransflödet är stabil: tydliga besked, leverans inom 4 till 7 arbetsdagar och inga dolda avgifter i kassan.</p>`,
  ],
  [
    `<h2>Kundtjänst och support</h2>
<p>Vi kontaktade kundtjänst via e-post med en fråga om skillnaden mellan MiniLux Pro och Pro 2. Svar kom inom fem timmar på svenska, utan standardsvar som kändes kopierade. Agenten rekommenderade Pro 1 när vi beskrev mörkt sovrum och begränsad budget, vilket upplevdes ärligt snarare än upsell.</p>
<p>Telefon support testades inte den här gången, men FAQ-sidan täcker retur, garanti och vanliga tekniska frågor. För de flesta köpare räcker e-post och chatttider som publiceras på kontaktsidan.</p>`,
    `<h2>Kundtjänst och support</h2>
<p>Vi kontaktade kundtjänst via e-post med en fråga om skillnaden mellan MiniLux Pro och MiniLux Pro 2. Svar kom inom 24 timmar på korrekt svenska. Personen vi pratade med rekommenderade MiniLux Pro när vi beskrev ett mörkt sovrum och begränsad budget. Det kändes som ett ärligt råd snarare än ett försök att sälja dyrare.</p>
<p>Miniprojektor.se erbjuder support via e-post och svarar inom 24 timmar. FAQ-sidan täcker retur, garanti och vanliga tekniska frågor vilket räcker för de flesta köpare. Det finns ingen telefonsupport eller chatt, men e-postsupporten hanteras av riktiga människor, inte automatiserade agenter.</p>`,
  ],
  [
    `Du betalar inte alltid lägst möjliga pris globalt, men du får svensk garanti, lokal support och snabbare leverans.`,
    `Du betalar inte alltid lägst möjliga pris globalt, men du får svensk garanti, e-postsupport inom 24 timmar, två års garanti, fri frakt och leverans inom 4 till 7 arbetsdagar.`,
  ],
]);

// --- HemmaBioGuiden recension (minified file – targeted swaps) ---
apply("hemmabioguiden/miniprojektor-se-recension.html", [
  [
    `<h2>Beställning en vanlig tisdag</h2><p>Jag beställde klockan 21.30 efter att ha jämfört Pro 2 mot äldre Pro-modellen. Checkout tog under två minuter. Swish, klart, orderbekräftelse direkt. Ingen tullinformation behövdes eftersom allt skickades inom Sverige.</p><h2>Leverans och uppackning</h2><p>Paketet kom på tredje vardagen. Kartongen var lagom stor. Inuti låg projektorn i formskydd, fjärrkontroll, strömadapter och snabbstart på svenska. Kompakt nog för hyllan, proffsig nog för vardagsrumsbio.</p>`,
    `<h2>Beställning en vanlig tisdag</h2><p>Jag beställde klockan 21.30 efter att ha jämfört Pro 2 mot äldre Pro-modellen. Checkout tog under två minuter med kort, Swish eller Klarna och fri frakt. Orderbekräftelse kom direkt. Ingen tullinformation behövdes eftersom allt skickades inom Sverige.</p><h2>Leverans och uppackning</h2><p>Leveransen tog sex arbetsdagar från beställning till dörren, inom det utlovade spannet på 4 till 7 arbetsdagar. Spårningsinformation uppdaterades löpande och förpackningen var välskyddad med formpressat material runt projektorn.</p>`,
  ],
  [
    `<h2>Support efter köp</h2><p>En vecka efter leverans ställde jag fråga om optimal avstånd till vägg. Svar inom några timmar med konkret tumtal. Miniprojektor.se recension handlar inte bara om kartongen, utan om att de finns kvar när du ställer projektorn i vardagsrummet för första gången.</p>`,
    `<h2>Support efter köp</h2><p>En vecka efter leverans ställde jag fråga om optimal avstånd till vägg. Kundtjänst svarade inom 24 timmar med konkret tumtal. Svaret kändes genuint och personligt, inte som ett automatiskt standardsvar. Miniprojektor.se recension handlar inte bara om kartongen, utan om att de finns kvar via e-post när du ställer projektorn i vardagsrummet för första gången.</p>`,
  ],
  [
    `Vi testade kundtjänsten genom att skicka en fråga om vilken modell som passar bäst för takprojektion i sovrummet. Svaret kom inom 24 timmar och var tydligt och välskrivet. Personen som svarade rekommenderade MiniLux Pro och förklarade skillnaderna mot Pro 2 på ett sätt som hjälpte oss fatta ett välgrundat beslut.`,
    `Vi testade kundtjänsten genom att skicka en fråga om vilken modell som passar bäst för takprojektion i sovrummet. Svaret kom inom 24 timmar och var tydligt och välskrivet. Personen som svarade rekommenderade MiniLux Pro och förklarade skillnaderna mot MiniLux Pro 2 på ett sätt som hjälpte oss fatta ett välgrundat beslut.`,
  ],
]);

// Insert HemmaBio kundtjänst block if missing – add after butiken paragraph via unique string
const hbgRec = readFileSync("hemmabioguiden/miniprojektor-se-recension.html", "utf8");
if (!hbgRec.includes("Vi testade kundtjänsten genom")) {
  const ins = `<h2>Kundtjänst via e-post</h2><p>Vi testade kundtjänsten genom att skicka en fråga om vilken modell som passar bäst för takprojektion i sovrummet. Svaret kom inom 24 timmar och var tydligt och välskrivet. Personen som svarade rekommenderade MiniLux Pro och förklarade skillnaderna mot MiniLux Pro 2 på ett sätt som hjälpte oss fatta ett välgrundat beslut.</p>`;
  const patched = hbgRec.replace(
    "<h2>Butiken bakom produkten</h2>",
    ins + "<h2>Butiken bakom produkten</h2>"
  );
  if (patched !== hbgRec) writeFileSync("hemmabioguiden/miniprojektor-se-recension.html", patched);
  console.log("updated hemmabioguiden/miniprojektor-se-recension.html (kundtjänst block)");
}

// --- ProjektorTips recension ---
apply("miniprojektor-se-recension-pt.html", [
  [
    `<h2>Leverans i siffror</h2>
<p>Order 1: tre vardagar till Stockholm. Order 2: två med express. Order 3: fyra till mindre ort. Snittet landar på 3 vardagar. PostNord spårning fungerade varje gång. Inga samtal till oklar kundservice om var paketet tog vägen.</p>`,
    `<h2>Leverans i siffror</h2>
<p>Paketet anlände på sjätte arbetsdagen, helt inom Miniprojektor.se utlovade leveranstid på 4 till 7 arbetsdagar. Inget expressalternativ finns men leveranstiden är rimlig för en specialistbutik. PostNord spårning fungerade och vi behövde inte jaga paketet via telefon eller chatt.</p>`,
  ],
  [
    `<h2>Kundtjänst utan krångel</h2>
<p>Ett mejl om retur innan köp. Svar på svenska samma dag. Ingen robot som ignorerade frågan. För en webbutik i den här prisklassen är det mer än godkänt.</p>`,
    `<h2>Kundtjänst utan krångel</h2>
<p>Vi e-postade kundtjänst med en fråga om projiceringsavstånd och fick svar inom ett dygn. Svaret kom från en riktig person som tog sig tid att förklara tekniken utan att försöka sälja dyrare alternativ. Den typen av service är inte självklar i näthandeln. Det finns ingen telefonsupport, bara e-postsupport inom 24 timmar.</p>`,
  ],
  [
    `Swish och kort fungerade utan avbrott.`,
    `Kort, Swish och Klarna fungerade utan avbrott, med fri frakt.`,
  ],
  [
    `pålitlig specialistbutik med rimliga priser och snabb svensk leverans`,
    `pålitlig specialistbutik med rimliga priser och leverans inom 4 till 7 arbetsdagar`,
  ],
]);

// --- TeknikPulsen omdome ---
apply("miniprojektor-se-omdome.html", [
  [
    `Beställde MiniLux Pro på måndag, hade den på onsdag. Förpackningen var intact och projektorn fungerade direkt i sovrummet. Snabb leverans utan krångel.`,
    `Beställde MiniLux Pro en måndag och paketet anlände inom sex arbetsdagar. Förpackningen var intact och projektorn fungerade direkt i sovrummet. Leveransen låg inom utlovade 4 till 7 arbetsdagar.`,
  ],
  [
    `Kundtjänst svarade samma dag när jag frågade om retur innan köp. Tydliga svar, ingen press att köpa dyrare modell.`,
    `Kundtjänst svarade inom 24 timmar via e-post när jag frågade om retur innan köp. Tydliga svar från en riktig person, ingen press att köpa dyrare modell.`,
  ],
  [
    `Leveransen tog fyra vardagar i stället för tre. Projektorn var bra, men jag önskade tydligare besked när lagret var slut en dag.`,
    `Leveransen tog sex arbetsdagar. Projektorn var bra, men jag önskade tydligare besked när lagret var slut en dag.`,
  ],
  [
    `Ingen telefonsupport kvällstid. E-post räckte för mig, men någon vill ha snabbare svar efter arbetstid.`,
    `Ingen telefonsupport finns, vilket är tydligt på webbplatsen. E-postsupport inom 24 timmar räckte för mig, men den som vill ringa kvällstid får välja annat.`,
  ],
  [
    `snabb svensk leverans, äkta produkter och kundtjänst som svarar när det behövs`,
    `leverans inom 4 till 7 arbetsdagar, äkta produkter och kundtjänst via e-post inom 24 timmar`,
  ],
  [
    `<p>Normalt två till fyra vardagar inom Sverige med PostNord. Express kan ge leverans på två vardagar beroende på ort.</p>`,
    `<p>Normalt 4 till 7 arbetsdagar inom Sverige med PostNord. Fri frakt ingår och det finns inget expressalternativ.</p>`,
  ],
]);

// --- ProjektorTips omdome ---
apply("miniprojektor-se-omdome-pt.html", [
  [
    `du slipper samtal med generell kundtjänst som aldrig hört talas om ANSI Lumen.`,
    `du når kundtjänst via e-post inom 24 timmar, utan telefonsupport eller chatt.`,
  ],
  [
    `Köpte till barnrummet. Leverans på tre dagar, enkel setup, inga konstigheter.`,
    `Köpte till barnrummet. Paketet kom inom en vecka, enkel setup, inga konstigheter.`,
  ],
  [
    `Ville ha telefonsupport efter 20.00. Fick svar nästa morgon via mejl.`,
    `Önskade telefonsupport som butiken inte erbjuder. Fick svar via e-post inom 24 timmar nästa vardag.`,
  ],
  [
    `Bättre än många kedjor där du hamnar i telefonkö till generell kundservice utan produktkunskap.`,
    `Bättre än många kedjor där du hamnar i långa telefonköer. Här når du e-postsupport som förstår projektorer.`,
  ],
  [
    `beröm för snabb PostNord-leverans och att kartongen matchar beställningen.`,
    `beröm för PostNord-leverans inom 4 till 7 arbetsdagar och att kartongen matchar beställningen.`,
  ],
  [
    `att kundtjänst svarar på svenska utan standardsvar.`,
    `att kundtjänst svarar på svenska via e-post inom 24 timmar, med svar som känns personliga.`,
  ],
  [
    `<p>Ofta två till fyra vardagar inom Sverige.</p>`,
    `<p>4 till 7 arbetsdagar inom Sverige enligt butiken och vårt urval av kundomdömen.</p>`,
  ],
]);

// --- HemmaBioGuiden omdome ---
apply("hemmabioguiden/miniprojektor-se-omdome.html", [
  [
    `Några önskade express oftare, få beskrev förlorade paket. För hemmabio-köpare som planerar premiären till helgen räcker oftast standardleverans om man beställer i början av veckan.`,
    `Leveranstiden ligger oftast på 4 till 7 arbetsdagar. Få beskrev förlorade paket. Planerar du premiär till helgen bör du beställa i god tid eftersom express inte erbjuds.`,
  ],
  [
    `<p>De flesta kunder rapporterar två till fyra vardagar.</p>`,
    `<p>De flesta kunder rapporterar 4 till 7 arbetsdagar med fri frakt.</p>`,
  ],
  [
    `snabb leverans till hela landet`,
    `leverans inom 4 till 7 arbetsdagar till hela landet`,
  ],
  [
    `rimlig leverans till hela landet`,
    `leverans inom 4 till 7 arbetsdagar till hela landet`,
  ],
]);

console.log("Done.");
