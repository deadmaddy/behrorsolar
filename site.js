(function () {
  'use strict';

  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobile = window.matchMedia('(max-width: 992px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const dropdowns = nav ? Array.from(nav.querySelectorAll('.nav-dropdown')) : [];
  const background = Array.from(document.querySelectorAll('main, footer, .contact-fab'));
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

  const fab = document.getElementById('contactFab');
  const fabToggle = fab && fab.querySelector('.contact-fab-toggle');
  const fabOptions = fab && fab.querySelector('.contact-fab-options');
  if (fab && fabToggle && fabOptions) {
    function setContact(open, restoreFocus) {
      fab.classList.toggle('open', open);
      fabToggle.setAttribute('aria-expanded', String(open));
      fabToggle.setAttribute('aria-label', open ? 'Close contact options' : 'Open contact options');
      fabOptions.inert = !open;
      if (restoreFocus) fabToggle.focus();
    }
    fabToggle.addEventListener('click', function () {
      setContact(!fab.classList.contains('open'));
    });
    document.addEventListener('click', function (event) {
      if (!fab.contains(event.target)) setContact(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && fab.classList.contains('open')) {
        setContact(false, fab.contains(document.activeElement));
      }
    });
    document.documentElement.classList.add('contact-enhanced');
    setContact(false);
  }

})();
