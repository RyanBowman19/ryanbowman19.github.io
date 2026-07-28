# 07 — Speed

**Target: fully loaded and interactive in under 2 seconds on 4G.**

This site should be the fastest thing your prospect loaded today. It's the
demonstration, not just the brochure — when someone is deciding whether you know
what you're doing, the load is the first evidence they get.

---

## Where this site already stands

Most of the work is structural and already done:

| Decision | Saved |
|---|---|
| No framework, no hydration | ~40–120 KB JS |
| System fonts, no web font | 2–4 requests, ~60–120 KB, all FOUT |
| Inline SVG sprite for icons | 12+ requests |
| CSS device mockups instead of screenshots | ~200–600 KB of images |
| Inline data-URI favicon | 1 request |
| Single CSS file, single JS file | 2 requests total |
| `defer` on the only script | Non-blocking parse |
| No analytics, no tag manager, no chat widget | Frequently the heaviest thing on a small business site |

**Total request count for first paint: 3** (HTML, CSS, JS). There is no fourth
until you add an image.

## Budgets — enforce these

| Asset | Budget | Actual (measured) |
|---|---|---|
| HTML | 50 KB | 44.3 KB |
| CSS | 50 KB | 42.9 KB |
| JS | 30 KB | 24.7 KB |
| Images | 300 KB total | 0 |
| Requests (first paint) | 10 | 3 |
| **LCP** | **< 1.5 s** | measure |
| **CLS** | **< 0.05** | measure |
| **INP** | **< 150 ms** | measure |

**~112 KB uncompressed, ~25–30 KB over the wire.** Brotli cuts text assets by
roughly 75%, and all three hosts in the README apply it automatically. Much of
the raw size is comments — the source is written to be maintained, not to win a
byte count.

---

## Priority fixes, in order

### 1. Images — this is 90% of every slow small-business site

The moment you add real photography, it becomes the entire performance story.
Nothing else on this list matters as much.

- **Convert everything to WebP.** 25–35% smaller than JPEG at equal quality.
  AVIF is smaller still but slower to encode; WebP is the right default.
- **Resize to actual display size, then stop.** A 4000px camera JPEG rendered
  in a 600px slot is the single most common cause of a slow site. Export at 2×
  the display width for retina — no more.
- **Always set `width` and `height`.** This is what prevents layout shift; the
  browser reserves the box before the bytes arrive. Missing dimensions is the
  #1 cause of a bad CLS score.
- **`loading="lazy"` on everything below the fold. Never on the hero image** —
  lazy-loading your LCP element actively delays it.
- **`decoding="async"`** so image decode doesn't block paint.

```html
<img src="assets/client.webp" width="1200" height="800"
     loading="lazy" decoding="async"
     alt="Homepage of Client Name's website">
```

For anything above the fold:

```html
<img src="assets/hero.webp" width="1200" height="800"
     fetchpriority="high" decoding="async" alt="…">
```

Squoosh (squoosh.app) does all of this in the browser, free, no upload.

### 2. Serve compressed and cached

Add a `_headers` file (Netlify/Cloudflare Pages):

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/styles.css
  Cache-Control: public, max-age=86400

/script.js
  Cache-Control: public, max-age=86400
```

Long cache on fingerprinted assets, short on files you edit in place. If you
start renaming `styles.css` → `styles.a1b2c3.css` on change, move it to the
`immutable` year-long bucket too.

### 3. Minify — last, and only if you measure a win

At 43 KB of CSS and 25 KB of JS — most of it comments, which compress
extremely well — **minification saves you single-digit KB after Brotli. That is
not the bottleneck**, and it costs you readable source and a build step you
don't currently have.

Do it only when you have a build pipeline for other reasons:

```bash
npx lightningcss-cli --minify styles.css -o styles.min.css
npx esbuild script.js --minify --outfile=script.min.js
```

Being honest about this is worth more than the bytes: recommending minification
to a client whose real problem is a 6 MB hero photo is how you lose their trust.

### 4. Lazy loading beyond images

Already in place via `IntersectionObserver` for scroll reveals. If you later add:

- **Embedded maps** — don't. An embedded Google Map costs 500 KB+ and several
  third-party connections. Use a static map image linked to Google Maps.
- **YouTube** — never embed the iframe directly (~800 KB before play). Use a
  thumbnail that swaps in the iframe on click, or `lite-youtube-embed`.
- **Social feeds** — the worst offender in this category. Screenshot it or link out.

### 5. Third-party scripts — the discipline that actually matters

Every script you add is someone else's performance budget spending yours.

- **Analytics:** if you need it, use a lightweight option (Plausible ~1 KB,
  Cloudflare Web Analytics, or Netlify's built-in server-side stats which cost
  the browser nothing). Google Analytics is ~50 KB plus a third-party connection.
- **Chat widgets:** typically 200–500 KB. For a solo business, a phone number
  converts better anyway.
- **Fonts:** if you must have a custom face, self-host a WOFF2 subset with
  `font-display: swap` and `<link rel="preload">`. Never the Google Fonts CDN —
  a DNS lookup plus a TLS handshake before the first glyph paints.

---

## What to measure, and how

**Before you claim any number, measure it.** The site currently ships a "98
PageSpeed" chip in the hero — verify it against your deployed URL or delete it.
A web designer caught with an unverified performance claim on their own site has
a hard afternoon.

| Tool | Use |
|---|---|
| [PageSpeed Insights](https://pagespeed.web.dev) | The number clients recognize. Read the **mobile** tab. |
| Chrome DevTools → Lighthouse | Local runs while iterating |
| DevTools → Network, throttled to "Fast 4G" | The realistic condition. Desktop-on-fibre lies to you. |
| DevTools → Performance → Web Vitals | LCP element identification |
| [WebPageTest](https://webpagetest.org) | Filmstrip view — best for showing a client what "slow" looks like |

**Measure against the deployed URL, not `file://` or localhost.** Local testing
skips DNS, TLS, and network latency, which is most of the real load time.

### Sanity checklist before you call it done

- [ ] PageSpeed mobile ≥ 95
- [ ] LCP < 1.5 s on Fast 4G throttling
- [ ] CLS < 0.05 (scroll the whole page watching for jumps)
- [ ] No image over 300 KB
- [ ] Every `<img>` has `width`, `height`, and `alt`
- [ ] No render-blocking resources in the Lighthouse report
- [ ] Total transfer under 500 KB
- [ ] Tested once on a real phone on cellular, not wifi

---

## Reusable client version

Small businesses almost always have the same three problems, in this order:

1. **Uncompressed images** — usually one 4 MB photo the owner uploaded straight
   from a phone. Fixing this alone commonly halves load time.
2. **Too many plugins** (WordPress) — each adds CSS and JS to every page whether
   the page uses it or not. Audit, deactivate, delete.
3. **A slow host** — $3/mo shared hosting with a 1.5 s TTFB. No amount of
   front-end work fixes a slow server.

Diagnose in that order. It's nearly always #1, it's the cheapest to fix, and
being able to say *"your site is slow because of one photograph, and I can fix
it this afternoon"* is a better sales conversation than any audit report.
