(() => {
  'use strict';
  const section = document.querySelector('#film');
  if (!section) return;
  const player = section.querySelector('[data-film-player]');
  const poster = section.querySelector('[data-film-poster]');
  const host = section.querySelector('[data-film-host]');
  const playButton = section.querySelector('[data-film-inline]');
  const status = section.querySelector('[data-film-status]');
  const qualityButtons = [...section.querySelectorAll('[data-quality]')];
  const mobile = matchMedia('(max-width: 720px)').matches;
  const connection = navigator.connection;
  let quality = mobile ? (connection?.saveData || /2g/.test(connection?.effectiveType || '') ? '360p' : '480p') : '4k';
  let video;
  let shown = false;
  const base = new URL('../', document.currentScript.src);
  const source = q => new URL(`assets/video/bstvc-film-${q}.mp4`, base).href;
  const stop = document.createElement('button');
  stop.type = 'button';
  stop.className = 'film-action film-action-secondary';
  stop.textContent = 'Close film';
  stop.hidden = true;
  section.querySelector('.film-actions').prepend(stop);
  if (mobile) section.classList.add('is-mobile-film');

  function selection() {
    qualityButtons.forEach(b => b.setAttribute('aria-checked', String(b.dataset.quality === quality)));
    playButton.textContent = `Play ${quality.toUpperCase()}`;
  }
  function ensureVideo() {
    if (video) return video;
    video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.poster = new URL('assets/bstvc-film-poster.jpg', base).href;
    video.setAttribute('aria-label', 'BSTVC English film');
    video.src = source(quality);
    video.dataset.quality = quality;
    host.append(video);
    video.addEventListener('playing', () => { status.textContent = `Playing ${quality.toUpperCase()} · English film · 90 seconds`; });
    video.addEventListener('waiting', () => { status.textContent = 'Buffering… playback will resume automatically.'; });
    video.addEventListener('error', () => { status.textContent = 'The video could not load. Try another quality or open the WebGL film.'; });
    video.addEventListener('ended', () => { status.textContent = 'Film complete. Replay or explore the research themes below.'; });
    return video;
  }
  async function play() {
    const v = ensureVideo();
    shown = true;
    host.hidden = false;
    poster.hidden = true;
    player.classList.add('is-playing');
    playButton.hidden = true;
    stop.hidden = false;
    status.textContent = `Loading ${quality.toUpperCase()}…`;
    try { await v.play(); }
    catch (error) { if (error.name !== 'AbortError') status.textContent = 'Press play in the video controls to continue.'; }
  }
  function changeQuality(next) {
    if (!['360p','480p','1080p','4k'].includes(next) || next === quality) return;
    const time = video?.currentTime || 0;
    const resume = video && !video.paused;
    quality = next;
    selection();
    status.textContent = `${quality.toUpperCase()} selected.`;
    if (!video) return;
    video.pause();
    video.src = source(quality);
    video.dataset.quality = quality;
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(time, video.duration || time);
      if (resume && shown) video.play().catch(() => { status.textContent = 'Press play to continue.'; });
    };
    video.load();
  }
  qualityButtons.forEach(b => {
    b.addEventListener('click', () => changeQuality(b.dataset.quality));
    b.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const i = qualityButtons.indexOf(b);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? qualityButtons.length - 1 : (i + (['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1) + qualityButtons.length) % qualityButtons.length;
      qualityButtons[next].focus();
      changeQuality(qualityButtons[next].dataset.quality);
    });
  });
  poster.addEventListener('click', play);
  playButton.addEventListener('click', play);
  stop.addEventListener('click', () => {
    video?.pause();
    shown = false;
    host.hidden = true;
    poster.hidden = false;
    player.classList.remove('is-playing');
    playButton.hidden = false;
    stop.hidden = true;
    status.textContent = 'Paused. Press play to resume.';
    poster.focus();
  });
  section.querySelector('[data-film-web]').href = new URL('film/', base);
  section.querySelector('[data-film-new]').href = new URL('watch/', base);
  section.querySelector('[data-film-share]').addEventListener('click', async () => {
    const data = {title:'BSTVC | Desktop — Official Film',text:'Local interpretation, global contribution, and dynamic prediction.',url:new URL('watch/', base).href};
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); status.textContent = 'Film link copied.'; }
    } catch (error) { if (error.name !== 'AbortError') status.textContent = `Share this link: ${data.url}`; }
  });
  selection();
  status.textContent = `${quality.toUpperCase()} selected for this screen. Press play to begin.`;
  // Preload only small metadata near the player; never load WebGL alongside MP4.
  if ('IntersectionObserver' in window && !connection?.saveData) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { ensureVideo(); observer.disconnect(); }
    }, {rootMargin:'200px'});
    observer.observe(player);
  }
  const shell = document.querySelector('.site-shell');
  const original = document.querySelector('.signal-strip');
  if (shell && original) {
    let pending = false;
    const sync = () => { pending = false; shell.classList.toggle('is-past-film', original.getBoundingClientRect().top <= Math.min(96, innerHeight * .12)); };
    const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(sync); } };
    sync();
    addEventListener('scroll', schedule, {passive:true});
    addEventListener('resize', schedule, {passive:true});
  }
})();
