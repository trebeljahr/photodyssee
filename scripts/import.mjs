import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { load } from "cheerio";
import TurndownService from "turndown";
import sharp from "sharp";

// Import only public rendered pages. The private WordPress archive never enters this tree.
sharp.concurrency(1);
const manifest = JSON.parse(await fs.readFile("import/manifest.json", "utf8"))
	.filter((p) => !p.path.includes("/feed/"))
	.sort((a, b) => {
		const order = [
			"/",
			"/gallery/",
			"/about-us/",
			"/portfolio/sri-lanka-adventure/",
		];
		return (
			(order.includes(a.path) ? order.indexOf(a.path) : 10) -
			(order.includes(b.path) ? order.indexOf(b.path) : 10)
		);
	});
const posts = JSON.parse(await fs.readFile("import/posts.json", "utf8"));
const base = "https://photodyssee.com";
const imageMap = new Map();
const cssMap = new Map();
const missingImages = [];
await fs.mkdir("public/assets", { recursive: true });
await fs.mkdir("src/layouts", { recursive: true });
const diskPath = (u) =>
	path.join("import/assets", decodeURIComponent(new URL(u, base).pathname));
const localPath = (u) => new URL(u, base).pathname;
const hash = (s) =>
	crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
const isOwn = (u) => {
	try {
		return ["photodyssee.com", "www.photodyssee.com"].includes(
			new URL(u, base).hostname,
		);
	} catch {
		return false;
	}
};
const exists = async (p) => {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
};
let originalBytes = 0,
	optimizedBytes = 0;
async function image(u) {
	if (!u || u.startsWith("data:") || !isOwn(u)) return null;
	const key = localPath(u);
	if (imageMap.has(key)) return imageMap.get(key);
	let file = diskPath(u);
	if (!(await exists(file))) {
		const dir = path.dirname(file),
			stem = path.basename(file, path.extname(file));
		const candidates = (await fs.readdir(dir)).filter(
			(f) => f.startsWith(stem + "-") && /\.(?:jpe?g|png|webp)$/i.test(f),
		);
		const ranked = await Promise.all(
			candidates.map(async (f) => {
				const file = path.join(dir, f);
				const metadata = await sharp(file).metadata();
				return { file, area: metadata.width * metadata.height };
			}),
		);
		ranked.sort((a, b) => b.area - a.area);
		if (!ranked[0]) {
			missingImages.push(key);
			imageMap.set(key, null);
			console.log("Source photo unavailable:", key);
			return null;
		}
		file = ranked[0].file;
		console.log(
			"Recovered missing original using preserved variant:",
			key,
			path.basename(file),
		);
	}
	const ext = path.extname(file).toLowerCase();
	const data = await fs.readFile(file);
	const id = hash(data);
	if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)) {
		const target = `/assets/${id}${ext}`;
		await fs.writeFile("public" + target, data);
		const result = { src: target };
		imageMap.set(key, result);
		return result;
	}
	const meta = await sharp(file).metadata();
	const widths = [640, 1280].filter((w) => w < meta.width);
	widths.push(Math.min(meta.width, 2400));
	const variants = [];
	for (const width of [...new Set(widths)]) {
		const target = `/assets/${id}-${width}.webp`;
		if (!(await exists("public" + target))) {
			try {
				await sharp(file)
					.rotate()
					.resize({ width, withoutEnlargement: true })
					.webp({ quality: 82, effort: 2 })
					.toFile("public" + target + ".tmp");
				await fs.rename("public" + target + ".tmp", "public" + target);
			} catch (error) {
				throw new Error("Image encode failed: " + key, { cause: error });
			}
		}
		variants.push({ src: target, width });
	}
	const result = {
		src: variants.at(-1).src,
		variants,
		width: meta.width,
		height: meta.height,
	};
	imageMap.set(key, result);
	originalBytes += data.length;
	optimizedBytes += (await fs.stat("public" + result.src)).size;
	return result;
}
async function css(u) {
	const key = localPath(u);
	if (cssMap.has(key)) return cssMap.get(key);
	const file = diskPath(u);
	if (!(await exists(file))) throw new Error("Missing CSS: " + key);
	let text = await fs.readFile(file, "utf8");
	const target = `/assets/style-${hash(text)}.css`;
	cssMap.set(key, target);
	for (const match of [...text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)]) {
		const raw = match[1];
		if (raw.startsWith("data:")) continue;
		const url = new URL(raw, new URL(u, base)).href;
		if (!isOwn(url)) continue;
		const src = diskPath(url);
		if (!(await exists(src))) throw new Error("Missing CSS asset: " + url);
		let replacement;
		if (/\.(?:woff2?|ttf|eot)$/i.test(localPath(url))) {
			const bytes = await fs.readFile(src);
			replacement = `/assets/${hash(bytes)}${path.extname(src)}`;
			await fs.writeFile("public" + replacement, bytes);
		} else replacement = (await image(url))?.src;
		if (replacement) text = text.replaceAll(match[0], `url("${replacement}")`);
	}
	// Imports are not needed: the source stores its font faces locally.
	await fs.writeFile("public" + target, text);
	return target;
}
const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-" });
const clearSelector =
	'script,iframe,.sharedaddy,.jetpack-likes-widget-wrapper,.jetpack-subscribe-widget,#comments,#respond,.comment-respond,.post-comments,.post-meta .comments-link,.likes-widget-placeholder,.sd-sharing-enabled,.jp-relatedposts,.footer-credits,link[rel="https://api.w.org/"],link[rel="EditURI"],link[rel="shortlink"],link[rel="alternate"],meta[name="generator"]';
async function clean($) {
	$(clearSelector).remove();
	$("#text-9,#search-4").remove();
	$(
		"link[rel=stylesheet][id^=envira],link[rel=stylesheet][id*=owl],link[rel=stylesheet][id*=flexslider]",
	).remove();
	$("*").each((_, el) => {
		for (const attr of Object.keys(el.attribs || {}))
			if (attr.startsWith("on")) $(el).removeAttr(attr);
	});
	$("form").each((_, el) => {
		const form = $(el);
		if (form.hasClass("search-form")) {
			form.attr("action", "/search/").attr("method", "get");
			form.find("[name=s]").attr("name", "q");
		} else form.remove();
	});
	$("a").each((_, el) => {
		const a = $(el);
		const href = a.attr("href");
		if (!href) return;
		if (/^(?:javascript:|data:)/i.test(href)) {
			a.removeAttr("href");
			return;
		}
		if (
			/(?:#(?:respond|comments)|replytocom=|share=|\/wp-(?:admin|login)|xmlrpc\.php)/i.test(
				href,
			)
		) {
			a.remove();
			return;
		}
		if (
			!href.startsWith("#") &&
			isOwn(href) &&
			!localPath(href).startsWith("/wp-")
		) {
			const url = new URL(href, base);
			const postId = Number(
				url.searchParams.get("p") || url.searchParams.get("page_id"),
			);
			const target = posts.find((p) => p.id === postId);
			a.attr(
				"href",
				target
					? new URL(target.url).pathname + url.hash
					: url.pathname + url.search + url.hash,
			);
		}
	});
	for (const el of $("img").toArray()) {
		const img = $(el);
		const src =
			img.attr("data-envira-src") || img.attr("data-src") || img.attr("src");
		if (!src || !isOwn(src)) {
			img.remove();
			continue;
		}
		const m = await image(src);
		if (!m) {
			img.replaceWith('<p class="archive-missing-photo">Photo unavailable</p>');
			continue;
		}
		img
			.attr("src", m.src)
			.removeAttr("srcset")
			.removeAttr("sizes")
			.removeAttr("data-envira-srcset")
			.removeAttr("data-envira-src")
			.removeAttr("data-src");
		if (m.variants) {
			img.attr(
				"srcset",
				m.variants.map((v) => `${v.src} ${v.width}w`).join(", "),
			);
			img.attr(
				"sizes",
				img.closest(".envira-gallery-public").length
					? "(max-width: 650px) 100vw, 50vw"
					: "(max-width: 767px) 100vw, 900px",
			);
			img.attr("width", m.width).attr("height", m.height);
		}
		img.attr("loading", "lazy").attr("decoding", "async");
	}
	for (const el of $("a[href]").toArray()) {
		const a = $(el),
			href = a.attr("href");
		if (
			isOwn(href) &&
			/\.(?:jpe?g|png|gif|webp|avif)$/i.test(localPath(href))
		) {
			const m = await image(href);
			if (m) a.attr("href", m.src).attr("data-lightbox", "");
			else a.replaceWith(a.html());
		}
	}
	for (const el of $("[data-image-src]").toArray()) {
		const e = $(el),
			m = await image(e.attr("data-image-src"));
		if (m) {
			e.attr(
				"style",
				`${e.attr("style") || ""};background-image:url('${m.src}')`,
			);
			e.removeAttr("data-image-src").removeAttr("data-parallax");
		}
	}
	for (const el of $("[style]").toArray()) {
		const e = $(el);
		let style = e.attr("style");
		for (const m of [...style.matchAll(/url\(["']?([^"')]+)["']?\)/g)]) {
			if (isOwn(m[1]) && !m[1].startsWith("/assets/")) {
				const optimized = await image(m[1]);
				if (optimized)
					style = style.replaceAll(m[0], `url('${optimized.src}')`);
			}
		}
		e.attr("style", style);
	}
	$(".envira-lazy").removeAttr("style");
	$(".envira-gallery-item").removeAttr("style");
	$(".envira-gallery-public")
		.attr("style", "")
		.removeClass("enviratope envira-gallery-css-animations");
	$(".envira-gallery-item").removeClass("envira-lazy-load enviratope-item");
	$(".envira-gallery-position-overlay").remove();
	for (const el of $('link[rel="stylesheet"]').toArray())
		$(el).attr("href", await css($(el).attr("href")));
	for (const el of $('link[rel*="icon"]').toArray()) {
		const m = await image($(el).attr("href"));
		if (m) $(el).attr("href", m.src);
	}
	$(
		'meta[property="og:image"],meta[name="twitter:image"],meta[name="msapplication-TileImage"]',
	).remove();
	// Disabled interaction traces must not survive as inert-looking controls.
	$(".post-meta").find('a[href*="#comment"]').remove();
}
const routes = [];
for (const page of manifest) {
	const raw = await fs.readFile("import/pages/" + page.file, "utf8");
	if (!raw.includes("<html")) continue;
	const $ = load(raw);
	await clean($);
	const meta = posts.find((p) => new URL(p.url).pathname === page.path);
	const title = $("title").text();
	const name =
		page.path === "/"
			? "home"
			: page.path.replace(/^\/+|\/+$/g, "").replaceAll("/", "__");
	const entry = $(".entry-content").length === 1 ? $(".entry-content") : null;
	let markdown;
	if (entry) {
		markdown = entry
			.contents()
			.toArray()
			.map((el) => {
				if (el.type === "text") return $(el).text().trim();
				if (el.type === "comment") return "";
				const e = $(el);
				// Keep image/gallery wrappers and their crops; ordinary prose remains Markdown.
				if (
					[
						"p",
						"h1",
						"h2",
						"h3",
						"h4",
						"h5",
						"h6",
						"ul",
						"ol",
						"blockquote",
						"hr",
					].includes(el.tagName) &&
					!e.find("img,div,figure,iframe").length &&
					!e.attr("style")
				)
					return td.turndown($.html(el));
				return $.html(el);
			})
			.filter(Boolean)
			.join("\n\n");
		entry.html("<!--CONTENT-->");
	} else {
		markdown = $("#content").html() || "";
		$("#content").html("<!--CONTENT-->");
	}
	$("head").append(
		'<link rel="stylesheet" href="/site.css"><script type="module" src="/site.js"></script>',
	);
	$("html").attr("lang", "en");
	const data = {
		title,
		path: page.path,
		date: meta?.date || "",
		type: meta?.type || "archive",
		layout: name + ".html",
	};
	await fs.writeFile(
		"content/" + name + ".md",
		"---\n" +
			Object.entries(data)
				.map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
				.join("\n") +
			"\n---\n\n" +
			markdown +
			"\n",
	);
	await fs.writeFile("src/layouts/" + name + ".html", $.html());
	routes.push(data);
	console.log("Imported", routes.length, page.path);
}
await fs.writeFile("src/routes.json", JSON.stringify(routes, null, 2));
await fs.writeFile(
	"src/image-map.json",
	JSON.stringify(
		Object.fromEntries(
			[...imageMap].map(([url, value]) => [
				url,
				value && { src: value.src, width: value.width, height: value.height },
			]),
		),
		null,
		2,
	),
);
await fs.writeFile(
	"src/missing-images.json",
	JSON.stringify(missingImages, null, 2),
);
await fs.writeFile(
	"src/import-stats.json",
	JSON.stringify(
		{
			routes: routes.length,
			images: imageMap.size,
			originalBytes,
			optimizedBytes,
		},
		null,
		2,
	),
);
console.log({
	routes: routes.length,
	images: imageMap.size,
	originalBytes,
	optimizedBytes,
});
