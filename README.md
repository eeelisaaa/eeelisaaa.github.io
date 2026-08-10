# elisaganea.eu

Personal one-page portfolio. Plain HTML, CSS and JavaScript — no framework, no
external network requests (fonts are self-hosted). GitHub Pages runs Jekyll over it
so the page content can live in a data file instead of in the markup.

```
_data/cv.yml            ← everything you'll normally edit lives here
index.html              the template: structure, classes, ARIA
_config.yml             Jekyll build settings
assets/css/styles.css   design tokens + layout
assets/js/main.js       scroll reveals, nav, highlights carousel
assets/fonts/           Instrument Serif + Inter (.woff2, OFL licensed)
assets/img/             portrait, favicon, social-share card
tools/make-portrait.py  regenerates the hero portrait from the full-res original
CNAME                   custom domain for GitHub Pages
```

## Editing the content

**Everything you'd normally want to change is in `_data/cv.yml`** — your name, the
hero text, the rotating highlight cards, jobs, education, skills, projects, contact
details, and the page title and social-share text. `index.html` is a template; you
shouldn't need to open it to change words.

A few fields accept Markdown for emphasis (they're marked `# markdown` in the file):

| You write | You get |
|---|---|
| `*social-research method.*` | accent-coloured italic |
| `**B.A. Business Management**` | bold |

Everything else is plain text and is escaped automatically, so `&`, `<` and quotes are
safe to type — that's the point of having the data file.

Other knobs:

| What | Where |
|---|---|
| How fast the carousel rotates | `_data/cv.yml`, `highlights.interval_ms` |
| Add / remove highlight cards | `_data/cv.yml`, `highlights.cards` — the dots rebuild to match |
| Add a real project | `_data/cv.yml`, `projects.items` — a card with no `url` renders as the dashed placeholder |
| Accent colour, spacing, fonts | `assets/css/styles.css`, the tokens in `:root` |

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

Visit <http://localhost:4000>. It rebuilds as you save, so editing `_data/cv.yml` and
refreshing is the whole loop.

> Opening `index.html` directly in a browser no longer works — you'd see the raw
> `{{ ... }}` template tags. It has to go through Jekyll.

GitHub Pages builds with its own pinned Jekyll 3.9 while the `Gemfile` here installs
Jekyll 4. The template sticks to core Liquid and `_data`, which behave the same on
both. If a difference ever appears, swap the `Gemfile` to the `github-pages` gem.

## Deploying

Push to `main`. GitHub Pages builds the site itself — there is no build output to
commit, and `_site/` is gitignored.

Under **Settings → Pages**, *Source* is **Deploy from a branch**, branch `main`,
folder `/ (root)`.

If a build fails, GitHub emails you and the live site keeps serving the previous
version. The usual cause is a YAML mistake in `_data/cv.yml`, which is why previewing
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
> custom domain and the site falls back to `github.io`.

## Notes

- Everything animated is wrapped in `prefers-reduced-motion` checks: with that setting
  on, the carousel stops rotating and shows all cards as a static stack, and the scroll
  reveals are skipped.
- With JavaScript disabled the page still renders in full — the reveal and carousel
  start states only apply under the `.js` class that the template sets in the `<head>`.
- The hero portrait's soft edge is baked into `portrait.webp`'s alpha channel, not done
  in CSS, so it composites correctly over the hero glow. Regenerate it with
  `python3 tools/make-portrait.py` (needs Pillow).
- Fonts are bundled under the SIL Open Font License; the licence texts are in
  `assets/fonts/`.
