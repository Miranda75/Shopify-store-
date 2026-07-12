document.addEventListener('DOMContentLoaded', function() {
  console.log('Shopify Liquid Theme loaded');
  
  // Mobile menu toggle
  const menuButton = document.querySelector('button:nth-of-type(1)');
  if (menuButton) {
    menuButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Menu toggle');
    });
  }
  
  // Cart drawer
  const cartLink = document.querySelector('a[href*="cart"]');
  if (cartLink) {
    cartLink.addEventListener('click', function(e) {
      if (window.innerWidth < 768) {
        e.preventDefault();
      }
    });
  }
});
