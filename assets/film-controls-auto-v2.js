(() => {
  'use strict';
  const section = document.querySelector('#film');
  if (!section) return;
  const player = section.querySelector('[data-film-player]');
  const poster = section.querySelector('[data-film-poster]');
  const host = section.querySelector('[data-film-host]');
  const playButton = section.querySelector('[data-film-inline]');
  const status = section.querySelector('[data-film-status]');
  const buttons = [...section.querySelectorAll('[data-quality]')];
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const mobile = matchMedia('(max-width: 720px)').matches;
  const levels = ['360p','480p','1080p','4k'];
  const base = new URL('../', document.currentScript.src);
  let automatic = true, quality = initialQuality(), video, shown = false;
  let position = 0, recoveryTimer = 0, generation = 0, restoring = false;
  let frameCheck = {time:0,total:0,dropped:0};
  const stop = document.createElement('button');
  stop.type = 'button'; stop.className = 'film-action film-action-secondary';
  stop.textContent = 'Close film'; stop.hidden = true;
  section.querySelector('.film-actions').prepend(stop);
  if (mobile) section.classList.add('is-mobile-film');
  function initialQuality() {
    if (connection?.saveData || /(^|slow-)2g/.test(connection?.effectiveType || '') ||
        (connection?.downlink > 0 && connection.downlink < .8) || connection?.rtt > 500) return '360p';
    if (!mobile && connection?.downlink >= 5 && (navigator.hardwareConcurrency || 4) >= 4 &&
        (navigator.deviceMemory || 4) >= 4) return '1080p';
    return '480p'; // Unknown networks start small. 4K is an explicit choice.
  }
  const source = q => new URL(`assets/video/bstvc-film-${q}${q === '4k' ? '' : '-fast-v2'}.mp4`, base).href;
  function selection() {
    buttons.forEach(b => {
      const selected = automatic ? b.dataset.quality === 'auto' : b.dataset.quality === quality;
      b.setAttribute('aria-checked', String(selected)); b.tabIndex = selected ? 0 : -1;
    });
    playButton.textContent = automatic ? 'Play film' : `Play ${quality.toUpperCase()}`;
    section.dataset.activeQuality = quality; section.dataset.qualityMode = automatic ? 'auto' : 'manual';
  }
  function message(text) { status.textContent = `${automatic ? 'Auto · ' : ''}${quality.toUpperCase()} · ${text}`; }
  function clearRecovery() { clearTimeout(recoveryTimer); recoveryTimer = 0; }
  function recoverSoon() {
    if (!shown || !automatic || recoveryTimer || quality === '360p') return;
    recoveryTimer = setTimeout(() => {
      recoveryTimer = 0;
      if (!shown || !automatic || !video || video.paused || video.ended || video.readyState >= 3) return;
      switchSource(levels[levels.indexOf(quality)-1], true);
      message('Using a smaller file for smoother playback.');
    }, 4000);
  }
  function ensureVideo() {
    if (video) return video;
    video = document.createElement('video');
    video.controls = true; video.playsInline = true; video.preload = 'none';
    video.poster = new URL('assets/bstvc-film-poster-fast-v2.webp', base).href;
    video.setAttribute('aria-label', 'BSTVC English film'); host.append(video);
    video.addEventListener('playing', () => {
      clearRecovery(); poster.hidden = true; player.classList.remove('is-loading');
      message('Playing · English film · 90 seconds');
      document.dispatchEvent(new CustomEvent('bstvc:film-playback', {detail:{playing:true}}));
    });
    video.addEventListener('waiting', () => { message('Buffering…'); recoverSoon(); });
    video.addEventListener('stalled', recoverSoon);
    video.addEventListener('pause', () => {
      if (video.paused) clearRecovery();
      document.dispatchEvent(new CustomEvent('bstvc:film-playback', {detail:{playing:false}}));
    });
    video.addEventListener('error', () => {
      clearRecovery();
      if (automatic && quality !== '360p' && shown) switchSource(levels[levels.indexOf(quality)-1], true);
      else { message('Unable to load. Choose Auto or another quality, then press play to retry.'); playButton.hidden = false; player.classList.remove('is-loading'); }
    });
    video.addEventListener('ended', () => {
      clearRecovery(); message('Film complete. Replay or explore the research themes below.');
      document.dispatchEvent(new CustomEvent('bstvc:film-playback', {detail:{playing:false}}));
    });
    video.addEventListener('timeupdate', () => {
      if (!shown || restoring || video.seeking || video.readyState < 2) return;
      position = video.currentTime;
      if (!automatic || quality === '360p' || position-frameCheck.time < 5 || !video.getVideoPlaybackQuality) return;
      const frames = video.getVideoPlaybackQuality();
      const total = frames.totalVideoFrames-frameCheck.total, dropped = frames.droppedVideoFrames-frameCheck.dropped;
      frameCheck = {time:position,total:frames.totalVideoFrames,dropped:frames.droppedVideoFrames};
      if (total > 60 && dropped/total > .15) switchSource(levels[levels.indexOf(quality)-1], true);
    });
    return video;
  }
  function switchSource(next, resume) {
    clearRecovery(); if (video?.currentTime > 0) position = video.currentTime;
    quality = next; selection(); if (!video) return;
    const current = ++generation;
    restoring = true;
    video.pause();
    video.onloadedmetadata = () => {
      if (current !== generation) return;
      video.currentTime = Math.min(position, Math.max(0, video.duration-.1) || position);
      restoring = false;
      if (resume && shown) video.play().catch(() => message('Press play in the video controls to continue.'));
    };
    video.src = source(quality); video.load(); frameCheck = {time:position,total:0,dropped:0};
    if (resume && shown) {
      video.play().catch(e => { if (e.name !== 'AbortError') message('Press play in the video controls to continue.'); }); recoverSoon();
    }
  }
  function play() {
    const v = ensureVideo(); shown = true; host.hidden = false;
    player.classList.add('is-playing','is-loading'); playButton.hidden = true; stop.hidden = false;
    message('Loading film…');
    if (!v.getAttribute('src') || v.error) switchSource(quality, true);
    else { v.play().catch(() => message('Press play in the video controls to continue.')); recoverSoon(); }
  }
  function choose(next) {
    if (next !== 'auto' && !levels.includes(next)) return;
    automatic = next === 'auto'; const desired = automatic ? initialQuality() : next;
    const resume = shown && video && (!video.paused || player.classList.contains('is-loading'));
    if (desired !== quality) switchSource(desired, resume);
    else { clearRecovery(); selection(); if (resume) recoverSoon(); }
    message(shown ? 'Quality selected.' : 'Selected. Press play to begin.');
  }
  buttons.forEach(b => {
    b.addEventListener('click', () => choose(b.dataset.quality));
    b.addEventListener('keydown', e => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)) return;
      e.preventDefault(); const i = buttons.indexOf(b);
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length-1 :
        (i + (['ArrowRight','ArrowDown'].includes(e.key) ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus(); choose(buttons[next].dataset.quality);
    });
  });
  poster.addEventListener('click', play); playButton.addEventListener('click', play);
  stop.addEventListener('click', () => {
    shown = false; clearRecovery();
    if (video) {
      if (video.currentTime > 0) position = video.currentTime;
      restoring = true;
      video.pause(); video.removeAttribute('src'); video.onloadedmetadata = null; ++generation; video.load();
    }
    host.hidden = true; poster.hidden = false; player.classList.remove('is-playing','is-loading');
    // load() can cancel the queued native pause event; clear the page state explicitly.
    document.dispatchEvent(new CustomEvent('bstvc:film-playback', {detail:{playing:false}}));
    playButton.hidden = false; stop.hidden = true; message('Paused. Press play to resume.'); poster.focus();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { video?.pause(); clearRecovery(); } });
  connection?.addEventListener?.('change', () => {
    if (!automatic) return;
    const desired = initialQuality();
    if (levels.indexOf(desired) < levels.indexOf(quality)) switchSource(desired, shown && video && !video.paused);
  });
  section.querySelector('[data-film-web]').href = new URL('film/', base);
  section.querySelector('[data-film-new]').href = new URL('watch/', base);
  section.querySelector('[data-film-share]').addEventListener('click', async () => {
    const data = {title:'BSTVC | Desktop — Official Film',text:'Local interpretation, global contribution, and dynamic prediction.',url:new URL('watch/', base).href};
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); message('Film link copied.'); }
    } catch (e) { if (e.name !== 'AbortError') message(`Share this link: ${data.url}`); }
  });
  selection(); message('Ready for fast playback. You can choose HD or 4K.');
  // Never create or request an MP4 until a user presses play.
  const shell = document.querySelector('.site-shell'), original = document.querySelector('.signal-strip');
  if (shell && original) {
    let pending = false;
    const sync = () => { pending = false; shell.classList.toggle('is-past-film', original.getBoundingClientRect().top <= Math.min(96,innerHeight*.12)); };
    const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(sync); } };
    sync(); addEventListener('scroll', schedule, {passive:true}); addEventListener('resize', schedule, {passive:true});
  }
})();
