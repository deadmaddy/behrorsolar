(function () {
  'use strict';

  const comparison = document.getElementById('tata-and-custom');
  const interest = document.getElementById('cf-product-interest');
  if (!comparison || !interest) return;

  comparison.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[data-hybrid-product]');
    if (!link || !comparison.contains(link)) return;

    const value = link.dataset.hybridProduct;
    if (!Array.from(interest.options).some(function (option) { return option.value === value; })) return;
    interest.value = value;
    interest.dispatchEvent(new Event('change', { bubbles: true }));

    // Keep the native #contact link; focus the selected field after navigation.
    requestAnimationFrame(function () { interest.focus(); });
  });
})();
