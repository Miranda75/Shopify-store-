(function () {
  'use strict';

  function setupMobileMenu() {
    var toggle = document.querySelector('[data-mobile-menu-toggle]');
    var menu = document.getElementById('miranda-mobile-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      menu.hidden = isOpen;
    });
  }

  document.addEventListener('DOMContentLoaded', setupMobileMenu);
})();
