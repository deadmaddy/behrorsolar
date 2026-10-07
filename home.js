(function () {
  'use strict';

  const comparison = document.querySelector('[data-price-comparison]');
  if (!comparison) return;

  const selector = comparison.querySelector('.price-selector');
  const choices = Array.from(comparison.querySelectorAll('input[name="solar-price-brand"]'));
  const panels = Array.from(comparison.querySelectorAll('[data-price-brand]'));
  const status = comparison.querySelector('[data-price-status]');
  if (!selector || !choices.length || !panels.length) return;

  function showSelectedPrice() {
    const selected = choices.find(function (choice) { return choice.checked; });
    if (!selected) return;
    panels.forEach(function (panel) {
      panel.hidden = panel.dataset.priceBrand !== selected.value;
    });
    if (status) status.textContent = 'Showing ' + selected.nextElementSibling.textContent + ' installation prices.';
  }

  choices.forEach(function (choice) {
    choice.addEventListener('change', showSelectedPrice);
  });
  choices[0].checked = true;
  showSelectedPrice();
  selector.hidden = false;
})();
