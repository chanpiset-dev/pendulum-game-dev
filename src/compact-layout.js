// A disclosure, rather than a menu role: native buttons retain normal Tab behavior.
export function installCompactLayout({ $, pauseGame }) {
  const mobile = matchMedia('(max-width: 820px)');
  const button = $('btnMore'), actions = $('moreActions');
  function close(restoreFocus = false) {
    const wasOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', 'false');
    actions.classList.remove('is-open');
    $('mainHeader').classList.remove('more-open');
    if (restoreFocus && wasOpen) button.focus();
  }
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-expanded') === 'true') { close(); return; }
    pauseGame();
    button.setAttribute('aria-expanded', 'true');
    actions.classList.add('is-open');
    $('mainHeader').classList.add('more-open');
  });
  actions.addEventListener('click', event => {
    if (event.target.closest('button') && mobile.matches) close(!document.querySelector('dialog[open]'));
  });
  document.addEventListener('pointerdown', event => {
    if (!actions.contains(event.target) && !button.contains(event.target)) close();
  });
  document.addEventListener('focusin', event => {
    if (!actions.contains(event.target) && event.target !== button) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      event.preventDefault(); close(true);
    }
  });
  function resize() {
    const needsFocus = actions.contains(document.activeElement);
    close();
    if (needsFocus && mobile.matches) button.focus();
    $('launchSettings').open = !mobile.matches;
  }
  mobile.addEventListener('change', resize);
  resize();
}
