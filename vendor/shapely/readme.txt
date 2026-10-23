/*========= About Theme =========*/

Theme Name: Shapely
Theme URI: https://colorlib.com/wp/themes/shapely/
Version: 1.3.7

Requires at least: 6.4
Tested up to: 7.1
Requires PHP: 7.4

Author: Colorlib
Author URI: https://colorlib.com
License: GNU General Public License v3
License URI: http://www.gnu.org/licenses/gpl-3.0.html
-------------------------------------------------------
Shapely theme, Copyright 2016-2026 colorlib.com
Shapely WordPress theme is distributed under the terms of the GNU GPL
Shapely is based on Underscores http://underscores.me/, (C) 2012-2025 Automattic, Inc.
-------------------------------------------------------

== Description ==

Shapely is a powerful and versatile one page WordPress theme with pixel perfect design and outstanding functionality. It is by far the most advanced free WordPress theme available today with loads of unmatched customization options. This theme comes with several homepage widgets that can be used to add portfolio, testimonials, parallax sections, your product or service information, call for action and much more.

Shapely supports most free and premium WordPress plugins such as WooCommerce, Jetpack, Kali Forms, Gravity Forms, Contact Form 7, Yoast SEO, Google Analytics by Yoast and much more.

This theme is the best suited for business, landing page, portfolio, ecommerce, store, local business,  personal websites but can be tweaked to be used as blog, magazine or any other awesome website while highlighting its unique one page setup. This is going to be the last WordPress theme you will ever want to use because it is so much better than anything you have seen. We promise.

== Installation ==

1. In your admin panel, go to Appearance > Themes and click the Add New button.
2. Click Upload and Choose File, then select the theme's .zip file. Click Install Now.
3. Click Activate to use your new theme right away.

For more detailed Shapely theme setup please read documentation: https://colorlib.com/wp/support/shapely/

== Translation ==
Theme can be translated directly on https://translate.wordpress.org/projects/wp-themes/shapely without relying on the .po file. All the translatable strings are pulled automatically. For more info please check this link https://make.wordpress.org/polyglots/handbook/tools/glotpress-translate-wordpress-org/

== Frequently Asked Questions ==

= Does this theme support any plugins? =

Shapely includes support for Infinite Scroll, Portfolio, Testimonials, Tiled Galleries for Jetpack.

= Long menus =

Shapely theme does not support long menus.

= Front page template not displaying content =

This page template is used to create the Parallax homepage from our demo : https://colorlib.com/shapely/ . it does not output any content added in the backend editor and we recommend using only the [Shapely] tagged widgets.

== Credits ==

* Based on Underscores https://underscores.me/, (C) 2012-2017 Automattic, Inc., [GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html)
* normalize.css https://necolas.github.io/normalize.css/, (C) 2012-2017 Nicolas Gallagher and Jonathan Neal, [MIT](http://opensource.org/licenses/MIT)
* Bootstrap v3.4.1 (https://getbootstrap.com), Copyright 2011-2019 Twitter, Inc. Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com
	License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
* Raleway font, Copyright 2010 The Raleway Project Authors (https://github.com/impallari/Raleway), [SIL Open Font License 1.1](https://openfontlicense.org)
* WP-Bootstrap-NavWalker licensed under the GPLv2 license (https://www.gnu.org/licenses/gpl-2.0.html)
* FlexSlider by WooThemes licensed under the GPLv2 license (https://www.gnu.org/licenses/gpl-2.0.html)
* Owl Carousel 2.3.4, Copyright 2013-2018 David Deutsch, [MIT](https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE)
* parallax.js 1.5.0, Copyright 2016 PixelCog Inc., [MIT](https://github.com/pixelcog/parallax.js/blob/master/LICENSE)


== Upgrade Notice ==

= 1.3.7 =
Fixes page templates, block layouts beside a sidebar, "#" menu items, threaded comments and the portfolio archive, restores the Font Awesome subset, and stops a database write on every page view. Pages using the Full Width, No Sidebar or Sidebar templates now look like pages rather than blog posts. Body text is a little darker, to meet accessibility contrast guidelines, and there are new block patterns for building the home page.

= 1.3.1 =
Fixes two regressions from 1.3.0: links taking the button colour when the two
were set differently, and child themes that replace the theme's Bootstrap,
FlexSlider or Owl Carousel silently getting the parent's copy back. Both are
fixed automatically -- nothing to change on your site.

= 1.3.0 =
Removes the bundled Epsilon framework and adds theme.json. Your settings carry
over untouched and the site should look identical. Child themes that dequeue the
theme's Bootstrap, FlexSlider or Owl Carousel assets need their handles updated
to shapely-bootstrap, shapely-flexslider, shapely-owl-carousel and
shapely-owl-carousel-theme.

== Changelog ==

= 1.3.7 =
* Pages using the Full Width, No Sidebar, Sidebar Left or Sidebar Right template now use the page layout. They were rendered as blog posts, with a date, category, author box and a grey placeholder image when there was no featured image.
* Wide and full-width blocks no longer spill over the sidebar. On layouts with a sidebar -- the default for posts -- they covered it and ran off the edge of the screen; they now fill the content column.
* Block widget titles (the default since WordPress 5.8) are styled like classic widget titles instead of full-size headings, in the sidebar, the footer and the Customizer preview. The Latest Comments block no longer has 144px of padding around each comment.
* Restored the Font Awesome subset: every page was loading about 350 KB of icon CSS and fonts again. It is 30 KB now. The complete icon set loads automatically when Shapely Companion's Features or Video section is used, and also understands the Font Awesome 4 icon names those sections store, which previously showed as empty squares.
* Menu items linking to "#" -- the usual way to add a dropdown parent -- linked to a page that does not exist and lost their dropdown arrow on mobile. They keep "#" now.
* Menu links to a section on the page ("#contact") scroll smoothly to it.
* Threaded comments are nested correctly, show their real time, and Reply is a button again. Name and email are only required when Settings > Discussion says so, and the comment fields have labels for screen readers.
* The WooCommerce product search widget searches products only; it returned posts and pages too.
* The password form for protected posts no longer pre-fills the password field with the search text, shows WordPress' "Invalid password" message, and returns to the post after a wrong password.
* The portfolio archive: the grid is closed before the page links, so a right sidebar sits beside it rather than inside it; projects without a featured image show a tile with their title instead of an empty square; project type badges link to their archive.
* Jetpack Infinite Scroll loads posts into the posts column in your chosen blog layout, and Jetpack's Content Options toggles work.
* Single posts have one h1 with the full title; it was an h2 cut to nine words.
* The logo, attachment pages and related posts serve responsive images again (srcset was being stripped), so logos are sharp on high-density screens and attachment pages no longer send the full-size original.
* Customizer: the project "Tags" option appears and works; opening the Customizer on a Builder page opens that page's widgets; "Title in Blog Post" shows its real state and is available with Rank Math as well as Yoast; the placeholder image, logo size and layout options no longer save values that break the site; clearing the Portfolio title falls back to "Portfolio"; unticking "Display Site Title and Tagline" no longer produces invalid CSS; clearer labels for the header transparency options.
* Colour settings are validated before they are written into the page's CSS.
* Performance: the Builder no longer writes to the database on every page view; the carousel script and styles load only on single posts and projects; skip-link-focus-fix.js, which modern browsers do not need, is removed; the fonts stylesheet is versioned so updates reach returning visitors.
* The theme's font, Raleway, is served from the theme instead of Google Fonts, so no visitor request goes to a third party.
* The block editor loads the theme's editor styles.
* Compatible with jQuery 4: the related posts carousel failed on it and stopped the header search and contact form handling from working.
* Fixed a plugin that registers its own "bootstrap" stylesheet removing the theme's layout stylesheet.
* The Demo Content import says when Shapely Companion is needed instead of failing with "There was an error", no longer lists plugin checkboxes that did nothing, and cannot be run twice by a double click.
* New sites switching from another theme see the welcome notice again.
* Page widgets parked in Inactive Widgets are no longer deleted when widgets are saved.
* Tested with WordPress 7.1 and PHP 8.5.
* New: block patterns for the home page sections -- Hero, Three features, Testimonials, Latest posts, Call to action band and Contact details -- and a Home page pattern that puts them together, plus a "Blocks (full width, no title)" page template to build pages with them. The home page no longer has to be built from Shapely Companion widgets.
* Colours come from one palette. A link or button colour set in the Customizer now reaches the parts that used to stay purple -- menu hovers, widget links, pagination, the calendar, form focus borders -- and shows in the block editor and its colour pickers too. The Customizer's colour CSS is part of the stylesheet instead of being printed into every page.
* Button hovers use one shade everywhere.
* The block editor is as wide as the column the post is published in -- 750px beside a sidebar -- so what you edit matches what visitors see.
* Accessibility: body text is darker so it meets the WCAG AA contrast minimum; the submenu arrow and the header search are real buttons that work from the keyboard and tell screen readers whether they are open; menu items are no longer announced twice; the navigation, sidebar and footer areas are labelled; archive pages have a main heading; the social menu no longer repeats its ids on the home page.
* Menu links to a section on the page stop with the section just below the sticky header instead of partly behind it.
* The Demo Content import tells editors it needs an administrator instead of failing with an error.
* Dropdown menus on the right-hand menu items open leftwards when there is no room on the right. They ran off the edge of the window, which gave every page a horizontal scrollbar even with the menu closed.

= 1.3.6 =
* Removed KB Support from the recommended plugins. WordPress.org closed it on 2025-04-03 over a security issue.

= 1.3.5 =
* Fixed the social icons rendering as blank boxes. The bundled Font Awesome subset was missing the rules that bind an icon class to a font face, so `.fa-brands` fell back to the Free face, which contains no brand glyphs

= 1.3.4 =
* Fixed the Font Awesome webfonts returning 404. The stylesheets reference url(../webfonts/...), which resolves next to the stylesheet, and the fonts had been placed a directory too high -- so no icon rendered at all.
* The bundled Font Awesome is now subsetted to the glyphs the theme renders, loaded by default, with the complete build still shipped for sites that need it: add_filter( 'shapely_full_fontawesome', '__return_true' ). Measured on WordPress 7.1 and PHP 8.5, median of three Lighthouse runs: performance 72 to 91, First Contentful Paint 1.65s faster, font payload 297 KB to 44 KB.

= 1.3.3 =
* Updated Font Awesome from 6.4.2 to a self-hosted 7.3.1. The theme loaded all.min.css, which carries v4 and v5 compatibility @font-face blocks and shipped a fa-v4compatibility font to back them; no shim is wanted, since every class the theme renders is a native Font Awesome name. The stylesheets now load split by style -- the core name map plus one file per family -- and only the solid and brands faces are bundled, the two the theme renders.
* Only woff2 ships. The ttf copies beside it were never downloaded, because a browser takes the first format it supports from the @font-face src list.
* Removed a second, complete icon font: FontAwesome.otf and five fontawesome-webfont files, 724 KB of Font Awesome 4 left behind by the upgrade to 6 and referenced by no stylesheet in the theme. Bundled icon fonts drop from 2,092 KB to 332 KB.
* Bluesky has its own icon again. fa-bluesky arrived in Font Awesome 6.6 and the theme bundled 6.4.2, so bsky.app links deliberately fell through to the generic link glyph. All 30 mapped social networks were checked against the bundled build.

= 1.3.2 =
* Updated the bundled Bootstrap from 3.3.7 to 3.4.1, the final release of the 3.x line and the one that fixed CVE-2019-8331. Shapely enqueues only Bootstrap's stylesheet and never its JavaScript, so the theme was not exposed to that defect, which is a JavaScript one -- but there is no reason to keep the superseded build. Both stylesheets were stock 3.3.7, so this is a straight replacement.
* The Customizer preview wrote its AJAX response into a <style> element with jQuery's .html(), which parses its argument as markup. The payload is CSS from the theme's own nonce- and capability-checked endpoint, so this was not reachable as a vulnerability, but it is inserted with .text() now.
* parallax.js was enqueued with the theme's version string instead of its own, so its URL changed on every theme release and gave no indication of which build was in use. It declares 1.5.0, matching the bundled file.

= 1.3.1 =
* Fixed link colours changing after the 1.3.0 update on sites that set a different colour for links and for buttons. Both were being written to the same internal colour slot, so whichever was saved last won and links took the button's colour
* Fixed child themes that swap out the theme's Bootstrap, FlexSlider or Owl Carousel. 1.3.0 renamed those asset handles, which silently turned `wp_dequeue_style( 'bootstrap' )` into a no-op -- the parent's stylesheet came back on top of the child's replacement, with no error to explain it. The old handle names work again, while the rename that stopped plugins suppressing the theme's own stylesheets stays in place

= 1.3.0 =
* Removed the vendored Epsilon customizer framework. It was 144 files and 1.3 MB -- 52% of the theme -- and provided 31 toggle controls, one slider, two customizer sections and the welcome screen. All of those are now built on core WordPress APIs. The download is roughly a third smaller and the theme ships 51 PHP files instead of 88
* Added theme.json, so the palette, type scale and layout widths have a single source of truth that the block editor reads. Colour options in the customizer still work exactly as before -- each one now overrides the matching theme.json value rather than maintaining a second palette
* Fixed "Wide width" and "Full width" doing nothing on blocks. The theme has declared support for them since 2018 without ever shipping the CSS they need
* Fixed images in post content overflowing their column. Bootstrap 3 only makes images responsive via a class that block markup never carries
* Rebuilt the welcome screen and the demo importer on core APIs. The old AJAX endpoint accepted a class name and a method name from the request and called them; dismissals now run through a single handler with a nonce and a capability check
* Fixed 11 customizer controls that would have disappeared entirely if the framework had ever failed to load, because their fallback registrations were incomplete
* Renamed the bootstrap, flexslider, owl.carousel and owl.carousel.theme asset handles to be theme-specific. Generic handles can be claimed by a plugin first, which silently suppresses the theme's own file -- the same fault that blanked every icon on sites running Elementor in 1.2.20
* The block editor now offers the theme's palette, and the editor canvas matches the front end

= 1.2.21 =
* Fixed the back-to-top arrow sitting off-centre in its button. The 36px button's content box was 22px tall and 10px wide after border and padding, so a 18px glyph with a 27px line box could not centre on either axis; measured 2.8px right and 1.9px high before, sub-pixel after
* Fixed one-page section links in the menu, and the page-builder customizer, using site_url() where home_url() was meant. On installs with WordPress in its own subdirectory those pointed at /wp/ instead of the site address
* Added add_theme_support( 'wp-block-styles' ) and add_editor_style(), so core block styles apply on the front end and the editor canvas matches the theme's typography
* Added three block styles (two button styles and a short rule) and two block patterns, built from the theme's own button and colour values
* Removed two orphaned Font Awesome 5 stylesheets that nothing enqueued
* Fixed the arrow on submenu items that have a further submenu sitting well below its label, near the bottom edge of the row. It was centred with the 55px top menu bar's line height rather than the submenu row's, putting it 11.5px too low on desktop and 6px too high on mobile
* Fixed Font Awesome 6 loading its glyphs from a leftover Font Awesome 5.15.3 font directory. The bundled stylesheet asked for "../webfonts/", which resolves out of assets/css/fontawesome6/ and into the old assets/css/webfonts/, so every icon added after 5.15.3 rendered as a blank gap -- the X (Twitter) icon in the footer social links being the visible one
* Removed the orphaned Font Awesome 5 font files, which nothing referenced once the path above was corrected. The release zip drops from 3.16 MB to 1.88 MB
* Fixed the theme's Font Awesome 6 never loading on sites running Elementor or any other plugin that registers the generic "font-awesome" handle. WordPress keeps only the first registration of a handle, so the theme's stylesheet was silently dropped and every fa-brands / fa-solid icon -- the social links, the search button, the menu and pagination arrows -- rendered as a blank box. It now uses its own "shapely-font-awesome" handle
* Fixed the customizer loading Font Awesome from .../shapely/inc/assets/css/..., a path that has never existed, so the customizer's own icons 404'd
* Fixed related posts on portfolio items returning the wrong posts when the portfolio taxonomies are not registered: wp_get_object_terms() returns a WP_Error there, and it was being passed straight into the query
* Regenerated languages/shapely.pot, which had been built before the text domain unification and was missing 86 translatable strings
* Added a version check to the build so style.css, readme.txt, changelog.txt and package.json can no longer drift apart (readme.txt had been left at 1.2.19)
* Fixed the coding-standards CI job, which had been failing to install PHPCS rather than actually checking anything

= 1.2.20 =
* PHP 8.5 compatibility: removed every runtime deprecation and warning raised by the theme
* Verified on WordPress 7.0.2 / PHP 8.5: zero PHP notices across all templates, the customizer, the welcome screen and the block editor
* Verified alongside the Shapely Companion plugin (1.2.10): homepage widget sections, parallax, features, call-to-action and contact all render with zero PHP notices
* Replaced the Grunt build with plain npm scripts (tools/*.mjs): eliminates all 39 npm audit findings (1 critical, 24 high), which came entirely from grunt-contrib-imagemin and grunt-contrib-compress
* Replaced JSHint and the deprecated JSCS with ESLint 10; added Stylelint 17 for CSS
* Fixed the release zip shipping developer files: CLAUDE.md, .scss sources, README.md, tsconfig.json, webpack.config.js and a nested package.json were all being published to users
* Fixed image optimisation never running: the Grunt task was pointed at assets/img/, which does not exist (the images are in assets/images/)
* languages/shapely.pot is now generated with WP-CLI and filtered to the shapely text domain, dropping 83 epsilon-framework strings that could never be translated through it and picking up 19 theme strings the old task missed
* Replaced the dead Travis CI config with GitHub Actions covering PHP 7.4 through 8.5
* package-lock.json and phpcs.ruleset.xml are now tracked instead of gitignored
* Fixed the "Requires at least" header reading "WordPress 6.4" instead of "6.4". The stray prefix made WordPress' minimum-version check pass on every release, so the theme could be activated on WordPress 4.9 where it would fatal
* Added the missing "Domain Path: /languages" header
* Corrected the theme tags: removed five surplus subject tags (WordPress.org allows three), dropped custom-menu, threaded-comments and translation-ready (retired in WordPress 4.6) and three-columns/four-columns (not actual content layouts), and added custom-header, grid-layout and wide-blocks, which the theme does support
* Rewrote the style.css description: shorter, factual, and without the two typos it had carried since 2016
* Moved the version headers out of the functions.php docblock; style.css is the only file WordPress reads them from and the two copies had drifted
* Aligned readme.txt's Theme URI, Author and version fields with style.css
* Featured-image links in the blog, search and portfolio listings now carry an accessible name; when an attachment has no alt text WordPress emits alt="", which left those links unnamed
* Fixed FlexSlider and OwlCarousel calling jQuery event aliases (.blur/.focus/.resize) and jQuery.type that jQuery 4 removes
* Fixed a duplicate id="main" and a duplicate role="main" landmark on the search, 404 and portfolio archive templates
* Fixed pagination arrows using an invalid <icon> element, leaving the prev/next links with no accessible name
* Fixed the back-to-top link, related-posts carousel arrows and related-posts thumbnails having no accessible name
* Fixed the search results template hardcoding a placeholder image, ignoring the placeholder customizer settings
* Fixed an empty author byline linking to a bare /author/ URL on posts with no valid author
* Fixed pagination nesting a <nav> landmark inside another <nav>
* Fixed fatal-prone breadcrumb code that read an array offset on `false` and an undefined variable when Rank Math was active without Yoast
* Fixed `strcasecmp(): Passing null` deprecation in the nav walker that fired once per menu item on every page load
* Fixed "Attempt to read property on null" in the excerpt and thumbnail helpers when no post is in scope
* Security: escaped unescaped portfolio term names, thumbnail URLs in `style` attributes, header nav style, and nav-menu fallback markup
* Security: rebuilt the search form so it no longer reflects filtered `<form>` attributes into the page
* Fixed excerpts splitting multibyte characters mid-glyph and blanking out on single-word content
* Fixed category/archive widget counts mangling any name or URL containing a closing parenthesis
* Fixed brand icons (Twitter/X, Facebook, GitHub, Dribbble, Vimeo) rendering blank under Font Awesome 6
* Fixed the missing `fa-folder-open-o` post-category icon, removed in Font Awesome 5+
* Fixed the RSS social icon rendering blank by using the solid rather than the brands font family
* Social links now expose an accessible name; the label span was previously rendered empty
* Fixed the "Skip to content" link never moving keyboard focus (`element.trigger()` on a DOM node)
* Fixed the header search panel closing on focus; its handlers targeted ids the form never rendered
* Fixed plugin detection failing on installs with a relocated `wp-content` directory
* Fixed lazy loading being stripped from listing images by an outdated kses allowlist
* Fixed the Builder/portfolio archive missing its Bootstrap `.row` wrapper
* Fixed the wide blog layout ignoring the placeholder-image customizer settings
* Fixed malformed `</<div>` markup in the Home page template
* Replaced `get_page_by_title()`, deprecated in WordPress 6.2, in the demo importer
* Forward compatibility with jQuery 4: replaced removed event shorthands and shimmed the aliases FlexSlider still uses
* Theme class is now a singleton; it was instantiated three times, registering every admin hook and the Epsilon framework three times over
* Assets now carry the theme version so browsers pick up CSS/JS changes after an update
* Customizer CSS is attached via `wp_add_inline_style()` instead of a raw `wp_head` style block
* Added `responsive-embeds` and `align-wide` block editor support
* Removed dead code: duplicate `require` block and a plugin-callback loop that never had callbacks to run

= 1.2.17 =
* Added a new customizer setting to control placeholder images for posts without featured images
* Added an option to upload custom placeholder images
* Added a global setting to show/hide categories across all blog layouts
* Improved customizer UI with clearer section headings for blog hero image
* Fixed issue with WP_Customize_Control class loading
* Added custom CSS for better visual separation in customizer settings
* Fixed compatibility issues with WordPress 6.8

= 1.2.16 =
* Added accessibility improvements for dropdown menu arrows
* Fixed dropdown menu arrow display for submenu items
* Improved menu item spacing for items with children
* Updated Font Awesome to version 6
* Enhanced CSS for better dropdown menu visibility
* Fixed navigation menu styling for mobile devices
* Improved theme documentation in README.md
* Added Git submodule information and setup instructions
* Added support for Kali Forms plugin
* Fixed custom excerpt function to properly handle content
* Enhanced thumbnail handling with fallback placeholder images
* Improved theme customizer with selective refresh support
* Updated styling for buttons and form elements
* Fixed header text color customization
* Added responsive design improvements

= 1.2.4 =
* Implemented milestone: https://github.com/puikinsh/shapely/milestone/8?closed=1

= 1.2.3 =
* Implemented milestone: https://github.com/puikinsh/shapely/milestone/7?closed=1

= 1.2.2 =
* Implemented milestone: https://github.com/puikinsh/shapely/milestone/6?closed=1

= 1.2.0 =

* Implemented milestone https://github.com/puikinsh/shapely/milestone/4

= 1.1.6 - June 15 2017 =

* Implemented milestone https://github.com/puikinsh/shapely/milestone/2

= 1.1.5 - June 9 2017 =

* Added French translation thanks to Michaël Crofte

= 1.1.0 - Jan 3 2017 =

* Major upgrade to comply with WordPress.org guidelines and best practices.

= 1.0.5 - Sept 3 2016 =

* Improved theme translation

= 1.0.4 - Sept 3 2016 =

* Removed deprecated tags

= 1.0.3 - Sept 3 2016 =

* Small bug fixes and improvements

= 1.0.2 - April 15 2016 =

* Fixed parse error for older version of PHP.
* Fixed error when mobile menu was appearing along regular menu between 990px - 991px.

= 1.0.1 - March 30 2016 =

* Renamed JavaScript file to get rid of not found error.
* Updated Smooth Scroll to 1.7.2

= 1.0.0 - March 26 2016 =
* Initial release

Stable tag: 1.3.7
