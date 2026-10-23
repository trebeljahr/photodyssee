import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { load } from "cheerio";

// Upgrade only undersized WordPress derivatives and gallery photographs.
// Originals remain local import material; the build uses the prepared public assets.
sharp.concurrency(1);
const map = JSON.parse(await fs.readFile("src/image-map.json", "utf8"));
const gallery = load(await fs.readFile("content/gallery.md", "utf8"));
const gallerySources = new Set(
	gallery("a[data-lightbox]")
		.toArray()
		.map((e) => gallery(e).attr("href")),
);
const upgrades = {};
const prepared = new Map();
const unavailable = [];
for (const [source, old] of Object.entries(map)) {
	if (!old?.width || old.width < 300 || !/\.(jpe?g|png|webp)$/i.test(source))
		continue;
	const original = source.replace(/-\d+x\d+(?=\.[^.]+$)/, "");
	if (original === source && !gallerySources.has(old.src)) continue;
	let file = path.join("import/assets", original);
	try {
		await fs.access(file);
	} catch {
		if (original !== source) unavailable.push(original);
		continue;
	}
	const metadata = await sharp(file).metadata();
	if (metadata.width <= old.width && !gallerySources.has(old.src)) continue;
	let photo = prepared.get(file);
	if (!photo) {
		const data = await fs.readFile(file);
		const id = crypto
			.createHash("sha256")
			.update(data)
			.digest("hex")
			.slice(0, 16);
		const oriented = metadata.autoOrient || metadata;
		const width = oriented.width;
		const height = oriented.height;
		const widths = [
			...new Set(
				[640, 1280, 1920, Math.min(width, 3840)].filter((w) => w <= width),
			),
		].sort((a, b) => a - b);
		const variants = [];
		for (const size of widths) {
			const src = `/assets/${id}-photo-${size}.webp`;
			try {
				await fs.access("public" + src);
			} catch {
				await sharp(file)
					.rotate()
					.resize({ width: size, withoutEnlargement: true })
					.webp({ quality: 90, effort: 3 })
					.toFile("public" + src);
			}
			variants.push({ src, width: size });
		}
		photo = { src: variants.at(-1).src, width, height, variants };
		prepared.set(file, photo);
		console.log(`Prepared photograph ${prepared.size}: ${path.basename(file)}`);
	}
	upgrades[old.src] = photo;
}
await fs.writeFile(
	"src/photo-variants.json",
	JSON.stringify(upgrades, null, 2) + "\n",
);
await fs.writeFile(
	"import/missing-photo-originals.json",
	JSON.stringify([...new Set(unavailable)], null, 2) + "\n",
);
console.log(
	`Prepared ${prepared.size} originals; upgraded ${Object.keys(upgrades).length} image references. ${new Set(unavailable).size} originals are not imported.`,
);
