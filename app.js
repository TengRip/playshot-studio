// PlayShot Studio - Core Application Logic

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const state = {
    screenshots: [],          // [{ image, dataUrl, fileName }]
    currentScreenshotIdx: 0,
    orientation: 'portrait',
    fitMode: 'cover',
    showDeviceFrame: true,
    bgType: 'gradient',
    bgColor: '#3b82f6',
    gradStart: '#1e1b4b',
    gradEnd: '#311042',
    captionZH_top: '簡約明瞭的財務圖表',
    fontFamily_top: 'Outfit',
    fontSize_top: 70,
    lineHeight_top: 1.3,
    textColor_top: '#ffffff',
    textMargin_top: 80,
    showTextShadow_top: true,
    translations_top: { zh: '簡約明瞭的財務圖表', en: 'Simple and Clear Financial Charts', ja: 'シンプルで明快な財務グラフ', ko: '심플하고 명확한 재무 차트' },
    captionZH_bottom: '',
    fontFamily_bottom: 'Outfit',
    fontSize_bottom: 45,
    lineHeight_bottom: 1.3,
    textColor_bottom: '#a5b4fc',
    textMargin_bottom: 80,
    showTextShadow_bottom: true,
    translations_bottom: { zh: '', en: '', ja: '', ko: '' },
    currentLangPreview: 'zh',
    zoom: 0.3,
    layoutMode: 'vertical',
    bgPattern: 'none',
    uploadedBgImage: null,
    bgImageDataUrl: null,
    bgImageFileName: '',
    bgOverlayOpacity: 0,
    imageSource: 'upload',
    aiPrompt: '',
    aiPromptFeature: '',
    aiStyle: 'app mockup, modern UI, clean design, 3d render',
    aiSeed: 42,
    aiCohesiveSeed: true,
    aiImages: { phone: null, tablet7: null, tablet10: null, feature: null },
    aiDataUrls: { phone: null, tablet7: null, tablet10: null, feature: null },
    iconDataUrl: null,
    iconColors: []
  };

  const textRanges = {
    phone:    { top: { y1: 0, y2: 0 }, bottom: { y1: 0, y2: 0 } },
    tablet7:  { top: { y1: 0, y2: 0 }, bottom: { y1: 0, y2: 0 } },
    tablet10: { top: { y1: 0, y2: 0 }, bottom: { y1: 0, y2: 0 } },
    feature:  { top: { y1: 0, y2: 0 }, bottom: { y1: 0, y2: 0 } }
  };

  const DEVICE_SPECS = {
    phone:    { portrait: { width: 1080, height: 2280 }, landscape: { width: 2280, height: 1080 } },
    tablet7:  { portrait: { width: 1200, height: 1920 }, landscape: { width: 1920, height: 1200 } },
    tablet10: { portrait: { width: 1600, height: 2560 }, landscape: { width: 2560, height: 1600 } },
    feature:  { portrait: { width: 1024, height: 500 }, landscape: { width: 1024, height: 500 } }
  };

  function getCurrentImage() {
    return state.screenshots[state.currentScreenshotIdx]?.image || null;
  }

  const el = {
    fileInput:          document.getElementById('file-input'),
    uploadZone:         document.getElementById('upload-zone'),
    uploadPromptEmpty:  document.getElementById('upload-prompt-empty'),
    uploadPromptAdd:    document.getElementById('upload-prompt-add'),
    screenshotStrip:    document.getElementById('screenshot-strip'),
    screenshotCounter:  document.getElementById('screenshot-counter'),
    stripThumbnails:    document.getElementById('strip-thumbnails'),
    btnPrevShot:        document.getElementById('btn-prev-shot'),
    btnNextShot:        document.getElementById('btn-next-shot'),
    btnAddShot:         document.getElementById('btn-add-shot'),
    btnRemoveShot:      document.getElementById('btn-remove-shot'),
    orientationBtns:    document.querySelectorAll('[data-orientation]'),
    selectFitMode:      document.getElementById('select-fit-mode'),
    selectLayoutMode:   document.getElementById('select-layout-mode'),
    toggleDeviceFrame:  document.getElementById('toggle-device-frame'),
    bgTypeRadios:       document.querySelectorAll('input[name="bg-type"]'),
    bgSolidControl:     document.getElementById('bg-solid-control'),
    bgGradientControl:  document.getElementById('bg-gradient-control'),
    colorBg:            document.getElementById('color-bg'),
    colorBgHex:         document.getElementById('color-bg-hex'),
    colorGradStart:     document.getElementById('color-grad-start'),
    colorGradEnd:       document.getElementById('color-grad-end'),
    presetBtns:         document.querySelectorAll('.preset-btn'),
    bgImageControl:     document.getElementById('bg-image-control'),
    bgImageUploadZone:  document.getElementById('bg-image-upload-zone'),
    bgImageInput:       document.getElementById('bg-image-input'),
    bgImagePrompt:      document.getElementById('bg-image-prompt'),
    bgImagePreview:     document.getElementById('bg-image-preview'),
    bgImageThumbnail:   document.getElementById('bg-image-thumbnail'),
    btnRemoveBgImage:   document.getElementById('btn-remove-bg-image'),
    selectBgPattern:    document.getElementById('select-bg-pattern'),
    rangeBgOverlay:     document.getElementById('range-bg-overlay'),
    bgOverlayVal:       document.getElementById('bg-overlay-val'),
    textCaptionTop:     document.getElementById('text-caption-top'),
    selectFontTop:      document.getElementById('select-font-top'),
    colorTextTop:       document.getElementById('color-text-top'),
    inputFontSizeTop:   document.getElementById('input-font-size-top'),
    inputLineHeightTop: document.getElementById('input-line-height-top'),
    inputMarginTop:     document.getElementById('input-margin-top'),
    toggleShadowTop:    document.getElementById('toggle-shadow-top'),
    textCaptionBottom:     document.getElementById('text-caption-bottom'),
    selectFontBottom:      document.getElementById('select-font-bottom'),
    colorTextBottom:       document.getElementById('color-text-bottom'),
    inputFontSizeBottom:   document.getElementById('input-font-size-bottom'),
    inputLineHeightBottom: document.getElementById('input-line-height-bottom'),
    inputMarginBottom:     document.getElementById('input-margin-bottom'),
    toggleShadowBottom:    document.getElementById('toggle-shadow-bottom'),
    btnTranslate:   document.getElementById('btn-translate'),
    btnReset:       document.getElementById('btn-reset'),
    langTabs:       document.querySelectorAll('.lang-tab'),
    zoomValue:      document.getElementById('zoom-value'),
    btnZoomIn:      document.getElementById('btn-zoom-in'),
    btnZoomOut:     document.getElementById('btn-zoom-out'),
    btnZoomReset:   document.getElementById('btn-zoom-reset'),
    canvasGrid:     document.getElementById('canvas-grid'),
    canvasPhone:    document.getElementById('canvas-phone'),
    canvasTablet7:  document.getElementById('canvas-tablet7'),
    canvasTablet10: document.getElementById('canvas-tablet10'),
    canvasFeature:  document.getElementById('canvas-feature'),
    resPhone:       document.getElementById('res-phone'),
    resTablet7:     document.getElementById('res-tablet7'),
    resTablet10:    document.getElementById('res-tablet10'),
    resFeature:     document.getElementById('res-feature'),
    btnExportAll:    document.getElementById('btn-export-all'),
    btnExportSingles: document.querySelectorAll('.btn-export-single'),
    transZHTop:    document.getElementById('trans-zh-top'),
    transZHBottom: document.getElementById('trans-zh-bottom'),
    transENTop:    document.getElementById('trans-en-top'),
    transENBottom: document.getElementById('trans-en-bottom'),
    transJATop:    document.getElementById('trans-ja-top'),
    transJABottom: document.getElementById('trans-ja-bottom'),
    transKOTop:    document.getElementById('trans-ko-top'),
    transKOBottom: document.getElementById('trans-ko-bottom'),
    loaderEN: document.getElementById('loader-en'),
    loaderJA: document.getElementById('loader-ja'),
    loaderKO: document.getElementById('loader-ko'),
    toast:        document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    toastIcon:    document.getElementById('toast-icon'),
    imageSourceRadios:  document.querySelectorAll('input[name="image-source"]'),
    secUploadScreenshots: document.getElementById('sec-upload-screenshots'),
    secAiGenerator:      document.getElementById('sec-ai-generator'),
    aiPrompt:            document.getElementById('ai-prompt'),
    selectAiStyle:       document.getElementById('select-ai-style'),
    aiSeed:              document.getElementById('ai-seed'),
    btnRandSeed:         document.getElementById('btn-rand-seed'),
    toggleCohesiveSeed:  document.getElementById('toggle-cohesive-seed'),
    btnGenerateAi:       document.getElementById('btn-generate-ai'),
    hybridModeHint:      document.getElementById('hybrid-mode-hint'),
    hybridFeatureGroup:  document.getElementById('hybrid-feature-group'),
    hybridFeaturePrompt: document.getElementById('hybrid-feature-prompt'),
    inputOpenaiKey:      document.getElementById('input-openai-key'),
    btnToggleKey:        document.getElementById('btn-toggle-key'),
    appOriPicker:        document.querySelectorAll('[data-app-ori]'),
    oriHint:             document.getElementById('ori-hint'),
    iconFileInput:       document.getElementById('icon-file-input'),
    btnPickIcon:         document.getElementById('btn-pick-icon'),
    iconPreviewArea:     document.getElementById('icon-preview-area'),
    iconPreview:         document.getElementById('icon-preview'),
    iconColorSwatches:   document.getElementById('icon-color-swatches'),
    btnRemoveIcon:       document.getElementById('btn-remove-icon'),
    iconColorsText:      document.getElementById('icon-colors-text')
  };

  init();

  function init() {
    loadState();
    setupEventListeners();
    updateUIState();
    setupDraggableText();
    triggerAllRenders();
    adjustZoom();
    if (el.inputOpenaiKey) el.inputOpenaiKey.value = loadApiKey();
  }

  function loadApiKey() {
    return localStorage.getItem('playshot_openai_key') || '';
  }
  function saveApiKey(key) {
    if (key) localStorage.setItem('playshot_openai_key', key);
    else localStorage.removeItem('playshot_openai_key');
  }
  function getDalleSize(device) {
    if (device === 'feature') return '1792x1024';
    return state.orientation === 'portrait' ? '1024x1792' : '1792x1024';
  }

  function extractDominantColors(imgEl, count) {
    count = count || 5;
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var ctx = c.getContext('2d');
    ctx.drawImage(imgEl, 0, 0, 64, 64);
    var data = ctx.getImageData(0, 0, 64, 64).data;
    var map = {};
    for (var i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 100) continue;
      var r = Math.round(data[i] / 20) * 20;
      var g = Math.round(data[i + 1] / 20) * 20;
      var b = Math.round(data[i + 2] / 20) * 20;
      var key = r + ',' + g + ',' + b;
      map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map)
      .sort(function(a, b) { return b[1] - a[1]; })
      .slice(0, count)
      .map(function(entry) {
        var parts = entry[0].split(',').map(Number);
        return '#' + parts.map(function(v) { return v.toString(16).padStart(2, '0'); }).join('');
      });
  }

  function renderIconSwatches(colors) {
    if (!el.iconColorSwatches) return;
    el.iconColorSwatches.innerHTML = '';
    colors.forEach(function(hex) {
      var swatch = document.createElement('div');
      swatch.style.cssText = 'width:18px;height:18px;border-radius:4px;background:' + hex + ';border:1px solid rgba(255,255,255,0.15);flex-shrink:0;';
      swatch.title = hex;
      el.iconColorSwatches.appendChild(swatch);
    });
    if (el.iconColorsText) {
      el.iconColorsText.textContent = '提取配色：' + colors.join('  ');
      el.iconColorsText.style.display = 'block';
    }
  }

  // ── localStorage ──────────────────────────────────────────────
  let saveTimer = null;
  function saveState() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem('playshot_v2', JSON.stringify({
          orientation: state.orientation, fitMode: state.fitMode,
          showDeviceFrame: state.showDeviceFrame, bgType: state.bgType,
          bgColor: state.bgColor, gradStart: state.gradStart, gradEnd: state.gradEnd,
          captionZH_top: state.captionZH_top, fontFamily_top: state.fontFamily_top,
          fontSize_top: state.fontSize_top, lineHeight_top: state.lineHeight_top,
          textColor_top: state.textColor_top, textMargin_top: state.textMargin_top,
          showTextShadow_top: state.showTextShadow_top, translations_top: state.translations_top,
          captionZH_bottom: state.captionZH_bottom, fontFamily_bottom: state.fontFamily_bottom,
          fontSize_bottom: state.fontSize_bottom, lineHeight_bottom: state.lineHeight_bottom,
          textColor_bottom: state.textColor_bottom, textMargin_bottom: state.textMargin_bottom,
          showTextShadow_bottom: state.showTextShadow_bottom, translations_bottom: state.translations_bottom,
          currentLangPreview: state.currentLangPreview, zoom: state.zoom,
          layoutMode: state.layoutMode, bgPattern: state.bgPattern,
          bgOverlayOpacity: state.bgOverlayOpacity, currentScreenshotIdx: state.currentScreenshotIdx,
          screenshotDataUrls: state.screenshots.map(s => ({ dataUrl: s.dataUrl, fileName: s.fileName })),
          bgImageDataUrl: state.bgImageDataUrl,
          imageSource: state.imageSource,
          aiPrompt: state.aiPrompt,
          aiStyle: state.aiStyle,
          aiSeed: state.aiSeed,
          aiCohesiveSeed: state.aiCohesiveSeed,
          aiDataUrls: state.aiDataUrls,
          iconDataUrl: state.iconDataUrl,
          iconColors: state.iconColors
        }));
      } catch (e) { /* 儲存空間不足時靜默忽略 */ }
    }, 500);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem('playshot_v2');
      if (!raw) return;
      const saved = JSON.parse(raw);
      const keys = [
        'orientation','fitMode','showDeviceFrame','bgType','bgColor','gradStart','gradEnd',
        'captionZH_top','fontFamily_top','fontSize_top','lineHeight_top','textColor_top',
        'textMargin_top','showTextShadow_top','translations_top',
        'captionZH_bottom','fontFamily_bottom','fontSize_bottom','lineHeight_bottom','textColor_bottom',
        'textMargin_bottom','showTextShadow_bottom','translations_bottom',
        'currentLangPreview','zoom','layoutMode','bgPattern','bgOverlayOpacity',
        'imageSource','aiPrompt','aiPromptFeature','aiStyle','aiSeed','aiCohesiveSeed',
        'iconDataUrl','iconColors'
      ];
      keys.forEach(k => { if (saved[k] !== undefined) state[k] = saved[k]; });

      // 非同步還原截圖
      if (saved.screenshotDataUrls?.length) {
        Promise.all(saved.screenshotDataUrls.map(s => new Promise(resolve => {
          if (!s?.dataUrl) return resolve(null);
          const img = new Image();
          img.onload = () => resolve({ image: img, dataUrl: s.dataUrl, fileName: s.fileName || '' });
          img.onerror = () => resolve(null);
          img.src = s.dataUrl;
        }))).then(results => {
          state.screenshots = results.filter(Boolean);
          state.currentScreenshotIdx = Math.min(saved.currentScreenshotIdx || 0, Math.max(0, state.screenshots.length - 1));
          updateScreenshotStrip();
          triggerAllRenders();
        });
      }

      // 非同步還原背景圖
      if (saved.bgImageDataUrl) {
        state.bgImageDataUrl = saved.bgImageDataUrl;
        const img = new Image();
        img.onload = () => {
          state.uploadedBgImage = img;
          el.bgImageThumbnail.src = saved.bgImageDataUrl;
          el.bgImagePreview.style.display = 'block';
          el.bgImagePrompt.style.display = 'none';
          triggerAllRenders();
        };
        img.src = saved.bgImageDataUrl;
      }

      // 非同步還原 AI 圖片
      if (saved.aiDataUrls) {
        state.aiDataUrls = saved.aiDataUrls;
        Object.keys(saved.aiDataUrls).forEach(device => {
          const dataUrl = saved.aiDataUrls[device];
          if (!dataUrl) return;
          const img = new Image();
          img.onload = () => {
            state.aiImages[device] = img;
            triggerAllRenders();
          };
          img.src = dataUrl;
        });
      }
      // 非同步還原 Icon 預覽
      if (saved.iconDataUrl) {
        state.iconDataUrl = saved.iconDataUrl;
        state.iconColors = saved.iconColors || [];
        var iconImg = new Image();
        iconImg.onload = function() {
          if (el.iconPreview) el.iconPreview.src = saved.iconDataUrl;
          if (el.iconPreviewArea) el.iconPreviewArea.style.display = 'flex';
          renderIconSwatches(state.iconColors);
        };
        iconImg.src = saved.iconDataUrl;
      }
    } catch (e) { /* 損毀的儲存資料，忽略 */ }
  }

  // ── Toast ──────────────────────────────────────────────────────
  function showToast(message, type = 'info') {
    el.toastMessage.textContent = message;
    el.toast.className = `toast show ${type}`;
    const icons = { success: 'check-circle', error: 'alert-triangle', info: 'info' };
    el.toastIcon.setAttribute('data-lucide', icons[type] || 'info');
    if (typeof lucide !== 'undefined') lucide.createIcons({ attrs: { class: 'lucide-icon' }, nameAttr: 'data-lucide' });
    clearTimeout(el._toastTimer);
    el._toastTimer = setTimeout(() => el.toast.classList.remove('show'), 3000);
  }

  // ── Screenshot Strip ───────────────────────────────────────────
  function updateScreenshotStrip() {
    const count = state.screenshots.length;
    if (count === 0) {
      el.screenshotStrip.style.display = 'none';
      el.uploadPromptEmpty.style.display = 'flex';
      el.uploadPromptAdd.style.display = 'none';
      return;
    }
    el.uploadPromptEmpty.style.display = 'none';
    el.uploadPromptAdd.style.display = 'flex';
    el.screenshotStrip.style.display = 'block';
    el.screenshotCounter.textContent = `${state.currentScreenshotIdx + 1} / ${count}`;
    el.btnPrevShot.disabled = state.currentScreenshotIdx === 0;
    el.btnNextShot.disabled = state.currentScreenshotIdx === count - 1;

    el.stripThumbnails.innerHTML = '';
    state.screenshots.forEach((s, i) => {
      const wrap = document.createElement('div');
      wrap.className = `strip-thumb${i === state.currentScreenshotIdx ? ' active' : ''}`;
      const img = document.createElement('img');
      img.src = s.dataUrl;
      img.alt = s.fileName;
      const num = document.createElement('span');
      num.className = 'thumb-num';
      num.textContent = i + 1;
      wrap.append(img, num);
      wrap.addEventListener('click', () => {
        state.currentScreenshotIdx = i;
        updateScreenshotStrip();
        triggerAllRenders();
        saveState();
      });
      el.stripThumbnails.appendChild(wrap);
    });
  }

  // ── Event Listeners ────────────────────────────────────────────
  function setupEventListeners() {
    // ── Panel Tab 切換 ────────────────────────────────────────────
    document.querySelectorAll('.panel-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const content = document.getElementById('tab-' + tab.dataset.tab);
        if (content) content.classList.add('active');
      });
    });

    let debounceTop = null, debounceBottom = null;
    let lastTransTop = state.captionZH_top, lastTransBottom = state.captionZH_bottom;

    // 圖片來源切換
    el.imageSourceRadios.forEach(radio => radio.addEventListener('change', e => {
      state.imageSource = e.target.value;
      updateUIState();
      triggerAllRenders();
      saveState();
    }));

    // AI 生成設定監聽
    if (el.aiPrompt) {
      el.aiPrompt.addEventListener('input', e => { state.aiPrompt = e.target.value; saveState(); });
      el.selectAiStyle.addEventListener('change', e => { state.aiStyle = e.target.value; saveState(); });
      el.aiSeed.addEventListener('input', e => { state.aiSeed = parseInt(e.target.value) || 42; saveState(); });
      el.toggleCohesiveSeed.addEventListener('change', e => { state.aiCohesiveSeed = e.target.checked; saveState(); });
      el.btnRandSeed.addEventListener('click', () => {
        const seed = Math.floor(Math.random() * 1000000);
        state.aiSeed = seed;
        el.aiSeed.value = seed;
        saveState();
        showToast(`已產生隨機 Seed: ${seed}`, 'success');
      });
      el.btnGenerateAi.addEventListener('click', generateAIImages);
      if (el.hybridFeaturePrompt) {
        el.hybridFeaturePrompt.addEventListener('input', e => { state.aiPromptFeature = e.target.value; saveState(); });
      }

      if (el.inputOpenaiKey) {
        el.inputOpenaiKey.addEventListener('change', e => saveApiKey(e.target.value.trim()));
        el.btnToggleKey.addEventListener('click', () => {
          const isPass = el.inputOpenaiKey.type === 'password';
          el.inputOpenaiKey.type = isPass ? 'text' : 'password';
          el.btnToggleKey.querySelector('[data-lucide]').setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        });
      }

      // Icon 上傳配色分析
      el.btnPickIcon?.addEventListener('click', () => el.iconFileInput?.click());
      el.btnRemoveIcon?.addEventListener('click', () => {
        state.iconDataUrl = null;
        state.iconColors = [];
        if (el.iconPreview) el.iconPreview.src = '';
        if (el.iconPreviewArea) el.iconPreviewArea.style.display = 'none';
        if (el.iconColorsText) el.iconColorsText.style.display = 'none';
        if (el.iconColorSwatches) el.iconColorSwatches.innerHTML = '';
        saveState();
        showToast('已移除 Icon 配色', 'info');
      });
      el.iconFileInput?.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const img = new Image();
          img.onload = () => {
            const thumb = document.createElement('canvas');
            const maxSize = 128;
            const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
            thumb.width = Math.round(img.width * scale);
            thumb.height = Math.round(img.height * scale);
            thumb.getContext('2d').drawImage(img, 0, 0, thumb.width, thumb.height);
            state.iconDataUrl = thumb.toDataURL('image/png');
            state.iconColors = extractDominantColors(img);
            if (el.iconPreview) el.iconPreview.src = state.iconDataUrl;
            if (el.iconPreviewArea) el.iconPreviewArea.style.display = 'flex';
            renderIconSwatches(state.iconColors);
            saveState();
            showToast('已提取 ' + state.iconColors.length + ' 個主要配色', 'success');
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      });
    }

    // 上傳區點擊 / 拖曳
    el.uploadZone.addEventListener('click', (e) => {
      if (e.target.closest('#screenshot-strip')) return;
      el.fileInput.click();
    });
    el.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) processUploadedFiles(Array.from(e.target.files));
    });
    el.uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); el.uploadZone.classList.add('hover'); });
    el.uploadZone.addEventListener('dragleave', () => el.uploadZone.classList.remove('hover'));
    el.uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      el.uploadZone.classList.remove('hover');
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length) processUploadedFiles(files);
    });

    // 截圖導航
    el.btnPrevShot.addEventListener('click', () => {
      if (state.currentScreenshotIdx > 0) { state.currentScreenshotIdx--; updateScreenshotStrip(); triggerAllRenders(); saveState(); }
    });
    el.btnNextShot.addEventListener('click', () => {
      if (state.currentScreenshotIdx < state.screenshots.length - 1) { state.currentScreenshotIdx++; updateScreenshotStrip(); triggerAllRenders(); saveState(); }
    });
    el.btnAddShot.addEventListener('click', (e) => { e.stopPropagation(); el.fileInput.click(); });
    el.btnRemoveShot.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.screenshots.length) return;
      state.screenshots.splice(state.currentScreenshotIdx, 1);
      state.currentScreenshotIdx = Math.max(0, state.currentScreenshotIdx - 1);
      el.fileInput.value = '';
      updateScreenshotStrip();
      triggerAllRenders();
      saveState();
      showToast('已移除此截圖', 'info');
    });

    // 方向
    el.orientationBtns.forEach(btn => btn.addEventListener('click', () => {
      el.orientationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.orientation = btn.getAttribute('data-orientation');
      el.canvasGrid.classList.toggle('landscape', state.orientation === 'landscape');
      updateResolutionLabels();
      triggerAllRenders(); saveState();
    }));

    // App 方向選擇（Step 0）
    el.appOriPicker.forEach(btn => btn.addEventListener('click', () => {
      el.appOriPicker.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const ori = btn.getAttribute('data-app-ori');
      state.orientation = ori;
      el.orientationBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-orientation') === ori));
      el.canvasGrid.classList.toggle('landscape', ori === 'landscape');
      updateResolutionLabels();
      triggerAllRenders();
      saveState();
      const hints = {
        portrait: '手機和平板截圖用直式，Feature Graphic 固定橫式。',
        landscape: '所有截圖均為橫式（適合遊戲或橫向 App）。'
      };
      if (el.oriHint) { el.oriHint.textContent = hints[ori]; el.oriHint.style.display = 'block'; }
    }));

    el.selectFitMode.addEventListener('change', e => { state.fitMode = e.target.value; triggerAllRenders(); saveState(); });
    el.selectLayoutMode.addEventListener('change', e => { state.layoutMode = e.target.value; triggerAllRenders(); saveState(); });
    el.toggleDeviceFrame.addEventListener('change', e => { state.showDeviceFrame = e.target.checked; triggerAllRenders(); saveState(); });

    // 背景類型
    el.bgTypeRadios.forEach(radio => radio.addEventListener('change', e => {
      state.bgType = e.target.value;
      document.querySelectorAll('.radio-tab').forEach(l => l.classList.toggle('active', l.querySelector('input').checked));
      el.bgSolidControl.style.display    = state.bgType === 'solid'     ? 'block' : 'none';
      el.bgGradientControl.style.display = state.bgType === 'gradient'  ? 'block' : 'none';
      el.bgImageControl.style.display    = state.bgType === 'image'     ? 'block' : 'none';
      triggerAllRenders(); saveState();
    }));

    el.bgImageUploadZone.addEventListener('click', e => { if (e.target.closest('#btn-remove-bg-image')) return; el.bgImageInput.click(); });
    el.bgImageInput.addEventListener('change', e => { if (e.target.files.length) processUploadedBgFile(e.target.files[0]); });
    el.btnRemoveBgImage.addEventListener('click', e => {
      e.stopPropagation();
      state.uploadedBgImage = null; state.bgImageDataUrl = null; state.bgImageFileName = '';
      el.bgImageInput.value = '';
      el.bgImagePreview.style.display = 'none';
      el.bgImagePrompt.style.display = 'flex';
      triggerAllRenders(); saveState();
      showToast('已移除背景圖片', 'info');
    });
    el.selectBgPattern.addEventListener('change', e => { state.bgPattern = e.target.value; triggerAllRenders(); saveState(); });

    el.colorBg.addEventListener('input', e => { state.bgColor = e.target.value; el.colorBgHex.value = e.target.value.toUpperCase(); triggerAllRenders(); saveState(); });
    el.colorBgHex.addEventListener('input', e => {
      let v = e.target.value;
      if (!v.startsWith('#')) v = '#' + v;
      if (/^#[0-9A-F]{6}$/i.test(v)) { state.bgColor = v; el.colorBg.value = v; triggerAllRenders(); saveState(); }
    });
    el.colorGradStart.addEventListener('input', e => { state.gradStart = e.target.value; triggerAllRenders(); saveState(); });
    el.colorGradEnd.addEventListener('input', e => { state.gradEnd = e.target.value; triggerAllRenders(); saveState(); });
    el.presetBtns.forEach(btn => btn.addEventListener('click', () => {
      state.gradStart = btn.getAttribute('data-start');
      state.gradEnd   = btn.getAttribute('data-end');
      el.colorGradStart.value = state.gradStart;
      el.colorGradEnd.value   = state.gradEnd;
      triggerAllRenders(); saveState();
    }));

    // 暗色遮罩滑桿
    if (el.rangeBgOverlay) {
      el.rangeBgOverlay.addEventListener('input', e => {
        state.bgOverlayOpacity = parseInt(e.target.value) / 100;
        if (el.bgOverlayVal) el.bgOverlayVal.textContent = `${e.target.value}%`;
        triggerAllRenders(); saveState();
      });
    }

    // 上方文字（移除舊的 change/blur 重複觸發，只保留 debounced input）
    el.textCaptionTop.addEventListener('input', e => {
      state.captionZH_top = e.target.value;
      state.translations_top.zh = e.target.value;
      el.transZHTop.value = e.target.value;
      if (state.currentLangPreview === 'zh') triggerAllRenders();
      saveState();
      clearTimeout(debounceTop);
      debounceTop = setTimeout(() => {
        const v = state.captionZH_top.trim();
        if (v !== lastTransTop) { lastTransTop = v; translateField('top', v); }
      }, 1500);
    });
    el.selectFontTop.addEventListener('change', e => { state.fontFamily_top = e.target.value; triggerAllRenders(); saveState(); });
    el.inputFontSizeTop.addEventListener('input', e => { state.fontSize_top = parseInt(e.target.value) || 50; triggerAllRenders(); saveState(); });
    el.inputLineHeightTop.addEventListener('input', e => { state.lineHeight_top = parseFloat(e.target.value) || 1.2; triggerAllRenders(); saveState(); });
    el.colorTextTop.addEventListener('input', e => { state.textColor_top = e.target.value; triggerAllRenders(); saveState(); });
    el.inputMarginTop.addEventListener('input', e => { state.textMargin_top = parseInt(e.target.value) || 50; triggerAllRenders(); saveState(); });
    el.toggleShadowTop.addEventListener('change', e => { state.showTextShadow_top = e.target.checked; triggerAllRenders(); saveState(); });

    // 下方文字
    el.textCaptionBottom.addEventListener('input', e => {
      state.captionZH_bottom = e.target.value;
      state.translations_bottom.zh = e.target.value;
      el.transZHBottom.value = e.target.value;
      if (state.currentLangPreview === 'zh') triggerAllRenders();
      saveState();
      clearTimeout(debounceBottom);
      debounceBottom = setTimeout(() => {
        const v = state.captionZH_bottom.trim();
        if (v !== lastTransBottom) { lastTransBottom = v; translateField('bottom', v); }
      }, 1500);
    });
    el.selectFontBottom.addEventListener('change', e => { state.fontFamily_bottom = e.target.value; triggerAllRenders(); saveState(); });
    el.inputFontSizeBottom.addEventListener('input', e => { state.fontSize_bottom = parseInt(e.target.value) || 30; triggerAllRenders(); saveState(); });
    el.inputLineHeightBottom.addEventListener('input', e => { state.lineHeight_bottom = parseFloat(e.target.value) || 1.2; triggerAllRenders(); saveState(); });
    el.colorTextBottom.addEventListener('input', e => { state.textColor_bottom = e.target.value; triggerAllRenders(); saveState(); });
    el.inputMarginBottom.addEventListener('input', e => { state.textMargin_bottom = parseInt(e.target.value) || 50; triggerAllRenders(); saveState(); });
    el.toggleShadowBottom.addEventListener('change', e => { state.showTextShadow_bottom = e.target.checked; triggerAllRenders(); saveState(); });

    el.btnTranslate.addEventListener('click', translateAllLanguages);

    // 翻譯面板手動編輯
    el.transENTop.addEventListener('input', e => { state.translations_top.en = e.target.value; if (state.currentLangPreview === 'en') triggerAllRenders(); saveState(); });
    el.transJATop.addEventListener('input', e => { state.translations_top.ja = e.target.value; if (state.currentLangPreview === 'ja') triggerAllRenders(); saveState(); });
    el.transKOTop.addEventListener('input', e => { state.translations_top.ko = e.target.value; if (state.currentLangPreview === 'ko') triggerAllRenders(); saveState(); });
    el.transENBottom.addEventListener('input', e => { state.translations_bottom.en = e.target.value; if (state.currentLangPreview === 'en') triggerAllRenders(); saveState(); });
    el.transJABottom.addEventListener('input', e => { state.translations_bottom.ja = e.target.value; if (state.currentLangPreview === 'ja') triggerAllRenders(); saveState(); });
    el.transKOBottom.addEventListener('input', e => { state.translations_bottom.ko = e.target.value; if (state.currentLangPreview === 'ko') triggerAllRenders(); saveState(); });

    el.langTabs.forEach(tab => tab.addEventListener('click', () => {
      el.langTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentLangPreview = tab.getAttribute('data-lang');
      triggerAllRenders(); saveState();
    }));

    el.btnZoomIn.addEventListener('click', () => { state.zoom = Math.min(state.zoom + 0.05, 0.8); adjustZoom(); saveState(); });
    el.btnZoomOut.addEventListener('click', () => { state.zoom = Math.max(state.zoom - 0.05, 0.1); adjustZoom(); saveState(); });
    el.btnZoomReset.addEventListener('click', () => {
      const h = el.canvasGrid.clientHeight;
      const ch = state.orientation === 'portrait' ? 2560 : 1600;
      state.zoom = parseFloat(Math.min(Math.max((h - 120) / ch, 0.1), 0.6).toFixed(2));
      adjustZoom(); saveState();
    });

    el.btnExportSingles.forEach(btn => btn.addEventListener('click', () => exportSingleImage(btn.getAttribute('data-device'))));
    el.btnExportAll.addEventListener('click', exportAllZipped);

    if (el.btnReset) {
      el.btnReset.addEventListener('click', () => {
        if (!confirm('確定要清空所有內容嗎？截圖、文字、背景都會清除，API Key 會保留。')) return;
        localStorage.removeItem('playshot_v2');
        location.reload();
      });
    }
  }

  // ── 截圖上傳 ────────────────────────────────────────────────────
  function processUploadedFiles(files) {
    const imgs = files.filter(f => f.type.startsWith('image/'));
    if (!imgs.length) { showToast('請選擇圖片格式的檔案', 'error'); return; }
    let loaded = 0;
    const startIdx = state.screenshots.length;
    imgs.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
          state.screenshots.push({ image: img, dataUrl: ev.target.result, fileName: file.name });
          loaded++;
          if (loaded === imgs.length) {
            state.currentScreenshotIdx = startIdx;
            updateScreenshotStrip();
            triggerAllRenders();
            saveState();
            showToast(`已新增 ${loaded} 張截圖`, 'success');
          }
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
    el.fileInput.value = '';
  }

  function processUploadedBgFile(file) {
    if (!file.type.startsWith('image/')) { showToast('背景檔案必須是圖片格式！', 'error'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        state.uploadedBgImage = img;
        state.bgImageDataUrl = ev.target.result;
        state.bgImageFileName = file.name;
        el.bgImageThumbnail.src = ev.target.result;
        el.bgImagePreview.style.display = 'block';
        el.bgImagePrompt.style.display = 'none';
        triggerAllRenders(); saveState();
        showToast('背景圖片上傳成功！', 'success');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function drawBgImageCover(ctx, img, w, h) {
    const r = img.width / img.height, dr = w / h;
    let dw = w, dh = h, dx = 0, dy = 0;
    if (r > dr) { dw = h * r; dx = (w - dw) / 2; }
    else { dh = w / r; dy = (h - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // ── 翻譯 ────────────────────────────────────────────────────────
  async function translateAllLanguages() {
    const top = state.captionZH_top.trim(), bot = state.captionZH_bottom.trim();
    if (!top && !bot) { showToast('請先輸入上方或下方中文文字', 'error'); return; }
    el.btnTranslate.disabled = true;
    el.btnTranslate.innerHTML = '<i class="spinner"></i> 正在翻譯中...';
    const jobs = [
      { lang: 'en', loader: el.loaderEN, elTop: el.transENTop, elBot: el.transENBottom },
      { lang: 'ja', loader: el.loaderJA, elTop: el.transJATop, elBot: el.transJABottom },
      { lang: 'ko', loader: el.loaderKO, elTop: el.transKOTop, elBot: el.transKOBottom },
    ];
    await Promise.all(jobs.map(async j => {
      j.loader.style.display = 'inline-flex';
      try {
        if (top) { const t = await fetchTranslation(top, j.lang); state.translations_top[j.lang] = t; j.elTop.value = t; }
        if (bot) { const t = await fetchTranslation(bot, j.lang); state.translations_bottom[j.lang] = t; j.elBot.value = t; }
      } catch { showToast(`翻譯到 ${j.lang} 失敗，保留原文`, 'error'); }
      finally { j.loader.style.display = 'none'; }
    }));
    el.btnTranslate.disabled = false;
    el.btnTranslate.innerHTML = '<i data-lucide="languages"></i> 一鍵自動翻譯上下文字';
    if (typeof lucide !== 'undefined') lucide.createIcons();
    triggerAllRenders(); saveState();
    showToast('翻譯完成！已更新語系對照表', 'success');
  }

  async function fetchTranslation(text, lang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-TW&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (data?.[0]) return data[0].map(i => i[0]).join('');
    return text;
  }

  async function translateField(field, text) {
    const langs = ['en', 'ja', 'ko'];
    if (!text) {
      langs.forEach(lang => {
        if (field === 'top') { state.translations_top[lang] = ''; (lang === 'en' ? el.transENTop : lang === 'ja' ? el.transJATop : el.transKOTop).value = ''; }
        else { state.translations_bottom[lang] = ''; (lang === 'en' ? el.transENBottom : lang === 'ja' ? el.transJABottom : el.transKOBottom).value = ''; }
      });
      triggerAllRenders(); return;
    }
    await Promise.all(langs.map(async lang => {
      const loader = lang === 'en' ? el.loaderEN : lang === 'ja' ? el.loaderJA : el.loaderKO;
      const targetEl = field === 'top'
        ? (lang === 'en' ? el.transENTop : lang === 'ja' ? el.transJATop : el.transKOTop)
        : (lang === 'en' ? el.transENBottom : lang === 'ja' ? el.transJABottom : el.transKOBottom);
      loader.style.display = 'inline-flex';
      try {
        const t = await fetchTranslation(text, lang);
        if (field === 'top') state.translations_top[lang] = t;
        else state.translations_bottom[lang] = t;
        targetEl.value = t;
      } catch { /* 行內翻譯失敗靜默忽略 */ }
      finally { loader.style.display = 'none'; }
    }));
    triggerAllRenders(); saveState();
  }

  // ── 文字換行 ─────────────────────────────────────────────────────
  function wrapText(ctx, text, maxWidth) {
    const lines = [], regex = /([a-zA-Z0-9_''-]+|\s+|[^\s\w])/g;
    const tokens = []; let m;
    while ((m = regex.exec(text)) !== null) tokens.push(m[0]);
    let cur = '';
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (tok === '\n') { lines.push(cur); cur = ''; continue; }
      const test = cur + tok;
      if (ctx.measureText(test).width > maxWidth && i > 0) { lines.push(cur); cur = tok.trim() ? tok : ''; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // ── 全語言模式 helper ──────────────────────────────────────────
  const ALL_LANGS = ['zh','en','ja','ko'];
  const LANG_FLAGS = { zh:'🇹🇼', en:'🇺🇸', ja:'🇯🇵', ko:'🇰🇷' };

  function calcAllLangTextHeight(ctx, field, maxW, fontSize, lineHeight, fontFamily) {
    const sz = Math.round(fontSize * 0.68);
    const gap = Math.round(sz * 0.4);
    let total = 0;
    ALL_LANGS.forEach(code => {
      const text = (field === 'top' ? state.translations_top[code] : state.translations_bottom[code]) || '';
      if (!text.trim()) return;
      ctx.font = `bold ${sz}px '${resolveFont(code, fontFamily)}', sans-serif`;
      total += wrapText(ctx, LANG_FLAGS[code] + ' ' + text, maxW).length * sz * lineHeight + gap;
    });
    return total;
  }

  function renderAllLangText(ctx, field, x, align, maxW, startY, fontSize, lineHeight, fontFamily, textColor, showShadow) {
    const sz = Math.round(fontSize * 0.68);
    const gap = Math.round(sz * 0.4);
    let curY = startY;
    ALL_LANGS.forEach(code => {
      const text = (field === 'top' ? state.translations_top[code] : state.translations_bottom[code]) || '';
      if (!text.trim()) return;
      ctx.save();
      ctx.font = `bold ${sz}px '${resolveFont(code, fontFamily)}', sans-serif`;
      ctx.fillStyle = textColor; ctx.textAlign = align; ctx.textBaseline = 'top';
      if (showShadow) { ctx.shadowColor='rgba(0,0,0,0.6)'; ctx.shadowBlur=12; ctx.shadowOffsetY=3; }
      const lines = wrapText(ctx, LANG_FLAGS[code] + ' ' + text, maxW);
      lines.forEach((l, i) => ctx.fillText(l, x, curY + i * sz * lineHeight));
      curY += lines.length * sz * lineHeight + gap;
      ctx.restore();
    });
    return curY - startY;
  }

  // ── 渲染 ─────────────────────────────────────────────────────────
  function triggerAllRenders() {
    renderDeviceCanvas('phone',    el.canvasPhone);
    renderDeviceCanvas('tablet7',  el.canvasTablet7);
    renderDeviceCanvas('tablet10', el.canvasTablet10);
    renderDeviceCanvas('feature',  el.canvasFeature);
  }

  // 中日韓語系強制使用 Noto Sans 對應字型（其他語系尊重使用者設定）
  function resolveFont(lang, userFont) {
    if (lang === 'zh') return 'Noto Sans TC';
    if (lang === 'ja') return 'Noto Sans JP';
    if (lang === 'ko') return 'Noto Sans KR';
    return userFont;
  }

  function renderDeviceCanvas(deviceKey, canvas, overrideLang = null) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dim = DEVICE_SPECS[deviceKey][state.orientation];
    const W = dim.width, H = dim.height;
    canvas.width = W; canvas.height = H;

    const lang = overrideLang || state.currentLangPreview;
    const topText    = state.translations_top[lang]    || state.translations_top.zh    || '';
    const bottomText = state.translations_bottom[lang] || state.translations_bottom.zh || '';
    
    let uploadedImage = null;
    if (state.imageSource === 'ai') {
      uploadedImage = state.aiImages[deviceKey];
    } else if (state.imageSource === 'hybrid') {
      if (deviceKey === 'phone') {
        uploadedImage = getCurrentImage();
      } else if (deviceKey === 'tablet10') {
        // 10 吋與 7 吋長寬比相同，共用同一張 AI 圖
        uploadedImage = state.aiImages['tablet10'] || state.aiImages['tablet7'];
      } else {
        uploadedImage = state.aiImages[deviceKey];
      }
    } else {
      uploadedImage = getCurrentImage();
    }

    // ── 背景 ──
    if (state.bgType === 'solid') {
      ctx.fillStyle = state.bgColor; ctx.fillRect(0, 0, W, H);
    } else if (state.bgType === 'gradient') {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, state.gradStart); g.addColorStop(1, state.gradEnd);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    } else {
      if (state.uploadedBgImage) {
        drawBgImageCover(ctx, state.uploadedBgImage, W, H);
        if (state.bgOverlayOpacity > 0) { ctx.fillStyle = `rgba(0,0,0,${state.bgOverlayOpacity})`; ctx.fillRect(0, 0, W, H); }
      } else {
        ctx.fillStyle = '#1e1b4b'; ctx.fillRect(0, 0, W, H);
      }
    }

    // ── 背景裝飾 ──
    const maxDim = Math.max(W, H);
    if (state.bgPattern === 'mesh') {
      ctx.save();
      [[0,0,'rgba(236,72,153,0.45)','rgba(236,72,153,0.18)',0.7],[W,H,'rgba(99,102,241,0.48)','rgba(99,102,241,0.18)',0.6],[W*0.35,H,'rgba(16,185,129,0.38)','rgba(16,185,129,0.15)',0.5]].forEach(([cx,cy,c0,c1,r]) => {
        const g = ctx.createRadialGradient(cx,cy,0,cx,cy,maxDim*r);
        g.addColorStop(0,c0); g.addColorStop(0.5,c1); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      });
      ctx.restore();
    } else if (state.bgPattern === 'grid') {
      ctx.save(); ctx.strokeStyle='rgba(255,255,255,0.13)'; ctx.lineWidth=Math.max(W*0.002,3);
      const gs=Math.max(W*0.05,80);
      for(let x=0;x<W;x+=gs){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=gs){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      ctx.restore();
    } else if (state.bgPattern === 'aurora') {
      ctx.save();
      [{x1:0,y1:H*0.05,x2:W*0.7,y2:H*0.45,R:16,G:185,B:129,a:0.38},{x1:W*0.25,y1:0,x2:W,y2:H*0.5,R:99,G:102,B:241,a:0.32},{x1:0,y1:H*0.5,x2:W*0.8,y2:H*0.9,R:6,G:182,B:212,a:0.30},{x1:W*0.4,y1:H*0.3,x2:W,y2:H,R:236,G:72,B:153,a:0.22}]
      .forEach(({x1,y1,x2,y2,R,G,B,a}) => {
        const gr=ctx.createLinearGradient(x1,y1,x2,y2);
        gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(0.35,`rgba(${R},${G},${B},${a})`);
        gr.addColorStop(0.55,`rgba(${R},${G},${B},${(a*0.35).toFixed(2)})`); gr.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=gr; ctx.fillRect(0,0,W,H);
      });
      ctx.restore();
    } else if (state.bgPattern === 'bokeh') {
      ctx.save();
      [{x:.15,y:.18,r:.13,R:99,G:102,B:241,a:.40},{x:.83,y:.12,r:.10,R:236,G:72,B:153,a:.35},{x:.40,y:.75,r:.15,R:16,G:185,B:129,a:.32},{x:.72,y:.55,r:.09,R:6,G:182,B:212,a:.38},{x:.18,y:.85,r:.11,R:245,G:158,B:11,a:.30},{x:.88,y:.40,r:.12,R:139,G:92,B:246,a:.35}]
      .forEach(c => {
        const gr=ctx.createRadialGradient(c.x*W,c.y*H,0,c.x*W,c.y*H,c.r*maxDim);
        gr.addColorStop(0,`rgba(${c.R},${c.G},${c.B},${c.a})`);
        gr.addColorStop(0.5,`rgba(${c.R},${c.G},${c.B},${(c.a*0.25).toFixed(2)})`);
        gr.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=gr; ctx.fillRect(0,0,W,H);
      });
      ctx.restore();
    } else if (state.bgPattern === 'diamond') {
      ctx.save(); ctx.strokeStyle='rgba(255,255,255,0.13)'; ctx.lineWidth=Math.max(W*0.0012,2);
      const gs=Math.max(W*0.07,100);
      for(let i=-(H+W);i<W+H;i+=gs){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+H,H);ctx.stroke();}
      for(let i=-H;i<W+H*2;i+=gs){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i-H,H);ctx.stroke();}
      ctx.restore();
    } else if (state.bgPattern === 'dots') {
      ctx.save(); ctx.fillStyle='rgba(255,255,255,0.20)';
      const ds=Math.max(W*0.03,60), dr=Math.max(W*0.0018,3);
      for(let x=ds/2;x<W;x+=ds) for(let y=ds/2;y<H;y+=ds){ctx.beginPath();ctx.arc(x,y,dr,0,Math.PI*2);ctx.fill();}
      ctx.restore();
    } else if (state.bgPattern === 'network') {
      ctx.save(); ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.strokeStyle='rgba(255,255,255,0.09)'; ctx.lineWidth=Math.max(W*0.001,2);
      const pts=[{x:.08,y:.22},{x:.18,y:.14},{x:.12,y:.42},{x:.28,y:.28},{x:.22,y:.58},{x:.38,y:.72},{x:.58,y:.12},{x:.68,y:.32},{x:.62,y:.52},{x:.78,y:.18},{x:.88,y:.38},{x:.82,y:.68},{x:.72,y:.82},{x:.92,y:.78}];
      const mp=pts.map(p=>({x:p.x*W,y:p.y*H})); const md=W*0.22;
      for(let i=0;i<mp.length;i++) for(let j=i+1;j<mp.length;j++) if(Math.hypot(mp[i].x-mp[j].x,mp[i].y-mp[j].y)<md){ctx.beginPath();ctx.moveTo(mp[i].x,mp[i].y);ctx.lineTo(mp[j].x,mp[j].y);ctx.stroke();}
      mp.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,Math.max(W*0.002,4.5),0,Math.PI*2);ctx.fill();});
      ctx.restore();
    }

    // ── 主視覺橫幅滿版圖片 ──
    if (deviceKey === 'feature') {
      if (uploadedImage) {
        drawScreenshotInside(ctx, uploadedImage, 0, 0, W, H);
      }
      return;
    }

    // ── 文字排版起點 ──
    let textX = W/2, textAlign = 'center', textMaxW = W - 200;
    if (state.layoutMode === 'left')  { textX = 80;            textAlign = 'left'; textMaxW = W*0.4-120; }
    if (state.layoutMode === 'right') { textX = W*0.6+40;      textAlign = 'left'; textMaxW = W*0.4-120; }

    // ── 上方文字 ──
    let topH = 0, topY = state.textMargin_top;
    if (lang === 'all') {
      const hasTop = Object.values(state.translations_top).some(t => t && t.trim());
      if (hasTop) topH = renderAllLangText(ctx, 'top', textX, textAlign, textMaxW, topY, state.fontSize_top, state.lineHeight_top, state.fontFamily_top, state.textColor_top, state.showTextShadow_top);
    } else if (topText) {
      ctx.save();
      ctx.font = `bold ${state.fontSize_top}px '${resolveFont(lang, state.fontFamily_top)}', sans-serif`;
      ctx.fillStyle = state.textColor_top; ctx.textAlign = textAlign; ctx.textBaseline = 'top';
      const lines = wrapText(ctx, topText, textMaxW);
      topH = lines.length * state.fontSize_top * state.lineHeight_top;
      if (state.showTextShadow_top) { ctx.shadowColor='rgba(0,0,0,0.6)'; ctx.shadowBlur=15; ctx.shadowOffsetY=4; }
      lines.forEach((l,i) => ctx.fillText(l, textX, topY + i*state.fontSize_top*state.lineHeight_top));
      ctx.restore();
    }

    // ── 下方文字 ──
    let botH = 0, botY = H - state.textMargin_bottom;
    if (lang === 'all') {
      const hasBottom = Object.values(state.translations_bottom).some(t => t && t.trim());
      if (hasBottom) {
        botH = calcAllLangTextHeight(ctx, 'bottom', textMaxW, state.fontSize_bottom, state.lineHeight_bottom, state.fontFamily_bottom);
        botY = H - botH - state.textMargin_bottom;
        renderAllLangText(ctx, 'bottom', textX, textAlign, textMaxW, botY, state.fontSize_bottom, state.lineHeight_bottom, state.fontFamily_bottom, state.textColor_bottom, state.showTextShadow_bottom);
      }
    } else if (bottomText) {
      ctx.save();
      ctx.font = `bold ${state.fontSize_bottom}px '${resolveFont(lang, state.fontFamily_bottom)}', sans-serif`;
      ctx.fillStyle = state.textColor_bottom; ctx.textAlign = textAlign; ctx.textBaseline = 'top';
      const lines = wrapText(ctx, bottomText, textMaxW);
      botH = lines.length * state.fontSize_bottom * state.lineHeight_bottom;
      botY = H - botH - state.textMargin_bottom;
      if (state.showTextShadow_bottom) { ctx.shadowColor='rgba(0,0,0,0.6)'; ctx.shadowBlur=15; ctx.shadowOffsetY=4; }
      lines.forEach((l,i) => ctx.fillText(l, textX, botY + i*state.fontSize_bottom*state.lineHeight_bottom));
      ctx.restore();
    }

    if (!overrideLang && lang !== 'all') {
      textRanges[deviceKey] = {
        top:    topText    ? { y1: topY, y2: topY+topH } : { y1:0, y2:0 },
        bottom: bottomText ? { y1: botY, y2: botY+botH } : { y1:0, y2:0 }
      };
    }

    // ── 裝置外框邊界 ──
    const vert = state.orientation === 'portrait';
    let tMargin, bMargin, areaW, areaH;
    if (state.layoutMode === 'vertical') {
      tMargin = topH > 0 ? topY+topH+60 : 80;
      bMargin = botH > 0 ? botY-60      : H-80;
      areaH = bMargin-tMargin; areaW = W-160;
    } else {
      tMargin=80; bMargin=H-80; areaH=bMargin-tMargin; areaW=W*0.6-120;
    }

    const screenRatios = {
      phone:    vert ? 1080/2280 : 2280/1080,
      tablet7:  vert ? 1200/1920 : 1920/1200,
      tablet10: vert ? 1600/2560 : 2560/1600,
    };
    const sr = screenRatios[deviceKey];
    let dW, dH;
    if (state.showDeviceFrame) {
      const bf=0.035; let w=areaW, bt=Math.max(w*bf,12), sw=w-2*bt, sh=sw/sr, h=sh+2*bt;
      if (h>areaH) { h=areaH; w=(h*sr)/(1+2*bf*sr-2*bf); bt=w*bf; if(bt<12){bt=12;w=(h-24)*sr+24;} }
      dW=w; dH=h;
    } else {
      dW=areaW; dH=dW/sr;
      if (dH>areaH) { dH=areaH; dW=dH*sr; }
    }

    let dX, dY;
    if (state.layoutMode==='left')  { dX=W*0.4+40+(areaW-dW)/2; dY=tMargin+(areaH-dH)/2; }
    else if (state.layoutMode==='right') { dX=80+(areaW-dW)/2; dY=tMargin+(areaH-dH)/2; }
    else { dX=(W-dW)/2; dY=tMargin+(areaH-dH)/2; }

    // Glow 裝飾在外框後面
    if (state.bgPattern === 'glow') {
      ctx.save();
      ctx.shadowColor='rgba(99,102,241,0.6)'; ctx.shadowBlur=Math.max(W*0.04,80);
      ctx.fillStyle='rgba(99,102,241,0.15)';
      drawRoundedRectPath(ctx, dX, dY, dW, dH, state.showDeviceFrame ? Math.max(dW*0.08,30) : 16);
      ctx.fill(); ctx.restore();
    }

    if (state.showDeviceFrame) drawDeviceFrame(ctx, deviceKey, dX, dY, dW, dH, vert, uploadedImage);
    else drawScreenshotDirect(ctx, dX, dY, dW, dH, uploadedImage);
  }

  function drawDeviceFrame(ctx, deviceKey, x, y, w, h, isVert, uploadedImage) {
    const bt=Math.max(w*0.035,12), or=Math.max(w*0.08,30), ir=Math.max(or-bt,12);
    ctx.save();
    ctx.shadowColor='rgba(0,0,0,0.4)'; ctx.shadowBlur=40; ctx.shadowOffsetY=15;
    ctx.fillStyle='#1e2029'; ctx.strokeStyle='#2d303f'; ctx.lineWidth=bt*0.1;
    drawRoundedRectPath(ctx,x,y,w,h,or); ctx.fill(); ctx.stroke();
    ctx.shadowColor='transparent'; ctx.shadowBlur=0; ctx.shadowOffsetY=0;

    const sx=x+bt, sy=y+bt, sw=w-bt*2, sh=h-bt*2;
    ctx.save(); drawRoundedRectPath(ctx,sx,sy,sw,sh,ir); ctx.clip();
    if (uploadedImage) drawScreenshotInside(ctx,uploadedImage,sx,sy,sw,sh);
    else {
      ctx.fillStyle='#0f111a'; ctx.fillRect(sx,sy,sw,sh);
      ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fillRect(sx,sy,sw,sh);
      ctx.font=`${Math.max(w*0.05,18)}px sans-serif`; ctx.fillStyle='#4f5263';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('App 截圖預覽', sx+sw/2, sy+sh/2);
    }
    const gg=ctx.createLinearGradient(sx,sy,sx+sw,sy+sh);
    gg.addColorStop(0,'rgba(255,255,255,0.08)'); gg.addColorStop(0.4,'rgba(255,255,255,0.02)');
    gg.addColorStop(0.41,'rgba(255,255,255,0)'); gg.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=gg; ctx.fillRect(sx,sy,sw,sh);
    ctx.restore();

    ctx.fillStyle='#000';
    if (deviceKey==='phone') {
      if (isVert) {
        const iw=w*0.28,ih=Math.max(h*0.022,24);
        drawRoundedRectPath(ctx,x+(w-iw)/2,y+bt+bt*0.2,iw,ih,ih/2); ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.4)';
        const bw=w*0.35;
        drawRoundedRectPath(ctx,x+(w-bw)/2,y+h-bt-12,bw,5,2.5); ctx.fill();
      } else {
        const iw=h*0.28,ih=Math.max(w*0.022,24);
        drawRoundedRectPath(ctx,x+bt+bt*0.2,y+(h-iw)/2,ih,iw,ih/2); ctx.fill();
      }
    } else {
      ctx.fillStyle='rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.arc(isVert?x+w/2:x+bt/2, isVert?y+bt/2:y+h/2, 4, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawScreenshotDirect(ctx, x, y, w, h, uploadedImage) {
    ctx.save();
    ctx.shadowColor='rgba(0,0,0,0.4)'; ctx.shadowBlur=30; ctx.shadowOffsetY=10;
    drawRoundedRectPath(ctx,x,y,w,h,16); ctx.clip();
    ctx.shadowColor='transparent'; ctx.shadowBlur=0; ctx.shadowOffsetY=0;
    if (uploadedImage) drawScreenshotInside(ctx,uploadedImage,x,y,w,h);
    else { ctx.fillStyle='#0f111a'; ctx.fillRect(x,y,w,h); ctx.font='24px sans-serif'; ctx.fillStyle='#4f5263'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('App 截圖預覽',x+w/2,y+h/2); }
    ctx.restore();
  }

  function drawScreenshotInside(ctx, img, sx, sy, sw, sh) {
    if (state.fitMode==='stretch') { ctx.drawImage(img,sx,sy,sw,sh); return; }
    const ir=img.width/img.height, dr=sw/sh;
    let dw=sw,dh=sh,dx=sx,dy=sy;
    if (state.fitMode==='contain') {
      ctx.fillStyle='#000'; ctx.fillRect(sx,sy,sw,sh);
      if(ir>dr){dh=sw/ir;dy=sy+(sh-dh)/2;}else{dw=sh*ir;dx=sx+(sw-dw)/2;}
    } else {
      if(ir>dr){dw=sh*ir;dx=sx+(sw-dw)/2;}else{dh=sw/ir;dy=sy+(sh-dh)/2;}
    }
    ctx.drawImage(img,dx,dy,dw,dh);
  }

  function drawRoundedRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
  }

  // ── 拖曳文字 ──────────────────────────────────────────────────────
  function setupDraggableText() {
    let drag = null;
    ['phone','tablet7','tablet10','feature'].forEach(key => {
      const canvas = document.getElementById(`canvas-${key}`);
      if (!canvas) return;

      const hitTest = (cx, cy) => {
        let inX = false;
        if (state.layoutMode==='vertical') inX = cx>=80 && cx<=canvas.width-80;
        else if (state.layoutMode==='left') inX = cx>=80 && cx<=canvas.width*0.4;
        else if (state.layoutMode==='right') inX = cx>=canvas.width*0.6 && cx<=canvas.width-80;
        if (!inX) return null;
        const r = textRanges[key];
        if (r?.top.y2>0 && cy>=r.top.y1-40 && cy<=r.top.y2+40) return 'top';
        if (r?.bottom.y2>0 && cy>=r.bottom.y1-40 && cy<=r.bottom.y2+40) return 'bottom';
        return null;
      };

      const toCanvas = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        return { cx:(clientX-rect.left)*canvas.width/rect.width, cy:(clientY-rect.top)*canvas.height/rect.height, sy:canvas.height/rect.height };
      };

      canvas.addEventListener('mousedown', e => {
        const {cx,cy,sy} = toCanvas(e.clientX,e.clientY);
        const field = hitTest(cx,cy);
        if (field) { drag = {key,field,startY:e.clientY,startMargin:field==='top'?state.textMargin_top:state.textMargin_bottom,sy}; canvas.style.cursor='ns-resize'; }
      });
      canvas.addEventListener('mousemove', e => {
        if (drag) return;
        const {cx,cy} = toCanvas(e.clientX,e.clientY);
        canvas.style.cursor = hitTest(cx,cy) ? 'ns-resize' : 'default';
      });
      canvas.addEventListener('touchstart', e => {
        if (e.touches.length!==1) return;
        const {cx,cy,sy} = toCanvas(e.touches[0].clientX,e.touches[0].clientY);
        const field = hitTest(cx,cy);
        if (field) { drag={key,field,startY:e.touches[0].clientY,startMargin:field==='top'?state.textMargin_top:state.textMargin_bottom,sy}; e.preventDefault(); }
      },{passive:false});
    });

    const applyDrag = (clientY) => {
      if (!drag) return;
      const delta = (clientY - drag.startY) * drag.sy;
      if (drag.field==='top')    { const v=Math.max(0,Math.round(drag.startMargin+delta)); state.textMargin_top=v; el.inputMarginTop.value=v; }
      else                       { const v=Math.max(0,Math.round(drag.startMargin-delta)); state.textMargin_bottom=v; el.inputMarginBottom.value=v; }
      triggerAllRenders();
    };
    const endDrag = () => { if (!drag) return; document.getElementById(`canvas-${drag.key}`)?.style && (document.getElementById(`canvas-${drag.key}`).style.cursor='default'); drag=null; saveState(); };

    window.addEventListener('mousemove', e => applyDrag(e.clientY));
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', e => { if(drag&&e.touches.length===1){applyDrag(e.touches[0].clientY);e.preventDefault();} },{passive:false});
    window.addEventListener('touchend', endDrag);
  }

  // ── UI 狀態同步 ──────────────────────────────────────────────────
  function updateUIState() {
    el.textCaptionTop.value = state.captionZH_top;
    el.selectFontTop.value  = state.fontFamily_top;
    el.colorTextTop.value   = state.textColor_top;
    el.inputFontSizeTop.value   = state.fontSize_top;
    el.inputLineHeightTop.value = state.lineHeight_top;
    el.inputMarginTop.value     = state.textMargin_top;
    el.toggleShadowTop.checked  = state.showTextShadow_top;

    el.textCaptionBottom.value = state.captionZH_bottom;
    el.selectFontBottom.value  = state.fontFamily_bottom;
    el.colorTextBottom.value   = state.textColor_bottom;
    el.inputFontSizeBottom.value   = state.fontSize_bottom;
    el.inputLineHeightBottom.value = state.lineHeight_bottom;
    el.inputMarginBottom.value     = state.textMargin_bottom;
    el.toggleShadowBottom.checked  = state.showTextShadow_bottom;

    el.colorBg.value         = state.bgColor;
    el.colorBgHex.value      = state.bgColor.toUpperCase();
    el.colorGradStart.value  = state.gradStart;
    el.colorGradEnd.value    = state.gradEnd;
    el.selectLayoutMode.value = state.layoutMode;
    el.selectBgPattern.value  = state.bgPattern;
    el.selectFitMode.value    = state.fitMode;
    el.toggleDeviceFrame.checked = state.showDeviceFrame;

    el.transZHTop.value    = state.captionZH_top;
    el.transZHBottom.value = state.captionZH_bottom;
    el.transENTop.value    = state.translations_top.en;
    el.transENBottom.value = state.translations_bottom.en;
    el.transJATop.value    = state.translations_top.ja;
    el.transJABottom.value = state.translations_bottom.ja;
    el.transKOTop.value    = state.translations_top.ko;
    el.transKOBottom.value = state.translations_bottom.ko;

    el.bgSolidControl.style.display    = state.bgType==='solid'    ? 'block' : 'none';
    el.bgGradientControl.style.display = state.bgType==='gradient' ? 'block' : 'none';
    el.bgImageControl.style.display    = state.bgType==='image'    ? 'block' : 'none';
    document.querySelectorAll('.radio-tab').forEach(l => l.classList.toggle('active', l.querySelector('input').value===state.bgType));
    const bgRadio = document.querySelector(`input[name="bg-type"][value="${state.bgType}"]`);
    if (bgRadio) bgRadio.checked = true;

    el.orientationBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-orientation')===state.orientation));
    el.canvasGrid.classList.toggle('landscape', state.orientation==='landscape');
    el.appOriPicker.forEach(b => b.classList.toggle('active', b.getAttribute('data-app-ori')===state.orientation));
    if (el.oriHint && state.orientation) {
      const hints = { portrait: '手機和平板截圖用直式，Feature Graphic 固定橫式。', landscape: '所有截圖均為橫式（適合遊戲或橫向 App）。' };
      el.oriHint.textContent = hints[state.orientation];
      el.oriHint.style.display = 'block';
    }
    el.langTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-lang')===state.currentLangPreview));

    if (el.rangeBgOverlay) {
      const pct = Math.round(state.bgOverlayOpacity*100);
      el.rangeBgOverlay.value = pct;
      if (el.bgOverlayVal) el.bgOverlayVal.textContent = `${pct}%`;
    }

    // AI 智慧生成 UI 同步
    if (el.aiPrompt) el.aiPrompt.value = state.aiPrompt;
    if (el.selectAiStyle) el.selectAiStyle.value = state.aiStyle;
    if (el.aiSeed) el.aiSeed.value = state.aiSeed;
    if (el.toggleCohesiveSeed) el.toggleCohesiveSeed.checked = state.aiCohesiveSeed;

    const activeSourceRadio = document.querySelector(`input[name="image-source"][value="${state.imageSource}"]`);
    if (activeSourceRadio) activeSourceRadio.checked = true;
    document.querySelectorAll('[name="image-source"]').forEach(radio => {
      const label = radio.closest('.radio-tab');
      if (label) label.classList.toggle('active', radio.checked);
    });

    const isHybrid = state.imageSource === 'hybrid';
    const isAi     = state.imageSource === 'ai';

    if (el.secUploadScreenshots) el.secUploadScreenshots.style.display = isAi ? 'none' : 'block';
    if (el.secAiGenerator)       el.secAiGenerator.style.display       = (isAi || isHybrid) ? 'block' : 'none';
    if (el.hybridModeHint)       el.hybridModeHint.style.display        = isHybrid ? 'block' : 'none';
    if (el.hybridFeatureGroup)   el.hybridFeatureGroup.style.display    = isHybrid ? 'block' : 'none';

    if (el.btnGenerateAi) {
      el.btnGenerateAi.innerHTML = isHybrid
        ? '<i data-lucide="sparkles"></i> 生成 Feature Graphic + 平板示意圖（2 張）'
        : '<i data-lucide="sparkles"></i> 一鍵生成所有規格圖片';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    if (el.hybridFeaturePrompt) el.hybridFeaturePrompt.value = state.aiPromptFeature;

    updateResolutionLabels();
    updateScreenshotStrip();
  }

  function updateResolutionLabels() {
    const p = state.orientation;
    el.resPhone.textContent   = `${DEVICE_SPECS.phone[p].width} x ${DEVICE_SPECS.phone[p].height}`;
    el.resTablet7.textContent = `${DEVICE_SPECS.tablet7[p].width} x ${DEVICE_SPECS.tablet7[p].height}`;
    el.resTablet10.textContent= `${DEVICE_SPECS.tablet10[p].width} x ${DEVICE_SPECS.tablet10[p].height}`;
    if (el.resFeature) {
      el.resFeature.textContent = `${DEVICE_SPECS.feature[p].width} x ${DEVICE_SPECS.feature[p].height}`;
    }
  }

  function adjustZoom() {
    el.zoomValue.textContent = `${Math.round(state.zoom*100)}%`;
    document.documentElement.style.setProperty('--zoom-factor', state.zoom);
  }

  // ── 匯出 ─────────────────────────────────────────────────────────
  function exportSingleImage(deviceKey) {
    const canvas = document.getElementById(`canvas-${deviceKey}`);
    if (!canvas) return;
    const shot = state.screenshots.length > 1 ? `_截圖${state.currentScreenshotIdx+1}` : '';
    const langSuffix = state.currentLangPreview.toUpperCase();
    const oriText = state.orientation === 'portrait' ? '直式' : '橫式';
    
    let name;
    if (deviceKey === 'feature') {
      name = `PlayShot_FeatureGraphic_${langSuffix}.png`;
    } else {
      name = `PlayShot_${deviceKey}_${langSuffix}_${oriText}${shot}.png`;
    }
    
    const a = document.createElement('a');
    a.download = name; a.href = canvas.toDataURL('image/png'); a.click();
    showToast(`導出成功: ${name}`, 'success');
  }

  async function exportAllZipped() {
    const btn = el.btnExportAll;
    btn.disabled = true;
    const tempCanvas = document.createElement('canvas');
    const zip = new JSZip();
    const devices = ['phone','tablet7','tablet10','feature'];
    const langs = ['zh','en','ja','ko','all'];
    const ori = state.orientation==='portrait' ? '直式' : '橫式';
    const shotCount = state.imageSource === 'ai' ? 1 : Math.max(state.screenshots.length, 1);
    const total = devices.length * langs.length * shotCount;
    let done = 0;

    try {
      const savedIdx = state.currentScreenshotIdx;
      for (let si=0; si<shotCount; si++) {
        state.currentScreenshotIdx = si;
        for (const lang of langs) {
          const folderName = shotCount>1 ? `${lang.toUpperCase()}/截圖_${si+1}` : lang.toUpperCase();
          const folder = zip.folder(folderName);
          for (const device of devices) {
            renderDeviceCanvas(device, tempCanvas, lang);
            const blob = await new Promise(r => tempCanvas.toBlob(r, 'image/png'));
            
            let fileName;
            if (device === 'feature') {
              fileName = `${lang.toUpperCase()}_FeatureGraphic.png`;
            } else {
              fileName = `${lang.toUpperCase()}_${device}_${ori}.png`;
            }
            
            folder.file(fileName, blob);
            done++;
            btn.innerHTML = `<i class="spinner"></i> 渲染中 ${done} / ${total}`;
          }
        }
      }
      state.currentScreenshotIdx = savedIdx;
      btn.innerHTML = '<i class="spinner"></i> 封裝壓縮中...';
      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.download = `playshot_${ori}.zip`;
      a.href = URL.createObjectURL(content);
      a.click();
      showToast('ZIP 打包下載成功！', 'success');
    } catch (err) {
      console.error(err);
      showToast('打包導出失敗，請再試一次。', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="download-cloud"></i> 一鍵導出所有規格 & 語言 (ZIP)';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      triggerAllRenders();
    }
  }

  function showCanvasLoading(deviceKey, show) {
    const wrapper = document.querySelector(`.preview-card[data-device="${deviceKey}"] .canvas-wrapper`);
    if (!wrapper) return;
    let overlay = wrapper.querySelector('.canvas-loading-overlay');
    if (!overlay && show) {
      overlay = document.createElement('div');
      overlay.className = 'canvas-loading-overlay';
      overlay.innerHTML = `
        <div class="canvas-loading-spinner"></div>
        <div class="canvas-loading-text">AI 正在繪製中...</div>
      `;
      wrapper.appendChild(overlay);
      overlay.offsetHeight; // force reflow
    }
    if (overlay) {
      overlay.classList.toggle('active', show);
    }
  }



  async function generateAIImages() {
    const apiKey = loadApiKey();
    if (!apiKey) {
      showToast('請先輸入 OpenAI API Key', 'error');
      el.inputOpenaiKey?.focus();
      return;
    }

    state.aiPrompt = el.aiPrompt.value.trim();
    if (!state.aiPrompt) {
      showToast('請先輸入 AI 圖片 Prompt 描述', 'error');
      return;
    }

    el.btnGenerateAi.disabled = true;
    el.btnGenerateAi.innerHTML = '<i class="spinner"></i> AI 正在生成中...';

    let finalPrompt = state.aiPrompt;
    const hasChinese = /[一-龥]/.test(state.aiPrompt);
    if (hasChinese) {
      try {
        el.btnGenerateAi.innerHTML = '<i class="spinner"></i> 正在翻譯 Prompt...';
        finalPrompt = await fetchTranslation(state.aiPrompt, 'en');
      } catch (err) {
        console.error('Prompt translation failed', err);
      }
    }

    if (el.selectAiStyle.value !== 'none') {
      finalPrompt += ', ' + el.selectAiStyle.value;
    }

    // 加入 Icon 配色到 prompt
    if (state.iconColors && state.iconColors.length > 0) {
      finalPrompt += ', harmonious color palette inspired by app icon: ' + state.iconColors.join(', ');
    }

    const devices = state.imageSource === 'hybrid'
      ? ['tablet7', 'feature']
      : ['phone', 'tablet7', 'tablet10', 'feature'];
    let successCount = 0;
    const failed = [];

    const getDevicePrompt = (device) => {
      if (device === 'feature') {
        const override = state.aiPromptFeature.trim();
        return override || (finalPrompt + ', wide panoramic landscape banner, horizontal composition');
      }
      return finalPrompt;
    };

    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];
      el.btnGenerateAi.innerHTML = `<i class="spinner"></i> 生成中 ${i + 1} / ${devices.length}（${device}）...`;
      showCanvasLoading(device, true);

      const devicePrompt = getDevicePrompt(device);
      const size = getDalleSize(device);

      let loaded = false;
      for (let attempt = 0; attempt < 2 && !loaded; attempt++) {
        if (attempt > 0) {
          el.btnGenerateAi.innerHTML = `<i class="spinner"></i> 重試 ${device}（${attempt}/1）...`;
          await new Promise(r => setTimeout(r, 2000));
        }
        try {
          const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt: devicePrompt,
              n: 1,
              size: size,
              quality: 'standard',
              response_format: 'b64_json'
            })
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.error?.message || `HTTP ${res.status}`;
            if (res.status === 401) {
              showToast('API Key 錯誤，請確認後重試', 'error');
              throw new Error('auth');
            }
            throw new Error(msg);
          }

          const data = await res.json();
          const dataUrl = `data:image/png;base64,${data.data[0].b64_json}`;
          state.aiDataUrls[device] = dataUrl;

          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = dataUrl;
          });
          state.aiImages[device] = img;
          loaded = true;
          successCount++;
        } catch (err) {
          console.warn(`Device ${device} attempt ${attempt + 1} failed:`, err);
          if (err.message === 'auth') break;
        }
      }

      showCanvasLoading(device, false);
      if (!loaded) failed.push(device);
      triggerAllRenders();
    }

    if (state.imageSource === 'hybrid' && state.aiImages['tablet7']) {
      state.aiImages['tablet10']   = state.aiImages['tablet7'];
      state.aiDataUrls['tablet10'] = state.aiDataUrls['tablet7'];
      triggerAllRenders();
    }

    saveState();

    if (failed.length === 0) {
      showToast('🎉 生成成功！', 'success');
    } else if (successCount > 0) {
      showToast(`⚠️ ${successCount} 張成功，${failed.join('、')} 失敗，可重新點擊生成`, 'success');
    } else {
      showToast('生成失敗，請確認 API Key 是否正確', 'error');
    }

    el.btnGenerateAi.disabled = false;
    el.btnGenerateAi.innerHTML = '<i data-lucide="sparkles"></i> 一鍵生成所有規格圖片';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
});
