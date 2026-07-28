# 04 — Component Blueprints

Behavioural specs for every interactive piece. Blueprints, not vibes.

---

## 1. Multi-step lead form

**Purpose:** capture a qualified enquiry without a wall of fields.

**Why three steps and not one.** A single form showing 8 fields reads as work,
and abandonment tracks visible field count more than actual field count. Three
steps of 1–4 fields each feels like answering questions rather than filling
paperwork. The first step is a single click — a radio choice with no typing —
which is the cheapest possible commitment and starts the sunk-cost effect
working for you.

### Hierarchy

```
form
├── progress            (bar + 3 numbered labels)
├── live region         (sr-only, aria-live="polite")
├── step 1  Project     radio ×4 → project_type          [required]
├── step 2  Details     business* · current_site · timeline* · budget · details
├── step 3  Contact     name* · email* · phone · honeypot · summary
└── success             (replaces the form in place)
```

### State

| State | Owner | Notes |
|---|---|---|
| `current` step index | JS closure | Single source of truth |
| Field values | The DOM | No mirroring — `FormData` reads it at submit |
| Per-field errors | DOM classes + `[data-error-for]` slots | Cleared on valid input |
| Estimate carry-over | `#estimate-field` hidden input | Written by the calculator |

Deliberately no state library, no serialization to `localStorage`. Progress is
lost on reload — acceptable for a 90-second form, and it avoids storing a
stranger's contact details on their machine.

### Validation

Validate **on step advance**, not on every keystroke. Validating as someone types
means telling them their email is invalid while they're still typing it, which is
hostile. Once a field *has* errored, it clears the moment it becomes valid —
that's the forgiving half of the pattern.

| Field | Rule | Message |
|---|---|---|
| `project_type` | one selected | Choose the one that fits best. |
| `business` | ≥ 2 chars | Please enter your business name. |
| `timeline` | non-empty | Pick a timeline so I know how to plan. |
| `name` | ≥ 2 chars | Please enter your name. |
| `email` | `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` | That email doesn't look right — I need it to reply. |

Messages say what to do, name the field, and give a reason where there is one.
Never "Invalid input."

Email validation stays loose on purpose. Strict RFC 5322 regexes reject valid
addresses and are a real source of lost leads; the only true test is sending mail.

### Micro-interactions

| Trigger | Response |
|---|---|
| Step advance | Content fades in +8px, 300ms; bar fills 33→66→100% over 350ms |
| Choice card select | Border → amber, background tint 12%, inset ring, label to 600 weight |
| Input focus | Border → amber + 3px ring at 26% opacity |
| Error appears | Border → red, background tint, message announced via `role="alert"` |
| Error resolves | Styling clears on the input event that makes it valid |
| Submit pending | Button `aria-busy`, label → "Sending…", pointer events off |
| Success | Form replaced by checkmark panel, focus moved to it |

All of it disabled under `prefers-reduced-motion: reduce`.

### Accessibility

- Each step is a `<fieldset>` with a `<legend>` as its visible title
- Step changes announce through a `aria-live="polite"` region:
  *"Step 2 of 3: Details"*
- Focus moves to the new step's heading (`tabindex="-1"`), not to the first
  input — so screen reader users hear the step title before its fields
- Errors: `aria-invalid` on the control, message in `role="alert"`
- Focus goes to the first failing field on a blocked advance
- Enter advances the step instead of submitting early — except in the textarea
- The honeypot is off-screen and `aria-hidden`, with `tabindex="-1"` so keyboard
  users never land in it

### Responsive

| Width | Behaviour |
|---|---|
| ≥ 900px | Two columns — reassurance copy left, form card right |
| < 900px | Stacks; copy first, form second |
| < 600px | Field rows collapse to single column; buttons full-width |
| Any | `inputmode` on email/tel/url so phones show the right keyboard |

### Failure paths

1. **No Formspree ID** → builds a `mailto:` with all answers in the body
2. **Network error** → button becomes "Try again", error names your direct email
3. **JS disabled** → the form is a plain POST; all three steps are in the DOM
   and only hidden by a class the CSS applies, so nothing is unreachable
4. **Bot** → honeypot filled, submit silently no-ops

---

## 2. Estimate calculator

**Purpose:** answer "what does this cost?" before the visitor has to ask, and
pre-qualify every lead that follows.

### Inputs

| Control | Type | Range |
|---|---|---|
| Project type | radio ×4 | landing / new / redesign / store |
| Page count | range | 1–20, step 1, default 5 |
| Add-ons | checkbox ×8 | booking, payments, blog, gallery, menu, logo, copy, photos |
| Care plan | radio ×3 | none / essential / growth |

### Formula

```
subtotal = base[type]
         + max(0, pages − included[type]) × perPage
         + Σ addon costs

low  = subtotal × 0.85
high = subtotal × 1.15
```

Timeline is derived from a scope weight (`pages + addons×2 + store bonus`) and
bucketed into 1–2 / 2–3 / 3–4 / 4–6 weeks.

The `±15%` band is the honest part. A single number invites a client to hold you
to it before scope exists; a band communicates "estimate" structurally, and the
fine print — *"often lower"* — leaves room for the quote to be good news.

### Real-time behaviour

Recomputes on every `input` and `change`. No debounce is needed — the whole
calculation is arithmetic over four values and finishes in microseconds.

The result panel is `aria-live="polite"`, so screen reader users hear the new
total after they stop interacting, rather than on each slider tick.

The line-item breakdown builds via `createElement` + `textContent`, not
`innerHTML` — no user string ever reaches the parser.

### Coupling to the rest of the page

- **Care plan cards read their prices from the same `PRICING.care` object.** The
  pricing section and the calculator cannot drift apart, because there's one
  number.
- **The result writes into a hidden field on the lead form.** When someone
  submits, the enquiry email contains the exact configuration they built.
- **The CTA pre-selects the matching project type in step 1** of the form, so
  the visitor doesn't answer the same question twice.

### Accessibility

- Range has a visible `<output>` showing the live value
- Every checkbox and radio is a real input inside a `<label>`; the styled box is
  a sibling `<span>` driven by `:checked` — no `div` pretending to be a control
- Focus ring on `:focus-visible + span` so keyboard operation is visible
- Fieldsets group each control set with a real `<legend>`
- Selection is indicated by border, background, *and* font weight — never by
  color alone

---

## 3. Sticky header + mobile nav

- Sticky, translucent, `backdrop-filter` blur, 68px tall
- Gains a border and shadow past 8px scroll (`.is-stuck`)
- `scroll-padding-top` on `<html>` so anchor targets aren't hidden beneath it
- **Scroll-spy** via `IntersectionObserver` with `rootMargin: -45% 0 -50% 0` —
  a section is "current" only when it crosses the middle band of the viewport,
  which prevents the flicker a naive top-edge check produces
- Below 920px: hamburger toggling `aria-expanded`, panel animated with
  `grid-template-rows: 0fr → 1fr` (animating to auto height without a hardcoded
  max-height hack), closes on link click and on `Escape` with focus returned to
  the button

---

## 4. Sticky mobile CTA bar

Appears once the hero leaves the viewport, **and hides again once the contact
form is in view.** That second condition is the part most implementations miss —
a floating CTA covering the form it points to is actively harmful, and on a
small phone in landscape it can obscure a field entirely.

Two IntersectionObservers, boolean AND, `transform: translateY` for a
compositor-only animation. `env(safe-area-inset-bottom)` keeps it clear of the
iPhone home indicator. Body gets bottom padding so it never covers the footer.

---

## 5. FAQ accordion

Native `<details>` / `<summary>` with `name="faq"` for exclusive-open behaviour.

Using the platform element instead of a scripted accordion gets keyboard support,
correct screen reader semantics, and in-page find (`Ctrl+F` reveals collapsed
content in current browsers) for free. `name` grouping degrades gracefully — in
a browser without support, multiple panels simply open at once.

The `+` icon rotates 45° into an `×` on open. `list-style: none` plus
`::-webkit-details-marker { display: none }` removes the default triangle.

---

## 6. Theme toggle

Three states, not two: **auto** (default, follows OS), **light**, **dark**.

`@media (prefers-color-scheme: dark)` supplies the default. `:root[data-theme]`
overrides it once the user chooses, persisted to `localStorage`. The icon and
`aria-label` reflect the *resolved* theme, so the button always says what it
will do rather than what state it's in.

---

## 7. Scroll reveal

`IntersectionObserver`, 8% threshold, unobserved after firing so nothing runs
twice. Elements stagger via `--i` on a `transition-delay`.

Entirely skipped when `prefers-reduced-motion: reduce` — and skipped in the
right way: the JS never adds the `.reveal` class at all, so content can't get
stuck invisible if the observer never fires. Reveal animations that hide content
by default are a genuine accessibility failure when they break; this one has no
failure mode that leaves text hidden.
