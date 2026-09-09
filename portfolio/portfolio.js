import { CONFIG } from '../js/config.js';

const arrowIcon = '<svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10"/></svg>';

document.getElementById('header-initials').textContent = CONFIG.personal.initials;
document.getElementById('header-name').textContent = CONFIG.personal.name.toUpperCase();
document.getElementById('hero-eyebrow').textContent = `${CONFIG.personal.fileCode} / THE COMPLETE PORTFOLIO`;
document.getElementById('portfolio-title').innerHTML = `${CONFIG.personal.name} <span>${CONFIG.personal.role}</span>`;
document.getElementById('hero-summary').innerHTML = `${CONFIG.personal.bioShort.replace('\n', '<br>')}`;
document.getElementById('hero-contact-link').href = `mailto:${CONFIG.personal.email}`;
document.getElementById('footer-tagline').textContent = `${CONFIG.personal.name.toUpperCase()} / ENGINEERING ARCHIVE`;

const container = document.getElementById('dossier-pages');

let html = `
<article class="paper-page" id="profile" aria-labelledby="profile-title">
  <div class="paper-body">
    <div class="paper-kicker">SUBJECT IDENTIFICATION</div>
    <h2 id="profile-title">Profile</h2>
    <div class="identity-grid">
      <div class="photo-mount">
        <img loading="lazy" src="${CONFIG.personal.portraitUrl}" alt="Portrait of ${CONFIG.personal.name}" width="900" height="924" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'300\\' viewBox=\\'0 0 300 300\\'%3E%3Crect width=\\'300\\' height=\\'300\\' fill=\\'%23c2baa6\\'/ %3E%3Ccircle cx=\\'150\\' cy=\\'120\\' r=\\'50\\' fill=\\'%2387806e\\'/ %3E%3Cpath d=\\'M75,250 C75,190 225,190 225,250 Z\\' fill=\\'%2387806e\\'/ %3E%3Ctext x=\\'50%25\\' y=\\'280\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23333\\' font-family=\\'monospace\\' font-size=\\'12\\'%3ESUBJECT / ${CONFIG.personal.fileCode}%3C/text%3E%3C/svg%3E'">
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
        <a href="${CONFIG.personal.currentAssignment.url}" target="_blank" rel="noreferrer">${CONFIG.personal.currentAssignment.name} ${arrowIcon}</a>
      </div>
    </div>
    <p class="handwritten">${CONFIG.personal.quoteHandwritten.replace('\n', '<br>')}</p>
    <span class="stamp">DECLASSIFIED</span>
    <div class="barcode" aria-hidden="true"></div>
  </div>
</article>

<article class="paper-page" id="about" aria-labelledby="about-title">
  <div class="paper-body">
    <div class="paper-kicker">THE PERSON BEHIND THE SYSTEMS</div>
    <h2 id="about-title">About ${CONFIG.personal.firstName}</h2>
    <p class="paper-lead">${CONFIG.personal.bioLead}</p>
    ${CONFIG.personal.bioFull.split('\n\n').map(p => `<p>${p}</p>`).join('')}
    <div class="assessment">
      <span>KNOWN FOR</span>
      <p>${CONFIG.personal.knownFor.replace('\n', '<br>')}</p>
    </div>
    <div class="margin-note">${CONFIG.personal.sideTitle}</div>
    <p>${CONFIG.personal.sideDescription}</p>
    <a class="paper-link" href="${CONFIG.personal.sideLink.url}" target="_blank" rel="noreferrer">${CONFIG.personal.sideLink.label} ${arrowIcon}</a>
  </div>
</article>

<article class="paper-page" id="experience" aria-labelledby="experience-title">
  <div class="paper-body">
    <div class="paper-kicker">A RECORD OF BUILDING & SHIPPING</div>
    <h2 id="experience-title">Experience</h2>
    ${CONFIG.serviceHistory.map(job => `
      <div class="service-item">
        ${job.logo ? `<a class="employer-logo" href="${job.companyUrl}" target="_blank" rel="noreferrer" aria-label="Visit ${job.company}"><img loading="lazy" src="${job.logo.startsWith('http') ? job.logo : new URL('../companies/' + job.logo.replace(/^\//, ''), import.meta.url).href}" alt="${job.company} logo" onerror="this.style.display='none'"></a>` : ''}
        <span>${job.period}</span>
        <h3>${job.company} ${job.isCurrent ? '<small>CURRENT</small>' : ''}</h3>
        <p>${job.role}<br>${job.description}</p>
      </div>
    `).join('')}
  </div>
</article>

<article class="paper-page" id="skills" aria-labelledby="skills-title">
  <div class="paper-body">
    <div class="paper-kicker">TOOLS OF THE TRADE</div>
    <h2 id="skills-title">Skills & education</h2>
    ${CONFIG.skills.map(s => `
      <div class="skill-row">
        <span>${s.num} / ${s.category}</span>
        <h3>${s.title}</h3>
        <p>${s.items}</p>
      </div>
    `).join('')}
    <div class="academic">
      <span>ACADEMIC RECORD</span>
      <h3>${CONFIG.academicRecord.degree}</h3>
      <p>${CONFIG.academicRecord.institution} · ${CONFIG.academicRecord.period}<br>${CONFIG.academicRecord.honors}</p>
    </div>
    <span class="stamp">FIELD TESTED</span>
  </div>
</article>
`;

CONFIG.projects.forEach(p => {
  html += `
  <article class="paper-page" id="${p.id}" aria-labelledby="${p.id}-title">
    <div class="paper-body">
      <div class="paper-kicker">${p.category}${p.role ? ' / ' + p.role.toUpperCase() : ''}</div>
      <h2 id="${p.id}-title">${p.title}</h2>
      <p class="paper-deck">${p.subtitle}</p>
      <a class="evidence-image" href="${p.imageSrc}">
        <img loading="lazy" src="${p.imageSrc}" alt="${p.imageAlt || p.title}" width="${p.imageWidth || 1536}" height="${p.imageHeight || 1024}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'240\\' viewBox=\\'0 0 400 240\\'%3E%3Crect width=\\'400\\' height=\\'240\\' fill=\\'%23d6d1bd\\'/ %3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23555\\' font-family=\\'monospace\\' font-size=\\'16\\'%3E${p.title} Preview%3C/text%3E%3C/svg%3E'">
        <span>${p.imageCaption || 'PRODUCT SCREENSHOT / ENLARGE'} ${arrowIcon}</span>
      </a>
      <p>${p.description}</p>
      <div class="paper-tags">
        ${p.stack.map(tag => `<span>${tag}</span>`).join('')}
      </div>
      <a class="paper-link" href="${p.url}" target="_blank" rel="noreferrer">${p.linkLabel || 'Explore project'} ${arrowIcon}</a>
    </div>
  </article>

  <article class="paper-page" id="${p.id}-contributions" aria-labelledby="${p.id}-contributions-title">
    <div class="paper-body">
      <div class="paper-kicker">CASE FILE ${p.no} / ${p.title.toUpperCase()}</div>
      <h2 id="${p.id}-contributions-title">Building ${p.title}</h2>
      <h3>The problem</h3>
      <p>${p.context}</p>
      <h3>${p.roleLabel || 'My contribution'}</h3>
      <ul>
        ${p.contributions.map(c => `<li>${c}</li>`).join('')}
      </ul>
      <div class="result-note">
        <span>OUTCOME</span>
        <p>${p.outcome}</p>
      </div>
    </div>
  </article>
  `;
});

html += `
<article class="paper-page" id="production" aria-labelledby="production-title">
  <div class="paper-body">
    <div class="production-brief">
      <div class="paper-kicker">BEYOND THE DEMO</div>
      <h2 id="production-title">Production engineering</h2>
      <p class="paper-lead">From architecture to deployment.<br>Ownership beyond the launch.</p>
      ${CONFIG.productionEngineering.map(sec => `
        <div class="skill-row">
          <span>${sec.num} / ${sec.category}</span>
          <h3>${sec.title}</h3>
          <p>${sec.description.replace('\\n', '<br>')}</p>
        </div>
      `).join('')}
    </div>
  </div>
</article>

<article class="paper-page" id="contact" aria-labelledby="contact-title">
  <div class="paper-body">
    <div class="paper-kicker">END OF FILE / BEGINNING OF SOMETHING</div>
    <h2 id="contact-title">Contact ${CONFIG.personal.firstName}</h2>
    <p class="paper-lead">${CONFIG.personal.contactCallout.replace('\\n', '<br>')}</p>
    <p>${CONFIG.personal.contactPitch}</p>
    <a class="contact-email" href="mailto:${CONFIG.personal.email}">
      <span>DIRECT CHANNEL</span>${CONFIG.personal.email.split('@')[0]}<br>@${CONFIG.personal.email.split('@')[1]} <i>${arrowIcon}</i>
    </a>
    <div class="contact-networks">
      <a class="contact-social" href="${CONFIG.personal.linkedin}" target="_blank" rel="noreferrer">
        <span>PROFESSIONAL NETWORK</span>LinkedIn ${arrowIcon}
      </a>
      <a class="contact-social" href="${CONFIG.personal.github}" target="_blank" rel="noreferrer">
        <span>CODE & OPEN SOURCE</span>GitHub ${arrowIcon}
      </a>
    </div>
    <div class="closing-signature">${CONFIG.personal.signature}</div>
    <span class="stamp">CHANNEL OPEN</span>
  </div>
</article>
`;

container.innerHTML = html;
