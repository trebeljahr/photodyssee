import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { load } from "cheerio";
const md = new MarkdownIt({ html: true, linkify: false });
const redirects = JSON.parse(await fs.readFile("src/redirects.json", "utf8"));
await fs.rm("dist", { recursive: true, force: true });
await fs.cp("public", "dist", { recursive: true });
const search = [];
const paths = [];
let home;
for (const file of (await fs.readdir("content"))
	.filter((f) => f.endsWith(".md"))
	.sort()) {
	const { data, content } = matter(
		await fs.readFile("content/" + file, "utf8"),
	);
	if (!/^\/(?:[A-Za-z0-9_\-/%]+\/)*$/.test(data.path))
		throw new Error("Invalid output path: " + data.path);
	const layout = await fs.readFile(
		"src/layouts/" + path.basename(data.layout),
		"utf8",
	);
	if (!layout.includes("<!--CONTENT-->"))
		throw new Error("Missing content slot " + file);
	const $ = load(layout.replace("<!--CONTENT-->", md.render(content)));
	$("title").text(data.title);
	$("#text-9,#search-4").remove();
	$("a[href]").each((_, element) => {
		const anchor = $(element);
		const href = anchor.attr("href");
		if (href.startsWith("#")) return;
		const url = new URL(href, "https://photodyssee.com");
		if (url.hostname === "photodyssee.com" && redirects[url.pathname]) {
			anchor.attr("href", redirects[url.pathname] + url.search + url.hash);
		}
	});
	const destination = path.join("dist", data.path, "index.html");
	await fs.mkdir(path.dirname(destination), { recursive: true });
	await fs.writeFile(destination, $.html());
	paths.push(data.path);
	if (data.path === "/") home = $.html();
	if (
		data.type === "post" ||
		["/about-us/", "/gallery/", "/portfolio/sri-lanka-adventure/"].includes(
			data.path,
		)
	)
		search.push({
			title:
				$(".entry-title").first().text().trim() ||
				data.title.replace(/ – Photodyssee$/, ""),
			path: data.path,
			text: $(".entry-content").text().replace(/\s+/g, " ").trim(),
		});
}
const $ = load(home);
$("title").text("Search – Photodyssee");
$("link[rel=canonical]").attr("href", "https://photodyssee.com/search/");
$("#content").html(
	'<main class="search-results"><h1>Search</h1><form action="/search/" method="get"><label for="archive-search">Search the travel archive</label><input id="archive-search" name="q" type="search"><button type="submit" class="btn btn-filled">Search</button></form><div data-search-results></div></main>',
);
await fs.mkdir("dist/search", { recursive: true });
await fs.writeFile("dist/search/index.html", $.html());
paths.push("/search/");
for (const [from, to] of Object.entries(redirects)) {
	if (!paths.includes(to)) throw new Error("Redirect target is missing: " + to);
	const destination = path.join("dist", from, "index.html");
	await fs.mkdir(path.dirname(destination), { recursive: true });
	await fs.writeFile(
		destination,
		`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="https://photodyssee.com${to}"><title>Photodyssee</title><body><p><a href="${to}">Continue to Photodyssee</a></p></body></html>`,
	);
}
await fs.writeFile("dist/search-index.json", JSON.stringify(search));
await fs.writeFile(
	"dist/sitemap.xml",
	'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
		paths
			.map((p) => `<url><loc>https://photodyssee.com${p}</loc></url>`)
			.join("") +
		"</urlset>",
);
await fs.writeFile(
	"dist/robots.txt",
	"User-agent: *\nAllow: /\nSitemap: https://photodyssee.com/sitemap.xml\n",
);
await fs.writeFile(
	"dist/404.html",
	'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Page not found – Photodyssee</title><body><h1>Page not found</h1><p><a href="/">Photodyssee</a> · <a href="/travel-blog/">Travel blog</a> · <a href="/gallery/">Gallery</a></p></body></html>',
);
await fs.writeFile(
	"src/build-stats.json",
	JSON.stringify(
		{
			pages: paths.length,
			redirects: Object.keys(redirects).length,
			searchEntries: search.length,
		},
		null,
		2,
	),
);
console.log(
	`Built ${paths.length} static pages; ${search.length} search entries.`,
);
