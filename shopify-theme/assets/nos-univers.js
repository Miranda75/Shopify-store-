(function () {
  'use strict';

  function initNosUnivers() {
    var cards = document.querySelectorAll('.nos-univers__card[aria-disabled="true"]');

    cards.forEach(function (card) {
      card.addEventListener('click', function (event) {
        event.preventDefault();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNosUnivers);
  } else {
    initNosUnivers();
  }
})();
