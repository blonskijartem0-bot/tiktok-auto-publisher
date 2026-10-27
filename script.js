(function () {
  'use strict';

  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  var validIds = pages.map(function (p) { return p.id; });

  function closeMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function showPage(id) {
    if (validIds.indexOf(id) === -1) id = 'home';

    pages.forEach(function (page) {
      var active = page.id === id;
      page.classList.toggle('active', active);
      if (active && page.dataset.title) document.title = page.dataset.title;
    });

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    closeMenu();
  }

  function route() {
    var id = window.location.hash.replace('#', '') || 'home';
    // "#features" is an in-page anchor on the home page
    if (id === 'features') {
      showPage('home');
      var el = document.getElementById('features');
      if (el) el.scrollIntoView();
      return;
    }
    showPage(id);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();

  // Mobile menu
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Smooth scroll to the features block without leaving the home page
  document.querySelectorAll('[data-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (!document.getElementById('home').classList.contains('active')) {
        window.location.hash = 'home';
      }
      var target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Copy email
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = 'artemblonskij520@gmail.com';
      var done = function () {
        copyBtn.textContent = 'Copied!';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, function () {});
      } else {
        var tmp = document.createElement('textarea');
        tmp.value = email;
        document.body.appendChild(tmp);
        tmp.select();
        try { document.execCommand('copy'); done(); } catch (err) {}
        document.body.removeChild(tmp);
      }
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear() < 2026 ? 2026 : new Date().getFullYear();
})();
