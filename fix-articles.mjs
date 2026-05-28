import { readFileSync, writeFileSync, readdirSync } from "fs";

for (const file of readdirSync(".").filter((f) => f.endsWith(".html") && f !== "index.html")) {
  let html = readFileSync(file, "utf8");
  if (!html.includes("art-wrap") || !html.includes("meta-bar")) continue;

  const reordered = html.replace(
    /(<h1>[\s\S]*?<p class="intro">[\s\S]*?<\/p>)\s*\n(<span class="pill[^"]*">[^<]+<\/span>)\s*\n(<div class="meta-bar">[\s\S]*?<\/div>)/,
    "$2\n$1\n$3"
  );
  if (reordered !== html) {
    writeFileSync(file, reordered);
    console.log("Fixed header order:", file);
  }
}
