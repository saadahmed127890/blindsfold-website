(() => {
  'use strict';
  if (window.blindsfoldAdvertising) return;
  const KEY = 'blindsfold.advertising.v1';
  const LIFETIME = 180 * 24 * 60 * 60 * 1000;
  const pixelId = String(window.BLINDSFOLD_PIXEL_ID || '');
  let choice = null;
  let initialized = false;
  let pageViewed = false;
  const leads = new Set();
  let opener;
  const readChoice = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return saved && ['accepted', 'declined'].includes(saved.choice) && saved.expires > Date.now() ? saved.choice : null;
    } catch (_) { return null; }
  };
  choice = readChoice();
  function start() {
    if (choice !== 'accepted' || !/^\d+$/.test(pixelId)) return;
    if (!initialized) {
      // Do not attach to another, potentially auto-configured Pixel integration.
      if (window.fbq) return;
      const fbq = function () {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
        else fbq.queue.push(arguments);
      };
      window.fbq = window._fbq = fbq;
      fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
      initialized = true;
      fbq('consent', 'grant');
      fbq('set', 'autoConfig', false, pixelId);
      fbq('init', pixelId); // No advanced matching or form values.
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
    } else window.fbq('consent', 'grant');
    if (!pageViewed) {
      window.fbq('track', 'PageView');
      pageViewed = true;
    }
  }
  function revoke() {
    if (initialized) {
      // Remove unsent events if consent is withdrawn while the library is loading.
      if (window.fbq.queue) window.fbq.queue = window.fbq.queue.filter(args => args[0] !== 'track');
      window.fbq('consent', 'revoke');
    }
    // Only our accessible first-party Meta cookies can be removed here.
    for (const name of ['_fbp', '_fbc']) {
      const domains = ['', location.hostname, '.' + location.hostname, '.blindsfold.com'];
      for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? '; Domain=' + domain : ''}`;
    }
  }
  function choose(value) {
    choice = value;
    try { localStorage.setItem(KEY, JSON.stringify({ choice, expires: Date.now() + LIFETIME })); } catch (_) {}
    if (choice === 'accepted') start(); else revoke();
    panel.hidden = true;
    opener?.focus();
  }
  window.blindsfoldAdvertising = {
    lead(id) {
      // Never queue historical leads for visitors who consent later.
      if (!id || leads.has(id)) return;
      leads.add(id);
      if (choice === 'accepted' && initialized) window.fbq('track', 'Lead');
    }
  };
  const panel = document.createElement('section');
  panel.className = 'advertising-consent';
  panel.setAttribute('aria-labelledby', 'advertising-title');
  panel.innerHTML = `<div><h2 id="advertising-title">Your advertising choices</h2><p>With your permission, we use Meta Pixel to measure Facebook and Instagram ads and help show relevant ads. Meta receives page visits, successful quote events, and browser/device and cookie information, which it may associate with your Meta account. Your quote details and photos are not sent by our Pixel code. Declining won’t affect your quote. <a href="/privacy-policy">Privacy Policy</a></p><p class="help">You can change your choice through Advertising preferences in the footer.</p></div><div class="advertising-actions"><button type="button" class="btn btn--ghost" data-decline>Decline advertising</button><button type="button" class="btn btn--primary" data-accept>Accept advertising</button><button type="button" class="privacy-settings" data-close hidden>Keep current choice</button></div>`;
  document.body.appendChild(panel);
  const accept = panel.querySelector('[data-accept]');
  const decline = panel.querySelector('[data-decline]');
  const close = panel.querySelector('[data-close]');
  accept.addEventListener('click', () => choose('accepted'));
  decline.addEventListener('click', () => choose('declined'));
  close.addEventListener('click', () => { panel.hidden = true; opener?.focus(); });
  document.querySelectorAll('[data-advertising-settings]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    panel.hidden = false;
    close.hidden = choice === null;
    decline.focus();
  }));
  panel.hidden = choice !== null;
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    choice = readChoice();
    if (choice === 'accepted') start(); else revoke();
    panel.hidden = choice !== null;
  });
  if (choice === 'accepted') start();
})();
