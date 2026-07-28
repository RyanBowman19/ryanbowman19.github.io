/* ══════════════════════════════════════════════════════════════════════
   BOWSITES — site behaviour
   No dependencies, no build step. Runs deferred, after HTML parse.
   ══════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════
     ┌─────────────────────────────────────────────────────────────┐
     │  EDIT THIS BLOCK — it's the only place your details live.   │
     │  Everything on the page updates from here.                  │
     └─────────────────────────────────────────────────────────────┘
     ═══════════════════════════════════════════════════════════════ */
  const SITE = {
    email:  'bowmanryan328@gmail.com',
    phone:  '(765) 376-8599',
    area:   'Indiana',         // narrow this to your counties — it reads better and ranks better

    // Formspree form ID (from https://formspree.io/f/mqerndon).
    // Blank falls back to opening the visitor's email client.
    formspreeId: 'mqerndon',
  };

  /* Project pricing — every number the estimator uses. Tune freely. */
  const PRICING = {
    base:    { landing: 700, new: 1500, redesign: 1200, store: 3200 },
    included:{ landing: 1,   new: 5,    redesign: 5,    store: 8    },
    perPage: 150,
    addons: {
      booking:  { label: 'Online booking',   cost: 350 },
      payments: { label: 'Take payments',    cost: 450 },
      blog:     { label: 'News / blog',      cost: 300 },
      gallery:  { label: 'Photo gallery',    cost: 250 },
      menu:     { label: 'Menu / price list',cost: 200 },
      logo:     { label: 'Logo design',      cost: 400 },
      copy:     { label: 'Copywriting',      cost: 450 },
      photo:    { label: 'On-site photos',   cost: 350 },
    },
    care:   { none: 0, essential: 45, growth: 95 },
    spread: 0.15,     // ± range shown around the midpoint
  };

  /* ═══════════════════════════════════════════════════════════════
     Helpers
     ═══════════════════════════════════════════════════════════════ */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const isPlaceholder = v => !v || v.startsWith('REPLACE_');

  /* ═══════════════════════════════════════════════════════════════
     1. Inject contact details everywhere
     ═══════════════════════════════════════════════════════════════ */
  function applySiteConfig() {
    const emailOk = !isPlaceholder(SITE.email);
    const phoneOk = !isPlaceholder(SITE.phone);
    const areaOk  = !isPlaceholder(SITE.area);

    if (emailOk) {
      $$('[data-site="email"]').forEach(el => { el.textContent = SITE.email; });
      $$('[data-site="mailto"]').forEach(el => { el.href = `mailto:${SITE.email}`; });
    }
    if (phoneOk) {
      const tel = SITE.phone.replace(/[^\d+]/g, '');
      $$('[data-site="phone"]').forEach(el => { el.textContent = SITE.phone; });
      $$('[data-site="tel"]').forEach(el => { el.href = `tel:${tel}`; });
    }
    if (areaOk) {
      $$('[data-site="area"]').forEach(el => { el.textContent = SITE.area; });
    }

    // Hide contact rows that have no real value yet, so nothing broken ships.
    if (!emailOk) $$('.contact-line[data-site="mailto"]').forEach(el => el.remove());
    if (!phoneOk) {
      $$('.contact-line[data-site="tel"]').forEach(el => el.remove());
      $('#mobile-cta')?.querySelector('[data-site="tel"]')?.remove();
    }
    // …and drop the whole block if that left it with nothing but a heading.
    if (!emailOk && !phoneOk) $('.contact-direct')?.remove();
    $$('.footer-contact li').forEach(li => {
      if (!li.textContent.trim() || li.textContent.trim() === '—') li.remove();
    });

    // Structured data for search engines
    const ld = $('script[type="application/ld+json"]');
    if (ld) {
      try {
        const data = JSON.parse(ld.textContent);
        if (emailOk) data.email = SITE.email; else delete data.email;
        if (phoneOk) data.telephone = SITE.phone; else delete data.telephone;
        if (areaOk)  data.areaServed = { '@type': 'Place', name: SITE.area };
        ld.textContent = JSON.stringify(data);
      } catch { /* leave the original markup alone */ }
    }

    if (!emailOk || !phoneOk || !areaOk || !SITE.formspreeId) {
      console.warn(
        '[Bowsites] Setup incomplete. Open script.js and fill in the SITE block:\n' +
        `  email:       ${emailOk ? '✓' : '✗ missing'}\n` +
        `  phone:       ${phoneOk ? '✓' : '✗ missing'}\n` +
        `  area:        ${areaOk  ? '✓' : '✗ missing'}\n` +
        `  formspreeId: ${SITE.formspreeId ? '✓' : '✗ missing (form will use email fallback)'}`
      );
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     2. Theme toggle — respects OS default until the user overrides
     ═══════════════════════════════════════════════════════════════ */
  function initTheme() {
    const root   = document.documentElement;
    const toggle = $('#theme-toggle');
    if (!toggle) return;

    const stored = localStorage.getItem('bowsites-theme');
    if (stored === 'light' || stored === 'dark') root.dataset.theme = stored;

    const isDark = () =>
      root.dataset.theme === 'dark' ||
      (root.dataset.theme !== 'light' &&
       matchMedia('(prefers-color-scheme: dark)').matches);

    const sync = () => {
      toggle.setAttribute('aria-label',
        isDark() ? 'Switch to light theme' : 'Switch to dark theme');
    };
    sync();

    toggle.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('bowsites-theme', next);
      sync();
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     3. Header: stuck shadow, mobile nav, scroll-spy
     ═══════════════════════════════════════════════════════════════ */
  function initHeader() {
    const header = $('#site-header');
    const toggle = $('#nav-toggle');
    const nav    = $('#nav');

    if (header) {
      const onScroll = () => header.classList.toggle('is-stuck', scrollY > 8);
      addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (toggle && nav) {
      const setOpen = open => {
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      };
      toggle.addEventListener('click', () =>
        setOpen(!document.body.classList.contains('nav-open')));
      nav.addEventListener('click', e => {
        if (e.target.closest('a')) setOpen(false);
      });
      addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
          setOpen(false);
          toggle.focus();
        }
      });
    }

    // Highlight the section you're currently reading
    const links = $$('.nav-list a[href^="#"]');
    const map = new Map();
    links.forEach(a => {
      const target = document.getElementById(a.hash.slice(1));
      if (target) map.set(target, a);
    });
    if (!map.size) return;

    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => a.classList.remove('is-current'));
        map.get(entry.target)?.classList.add('is-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    map.forEach((_, section) => spy.observe(section));
  }

  /* ═══════════════════════════════════════════════════════════════
     4. Sticky mobile CTA — shows once the hero is out of view
     ═══════════════════════════════════════════════════════════════ */
  function initMobileCta() {
    const bar  = $('#mobile-cta');
    const hero = $('.hero');
    const form = $('#contact');
    if (!bar || !hero) return;

    bar.hidden = false;

    let heroGone = false, atForm = false;
    const update = () => bar.classList.toggle('is-visible', heroGone && !atForm);

    new IntersectionObserver(([e]) => {
      heroGone = !e.isIntersecting;
      update();
    }, { threshold: 0 }).observe(hero);

    if (form) {
      new IntersectionObserver(([e]) => {
        atForm = e.isIntersecting;   // hide the bar once they've reached the form
        update();
      }, { threshold: 0.15 }).observe(form);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     5. Scroll reveal
     ═══════════════════════════════════════════════════════════════ */
  function initReveal() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = $$(
      '.section-head, .card, .step, .case-visual, .case-copy, ' +
      '.calc-controls, .calc-result, .faq-item, .contact-aside, .form-shell, ' +
      '.benefits-copy, .benefits-list li'
    );
    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--i', i % 4);
    });

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(el => io.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════════
     6. Estimate calculator
     ═══════════════════════════════════════════════════════════════ */
  const calcState = { summary: '', low: 0, high: 0 };

  function initCalculator() {
    const form = $('#calc');
    if (!form) return;

    const pagesEl   = $('#pages');
    const pagesOut  = $('#pages-out');
    const lowEl     = $('#calc-low');
    const highEl    = $('#calc-high');
    const monthlyEl = $('#calc-monthly');
    const listEl    = $('#calc-breakdown');
    const weeksEl   = $('#calc-weeks');

    // Keep the pricing table and the care-plan cards from drifting apart
    $$('[data-price]').forEach(el => {
      const key = el.dataset.price === 'self' ? 'none' : el.dataset.price;
      if (key in PRICING.care) el.textContent = money(PRICING.care[key]);
    });

    function compute() {
      const type  = form.querySelector('input[name="ptype"]:checked')?.value || 'new';
      const pages = Number(pagesEl.value);
      const care  = form.querySelector('input[name="care"]:checked')?.value || 'none';
      const addons = $$('input[name="addon"]:checked', form).map(i => i.value);

      const rows = [];
      let total = PRICING.base[type];
      rows.push({
        label: { landing: 'Landing page', new: 'New website',
                 redesign: 'Redesign', store: 'Online store' }[type],
        value: money(total),
      });

      const extraPages = Math.max(0, pages - PRICING.included[type]);
      if (extraPages > 0) {
        const cost = extraPages * PRICING.perPage;
        total += cost;
        rows.push({
          label: `${extraPages} extra page${extraPages > 1 ? 's' : ''}`,
          value: money(cost),
        });
      }

      addons.forEach(key => {
        const addon = PRICING.addons[key];
        if (!addon) return;
        total += addon.cost;
        rows.push({ label: addon.label, value: money(addon.cost) });
      });

      const low  = total * (1 - PRICING.spread);
      const high = total * (1 + PRICING.spread);

      // Paint
      lowEl.textContent  = money(low);
      highEl.textContent = money(high);

      listEl.innerHTML = '';
      rows.forEach(r => {
        const li = document.createElement('li');
        const a = document.createElement('span'); a.textContent = r.label;
        const b = document.createElement('span'); b.textContent = r.value;
        li.append(a, b);
        listEl.append(li);
      });

      const monthly = PRICING.care[care];
      monthlyEl.hidden = monthly === 0;
      if (monthly) monthlyEl.querySelector('strong').textContent = money(monthly);

      // Rough timeline from scope
      const weight = pages + addons.length * 2 + (type === 'store' ? 6 : 0);
      weeksEl.textContent =
        weight <= 5  ? '1–2 weeks' :
        weight <= 12 ? '2–3 weeks' :
        weight <= 20 ? '3–4 weeks' : '4–6 weeks';

      // Hand the result to the contact form
      const careLabel = care === 'none' ? 'no care plan' : `${care} care plan`;
      calcState.low = low;
      calcState.high = high;
      calcState.summary =
        `${rows[0].label}, ${pages} page${pages > 1 ? 's' : ''}` +
        (addons.length ? `, add-ons: ${addons.map(k => PRICING.addons[k].label).join(', ')}` : '') +
        `, ${careLabel} — estimated ${money(low)}–${money(high)}`;

      const field = $('#estimate-field');
      if (field) field.value = calcState.summary;
    }

    form.addEventListener('input', () => {
      pagesOut.textContent = pagesEl.value;
      compute();
    });
    form.addEventListener('change', compute);
    compute();

    // Carry the estimate into the form and pre-select the matching project type
    $('#calc-cta')?.addEventListener('click', () => {
      const type = form.querySelector('input[name="ptype"]:checked')?.value;
      const match = {
        new: 'I need a first website',
        redesign: 'Redesign my existing site',
        store: 'Online store',
      }[type];
      if (!match) return;
      const radio = $(`#lead-form input[name="project_type"][value="${CSS.escape(match)}"]`);
      if (radio) radio.checked = true;
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     7. Multi-step lead form
     ═══════════════════════════════════════════════════════════════ */
  function initLeadForm() {
    const form = $('#lead-form');
    if (!form) return;

    const steps    = $$('.step[data-step]', form);
    const fill     = $('#progress-fill');
    const labels   = $$('.progress-steps li', form);
    const announce = $('#step-announce');
    const success  = $('#form-success');
    const submitBtn= $('#submit-btn');
    const names    = ['Project', 'Details', 'Contact'];
    let current = 0;

    if (SITE.formspreeId) form.action = `https://formspree.io/f/${SITE.formspreeId}`;

    /* ---- validation ---- */
    const RULES = {
      business:     v => v.trim().length >= 2 || 'Please enter your business name.',
      name:         v => v.trim().length >= 2 || 'Please enter your name.',
      timeline:     v => v !== ''             || 'Pick a timeline so I know how to plan.',
      email:        v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
                      || 'That email doesn\'t look right — I need it to reply.',
      project_type: v => v !== ''             || 'Choose the one that fits best.',
    };

    function setError(field, message) {
      const slot = form.querySelector(`[data-error-for="${field}"]`);
      const input = form.elements[field];
      if (slot) slot.textContent = message || '';
      if (input && input.classList) input.classList.toggle('has-error', Boolean(message));
      if (input && input.setAttribute) {
        input.setAttribute('aria-invalid', message ? 'true' : 'false');
      }
    }

    function validateStep(index) {
      const step = steps[index];
      let firstBad = null;
      const seen = new Set();

      $$('input[required], select[required], [data-validate="required"]', step)
        .forEach(el => {
          // A radio group is marked on its wrapper; every other field on itself.
          const isGroup = !el.name;
          const control = isGroup ? $('input[name]', el) : el;
          const field   = control?.name;
          if (!field || !RULES[field] || seen.has(field)) return;
          seen.add(field);

          // Radios and checkboxes must be read from the *checked* member,
          // not from whichever element happened to carry the required flag.
          const value = (control.type === 'radio' || control.type === 'checkbox')
            ? (form.querySelector(`input[name="${field}"]:checked`)?.value ?? '')
            : control.value;

          const result = RULES[field](value);
          if (result === true) {
            setError(field, '');
          } else {
            setError(field, result);
            firstBad ||= control;
          }
        });

      if (firstBad) {
        firstBad.focus({ preventScroll: true });
        firstBad.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return false;
      }
      return true;
    }

    /* ---- navigation ---- */
    function goTo(index) {
      current = Math.max(0, Math.min(index, steps.length - 1));

      steps.forEach((s, i) => s.classList.toggle('is-active', i === current));
      labels.forEach((l, i) => {
        l.classList.toggle('is-active', i === current);
        l.classList.toggle('is-done', i < current);
      });
      fill.style.width = `${((current + 1) / steps.length) * 100}%`;
      announce.textContent = `Step ${current + 1} of ${steps.length}: ${names[current]}`;

      if (current === steps.length - 1) buildSummary();

      const heading = $('.step-title', steps[current]);
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });

      const top = form.getBoundingClientRect().top + scrollY - 100;
      if (scrollY > top) scrollTo({ top, behavior: 'smooth' });
    }

    function buildSummary() {
      const box  = $('#summary');
      const list = $('#summary-list');
      if (!box || !list) return;

      const rows = [
        ['Project',  form.querySelector('input[name="project_type"]:checked')?.value],
        ['Business', form.elements.business?.value.trim()],
        ['Timeline', form.elements.timeline?.value],
        ['Budget',   form.elements.budget?.value],
      ].filter(([, v]) => v);

      if (calcState.summary) rows.push(['Your estimate', `${money(calcState.low)}–${money(calcState.high)}`]);

      list.innerHTML = '';
      rows.forEach(([k, v]) => {
        const wrap = document.createElement('div');
        const dt = document.createElement('dt'); dt.textContent = k;
        const dd = document.createElement('dd'); dd.textContent = v;
        wrap.append(dt, dd);
        list.append(wrap);
      });
      box.hidden = rows.length === 0;
    }

    $$('[data-next]', form).forEach(btn =>
      btn.addEventListener('click', () => { if (validateStep(current)) goTo(current + 1); }));
    $$('[data-prev]', form).forEach(btn =>
      btn.addEventListener('click', () => goTo(current - 1)));

    // Clear an error as soon as they fix it
    form.addEventListener('input', e => {
      const field = e.target.name;
      if (field && RULES[field] && RULES[field](e.target.value) === true) setError(field, '');
    });
    form.addEventListener('change', e => {
      if (e.target.name === 'project_type') setError('project_type', '');
    });

    // Enter advances instead of submitting early
    form.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA') return;
      if (current < steps.length - 1) {
        e.preventDefault();
        if (validateStep(current)) goTo(current + 1);
      }
    });

    /* ---- submit ---- */
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateStep(current)) return;
      if (form.elements._gotcha?.value) return;   // bot

      const data = new FormData(form);
      data.append('_subject', `New Bowsites enquiry — ${data.get('business') || data.get('name')}`);

      // No Formspree ID configured → fall back to the visitor's email client
      if (!SITE.formspreeId) {
        if (isPlaceholder(SITE.email)) {
          alert('This form isn\'t connected yet. Add your Formspree ID in script.js.');
          return;
        }
        const body = [...data.entries()]
          .filter(([k, v]) => v && !k.startsWith('_'))
          .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
          .join('\n');
        location.href =
          `mailto:${SITE.email}?subject=${encodeURIComponent('Website enquiry')}` +
          `&body=${encodeURIComponent(body)}`;
        showSuccess();
        return;
      }

      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.textContent = 'Sending…';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showSuccess();
      } catch (err) {
        console.error('[Bowsites] Form submission failed:', err);
        submitBtn.removeAttribute('aria-busy');
        submitBtn.textContent = 'Try again';
        setError('email',
          isPlaceholder(SITE.email)
            ? 'Something went wrong sending that. Please try again in a moment.'
            : `Something went wrong. Email me directly at ${SITE.email}.`);
      }
    });

    function showSuccess() {
      steps.forEach(s => s.classList.remove('is-active'));
      $('.progress', form).hidden = true;
      success.hidden = false;
      success.focus();
      announce.textContent = 'Message sent. I\'ll reply within one business day.';
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     8. Landing on a #hash
     ───────────────────────────────────────────────────────────────
     `html { scroll-behavior: smooth }` makes the browser's initial jump
     to a hash animated, and that animation gets cancelled before it
     arrives — so a shared link like /#contact lands at the top of the
     page instead of the form. Redo the jump explicitly, instantly,
     once layout has settled. scrollIntoView honours scroll-padding-top,
     so the sticky header doesn't cover the target.
     ═══════════════════════════════════════════════════════════════ */
  function initHashLanding() {
    if (!location.hash) return;

    let target;
    try { target = document.querySelector(location.hash); } catch { return; }
    if (!target) return;

    const jump = () => target.scrollIntoView({ behavior: 'instant', block: 'start' });
    requestAnimationFrame(() => requestAnimationFrame(jump));
    addEventListener('load', jump, { once: true });   // again after fonts/images settle
  }

  /* ═══════════════════════════════════════════════════════════════
     9. Misc
     ═══════════════════════════════════════════════════════════════ */
  function initMisc() {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ═══════════════════════════════════════════════════════════════
     Boot
     ═══════════════════════════════════════════════════════════════ */
  applySiteConfig();
  initTheme();
  initHeader();
  initMobileCta();
  initReveal();
  initCalculator();
  initLeadForm();
  initHashLanding();
  initMisc();
})();
