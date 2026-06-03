/* ══════════════════════════════════════════
   js/projects.js
   Renders project cards from CONFIG.projects.
══════════════════════════════════════════ */

const Projects = (() => {

    function render() {
      const grid = document.getElementById('projects-grid');
      if (!grid) return;
  
      grid.innerHTML = CONFIG.projects.map(p => {
        const links = [
          p.sourceUrl  ? `<a href="${p.sourceUrl}"  target="_blank" rel="noopener" class="proj-link"><i class="ti ti-brand-github" aria-hidden="true"></i>source</a>`    : '',
          p.liveUrl    ? `<a href="${p.liveUrl}"    target="_blank" rel="noopener" class="proj-link"><i class="ti ti-external-link" aria-hidden="true"></i>live demo</a>` : '',
          p.writeupUrl ? `<a href="${p.writeupUrl}" target="_blank" rel="noopener" class="proj-link"><i class="ti ti-file-text"     aria-hidden="true"></i>writeup</a>`   : '',
        ].filter(Boolean).join('');
  
        return `
          <article class="project-card${p.pinned ? ' pinned' : ''}" data-repo="${p.repoSlug || ''}">
            <div class="proj-top">
              <div class="proj-name-row">
                ${p.pinned ? '<span class="pinned-badge">PINNED</span>' : ''}
                <div class="proj-name">
                  <a href="${p.sourceUrl || '#'}" target="_blank" rel="noopener">${p.name}</a>
                </div>
              </div>
              <div class="uptime-badge ${p.status}" aria-label="Status: ${p.statusLabel}">
                <div class="uptime-dot" aria-hidden="true"></div>
                ${p.statusLabel}
              </div>
            </div>
  
            <p class="proj-desc">${p.description}</p>
  
            <div class="proj-meta">
              <div class="proj-lang">
                <div class="lang-dot" style="background:${p.langColor}" aria-hidden="true"></div>
                ${p.language}
              </div>
              <span class="proj-stat" aria-label="Stars">
                <i class="ti ti-star" aria-hidden="true"></i>
                <span class="proj-stars">—</span>
              </span>
              <span class="proj-stat" aria-label="Forks">
                <i class="ti ti-git-fork" aria-hidden="true"></i>
                <span class="proj-forks">—</span>
              </span>
            </div>
  
            <div class="proj-links">${links}</div>
          </article>
        `;
      }).join('');
    }
  
    return { render };
  })();