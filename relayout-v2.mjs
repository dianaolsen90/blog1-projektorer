import { readFileSync, writeFileSync, readdirSync } from "fs";

const OLD_FONT =
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>';
const NEW_FONT =
  '<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>';

const MASTHEAD = `<div class="masthead"><div class="masthead-inner"><span>Oberoende projektorguider sedan 2023</span><span>Ingen reklam, inga sponsrade recensioner</span></div></div>
`;

const files = readdirSync(".").filter((f) => f.endsWith(".html") && !f.startsWith("_"));

for (const file of files) {
  let html = readFileSync(file, "utf8");
  html = html.replace(OLD_FONT, NEW_FONT);
  if (!html.includes('family=DM+Serif+Display') && html.includes("fonts.googleapis.com")) {
    html = html.replace(
      /<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet"\/>/,
      NEW_FONT
    );
  }
  if (!html.includes('class="masthead"')) {
    html = html.replace(/<body>\n/, `<body>\n${MASTHEAD}`);
  }
  writeFileSync(file, html);
  console.log("Updated:", file);
}

console.log("Done:", files.length, "files");
