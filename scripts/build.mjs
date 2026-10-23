import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { load } from "cheerio";
const md = new MarkdownIt({ html: true, linkify: false });
const redirects = JSON.parse(await fs.readFile("src/redirects.json", "utf8"));
const photoVariants = JSON.parse(
	await fs.readFile("src/photo-variants.json", "utf8"),
);
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
	// Keep shared navigation consistent across all preserved page layouts.
	$("#menu").html(
		[
			["/travel-blog/", "Blog"],
			["/gallery/", "Gallery"],
			["/about-us/", "About us"],
		]
			.map(
				([href, label]) =>
					`<li class="menu-item${data.path === href ? " current-menu-item active" : ""}"><a href="${href}"${data.path === href ? ' aria-current="page"' : ""}>${label}</a></li>`,
			)
			.join(""),
	);
	$(".custom-logo-link").prepend(
		'<img class="brand-icon" src="/assets/87e7d51a8cca7d85-192.webp" width="40" height="40" alt="">',
	);
	$(".mobile-toggle").html(
		'<svg class="menu-icon" viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path class="menu-line menu-line-top" d="M6 9h20"/><path class="menu-line menu-line-middle" d="M6 16h20"/><path class="menu-line menu-line-bottom" d="M6 23h20"/></svg>',
	);
	$("#colophon").html(
		'<div class="container archive-footer"><nav aria-label="Footer"><a href="/imprint/">Imprint</a><span aria-hidden="true">·</span><a href="/privacy-policy/">Privacy Policy</a></nav><a class="archive-back-top" href="#page" aria-label="Back to top">Back to top</a></div>',
	);
	$(".footer-callout,.shapely-carousel-navigation").remove();
	$(".shapely-related-posts .owlCarousel")
		.removeAttr("class")
		.addClass("related-grid");
	$(".related-item-thumbnail").removeAttr("style");
	$(".related-grid .item").each((_, element) => {
		const item = $(element);
		const thumbnail = item.find(".related-item-thumbnail");
		const title =
			thumbnail.attr("aria-label") ||
			item.find(".shapely-related-post-title").text().trim();
		const link = $('<a class="related-article-link"></a>').attr(
			"href",
			thumbnail.attr("href"),
		);
		link.append(thumbnail.find("img").clone().attr("alt", ""));
		link.append($('<h4 class="related-article-title"></h4>').text(title));
		item.removeAttr("class").addClass("related-article").empty().append(link);
	});
	$(".related-grid > .related-article").slice(3).remove();
	$(".post-grid-small,.post-grid-wide")
		.filter((_, element) => !$(element).closest("body.single-post").length)
		.each((_, element) => {
			const card = $(element).addClass("journal-card");
			card.parent().addClass("journal-grid");
			card
				.find(".shapely-category")
				.removeClass("shapely-category")
				.addClass("journal-category")
				.prependTo(card.find(".entry-content").first());
			card.find(".more-link").each((_, element) => {
				const button = $(element);
				button.find(".meta-nav").remove();
				button.appendTo(card.find(".entry-content").first());
			});
		});
	$("img").each((_, element) => {
		const img = $(element);
		const photo = photoVariants[img.attr("src")];
		if (!photo) return;
		img
			.attr("src", photo.src)
			.attr(
				"srcset",
				photo.variants.map((v) => `${v.src} ${v.width}w`).join(", "),
			)
			.attr("width", photo.width)
			.attr("height", photo.height);
	});
	$(".journal-card img").attr(
		"sizes",
		"(max-width: 767px) calc(100vw - 48px), 360px",
	);
	$(".related-article img").attr(
		"sizes",
		"(max-width: 600px) calc(100vw - 50px), (max-width: 991px) 350px, 240px",
	);
	$("a[data-lightbox]").each((_, element) => {
		const link = $(element);
		const photo = photoVariants[link.attr("href")];
		if (photo)
			link
				.attr("href", photo.src)
				.attr(
					"data-photo-srcset",
					photo.variants.map((v) => `${v.src} ${v.width}w`).join(", "),
				);
	});
	if (data.path === "/gallery/") {
		$("body").addClass("photo-archive");
		const album = $(
			'<div class="photo-album" aria-label="Travel photographs"></div>',
		);
		$(".envira-gallery-link").each((index, element) => {
			const old = $(element);
			const photo =
				photoVariants[old.find("img").attr("src")] ||
				Object.values(photoVariants).find((p) => p.src === old.attr("href"));
			const img = old.find("img").clone().removeAttr("class id style");
			if (photo)
				img
					.attr("src", photo.src)
					.attr(
						"srcset",
						photo.variants.map((v) => `${v.src} ${v.width}w`).join(", "),
					)
					.attr("width", photo.width)
					.attr("height", photo.height);
			img.attr("sizes", "(max-width: 600px) calc(100vw - 48px), 550px");
			const link = $('<a class="album-photo" data-lightbox></a>')
				.attr("href", photo?.src || old.attr("href"))
				.attr("title", old.attr("title"))
				.attr("data-envira-caption", old.attr("data-envira-caption") || "")
				.attr("aria-label", "Open photo: " + (old.attr("title") || index + 1));
			link.attr("data-photo-srcset", img.attr("srcset") || "").append(img);
			album.append(link);
		});
		$(".envira-gallery-wrap").first().replaceWith(album);
		$("noscript").remove();
	}
	$(".projects .image-tile").removeClass("inner-title hover-reveal");
	if (data.type === "post" || data.path === "/about-us/") {
		$(".entry-content img, article > .entry-header img").each(
			(index, element) => {
				const img = $(element);
				let link = img.closest("a");
				if (
					link.length &&
					!link.is("[data-lightbox]") &&
					link.attr("href") !== data.path
				)
					return;
				const caption =
					img
						.closest("figure,.wp-caption")
						.find("figcaption,.wp-caption-text")
						.text()
						.trim() ||
					img.attr("alt") ||
					"";
				const src =
					(img.attr("srcset") || "")
						.split(",")
						.map((entry) => entry.trim().split(/\s+/))
						.filter((entry) => entry[0])
						.sort(
							(a, b) => parseInt(b[1] || "0") - parseInt(a[1] || "0"),
						)[0]?.[0] || img.attr("src");
				if (!link.length) {
					img.wrap('<a class="photo-link"></a>');
					link = img.parent();
				}
				link
					.attr("href", src)
					.attr("data-lightbox", "")
					.attr("data-photo-srcset", img.attr("srcset") || "")
					.attr("data-envira-caption", caption)
					.attr(
						"aria-label",
						"Open photo" + (caption ? ": " + caption : " " + (index + 1)),
					);
			},
		);
	}

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
