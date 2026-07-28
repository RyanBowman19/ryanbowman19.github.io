# Bowsites

**Live: <https://ryanbowman19.github.io/>**

Marketing site for Bowsites — web design for local Indiana businesses.

Deployed on GitHub Pages from the `main` branch. **Push to `main` and the site
updates itself** — usually live within a minute. No build, no deploy step.

```powershell
git add -A
git commit -m "Update pricing"
git push
```

Measured on the live site: **~28 KB total transfer** (10.5 KB HTML, 10.2 KB CSS,
7.0 KB JS, Brotli-compressed), 3 requests, free HTTPS.

Static HTML, CSS, and JavaScript. **No build step, no dependencies, no framework.**
Open `index.html` in a browser and it runs. That is deliberate: it's the fastest
thing you can ship, it can't break from a dependency update, and it deploys free
anywhere.

```
bowsites/
├── index.html      # the whole page
├── styles.css      # design tokens + all styles
├── script.js       # config, calculator, form, theme
├── assets/         # (create this) images, og-image.png, favicons
├── docs/           # strategy + spec documents
└── README.md
```

---

## 1. Before you launch — the required edits

### a) Your contact details — ⚠ phone still missing

Open `script.js`. The first block is the only place your details live — every
link, the footer, the mobile call button, and the search-engine markup read
from it. Current state:

```js
const SITE = {
  email:  'bowmanryan328@gmail.com',   // ✓ live
  phone:  'REPLACE_PHONE',             // ✗ add this
  area:   'Indiana',                   // ✓ works, but narrow it to your counties
  formspreeId: 'mqerndon',             // ✓ live
};
```

**Add a phone number.** Until you do, the "Rather just call?" line shows only
email and the sticky mobile Call button is stripped out entirely. For local
businesses a tap-to-call button is often the highest-converting element on the
page — you're leaving it on the table.

**Narrow the service area.** "Indiana" is vague and ranks for nothing. Something
like `'Montgomery, Parke & Putnam counties'` reads better in the FAQ and gives
Google an actual place to associate you with.

The page hides broken links rather than showing dead ones, and logs a checklist
to the browser console listing whatever's still missing.

### b) Contact form — ✓ connected, but test it

Wired to Formspree form `mqerndon`. Submissions land in
`bowmanryan328@gmail.com`.

**Send yourself a test message from the live site right now.** Formspree
requires you to confirm the form on first submission, and until you do,
real enquiries may not reach you. Do this before you give the link to anyone.

Free tier covers 50 submissions a month. If you outgrow it, the paid tier is
cheap, or swap to Netlify Forms by moving the site to Netlify.

### c) The testimonials are fake — deal with them

The three quotes in the "Don't take my word for it" section are **placeholders**.
They show the shape of a good quote. They are not real, and attribution reads
`[Client name]` so they can't ship by accident.

Two options, no third:

- **Get real ones.** Ask a client right after launch. Ask *"What were you
  worried about before we started?"* — you'll get usable words instead of "very
  professional." Get written permission to use their name and business.
- **Delete the whole `<section id="reviews">` block.** An empty spot is fine.

Publishing invented reviews is illegal in the US (FTC rules on fake
testimonials, in force since 2024) and carries real penalties. Don't.

### d) The case-study numbers

In `index.html`, the Waveland case study has three metric slots showing `—`:

```html
<div class="metric"><strong data-metric>—</strong><span>Load time</span></div>
```

**Measure them, don't guess.** Run [PageSpeed Insights](https://pagespeed.web.dev)
against `waveland.lib.in.us` and put the real numbers in. Made-up metrics on a
web-design site are the fastest way to lose a client who checks.

The hero also shows a **"0.9s load time on 4G"** chip. That number is a
placeholder too. Deploy the site, run PageSpeed Insights against the live URL,
and either put the real figure in or delete the `.score-chip` block from
`index.html`. A web designer caught with an unverified speed claim on their own
site has a hard afternoon.

### e) Set your real prices

`script.js` → the `PRICING` object. Every number the estimator uses is there,
including the care-plan prices, which the pricing cards read automatically so
the two sections can never disagree.

The values shipped are placeholders based on typical small-market rates. Change
them to yours before launch.

### f) Domain and social image

- `index.html` — replace `https://bowsites.com/` in the canonical and Open Graph tags
- Create `assets/og-image.png` at **1200×630** — this is what shows when someone
  shares your link in a text or on Facebook
- Add `assets/apple-touch-icon.png` at 180×180

---

## 2. Preview locally

```powershell
npx --yes http-server -p 8777 -c-1
```

Then open <http://localhost:8777>.

Note: `python -m http.server` won't work on this machine — the `python` command
is the Microsoft Store stub, not a real install. Use the Node command above.

---

## 3. Deploy — already done

Live on GitHub Pages at <https://ryanbowman19.github.io/>, served from `main`.
Push and it redeploys. HTTPS is automatic and enforced.

### Pointing a real domain at it later

When you buy `bowsites.com` (Cloudflare Registrar or Namecheap, ~$10/yr):

1. At your registrar, add these DNS records:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  ryanbowman19.github.io
   ```
2. GitHub repo → Settings → Pages → Custom domain → enter `bowsites.com` → Save
3. Wait for the DNS check, then tick **Enforce HTTPS**
4. Find-and-replace `https://ryanbowman19.github.io/` with `https://bowsites.com/`
   in `index.html`, `robots.txt`, and `sitemap.xml`, then push

A custom domain is worth the $10. `ryanbowman19.github.io` is fine for showing
people, but a web designer selling websites off a github.io subdomain invites
the obvious question.

---

## 4. Adding portfolio work

Copy the `<article class="case">` block in `index.html` and change the copy.

The mockups are **real HTML**, not images — a miniature website inside a browser
frame (`.mini`). Edit the text inside it to match each client. When you have an
actual screenshot, replace the whole `.mini` div with:

```html
<img src="assets/client-name.webp" width="1200" height="800" loading="lazy"
     decoding="async" alt="Homepage of Client Name's website">
```

Always include `width`, `height`, `loading="lazy"`, and a real `alt` — those
three attributes are most of what keeps the page fast and accessible.

**Export images as WebP at roughly 2× their display size, then stop.** A 4000px
hero photo is the single most common reason a small business site loads slowly.

---

## 5. Writing more copy in this voice

If you add sections later, keep the rules the rest of the page follows —
they're what stop it reading like every other web-design site.

**Never use:** delve · elevate · seamless · cutting-edge · bespoke · tapestry ·
unleash · unlock · transformative · beacon · premier · bustling · paramount ·
dive in. Also skip "solutions," "digital presence," "leverage," "robust,"
"streamline."

**Hard limits:** H1 ≤ 7 words. Hero subhead ≤ 2 sentences. No paragraph over
3 sentences. Active voice. Say "you," not "our clients." Write at a 6th-grade
level — if it'd sound odd said out loud at a parts counter, rewrite it.

**Vary sentence length.** Short one to land the point. Then a longer one to
explain it. Then short again.

Check yourself before committing:

```bash
grep -oiE "delve|elevate|seamless|cutting-edge|bespoke|tapestry|unleash|unlock|transformative|beacon|premier|bustling|paramount|dive in" index.html
```

No output means you're clean. Full rationale for every line on the page is in
`docs/03-copy-deck.md`.

---

## Browser support

Chrome, Edge, Firefox, and Safari — current and previous versions. The page uses
modern CSS (`color-mix()`, `:has()`-free selectors, container-friendly grid,
`text-wrap: balance`) that degrades gracefully: older browsers lose polish, not
function. No JavaScript required to read any content — only the calculator and
the multi-step form need it, and the form degrades to a normal POST.

## Accessibility

Built to WCAG 2.2 AA. Full color-contrast math in `docs/02-design-system.md`.
Keyboard navigable throughout, visible focus rings, `prefers-reduced-motion`
respected, live regions on the form steps, and a skip link. Re-test with
Lighthouse after you add images and real content.

---

## Docs

| File | What's in it |
|---|---|
| `docs/01-architecture.md` | Stack decision, rendering strategy, SEO and performance budget |
| `docs/02-design-system.md` | Palettes with contrast ratios, type scale, spacing, components |
| `docs/03-copy-deck.md` | Every line of copy, hierarchy rationale, the 8-second scan test |
| `docs/04-components.md` | Behavioural specs for the calculator, form, nav, FAQ |
| `docs/05-figma-prompts.md` | Five Figma Make prompts, simple → complex |
| `docs/06-ux-audit.md` | The audit framework applied to this site and to Waveland |
| `docs/07-speed-checklist.md` | Sub-2-second plan, budgets, and what to measure |
