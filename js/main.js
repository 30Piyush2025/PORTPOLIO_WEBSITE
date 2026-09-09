import { CONFIG } from './config.js';
import { createAudioEngine } from './audio.js';
import { createArchive } from './archive-3d.js';

const $ = sel => document.querySelector(sel);
const arrowIcon = '<svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10"/></svg>';

const stamp = text => `<span class="stamp">${text}</span>`;

const makePage = (num, title, bodyHtml) => `
<article class="paper-page">
  <header class="paper-header">
    <span>${CONFIG.personal.fileCode} / ${title}</span>
    <span>PUBLIC RELEASE</span>
  </header>
  <div class="paper-body">
    ${bodyHtml.replaceAll('↗', arrowIcon)}
  </div>
  <footer class="paper-footer">
    <span>${CONFIG.personal.name.toUpperCase()} · ENGINEERING ARCHIVE</span>
    <span>${String(num).padStart(2, '0')}</span>
  </footer>
</article>`;

const makeTags = tags => `
<div class="paper-tags">
  ${tags.map(t => `<span>${t}</span>`).join('')}
</div>`;

const makeLogoLink = (name, logo, url) => `
<a class="employer-logo" href="${url}" target="_blank" rel="noreferrer" aria-label="Visit ${name}">
  <img src="${logo.startsWith('http') ? logo : new URL('../companies/' + logo.replace(/^\//, ''), import.meta.url).href}" alt="${name} logo" onerror="this.style.display='none'">
</a>`;

const makeEvidenceImage = proj => `
<button class="evidence-image" data-image="${proj.id}" aria-label="Enlarge ${proj.title} project image">
  <img src="${proj.imageSrc}" alt="${proj.imageAlt || proj.title}" width="${proj.imageWidth || 1536}" height="${proj.imageHeight || 1024}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'240\\' viewBox=\\'0 0 400 240\\'%3E%3Crect width=\\'400\\' height=\\'240\\' fill=\\'%23d6d1bd\\'/ %3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23555\\' font-family=\\'monospace\\' font-size=\\'16\\'%3E${proj.title} Preview%3C/text%3E%3C/svg%3E'">
  <span>${proj.imageCaption || 'PRODUCT PREVIEW / ENLARGE ↗'}</span>
</button>`;

const makeOperationPage = (proj, pageNum) => makePage(pageNum, `OPERATION ${proj.no}`, `
  <div class="paper-kicker">${proj.category}${proj.role ? ' / ' + proj.role.toUpperCase() : ''}</div>
  <h2>${proj.title}<span class="title-period">.</span></h2>
  <p class="paper-deck">${proj.subtitle}</p>
  ${makeEvidenceImage(proj)}
  <p>${proj.description}</p>
  ${makeTags(proj.stack)}
  <a class="paper-link" href="${proj.url}" target="_blank" rel="noreferrer">${proj.linkLabel || 'Visit project'} ↗</a>
`);

const makeBriefPage = (proj, pageNum) => makePage(pageNum, 'TECHNICAL BRIEF', `
  <div class="paper-kicker">CASE FILE ${proj.no} / ${proj.title.toUpperCase()}</div>
  <h2 class="detail-title">Inside the<br><em>operation.</em></h2>
  <h3>The problem</h3>
  <p>${proj.context}</p>
  <h3>${proj.roleLabel || 'My contribution'}</h3>
  <ul>
    ${proj.contributions.slice(0, 4).map(c => `<li>${c}</li>`).join('')}
  </ul>
  <div class="result-note">
    <span>OUTCOME</span>
    <p>${proj.outcome}</p>
  </div>
`);

// Build All Dossier Pages
const pages = [
  // Page 1: Personnel Record
  makePage(1, 'PERSONNEL RECORD', `
    <div class="paper-kicker">SUBJECT IDENTIFICATION</div>
    <h2>${CONFIG.personal.firstName}<br><em>${CONFIG.personal.lastName}.</em></h2>
    <div class="identity-grid">
      <div class="photo-mount">
        <img src="${CONFIG.personal.portraitUrl}" alt="Portrait of ${CONFIG.personal.name}" width="900" height="924" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'300\\' viewBox=\\'0 0 300 300\\'%3E%3Crect width=\\'300\\' height=\\'300\\' fill=\\'%23c2baa6\\'/ %3E%3Ccircle cx=\\'150\\' cy=\\'120\\' r=\\'50\\' fill=\\'%2387806e\\'/ %3E%3Cpath d=\\'M75,250 C75,190 225,190 225,250 Z\\' fill=\\'%2387806e\\'/ %3E%3Ctext x=\\'50%25\\' y=\\'280\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23333\\' font-family=\\'monospace\\' font-size=\\'12\\'%3ESUBJECT / ${CONFIG.personal.fileCode}%3C/text%3E%3C/svg%3E'">
        <span class="photo-corner tl"></span>
        <span class="photo-corner br"></span>
        <span class="photo-caption">SUBJECT / ${CONFIG.personal.fileCode}</span>
      </div>
      <div class="identity-fields">
        <span>DESIGNATION</span>
        <strong>${CONFIG.personal.role.replace(' ', '<br>')}</strong>
        <span>EXPERIENCE</span>
        <strong>${CONFIG.personal.experienceYears}</strong>
        <span>BASE OF OPERATIONS</span>
        <strong>${CONFIG.personal.baseOfOperations}</strong>
        <span>CURRENT ASSIGNMENT</span>
        <a href="${CONFIG.personal.currentAssignment.url}" target="_blank" rel="noreferrer">${CONFIG.personal.currentAssignment.name} ↗</a>
      </div>
    </div>
    <p class="handwritten">${CONFIG.personal.quoteHandwritten.replace('\n', '<br>')}</p>
    ${stamp('DECLASSIFIED')}
    <div class="barcode" aria-hidden="true"></div>
  `),

  // Page 2: Subject Assessment
  makePage(2, 'SUBJECT ASSESSMENT', `
    <div class="paper-kicker">THE PERSON BEHIND THE SYSTEMS</div>
    <h2>Curiosity.<br>Then <em>code.</em></h2>
    <p class="paper-lead">${CONFIG.personal.bioLead}</p>
    ${CONFIG.personal.bioFull.split('\n\n').map(p => `<p>${p}</p>`).join('')}
    <div class="assessment">
      <span>KNOWN FOR</span>
      <p>${CONFIG.personal.knownFor.replace('\n', '<br>')}</p>
    </div>
    <div class="margin-note">${CONFIG.personal.sideTitle}</div>
    <p>${CONFIG.personal.sideDescription}</p>
    <a class="paper-link" href="${CONFIG.personal.sideLink.url}" target="_blank" rel="noreferrer">${CONFIG.personal.sideLink.label} ↗</a>
  `),

  // Page 3: Service History
  makePage(3, 'SERVICE HISTORY', `
    <div class="paper-kicker">A RECORD OF BUILDING & SHIPPING</div>
    <h2>In the <em>field.</em></h2>
    ${CONFIG.serviceHistory.map(job => `
      <div class="service-item">
        ${job.logo ? makeLogoLink(job.company, job.logo, job.companyUrl) : ''}
        <span>${job.period}</span>
        <h3>${job.company} ${job.isCurrent ? '<small>CURRENT</small>' : ''}</h3>
        <p>${job.role}<br>${job.description}</p>
      </div>
    `).join('')}
  `),

  // Page 4: Technical Capabilities
  makePage(4, 'TECHNICAL CAPABILITIES', `
    <div class="paper-kicker">TOOLS OF THE TRADE</div>
    <h2>The <em>toolkit.</em></h2>
    ${CONFIG.skills.map(skill => `
      <div class="skill-row">
        <span>${skill.num} / ${skill.category}</span>
        <h3>${skill.title}</h3>
        <p>${skill.items}</p>
      </div>
    `).join('')}
    <div class="academic">
      <span>ACADEMIC RECORD</span>
      <h3>${CONFIG.academicRecord.degree}</h3>
      <p>${CONFIG.academicRecord.institution} · ${CONFIG.academicRecord.period}<br>${CONFIG.academicRecord.honors}</p>
    </div>
    ${stamp('FIELD TESTED')}
  `),

  // Project pages (Pairs of Operation + Brief)
  ...CONFIG.projects.slice(0, 4).flatMap((p, idx) => [
    makeOperationPage(p, 5 + idx * 2),
    makeBriefPage(p, 6 + idx * 2)
  ]),

  // Page 13: Production Engineering
  makePage(13, 'PRODUCTION ENGINEERING', `
    <div class="production-brief">
      <div class="paper-kicker">BEYOND THE DEMO</div>
      <h2>Built for<br><em>production.</em></h2>
      <p class="paper-lead">From architecture to deployment.<br>Ownership beyond the launch.</p>
      ${CONFIG.productionEngineering.map(sec => `
        <div class="skill-row">
          <span>${sec.num} / ${sec.category}</span>
          <h3>${sec.title}</h3>
          <p>${sec.description.replace('\\n', '<br>')}</p>
        </div>
      `).join('')}
    </div>
  `),

  // Page 14: Communications / Contact
  makePage(14, 'COMMUNICATIONS', `
    <div class="paper-kicker">END OF FILE / BEGINNING OF SOMETHING</div>
    <h2>Your next<br><em>operation?</em></h2>
    <p class="paper-lead">${CONFIG.personal.contactCallout.replace('\\n', '<br>')}</p>
    <p>${CONFIG.personal.contactPitch}</p>
    <a class="contact-email" href="mailto:${CONFIG.personal.email}">
      <span>DIRECT CHANNEL</span>${CONFIG.personal.email.split('@')[0]}<br>@${CONFIG.personal.email.split('@')[1]} <i>↗</i>
    </a>
    <div class="contact-networks">
      <a class="contact-social" href="${CONFIG.personal.linkedin}" target="_blank" rel="noreferrer">
        <span>PROFESSIONAL NETWORK</span>LinkedIn ↗
      </a>
      <a class="contact-social" href="${CONFIG.personal.github}" target="_blank" rel="noreferrer">
        <span>CODE & OPEN SOURCE</span>GitHub ↗
      </a>
    </div>
    <div class="closing-signature">${CONFIG.personal.signature}</div>
    ${stamp('CHANNEL OPEN')}
  `)
];

// App State
let archive = null;
let currentState = 'entrance';
let isLocked = false;
let pageIndex = 0;
let reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let soundEnabled = true;

const audio = createAudioEngine();
const pageSize = () => (window.innerWidth < 700 ? 1 : 2);

// Synchronize Header HUD & Intro from CONFIG
function syncConfigToDOM() {
  document.title = `${CONFIG.personal.name} — ${CONFIG.personal.role} | Archive Dossier`;
  if ($('#hud-sigil')) $('#hud-sigil').innerHTML = `${CONFIG.personal.sigil.first}<span>${CONFIG.personal.sigil.second}</span>`;
  if ($('#hud-name')) $('#hud-name').textContent = CONFIG.personal.name.toUpperCase();
  if ($('#hud-sub')) $('#hud-sub').textContent = 'INDEPENDENT ENGINEERING ARCHIVE';
  if ($('#intro-dept')) $('#intro-dept').innerHTML = `<span class="tiny-cross">+</span> ${CONFIG.personal.department || 'DEPARTMENT OF THOUGHTFUL SYSTEMS'}`;

  const roleWords = CONFIG.personal.role.split(' ');
  const lastWord = roleWords.pop();
  const restWords = roleWords.join(' ');
  if ($('#intro-title')) $('#intro-title').innerHTML = `${CONFIG.personal.name} <span>${restWords} <br><em>${lastWord}.</em></span>`;
  if ($('#intro-desc')) $('#intro-desc').innerHTML = CONFIG.personal.heroIntro.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
  if ($('#intro-fileno')) $('#intro-fileno').textContent = CONFIG.personal.fileNo;
  if ($('#intro-rolesub')) $('#intro-rolesub').textContent = CONFIG.personal.roleSub;
  if ($('#bar-coords')) $('#bar-coords').innerHTML = `${CONFIG.personal.coordinates} <span>${CONFIG.personal.country}</span>`;
  if ($('#load-mark')) $('#load-mark').textContent = CONFIG.personal.initials;
  if ($('#dialog-index-fileno')) $('#dialog-index-fileno').textContent = `${CONFIG.personal.fileCode} / DIRECTORY`;
  if ($('#reader-intro-text')) $('#reader-intro-text').textContent = `${CONFIG.personal.name} · ${CONFIG.personal.role} · ${CONFIG.personal.experienceYears} of experience`;
}
syncConfigToDOM();

// Populate Menus and Dialogs
$('#index-list').innerHTML = CONFIG.chapters.map((ch, idx) => `
  <button data-chapter="${idx}" aria-label="Open chapter ${idx + 1}: ${ch}">
    <span>${String(idx + 1).padStart(2, '0')}</span>
    <strong>${ch}</strong>
    <span>${arrowIcon}</span>
  </button>
`).join('');

$('#chapter-rail').innerHTML = CONFIG.chapters.map((ch, idx) => `
  <button data-chapter="${idx}" aria-label="Open chapter ${idx + 1}: ${ch}" title="${ch}">
    <span>${String(idx + 1).padStart(2, '0')}</span>
    ${ch}
  </button>
`).join('');

$('#reader-content').innerHTML = pages.join('');

// Dialog Handlers
const dialogs = [...document.querySelectorAll('dialog')];
const activeFocusMap = new WeakMap();

function openDialog(dialog) {
  activeFocusMap.set(dialog, document.activeElement);
  dialog.showModal();
  dialog.scrollTop = 0;
}

dialogs.forEach(diag => {
  diag.querySelector('.close-dialog')?.addEventListener('click', () => diag.close());
  diag.addEventListener('close', () => activeFocusMap.get(diag)?.focus());
  diag.addEventListener('click', e => {
    if (e.target === diag) {
      const rect = diag.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        diag.close();
      }
    }
  });
});

$('#index-button').addEventListener('click', () => openDialog($('#index-dialog')));

function openReaderView() {
  if ($('#index-dialog').open) $('#index-dialog').close();
  openDialog($('#reader'));
}

$('#read-button').addEventListener('click', openReaderView);
$('#accessible-read').addEventListener('click', openReaderView);
$('#print').addEventListener('click', () => window.print());

// Lightbox for Evidence Images
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-image]');
  if (!btn) return;
  const proj = CONFIG.projects.find(p => p.id === btn.dataset.image);
  if (!proj) return;
  $('#enlarged-image').src = proj.imageSrc;
  $('#enlarged-image').alt = proj.imageAlt || proj.title;
  $('#image-note').textContent = proj.imageNote || proj.title;
  $('#image-source').hidden = !proj.url;
  $('#image-source').href = proj.url || '#';
  openDialog($('#image-dialog'));
});

// Sound helpers
function playSound(type = 'paper', duration) {
  if (soundEnabled) {
    try {
      audio.play(type, duration);
    } catch {
      soundEnabled = false;
      audio.setEnabled(false);
      syncSoundUI();
    }
  }
}

function syncSoundUI() {
  $('#sound').setAttribute('aria-pressed', String(soundEnabled));
  $('#sound').setAttribute('aria-label', soundEnabled ? 'Disable sound' : 'Enable sound');
  $('#sound span').textContent = soundEnabled ? 'ON' : 'OFF';
}

function unlockAudio() {
  if (soundEnabled) {
    try {
      audio.unlock();
    } catch {
      soundEnabled = false;
      syncSoundUI();
    }
  }
}

document.addEventListener('pointerdown', unlockAudio, { capture: true });
document.addEventListener('keydown', unlockAudio, { capture: true });

$('#sound').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  try {
    audio.setEnabled(soundEnabled);
  } catch {
    soundEnabled = false;
  }
  syncSoundUI();
});
syncSoundUI();

// Motion Helpers
function syncMotionUI() {
  $('#motion span').textContent = reducedMotion ? 'REDUCED' : 'ON';
  $('#motion').setAttribute('aria-pressed', String(reducedMotion));
  $('#motion').setAttribute('aria-label', reducedMotion ? 'Enable full motion' : 'Reduce motion');
  archive?.setMotion(reducedMotion);
}

$('#motion').addEventListener('click', () => {
  reducedMotion = !reducedMotion;
  syncMotionUI();
});
syncMotionUI();

// Pager and Chapter Rail Updates
function syncPageUI() {
  archive?.setPages(pages[pageIndex], pages[pageIndex + 1]);

  const step = pageSize();
  if (step === 1) {
    $('#page-count').textContent = `${String(pageIndex + 1).padStart(2, '0')} / ${pages.length}`;
  } else {
    $('#page-count').textContent = `${String(pageIndex + 1).padStart(2, '0')} — ${String(Math.min(pageIndex + 2, pages.length)).padStart(2, '0')} / ${pages.length}`;
  }

  $('#previous').disabled = pageIndex === 0 || isLocked;
  $('#next').disabled = pageIndex + step >= pages.length || isLocked;

  document.querySelectorAll('#chapter-rail button').forEach((btn, idx) => {
    const isCur = idx === Math.floor(pageIndex / 2);
    btn.classList.toggle('active', isCur);
    btn.setAttribute('aria-current', isCur ? 'page' : 'false');
  });
}

function syncOverallUI() {
  const isReading = currentState === 'reading';
  document.body.classList.toggle('reading', isReading);
  $('#intro').classList.toggle('out', currentState !== 'entrance');
  $('#intro').inert = currentState !== 'entrance';
  $('#annotation').hidden = currentState !== 'entrance';
  $('#room-label').hidden = isReading;
  $('#object-prompt').hidden = !['rack', 'desk'].includes(currentState);
  $('#book-tools').hidden = !isReading;
  $('#chapter-rail').hidden = !isReading;

  $('#enter').disabled = isLocked;
  $('#object-action').disabled = isLocked;
  $('#return').disabled = isLocked;
  $('#home').disabled = isLocked;

  if (currentState === 'rack') {
    $('#prompt-kicker').textContent = `PERSONNEL RECORD / ${CONFIG.personal.fileCode}`;
    $('#prompt-title').textContent = 'You found the file.';
    $('#prompt-copy').textContent = 'One engineer. A few interesting operations.';
    $('#action-label').textContent = 'TAKE THE DOSSIER';
  } else if (currentState === 'desk') {
    $('#prompt-kicker').textContent = 'CLEARED FOR PUBLIC ACCESS';
    $('#prompt-title').textContent = 'A closer look.';
    $('#prompt-copy').textContent = 'Go on. Open it. The work speaks for itself.';
    $('#action-label').textContent = 'OPEN THE FILE';
  }

  if (isLocked) {
    $('#status-text').textContent = 'RETRIEVING RECORD…';
  } else if (isReading) {
    const chapName = CONFIG.chapters[Math.floor(pageIndex / 2)] || 'ARCHIVE';
    $('#status-text').textContent = `DOSSIER OPEN / ${chapName.toUpperCase()}`;
  } else if (currentState === 'rack') {
    $('#status-text').textContent = `SUBJECT FOUND / ${CONFIG.personal.name.toUpperCase()}`;
  } else if (currentState === 'desk') {
    $('#status-text').textContent = `CLEARANCE GRANTED / FILE ${CONFIG.personal.fileCode}`;
  } else {
    $('#status-text').textContent = 'ARCHIVE ONLINE / AWAITING YOUR CURIOSITY';
  }

  $('#interaction-hint').textContent = isReading ? '← → TURN PAGES · SWIPE OR USE THE TABS' : 'CLICK TO EXPLORE · DRAG TO LOOK';
  syncPageUI();
}

// Navigation Transitions
async function advanceState() {
  if (isLocked) return;
  if (!archive) {
    openReaderView();
    return;
  }
  const nextTarget = currentState === 'entrance' ? 'rack' : (currentState === 'rack' ? 'desk' : (currentState === 'desk' ? 'reading' : null));
  if (nextTarget) {
    isLocked = true;
    $('#intro').hidden = true;
    $('#object-prompt').hidden = true;
    $('#enter').disabled = true;
    $('#status-text').textContent = 'RETRIEVING RECORD…';
    try {
      await archive.go(nextTarget);
      currentState = nextTarget;
    } catch (err) {
      handleArchiveError(err);
    } finally {
      isLocked = false;
      syncOverallUI();
      if (currentState === 'reading') {
        $('#next').focus({ preventScroll: true });
      }
    }
  }
}

$('#enter').addEventListener('click', advanceState);
$('#object-action').addEventListener('click', advanceState);

async function returnHome() {
  if (isLocked || currentState === 'entrance') return;
  isLocked = true;
  $('#book-tools').hidden = true;
  $('#chapter-rail').hidden = true;
  $('#object-prompt').hidden = true;
  $('#status-text').textContent = 'RETURNING RECORD TO THE ARCHIVE…';

  try {
    await archive.go('entrance');
    currentState = 'entrance';
    pageIndex = 0;
  } catch (err) {
    handleArchiveError(err);
  } finally {
    isLocked = false;
    $('#intro').hidden = false;
    syncOverallUI();
    $('#enter').focus({ preventScroll: true });
  }
}

$('#return').addEventListener('click', returnHome);
$('#home').addEventListener('click', returnHome);

async function flipToPage(destIndex) {
  if (isLocked || currentState !== 'reading' || destIndex < 0 || destIndex >= pages.length || destIndex === pageIndex) return;
  isLocked = true;
  syncPageUI();
  playSound('paper');
  const prevIdx = pageIndex;
  try {
    const success = await archive.turn(pages[destIndex], pages[destIndex + 1], destIndex > prevIdx ? 1 : -1);
    if (success) pageIndex = destIndex;
  } finally {
    isLocked = false;
    if (pageSize() === 2) {
      pageIndex = Math.floor(pageIndex / 2) * 2;
    }
    syncOverallUI();
  }
}

$('#next').addEventListener('click', () => flipToPage(pageIndex + pageSize()));
$('#previous').addEventListener('click', () => flipToPage(pageIndex - pageSize()));

// Chapter Rail and Index Clicks
document.addEventListener('click', async e => {
  const btn = e.target.closest('[data-chapter]');
  if (!btn || isLocked) return;
  const targetPageIndex = Number(btn.dataset.chapter) * 2;

  if ($('#index-dialog').open) $('#index-dialog').close();

  if (!archive) {
    openReaderView();
    $('#reader-content').children[targetPageIndex]?.scrollIntoView({ block: 'start' });
    return;
  }

  while (currentState !== 'reading' && archive) {
    await advanceState();
  }
  await flipToPage(targetPageIndex);
});

// Keyboard controls
document.addEventListener('keydown', e => {
  if (dialogs.some(d => d.open) || isLocked) return;
  if (currentState === 'reading') {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      flipToPage(pageIndex + pageSize());
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      flipToPage(pageIndex - pageSize());
    } else if (e.key === 'Escape') {
      returnHome();
    }
  }
});

// Touch Swipes
let touchStart = null;
$('#paper-world').addEventListener('pointerdown', e => {
  if (e.pointerType === 'touch') {
    touchStart = { x: e.clientX, y: e.clientY };
  }
});

$('#paper-world').addEventListener('pointerup', e => {
  if (touchStart) {
    const dx = e.clientX - touchStart.x;
    const dy = e.clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      flipToPage(pageIndex + (dx < 0 ? pageSize() : -pageSize()));
    }
    touchStart = null;
  }
});

// Mouse Wheel Scroll Page Turning
let wheelAccum = 0;
let lastWheelTurn = 0;
window.addEventListener('wheel', e => {
  if (currentState !== 'reading' || isLocked || dialogs.some(d => d.open) || e.ctrlKey) return;
  const now = performance.now();
  if (now - lastWheelTurn < 1300) return;
  wheelAccum += e.deltaY;
  if (Math.abs(wheelAccum) > 80) {
    flipToPage(pageIndex + (wheelAccum > 0 ? pageSize() : -pageSize()));
    lastWheelTurn = now;
    wheelAccum = 0;
  }
}, { passive: true });

// Resize handling
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!isLocked) {
      if (pageSize() === 2) {
        pageIndex = Math.floor(pageIndex / 2) * 2;
      }
      syncPageUI();
    }
  }, 180);
});

function handleArchiveError(err) {
  console.warn('3D Archive fallback to reading view:', err);
  archive = null;
  isLocked = false;
  currentState = 'entrance';
  $('#loading').classList.add('complete');
  $('#status-text').textContent = '3D UNAVAILABLE / READING VIEW READY';
  $('#enter > span:first-child').textContent = 'READ THE DOSSIER';
  $('#enter').disabled = false;
  $('#object-prompt').hidden = true;
  $('#book-tools').hidden = true;
  $('#chapter-rail').hidden = true;
  $('#intro').hidden = false;
  $('#intro').classList.remove('out');
  $('#intro').inert = false;
  document.body.classList.remove('reading');
  $('#paper-world').style.display = 'none';
}

syncOverallUI();
$('#enter').disabled = true;

// Initialize 3D Archive
try {
  archive = await createArchive({
    onAction: advanceState,
    onReady: () => {
      $('#loading').classList.add('complete');
    },
    onError: handleArchiveError,
    onSound: playSound
  });
  syncMotionUI();
  syncOverallUI();
} catch (err) {
  handleArchiveError(err);
}
