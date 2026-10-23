# Photodyssee

Static preservation of the Photodyssee travel journal and photography. Original page URLs, prose, photos, captions, and Shapely presentation are retained. Comments, forms, trackers, and the WordPress runtime are retired in the preview.

## Build and preview

Requires Node 24 or newer.

```sh
npm ci
npm run build
npm run check
npm run preview
```

The preview binds to `127.0.0.1` on a free port. Set `PORT` when a specific port is needed. Deploy `dist/` using any static web server. Production cutover and retirement of the live source require review of this preview.

## Content

- `content/*.md`: published content, with title, original URL, date, type, and layout in frontmatter. Ordinary prose uses Markdown. Complex image wrappers retain HTML to preserve the original layout.
- `src/layouts/`: static page frames, with a content slot. These preserve the original navigation, sidebar, and footer.
- `public/assets/`: self-hosted fonts, original theme CSS, and generated responsive WebP images. No remote image service is required at runtime.
- `public/site.js`: native gallery lightbox, mobile navigation, and search. Search uses a generated public content index.
- `scripts/import.mjs`: one-time importer for public rendered WordPress snapshots and referenced public assets. It does not read a database or import comments, drafts, users, credentials, or PHP source.
- `import/`: ignored migration inputs. The normal build works without these files. Private full backups live separately and must never enter this repository or `dist/`.

The original import creates WebP variants up to 2400 pixels. `npm run prepare-photos` upgrades undersized WordPress derivatives and gallery photos from the locally imported originals, with responsive variants up to 3840 pixels at WebP quality 90. It never enlarges source images. The checked-in `src/photo-variants.json` and public assets make normal builds independent of the import folder. Run photo preparation after a fresh import, then build and check.

The gallery uses justified rows with each photo’s original aspect ratio, following the layout on ricos.site. Native lightboxes choose an image size for the viewport and display density. Journal previews and related articles use unified photo/text blocks; ordinary article photos retain their original captions and writing.

## Hosting

`dist/` contains only public static files. Serve directory indexes, return the static `404.html` for missing paths, enable compression for HTML/CSS/JS/JSON, and cache content-hashed `/assets/` files for one year. Cache HTML briefly so new deploys appear promptly. No Node, PHP, database, scheduled task, or write access is needed on the public web server.

Keep the original `photodyssee.com` canonical URLs when reviewing on a temporary hostname. Do not point production DNS at the preview until the visual review is complete.

## Rights and dependencies

Original writing and photography retain their existing rights. This migration grants no new license to that content. The preserved theme and font assets retain their original licenses and attribution; see `THIRD_PARTY_NOTICES.md`. Build dependencies are pinned in `package-lock.json` and are not shipped to the web server.

## Migration record

The import retains 44 published posts/pages and 22 author, tag, category, and pagination pages. Four former post slugs are recorded in `src/redirects.json`, verified against WordPress’s saved slug history. Generated alias pages keep old bookmarks usable on a plain static host. Configure HTTP 301 redirects for these paths when deploying behind Nginx.

`src/image-map.json` maps the former public media URLs to the generated images. Use this mapping for media redirects at cutover. Four source portfolio photos were already missing from the original upload tree; their URLs are listed in `src/missing-images.json`. The preview labels them “Photo unavailable.” A fifth old link was recovered from the highest-resolution numbered copy on the source server.

The one-time importer overwrites content. Review the privacy page and any manual changes before re-importing. After import, build, prune unused generated variants with `npm run prune-assets`, then rebuild and check. The ordinary build needs only the checked-in content, layouts, and public assets.
