import fs from "node:fs/promises";
import path from "node:path";

// Only generated public destinations may be exposed through legacy redirects.
const slugs = JSON.parse(await fs.readFile("src/redirects.json", "utf8"));
const media = JSON.parse(await fs.readFile("src/image-map.json", "utf8"));
const photos = JSON.parse(await fs.readFile("src/photo-variants.json", "utf8"));
const entries = new Map(Object.entries(slugs));
for (const [source, image] of Object.entries(media)) {
	if (image?.src) entries.set(source, photos[image.src]?.src || image.src);
}
for (const [from, to] of entries) {
	if (
		!from.startsWith("/") ||
		!to.startsWith("/") ||
		to.startsWith("//") ||
		/\s/.test(from + to) ||
		/[\*:#?]/.test(from)
	)
		throw new Error("Invalid redirect");
	const target = path.resolve("dist", "." + decodeURIComponent(to));
	if (!target.startsWith(path.resolve("dist") + path.sep))
		throw new Error("Redirect escapes public output");
	const stat = await fs.stat(target);
	if (stat.isDirectory()) await fs.access(path.join(target, "index.html"));
}
const lines = [...entries]
	.sort(([a], [b]) => a.localeCompare(b))
	.map(([from, to]) => `${from} ${to} 301`);
if (lines.length > 2000 || lines.some((line) => line.length > 1000))
	throw new Error("Redirects exceed Cloudflare static hosting limits");
await fs.writeFile("dist/_redirects", lines.join("\n") + "\n");
await fs.writeFile(
	"dist/_headers",
	`/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/site.js
  Cache-Control: public, max-age=300

/search-index.json
  Cache-Control: public, max-age=300
`,
);
console.log(`Prepared ${entries.size} verified HTTP redirects.`);
