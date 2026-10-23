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
const imageLinks = [...document.querySelectorAll("a[data-lightbox]")];
if (imageLinks.length) {
	const dialog = document.createElement("dialog");
	dialog.className = "lightbox";
	dialog.setAttribute("aria-label", "Photo gallery");
	dialog.innerHTML =
		'<button class="close" aria-label="Close photo">×</button><button class="previous" aria-label="Previous photo">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="next" aria-label="Next photo">›</button>';
	document.body.append(dialog);
	let current = 0;
	let opener;
	const show = (index) => {
		current = (index + imageLinks.length) % imageLinks.length;
		const link = imageLinks[current];
		const image = dialog.querySelector("img");
		image.src = link.href;
		image.alt = link.querySelector("img")?.alt || link.title || "";
		dialog.querySelector("figcaption").textContent =
			link.getAttribute("data-envira-caption") || link.title || image.alt;
	};
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
		.querySelector(".close")
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
