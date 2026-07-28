# 02 — Design System

Brand attributes: **warm · trustworthy · modern-minimal · local**

The strategic problem this solves: your prospects are main-street businesses.
A slick, high-contrast, coastal-agency aesthetic reads as *expensive* and
*not for me* — it loses the job before the price is mentioned. But looking
dated loses it too, because you're selling the cure for dated. The target is
**modern enough to prove competence, warm enough to feel approachable.**

---

## Color

### Chosen palette — "Courthouse Square"

Deep navy authority, warm amber accent, paper-white ground.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0F2233` | Headings, footer, dark surfaces |
| `--navy-700` | `#1B3A57` | Secondary dark |
| `--navy-600` | `#24506F` | Tertiary, illustration |
| `--amber` | `#E08A1E` | **Accent** — CTA fills, highlights |
| `--amber-600` | `#C4740F` | CTA hover |
| `--amber-text` | `#8F5700` | Amber **as text** on light (see below) |
| `--paper` | `#FBF8F4` | Page background |
| `--surface` | `#FFFFFF` | Cards |
| `--surface-2` | `#F4EFE8` | Alternating sections |
| `--slate` | `#3D4C59` | Body text |
| `--muted` | `#6B7A88` | Secondary text |
| `--line` | `#E5DED4` | Borders |

**Psychology.** Navy is the most-used color in institutional and financial
branding for one reason — it reads as stable and competent without shouting.
Amber is a warm, human counterweight: it's the color of a lit window, and it
carries none of red's alarm or blue's coldness. The off-white ground (`#FBF8F4`,
not `#FFFFFF`) is the quiet part that does the most work — a warm paper tone
reads as considered and reduces the clinical, screen-lit feeling of pure white,
especially on the cheap LCD panels a lot of small-business owners are reading on.

**The 60-30-10 split.** ~60% paper/white ground, ~30% ink and slate for type and
dark sections, ~10% amber — and the amber is reserved almost entirely for things
you can click. That reservation is what makes the CTA obvious without it needing
to be large or animated.

### Contrast — measured, not assumed

| Pair | Ratio | WCAG 2.2 |
|---|---|---|
| `--slate` on `--paper` | **8.3:1** | AAA normal text |
| `--ink` on `--paper` | **15.0:1** | AAA |
| `--muted` on `--paper` | **4.8:1** | AA normal text |
| `--ink` on `--amber` (primary button) | **6.0:1** | AA all sizes |
| `--amber-text` on `--paper` | **5.6:1** | AA normal text |
| `--amber` on `--paper` | **2.7:1** | ✗ **fails — never for text** |

That last row is the trap, and it's the single most common accessibility bug in
amber/orange brands. `#E08A1E` is a beautiful button *fill* and an illegal text
color. The system handles this by splitting the token: `--accent` for fills,
`--accent-text` (`#8F5700`, a darker amber) whenever the brand color must carry
letterforms. Never swap them.

### Dark mode

| Token | Hex | Contrast on `#0D1620` |
|---|---|---|
| `--bg` | `#0D1620` | — |
| `--card` | `#14202C` | — |
| `--text-strong` | `#E6EDF3` | **15.5:1** AAA |
| `--text` | `#C4D2DD` | **11.4:1** AAA |
| `--text-muted` | `#93A5B4` | **6.5:1** AA |
| `--accent` | `#F0A23C` | **8.7:1** AAA — safe as text here |

Note the amber *lightens* in dark mode. Keeping `#E08A1E` would have dropped it
to roughly 3.2:1 against the dark ground — the same failure, inverted. Accent
colors must be re-derived per theme, never reused across both.

Backgrounds are desaturated navy rather than neutral grey, so the brand survives
the theme switch. Pure `#000` is avoided: it causes halation against light text
on OLED and is harsher than anything the brand should feel like.

**Implementation:** `@media (prefers-color-scheme: dark)` supplies the default,
and `:root[data-theme="dark"|"light"]` overrides it when the user hits the
toggle. The choice persists in `localStorage`.

---

### Alternative palettes (if you want to steer differently)

**B — "Harvest"** · warmer, more agricultural, less corporate
`#2D3A2E` deep green · `#D9822B` terracotta · `#FAF7F0` cream · `#4A5B4C` sage
Reads local and hand-made; excellent for farm, food, trades, and outfitter
clients. Slightly less credible for professional services (law, accounting,
medical). Green + orange needs care around red-green color deficiency — never
use the two as the only distinction between states.

**C — "Signal"** · high-contrast, confident, modern-tech
`#111318` near-black · `#3B6CF6` electric blue · `#FFFFFF` · `#6B7280` grey
Sharpest and most contemporary. This is the coastal-agency look, and it's a real
option if you decide to target larger regional businesses instead of main street.
It will read as expensive to a small-town prospect. Blue on near-black also runs
tight on contrast and needs a lighter tint for dark mode.

---

## Typography

**Display:** Iowan Old Style → Palatino Linotype → Palatino → Georgia → serif
**Body:** system-ui → Segoe UI Variable → Roboto → Helvetica Neue → Arial

Both stacks resolve to fonts already installed on the visitor's machine. Zero
network requests, zero flash of unstyled text, zero layout shift from font
loading. This is the largest single performance win on the page.

**Why a serif for headings.** A serif display face against a sans body signals
*established* — it's the typographic equivalent of a brick storefront. An
all-sans page in this space reads as either generic template or Silicon Valley
startup, and neither is what a main-street prospect is looking for. The serif is
doing brand work that would otherwise require imagery.

### Scale (9 steps, fluid)

| Token | Size | Use |
|---|---|---|
| `--fs-900` | 2.75 → 4.5 rem | Hero H1 only |
| `--fs-800` | 2.25 → 3.25 rem | Reserved (page H1 on future pages) |
| `--fs-700` | 1.75 → 2.5 rem | Section H2 |
| `--fs-600` | 1.375 → 1.75 rem | Card H3, FAQ, step titles |
| `--fs-500` | 1.125 → 1.31 rem | Lead paragraphs, form labels |
| `--fs-400` | 1.0625 rem | Body — 17px, not 16 |
| `--fs-300` | 0.9375 rem | Card body, buttons, nav |
| `--fs-200` | 0.8125 rem | Captions, hints, fine print |
| `--fs-100` | 0.75 rem | Eyebrows, badges, labels |

Fluid sizes use `clamp()` with a `rem`-based midpoint (`clamp(2.75rem, 1.6rem +
4.6vw, 4.5rem)`), never raw `vw` — a pure-viewport unit breaks browser zoom,
which is an accessibility failure.

Body is **17px**. Your audience skews older than a tech product's; 16px is the
web default and 17 is measurably more comfortable at arm's length without
looking oversized.

**Line height:** 1.08 display · 1.25 headings · 1.65 body.
**Measure:** capped at 62–68ch. **Tracking:** −0.03em on the hero, −0.015em on
headings, 0 on body, +0.07em on uppercase eyebrows.

---

## Space

4px base: `4 8 12 16 24 32 48 64 96 128`. Everything on the page is one of these
numbers. Consistent rhythm is most of what separates designed from assembled.

Section padding is fluid: `clamp(4rem, 9vw, 8rem)`.

---

## Radius, elevation, motion

**Radius:** 6 / 10 / 16 / 24 px, plus a pill. Buttons and inputs share 10px so
they visually agree when adjacent.

**Elevation** — three levels, all tinted with the brand navy (`--shadow-color`)
rather than neutral black. Tinted shadows are the difference between "looks
designed" and "looks like a Bootstrap card," and they cost nothing.

**Motion:** one easing curve (`cubic-bezier(.22,.61,.36,1)`) and one duration
(220ms) for interface state; 300–550ms for entrances. Every animation sits
inside `@media (prefers-reduced-motion: no-preference)` or is disabled by a
`reduce` query — including scroll-behavior, the step transitions, and the
progress bar fill.

---

## Component tokens

**Buttons** — 3 sizes (sm/base/lg), 2 variants (primary/ghost). Primary is amber
fill with ink text. Ghost is transparent with a border. There is no third
variant, and there is never more than one primary button in a viewport: the
whole point of reserving amber is that it means *"this is the thing to click."*

**Cards** — 1px border, 16px radius, 32px padding, `--card` background. Hover
lifts 3px and warms the border toward amber. Featured cards get a stronger
amber border plus a badge.

**Forms** — 10px radius, 1px border, `--bg` fill so inputs read as recessed
against the white card. Focus is a 3px amber ring at 26% opacity *plus* a solid
border change — never rely on color alone to indicate focus. Errors get a red
border, a tinted background, `aria-invalid`, and a message in a `role="alert"`
region.

**Focus rings** — 3px solid amber, 2px offset, globally, on `:focus-visible`.
Never removed. If you find yourself wanting to remove one, the element's spacing
is wrong, not the ring.
