import fs from "node:fs/promises";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import TurndownService from "turndown";
import { load } from "cheerio";
const md = new MarkdownIt({ html: true });
const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-" });
td.keep("span");
let count = 0;
for (const file of (await fs.readdir("content")).filter((f) =>
	f.endsWith(".md"),
)) {
	const raw = await fs.readFile("content/" + file, "utf8");
	const { data, content } = matter(raw);
	if (data.type === "archive" || data.path === "/") continue;
	const layout = await fs.readFile("src/layouts/" + data.layout, "utf8");
	const $ = load(layout.replace("<!--CONTENT-->", md.render(content)));
	const target = $(".shapely-content");
	if (target.length !== 1) continue;
	// The old editor wraps much prose in black spans. Carry that color on the frame.
	const black = target
		.find("span[style]")
		.filter((_, e) =>
			/^color:\s*(?:#000000|#000|black);?\s*$/i.test($(e).attr("style")),
		);
	if (black.length) {
		target.attr("style", (target.attr("style") || "") + ";color:#000");
		black.each((_, e) => $(e).replaceWith($(e).html()));
	}
	const markdown = target
		.contents()
		.toArray()
		.map((el) => {
			if (el.type === "text") return $(el).text().trim();
			if (el.type === "comment") return "";
			const e = $(el);
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
	target.html("<!--CONTENT-->");
	await fs.writeFile("src/layouts/" + data.layout, $.html());
	await fs.writeFile(
		"content/" + file,
		matter.stringify(markdown + "\n", data),
	);
	count++;
}
console.log("Normalized Markdown prose in", count, "pages.");
