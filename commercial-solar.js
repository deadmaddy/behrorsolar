(function () {
  'use strict';

  const form = document.getElementById('commercial-enquiry');
  if (!form) return;

  const propertyType = form.elements.namedItem('Property Type');
  const landingPage = form.elements.namedItem('landing_page').value;
  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (name) {
    form.elements.namedItem(name).value = (params.get(name) || '').slice(0, 200);
  });

  // Event hooks contain no free-text form values or customer contact details.
  function track(event, source, type) {
    if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
    window.dataLayer.push({
      event: event,
      landing_page: landingPage,
      cta_source: source,
      property_type: type || propertyType.value || 'not-selected'
    });
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const source = link.dataset.ctaSource || (link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : 'quick-contact');
    const type = link.dataset.propertyType;
    if (link.getAttribute('href') === '#contact') {
      form.elements.namedItem('cta_source').value = source;
      form.elements.namedItem('page_section').value = source;
      if (type) propertyType.value = type;
      track('commercial_assessment_click', source, type);
    } else if (link.href.startsWith('https://wa.me/919414453454')) {
      track('commercial_whatsapp_click', source, type);
    } else if (link.href.startsWith('tel:')) {
      track('commercial_phone_click', source, type);
    }
  });

  propertyType.addEventListener('change', function () {
    track('commercial_property_type_select', 'contact-form');
  });
  form.addEventListener('submit', function () {
    // This is a validated submission attempt, not a confirmed lead or delivery.
    track('commercial_form_submit', form.elements.namedItem('cta_source').value);
  });
  track('commercial_page_view', 'page');
})();
