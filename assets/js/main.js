(() => {
  const config = window.BLINDSFOLD_CONFIG || {};

  // ---------- Analytics loaders ----------
  function loadAnalytics() {
    if (config.gaMeasurementId && !config.gaMeasurementId.includes('XXXX')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.gaMeasurementId)}`;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', config.gaMeasurementId, { anonymize_ip: true });
    }

    if (config.clarityProjectId) {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, 'clarity', 'script', config.clarityProjectId);
    }
  }

  function track(eventName, params = {}) {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, params);
    if (typeof window.clarity === 'function') window.clarity('event', eventName);
  }
  window.blindsfoldTrack = track;
  loadAnalytics();

  document.querySelectorAll('[data-event]').forEach((el) => {
    el.addEventListener('click', () => track(el.dataset.event, { label: el.dataset.eventLabel || el.textContent.trim() }));
  });

  // ---------- Mobile menu ----------
  const toggle = document.querySelector('[data-mobile-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // ---------- Multi-step quote forms ----------
  document.querySelectorAll('[data-quote-form]').forEach((form) => {
    const steps = [...form.querySelectorAll('.form-step')];
    const progress = [...form.closest('.quote-form-card')?.querySelectorAll('.progress__item') || []];
    const back = form.querySelector('[data-back]');
    const next = form.querySelector('[data-next]');
    const submit = form.querySelector('[data-submit]');
    const status = form.querySelector('[data-form-status]');
    const success = form.querySelector('[data-success-card]');
    let current = 0;
    let started = false;

    const show = (index) => {
      current = Math.max(0, Math.min(index, steps.length - 1));
      steps.forEach((step, i) => step.classList.toggle('is-active', i === current));
      progress.forEach((item, i) => {
        item.classList.toggle('is-active', i === current);
        item.classList.toggle('is-complete', i < current);
      });
      if (back) back.hidden = current === 0;
      if (next) next.hidden = current === steps.length - 1;
      if (submit) submit.hidden = current !== steps.length - 1;
      status?.classList.remove('is-error', 'is-success');
      if (status) status.textContent = '';
    };

    const requiredForStep = () => [...steps[current].querySelectorAll('[required]')];
    const validateStep = () => {
      const required = requiredForStep();
      for (const field of required) {
        if (field.type === 'radio') {
          const group = form.querySelectorAll(`input[name="${CSS.escape(field.name)}"]`);
          if (![...group].some(r => r.checked)) {
            group[0]?.focus();
            setStatus('Please choose an option before continuing.', 'error');
            return false;
          }
        } else if (!field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }
      return true;
    };

    const setStatus = (message, type) => {
      if (!status) return;
      status.textContent = message;
      status.classList.remove('is-error', 'is-success');
      status.classList.add(type === 'success' ? 'is-success' : 'is-error');
    };

    form.addEventListener('input', () => {
      if (!started) {
        started = true;
        track('quote_started');
      }
    }, { once: false });

    next?.addEventListener('click', () => {
      if (!validateStep()) return;
      track('quote_step_completed', { step: current + 1 });
      show(current + 1);
    });
    back?.addEventListener('click', () => show(current - 1));

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!validateStep()) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!config.formEndpoint) {
        setStatus('Online quote delivery is not connected yet. Please call/text 431-788-5688 or email info@blindsfold.com.', 'error');
        return;
      }

      submit.disabled = true;
      submit.textContent = 'Sending…';
      setStatus('Sending your request…', 'success');

      try {
        const response = await fetch(config.formEndpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('Submission failed');

        track('quote_submitted');
        form.reset();
        setStatus('Thanks! We received your request.', 'success');
        success?.classList.add('is-visible');
        submit.textContent = 'Sent';
        setTimeout(() => success?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
      } catch (error) {
        setStatus('We could not send the quote request. Please call/text 431-788-5688 or email info@blindsfold.com.', 'error');
        submit.disabled = false;
        submit.textContent = 'Get My Free Quote';
      }
    });

    show(0);
  });
})();
