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

  function setupDropdowns() {
    var items = document.querySelectorAll('[data-dropdown-item]');

    function closeAll() {
      items.forEach(function (item) {
        var trigger = item.querySelector('.miranda-nav-item__trigger');
        var panel = item.querySelector('.miranda-dropdown');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (panel) panel.hidden = true;
      });
    }

    items.forEach(function (item) {
      var trigger = item.querySelector('.miranda-nav-item__trigger');
      var panel = item.querySelector('.miranda-dropdown');

      if (!trigger || !panel) return;

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        closeAll();
        if (!isOpen) {
          trigger.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
        }
      });
    });

    document.addEventListener('click', closeAll);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  function setupMobileDropdowns() {
    var items = document.querySelectorAll('[data-mobile-dropdown]');

    items.forEach(function (item) {
      var trigger = item.querySelector('.miranda-mobile-nav-item__trigger');
      var panel = item.querySelector('.miranda-mobile-dropdown');

      if (!trigger || !panel) return;

      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupDropdowns();
    setupMobileDropdowns();
  });
})();
