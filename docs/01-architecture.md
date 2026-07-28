# 01 — Architecture

## The decision

**Static HTML/CSS/JS. No framework, no build step, no dependencies.**

That is not a shortcut — for this site it's the correct engineering call, and
here's the reasoning, because you'll be asked to defend it by clients who've
heard "you need WordPress."

| Constraint | Consequence |
|---|---|
| The site sells *speed and reliability* | It has to be the fastest thing the prospect loaded today. A framework's hydration cost undercuts the pitch. |
| Content changes maybe monthly | A CMS solves a problem you don't have, and adds a database, a login, and a patch treadmill. |
| One person maintains it | Zero dependencies means zero dependency updates, zero build breakage, zero `npm audit` on a Friday. |
| Marketing site, ~8 sections | Component reuse benefits kick in around 20+ pages. Below that, a framework is pure overhead. |

**When to revisit:** if you add 10+ local landing pages ("Web Design in
Crawfordsville," etc.) or start a blog, move to **Astro**. It compiles to the
same static HTML you have now, so nothing here is wasted — the CSS and the copy
transfer directly.

## Rendering

Pure static. Every byte is pre-written; the server does nothing but hand over
files. Fastest possible Time to First Byte, works on any host, cacheable at the
edge indefinitely.

JavaScript is **progressive enhancement only**:

- Every word of content is in the HTML and readable with JS disabled
- Only two things need JS: the estimate calculator and the multi-step form
- The form's fallback path is a normal `mailto:` — a lead never gets lost to a
  script error

## Information architecture

Single scrolling page. Local-business prospects don't navigate — they scroll
until they're convinced or they leave. Sections are ordered as a sales argument:

```
Hero          → what I do, who for, one clear action
Problem       → why doing nothing costs money        (agitate)
Services      → the three shapes an engagement takes (orient)
Work          → proof it's real                      (evidence)
Process       → what happens if you say yes          (de-risk)
Estimate      → what it costs, no email gate         (de-risk)
Care plans    → the recurring option                 (revenue)
FAQ           → the eight objections in order        (handle)
Contact       → the conversion                       (close)
```

The FAQ ordering is deliberate: **price is first**, because it's the first
question in every prospect's head and burying it reads as evasive. "Do I own
the site?" is fourth because it's the objection nobody voices but everybody has
after being burned by a previous agency.

## Performance budget

Enforce these; they're what make sub-2s achievable and they're all measurable.

| Metric | Budget | Actual (measured, uncompressed) |
|---|---|---|
| HTML | < 50 KB | **44.3 KB** |
| CSS | < 50 KB | **42.9 KB** |
| JS | < 30 KB | **24.7 KB** |
| Images | < 300 KB total | **0 KB** — hero and mockups are CSS |
| Requests | < 10 | **3** (HTML, CSS, JS) |
| **LCP** | **< 1.5 s** | measure on the deployed URL |
| **CLS** | **< 0.05** | every box has reserved dimensions |
| **INP** | **< 150 ms** | no blocking JS |

Those three files total ~112 KB uncompressed, which is roughly **25–30 KB over
the wire** once the host applies Brotli — the text assets compress about 75%.
A large share of the raw size is comments: the CSS and JS are documented for a
maintainer rather than minified for a byte count, and at this scale that's the
right trade (see the minification note in `07-speed-checklist.md`).

**Fonts are system fonts.** That removes 2–4 network requests and eliminates
FOUT entirely. The serif display face resolves to Iowan Old Style on Mac,
Palatino Linotype on Windows, Georgia as fallback — all high quality, all
already on the machine. If you later want a custom face, self-host a WOFF2
subset with `font-display: swap`; never use the Google Fonts CDN, which costs a
DNS lookup and a connection before the first glyph paints.

**Icons are an inline SVG sprite.** Zero requests, styleable with `currentColor`,
and they respond to the theme toggle automatically.

## SEO

- One `<h1>`, semantic sectioning, headings never skip a level
- `ProfessionalService` JSON-LD with service area and offers — this is what
  feeds the local pack, and it's populated from the same `SITE` config as
  everything else so it can't go stale
- Canonical URL, Open Graph, Twitter card
- Descriptive `alt` text on every image you add
- Add `sitemap.xml` and `robots.txt` at launch (two files, five minutes)

**The unglamorous truth for this market:** a Google Business Profile matters
more than on-page SEO for "near me" searches. The site's job is to be the
credible destination that profile points to. Say this to clients — it's true and
it's the kind of honesty that wins the job.

## Hosting

Cloudflare Pages, Netlify, or GitHub Pages. All free, all with automatic HTTPS,
all with global CDN. See README for steps.

Add these headers (`_headers` on Netlify/Cloudflare) once you're live:

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY

/styles.css
  Cache-Control: public, max-age=31536000, immutable

/script.js
  Cache-Control: public, max-age=31536000, immutable
```

Cache-busting for immutable assets: rename to `styles.a1b2c3.css` when you
change them, or drop the `immutable` directive and use `max-age=86400`.
