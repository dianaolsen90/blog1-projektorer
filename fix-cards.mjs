import { readFileSync, writeFileSync } from "fs";

let html = readFileSync("index.html", "utf8");
html = html.replace(
  /(<div class="card-auth"><div class="av-xs[^"]*">[^<]+<\/div>)<\/div> ([^<]+)<\/div><span>[^<]+<\/span><\/div>/g,
  "$1 $2</div></div>"
);
writeFileSync("index.html", html);
console.log("Fixed card-foot markup");
