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
		/[\r\n]/.test(from + to)
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
	.map(([from, to]) => `\t${JSON.stringify(from)} ${JSON.stringify(to)}`);
await fs.mkdir(".build", { recursive: true });
await fs.writeFile(
	".build/redirects.caddy",
	[
		"map {path} {archive_redirect} {",
		'\tdefault ""',
		...lines,
		"}",
		'@archive_redirect expression `{archive_redirect} != ""`',
		"redir @archive_redirect {archive_redirect} permanent",
		"",
	].join("\n"),
);
console.log(`Prepared ${entries.size} verified HTTP redirects.`);
