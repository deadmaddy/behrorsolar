(function () {
  'use strict';
  document.querySelectorAll('form').forEach(function (form) {
    const controls = Array.from(form.querySelectorAll('input:not([type="hidden"]):not([name="botcheck"]), select, textarea'));
    function message(control) {
      control.setCustomValidity('');
      if (control.required && !control.value.trim()) control.setCustomValidity('कृपया यह जानकारी भरें।');
      else if (control.type === 'tel' && control.value && !/^\+?(?:[0-9][ \-]*){9,14}[0-9]$/.test(control.value)) control.setCustomValidity('10 से 15 अंकों का फ़ोन नंबर लिखें। शुरुआत में + और बीच में खाली जगह या हाइफ़न लगा सकते हैं।');
    }
    controls.forEach(function (control) {
      control.addEventListener('input', function () { message(control); });
      control.addEventListener('change', function () { message(control); });
      control.addEventListener('invalid', function () { message(control); });
    });
  });
})();
