const toggle = document.querySelector(".mobile-toggle");
toggle?.addEventListener("click", () => {
	const open = document.querySelector("nav")?.classList.toggle("nav-open");
	toggle.setAttribute("aria-expanded", String(Boolean(open)));
});
const search = document.querySelector(".search-widget-handle .search");
search?.addEventListener("click", () => {
	const open = search.closest(".search-widget-handle").classList.toggle("open");
	search.setAttribute("aria-expanded", String(open));
	if (open) document.querySelector("#shapely-header-search input")?.focus();
});
// Match the justified rows used on ricos.site, keeping each photograph's ratio.
for (const album of document.querySelectorAll(".photo-album")) {
	const photos = [...album.querySelectorAll(".album-photo")];
	const layout = () => {
		const width = album.clientWidth;
		if (!width) return;
		const gap = width < 600 ? 8 : 12;
		const target = width < 600 ? 230 : 320;
		const ratios = photos.map((link) => {
			const img = link.querySelector("img");
			return (
				Number(img.getAttribute("width")) / Number(img.getAttribute("height"))
			);
		});
		const costs = Array(photos.length + 1).fill(Infinity);
		const previous = [];
		costs[0] = 0;
		for (let start = 0; start < photos.length; start++) {
			let ratio = 0;
			for (
				let count = 1;
				count <= Math.min(5, photos.length - start);
				count++
			) {
				ratio += ratios[start + count - 1];
				const height = (width - gap * (count - 1)) / ratio;
				const cost = costs[start] + (height - target) ** 2;
				if (cost < costs[start + count]) {
					costs[start + count] = cost;
					previous[start + count] = start;
				}
			}
		}
		const rows = [];
		for (let end = photos.length; end > 0; ) {
			const start = previous[end];
			rows.unshift([start, end]);
			end = start;
		}
		album.style.gap = `${gap}px`;
		for (const [start, end] of rows) {
			const sum = ratios.slice(start, end).reduce((a, b) => a + b, 0);
			const height = (width - gap * (end - start - 1)) / sum;
			for (let i = start; i < end; i++) {
				const w = Math.floor(height * ratios[i] * 100) / 100;
				photos[i].style.width = `${w}px`;
				photos[i].style.height = `${height}px`;
				photos[i].querySelector("img").sizes = `${Math.ceil(w)}px`;
			}
		}
	};
	new ResizeObserver(layout).observe(album);
	layout();
}
const imageLinks = [...document.querySelectorAll("a[data-lightbox]")];
if (imageLinks.length) {
	const dialog = document.createElement("dialog");
	dialog.className = "lightbox";
	dialog.setAttribute("aria-label", "Photo gallery");
	dialog.innerHTML =
		'<button class="lightbox-close" aria-label="Close photo"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button><button class="previous" aria-label="Previous photo">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="next" aria-label="Next photo">›</button>';
	document.body.append(dialog);
	let current = 0;
	let opener;
	const sizeImage = () => {
		const preview = imageLinks[current].querySelector("img");
		const ratio =
			Number(preview?.getAttribute("width")) /
				Number(preview?.getAttribute("height")) || 1;
		const padding = innerWidth <= 650 ? 72 : innerWidth <= 767 ? 84 : 140;
		const width = Math.min(innerWidth - padding, (innerHeight - 150) * ratio);
		dialog.querySelector("img").sizes = `${Math.max(1, Math.ceil(width))}px`;
	};
	const show = (index) => {
		current = (index + imageLinks.length) % imageLinks.length;
		const link = imageLinks[current];
		const image = dialog.querySelector("img");
		image.src = link.href;
		image.srcset = link.getAttribute("data-photo-srcset") || "";
		sizeImage();
		image.alt = link.querySelector("img")?.alt || link.title || "";
		dialog.querySelector("figcaption").textContent =
			link.getAttribute("data-envira-caption") || link.title || image.alt;
	};
	window.addEventListener("resize", () => {
		if (dialog.open) sizeImage();
	});
	imageLinks.forEach((link, index) =>
		link.addEventListener("click", (event) => {
			event.preventDefault();
			opener = link;
			show(index);
			dialog.showModal();
			document.documentElement.style.overflow = "hidden";
		}),
	);
	dialog
		.querySelector(".lightbox-close")
		.addEventListener("click", () => dialog.close());
	dialog
		.querySelector(".previous")
		.addEventListener("click", () => show(current - 1));
	dialog
		.querySelector(".next")
		.addEventListener("click", () => show(current + 1));
	dialog.addEventListener("keydown", (event) => {
		if (event.key === "ArrowLeft") show(current - 1);
		if (event.key === "ArrowRight") show(current + 1);
	});
	dialog.addEventListener("click", (event) => {
		if (
			event.target === dialog ||
			event.target === dialog.querySelector("figure")
		)
			dialog.close();
	});
	dialog.addEventListener("close", () => {
		document.documentElement.style.overflow = "";
		opener?.focus();
	});
}
for (const form of document.querySelectorAll('form[action="/search/"]')) {
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const words = new FormData(form).get("q") || "";
		location.assign("/search/#q=" + encodeURIComponent(words));
	});
}
const searchRoot = document.querySelector("[data-search-results]");
let searchIndex;
async function renderSearch() {
	const q =
		new URLSearchParams(location.hash.slice(1)).get("q") ||
		new URLSearchParams(location.search).get("q") ||
		"";
	const input = document.querySelector("#archive-search");
	input.value = q;
	try {
		if (!searchIndex) {
			const response = await fetch("/search-index.json");
			if (!response.ok) throw new Error("Search unavailable");
			searchIndex = await response.json();
		}
		const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
		const matches = words.length
			? searchIndex.filter((p) =>
					words.every((w) =>
						(p.title + " " + p.text).toLowerCase().includes(w),
					),
				)
			: [];
		searchRoot.textContent = "";
		const status = document.createElement("p");
		status.textContent = q
			? `${matches.length} results for “${q}”`
			: "Search the travel archive.";
		searchRoot.append(status);
		const list = document.createElement("ul");
		for (const result of matches) {
			const li = document.createElement("li");
			const heading = document.createElement("h2");
			const a = document.createElement("a");
			a.href = result.path;
			a.textContent = result.title;
			heading.append(a);
			const excerpt = document.createElement("p");
			excerpt.textContent = result.text.slice(0, 240) + "…";
			li.append(heading, excerpt);
			list.append(li);
		}
		searchRoot.append(list);
	} catch {
		searchRoot.textContent = "Search could not load. Please try again.";
	}
}
if (searchRoot) {
	window.addEventListener("hashchange", renderSearch);
	await renderSearch();
}
