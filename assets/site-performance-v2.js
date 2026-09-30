(() => {
  'use strict';
  const root = document.documentElement;
  const connection = navigator.connection;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Keep the three brand scenes on every device; load only while visible.
  // A missing network estimate is not a request to disable the site's motion.
  const allowScenes = !reduced && !connection?.saveData;
  let filmPlaying = false;
  const motionFrames = [...document.querySelectorAll('[data-motion-src]')];
  const visibleFrames = new Set();
  function updateFrame(frame) {
    const active = allowScenes && visibleFrames.has(frame) && !filmPlaying && !document.hidden;
    if (active && frame.dataset.motionLoaded !== 'true') {
      frame.dataset.motionLoaded = 'true'; frame.dataset.motionState = 'loading';
      frame.onload = () => {
        if (frame.dataset.motionLoaded !== 'true') return;
        frame.classList.remove('motion-frame-failed');
        frame.classList.add('motion-frame-ready'); frame.parentElement?.classList.add('motion-stage-ready');
        frame.dataset.motionState = 'ready'; frame.dataset.animationActive = 'true';
      };
      frame.src = frame.dataset.motionSrc;
    } else if (!active && frame.dataset.motionLoaded === 'true') {
      frame.onload = null; frame.removeAttribute('src'); frame.dataset.motionLoaded = 'false';
      frame.classList.remove('motion-frame-ready'); frame.parentElement?.classList.remove('motion-stage-ready');
      frame.dataset.motionState = 'fallback'; frame.dataset.animationActive = 'false';
    }
  }
  root.classList.toggle('bstvc-motion-static', !allowScenes);
  if (!allowScenes) {
    motionFrames.forEach(f => { f.dataset.animationActive = 'false'; });
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      const frame = motionFrames.find(f => (f.classList.contains('hero-dynamic-background') ? f.closest('.hero-stage') : f.parentElement) === entry.target);
      if (!frame) return;
      if (entry.isIntersecting) visibleFrames.add(frame); else visibleFrames.delete(frame);
      updateFrame(frame);
    }), {threshold:.01});
    motionFrames.forEach(f => observer.observe(f.classList.contains('hero-dynamic-background') ? f.closest('.hero-stage') : f.parentElement));
  } else {
    motionFrames.forEach(f => { visibleFrames.add(f); updateFrame(f); });
  }
  function visibility() {
    root.classList.toggle('page-inactive', document.hidden);
    motionFrames.forEach(updateFrame);
  }
  document.addEventListener('visibilitychange', visibility);
  document.addEventListener('bstvc:film-playback', event => {
    filmPlaying = event.detail.playing; root.classList.toggle('film-is-playing', filmPlaying); visibility();
  });
  // Observe animation owners, including pseudo-elements. CSS pausing does not affect the native video.
  if ('IntersectionObserver' in window) {
    const observed = new WeakSet();
    const animatedNodes = new Set();
    function pauseOutside(el) {
      const rect = el.getBoundingClientRect();
      el.classList.toggle('motion-offscreen', rect.bottom <= 0 || rect.top >= innerHeight || rect.width <= 0 || rect.height <= 0);
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      pauseOutside(entry.target);
    }), {threshold:0});
    function scan() {
      document.querySelectorAll('body *').forEach(el => {
        if (observed.has(el) || ['SCRIPT','STYLE'].includes(el.tagName)) return;
        const animated = ['', '::before','::after'].some(p => getComputedStyle(el,p || null).animationName !== 'none');
        if (!animated) return;
        pauseOutside(el);
        observed.add(el); animatedNodes.add(el); observer.observe(el);
      });
    }
    let pending = false;
    const sync = () => { pending = false; animatedNodes.forEach(el => { if (el.isConnected) pauseOutside(el); }); };
    const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(sync); } };
    addEventListener('scroll', schedule, {passive:true}); addEventListener('resize', schedule, {passive:true});
    scan(); setTimeout(scan, 1800); setTimeout(scan, 4500);
  }
})();
