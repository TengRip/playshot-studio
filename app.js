// PlayShot Studio - Core Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Application State
  const state = {
    uploadedImage: null,
    imageFileName: '',
    orientation: 'portrait', // 'portrait' or 'landscape'
    fitMode: 'cover',        // 'contain' or 'cover'
    showDeviceFrame: true,
    bgType: 'gradient',      // 'solid' or 'gradient'
    bgColor: '#3b82f6',
    gradStart: '#1e1b4b',
    gradEnd: '#311042',
    
    // Top Caption
    captionZH_top: '簡約明瞭的財務圖表',
    fontFamily_top: 'Outfit',
    fontSize_top: 70,
    lineHeight_top: 1.3,
    textColor_top: '#ffffff',
    textMargin_top: 80,
    showTextShadow_top: true,
    translations_top: {
      zh: '簡約明瞭的財務圖表',
      en: 'Simple and Clear Financial Charts',
      ja: 'シンプルで明快な財務グラフ',
      ko: '심플하고 명확한 재무 차트'
    },
    
    // Bottom Caption
    captionZH_bottom: '',
    fontFamily_bottom: 'Outfit',
    fontSize_bottom: 45,
    lineHeight_bottom: 1.3,
    textColor_bottom: '#a5b4fc',
    textMargin_bottom: 80,
    showTextShadow_bottom: true,
    translations_bottom: {
      zh: '',
      en: '',
      ja: '',
      ko: ''
    },
    
    currentLangPreview: 'zh',
    zoom: 0.3,
    layoutMode: 'vertical',
    bgPattern: 'none',
    uploadedBgImage: null,
    bgImageFileName: ''
  };

  const textRanges = {
    phone: { top: { y1: 0, y2: 0 }, bottom: { y1: 0, y2: 0 } },
    tablet7: { top: { y1: 0, y2: 0 }, bottom: { y1: 0, y2: 0 } },
    tablet10: { top: { y1: 0, y2: 0 }, bottom: { y1: 0, y2: 0 } }
  };

  // Device Specifications
  const DEVICE_SPECS = {
    phone: {
      name: 'Phone',
      portrait: { width: 1080, height: 2280 },
      landscape: { width: 2280, height: 1080 }
    },
    tablet7: {
      name: '7" Tablet',
      portrait: { width: 1200, height: 1920 },
      landscape: { width: 1920, height: 1200 }
    },
    tablet10: {
      name: '10" Tablet',
      portrait: { width: 1600, height: 2560 },
      landscape: { width: 2560, height: 1600 }
    }
  };

  // 3. DOM Elements Cache
  const el = {
    fileInput: document.getElementById('file-input'),
    uploadZone: document.getElementById('upload-zone'),
    uploadPreview: document.getElementById('upload-preview'),
    imgThumbnail: document.getElementById('img-thumbnail'),
    btnRemoveImg: document.getElementById('btn-remove-img'),
    
    orientationBtns: document.querySelectorAll('[data-orientation]'),
    selectFitMode: document.getElementById('select-fit-mode'),
    selectLayoutMode: document.getElementById('select-layout-mode'),
    toggleDeviceFrame: document.getElementById('toggle-device-frame'),
    
    bgTypeRadios: document.querySelectorAll('input[name="bg-type"]'),
    bgSolidControl: document.getElementById('bg-solid-control'),
    bgGradientControl: document.getElementById('bg-gradient-control'),
    colorBg: document.getElementById('color-bg'),
    colorBgHex: document.getElementById('color-bg-hex'),
    colorGradStart: document.getElementById('color-grad-start'),
    colorGradEnd: document.getElementById('color-grad-end'),
    presetBtns: document.querySelectorAll('.preset-btn'),
    bgImageControl: document.getElementById('bg-image-control'),
    bgImageUploadZone: document.getElementById('bg-image-upload-zone'),
    bgImageInput: document.getElementById('bg-image-input'),
    bgImagePrompt: document.getElementById('bg-image-prompt'),
    bgImagePreview: document.getElementById('bg-image-preview'),
    bgImageThumbnail: document.getElementById('bg-image-thumbnail'),
    btnRemoveBgImage: document.getElementById('btn-remove-bg-image'),
    selectBgPattern: document.getElementById('select-bg-pattern'),
    
    // Top text elements
    textCaptionTop: document.getElementById('text-caption-top'),
    selectFontTop: document.getElementById('select-font-top'),
    colorTextTop: document.getElementById('color-text-top'),
    inputFontSizeTop: document.getElementById('input-font-size-top'),
    inputLineHeightTop: document.getElementById('input-line-height-top'),
    inputMarginTop: document.getElementById('input-margin-top'),
    toggleShadowTop: document.getElementById('toggle-shadow-top'),

    // Bottom text elements
    textCaptionBottom: document.getElementById('text-caption-bottom'),
    selectFontBottom: document.getElementById('select-font-bottom'),
    colorTextBottom: document.getElementById('color-text-bottom'),
    inputFontSizeBottom: document.getElementById('input-font-size-bottom'),
    inputLineHeightBottom: document.getElementById('input-line-height-bottom'),
    inputMarginBottom: document.getElementById('input-margin-bottom'),
    toggleShadowBottom: document.getElementById('toggle-shadow-bottom'),

    btnTranslate: document.getElementById('btn-translate'),
    
    langTabs: document.querySelectorAll('.lang-tab'),
    zoomValue: document.getElementById('zoom-value'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomReset: document.getElementById('btn-zoom-reset'),
    canvasGrid: document.getElementById('canvas-grid'),
    
    canvasPhone: document.getElementById('canvas-phone'),
    canvasTablet7: document.getElementById('canvas-tablet7'),
    canvasTablet10: document.getElementById('canvas-tablet10'),
    
    resPhone: document.getElementById('res-phone'),
    resTablet7: document.getElementById('res-tablet7'),
    resTablet10: document.getElementById('res-tablet10'),
    
    btnExportAll: document.getElementById('btn-export-all'),
    btnExportSingles: document.querySelectorAll('.btn-export-single'),
    
    // Translations UI
    transZHTop: document.getElementById('trans-zh-top'),
    transZHBottom: document.getElementById('trans-zh-bottom'),
    transENTop: document.getElementById('trans-en-top'),
    transENBottom: document.getElementById('trans-en-bottom'),
    transJATop: document.getElementById('trans-ja-top'),
    transJABottom: document.getElementById('trans-ja-bottom'),
    transKOTop: document.getElementById('trans-ko-top'),
    transKOBottom: document.getElementById('trans-ko-bottom'),
    
    loaderEN: document.getElementById('loader-en'),
    loaderJA: document.getElementById('loader-ja'),
    loaderKO: document.getElementById('loader-ko'),
    
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    toastIcon: document.getElementById('toast-icon')
  };

  // 4. Initialization
  init();

  function init() {
    setupEventListeners();
    updateUIState();
    setupDraggableText();
    triggerAllRenders();
    adjustZoom();
  }

  // 5. Toast Notification System
  function showToast(message, type = 'info') {
    el.toastMessage.textContent = message;
    el.toast.className = `toast show ${type}`;
    
    // Update Toast Icon
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';
    el.toastIcon.setAttribute('data-lucide', iconName);
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        attrs: { class: 'lucide-icon' },
        nameAttr: 'data-lucide'
      });
    }

    setTimeout(() => {
      el.toast.classList.remove('show');
    }, 3000);
  }

  // 6. Set Up Event Listeners
  function setupEventListeners() {
    let debounceTimerTop = null;
    let debounceTimerBottom = null;
    let lastTranslatedTop = state.captionZH_top;
    let lastTranslatedBottom = state.captionZH_bottom;

    // Screenshot Upload
    el.uploadZone.addEventListener('click', (e) => {
      // Avoid triggering when clicking the delete button
      if (e.target.closest('#btn-remove-img')) return;
      el.fileInput.click();
    });

    el.fileInput.addEventListener('change', handleFileSelect);

    // Drag and Drop
    el.uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.uploadZone.classList.add('hover');
    });

    el.uploadZone.addEventListener('dragleave', () => {
      el.uploadZone.classList.remove('hover');
    });

    el.uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      el.uploadZone.classList.remove('hover');
      if (e.dataTransfer.files.length > 0) {
        processUploadedFile(e.dataTransfer.files[0]);
      }
    });

    el.btnRemoveImg.addEventListener('click', (e) => {
      e.stopPropagation();
      state.uploadedImage = null;
      state.imageFileName = '';
      el.fileInput.value = '';
      el.uploadPreview.style.display = 'none';
      el.uploadZone.querySelector('.upload-prompt').style.display = 'flex';
      triggerAllRenders();
      showToast('已移除上傳的截圖', 'info');
    });

    // Orientation
    el.orientationBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.orientationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.orientation = btn.getAttribute('data-orientation');
        el.canvasGrid.classList.toggle('landscape', state.orientation === 'landscape');
        updateResolutionLabels();
        triggerAllRenders();
      });
    });

    // Fit Mode & Device Frame
    el.selectFitMode.addEventListener('change', (e) => {
      state.fitMode = e.target.value;
      triggerAllRenders();
    });

    el.selectLayoutMode.addEventListener('change', (e) => {
      state.layoutMode = e.target.value;
      triggerAllRenders();
    });

    el.toggleDeviceFrame.addEventListener('change', (e) => {
      state.showDeviceFrame = e.target.checked;
      triggerAllRenders();
    });

    // Background Controls
    el.bgTypeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.bgType = e.target.value;
        document.querySelectorAll('.radio-tab').forEach(label => {
          label.classList.toggle('active', label.querySelector('input').checked);
        });
        if (state.bgType === 'solid') {
          el.bgSolidControl.style.display = 'block';
          el.bgGradientControl.style.display = 'none';
          el.bgImageControl.style.display = 'none';
        } else if (state.bgType === 'gradient') {
          el.bgSolidControl.style.display = 'none';
          el.bgGradientControl.style.display = 'block';
          el.bgImageControl.style.display = 'none';
        } else {
          el.bgSolidControl.style.display = 'none';
          el.bgGradientControl.style.display = 'none';
          el.bgImageControl.style.display = 'block';
        }
        triggerAllRenders();
      });
    });

    el.bgImageUploadZone.addEventListener('click', (e) => {
      if (e.target.closest('#btn-remove-bg-image')) return;
      el.bgImageInput.click();
    });

    el.bgImageInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        processUploadedBgFile(e.target.files[0]);
      }
    });

    el.btnRemoveBgImage.addEventListener('click', (e) => {
      e.stopPropagation();
      state.uploadedBgImage = null;
      state.bgImageFileName = '';
      el.bgImageInput.value = '';
      el.bgImagePreview.style.display = 'none';
      el.bgImagePrompt.style.display = 'flex';
      triggerAllRenders();
      showToast('已移除背景圖片', 'info');
    });

    el.selectBgPattern.addEventListener('change', (e) => {
      state.bgPattern = e.target.value;
      triggerAllRenders();
    });

    el.colorBg.addEventListener('input', (e) => {
      state.bgColor = e.target.value;
      el.colorBgHex.value = e.target.value.toUpperCase();
      triggerAllRenders();
    });

    el.colorBgHex.addEventListener('input', (e) => {
      let val = e.target.value;
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#[0-9A-F]{6}$/i.test(val)) {
        state.bgColor = val;
        el.colorBg.value = val;
        triggerAllRenders();
      }
    });

    el.colorGradStart.addEventListener('input', (e) => {
      state.gradStart = e.target.value;
      triggerAllRenders();
    });

    el.colorGradEnd.addEventListener('input', (e) => {
      state.gradEnd = e.target.value;
      triggerAllRenders();
    });

    el.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.gradStart = btn.getAttribute('data-start');
        state.gradEnd = btn.getAttribute('data-end');
        el.colorGradStart.value = state.gradStart;
        el.colorGradEnd.value = state.gradEnd;
        triggerAllRenders();
      });
    });

    // Caption & Text Styles (Top)
    el.textCaptionTop.addEventListener('input', (e) => {
      state.captionZH_top = e.target.value;
      state.translations_top.zh = e.target.value;
      el.transZHTop.value = e.target.value;
      if (state.currentLangPreview === 'zh') {
        triggerAllRenders();
      }

      // Debounce automatic translation
      clearTimeout(debounceTimerTop);
      debounceTimerTop = setTimeout(() => {
        const val = state.captionZH_top.trim();
        if (val !== lastTranslatedTop) {
          lastTranslatedTop = val;
          translateField('top', state.captionZH_top);
        }
      }, 1000);
    });

    el.textCaptionTop.addEventListener('change', () => {
      clearTimeout(debounceTimerTop);
      const val = state.captionZH_top.trim();
      if (val !== lastTranslatedTop) {
        lastTranslatedTop = val;
        translateField('top', state.captionZH_top);
      }
    });

    el.textCaptionTop.addEventListener('blur', () => {
      clearTimeout(debounceTimerTop);
      const val = state.captionZH_top.trim();
      if (val !== lastTranslatedTop) {
        lastTranslatedTop = val;
        translateField('top', state.captionZH_top);
      }
    });

    el.selectFontTop.addEventListener('change', (e) => {
      state.fontFamily_top = e.target.value;
      triggerAllRenders();
    });

    el.inputFontSizeTop.addEventListener('input', (e) => {
      state.fontSize_top = parseInt(e.target.value) || 50;
      triggerAllRenders();
    });

    el.inputLineHeightTop.addEventListener('input', (e) => {
      state.lineHeight_top = parseFloat(e.target.value) || 1.2;
      triggerAllRenders();
    });

    el.colorTextTop.addEventListener('input', (e) => {
      state.textColor_top = e.target.value;
      triggerAllRenders();
    });

    el.inputMarginTop.addEventListener('input', (e) => {
      state.textMargin_top = parseInt(e.target.value) || 50;
      triggerAllRenders();
    });

    el.toggleShadowTop.addEventListener('change', (e) => {
      state.showTextShadow_top = e.target.checked;
      triggerAllRenders();
    });

    // Caption & Text Styles (Bottom)
    el.textCaptionBottom.addEventListener('input', (e) => {
      state.captionZH_bottom = e.target.value;
      state.translations_bottom.zh = e.target.value;
      el.transZHBottom.value = e.target.value;
      if (state.currentLangPreview === 'zh') {
        triggerAllRenders();
      }

      // Debounce automatic translation
      clearTimeout(debounceTimerBottom);
      debounceTimerBottom = setTimeout(() => {
        const val = state.captionZH_bottom.trim();
        if (val !== lastTranslatedBottom) {
          lastTranslatedBottom = val;
          translateField('bottom', state.captionZH_bottom);
        }
      }, 1000);
    });

    el.textCaptionBottom.addEventListener('change', () => {
      clearTimeout(debounceTimerBottom);
      const val = state.captionZH_bottom.trim();
      if (val !== lastTranslatedBottom) {
        lastTranslatedBottom = val;
        translateField('bottom', state.captionZH_bottom);
      }
    });

    el.textCaptionBottom.addEventListener('blur', () => {
      clearTimeout(debounceTimerBottom);
      const val = state.captionZH_bottom.trim();
      if (val !== lastTranslatedBottom) {
        lastTranslatedBottom = val;
        translateField('bottom', state.captionZH_bottom);
      }
    });

    el.selectFontBottom.addEventListener('change', (e) => {
      state.fontFamily_bottom = e.target.value;
      triggerAllRenders();
    });

    el.inputFontSizeBottom.addEventListener('input', (e) => {
      state.fontSize_bottom = parseInt(e.target.value) || 30;
      triggerAllRenders();
    });

    el.inputLineHeightBottom.addEventListener('input', (e) => {
      state.lineHeight_bottom = parseFloat(e.target.value) || 1.2;
      triggerAllRenders();
    });

    el.colorTextBottom.addEventListener('input', (e) => {
      state.textColor_bottom = e.target.value;
      triggerAllRenders();
    });

    el.inputMarginBottom.addEventListener('input', (e) => {
      state.textMargin_bottom = parseInt(e.target.value) || 50;
      triggerAllRenders();
    });

    el.toggleShadowBottom.addEventListener('change', (e) => {
      state.showTextShadow_bottom = e.target.checked;
      triggerAllRenders();
    });

    el.btnTranslate.addEventListener('click', translateAllLanguages);

    // Translation Manual Edits (Top)
    el.transENTop.addEventListener('input', (e) => {
      state.translations_top.en = e.target.value;
      if (state.currentLangPreview === 'en') triggerAllRenders();
    });
    el.transJATop.addEventListener('input', (e) => {
      state.translations_top.ja = e.target.value;
      if (state.currentLangPreview === 'ja') triggerAllRenders();
    });
    el.transKOTop.addEventListener('input', (e) => {
      state.translations_top.ko = e.target.value;
      if (state.currentLangPreview === 'ko') triggerAllRenders();
    });

    // Translation Manual Edits (Bottom)
    el.transENBottom.addEventListener('input', (e) => {
      state.translations_bottom.en = e.target.value;
      if (state.currentLangPreview === 'en') triggerAllRenders();
    });
    el.transJABottom.addEventListener('input', (e) => {
      state.translations_bottom.ja = e.target.value;
      if (state.currentLangPreview === 'ja') triggerAllRenders();
    });
    el.transKOBottom.addEventListener('input', (e) => {
      state.translations_bottom.ko = e.target.value;
      if (state.currentLangPreview === 'ko') triggerAllRenders();
    });

    // Preview Language Selection
    el.langTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        el.langTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.currentLangPreview = tab.getAttribute('data-lang');
        triggerAllRenders();
      });
    });

    // Zoom Controls
    el.btnZoomIn.addEventListener('click', () => {
      state.zoom = Math.min(state.zoom + 0.05, 0.8);
      adjustZoom();
    });

    el.btnZoomOut.addEventListener('click', () => {
      state.zoom = Math.max(state.zoom - 0.05, 0.1);
      adjustZoom();
    });

    el.btnZoomReset.addEventListener('click', () => {
      // Auto scale fitting the window height
      const gridHeight = el.canvasGrid.clientHeight;
      const canvasHeight = state.orientation === 'portrait' ? 2560 : 1600; // max device height
      const targetZoom = Math.min(Math.max((gridHeight - 120) / canvasHeight, 0.1), 0.6);
      state.zoom = parseFloat(targetZoom.toFixed(2));
      adjustZoom();
    });

    // Export Buttons
    el.btnExportSingles.forEach(btn => {
      btn.addEventListener('click', () => {
        const device = btn.getAttribute('data-device');
        exportSingleImage(device);
      });
    });

    el.btnExportAll.addEventListener('click', exportAllZipped);
  }

  // Set up interactive text dragging on Canvas previews
  function setupDraggableText() {
    let activeDrag = null; // { deviceKey, field, startY, startMargin, scaleY }

    const devices = ['phone', 'tablet7', 'tablet10'];
    devices.forEach(deviceKey => {
      const canvas = document.getElementById(`canvas-${deviceKey}`);
      if (!canvas) return;

      const handleStart = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Map client coordinates to Canvas internal resolution coordinate space
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (clientX - rect.left) * scaleX;
        const canvasY = (clientY - rect.top) * scaleY;

        // Check horizontal bounds based on layoutMode
        let isXInTextArea = false;
        if (state.layoutMode === 'vertical') {
          isXInTextArea = canvasX >= 80 && canvasX <= canvas.width - 80;
        } else if (state.layoutMode === 'left') {
          isXInTextArea = canvasX >= 80 && canvasX <= canvas.width * 0.4;
        } else if (state.layoutMode === 'right') {
          isXInTextArea = canvasX >= canvas.width * 0.6 && canvasX <= canvas.width - 80;
        }
        if (!isXInTextArea) return;

        const ranges = textRanges[deviceKey];
        if (!ranges) return;

        // Check top text range (add 40px padding for easier grabbing)
        if (ranges.top.y2 > 0 && canvasY >= ranges.top.y1 - 40 && canvasY <= ranges.top.y2 + 40) {
          activeDrag = {
            deviceKey,
            field: 'top',
            startY: clientY,
            startMargin: state.textMargin_top,
            scaleY: scaleY
          };
          canvas.style.cursor = 'ns-resize';
          return;
        }

        // Check bottom text range
        if (ranges.bottom.y2 > 0 && canvasY >= ranges.bottom.y1 - 40 && canvasY <= ranges.bottom.y2 + 40) {
          activeDrag = {
            deviceKey,
            field: 'bottom',
            startY: clientY,
            startMargin: state.textMargin_bottom,
            scaleY: scaleY
          };
          canvas.style.cursor = 'ns-resize';
          return;
        }
      };

      // Mouse events
      canvas.addEventListener('mousedown', (e) => {
        handleStart(e.clientX, e.clientY);
      });

      // Mouse hover feedback
      canvas.addEventListener('mousemove', (e) => {
        if (activeDrag) return;
        
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;
        
        let isXInTextArea = false;
        if (state.layoutMode === 'vertical') {
          isXInTextArea = canvasX >= 80 && canvasX <= canvas.width - 80;
        } else if (state.layoutMode === 'left') {
          isXInTextArea = canvasX >= 80 && canvasX <= canvas.width * 0.4;
        } else if (state.layoutMode === 'right') {
          isXInTextArea = canvasX >= canvas.width * 0.6 && canvasX <= canvas.width - 80;
        }

        const ranges = textRanges[deviceKey];
        if (!ranges) return;

        const isOverTop = isXInTextArea && ranges.top.y2 > 0 && canvasY >= ranges.top.y1 - 40 && canvasY <= ranges.top.y2 + 40;
        const isOverBottom = isXInTextArea && ranges.bottom.y2 > 0 && canvasY >= ranges.bottom.y1 - 40 && canvasY <= ranges.bottom.y2 + 40;

        if (isOverTop || isOverBottom) {
          canvas.style.cursor = 'ns-resize';
        } else {
          canvas.style.cursor = 'default';
        }
      });

      // Touch events for mobile/tablet previews
      canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          handleStart(e.touches[0].clientX, e.touches[0].clientY);
          if (activeDrag) e.preventDefault();
        }
      }, { passive: false });
    });

    // Global listeners for dragging and releasing
    window.addEventListener('mousemove', (e) => {
      if (!activeDrag) return;

      const deltaY = (e.clientY - activeDrag.startY) * activeDrag.scaleY;
      if (activeDrag.field === 'top') {
        const newMargin = Math.max(0, Math.round(activeDrag.startMargin + deltaY));
        state.textMargin_top = newMargin;
        el.inputMarginTop.value = newMargin;
      } else {
        const newMargin = Math.max(0, Math.round(activeDrag.startMargin - deltaY));
        state.textMargin_bottom = newMargin;
        el.inputMarginBottom.value = newMargin;
      }
      triggerAllRenders();
    });

    window.addEventListener('mouseup', () => {
      if (!activeDrag) return;
      const canvas = document.getElementById(`canvas-${activeDrag.deviceKey}`);
      if (canvas) canvas.style.cursor = 'default';
      activeDrag = null;
    });

    // Touch support for dragging
    window.addEventListener('touchmove', (e) => {
      if (!activeDrag) return;
      if (e.touches.length === 1) {
        const deltaY = (e.touches[0].clientY - activeDrag.startY) * activeDrag.scaleY;
        if (activeDrag.field === 'top') {
          const newMargin = Math.max(0, Math.round(activeDrag.startMargin + deltaY));
          state.textMargin_top = newMargin;
          el.inputMarginTop.value = newMargin;
        } else {
          const newMargin = Math.max(0, Math.round(activeDrag.startMargin - deltaY));
          state.textMargin_bottom = newMargin;
          el.inputMarginBottom.value = newMargin;
        }
        triggerAllRenders();
        e.preventDefault();
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      if (!activeDrag) return;
      activeDrag = null;
    });
  }

  // Update UI Inputs to reflect state
  function updateUIState() {
    // Top
    el.textCaptionTop.value = state.captionZH_top;
    el.selectFontTop.value = state.fontFamily_top;
    el.colorTextTop.value = state.textColor_top;
    el.inputFontSizeTop.value = state.fontSize_top;
    el.inputLineHeightTop.value = state.lineHeight_top;
    el.inputMarginTop.value = state.textMargin_top;
    el.toggleShadowTop.checked = state.showTextShadow_top;

    // Bottom
    el.textCaptionBottom.value = state.captionZH_bottom;
    el.selectFontBottom.value = state.fontFamily_bottom;
    el.colorTextBottom.value = state.textColor_bottom;
    el.inputFontSizeBottom.value = state.fontSize_bottom;
    el.inputLineHeightBottom.value = state.lineHeight_bottom;
    el.inputMarginBottom.value = state.textMargin_bottom;
    el.toggleShadowBottom.checked = state.showTextShadow_bottom;

    // Background
    el.colorBg.value = state.bgColor;
    el.colorBgHex.value = state.bgColor.toUpperCase();
    el.colorGradStart.value = state.gradStart;
    el.colorGradEnd.value = state.gradEnd;

    // Translation panel
    el.transZHTop.value = state.captionZH_top;
    el.transZHBottom.value = state.captionZH_bottom;
    
    el.transENTop.value = state.translations_top.en;
    el.transENBottom.value = state.translations_bottom.en;

    el.transJATop.value = state.translations_top.ja;
    el.transJABottom.value = state.translations_bottom.ja;

    el.transKOTop.value = state.translations_top.ko;
    el.transKOBottom.value = state.translations_bottom.ko;
    
    updateResolutionLabels();
    el.selectLayoutMode.value = state.layoutMode;
  }

  function updateResolutionLabels() {
    const p = state.orientation;
    el.resPhone.textContent = `${DEVICE_SPECS.phone[p].width} x ${DEVICE_SPECS.phone[p].height}`;
    el.resTablet7.textContent = `${DEVICE_SPECS.tablet7[p].width} x ${DEVICE_SPECS.tablet7[p].height}`;
    el.resTablet10.textContent = `${DEVICE_SPECS.tablet10[p].width} x ${DEVICE_SPECS.tablet10[p].height}`;
  }

  function adjustZoom() {
    el.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
    document.documentElement.style.setProperty('--zoom-factor', state.zoom);
  }

  // Handle uploaded file
  function handleFileSelect(e) {
    if (e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  }

  function processUploadedFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('上傳的檔案必須是圖片格式！', 'error');
      return;
    }

    state.imageFileName = file.name;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        state.uploadedImage = img;
        // Setup preview thumbnail
        el.imgThumbnail.src = event.target.result;
        el.uploadPreview.style.display = 'block';
        el.uploadZone.querySelector('.upload-prompt').style.display = 'none';
        
        triggerAllRenders();
        showToast('圖片上傳成功！', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function processUploadedBgFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('上傳的背景檔案必須是圖片格式！', 'error');
      return;
    }

    state.bgImageFileName = file.name;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        state.uploadedBgImage = img;
        el.bgImageThumbnail.src = event.target.result;
        el.bgImagePreview.style.display = 'block';
        el.bgImagePrompt.style.display = 'none';
        triggerAllRenders();
        showToast('背景圖片上傳成功！', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function drawBgImageCover(ctx, img, w, h) {
    const imgRatio = img.width / img.height;
    const destRatio = w / h;
    let drawW = w;
    let drawH = h;
    let drawX = 0;
    let drawY = 0;
    if (imgRatio > destRatio) {
      drawW = h * imgRatio;
      drawX = (w - drawW) / 2;
    } else {
      drawH = w / imgRatio;
      drawY = (h - drawH) / 2;
    }
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  // 7. Translator Module
  async function translateAllLanguages() {
    const textTop = state.captionZH_top.trim();
    const textBottom = state.captionZH_bottom.trim();
    
    if (!textTop && !textBottom) {
      showToast('請先輸入上方或下方中文文字', 'error');
      return;
    }

    el.btnTranslate.disabled = true;
    el.btnTranslate.innerHTML = '<i class="spinner"></i> 正在翻譯中...';

    const jobs = [
      { lang: 'en', loader: el.loaderEN, targetElTop: el.transENTop, targetElBottom: el.transENBottom },
      { lang: 'ja', loader: el.loaderJA, targetElTop: el.transJATop, targetElBottom: el.transJABottom },
      { lang: 'ko', loader: el.loaderKO, targetElTop: el.transKOTop, targetElBottom: el.transKOBottom }
    ];

    const promises = jobs.map(async (job) => {
      job.loader.style.display = 'inline-flex';
      try {
        if (textTop) {
          const transTop = await fetchTranslation(textTop, job.lang);
          state.translations_top[job.lang] = transTop;
          job.targetElTop.value = transTop;
        }
        if (textBottom) {
          const transBottom = await fetchTranslation(textBottom, job.lang);
          state.translations_bottom[job.lang] = transBottom;
          job.targetElBottom.value = transBottom;
        }
      } catch (err) {
        console.error(`Translation to ${job.lang} failed:`, err);
        showToast(`翻譯成${job.lang === 'en' ? '英文' : job.lang === 'ja' ? '日文' : '韓文'}失敗，已保留原有文字。`, 'error');
      } finally {
        job.loader.style.display = 'none';
      }
    });

    await Promise.all(promises);

    el.btnTranslate.disabled = false;
    el.btnTranslate.innerHTML = '<i data-lucide="languages"></i> 一鍵自動翻譯上下文字';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    triggerAllRenders();
    showToast('翻譯完成！已更新語系對照表', 'success');
  }

  async function fetchTranslation(text, targetLang) {
    // Use Google Translate free unofficial Client API (gtx)
    // Translate from zh-TW (Traditional Chinese)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-TW&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('API Response Error');
    const data = await response.json();
    
    // Google Translate returns format: [[[translatedText, sourceText, ...], ...]]
    if (data && data[0]) {
      return data[0].map(item => item[0]).join('');
    }
    return text; // Fallback to source
  }

  async function translateField(field, text) {
    const trimmed = text.trim();
    if (!trimmed) {
      const langs = ['en', 'ja', 'ko'];
      langs.forEach(lang => {
        if (field === 'top') {
          state.translations_top[lang] = '';
          const targetEl = lang === 'en' ? el.transENTop : lang === 'ja' ? el.transJATop : el.transKOTop;
          if (targetEl) targetEl.value = '';
        } else {
          state.translations_bottom[lang] = '';
          const targetEl = lang === 'en' ? el.transENBottom : lang === 'ja' ? el.transJABottom : el.transKOBottom;
          if (targetEl) targetEl.value = '';
        }
      });
      triggerAllRenders();
      return;
    }

    const jobs = [
      { lang: 'en', loader: el.loaderEN, targetEl: field === 'top' ? el.transENTop : el.transENBottom },
      { lang: 'ja', loader: el.loaderJA, targetEl: field === 'top' ? el.transJATop : el.transJABottom },
      { lang: 'ko', loader: el.loaderKO, targetEl: field === 'top' ? el.transKOTop : el.transKOBottom }
    ];

    const promises = jobs.map(async (job) => {
      job.loader.style.display = 'inline-flex';
      try {
        const trans = await fetchTranslation(trimmed, job.lang);
        if (field === 'top') {
          state.translations_top[job.lang] = trans;
        } else {
          state.translations_bottom[job.lang] = trans;
        }
        job.targetEl.value = trans;
      } catch (err) {
        console.error(`Translation to ${job.lang} failed:`, err);
      } finally {
        job.loader.style.display = 'none';
      }
    });

    await Promise.all(promises);
    triggerAllRenders();
  }

  // 8. Hybrid Text Wrapping Algorithm for Canvas
  function wrapText(ctx, text, maxWidth) {
    let lines = [];
    let currentLine = '';
    
    // Regex splits English words, spaces, and individual CJK characters
    const regex = /([a-zA-Z0-9_’'-]+|\s+|[^\s\w])/g;
    let tokens = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      tokens.push(match[0]);
    }
    
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      if (token === '\n') {
        lines.push(currentLine);
        currentLine = '';
        continue;
      }
      let testLine = currentLine + token;
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = token.trim() === '' ? '' : token; // skip leading space on new line
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  // 9. Canvas Rendering Engine
  function triggerAllRenders() {
    renderDeviceCanvas('phone', el.canvasPhone);
    renderDeviceCanvas('tablet7', el.canvasTablet7);
    renderDeviceCanvas('tablet10', el.canvasTablet10);
  }

  function renderDeviceCanvas(deviceKey, canvas, overrideLang = null) {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const spec = DEVICE_SPECS[deviceKey];
    const dimensions = spec[state.orientation];
    const width = dimensions.width;
    const height = dimensions.height;

    // Set canvas actual size
    canvas.width = width;
    canvas.height = height;

    const currentLang = overrideLang || state.currentLangPreview;
    
    // Get text content for Top & Bottom
    const topText = state.translations_top[currentLang] || state.translations_top.zh || '';
    const bottomText = state.translations_bottom[currentLang] || state.translations_bottom.zh || '';

    // --- DRAW BACKGROUND ---
    if (state.bgType === 'solid') {
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, width, height);
    } else if (state.bgType === 'gradient') {
      // 135deg linear gradient diagonal
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, state.gradStart);
      gradient.addColorStop(1, state.gradEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Image background
      if (state.uploadedBgImage) {
        drawBgImageCover(ctx, state.uploadedBgImage, width, height);
      } else {
        // Fallback solid color background
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, width, height);
      }
    }

    // --- DRAW BACKGROUND DECORATIONS ---
    if (state.bgPattern === 'mesh') {
      // Render sleek modern mesh blobs
      ctx.save();
      const maxDim = Math.max(width, height);
      
      // Blob 1: Magenta at top left
      const rGrad1 = ctx.createRadialGradient(0, 0, 0, 0, 0, maxDim * 0.7);
      rGrad1.addColorStop(0, 'rgba(236, 72, 153, 0.45)');
      rGrad1.addColorStop(0.5, 'rgba(236, 72, 153, 0.18)');
      rGrad1.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.fillStyle = rGrad1;
      ctx.fillRect(0, 0, width, height);

      // Blob 2: Indigo at bottom right
      const rGrad2 = ctx.createRadialGradient(width, height, 0, width, height, maxDim * 0.6);
      rGrad2.addColorStop(0, 'rgba(99, 102, 241, 0.48)');
      rGrad2.addColorStop(0.5, 'rgba(99, 102, 241, 0.18)');
      rGrad2.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = rGrad2;
      ctx.fillRect(0, 0, width, height);

      // Blob 3: Emerald at center bottom
      const rGrad3 = ctx.createRadialGradient(width * 0.35, height, 0, width * 0.35, height, maxDim * 0.5);
      rGrad3.addColorStop(0, 'rgba(16, 185, 129, 0.38)');
      rGrad3.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
      rGrad3.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = rGrad3;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } else if (state.bgPattern === 'grid') {
      // Render tech cyberpunk grid (highly visible)
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = Math.max(width * 0.002, 3);
      const gridSize = Math.max(width * 0.05, 80);
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    } else if (state.bgPattern === 'stripes') {
      // Render clean stripes (proportional and visible)
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = Math.max(width * 0.015, 15);
      const spacing = Math.max(width * 0.08, 120);
      for (let i = -height; i < width; i += spacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
        ctx.stroke();
      }
      ctx.restore();
    } else if (state.bgPattern === 'waves') {
      // Render layered sine waves (styled gracefully)
      ctx.save();
      const waveBase1 = height - Math.max(height * 0.12, 160);
      const waveAmp1 = Math.max(height * 0.03, 40);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = waveBase1 + Math.sin(x * 0.002) * waveAmp1;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      const waveBase2 = height - Math.max(height * 0.09, 120);
      const waveAmp2 = Math.max(height * 0.025, 30);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y = waveBase2 + Math.cos(x * 0.0035) * waveAmp2;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (state.bgPattern === 'dots') {
      // Render tech cyberpunk dotted matrix
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      const dotSpacing = Math.max(width * 0.03, 60);
      const dotRadius = Math.max(width * 0.0015, 2.5);
      for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
        for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    } else if (state.bgPattern === 'rings') {
      // Render radial orbits/waves
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = Math.max(width * 0.0012, 2.5);
      const centerX = width;
      const centerY = 0; // top right corner origin
      const ringSpacing = Math.max(width * 0.08, 160);
      const maxDist = Math.max(width, height) * 1.5;
      for (let r = ringSpacing; r < maxDist; r += ringSpacing) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    } else if (state.bgPattern === 'network') {
      // Render constellation nodes network
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = Math.max(width * 0.0008, 1.5);
      // Fixed points ratio array
      const points = [
        {x: 0.08, y: 0.22}, {x: 0.18, y: 0.14}, {x: 0.12, y: 0.42},
        {x: 0.28, y: 0.28}, {x: 0.22, y: 0.58}, {x: 0.38, y: 0.72},
        {x: 0.58, y: 0.12}, {x: 0.68, y: 0.32}, {x: 0.62, y: 0.52},
        {x: 0.78, y: 0.18}, {x: 0.88, y: 0.38}, {x: 0.82, y: 0.68},
        {x: 0.72, y: 0.82}, {x: 0.92, y: 0.78}
      ];
      const mappedPoints = points.map(p => ({
        x: p.x * width,
        y: p.y * height
      }));
      const maxDist = width * 0.22;
      for (let i = 0; i < mappedPoints.length; i++) {
        for (let j = i + 1; j < mappedPoints.length; j++) {
          const p1 = mappedPoints[i];
          const p2 = mappedPoints[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      mappedPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(width * 0.002, 4.5), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    } else if (state.bgPattern === 'spotlight') {
      // Render diagonal spotlight sweep
      ctx.save();
      const spotGrad = ctx.createLinearGradient(0, 0, width, height);
      spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      spotGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0)');
      spotGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)'); // bright sweep
      spotGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
      spotGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    const paddingX = 100;
    
    let textStartX = width / 2;
    let textTextAlign = 'center';
    let textMaxWidth = width - (paddingX * 2);

    if (state.layoutMode === 'left') {
      textStartX = 80;
      textTextAlign = 'left';
      textMaxWidth = width * 0.4 - 120;
    } else if (state.layoutMode === 'right') {
      textStartX = width * 0.6 + 40;
      textTextAlign = 'left';
      textMaxWidth = width * 0.4 - 120;
    }
    
    // --- DRAW TOP TEXT OVERLAY ---
    let topTextHeight = 0;
    let topTextStartY = state.textMargin_top;
    
    if (topText) {
      ctx.save();
      let fontNameTop = state.fontFamily_top;
      if (currentLang === 'zh') fontNameTop = 'Noto Sans TC';
      else if (currentLang === 'ja') fontNameTop = 'Noto Sans JP';
      else if (currentLang === 'ko') fontNameTop = 'Noto Sans KR';

      ctx.font = `bold ${state.fontSize_top}px '${fontNameTop}', sans-serif`;
      ctx.fillStyle = state.textColor_top;
      ctx.textAlign = textTextAlign;
      ctx.textBaseline = 'top';

      const topLines = wrapText(ctx, topText, textMaxWidth);
      topTextHeight = topLines.length * (state.fontSize_top * state.lineHeight_top);

      if (state.showTextShadow_top) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
      }

      topLines.forEach((line, index) => {
        const lineY = topTextStartY + index * (state.fontSize_top * state.lineHeight_top);
        ctx.fillText(line, textStartX, lineY);
      });
      ctx.restore();
    }

    // --- DRAW BOTTOM TEXT OVERLAY ---
    let bottomTextHeight = 0;
    let bottomTextStartY = height - state.textMargin_bottom;
    
    if (bottomText) {
      ctx.save();
      let fontNameBottom = state.fontFamily_bottom;
      if (currentLang === 'zh') fontNameBottom = 'Noto Sans TC';
      else if (currentLang === 'ja') fontNameBottom = 'Noto Sans JP';
      else if (currentLang === 'ko') fontNameBottom = 'Noto Sans KR';

      ctx.font = `bold ${state.fontSize_bottom}px '${fontNameBottom}', sans-serif`;
      ctx.fillStyle = state.textColor_bottom;
      ctx.textAlign = textTextAlign;
      ctx.textBaseline = 'top';

      const bottomLines = wrapText(ctx, bottomText, textMaxWidth);
      bottomTextHeight = bottomLines.length * (state.fontSize_bottom * state.lineHeight_bottom);
      bottomTextStartY = height - bottomTextHeight - state.textMargin_bottom;

      if (state.showTextShadow_bottom) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
      }

      bottomLines.forEach((line, index) => {
        const lineY = bottomTextStartY + index * (state.fontSize_bottom * state.lineHeight_bottom);
        ctx.fillText(line, textStartX, lineY);
      });
      ctx.restore();
    }

    // Update interactive text ranges for dragging (if not generating zip)
    if (!overrideLang) {
      textRanges[deviceKey] = {
        top: topText ? { y1: topTextStartY, y2: topTextStartY + topTextHeight } : { y1: 0, y2: 0 },
        bottom: bottomText ? { y1: bottomTextStartY, y2: bottomTextStartY + bottomTextHeight } : { y1: 0, y2: 0 }
      };
    }

    // --- DETERMINE DEVICE FRAME SAFE DRAWING BOUNDS ---
    const verticalOrientation = state.orientation === 'portrait';
    let topMargin, bottomMargin, deviceAreaWidth, deviceAreaHeight;

    if (state.layoutMode === 'vertical') {
      topMargin = topText ? topTextStartY + topTextHeight + 60 : 80;
      bottomMargin = bottomText ? bottomTextStartY - 60 : height - 80;
      deviceAreaHeight = bottomMargin - topMargin;
      deviceAreaWidth = width - 160; // 80px margin left and right
    } else {
      // Side modes: no text top/bottom constraints, use full device height minus margin
      topMargin = 80;
      bottomMargin = height - 80;
      deviceAreaHeight = bottomMargin - topMargin;
      deviceAreaWidth = width * 0.6 - 120; // 60% width minus padding
    }

    // Determine target size for the screenshot / shell based on device type
    // Device screen aspect ratios (Phone 9.3:19.3, Tablet 10:16)
    let screenRatio = 0.5; // width / height
    if (deviceKey === 'phone') {
      screenRatio = verticalOrientation ? 1080 / 2280 : 2280 / 1080;
    } else if (deviceKey === 'tablet7') {
      screenRatio = verticalOrientation ? 1200 / 1920 : 1920 / 1200;
    } else if (deviceKey === 'tablet10') {
      screenRatio = verticalOrientation ? 1600 / 2560 : 2560 / 1600;
    }

    // Outer bounding dimensions for device frame (fits within Safe Area)
    let deviceWidth, deviceHeight;

    if (state.showDeviceFrame) {
      const bezelFactor = 0.035; // proportional bezel factor matching drawDeviceFrame
      
      // Try width-limited first
      let w = deviceAreaWidth;
      let borderThickness = Math.max(w * bezelFactor, 12);
      let screenW = w - 2 * borderThickness;
      let screenH = screenW / screenRatio;
      let h = screenH + 2 * borderThickness;
      
      if (h > deviceAreaHeight) {
        // Height-limited
        h = deviceAreaHeight;
        w = (h * screenRatio) / (1 + 2 * bezelFactor * screenRatio - 2 * bezelFactor);
        borderThickness = w * bezelFactor;
        if (borderThickness < 12) {
          borderThickness = 12;
          w = (h - 24) * screenRatio + 24;
        }
      }
      deviceWidth = w;
      deviceHeight = h;
    } else {
      deviceWidth = deviceAreaWidth;
      deviceHeight = deviceWidth / screenRatio;

      if (deviceHeight > deviceAreaHeight) {
        deviceHeight = deviceAreaHeight;
        deviceWidth = deviceHeight * screenRatio;
      }
    }

    // Center the device box within the designated Layout Area
    let deviceX, deviceY;
    if (state.layoutMode === 'left') {
      const mockupAreaStartX = width * 0.4 + 40;
      deviceX = mockupAreaStartX + (deviceAreaWidth - deviceWidth) / 2;
      deviceY = topMargin + (deviceAreaHeight - deviceHeight) / 2;
    } else if (state.layoutMode === 'right') {
      const mockupAreaStartX = 80;
      deviceX = mockupAreaStartX + (deviceAreaWidth - deviceWidth) / 2;
      deviceY = topMargin + (deviceAreaHeight - deviceHeight) / 2;
    } else {
      deviceX = (width - deviceWidth) / 2;
      deviceY = topMargin + (deviceAreaHeight - deviceHeight) / 2;
    }

    // --- DRAW BACKING GLOW ---
    if (state.bgPattern === 'glow') {
      ctx.save();
      // Neon backlighting shadow glow
      ctx.shadowColor = 'rgba(99, 102, 241, 0.6)'; // Rich indigo/violet glow
      ctx.shadowBlur = Math.max(width * 0.04, 80);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
      const radius = state.showDeviceFrame ? Math.max(deviceWidth * 0.08, 30) : 16;
      drawRoundedRectPath(ctx, deviceX, deviceY, deviceWidth, deviceHeight, radius);
      ctx.fill();
      ctx.restore();
    }

    // --- DRAW SCREENSHOT & DEVICE FRAME ---
    if (state.showDeviceFrame) {
      drawDeviceFrame(ctx, deviceKey, deviceX, deviceY, deviceWidth, deviceHeight, verticalOrientation);
    } else {
      // Direct raw screenshot (no frame)
      drawScreenshotDirect(ctx, deviceX, deviceY, deviceWidth, deviceHeight);
    }
  }

  // Draw Device Mockup Outline dynamically
  function drawDeviceFrame(ctx, deviceKey, x, y, w, h, isVertical) {
    const borderThickness = Math.max(w * 0.035, 12); // proportional bezel
    const outerRadius = Math.max(w * 0.08, 30);
    const innerRadius = Math.max(outerRadius - borderThickness, 12);

    ctx.save();
    
    // 1. Device Outer Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 15;

    // 2. Bezel Path (Device Shell)
    ctx.fillStyle = '#1e2029'; // Matte dark grey body
    ctx.strokeStyle = '#2d303f'; // Light edge highlight
    ctx.lineWidth = borderThickness * 0.1;
    
    drawRoundedRectPath(ctx, x, y, w, h, outerRadius);
    ctx.fill();
    ctx.stroke();
    
    // Clear shadow state
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 3. Screen Clip Path (inner bounds)
    const screenX = x + borderThickness;
    const screenY = y + borderThickness;
    const screenW = w - (borderThickness * 2);
    const screenH = h - (borderThickness * 2);

    ctx.save();
    drawRoundedRectPath(ctx, screenX, screenY, screenW, screenH, innerRadius);
    ctx.clip();

    // 4. Fill Screen Background / Screenshot
    if (state.uploadedImage) {
      drawScreenshotInside(ctx, state.uploadedImage, screenX, screenY, screenW, screenH);
    } else {
      // Draw Placeholder Screen
      ctx.fillStyle = '#0f111a';
      ctx.fillRect(screenX, screenY, screenW, screenH);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(screenX, screenY, screenW, screenH);

      ctx.font = `${Math.max(w * 0.05, 18)}px sans-serif`;
      ctx.fillStyle = '#4f5263';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('App 截圖預覽', screenX + screenW / 2, screenY + screenH / 2);
    }

    // 5. Draw Glossy Reflection Overlay
    const glossGrad = ctx.createLinearGradient(screenX, screenY, screenX + screenW, screenY + screenH);
    glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    glossGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.02)');
    glossGrad.addColorStop(0.41, 'rgba(255, 255, 255, 0)');
    glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glossGrad;
    ctx.fillRect(screenX, screenY, screenW, screenH);

    ctx.restore(); // Exit Screen Clipping

    // 6. Draw Simulated Accessories (Dynamic Island Notch, Home Bar indicator)
    ctx.fillStyle = '#000000'; // black plastic
    if (deviceKey === 'phone') {
      if (isVertical) {
        // Dynamic Island Capsule at top
        const islandW = w * 0.28;
        const islandH = Math.max(h * 0.022, 24);
        const islandX = x + (w - islandW) / 2;
        const islandY = y + borderThickness + (borderThickness * 0.2);
        drawRoundedRectPath(ctx, islandX, islandY, islandW, islandH, islandH / 2);
        ctx.fill();

        // Home indicator bar at bottom screen
        const barW = w * 0.35;
        const barH = 5;
        const barX = x + (w - barW) / 2;
        const barY = y + h - borderThickness - 12;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        drawRoundedRectPath(ctx, barX, barY, barW, barH, 2.5);
        ctx.fill();
      } else {
        // Horizontal Dynamic Island (Left or right notch, or standard pill center top)
        const islandW = h * 0.28;
        const islandH = Math.max(w * 0.022, 24);
        const islandX = x + borderThickness + (borderThickness * 0.2);
        const islandY = y + (h - islandW) / 2;
        // Draw rotating capsule
        drawRoundedRectPath(ctx, islandX, islandY, islandH, islandW, islandH / 2);
        ctx.fill();
      }
    } else {
      // Tablets - draw a tiny camera pinhole in the bezel
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      const camRadius = 4;
      let camX = x + w / 2;
      let camY = y + borderThickness / 2;
      if (!isVertical) {
        camX = x + borderThickness / 2;
        camY = y + h / 2;
      }
      ctx.beginPath();
      ctx.arc(camX, camY, camRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw screenshots directly when no frame chosen
  function drawScreenshotDirect(ctx, x, y, w, h) {
    ctx.save();
    // Rounded screenshot card shadows
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    
    // Draw card border path
    drawRoundedRectPath(ctx, x, y, w, h, 16);
    ctx.clip();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    if (state.uploadedImage) {
      drawScreenshotInside(ctx, state.uploadedImage, x, y, w, h);
    } else {
      ctx.fillStyle = '#0f111a';
      ctx.fillRect(x, y, w, h);
      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#4f5263';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('App 截圖預覽', x + w / 2, y + h / 2);
    }
    ctx.restore();
  }

  // Scaling image inside device viewport
  function drawScreenshotInside(ctx, img, sx, sy, sw, sh) {
    if (state.fitMode === 'stretch') {
      ctx.drawImage(img, sx, sy, sw, sh);
      return;
    }

    const imgRatio = img.width / img.height;
    const destRatio = sw / sh;
    
    let drawW = sw;
    let drawH = sh;
    let drawX = sx;
    let drawY = sy;

    if (state.fitMode === 'contain') {
      // Scale fitting inside, showing background bars if aspects mismatch
      ctx.fillStyle = '#000';
      ctx.fillRect(sx, sy, sw, sh);
      
      if (imgRatio > destRatio) {
        drawH = sw / imgRatio;
        drawY = sy + (sh - drawH) / 2;
      } else {
        drawW = sh * imgRatio;
        drawX = sx + (sw - drawW) / 2;
      }
    } else {
      // Cover crop filling the viewport
      if (imgRatio > destRatio) {
        drawW = sh * imgRatio;
        drawX = sx + (sw - drawW) / 2;
      } else {
        drawH = sw / imgRatio;
        drawY = sy + (sh - drawH) / 2;
      }
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  // Canvas Path Helper
  function drawRoundedRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // 10. Single Download Trigger
  function exportSingleImage(deviceKey) {
    const canvas = document.getElementById(`canvas-${deviceKey}`);
    if (!canvas) return;

    const langName = state.currentLangPreview.toUpperCase();
    const resolution = state.orientation === 'portrait' ? 'Portrait' : 'Landscape';
    const filename = `PlayShot_${deviceKey}_${langName}_${resolution}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(`導出成功: ${filename}`, 'success');
  }

  // 11. Batch Export All Sizes & Languages (JSZip)
  async function exportAllZipped() {
    const btn = el.btnExportAll;
    btn.disabled = true;
    btn.innerHTML = '<i class="spinner"></i> 正在批次渲染中...';

    // Temp hidden canvas for generating images
    const tempCanvas = document.createElement('canvas');
    const zip = new JSZip();

    const devices = ['phone', 'tablet7', 'tablet10'];
    const languages = ['zh', 'en', 'ja', 'ko'];
    const orientationName = state.orientation === 'portrait' ? 'Portrait' : 'Landscape';

    let renderCount = 0;
    const totalCount = devices.length * languages.length;

    // Outer progress tracking toast
    showToast(`開始批次渲染 ${totalCount} 張展示圖...`, 'info');

    try {
      for (const lang of languages) {
        const folder = zip.folder(lang.toUpperCase());
        for (const device of devices) {
          // Render to the offscreen tempCanvas
          renderDeviceCanvas(device, tempCanvas, lang);
          
          // Get binary Blob data
          const blob = await new Promise(resolve => tempCanvas.toBlob(resolve, 'image/png'));
          const filename = `${lang.toUpperCase()}_${device}_${orientationName}.png`;
          folder.file(filename, blob);
          
          renderCount++;
        }
      }

      // Generate Zip File download link
      showToast('渲染完成，正在封裝壓縮檔...', 'info');
      const content = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.download = `playshot_store_screenshots_${orientationName}.zip`;
      link.href = URL.createObjectURL(content);
      link.click();

      showToast('一鍵下載 ZIP 打包成功！', 'success');
    } catch (err) {
      console.error('Batch export failed:', err);
      showToast('打包導出失敗，請再試一次。', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="download-cloud"></i> 一鍵導出所有規格 & 語言 (ZIP)';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
});
