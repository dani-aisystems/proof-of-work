// Assembles src/ into:
//   dist/index.html       standalone page (open locally, or deploy to Vercel / GitHub Pages)
//   dist/artifact.html    body-only version for publishing as a Claude artifact
//   private/artifact.html same, with src/profile.local.js baked in (only if that file exists; gitignored)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../src/${p}`, import.meta.url), "utf8");
const css = read("styles.css");
const content = read("content.js");
const app = read("app.js");

const page = (preset = "") => `<title>Proof of Work</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
${css}
</style>
<div id="app" class="app"></div>
<noscript><p style="padding:24px">Proof of Work needs JavaScript.</p></noscript>
${preset ? `<script>\n${preset}\n</script>\n` : ""}<script>
${content}
</script>
<script>
${app}
</script>
`;

const body = page();
const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${body}</body>
</html>
`;

mkdirSync(new URL("../dist/", import.meta.url), { recursive: true });
writeFileSync(new URL("../dist/index.html", import.meta.url), standalone);
writeFileSync(new URL("../dist/artifact.html", import.meta.url), body);
const presetPath = new URL("../src/profile.local.js", import.meta.url);
if (existsSync(presetPath)) {
  mkdirSync(new URL("../private/", import.meta.url), { recursive: true });
  writeFileSync(new URL("../private/artifact.html", import.meta.url), page(readFileSync(presetPath, "utf8")));
  console.log("Built private/artifact.html with your local profile");
}
console.log(`Built dist/index.html (${(standalone.length / 1024).toFixed(0)} KB) and dist/artifact.html`);
