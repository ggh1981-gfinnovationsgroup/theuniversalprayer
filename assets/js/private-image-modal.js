(function () {
  'use strict';

  function getLang() {
    return localStorage.getItem('tup_lang') || 'es';
  }

  function getLabels() {
    const lang = getLang();
    return lang === 'es'
      ? { share: '↗ Compartir', copied: 'Enlace copiado', close: '✕' }
      : { share: '↗ Share', copied: 'Link copied', close: '✕' };
  }

  function ensureModal() {
    let modal = document.getElementById('privateImageModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'privateImageModal';
    modal.className = 'private-image-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.display = 'none';
    modal.innerHTML =
      '<button class="private-image-modal-share" id="privateImageModalShare" type="button"></button>' +
      '<button class="private-image-modal-close" id="privateImageModalClose" type="button"></button>' +
      '<img class="private-image-modal-img" id="privateImageModalImg" alt="" />';
    document.body.appendChild(modal);
    return modal;
  }

  function setButtonLabels() {
    const labels = getLabels();
    const shareBtn = document.getElementById('privateImageModalShare');
    const closeBtn = document.getElementById('privateImageModalClose');
    if (shareBtn) shareBtn.textContent = labels.share;
    if (closeBtn) closeBtn.textContent = labels.close;
    if (shareBtn) shareBtn.setAttribute('aria-label', labels.share.replace(/^↗\s*/, ''));
    if (closeBtn) closeBtn.setAttribute('aria-label', labels.close.replace(/^✕\s*/, ''));
  }

  function openModal(sourceImg) {
    const modal = ensureModal();
    const modalImg = document.getElementById('privateImageModalImg');
    if (!modal || !modalImg || !sourceImg || !sourceImg.src) return;

    modalImg.src = sourceImg.src;
    modalImg.alt = sourceImg.alt || '';
    setButtonLabels();
    modal.style.display = 'flex';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('privateImageModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  async function shareImage() {
    const modal = document.getElementById('privateImageModal');
    const modalImg = document.getElementById('privateImageModalImg');
    const shareBtn = document.getElementById('privateImageModalShare');
    if (!modal || !modalImg || !shareBtn) return;

    const title = document.title || 'The Universal Prayer';
    const pageUrl = window.location.href;
    const imageUrl = modalImg.src;
    const text = `${title}\n${pageUrl}\n${imageUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: pageUrl });
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      const labels = getLabels();
      const previous = shareBtn.textContent;
      shareBtn.textContent = labels.copied;
      setTimeout(() => { shareBtn.textContent = previous || labels.share; }, 1400);
    } catch {
      // ignore cancelled share sheets and clipboard failures
    }
  }

  function wireImage(img) {
    if (!img || img.dataset.privateZoomWired === '1') return;
    img.dataset.privateZoomWired = '1';
    img.classList.add('is-zoomable');
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.setAttribute('aria-label', getLang() === 'es' ? 'Ampliar imagen' : 'Expand image');

    img.addEventListener('click', function () { openModal(img); });
    img.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(img);
      }
    });
  }

  function init() {
    const host = document.getElementById('mensajePrivado');
    if (!host) return;

    ensureModal();
    setButtonLabels();

    const image = host.querySelector('.adoracion-card-icon');
    wireImage(image);

    const modal = document.getElementById('privateImageModal');
    const closeBtn = document.getElementById('privateImageModalClose');
    const shareBtn = document.getElementById('privateImageModalShare');

    if (closeBtn && !closeBtn.dataset.privateZoomWired) {
      closeBtn.dataset.privateZoomWired = '1';
      closeBtn.addEventListener('click', closeModal);
    }
    if (shareBtn && !shareBtn.dataset.privateZoomWired) {
      shareBtn.dataset.privateZoomWired = '1';
      shareBtn.addEventListener('click', shareImage);
    }
    if (modal && !modal.dataset.privateZoomWired) {
      modal.dataset.privateZoomWired = '1';
      modal.addEventListener('click', function (event) {
        if (event.target === modal) closeModal();
      });
    }
    if (!document.body.dataset.privateZoomEscapeWired) {
      document.body.dataset.privateZoomEscapeWired = '1';
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) {
          closeModal();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
