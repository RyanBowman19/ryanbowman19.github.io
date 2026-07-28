# 06 — UX Audit

Two things here: the framework applied to **waveland.lib.in.us** (your portfolio
piece — findings are from an actual fetch of the live site, not assumed), and
the same framework turned on **this site**. Then the reusable version you can
run as a lead magnet.

---

# Part 1 — Audit: waveland.lib.in.us

**Platform:** WordPress · "A Connect IN site"
**Audited:** 2026-07-28 · structural/content audit from page source

## What's working

- **Nine-item navigation covers the real jobs** — Catalog, Events, Services,
  Research, Extras, About & History, Policies, Contact. The catalog link goes
  straight out to Evergreen rather than burying it a level deep.
- **Catalog search is on the page, not behind a click.** For a library this is
  the single highest-frequency task and it's correctly the most prominent
  interactive element.
- **Phone number appears in multiple locations** including near the top. For a
  small-town library where a lot of patrons will just call, this is right.
- **A published accessibility statement.** Rare on small institutional sites and
  a genuine credibility marker — use this when pitching civic clients.
- **Heading structure is clean.** H1 → H2 sections → H3 subsections, no skipped
  levels. Screen reader navigation works.
- **The history content is a real asset.** The Carnegie building, the 1915
  founding, the T.C. Steele connection — this is the kind of specific local
  detail that makes a site feel like a place rather than a template.

## Friction points, ranked by impact

### 1. Hours are below the fold — highest-value fix

Hours live mid-page under "Visit Us." For a library, **"are you open right now?"
is plausibly the most common question the site is asked**, and it currently
costs a scroll and a scan.

> **Fix:** put a compact hours block in the header or immediately under the
> hero, alongside the phone number that's already there. Better still, render
> today's hours as a single line — *"Open today until 6:00"* — which is what the
> visitor actually wants. That's a small amount of PHP against the existing
> hours table and it's the kind of touch that makes a client tell other people
> about you.

### 2. CTA wording is inconsistent in person and voice

The page mixes imperative-to-you ("Get Your Free Library Card", "Plan Your
Visit", "Start researching") with first-person-plural-as-noun ("Our services",
"Visit Us"). "Our services" is the weakest — it describes a page, not an action.

> **Fix:** standardize on second-person imperative. "Our services" → *"See what
> we offer"* or *"Browse services."* "Visit Us" as a button → *"Plan your
> visit."* Small, but it's the difference between a menu and an invitation.

### 3. Two competing top-of-page messages

"Serving Our Community Since 1915" and "A Place to Read, Learn, and Gather" are
both H2s doing hero work, followed by "Our Mission" and "Information, Education
& Community." Four mission-flavoured statements before the visitor reaches a
task.

> **Fix:** pick one line for the hero. Move the rest into the About/History
> page, which already exists and is the right home for them. Institutional
> sites consistently over-weight mission at the top; visitors arrive with a
> task, not a question about values.

### 4. No on-site search

There's catalog search (external, Evergreen) but nothing that searches the site
itself. A patron looking for the meeting-room policy or the notary service has
to guess which of nine nav items holds it.

> **Fix:** WordPress ships site search. Add it to the header, clearly labelled
> so it's not confused with the catalog search — *"Search this site"* vs
> *"Search the catalog."* Two search boxes on a page is normally a smell; on a
> library site it's correct, as long as they're labelled.

### 5. Events don't surface on the homepage

"View the calendar" links out to the Events page. The homepage doesn't show
what's actually happening.

> **Fix:** pull the next 2–3 upcoming events onto the homepage with dates. It's
> a standard WordPress query, it makes the site look maintained on every visit,
> and "what's on this week" is a top-three reason people check a library site.

### 6. Single social link

Facebook only, in the footer. If the library posts closures to Facebook — and
most small libraries do — that feed is load-bearing information sitting at the
bottom of the page.

> **Fix:** if closures go to Facebook, mirror them into an alert banner
> component on the site. Never make weather closures a Facebook-only channel;
> a meaningful share of patrons don't have an account.

## Mobile opportunities

Confirm on a real device, but structurally:

- **Hours below the fold hurts more on mobile** — that's several thumb-scrolls,
  not one glance. Fix #1 pays double here.
- **Nine nav items** will be a hamburger on mobile. Verify the toggle has a
  visible focus state and closes on `Escape`.
- **Tap targets ≥ 44×44px** — check the footer link lists especially, which are
  where cramped spacing usually survives review.
- **Make the phone number a `tel:` link.** If it's plain text anywhere, a mobile
  patron has to memorize and retype it. Highest effort-to-value ratio on the list.
- **Verify the hours table doesn't force horizontal scroll.** Tables are the
  most common cause of a horizontally-scrolling body on small screens; it needs
  an `overflow-x: auto` wrapper or a stacked layout below ~480px.

## Conversion framing

A library's "conversions" are: **found the hours · searched the catalog · got a
card · came to an event.** Ranked by impact on those four:

| Priority | Fix | Effort |
|---|---|---|
| 1 | Today's hours near the top | Low |
| 2 | `tel:` links everywhere | Trivial |
| 3 | Upcoming events on the homepage | Low |
| 4 | Standardize CTA wording | Trivial |
| 5 | Site search in the header | Low |
| 6 | Consolidate the hero message | Low |
| 7 | Closure/alert banner component | Medium |

**Not verified in this pass** — needs a browser and a real device: actual load
times, Core Web Vitals, image weight, colour contrast ratios, focus-visible
behaviour, and screen reader flow. Run PageSpeed Insights and axe DevTools
before you quote any of the above as fact.

---

# Part 2 — This site, audited by the same framework

Auditing your own work is worth doing in writing, because it forces you to name
the trade-offs you made on purpose.

## Friction points, accepted

| Friction | Why it's accepted |
|---|---|
| Long single page | This audience scrolls rather than navigates. Anchor nav + scroll-spy mitigates. |
| Form asks 3 steps, not 1 | Step 1 is one click. Perceived length beats actual length. |
| Prices shown before contact | Loses tire-kickers on purpose; qualifies everyone who remains. |
| No testimonials | You don't have real ones yet, and fake ones are disqualifying. Add when you do. |

## CTA placement

One primary action — *start a free review* — repeated at seven scroll depths so
the visitor is never more than one screen from converting, and never has to
scroll back up:

hero → problem closer → each service card → estimate panel → each pricing card
→ contact → footer. Plus the sticky mobile bar between the hero and the form.

**One amber element per viewport.** Because amber is reserved for actions, the
next step is always the most visually prominent thing on screen without needing
to be large or animated. This is the whole reason for the 10% accent discipline
in the design system.

## Known gaps to close after launch

- Real metrics in the case study (three `—` placeholders in the HTML)
- Verify or delete the "98 PageSpeed" hero chip against a real measurement
- Second and third portfolio pieces — one case study reads thin
- `sitemap.xml` and `robots.txt`
- Google Business Profile for Bowsites itself, which matters more than any of
  the above for local search

---

# Part 3 — The reusable audit template

This is the deliverable behind "free site review." Package it as a 1–2 page PDF
and it's the thing that gets you the call.

```
FREE SITE REVIEW — [BUSINESS] — [DATE]

1. FIRST IMPRESSION (8-second test)
   □ Is it obvious what the business does?
   □ Is it obvious how to contact them?
   □ Does it look current, or dated?
   □ Is there one clear next action?

2. THE FOUR THINGS PEOPLE CAME FOR
   □ Hours          — visible without scrolling?
   □ Phone          — a tap-to-call link?
   □ Location       — address + map?
   □ What you sell  — above the fold?

3. MOBILE (test on a real phone, not a resized window)
   □ No horizontal scrolling
   □ Text readable without zoom (16px+)
   □ Tap targets ≥ 44×44px
   □ Menu opens and closes cleanly
   □ Forms usable with a thumb

4. SPEED (PageSpeed Insights, mobile)
   □ LCP under 2.5s
   □ Score above 80
   □ Largest image under 300KB
   Note the single heaviest asset — it's usually one uncompressed photo.

5. FOUND ON GOOGLE
   □ Google Business Profile claimed and complete
   □ Unique page title per page
   □ Meta description present
   □ HTTPS
   □ NAP (name/address/phone) consistent everywhere

6. TRUST
   □ Real photos, not stock
   □ Reviews or testimonials
   □ A named human
   □ Copyright year current

7. THE THREE THINGS I'D FIX FIRST
   1. [highest impact, lowest effort]
   2.
   3.

Estimated impact: ___    Estimated effort: ___
```

**How to use it as a sales tool:** fill it out honestly, including the parts
already working. A review that's all criticism reads as a sales pitch; one that
says "your Google profile is in good shape, here are the three things that
aren't" reads as advice — and advice is what gets a reply.
