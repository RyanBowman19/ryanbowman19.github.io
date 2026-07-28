# 05 — Figma Make Prompts

Five prompts derived from the built site, simple → complex. Each one is
self-contained: brand context, sections, interactions, and responsive behaviour,
leading with the outcome rather than the process.

**Shared brand context** (already embedded in each prompt below — repeated here
so you can splice it into new ones):

> Deep navy `#0F2233`, warm amber `#E08A1E`, paper white `#FBF8F4`, slate text
> `#3D4C59`. Serif display headings (Georgia/Palatino feel), clean sans body.
> Warm, trustworthy, modern-minimal. Generous white space, tinted soft shadows,
> 16px card radius.

---

## Prompt 1 — Hero only *(simplest)*

> Build a web-design agency hero section with a warm, trustworthy,
> modern-minimal aesthetic. Use deep navy `#0F2233` for headings, warm amber
> `#E08A1E` for the primary button, and a paper-white `#FBF8F4` background.
> Serif display headline, clean sans body text.
>
> Layout: two columns on desktop. Left — a small uppercase amber eyebrow
> "Web design for Indiana businesses", a large serif headline "Websites that
> turn searches into customers", a 2-line subheadline in muted grey, one amber
> primary button "Get my free site review" with a right-arrow icon, one
> outlined secondary button "See a site I built", and a row of three checkmark
> trust items. Right — a browser-window mockup with a rounded frame, a title bar
> with three coloured dots and a URL pill, and a simplified wireframe page
> inside.
>
> Interactions: buttons lift with a soft shadow on hover and the arrow slides
> 4px right. Responsive: stacks to one column under 940px, headline scales from
> 44px to 72px fluidly. Subtle fade-up entrance animation.

---

## Prompt 2 — Services + process

> Build two stacked sections for a web-design agency site. Warm, trustworthy,
> modern-minimal. Navy `#0F2233`, amber `#E08A1E`, paper `#FBF8F4`, cards in
> pure white with 1px `#E5DED4` borders and 16px radius.
>
> Section 1 "Three ways to work together": a left-aligned header block with an
> uppercase amber eyebrow, serif H2, and a muted lead paragraph — then three
> equal cards. Each card has a 46px rounded icon tile with a 14%-opacity amber
> background, a serif H3, an italic-feel "who it's for" line separated by a
> hairline rule, four checkmark bullets with green ticks, and an amber text link
> with an arrow at the bottom. The middle card is featured: amber border and a
> small amber "Most requested" pill badge overlapping the top edge.
>
> Section 2 "Four steps, no mystery" on a warm tinted `#F4EFE8` background: four
> numbered cards in a row. Each has a 38px navy circle with a white serif
> numeral, a serif H3, two lines of body copy, and a small uppercase amber
> timing label pinned to the bottom.
>
> Interactions: cards lift 3px on hover with the border warming toward amber;
> link arrows slide right. Responsive: three columns → two → one; the four steps
> go 4 → 2 → 1. Fade-up on scroll with a 70ms stagger.

---

## Prompt 3 — Pricing + estimate calculator

> Build a pricing section with an interactive cost estimator for a web-design
> agency. Warm, trustworthy, modern-minimal — navy `#0F2233`, amber `#E08A1E`,
> paper `#FBF8F4`, serif headings.
>
> Two-column layout, 1.35fr / 1fr. **Left** — a white card containing four
> grouped control sets: (1) four pill-shaped radio chips for project type,
> (2) a range slider 1–20 with the live value shown in large amber serif beside
> the label, (3) an eight-item grid of checkbox chips for add-ons, (4) three
> radio chips for care plan. Selected chips get an amber border, a 12% amber
> background tint, and bolder text.
>
> **Right** — a sticky dark navy result panel with: a small uppercase muted
> label, a large white serif price range "$1,700 – $2,300" with the dash in
> amber, a line-item breakdown list separated by hairline rules at 12% white
> opacity, a lightning-bolt icon with an estimated timeline, a full-width amber
> button "Get this quoted for real", and small muted fine print.
>
> Below, three pricing cards: Self-managed, Essential (featured, amber border,
> "Most popular" badge), and Growth. Each shows a large serif price with a
> smaller "/month" suffix, a description line under a hairline rule, checkmark
> features, and a full-width button.
>
> Interactions: chips animate their fill on select; the number counts up on
> change; the slider thumb is a 24px amber circle with a white ring and soft
> shadow. Responsive: columns stack under 900px and the result panel stops being
> sticky.

---

## Prompt 4 — Full one-page site

> Build a complete one-page website for "Bowsites", a solo web-design business
> serving local Indiana businesses. Aesthetic: warm, trustworthy,
> modern-minimal — the opposite of a slick coastal agency. Deep navy `#0F2233`
> headings, warm amber `#E08A1E` accent used only for clickable things, paper
> white `#FBF8F4` ground alternating with warm tint `#F4EFE8`, slate `#3D4C59`
> body text. Serif display type (Palatino/Georgia character), clean sans body,
> 17px base size.
>
> Sections in order:
> 1. **Sticky header** — wordmark with a small navy rounded-square logo mark,
>    five nav links, a theme toggle icon, and an amber button. Translucent with
>    backdrop blur; gains a border and shadow on scroll.
> 2. **Hero** — eyebrow, serif H1 "Websites that turn searches into customers",
>    subhead, two buttons, three trust items. Right side: a browser mockup with
>    an overlapping phone mockup and a floating white "98 PageSpeed score" chip.
>    Soft amber and navy radial glows behind, heavily blurred.
> 3. **Problem** — "If they can't find you, they find someone else", three cards
>    with icon tiles.
> 4. **Services** — three cards, middle one featured with a badge.
> 5. **Case study** — two columns, a large browser mockup left, copy with
>    checkmark bullets and a three-metric row divided by hairline rules right.
> 6. **Process** — four numbered cards on tinted ground.
> 7. **Estimate calculator** — controls left, sticky dark navy result panel right.
> 8. **Care plans** — three pricing cards.
> 9. **FAQ** — eight accordion rows, white cards, amber `+` icon rotating to `×`.
> 10. **Contact** — reassurance copy left; a three-step form right in a white
>     card with 24px radius, an amber progress bar, and numbered step labels.
> 11. **Footer** — navy, three columns, base bar with copyright.
>
> Interactions: fade-up on scroll with stagger, cards lift on hover, arrows
> slide right, focus rings in 3px amber. A sticky mobile CTA bar slides up from
> the bottom after the hero scrolls away. Fully responsive at 1180 / 940 / 720 /
> 480. Include a dark mode where backgrounds become `#0D1620`/`#14202C` and the
> amber lightens to `#F0A23C`.

---

## Prompt 5 — Full site + design system *(most complex)*

> Build a complete design system and a one-page marketing site for "Bowsites",
> a solo web-design business serving local Indiana businesses.
>
> **First, generate the system as a documented page:**
> - Colour: navy ramp (`#0F2233`, `#1B3A57`, `#24506F`, `#7E9BB3`), amber ramp
>   (`#E08A1E` fill, `#C4740F` hover, `#8F5700` for amber *text* on light),
>   warm neutrals (`#FBF8F4`, `#FFFFFF`, `#F4EFE8`, `#E5DED4`), text
>   (`#0F2233`, `#3D4C59`, `#6B7A88`), semantic (`#1E7A4C` ok, `#A8660A` warn,
>   `#B3261E` error). Full dark-mode set on `#0D1620`/`#14202C` with amber
>   lightened to `#F0A23C`. Label every pair with its contrast ratio and flag
>   that raw amber must never carry text on light backgrounds.
> - Type: 9-step fluid scale from 12px to 72px, serif display + sans body,
>   line heights 1.08 / 1.25 / 1.65.
> - Space: 4px base — 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
> - Radius 6/10/16/24/pill; three elevation levels using navy-tinted shadows;
>   one easing curve and one 220ms duration.
> - Components: buttons (primary/ghost × sm/base/lg × default/hover/focus/
>   disabled), cards (default/hover/featured), form fields (default/focus/
>   error/disabled), choice chips, badges, accordion rows, progress bar.
>
> **Then build the site using only those tokens:** sticky header, hero with
> layered browser + phone mockups and a floating score chip, problem cards,
> service cards, a case study with metrics, a four-step process, an interactive
> estimate calculator with a sticky dark result panel, three pricing tiers, an
> eight-row FAQ accordion, a three-step contact form with a progress bar, and a
> navy footer. Add a sticky mobile CTA bar that appears after the hero.
>
> Every interactive element needs hover, focus, and active states with a visible
> 3px amber focus ring. Animate with fade-up entrances staggered 70ms, and
> include a reduced-motion variant with all motion removed. Responsive
> breakpoints at 1180 / 940 / 900 / 720 / 480. Deliver light and dark themes.

---

## Using these

- Feed **one prompt at a time**. Figma Make degrades when asked for the whole
  system and the whole site in a single pass — Prompt 5 works best split at the
  "Then build the site" line.
- The hex values are load-bearing. Removing them is the fastest way to get a
  generic purple-gradient result.
- If output drifts generic, re-anchor on the negative constraint: *"the opposite
  of a slick coastal agency — this should feel like a competent local business,
  not a startup."*
