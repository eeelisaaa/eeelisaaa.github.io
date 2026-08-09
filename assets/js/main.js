/* ==========================================================================
   Elisa Zoe Ganea — portfolio
   No dependencies. Everything here is an enhancement: with JS disabled the
   page renders complete and static (see the `.js` guards in styles.css).
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── Footer year ──────────────────────────────────────────────────────── */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ── Header: condense once scrolled off the top ───────────────────────── */

  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Reveal on scroll ─────────────────────────────────────────────────── */

  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    // Nothing to animate — show everything immediately.
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Nav: highlight the section currently in view ─────────────────────── */

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-list a[href^="#"]')
  );

  if (navLinks.length && 'IntersectionObserver' in window) {
    var linkFor = {};
    var watched = [];

    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      linkFor[id] = link;
      watched.push(section);
    });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.remove('is-active'); });
        var active = linkFor[entry.target.id];
        if (active) active.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    watched.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ── Mobile menu ──────────────────────────────────────────────────────── */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    };

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
      if (open) {
        var first = nav.querySelector('a');
        if (first) first.focus();
      }
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      setMenu(false);
      toggle.focus();
    });

    // Leaving mobile widths with the overlay open would otherwise lock scrolling.
    window.matchMedia('(min-width: 781px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ── Highlights carousel ──────────────────────────────────────────────── */

  var root = document.querySelector('[data-carousel]');
  if (!root) return;

  var viewport = root.querySelector('[data-carousel-viewport]');
  var dotsBox = root.querySelector('.hl-dots');
  var cards = viewport
    ? Array.prototype.slice.call(viewport.querySelectorAll('.hl-card'))
    : [];

  // One card (or none) needs no rotation; reduced motion gets the static stack
  // that the stylesheet already renders.
  if (!viewport || !dotsBox || cards.length < 2 || reduceMotion.matches) return;

  var interval = parseInt(root.getAttribute('data-interval'), 10) || 3000;
  var current = 0;
  var timer = null;
  var holds = {};   // reasons the rotation is currently paused

  root.setAttribute('aria-roledescription', 'carousel');

  var dots = cards.map(function (card, i) {
    card.id = 'hl-panel-' + (i + 1);
    card.setAttribute('role', 'tabpanel');
    card.setAttribute('aria-labelledby', 'hl-tab-' + (i + 1));
    card.setAttribute('tabindex', '0');

    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hl-dot';
    dot.id = 'hl-tab-' + (i + 1);
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-controls', card.id);
    dot.setAttribute('aria-selected', 'false');
    dot.setAttribute('tabindex', '-1');

    var label = document.createElement('span');
    label.className = 'sr-only';
    var title = card.querySelector('.hl-title');
    label.textContent = title ? title.textContent.trim() : 'Highlight ' + (i + 1);
    dot.appendChild(label);

    dot.addEventListener('click', function () { show(i); });
    dotsBox.appendChild(dot);
    return dot;
  });

  function show(index) {
    current = (index + cards.length) % cards.length;

    cards.forEach(function (card, i) {
      card.classList.toggle('is-current', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.setAttribute('aria-selected', String(i === current));
      dot.setAttribute('tabindex', i === current ? '0' : '-1');
    });
  }

  function next() { show(current + 1); }

  function start() {
    if (timer || Object.keys(holds).length) return;
    timer = window.setInterval(next, interval);
  }

  function stop() {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  }

  function hold(reason) { holds[reason] = true; stop(); }

  function release(reason) {
    delete holds[reason];
    start();
  }

  // Restart the clock after a manual jump, so the new card gets a full turn.
  function restart() { stop(); start(); }

  dots.forEach(function (dot) {
    dot.addEventListener('click', restart);
  });

  // Arrow keys move between dots, matching the tablist pattern.
  dotsBox.addEventListener('keydown', function (event) {
    var delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    show(current + delta);
    dots[current].focus();
    restart();
  });

  // Pause while the visitor is reading, and while the section is out of sight
  // or the tab is in the background.
  root.addEventListener('mouseenter', function () { hold('hover'); });
  root.addEventListener('mouseleave', function () { release('hover'); });
  root.addEventListener('focusin', function () { hold('focus'); });
  root.addEventListener('focusout', function () { release('focus'); });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) hold('hidden');
    else release('hidden');
  });

  if ('IntersectionObserver' in window) {
    hold('offscreen');
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) release('offscreen');
        else hold('offscreen');
      });
    }, { threshold: 0.25 }).observe(root);
  }

  // Someone switching on reduced motion mid-visit gets the static stack too.
  reduceMotion.addEventListener('change', function (e) {
    if (!e.matches) return;
    stop();
    cards.forEach(function (card) { card.classList.remove('is-current'); });
  });

  show(0);
  start();
})();
