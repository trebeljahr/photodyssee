import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
const used = new Set();
const add = (ref) => {
	if (ref?.startsWith("/assets/")) used.add(ref.split(/[?#]/)[0]);
};
const urls = (text) => {
	for (const m of text.matchAll(/url\(["']?([^"')]+)["']?\)/g)) add(m[1]);
};
async function scan(dir) {
	for (const e of await fs.readdir(dir, { withFileTypes: true })) {
		const f = path.join(dir, e.name);
		if (e.isDirectory()) await scan(f);
		else if (f.endsWith(".html")) {
			const $ = load(await fs.readFile(f, "utf8"));
			$("[src],[href]").each((_, e) => {
				add($(e).attr("src"));
				add($(e).attr("href"));
			});
			$("img[srcset]").each((_, e) => {
				for (const part of $(e).attr("srcset").split(","))
					add(part.trim().split(/\s+/)[0]);
			});
			$("[style],style").each((_, e) =>
				urls($(e).attr("style") || $(e).text()),
			);
		}
	}
}
await scan("dist");
const seen = new Set();
while ([...used].some((u) => !seen.has(u))) {
	for (const ref of [...used]) {
		if (seen.has(ref)) continue;
		seen.add(ref);
		if (ref.endsWith(".css")) urls(await fs.readFile("public" + ref, "utf8"));
	}
}
let removed = 0,
	bytes = 0;
for (const file of await fs.readdir("public/assets")) {
	if (!used.has("/assets/" + file)) {
		const f = "public/assets/" + file;
		bytes += (await fs.stat(f)).size;
		await fs.unlink(f);
		removed++;
	}
}
console.log({ retained: used.size, removed, removedBytes: bytes });
