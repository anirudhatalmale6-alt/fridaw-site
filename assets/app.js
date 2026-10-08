/* FriDaw preview build - no dependencies, no external calls. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sticky header hairline ---------- */
  var head = document.getElementById('siteHead');
  function onScroll() {
    head.classList.toggle('stuck', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById('burger');
  var mnav = document.getElementById('mobileNav');

  function setNav(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.hidden = !open;
  }
  burger.addEventListener('click', function () {
    setNav(burger.getAttribute('aria-expanded') !== 'true');
  });
  mnav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mnav.hidden) { setNav(false); burger.focus(); }
  });
  // a resize past the breakpoint must not leave the panel stranded open
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && !mnav.hidden) setNav(false);
  });

  /* ---------- reveal on scroll ---------- */
  var toReveal = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    toReveal.forEach(function (el) { el.classList.add('in'); });
  } else {
    // hero reveals immediately so the first paint is not blank
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    toReveal.forEach(function (el) {
      if (el.closest('.hero')) {
        requestAnimationFrame(function () { el.classList.add('in'); });
      } else {
        io.observe(el);
      }
    });
  }

  /* ---------- enquiry form (preview mode) ---------- */
  var form = document.getElementById('enquiry');
  var sent = document.getElementById('sent');
  var note = document.getElementById('formNote');
  var resetBtn = document.getElementById('resetForm');

  var MESSAGES = {
    'f-name': 'Please tell us your name.',
    'f-email': 'A valid email address, so we can actually reply.',
    'f-type': 'Pick the closest option. "Something else" is fine.',
    'f-msg': 'A sentence or two about what you need.',
    'f-consent': 'We need your agreement before we can reply.'
  };

  function fieldOf(el) { return el.closest('.field'); }

  function showError(el, msg) {
    var f = fieldOf(el);
    if (!f) return;
    f.classList.add('bad');
    var p = f.querySelector('.err[data-for="' + el.id + '"]');
    if (p) p.textContent = msg;
    el.setAttribute('aria-invalid', 'true');
  }

  function clearError(el) {
    var f = fieldOf(el);
    if (!f) return;
    f.classList.remove('bad');
    var p = f.querySelector('.err[data-for="' + el.id + '"]');
    if (p) p.textContent = '';
    el.removeAttribute('aria-invalid');
  }

  function validEmail(v) {
    // deliberately permissive: reject the obviously broken, not the unusual
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  }

  function check(el) {
    if (el.type === 'checkbox') {
      if (!el.checked) { showError(el, MESSAGES[el.id]); return false; }
    } else if (!el.value.trim()) {
      showError(el, MESSAGES[el.id]); return false;
    } else if (el.type === 'email' && !validEmail(el.value)) {
      showError(el, MESSAGES[el.id]); return false;
    }
    clearError(el);
    return true;
  }

  var required = Array.prototype.slice.call(
    form.querySelectorAll('[required]')
  );

  required.forEach(function (el) {
    el.addEventListener('blur', function () { if (el.value || el.type === 'checkbox') check(el); });
    el.addEventListener('input', function () { if (fieldOf(el) && fieldOf(el).classList.contains('bad')) check(el); });
    el.addEventListener('change', function () { if (fieldOf(el) && fieldOf(el).classList.contains('bad')) check(el); });
  });

  function finish() {
    Array.prototype.slice.call(form.querySelectorAll('.f-row, .field, button[type=submit]'))
      .forEach(function (el) { el.hidden = true; });
    if (note) note.hidden = true;
    sent.hidden = false;
    sent.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // honeypot: a filled hidden field is a bot. Show the same success panel so
    // it learns nothing, and send nothing anywhere.
    if (form.elements.website && form.elements.website.value) {
      finish();
      return;
    }

    var firstBad = null;
    required.forEach(function (el) {
      if (!check(el) && !firstBad) firstBad = el;
    });

    if (firstBad) {
      firstBad.focus();
      firstBad.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      return;
    }

    // Preview build: there is no endpoint, so nothing leaves the page.
    finish();
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      Array.prototype.slice.call(form.querySelectorAll('.f-row, .field, button[type=submit]'))
        .forEach(function (el) { el.hidden = false; });
      Array.prototype.slice.call(form.querySelectorAll('.field.bad'))
        .forEach(function (f) { f.classList.remove('bad'); });
      if (note) note.hidden = false;
      sent.hidden = true;
      var first = document.getElementById('f-name');
      if (first) first.focus();
    });
  }
})();
