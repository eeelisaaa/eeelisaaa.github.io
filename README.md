# elisaganea.eu

Personal one-page portfolio. Plain HTML, CSS and JavaScript — no framework, no build
step, no external network requests (fonts are self-hosted).

```
index.html              all content lives here
assets/css/styles.css   design tokens + layout
assets/js/main.js       scroll reveals, nav, highlights carousel
assets/fonts/           Instrument Serif + Inter (.woff2, OFL licensed)
assets/img/             portrait, favicon, social-share card
CNAME                   custom domain for GitHub Pages
```

## Working on it locally

There is nothing to install. Open `index.html` directly, or serve it so that paths
behave exactly as they will in production:

```bash
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.

## Things you'll probably want to change first

| What | Where |
|---|---|
| GitHub + LinkedIn URLs (currently `#`) | `index.html`, search for `TODO` |
| The placeholder project card | `index.html`, `<!-- PLACEHOLDER -->` — a ready-to-fill template sits commented out right below it |
| Which three achievements the carousel shows | `index.html`, the `.hl-card` blocks — add or remove them freely, the dots rebuild to match |
| How fast the carousel rotates | `index.html`, `data-interval="3000"` (milliseconds) |
| Accent colour | `assets/css/styles.css`, `--accent` in `:root` |

## Deploying to GitHub Pages

1. Create an empty repository on GitHub (any name — `elisaganea.eu` or `portfolio` both
   work fine with a custom domain).

2. Push this folder:

```bash
git remote add origin git@github.com:YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

3. In the repository: **Settings → Pages → Build and deployment**, set *Source* to
   **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.

4. Still under **Settings → Pages**, put `elisaganea.eu` in *Custom domain*. GitHub reads
   the `CNAME` file in this repo, so it should already be filled in.

5. Point the domain at GitHub with your registrar. For the apex domain `elisaganea.eu`,
   four `A` records:

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

   Optionally add a `CNAME` record for `www` pointing to `YOUR-USERNAME.github.io.`

6. DNS takes anywhere from a few minutes to a few hours. Once GitHub reports the domain
   as verified, tick **Enforce HTTPS** — the certificate is issued automatically.

> **Keep the `CNAME` file.** If a future commit deletes it, GitHub resets the custom
> domain and the site falls back to `github.io`.

## Notes

- Everything animated is wrapped in `prefers-reduced-motion` checks: with that setting on,
  the carousel stops rotating and shows all three cards as a static stack, and the scroll
  reveals are skipped.
- With JavaScript disabled the page still renders in full — the reveal and carousel start
  states only apply under the `.js` class that `index.html` sets in the `<head>`.
- Fonts are bundled under the SIL Open Font License; the licence texts are in
  `assets/fonts/`.
