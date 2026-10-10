(function () {
  'use strict';

  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobile = window.matchMedia('(max-width: 992px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const dropdowns = nav ? Array.from(nav.querySelectorAll('.nav-dropdown')) : [];
  const background = Array.from(document.querySelectorAll('main, footer, .contact-actions'));
  let savedOverflow = '';
  let savedInert = [];

  function closeDropdowns(except) {
    dropdowns.forEach(function (dropdown) {
      if (dropdown !== except) dropdown.open = false;
    });
  }

  function setMenu(open, restoreFocus) {
    if (!nav || !toggle) return;
    open = Boolean(open && mobile.matches);
    const wasOpen = nav.classList.contains('nav-open');
    document.documentElement.classList.toggle('menu-open', open);
    nav.classList.toggle('nav-open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    nav.inert = mobile.matches && !open;
    if (open && !wasOpen) {
      savedOverflow = document.body.style.overflow;
      savedInert = background.map(function (element) { return element.inert; });
      document.body.style.overflow = 'hidden';
      background.forEach(function (element) { element.inert = true; });
    } else if (!open && wasOpen) {
      document.body.style.overflow = savedOverflow;
      background.forEach(function (element, index) { element.inert = savedInert[index]; });
    }
    if (!open) closeDropdowns();
    if (restoreFocus) toggle.focus();
  }

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('nav-open'));
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) setMenu(false);
    });
    dropdowns.forEach(function (dropdown) {
      const summary = dropdown.querySelector('summary');
      dropdown.addEventListener('toggle', function () {
        if (dropdown.open) closeDropdowns(dropdown);
      });
      dropdown.addEventListener('pointerenter', function () {
        if (!mobile.matches && finePointer.matches) {
          closeDropdowns(dropdown);
          dropdown.open = true;
        }
      });
      dropdown.addEventListener('pointerleave', function () {
        if (!mobile.matches && !dropdown.contains(document.activeElement)) dropdown.open = false;
      });
      dropdown.addEventListener('focusout', function (event) {
        if (!dropdown.contains(event.relatedTarget)) dropdown.open = false;
      });
      summary.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        closeDropdowns(dropdown);
        dropdown.open = true;
        const links = dropdown.querySelectorAll('a[href]');
        const link = event.key === 'ArrowUp' ? links[links.length - 1] : links[0];
        if (link) link.focus();
      });
    });
    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        closeDropdowns();
        if (nav.classList.contains('nav-open')) setMenu(false, true);
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        const activeDropdown = dropdowns.find(function (dropdown) {
          return dropdown.open && dropdown.contains(document.activeElement);
        });
        if (activeDropdown) {
          activeDropdown.open = false;
          activeDropdown.querySelector('summary').focus();
          event.preventDefault();
        } else if (nav.classList.contains('nav-open')) {
          setMenu(false, true);
          event.preventDefault();
        } else {
          closeDropdowns();
        }
      }
      if (event.key !== 'Tab' || !nav.classList.contains('nav-open')) return;
      const controls = [toggle].concat(Array.from(nav.querySelectorAll('a[href], summary')))
        .filter(function (element) { return element.getClientRects().length > 0; });
      const index = controls.indexOf(document.activeElement);
      const direction = event.shiftKey ? -1 : 1;
      const next = (index + direction + controls.length) % controls.length;
      controls[next].focus();
      event.preventDefault();
    });
    mobile.addEventListener('change', function () {
      const focused = document.activeElement;
      const wasOpen = nav.classList.contains('nav-open');
      setMenu(false);
      if (mobile.matches && nav.contains(focused)) toggle.focus();
      if (!mobile.matches && wasOpen && focused === toggle) {
        const firstLink = nav.querySelector('a[href]');
        if (firstLink) firstLink.focus();
      }
    });
    document.documentElement.classList.add('nav-enhanced');
    setMenu(false);
  }

  const contact = document.querySelector('.contact-actions');
  if (contact && 'IntersectionObserver' in window) {
    const visibleForms = new Set();
    const obstructedLinks = new Set();
    let actionObserver;
    document.documentElement.classList.add('contact-ready');
    function updateContactVisibility() {
      contact.hidden = (visibleForms.size > 0 || obstructedLinks.size > 0) && !contact.contains(document.activeElement);
    }
    // Keep the floating WhatsApp link clear of enquiry forms.
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visibleForms.add(entry.target);
        else visibleForms.delete(entry.target);
      });
      updateContactVisibility();
    }, { rootMargin: '0px 0px 88px 0px' });
    document.querySelectorAll('form').forEach(function (form) {
      observer.observe(form);
    });
    document.addEventListener('focusin', updateContactVisibility);
    contact.addEventListener('focusout', function () {
      queueMicrotask(updateContactVisibility);
    });
    function watchActionLinks() {
      if (actionObserver) actionObserver.disconnect();
      obstructedLinks.clear();
      const position = getComputedStyle(contact);
      const size = getComputedStyle(contact.querySelector('a'));
      // Include the pulse ring in the area reserved for WhatsApp.
      const left = innerWidth - parseFloat(position.right) - parseFloat(size.width) - 12;
      const top = innerHeight - parseFloat(position.bottom) - parseFloat(size.height) - 12;
      actionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) obstructedLinks.add(entry.target);
          else obstructedLinks.delete(entry.target);
        });
        updateContactVisibility();
      }, { rootMargin: -Math.max(0, top) + 'px 0px 0px ' + -Math.max(0, left) + 'px' });
      document.querySelectorAll('main .btn, footer a').forEach(function (link) {
        actionObserver.observe(link);
      });
      updateContactVisibility();
    }
    window.addEventListener('resize', watchActionLinks);
    watchActionLinks();
  }

})();
