# Bowsites

Marketing site for Bowsites — web design for local Indiana businesses.

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

### a) Your contact details

Open `script.js`. The first block is the only place your details live — every
link, the footer, the mobile call button, and the search-engine markup all read
from it.

```js
const SITE = {
  email:  'ryan@bowsites.com',
  phone:  '(765) 555-0142',
  area:   'Montgomery, Parke & Putnam counties',
  formspreeId: 'xnqrkvbz',
};
```

Until you fill these in, the page hides the broken links rather than showing dead
ones, and logs a checklist to the browser console telling you what's still missing.

### b) Connect the contact form

The form has no backend — it needs a form service. Free tier is plenty.

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form, point it at your email
3. Copy the form ID from the endpoint URL — in
   `https://formspree.io/f/xnqrkvbz` the ID is `xnqrkvbz`
4. Paste it into `SITE.formspreeId`

**Without an ID, the form still works** — it falls back to opening the visitor's
email client with everything pre-filled. That loses a meaningful share of leads,
so do the two-minute setup.

Netlify Forms is a fine alternative if you host on Netlify: add
`netlify` and `name="contact"` to the `<form>` tag instead.

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

Just double-click `index.html`. For a proper local server (recommended, since
`file://` behaves differently from real hosting):

```powershell
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

---

## 3. Deploy

All three options are free and take under five minutes. Pick one.

**Cloudflare Pages** — fastest network, best for a speed-focused pitch
1. Push this folder to a GitHub repo
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo
3. Build command: *leave blank*. Output directory: `/`
4. Add your custom domain under the project's Custom Domains tab

**Netlify** — easiest
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this folder onto the page. Done.
3. Site settings → Domain management to attach your domain

**GitHub Pages**
1. Push to a repo named `bowsites`
2. Settings → Pages → Source: `main`, folder `/ (root)`

All three give you free HTTPS automatically.

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
