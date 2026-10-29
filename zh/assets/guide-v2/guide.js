(() => {
  'use strict';
  const menu = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('guide-sidebar');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    sidebar.classList.toggle('is-open', open);
  });
  sidebar?.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
    menu?.setAttribute('aria-expanded', 'false');
    sidebar.classList.remove('is-open');
  }));
  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.sidebar nav a')];
  if ('IntersectionObserver' in window) {
    const visible = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      const first = sections.find(section => visible.has(section));
      if (first) links.forEach(link => link.setAttribute('aria-current', String(link.hash === '#' + first.id)));
    }, { rootMargin: '-110px 0px -45% 0px' });
    sections.forEach(section => observer.observe(section));
  }
  const searchInput = document.getElementById('guide-search');
  const searchStatus = document.getElementById('search-status');
  let lastQuery = '', matches = [], matchIndex = -1;
  document.getElementById('search-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const query = searchInput.value.trim().toLocaleLowerCase();
    if (!query) { searchStatus.textContent = '输入章节、参数或报错关键词'; return; }
    if (query !== lastQuery) {
      const candidates = [...document.querySelectorAll('main h2, main h3, main h4, main p, main td, main summary, main li')];
      matches = candidates.filter(el => el.textContent.toLocaleLowerCase().includes(query));
      lastQuery = query;
      matchIndex = -1;
    }
    if (!matches.length) { searchStatus.textContent = '未找到，试试“数据检查”或“可信区间”'; return; }
    matchIndex = (matchIndex + 1) % matches.length;
    const target = matches[matchIndex];
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS') parent.open = true;
    }
    searchStatus.textContent = `第 ${matchIndex + 1} / ${matches.length} 处 · 再次搜索跳到下一处`;
    target.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    target.classList.remove('search-hit');
    requestAnimationFrame(() => target.classList.add('search-hit'));
  });
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const pre = button.closest('.code-wrap').querySelector('pre');
    const text = pre.textContent;
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch (_) {
      const area = document.createElement('textarea');
      area.value = text; area.style.cssText = 'position:fixed;opacity:0;'; document.body.append(area);
      area.select(); copied = document.execCommand('copy'); area.remove();
    }
    button.textContent = copied ? '已复制' : '请选择代码复制';
    setTimeout(() => button.textContent = '复制', 1800);
  }));
  const dialog = document.getElementById('image-dialog');
  const dialogImg = document.getElementById('dialog-image');
  const dialogLabel = document.getElementById('dialog-label');
  if (dialog && typeof dialog.showModal === 'function') {
    document.querySelectorAll('figure a[data-zoom]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      dialogImg.src = link.querySelector('img').currentSrc || link.href;
      dialogImg.alt = link.querySelector('img').alt;
      dialogLabel.textContent = dialogImg.alt;
      dialog.showModal();
    }));
    document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { dialogImg.removeAttribute('src'); });
  }
})();
