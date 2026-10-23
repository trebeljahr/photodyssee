import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist");
const types = {
	".html": "text/html; charset=utf-8",
	".css": "text/css",
	".js": "text/javascript",
	".json": "application/json",
	".webp": "image/webp",
	".jpg": "image/jpeg",
	".png": "image/png",
	".svg": "image/svg+xml",
	".woff2": "font/woff2",
	".woff": "font/woff",
	".xml": "application/xml",
};
const server = http.createServer(async (req, res) => {
	try {
		const requestUrl = new URL(req.url, "http://localhost");
		if (requestUrl.pathname === "/__preview/mobile") {
			const route = requestUrl.searchParams.get("path") || "/";
			if (!/^\/[a-zA-Z0-9_\-/%]*$/.test(route))
				throw new Error("Invalid preview route");
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(
				'<!doctype html><html lang="en"><meta name="viewport" content="width=device-width"><title>Photodyssee mobile preview</title><body style="margin:0;background:#ddd;display:flex;justify-content:center;padding:20px"><iframe title="Mobile preview" src="' +
					route +
					'" style="width:390px;height:660px;border:0;background:white;box-shadow:0 3px 20px #0003"></iframe></body></html>',
			);
			return;
		}
		let pathname = decodeURIComponent(requestUrl.pathname);
		let file = path.resolve(root, "." + pathname);
		if (!file.startsWith(root + path.sep) && file !== root)
			throw new Error("Invalid path");
		if ((await fs.stat(file)).isDirectory())
			file = path.join(file, "index.html");
		const body = await fs.readFile(file);
		res.writeHead(200, {
			"Content-Type": types[path.extname(file)] || "application/octet-stream",
			"X-Content-Type-Options": "nosniff",
		});
		res.end(body);
	} catch {
		res.writeHead(404, { "Content-Type": "text/html" });
		res.end(await fs.readFile(path.join(root, "404.html")));
	}
});
server.listen(Number(process.env.PORT) || 0, "127.0.0.1", () =>
	console.log(`Photodyssee preview: http://127.0.0.1:${server.address().port}`),
);
