/* ══════════════════════════════════════════
   js/skills.js
   Renders + filters the skills matrix.
══════════════════════════════════════════ */

const Skills = (() => {

    const labelClass = {
      expert:       'label-expert',
      advanced:     'label-advanced',
      intermediate: 'label-intermediate',
      beginner:     'label-beginner',
    };
  
    function render(filter = 'all') {
      const grid = document.getElementById('skills-grid');
      if (!grid) return;
  
      const filtered = filter === 'all'
        ? CONFIG.skills
        : CONFIG.skills.filter(s => s.cat === filter);
  
      grid.innerHTML = filtered.map(s => `
        <div class="skill-item" role="listitem">
          <div class="skill-top">
            <span class="skill-name">${s.name}</span>
            <span class="skill-pct">${s.pct}%</span>
          </div>
          <div class="skill-bar-bg"
               role="progressbar"
               aria-valuenow="${s.pct}"
               aria-valuemin="0"
               aria-valuemax="100"
               aria-label="${s.name} proficiency">
            <div class="skill-bar" style="width:${s.pct}%"></div>
          </div>
          <div class="skill-meta">
            <span class="skill-cat">${s.cat.toUpperCase()}</span>
            <span class="skill-label ${labelClass[s.label] || ''}">${s.label}</span>
          </div>
        </div>
      `).join('');
    }
  
    function initFilters() {
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          render(btn.dataset.filter);
        });
      });
    }
  
    return { render, initFilters };
  })();