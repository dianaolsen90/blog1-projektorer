import { readFileSync, writeFileSync, readdirSync } from "fs";

const OLD_TAGLINE =
  "Oberoende blogg om elektronik, projektorer och smarta hem. Guider, tester och tips från erfarna experter.";
const NEW_TAGLINE =
  "Vi granskar, testar och förklarar konsumentelektronik utan reklamlöften. Alla produkter köps med egna medel och testas i verkliga hem.";

const REPLACEMENTS = [
  [
    '<li><a href="minilux-pro-test.html">MiniLux Pro test</a></li>',
    '<li><a href="minilux-pro-test.html">MiniLux Pro recension</a></li>',
  ],
  [
    '<li><a href="minilux-pro-2-test.html">MiniLux Pro 2 test</a></li>',
    '<li><a href="minilux-pro-2-test.html">MiniLux Pro 2 recension</a></li>',
  ],
  [
    '<li><a href="minilux-vs-pro.html">MiniLux Pro vs MiniLux Pro 2: vilken ska du välja 2026?</a></li>',
    '<li><a href="minilux-vs-pro.html">MiniLux Pro vs MiniLux Pro 2</a></li>',
  ],
  [
    '<li><a href="minilux-vs-pro.html">MiniLux vs MiniLux Pro</a></li>',
    '<li><a href="minilux-vs-pro.html">MiniLux Pro vs MiniLux Pro 2</a></li>',
  ],
];

for (const file of readdirSync(".").filter((f) => f.endsWith(".html"))) {
  let html = readFileSync(file, "utf8");
  const before = html;
  if (html.includes(OLD_TAGLINE)) {
    html = html.split(OLD_TAGLINE).join(NEW_TAGLINE);
  }
  for (const [from, to] of REPLACEMENTS) {
    html = html.split(from).join(to);
  }
  if (html !== before) {
    writeFileSync(file, html, "utf8");
    console.log("Updated", file);
  }
}

for (const script of ["redesign.mjs", "update-teknikpuls.mjs"]) {
  let src = readFileSync(script, "utf8");
  const before = src;
  if (src.includes(OLD_TAGLINE)) {
    src = src.split(OLD_TAGLINE).join(NEW_TAGLINE);
  }
  for (const [from, to] of REPLACEMENTS) {
    src = src.split(from).join(to);
  }
  src = src.replace(
    '<li><a href="minilux-vs-pro.html">${COMPARISON_TITLE}</a></li>',
    '<li><a href="minilux-vs-pro.html">MiniLux Pro vs MiniLux Pro 2</a></li>'
  );
  if (src !== before) {
    writeFileSync(script, src, "utf8");
    console.log("Updated", script);
  }
}

console.log("Done.");
