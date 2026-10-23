import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
const files = [];
async function walk(dir) {
	for (const e of await fs.readdir(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) await walk(p);
		else files.push(p);
	}
}
await walk("dist");
const errors = [];
let pages = 0,
	images = 0;
const external = new Set();
async function checkRef(ref, from) {
	if (!ref || ref.startsWith("#") || /^(data:|mailto:|tel:)/.test(ref)) return;
	let u;
	try {
		u = new URL(ref, "https://photodyssee.com" + from.replace(/^dist/, ""));
	} catch {
		errors.push(`${from}: invalid URL ${ref}`);
		return;
	}
	if (u.hostname !== "photodyssee.com") {
		external.add(u.origin);
		return;
	}
	if (!u.pathname.startsWith("/")) return;
	let p = path.join("dist", decodeURIComponent(u.pathname));
	try {
		const st = await fs.stat(p);
		if (st.isDirectory()) await fs.access(path.join(p, "index.html"));
	} catch {
		errors.push(`${from}: missing ${u.pathname}`);
	}
}
for (const file of files) {
	if (/\.(php|sql|env|gz|tar|zip|tmp|download|failed)$/i.test(file))
		errors.push("Private/runtime file in output: " + file);
	if (file.endsWith(".html")) {
		pages++;
		const source = await fs.readFile(file, "utf8");
		const $ = load(source);
		if (
			$("script[src]").filter((_, e) => $(e).attr("src") !== "/site.js").length
		)
			errors.push(file + ": legacy script");
		if ($("form").filter((_, e) => $(e).attr("action") !== "/search/").length)
			errors.push(file + ": live form");
		if ($("iframe,#respond,#comments,input[type=password]").length)
			errors.push(file + ": dynamic/private UI");
		for (const el of $(
			"img,script[src],link[rel=stylesheet],link[rel*=icon],a[href]",
		).toArray()) {
			const e = $(el);
			const ref = e.attr(
				el.tagName === "img" || el.tagName === "script" ? "src" : "href",
			);
			await checkRef(ref, file);
			if (el.tagName === "img") {
				images++;
				if (!e.attr("alt") && e.attr("alt") !== "")
					errors.push(file + ": image missing alt");
				for (const entry of (e.attr("srcset") || "").split(",")) {
					if (entry.trim()) await checkRef(entry.trim().split(/\s+/)[0], file);
				}
			}
		}
		for (const el of $("[style]").toArray())
			for (const m of $(el)
				.attr("style")
				.matchAll(/url\(["']?([^"')]+)["']?\)/g))
				await checkRef(m[1], file);
	}
	if (file.endsWith(".css")) {
		const text = await fs.readFile(file, "utf8");
		for (const m of text.matchAll(/url\(["']?([^"')]+)["']?\)/g))
			await checkRef(m[1], file);
	}
}
console.log(
	JSON.stringify(
		{
			pages,
			images,
			files: files.length,
			externalOrigins: [...external].sort(),
			errors: errors.length,
		},
		null,
		2,
	),
);
if (errors.length) {
	console.error([...new Set(errors)].join("\n"));
	process.exitCode = 1;
}
