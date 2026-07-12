(function () {
  'use strict';

  function getLang() {
    return localStorage.getItem('tup_lang') || 'es';
  }

  function getLabels() {
    const lang = getLang();
    return lang === 'es'
      ? { share: 'Compartir', copied: 'Enlace copiado', close: 'Cerrar' }
      : { share: 'Share', copied: 'Link copied', close: 'Close' };
  }

  function ensureModal() {
    let modal = document.getElementById('privateImageModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'privateImageModal';
    modal.className = 'intercessor-image-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.display = 'none';
    modal.innerHTML =
      '<div class="intercessor-image-modal-actions">' +
      '<button class="intercessor-image-modal-share" id="privateImageModalShare" type="button"></button>' +
      '<button class="intercessor-image-modal-close" id="privateImageModalClose" type="button"></button>' +
      '</div>' +
      '<img class="intercessor-image-modal-img" id="privateImageModalImg" alt="" />';
    document.body.appendChild(modal);
    return modal;
  }

  function setButtonLabels() {
    const labels = getLabels();
    const shareBtn = document.getElementById('privateImageModalShare');
    const closeBtn = document.getElementById('privateImageModalClose');
    if (shareBtn) shareBtn.textContent = labels.share;
    if (closeBtn) closeBtn.textContent = labels.close;
    if (shareBtn) shareBtn.setAttribute('aria-label', labels.share);
    if (closeBtn) closeBtn.setAttribute('aria-label', labels.close);
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

    const pageUrl = window.location.href;
    const imageUrl = modalImg.src;

    async function copyPageUrl() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(pageUrl);
        return;
      }

      const ta = document.createElement('textarea');
      ta.value = pageUrl;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    async function getShareFile(url) {
      const response = await fetch(url, { credentials: 'same-origin' });
      const blob = await response.blob();
      const mimeType = blob.type || 'image/png';
      const extension = mimeType.includes('jpeg') ? 'jpg' : mimeType.split('/').pop() || 'png';
      return new File([blob], `private-image.${extension}`, { type: mimeType });
    }

    try {
      let shared = false;
      try {
        const shareFile = await getShareFile(imageUrl);
        if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [shareFile] }))) {
          await navigator.share({ files: [shareFile], url: pageUrl });
          shared = true;
        }
      } catch {
        // fall through to the page-link fallback below
      }

      if (!shared) {
        await copyPageUrl();

        const labels = getLabels();
        const previous = shareBtn.textContent;
        shareBtn.textContent = labels.copied;
        setTimeout(() => { shareBtn.textContent = previous || labels.share; }, 1400);
      }
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
