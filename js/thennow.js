// ═══════════════════════════════════════════
//  THEN & NOW — Growth timeline lightbox
//  Photos are hardcoded — see index.html
//  Put your images in the images/ folder
// ═══════════════════════════════════════════

export function initThenNow() {
  // Click any growth photo → open lightbox
  document.querySelectorAll('.growth-photo-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img     = wrap.querySelector('.growth-photo');
      const caption = wrap.closest('.growth-card')
                          ?.querySelector('.growth-title')
                          ?.textContent || '';
      if (img?.src) openLightbox(img.src, caption);
    });
  });

  // Close lightbox
  const lb = document.getElementById('thennow-lightbox');
  lb?.addEventListener('click', e => {
    if (e.target === lb || e.target.closest('#thennow-lightbox-close')) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function openLightbox(src, caption) {
  const lb  = document.getElementById('thennow-lightbox');
  const img = document.getElementById('thennow-lightbox-img');
  const cap = document.getElementById('thennow-lightbox-caption');
  if (!lb || !img) return;
  img.src = src;
  if (cap) cap.textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('thennow-lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

// Called from i18n on language switch
export function updateThenNowLabels(tn) {
  if (!tn) return;
  setText('[data-t="thennow-eyebrow"]', tn.eyebrow);
  setHTML('[data-t="thennow-title"]',   `${tn.title} <em>${tn.titleAccent}</em>`);
  setText('[data-t="thennow-quote"]',   tn.quote);
  setText('[data-t="thennow-era1"]',    tn.era1);
  setText('[data-t="thennow-title1"]',  tn.title1);
  setText('[data-t="thennow-desc1"]',   tn.desc1);
  setText('[data-t="thennow-era2"]',    tn.era2);
  setText('[data-t="thennow-title2"]',  tn.title2);
  setText('[data-t="thennow-desc2"]',   tn.desc2);
  setText('[data-t="thennow-era3"]',    tn.era3);
  setText('[data-t="thennow-title3"]',  tn.title3);
  setText('[data-t="thennow-desc3"]',   tn.desc3);
  setText('[data-t="thennow-caption"]', tn.caption);
}

function setText(sel, val) {
  document.querySelectorAll(sel).forEach(el => { if (el && val) el.textContent = val; });
}
function setHTML(sel, val) {
  document.querySelectorAll(sel).forEach(el => { if (el && val) el.innerHTML = val; });
}
