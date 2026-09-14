/* ==========================================================================
   Elisa Zoe Ganea — portfolio
   No dependencies. Everything here is an enhancement: with JS disabled the
   pages render complete and static (see the `.js` guards in styles.css).
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  /* ── Footer year ──────────────────────────────────────────────────────── */

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ── Theme: light / dark, remembered in localStorage ──────────────────── */

  function storedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  function applyTheme(theme, animate) {
    if (animate && !reduceMotion.matches) {
      root.classList.add('theme-transition');
      window.setTimeout(function () { root.classList.remove('theme-transition'); }, 220);
    }
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? btn.getAttribute('data-label-light') : btn.getAttribute('data-label-dark'));
    });
  }

  // The head script already applied a stored choice; resolve the system
  // default here so the toggle and the CSS agree on the current theme.
  applyTheme(storedTheme() || (systemDark.matches ? 'dark' : 'light'), false);

  systemDark.addEventListener('change', function (e) {
    if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light', true);
  });

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) {}
      applyTheme(next, true);
    });
  });

  /* ── Mobile menu ──────────────────────────────────────────────────────── */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? toggle.getAttribute('data-label-close') : toggle.getAttribute('data-label-open'));
      nav.classList.toggle('is-open', open);
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
      if (event.target.closest('a, button')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
      setMenu(false);
      toggle.focus();
    });

    document.addEventListener('click', function (event) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (event.target.closest('#primary-nav, .nav-toggle')) return;
      setMenu(false);
    });

    window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ── Reveal on scroll ─────────────────────────────────────────────────── */

  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Project deck: drag a card off the pile, or use the arrows ────────── */

  var deck = document.querySelector('[data-deck]');
  if (!deck) return;

  var stack = deck.querySelector('[data-deck-stack]');
  var cards = Array.prototype.slice.call(stack.querySelectorAll('[data-card]'));
  var counter = document.querySelector('[data-deck-current]');
  var indexItems = Array.prototype.slice.call(deck.querySelectorAll('[data-deck-goto]'));
  var n = cards.length;
  if (n < 2) return;

  var THRESHOLD = 120;   // px of horizontal drag that counts as a swipe
  var current = 0;
  var busy = false;

  function pad(i) { return (i < 9 ? '0' : '') + (i + 1); }

  function render() {
    cards.forEach(function (card, i) {
      var pos = (i - current + n) % n;
      card.setAttribute('data-pos', String(Math.min(pos, 4)));
      card.style.zIndex = String(n - pos);
      if (pos === 0) {
        card.removeAttribute('inert');
        card.removeAttribute('aria-hidden');
      } else {
        card.setAttribute('inert', '');
        card.setAttribute('aria-hidden', 'true');
      }
    });
    if (counter) counter.textContent = pad(current);
    indexItems.forEach(function (btn, i) {
      btn.parentNode.classList.toggle('is-current', i === current);
    });
  }

  // Jump the card to a transform with no transition, then let CSS animate it home.
  function settle(card) {
    card.classList.add('no-transition');
    card.style.transform = '';
    void card.offsetWidth;
    card.classList.remove('no-transition');
  }

  function afterTransition(card, done) {
    if (reduceMotion.matches) { done(); return; }
    var fired = false;
    var finish = function () { if (fired) return; fired = true; card.removeEventListener('transitionend', finish); done(); };
    card.addEventListener('transitionend', finish);
    window.setTimeout(finish, 500);
  }

  // The top card flies off (direction ±1) and the next one rises underneath.
  function next(direction) {
    if (busy) return;
    busy = true;
    var card = cards[current];
    var dir = direction || 1;
    card.classList.remove('is-dragging');
    card.classList.add('is-flying');
    card.style.transform = 'translate(' + (dir * 130) + '%, -6%) rotate(' + (dir * 16) + 'deg)';
    card.style.opacity = '0';
    afterTransition(card, function () {
      card.classList.remove('is-flying');
      card.classList.add('no-transition');
      card.style.transform = '';
      card.style.opacity = '';
      current = (current + 1) % n;
      render();
      void card.offsetWidth;
      card.classList.remove('no-transition');
      busy = false;
    });
  }

  // The card that was last flung comes back from the left onto the pile.
  function prev() {
    if (busy) return;
    busy = true;
    current = (current - 1 + n) % n;
    var card = cards[current];
    card.classList.add('no-transition');
    card.style.transform = 'translate(-130%, -6%) rotate(-16deg)';
    card.style.opacity = '0';
    render();
    void card.offsetWidth;
    card.classList.remove('no-transition');
    card.classList.add('is-flying');
    card.style.transform = '';
    card.style.opacity = '';
    afterTransition(card, function () {
      card.classList.remove('is-flying');
      busy = false;
    });
  }

  function goTo(index) {
    if (busy || index === current) return;
    if (index === (current + 1) % n) { next(1); return; }
    if (index === (current - 1 + n) % n) { prev(); return; }
    current = index;
    render();
  }

  var prevBtn = document.querySelector('[data-deck-prev]');
  var nextBtn = document.querySelector('[data-deck-next]');
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', function () { next(1); });

  indexItems.forEach(function (btn) {
    btn.addEventListener('click', function () { goTo(parseInt(btn.getAttribute('data-deck-goto'), 10)); });
  });

  stack.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') { event.preventDefault(); next(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); prev(); }
  });

  // Pointer drag on the top card. Vertical movement is left to the page
  // (touch-action: pan-y), so the deck never traps scrolling.
  var drag = null;

  stack.addEventListener('pointerdown', function (event) {
    if (busy || event.button !== 0) return;
    var card = event.target.closest('[data-card]');
    if (!card || card !== cards[current]) return;
    if (event.target.closest('a, button')) return;
    drag = { card: card, x: event.clientX, y: event.clientY, dx: 0, id: event.pointerId };
    card.classList.add('is-dragging');
    card.setPointerCapture(event.pointerId);
  });

  stack.addEventListener('pointermove', function (event) {
    if (!drag || event.pointerId !== drag.id) return;
    drag.dx = event.clientX - drag.x;
    var dy = (event.clientY - drag.y) * 0.3;
    drag.card.style.transform = 'translate(' + drag.dx + 'px, ' + dy + 'px) rotate(' + (drag.dx / 20) + 'deg)';
  });

  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    var card = drag.card;
    var dx = drag.dx;
    drag = null;
    card.classList.remove('is-dragging');
    if (Math.abs(dx) > THRESHOLD) {
      next(dx > 0 ? 1 : -1);
    } else {
      settle(card);
    }
  }

  stack.addEventListener('pointerup', endDrag);
  stack.addEventListener('pointercancel', endDrag);

  // A drag that ended on the "Read more" link must not also follow it.
  stack.addEventListener('click', function (event) {
    if (Math.abs(lastDx) > 8 && event.target.closest('a')) event.preventDefault();
  }, true);
  var lastDx = 0;
  stack.addEventListener('pointerup', function () { lastDx = drag ? drag.dx : lastDx; }, true);
  stack.addEventListener('pointerdown', function () { lastDx = 0; }, true);

  render();
})();
