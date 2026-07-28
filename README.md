# Bowsites

**Live: <https://ryanbowman19.github.io/>**

Marketing site for Bowsites — web design for small businesses.

Deployed on GitHub Pages from the `main` branch. **Push to `main` and the site
updates itself** — usually live within a minute. No build, no deploy step.

```powershell
git add -A
git commit -m "Update pricing"
git push
```

> **If a change looks like it didn't deploy, it's your browser cache.**
> GitHub Pages tells browsers to hold `styles.css` and `script.js` for about
> ten minutes. Your own browser keeps serving the old copy even after the
> new one is live. Press **Ctrl+Shift+R** to force a fresh load before
> concluding something is broken. Real first-time visitors always get the
> current version — this only affects people who've been to the site before.

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

### a) Your contact details — ✓ done

Open `script.js`. The first block is the only place your details live — every
link, the footer, the mobile call button, and the search-engine markup read
from it. Current state:

```js
const SITE = {
  email:  'bowmanryan328@gmail.com',   // ✓ live
  phone:  '(765) 376-8599',            // ✓ live
  area:   'Indiana',                   // ✓ works, but narrow it to your counties
  formspreeId: 'mqerndon',             // ✓ live
};
```

**Narrow the service area.** "Indiana" is vague and ranks for nothing. Something
like `'Montgomery, Parke & Putnam counties'` reads better in the FAQ and gives
Google an actual place to associate you with.

The page hides broken links rather than showing dead ones, and logs a checklist
to the browser console listing whatever's still missing.

### b) Booking link — ✓ live

`SITE.booking` points at <https://calendly.com/bowmanryan328>. The "Or book a
20-minute call" button appears under the contact form.

Three things to check inside Calendly, because they cost you bookings:

1. **Make a 20-minute event type** named something like "Free site review."
   A bare Calendly root URL shows every event type you have, which is a
   confusing first impression. A single named event converts better.
2. **Connect your Google Calendar** so it only offers times you're genuinely
   free. Nothing kills trust faster than a booking you have to cancel.
3. **Strip the invitee questions down to name and email.** Every extra field
   loses bookings, and you'll ask the rest on the call anyway.

If you make a dedicated event type, update `SITE.booking` to that fuller URL
(e.g. `https://calendly.com/bowmanryan328/site-review`).

### c) Contact form — ✓ connected, but test it

Wired to Formspree form `mqerndon`. Submissions land in
`bowmanryan328@gmail.com`.

**Send yourself a test message from the live site right now.** Formspree
requires you to confirm the form on first submission, and until you do,
real enquiries may not reach you. Do this before you give the link to anyone.

Free tier covers 50 submissions a month. If you outgrow it, the paid tier is
cheap, or swap to Netlify Forms by moving the site to Netlify.

### d) Testimonials — none on the page, by design

The section was removed rather than shipped with invented quotes. Markup and
guidance for adding real ones are in `docs/03-copy-deck.md`.

Ask a client right after launch: *"What were you worried about before we
started?"* That gets usable words instead of "very professional." Get written
permission to use their name and business.

Publishing invented reviews breaks FTC rules and carries real penalties.

### e) Case-study numbers — currently hidden

The Waveland metrics row and the hero speed chip are both commented out in
`index.html`, because neither number had been measured.

Run [PageSpeed Insights](https://pagespeed.web.dev) against
`waveland.lib.in.us` and against your own live URL, then uncomment those blocks
and fill in the real figures. A web designer caught with an unverified speed
claim on their own site has a hard afternoon.

### f) Set your real prices

`script.js` → the `PRICING` object. Every number the estimator uses is there,
including the care-plan prices, which the pricing cards read automatically so
the two sections can never disagree.

The values shipped are placeholders based on typical small-market rates. Change
them to yours before launch.

### g) Social image — ✓ done

`assets/og-image.png` (1200×630) is what shows when your link is shared to
LinkedIn, Facebook, or a text message. To change it, edit
`assets/og-image.svg` and re-run:

```powershell
npx --yes -p sharp node tools/make-og.js
```

After changing it, re-scrape the URL at
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) so it stops
serving the cached old one.

Still missing: `assets/apple-touch-icon.png` at 180×180 (the icon shown when
someone saves the site to a phone home screen). Minor.

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

### Moving to bowsites.com

`bowsites.com` was unregistered as of 2026-07-28 — confirm at checkout, the
registrar is the only real authority.

**1. Buy it.** [Cloudflare Registrar](https://domains.cloudflare.com) sells at
cost (~$10/yr, no upsells, free WHOIS privacy). [Porkbun](https://porkbun.com)
and [Namecheap](https://namecheap.com) are fine too. Avoid GoDaddy — the
headline price renews much higher and the checkout is a minefield of add-ons.
Decline every extra; you need none of them.

**2. Add DNS records** at the registrar:

```
Type   Name   Value
A      @      185.199.108.153
A      @      185.199.109.153
A      @      185.199.110.153
A      @      185.199.111.153
CNAME  www    ryanbowman19.github.io
```

All four A records — they're GitHub's load balancers, not alternatives.

**3. Tell GitHub.** Repo → Settings → Pages → Custom domain → `bowsites.com`
→ Save. Wait for the green check (minutes to a few hours while DNS spreads).

**4. Update the site:**

```powershell
.\tools\switch-to-domain.ps1 -Domain bowsites.com -WhatIf   # preview
.\tools\switch-to-domain.ps1 -Domain bowsites.com           # apply
git add -A
git commit -m "Point the site at bowsites.com"
git push
```

That writes the `CNAME` file and rewrites all seven absolute URLs across
`index.html`, `robots.txt`, and `sitemap.xml`.

**5. Tick Enforce HTTPS** in Settings → Pages once it's available. The
certificate can take up to an hour. Normal.

`ryanbowman19.github.io` keeps working and redirects, so nothing breaks.

---

## 3b. Getting found on Google

**A new site is invisible until you tell Google it exists.** Nothing links to
it, so nothing will crawl it on its own. Expect days to weeks even after you
submit it — and being indexed is not the same as ranking.

If you're buying the domain, **do this after the switch**, not before, or
you'll do it twice.

### Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. **Add property** → **Domain** (left box) if you own the domain — enter
   `bowsites.com`. Otherwise use **URL prefix** (right box) with the full
   `https://ryanbowman19.github.io/`
3. Verify:
   - *Domain property* → Google gives you a TXT record. Add it at your
     registrar alongside the A records above.
   - *URL prefix* → choose **HTML tag**, copy the `content="..."` value, and
     add this to `<head>` in `index.html`, then push:
     ```html
     <meta name="google-site-verification" content="PASTE_VALUE_HERE">
     ```
4. Once verified: **Sitemaps** → enter `sitemap.xml` → Submit
5. **URL Inspection** → paste your homepage → **Request indexing**. This is the
   fastest nudge available.

### Bing too, it takes two minutes

[bing.com/webmasters](https://www.bing.com/webmasters) lets you import
straight from Search Console. Bing also feeds DuckDuckGo and ChatGPT search.

### What actually makes "bowsites" find you

Ranking for your own brand name needs signals beyond the page itself:

- **A Google Business Profile** — free, and the strongest single move if you
  ever operate under a real business name
- **Links from anywhere real** — your GitHub profile, LinkedIn, any directory,
  the footer of sites you build (with the client's permission)
- **Consistent naming** — the same business name and contact details wherever
  you appear online
- **Time.** A domain registered this week ranks worse than the same domain will
  in six months. Nothing legitimate shortcuts this.

Anyone offering to fix your rankings for a fee is selling you something.

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
