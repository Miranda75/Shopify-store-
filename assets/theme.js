(function () {
  'use strict';

  var dropdownsInitialised = false;

  function closeDropdown(item) {
    if (!item) return;

    var trigger = item.querySelector('.miranda-nav-item__trigger');
    var menu = item.querySelector('.miranda-dropdown');

    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }

    if (menu) {
      menu.hidden = true;
    }
  }

  function closeAllDropdowns(exceptItem) {
    var items = document.querySelectorAll('[data-dropdown-item]');

    items.forEach(function (item) {
      if (item !== exceptItem) {
        closeDropdown(item);
      }
    });
  }

  function setupDropdowns() {
    var items = document.querySelectorAll('[data-dropdown-item]');

    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector('.miranda-nav-item__trigger');
      var menu = item.querySelector('.miranda-dropdown');

      if (!trigger || !menu || trigger.dataset.dropdownBound === 'true') return;

      trigger.dataset.dropdownBound = 'true';
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        closeAllDropdowns(item);
        trigger.setAttribute('aria-expanded', String(!isOpen));
        menu.hidden = isOpen;
      });
    });

    if (dropdownsInitialised) return;
    dropdownsInitialised = true;

    document.addEventListener('click', function (event) {
      if (!event.target.closest('[data-dropdown-item]')) {
        closeAllDropdowns();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeAllDropdowns();
      }
    });
  }

  function setupMobileMenu() {
    var toggle = document.querySelector('[data-mobile-menu-toggle]');
    var menu = document.getElementById('miranda-mobile-menu');

    if (!toggle || !menu || toggle.dataset.mobileMenuBound === 'true') return;

    toggle.dataset.mobileMenuBound = 'true';
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      menu.hidden = isOpen;
    });
  }

  function setupMobileDropdowns() {
    var items = document.querySelectorAll('[data-mobile-dropdown]');

    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector('.miranda-mobile-dropdown__trigger');
      var content = item.querySelector('.miranda-mobile-dropdown__content');

      if (!trigger || !content || trigger.dataset.mobileDropdownBound === 'true') return;

      trigger.dataset.mobileDropdownBound = 'true';
      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        content.hidden = isOpen;
      });
    });
  }

  function initMirandaHeader() {
    setupMobileMenu();
    setupDropdowns();
    setupMobileDropdowns();
  }

  document.addEventListener('DOMContentLoaded', initMirandaHeader);
})();
