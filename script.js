// تهيئة مكتبة PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// عناصر الواجهة
const pdfInput = document.getElementById('pdfInput');
const translateBtn = document.getElementById('translateBtn');
const manualModeBtn = document.getElementById('manualModeBtn');
const compareBtn = document.getElementById('compareBtn');
const exportPngBtn = document.getElementById('exportPngBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');

const pageControls = document.getElementById('pageControls');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfo = document.getElementById('pageInfo');

const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const fitBtn = document.getElementById('fitBtn');
const zoomLabel = document.getElementById('zoomLabel');

const ignoreNumbersChk = document.getElementById('ignoreNumbersChk');
const mergeLinesChk = document.getElementById('mergeLinesChk');
const fontScaleRange = document.getElementById('fontScaleRange');
const fontScaleVal = document.getElementById('fontScaleVal');
const textColorPicker = document.getElementById('textColorPicker');
const bgColorPicker = document.getElementById('bgColorPicker');
const renderScaleSelect = document.getElementById('renderScaleSelect');

const itemsList = document.getElementById('itemsList');
const itemsCount = document.getElementById('itemsCount');
const searchInput = document.getElementById('searchInput');
const clearBoxesBtn = document.getElementById('clearBoxesBtn');

const viewportEl = document.getElementById('viewport');
const dropZone = document.getElementById('dropZone');
const canvasStage = document.getElementById('canvasStage');
const pdfCanvas = document.getElementById('pdfCanvas');
const overlayCanvas = document.getElementById('overlayCanvas');
const pdfCtx = pdfCanvas.getContext('2d');
const overlayCtx = overlayCanvas.getContext('2d');

const progressBarWrap = document.getElementById('progressBarWrap');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');

const manualModal = document.getElementById('manualModal');
const manualEnInput = document.getElementById('manualEnInput');
const manualArInput = document.getElementById('manualArInput');
const manualAutoTranslateBtn = document.getElementById('manualAutoTranslateBtn');
const manualSaveBtn = document.getElementById('manualSaveBtn');
const manualCancelBtn = document.getElementById('manualCancelBtn');

// حالة التطبيق
let pdfDoc = null;
let currentPageNum = 1;
let currentFileName = 'translated_drawing';
let renderScale = 2.2;
let zoom = 1;
let panX = 0;
let panY = 0;

let boxes = []; // مربعات الترجمة للصفحة الحالية
let selectedBoxId = null;
let showOriginalOnly = false;
let manualDrawMode = false;

// متغيرات السحب بالماوس
let isPanning = false;
let isDraggingBox = false;
let isDrawingManualBox = false;
let dragStartX = 0;
let dragStartY = 0;
let boxStartX = 0;
let boxStartY = 0;
let tempManualRect = null;

// ==========================================
// 1. رفع وقراءة ملف PDF
// ==========================================
pdfInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) loadPdfFile(file);
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') loadPdfFile(file);
});

async function loadPdfFile(file) {
  currentFileName = file.name.replace(/\.pdf$/i, '');
  showProgress('جاري تحميل ملف المخطط...', 20);
  try {
    const arrayBuffer = await file.arrayBuffer();
    pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    currentPageNum = 1;

    dropZone.classList.add('hidden');
    canvasStage.classList.remove('hidden');

    if (pdfDoc.numPages > 1) {
      pageControls.style.display = 'flex';
    } else {
      pageControls.style.display = 'none';
    }

    enableControls(true);
    await renderPage(currentPageNum);
    hideProgress();
  } catch (err) {
    hideProgress();
    alert('حدث خطأ أثناء فتح ملف الـ PDF: ' + err.message);
  }
}

function enableControls(enabled) {
  translateBtn.disabled = !enabled;
  manualModeBtn.disabled = !enabled;
  compareBtn.disabled = !enabled;
  exportPngBtn.disabled = !enabled;
  exportPdfBtn.disabled = !enabled;
  zoomInBtn.disabled = !enabled;
  zoomOutBtn.disabled = !enabled;
  fitBtn.disabled = !enabled;
}

async function renderPage(pageNum) {
  renderScale = parseFloat(renderScaleSelect.value);
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: renderScale });

  pdfCanvas.width = viewport.width;
  pdfCanvas.height = viewport.height;
  overlayCanvas.width = viewport.width;
  overlayCanvas.height = viewport.height;

  await page.render({ canvasContext: pdfCtx, viewport }).promise;

  pageInfo.textContent = `${pageNum} / ${pdfDoc.numPages}`;
  prevPageBtn.disabled = pageNum <= 1;
  nextPageBtn.disabled = pageNum >= pdfDoc.numPages;

  // استخراج النصوص من الصفحة
  await extractTextBoxes(page, viewport);
  fitToScreen();
  redrawOverlay();
  renderSidebarList();
}

prevPageBtn.addEventListener('click', () => {
  if (currentPageNum > 1) {
    currentPageNum--;
    renderPage(currentPageNum);
  }
});

nextPageBtn.addEventListener('click', () => {
  if (pdfDoc && currentPageNum < pdfDoc.numPages) {
    currentPageNum++;
    renderPage(currentPageNum);
  }
});

renderScaleSelect.addEventListener('change', () => {
  if (pdfDoc) renderPage(currentPageNum);
});

ignoreNumbersChk.addEventListener('change', () => {
  if (pdfDoc) renderPage(currentPageNum);
});

mergeLinesChk.addEventListener('change', () => {
  if (pdfDoc) renderPage(currentPageNum);
});

// ==========================================
// 2. استخراج ودمج النصوص من المخطط
// ==========================================
function shouldTranslateText(str) {
  const clean = str.trim();
  if (!clean) return false;
  if (!ignoreNumbersChk.checked) return true;

  // تجاهل الأرقام البحتة والأبعاد والمناسيب والرموز
  if (/^[\d\s.,+\-*/=:%()~<>°ØΦ#@\[\]'"\\|]+$/.test(clean)) return false;

  // تجاهل الرموز الهندسية القصيرة مثل PW1, C1, G2, SL-01, WAT-201A
  if (/^[A-Z]{1,4}[-]?\d+[A-Z]?$/i.test(clean)) return false;

  // يجب أن يحتوي على حرفين إنجليزيين متصلين على الأقل
  if (!/[a-zA-Z]{2,}/.test(clean)) return false;

  return true;
}

async function extractTextBoxes(page, viewport) {
  const textContent = await page.getTextContent();
  let rawItems = [];

  for (const item of textContent.items) {
    const str = item.str.trim();
    if (!str) continue;

    const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
    const fontHeight = Math.hypot(tx[2], tx[3]) || Math.hypot(tx[0], tx[1]);
    const angle = Math.atan2(tx[1], tx[0]);
    const width = Math.max(item.width * viewport.scale, fontHeight * 0.6);
    const x = tx[4];
    const y = tx[5]; // baseline

    rawItems.push({
      str,
      x,
      y,
      width,
      height: fontHeight * 1.15,
      fontSize: fontHeight,
      angle,
    });
  }

  // دمج الكلمات المتجاورة في نفس السطر (للنصوص الأفقية)
  let processed = [];
  if (mergeLinesChk.checked) {
    const horizontal = rawItems.filter((it) => Math.abs(it.angle) < 0.08);
    const rotated = rawItems.filter((it) => Math.abs(it.angle) >= 0.08);

    horizontal.sort((a, b) => {
      if (Math.abs(a.y - b.y) < Math.min(a.fontSize, b.fontSize) * 0.45) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });

    for (const item of horizontal) {
      const last = processed[processed.length - 1];
      if (
        last &&
        Math.abs(last.y - item.y) < last.fontSize * 0.45 &&
        Math.abs(last.fontSize - item.fontSize) < last.fontSize * 0.35 &&
        item.x - (last.x + last.width) < last.fontSize * 1.6 &&
        item.x - (last.x + last.width) > -last.fontSize * 0.5
      ) {
        const newRight = Math.max(last.x + last.width, item.x + item.width);
        last.str = `${last.str} ${item.str}`;
        last.width = newRight - last.x;
        last.fontSize = Math.max(last.fontSize, item.fontSize);
        last.height = last.fontSize * 1.15;
      } else {
        processed.push({ ...item });
      }
    }
    processed = processed.concat(rotated);
  } else {
    processed = rawItems;
  }

  // تصفية النصوص القابلة للترجمة وإنشاء المربعات
  boxes = processed
    .filter((it) => shouldTranslateText(it.str))
    .map((it, idx) => ({
      id: `box_${Date.now()}_${idx}`,
      original: it.str,
      translated: '',
      x: it.x,
      y: it.y - it.fontSize * 0.88,
      width: it.width,
      height: it.height,
      fontSize: it.fontSize,
      angle: it.angle,
      fontAdjust: 1,
      visible: true,
      manual: false,
    }));

  selectedBoxId = null;
}

// ==========================================
// 3. الترجمة التلقائية (Google Translate API المجاني + MyMemory كاحتياطي)
// ==========================================
async function translateTextSingle(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        return data[0].map((part) => part[0]).join('').trim();
      }
    }
  } catch (e) {
    // الانتقال للمصدر الاحتياطي
  }

  try {
    const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`;
    const res2 = await fetch(fallbackUrl);
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2?.responseData?.translatedText) {
        return data2.responseData.translatedText.trim();
      }
    }
  } catch (e) {
    console.error('Translation failed for:', text);
  }
  return text;
}

async function translateBatch(list) {
  const sep = '\n';
  const joined = list.join(sep);
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(joined)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const fullTranslated = data[0].map((p) => p[0]).join('');
      const parts = fullTranslated.split('\n').map((s) => s.trim());
      if (parts.length === list.length) {
        return parts;
      }
    }
  } catch (e) {
    // في حالة فشل الدفعة نترجم بشكل فردي
  }

  const results = [];
  for (const item of list) {
    results.push(await translateTextSingle(item));
  }
  return results;
}

translateBtn.addEventListener('click', async () => {
  if (!boxes.length) {
    alert('لم يتم العثور على نصوص قابلة للتحديد في هذه الصفحة. يمكنك استخدام زر "إضافة نص يدوي" لترجمة النصوص المرسومة كصور أو خطوط.');
    return;
  }

  translateBtn.disabled = true;
  showProgress('جاري ترجمة نصوص المخطط للعربية...', 5);

  const toTranslate = boxes.filter((b) => !b.translated);
  const chunkSize = 12;

  for (let i = 0; i < toTranslate.length; i += chunkSize) {
    const chunk = toTranslate.slice(i, i + chunkSize);
    const originals = chunk.map((b) => b.original);
    const translatedArr = await translateBatch(originals);

    chunk.forEach((box, idx) => {
      box.translated = translatedArr[idx] || box.original;
    });

    const pct = Math.min(100, Math.round(((i + chunk.length) / toTranslate.length) * 100));
    showProgress(`جاري الترجمة... (${Math.min(i + chunk.length, toTranslate.length)} / ${toTranslate.length})`, pct);
    redrawOverlay();
  }

  renderSidebarList();
  hideProgress();
  translateBtn.disabled = false;
});

// ==========================================
// 4. رسم طبقة الترجمة فوق المخطط
// ==========================================
function redrawOverlay(isExporting = false) {
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  if (showOriginalOnly && !isExporting) return;

  const globalScale = parseInt(fontScaleRange.value, 10) / 100;
  const textColor = textColorPicker.value;
  const bgColor = bgColorPicker.value;

  for (const box of boxes) {
    if (!box.visible || !box.translated) continue;

    overlayCtx.save();
    const padX = Math.max(2, box.fontSize * 0.15);
    const padY = Math.max(1.5, box.fontSize * 0.12);

    overlayCtx.translate(box.x, box.y);
    if (Math.abs(box.angle) > 0.05) {
      overlayCtx.rotate(box.angle);
    }

    // خلفية تغطية النص الإنجليزي الأصلي
    overlayCtx.fillStyle = bgColor;
    overlayCtx.fillRect(-padX, -padY, box.width + padX * 2, box.height + padY * 2);

    // حساب حجم الخط المناسب حتى لا يخرج النص العربي عن المساحة
    let size = Math.max(7, box.fontSize * globalScale * box.fontAdjust);
    overlayCtx.font = `600 ${size}px Cairo, Tahoma, Arial, sans-serif`;
    let measured = overlayCtx.measureText(box.translated).width;
    const maxAllowedWidth = Math.max(box.width * 1.12, box.fontSize * 2.5);

    if (measured > maxAllowedWidth && !box.manual) {
      const ratio = maxAllowedWidth / measured;
      size = Math.max(6, size * Math.max(ratio, 0.58));
      overlayCtx.font = `600 ${size}px Cairo, Tahoma, Arial, sans-serif`;
    }

    // رسم النص العربي
    overlayCtx.fillStyle = textColor;
    overlayCtx.direction = 'rtl';
    overlayCtx.textAlign = 'center';
    overlayCtx.textBaseline = 'middle';
    overlayCtx.fillText(box.translated, box.width / 2, box.height / 2 + size * 0.05);

    // إطار التحديد (لا يظهر عند التصدير)
    if (!isExporting && box.id === selectedBoxId) {
      overlayCtx.strokeStyle = '#3b82f6';
      overlayCtx.lineWidth = Math.max(1.5, 2 / zoom);
      overlayCtx.setLineDash([5, 3]);
      overlayCtx.strokeRect(-padX - 1, -padY - 1, box.width + padX * 2 + 2, box.height + padY * 2 + 2);
    }

    overlayCtx.restore();
  }

  // رسم المربع المؤقت أثناء الوضع اليدوي
  if (tempManualRect && !isExporting) {
    overlayCtx.save();
    overlayCtx.strokeStyle = '#f59e0b';
    overlayCtx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    overlayCtx.lineWidth = 2;
    overlayCtx.setLineDash([6, 4]);
    overlayCtx.fillRect(tempManualRect.x, tempManualRect.y, tempManualRect.w, tempManualRect.h);
    overlayCtx.strokeRect(tempManualRect.x, tempManualRect.y, tempManualRect.w, tempManualRect.h);
    overlayCtx.restore();
  }
}

// تحديث فوري عند تغيير الإعدادات
fontScaleRange.addEventListener('input', () => {
  fontScaleVal.textContent = `${fontScaleRange.value}%`;
  redrawOverlay();
});
textColorPicker.addEventListener('input', () => redrawOverlay());
bgColorPicker.addEventListener('input', () => redrawOverlay());

compareBtn.addEventListener('click', () => {
  showOriginalOnly = !showOriginalOnly;
  compareBtn.classList.toggle('active', showOriginalOnly);
  compareBtn.textContent = showOriginalOnly ? '👁️ إظهار الترجمة' : '👁️ معاينة الأصل';
  redrawOverlay();
});

// ==========================================
// 5. القائمة الجانبية وإدارة النصوص
// ==========================================
function renderSidebarList() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = boxes.filter(
    (b) =>
      !query ||
      b.original.toLowerCase().includes(query) ||
      (b.translated && b.translated.toLowerCase().includes(query))
  );

  itemsCount.textContent = boxes.length;
  itemsList.innerHTML = '';

  if (!filtered.length) {
    itemsList.innerHTML = '<div class="empty-state">لا توجد نصوص مطابقة للعرض.</div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  filtered.forEach((box) => {
    const card = document.createElement('div');
    card.className = `text-item-card ${box.id === selectedBoxId ? 'selected' : ''} ${!box.visible ? 'hidden-box' : ''}`;
    card.dataset.id = box.id;

    card.innerHTML = `
      <div class="item-orig">${escapeHtml(box.original || '(نص يدوي)')}</div>
      <input type="text" class="item-input" value="${escapeHtml(box.translated)}" placeholder="اكتب الترجمة هنا..." />
      <div class="item-actions">
        <div>
          <button class="mini-btn btn-inc" title="تكبير الخط">A+</button>
          <button class="mini-btn btn-dec" title="تصغير الخط">A-</button>
          <button class="mini-btn btn-toggle" title="إخفاء/إظهار">${box.visible ? '👁️' : '🚫'}</button>
        </div>
        <button class="mini-btn danger btn-del" title="حذف">حذف</button>
      </div>
    `;

    const input = card.querySelector('.item-input');
    input.addEventListener('input', (e) => {
      box.translated = e.target.value;
      redrawOverlay();
    });

    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      selectBox(box.id, false);
    });

    card.querySelector('.btn-inc').addEventListener('click', () => {
      box.fontAdjust = Math.min(2.5, box.fontAdjust + 0.12);
      redrawOverlay();
    });

    card.querySelector('.btn-dec').addEventListener('click', () => {
      box.fontAdjust = Math.max(0.4, box.fontAdjust - 0.12);
      redrawOverlay();
    });

    card.querySelector('.btn-toggle').addEventListener('click', () => {
      box.visible = !box.visible;
      redrawOverlay();
      renderSidebarList();
    });

    card.querySelector('.btn-del').addEventListener('click', () => {
      boxes = boxes.filter((b) => b.id !== box.id);
      if (selectedBoxId === box.id) selectedBoxId = null;
      redrawOverlay();
      renderSidebarList();
    });

    fragment.appendChild(card);
  });

  itemsList.appendChild(fragment);
}

searchInput.addEventListener('input', renderSidebarList);

clearBoxesBtn.addEventListener('click', () => {
  if (!boxes.length) return;
  if (confirm('هل تريد مسح جميع مربعات الترجمة في هذه الصفحة؟')) {
    boxes = [];
    selectedBoxId = null;
    redrawOverlay();
    renderSidebarList();
  }
});

function selectBox(id, scrollSidebar = true) {
  selectedBoxId = id;
  redrawOverlay();
  document.querySelectorAll('.text-item-card').forEach((el) => {
    el.classList.toggle('selected', el.dataset.id === id);
    if (scrollSidebar && el.dataset.id === id) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

// ==========================================
// 6. الزووم والتحريك والتفاعل مع اللوحة بالماوس
// ==========================================
function updateTransform() {
  canvasStage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
}

function fitToScreen() {
  const vw = viewportEl.clientWidth - 40;
  const vh = viewportEl.clientHeight - 40;
  const scaleX = vw / pdfCanvas.width;
  const scaleY = vh / pdfCanvas.height;
  zoom = Math.min(scaleX, scaleY, 1.5);
  panX = (viewportEl.clientWidth - pdfCanvas.width * zoom) / 2;
  panY = (viewportEl.clientHeight - pdfCanvas.height * zoom) / 2;
  updateTransform();
}

zoomInBtn.addEventListener('click', () => {
  zoomAtPoint(zoom * 1.2, viewportEl.clientWidth / 2, viewportEl.clientHeight / 2);
});
zoomOutBtn.addEventListener('click', () => {
  zoomAtPoint(zoom / 1.2, viewportEl.clientWidth / 2, viewportEl.clientHeight / 2);
});
fitBtn.addEventListener('click', fitToScreen);

function zoomAtPoint(newZoom, clientX, clientY) {
  const clamped = Math.max(0.15, Math.min(5, newZoom));
  const rect = viewportEl.getBoundingClientRect();
  const mx = clientX - rect.left;
  const my = clientY - rect.top;

  const canvasX = (mx - panX) / zoom;
  const canvasY = (my - panY) / zoom;

  zoom = clamped;
  panX = mx - canvasX * zoom;
  panY = my - canvasY * zoom;
  updateTransform();
}

viewportEl.addEventListener(
  'wheel',
  (e) => {
    if (!pdfDoc) return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    zoomAtPoint(zoom * factor, e.clientX, e.clientY);
  },
  { passive: false }
);

function getCanvasCoords(e) {
  const rect = viewportEl.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left - panX) / zoom,
    y: (e.clientY - rect.top - panY) / zoom,
  };
}

function hitTestBox(cx, cy) {
  for (let i = boxes.length - 1; i >= 0; i--) {
    const b = boxes[i];
    if (!b.visible) continue;
    if (cx >= b.x - 4 && cx <= b.x + b.width + 4 && cy >= b.y - 4 && cy <= b.y + b.height + 4) {
      return b;
    }
  }
  return null;
}

// تفعيل وضع الرسم اليدوي
manualModeBtn.addEventListener('click', () => {
  manualDrawMode = !manualDrawMode;
  manualModeBtn.classList.toggle('active', manualDrawMode);
  viewportEl.classList.toggle('crosshair', manualDrawMode);
});

viewportEl.addEventListener('mousedown', (e) => {
  if (!pdfDoc || e.button !== 0) return;
  const pt = getCanvasCoords(e);

  if (manualDrawMode) {
    isDrawingManualBox = true;
    tempManualRect = { x: pt.x, y: pt.y, w: 0, h: 0, startX: pt.x, startY: pt.y };
    return;
  }

  const hit = hitTestBox(pt.x, pt.y);
  if (hit && !showOriginalOnly) {
    selectBox(hit.id, true);
    isDraggingBox = true;
    dragStartX = pt.x;
    dragStartY = pt.y;
    boxStartX = hit.x;
    boxStartY = hit.y;
    return;
  }

  selectedBoxId = null;
  redrawOverlay();
  isPanning = true;
  viewportEl.classList.add('grabbing');
  dragStartX = e.clientX - panX;
  dragStartY = e.clientY - panY;
});

window.addEventListener('mousemove', (e) => {
  if (isDrawingManualBox && tempManualRect) {
    const pt = getCanvasCoords(e);
    tempManualRect.x = Math.min(tempManualRect.startX, pt.x);
    tempManualRect.y = Math.min(tempManualRect.startY, pt.y);
    tempManualRect.w = Math.abs(pt.x - tempManualRect.startX);
    tempManualRect.h = Math.abs(pt.y - tempManualRect.startY);
    redrawOverlay();
    return;
  }

  if (isDraggingBox && selectedBoxId) {
    const pt = getCanvasCoords(e);
    const box = boxes.find((b) => b.id === selectedBoxId);
    if (box) {
      box.x = boxStartX + (pt.x - dragStartX);
      box.y = boxStartY + (pt.y - dragStartY);
      redrawOverlay();
    }
    return;
  }

  if (isPanning) {
    panX = e.clientX - dragStartX;
    panY = e.clientY - dragStartY;
    updateTransform();
  }
});

window.addEventListener('mouseup', () => {
  if (isDrawingManualBox) {
    isDrawingManualBox = false;
    if (tempManualRect && tempManualRect.w > 12 && tempManualRect.h > 8) {
      openManualModal();
    } else {
      tempManualRect = null;
      redrawOverlay();
    }
  }
  isDraggingBox = false;
  isPanning = false;
  viewportEl.classList.remove('grabbing');
});

// ==========================================
// 7. نافذة الإضافة اليدوية
// ==========================================
function openManualModal() {
  manualEnInput.value = '';
  manualArInput.value = '';
  manualModal.classList.remove('hidden');
  manualEnInput.focus();
}

manualAutoTranslateBtn.addEventListener('click', async () => {
  const en = manualEnInput.value.trim();
  if (!en) return;
  manualAutoTranslateBtn.disabled = true;
  manualAutoTranslateBtn.textContent = '...';
  manualArInput.value = await translateTextSingle(en);
  manualAutoTranslateBtn.disabled = false;
  manualAutoTranslateBtn.textContent = 'ترجم';
});

manualSaveBtn.addEventListener('click', () => {
  const ar = manualArInput.value.trim();
  if (!ar || !tempManualRect) return;

  const newBox = {
    id: `manual_${Date.now()}`,
    original: manualEnInput.value.trim() || 'نص يدوي',
    translated: ar,
    x: tempManualRect.x,
    y: tempManualRect.y,
    width: tempManualRect.w,
    height: tempManualRect.h,
    fontSize: Math.max(12, tempManualRect.h * 0.72),
    angle: 0,
    fontAdjust: 1,
    visible: true,
    manual: true,
  };

  boxes.push(newBox);
  tempManualRect = null;
  manualModal.classList.add('hidden');
  manualDrawMode = false;
  manualModeBtn.classList.remove('active');
  viewportEl.classList.remove('crosshair');

  selectBox(newBox.id, true);
  renderSidebarList();
  redrawOverlay();
});

manualCancelBtn.addEventListener('click', () => {
  tempManualRect = null;
  manualModal.classList.add('hidden');
  redrawOverlay();
});

// ==========================================
// 8. تصدير النتيجة (PNG و PDF)
// ==========================================
function buildMergedCanvas() {
  redrawOverlay(true); // رسم بدون حدود التحديد
  const merged = document.createElement('canvas');
  merged.width = pdfCanvas.width;
  merged.height = pdfCanvas.height;
  const ctx = merged.getContext('2d');
  ctx.drawImage(pdfCanvas, 0, 0);
  ctx.drawImage(overlayCanvas, 0, 0);
  redrawOverlay(false);
  return merged;
}

exportPngBtn.addEventListener('click', () => {
  const merged = buildMergedCanvas();
  const link = document.createElement('a');
  link.download = `${currentFileName}_AR_page${currentPageNum}.png`;
  link.href = merged.toDataURL('image/png');
  link.click();
});

exportPdfBtn.addEventListener('click', () => {
  showProgress('جاري تجهيز ملف الـ PDF العربي...', 70);
  setTimeout(() => {
    const merged = buildMergedCanvas();
    const imgData = merged.toDataURL('image/jpeg', 0.95);
    const { jsPDF } = window.jspdf;

    const orientation = merged.width >= merged.height ? 'l' : 'p';
    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [merged.width, merged.height],
      hotfixes: ['px_scaling'],
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, merged.width, merged.height);
    pdf.save(`${currentFileName}_AR_page${currentPageNum}.pdf`);
    hideProgress();
  }, 60);
});

// أدوات مساعدة
function showProgress(text, percent) {
  progressBarWrap.classList.remove('hidden');
  progressText.textContent = text;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
}

function hideProgress() {
  progressBarWrap.classList.add('hidden');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
