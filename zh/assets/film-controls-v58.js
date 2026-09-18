(() => {
  const section = document.querySelector('#film');
  if (!section) return;

  const player = section.querySelector('[data-film-player]');
  const poster = section.querySelector('[data-film-poster]');
  const host = section.querySelector('[data-film-host]');
  const inlineButton = section.querySelector('[data-film-inline]');
  const webFilm = section.querySelector('[data-film-web]');
  const standalone = section.querySelector('[data-film-new]');
  const shareButton = section.querySelector('[data-film-share]');
  const status = section.querySelector('[data-film-status]');
  const actions = section.querySelector('.film-actions');
  const qualityButtons = Array.from(section.querySelectorAll('[data-quality]'));
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') || window.innerWidth <= 720;
  const slowNetwork = Boolean(connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '') || (connection?.downlink && connection.downlink < 1.5));
  const compactScreen = Math.min(screen.width || innerWidth, screen.height || innerHeight) <= 390;
  const labels = {
    '360p': '360P · 640 × 360',
    '480p': '480P · 854 × 480',
    '1080p': '1080P · 1920 × 1080',
    '4k': '4K · 3840 × 2160',
  };
  const sources = {
    '360p': './assets/video/bstvc-film-360p.mp4',
    '480p': './assets/video/bstvc-film-480p.mp4',
    '1080p': './assets/video/bstvc-film-1080p.mp4',
    '4k': './assets/video/bstvc-film-4k.mp4',
  };
  const shareData = {
    title: 'BSTVC 官方宣传片｜让时空异质性转化为可解释证据',
    text: '90 秒了解 BSTVC 如何连接局部时空解释、全局贡献分析与动态预测，并将贝叶斯时空变系数模型转化为可复现的桌面研究工作流。',
    url: new URL('./watch/', location.href).href,
  };

  let quality = isMobile ? ((slowNetwork || compactScreen) ? '360p' : '480p') : '4k';
  let video = null;
  let ready = false;
  let revealed = false;

  if (isMobile) section.classList.add('is-mobile-film');

  const stopButton = document.createElement('button');
  stopButton.className = 'film-action film-action-secondary';
  stopButton.type = 'button';
  stopButton.dataset.filmStop = '';
  stopButton.textContent = '退出影片';
  stopButton.hidden = true;
  actions.prepend(stopButton);

  const updateSelection = () => {
    qualityButtons.forEach((button) => {
      button.setAttribute('aria-checked', String(button.dataset.quality === quality));
    });
    inlineButton.textContent = isMobile ? `一键播放（极速 ${quality.toUpperCase()}）` : `播放已预载的 ${quality.toUpperCase()}`;
  };

  const updateReadyStatus = () => {
    status.textContent = `${labels[quality]} 已在后台就绪，点击影片即可立即播放。`;
  };

  const createVideo = (reason = 'background') => {
    if (video?.dataset.quality === quality) return video;

    ready = false;
    host.hidden = false;
    host.classList.add('is-preloading');
    poster.hidden = false;
    player.classList.add('is-preloading');
    player.classList.remove('is-playing');
    host.replaceChildren();

    video = document.createElement('video');
    video.dataset.quality = quality;
    video.src = sources[quality];
    video.poster = './assets/bstvc-film-poster.png';
    video.preload = 'auto';
    video.controls = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.setAttribute('x5-video-player-type', 'h5-page');
    video.setAttribute('controlslist', 'nodownload');
    video.setAttribute('aria-label', `BSTVC 90 秒宣传片 · ${labels[quality]}`);
    host.append(video);

    const markReady = () => {
      ready = true;
      if (!revealed) updateReadyStatus();
    };
    video.addEventListener('canplay', markReady, { once: true });
    video.addEventListener('loadeddata', markReady, { once: true });
    video.addEventListener('playing', () => {
      status.textContent = `正在播放 ${labels[quality]} MP4。`;
    });
    video.addEventListener('waiting', () => {
      status.textContent = `${labels[quality]} 正在缓冲，将自动继续播放。`;
    });
    video.addEventListener('error', () => {
      const code = video?.error?.code || 'unknown';
      status.textContent = `MP4 播放失败（${code}）。可切换清晰度或使用“网页影片”。`;
    });
    video.load();

    if (reason === 'background') {
      status.textContent = `正在后台预载唯一的 ${labels[quality]} MP4；网页影片不会同时载入。`;
    }
    return video;
  };

  const revealAndPlay = async () => {
    if (!video || video.dataset.quality !== quality) createVideo('interaction');
    revealed = true;
    host.hidden = false;
    host.classList.remove('is-preloading');
    poster.hidden = true;
    player.classList.remove('is-preloading');
    player.classList.add('is-playing');
    inlineButton.hidden = true;
    stopButton.hidden = false;
    status.textContent = ready ? '影片已就绪，正在自动播放。' : `正在优先载入 ${labels[quality]}，完成后会自动播放。`;
    try {
      await video.play();
    } catch (error) {
      status.textContent = `浏览器暂停了自动播放（${error.name}）；请点击影片画面内的播放键。`;
    }
  };

  const hideFilm = () => {
    video?.pause();
    revealed = false;
    host.classList.add('is-preloading');
    poster.hidden = false;
    player.classList.remove('is-playing');
    player.classList.add('is-preloading');
    inlineButton.hidden = false;
    stopButton.hidden = true;
    status.textContent = `${labels[quality]} 仍保留在后台；再次点击即可继续播放。`;
    poster.focus();
  };

  const chooseQuality = (next) => {
    if (!sources[next] || next === quality) return;
    const wasRevealed = revealed;
    video?.pause();
    quality = next;
    updateSelection();
    createVideo('quality');
    status.textContent = `已切换为 ${labels[quality]}，只载入这一档 MP4。`;
    if (wasRevealed) revealAndPlay();
  };

  const shareFilm = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        status.textContent = '已打开系统分享面板。';
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        status.textContent = '影片标题、摘要与稳定链接已复制。';
      }
    } catch (error) {
      if (error.name !== 'AbortError') status.textContent = `分享未完成，可直接复制：${shareData.url}`;
    }
  };

  updateSelection();
  webFilm.href = './film/';
  standalone.href = './watch/';
  status.textContent = isMobile
    ? `手机端自动选择 ${quality.toUpperCase()}；主内容加载后只预载这一档 MP4。`
    : `桌面端默认 ${quality.toUpperCase()}；主内容加载后只预载这一档 MP4。`;

  qualityButtons.forEach((button) => button.addEventListener('click', () => chooseQuality(button.dataset.quality)));
  poster.addEventListener('click', revealAndPlay);
  inlineButton.addEventListener('click', revealAndPlay);
  stopButton.addEventListener('click', hideFilm);
  shareButton.addEventListener('click', shareFilm);

  const beginBackgroundPreload = () => window.setTimeout(() => createVideo('background'), isMobile ? 120 : 280);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', beginBackgroundPreload, { once: true });
  else beginBackgroundPreload();

  // The live hero scene belongs only to the opening film experience. Once the
  // original content stream reaches the top of the viewport, remove the fixed
  // scene so it cannot bleed into the site's later reading sections.
  const siteShell = document.querySelector('.site-shell');
  const originalContentStart = document.querySelector('.signal-strip');
  if (siteShell && originalContentStart) {
    let stageFrame = 0;
    const syncOpeningStage = () => {
      stageFrame = 0;
      // Switch painting planes while the opaque signal strip is passing below
      // the top navigation. This keeps the hand-off invisible and guarantees
      // that the first two reading sections never inherit the hero canvas.
      const handoffLine = Math.min(96, window.innerHeight * 0.12);
      siteShell.classList.toggle('is-past-film', originalContentStart.getBoundingClientRect().top <= handoffLine);
    };
    const scheduleOpeningStageSync = () => {
      if (stageFrame) return;
      stageFrame = window.requestAnimationFrame(syncOpeningStage);
    };
    syncOpeningStage();
    window.addEventListener('scroll', scheduleOpeningStageSync, { passive: true });
    window.addEventListener('resize', scheduleOpeningStageSync, { passive: true });
  }
})();
