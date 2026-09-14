# elisaganea.eu

Personal portfolio: home page with a swipeable project deck, a CV page and a
link-in-bio page, each in English and Romanian, each in light and dark mode.
Plain HTML, CSS and JavaScript — no framework, no external network requests
(fonts are self-hosted). GitHub Pages runs Jekyll over it so the words live in
data files instead of in the markup.

```
_data/languages.yml       ← the languages the site is published in
_data/i18n/en/cv.yml      ← everything on the home and CV pages (English)
_data/i18n/en/links.yml   ← the rows on the link-in-bio page (English)
_data/i18n/en/ui.yml      ← nav labels, section titles, button text (English)
_data/i18n/ro/…           ← the same three files in Romanian
index.html, cv/, links/   the English pages: three lines of front matter each
ro/                       the Romanian pages, same shape
_layouts/default.html     <head>, header, footer — wraps every page
_includes/page-*.html     the page bodies: structure, classes, ARIA
_includes/nav.html …      header, footer, icon set, language variables
_config.yml               Jekyll build settings
assets/css/styles.css     design tokens (light + dark) and layout
assets/js/main.js         theme toggle, mobile menu, reveals, the card deck
assets/fonts/             Anton + DM Sans (.woff2, OFL licensed)
assets/img/               portrait cut-out (webp with alpha), favicon, social card
_design/                  the design canvas the site was built from (not deployed)
```

## Editing the content

**Everything you'd normally want to change is in `_data/i18n/en/cv.yml`** — your
name, the hero text, the cards in the deck, jobs, education, skills, contact details,
page titles and social-share text. The templates read from it; you shouldn't need to
open them to change words. Make the same change in `_data/i18n/ro/cv.yml` so the
Romanian site keeps up.

A few fields accept Markdown for emphasis (they're marked `# markdown` in the file):

| You write | You get |
|---|---|
| `*analytical*` | pink |
| `**Sociology**` | bold |

Everything else is plain text and is escaped automatically, so `&`, `<` and quotes are
safe to type.

Other knobs:

| What | Where |
|---|---|
| Add / remove cards in the deck | `highlights.cards` and `projects.items` — the counter and the stack rebuild to match |
| Add a real project | `projects.items` — a card with a `url` gets a "Read more" link; without one it is the dashed placeholder |
| The skills that scroll under the hero | `marquee` |
| Rows on the links page | `_data/i18n/<lang>/links.yml` |
| Nav labels, section names, button text | `_data/i18n/<lang>/ui.yml` |
| Colours, type sizes, spacing | `assets/css/styles.css`, the tokens in `:root` (light) and `:root[data-theme="dark"]` |

### Adding a language

1. Copy `_data/i18n/en/` to `_data/i18n/<code>/` and translate the three files.
2. Add the language to `_data/languages.yml` (the first entry is the default and lives at `/`).
3. Copy the three stub pages from `ro/` to `<code>/` and change `lang:` and `permalink:` in each.

The switch in the header lists whatever is in `languages.yml`; every page links to its
translations with `hreflang` for search engines.

### Printing the CV

A print stylesheet drops the header, footer and buttons, so printing `/cv/` (or
"Save as PDF" from the print dialog) gives a clean one-page CV.

## Working on it locally

One-time setup (the system Ruby is too old for Jekyll):

```bash
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
gem install jekyll bundler
```

Then, from the repo:

```bash
bundle install          # first time only
bundle exec jekyll serve
```

Visit <http://localhost:4000>. It rebuilds as you save, so editing a data file and
refreshing is the whole loop. (`.claude/launch.json` starts the same server from the
Claude desktop app.)

> Opening the HTML files directly in a browser doesn't work — you'd see the raw
> `{{ ... }}` template tags. They have to go through Jekyll.

GitHub Pages builds with its own pinned Jekyll 3.9 while the `Gemfile` here installs
Jekyll 4. The templates stick to core Liquid, `_data` and `_layouts`, which behave the
same on both. If a difference ever appears, swap the `Gemfile` to the `github-pages` gem.

## Deploying

Push to `main`. GitHub Pages builds the site itself — there is no build output to
commit, and `_site/` is gitignored.

Under **Settings → Pages**, *Source* is **Deploy from a branch**, branch `main`,
folder `/ (root)`.

If a build fails, GitHub emails you and the live site keeps serving the previous
version. The usual cause is a YAML mistake in a data file, which is why previewing
locally before pushing is worth the setup.

### Custom domain

`elisaganea.eu` needs four `A` records:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

and, if your registrar supports IPv6, four `AAAA` records:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

Optionally a `CNAME` record for `www` pointing to `YOUR-USERNAME.github.io.`

> **Keep the `CNAME` file in the repo.** If a commit deletes it, GitHub resets the
> custom domain and the site falls back to `github.io`. Once the domain points at
> GitHub Pages again, change `site.url` in both `cv.yml` files back to
> `https://elisaganea.eu/`.

## Notes

- Light or dark follows the system setting until the toggle is used; the choice is
  then remembered in `localStorage`. The head script applies it before first paint.
- The deck: drag the top card past 120px to fling it, or use the arrows / the arrow
  keys with the deck focused. Cards behind the top one are `inert`, so tabbing only
  reaches the visible card.
- Everything animated respects `prefers-reduced-motion`: the marquee stops, the
  reveals and the card transitions are skipped, the theme switches instantly.
- With JavaScript disabled the pages still render in full: the deck becomes a plain
  column of cards, the theme follows the system, the menu is always open on phones.
- The portrait is a background-removed cut-out (`_design/src/cutout.swift`, Apple
  Vision), served as a WebP with alpha and desaturated in CSS. (AVIF was
  dropped: some Safari versions paint its transparent areas black.)
- Fonts are bundled under the SIL Open Font License; the licence texts are in
  `assets/fonts/`.
