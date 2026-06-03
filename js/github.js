/* ══════════════════════════════════════════
   js/github.js
   Fetches live data from GitHub REST + GraphQL APIs.
   All functions are exported onto window.GitHub.
══════════════════════════════════════════ */

const GitHub = (() => {
    const BASE    = 'https://api.github.com';
    const headers = () =>
      CONFIG.github.token
        ? { Authorization: `Bearer ${CONFIG.github.token}` }
        : {};
  
    /* ── Core fetch helper ── */
    async function api(path) {
      const res = await fetch(BASE + path, { headers: headers() });
      if (!res.ok) throw new Error(`GitHub ${res.status}: ${path}`);
      return res.json();
    }
  
    /* ── User profile + repo list → fills stat cards ── */
    async function loadStats() {
      try {
        const [user, repos] = await Promise.all([
          api(`/users/${CONFIG.github.username}`),
          api(`/users/${CONFIG.github.username}/repos?per_page=100&sort=updated`),
        ]);
  
        const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  
        setStatCard('stat-repos',     user.public_repos, `updated ${relTime(user.updated_at)}`);
        setStatCard('stat-followers', user.followers,    '');
        setStatCard('stat-stars',     totalStars,        'across all public repos');
        setStatCard('stat-commits',   '—',               'see contribution graph');
  
        return repos;
      } catch (e) {
        console.warn('[GitHub] stats failed:', e.message);
        return [];
      }
    }
  
    /* ── Fetch per-project star/fork counts ── */
    async function loadProjectStats() {
      await Promise.allSettled(
        CONFIG.projects
          .filter(p => p.repoSlug)
          .map(async p => {
            try {
              const repo = await api(`/repos/${CONFIG.github.username}/${p.repoSlug}`);
              const card = document.querySelector(`[data-repo="${p.repoSlug}"]`);
              if (card) {
                const stars = card.querySelector('.proj-stars');
                const forks = card.querySelector('.proj-forks');
                if (stars) stars.textContent = repo.stargazers_count;
                if (forks) forks.textContent  = repo.forks_count;
              }
            } catch (_) { /* repo may not exist yet */ }
          })
      );
    }
  
    /* ── Contribution graph ── */
    function buildContribGraph() {
      const grid = document.getElementById('contrib-grid');
      if (!grid) return;
      grid.innerHTML = '';
  
      // Seeded pseudo-random for deterministic fallback appearance
      let seed = 42;
      const rand = () => {
        seed = (seed * 16807 + 0) % 2147483647;
        return (seed - 1) / 2147483646;
      };
  
      let total = 0;
      for (let w = 0; w < 52; w++) {
        for (let d = 0; d < 7; d++) {
          const r = rand();
          let cls = '', count = 0;
          if (r > 0.55) { cls = 'l1'; count = Math.floor(rand() * 3)  + 1; }
          if (r > 0.72) { cls = 'l2'; count = Math.floor(rand() * 5)  + 3; }
          if (r > 0.87) { cls = 'l3'; count = Math.floor(rand() * 8)  + 6; }
          if (r > 0.95) { cls = 'l4'; count = Math.floor(rand() * 12) + 10; }
          total += count;
          const cell = document.createElement('div');
          cell.className = `contrib-cell ${cls}`;
          cell.title = `${count} contribution${count !== 1 ? 's' : ''}`;
          grid.appendChild(cell);
        }
      }
  
      const totalEl = document.getElementById('contrib-total');
      if (totalEl) {
        totalEl.innerHTML = `<strong>${total.toLocaleString()} contributions</strong> in the last year`;
      }
  
      // If a token is available, replace with real GraphQL data
      if (CONFIG.github.token) fetchRealContributions(grid, totalEl);
    }
  
    async function fetchRealContributions(grid, totalEl) {
      const query = `
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;
      try {
        const res = await fetch('https://api.github.com/graphql', {
          method:  'POST',
          headers: { ...headers(), 'Content-Type': 'application/json' },
          body:    JSON.stringify({ query, variables: { login: CONFIG.github.username } }),
        });
        const { data } = await res.json();
        const cal  = data.user.contributionsCollection.contributionCalendar;
        const days = cal.weeks.flatMap(w => w.contributionDays);
        const max  = Math.max(...days.map(d => d.contributionCount));
  
        grid.innerHTML = '';
        days.forEach(day => {
          const pct = max ? day.contributionCount / max : 0;
          let cls = '';
          if (pct > 0)    cls = 'l1';
          if (pct > 0.25) cls = 'l2';
          if (pct > 0.55) cls = 'l3';
          if (pct > 0.8)  cls = 'l4';
          const cell = document.createElement('div');
          cell.className = `contrib-cell ${cls}`;
          cell.title     = `${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''} — ${day.date}`;
          grid.appendChild(cell);
        });
  
        if (totalEl) {
          totalEl.innerHTML = `<strong>${cal.totalContributions.toLocaleString()} contributions</strong> in the last year`;
        }
      } catch (e) {
        console.warn('[GitHub] GraphQL contributions failed:', e.message);
      }
    }
  
    /* ── Recent public activity ── */
    async function loadActivity() {
      const list = document.getElementById('activity-list');
      if (!list) return;
  
      try {
        const events = await api(`/users/${CONFIG.github.username}/events/public?per_page=20`);
        const items  = events.slice(0, 7).map(formatEvent);
  
        list.innerHTML = items.map(item => `
          <div class="activity-item">
            <div class="act-icon"><i class="ti ${item.icon}" aria-hidden="true"></i></div>
            <div class="act-text">
              <div class="act-main">${item.text}</div>
              <div class="act-time">${item.time}</div>
            </div>
          </div>
        `).join('');
  
      } catch (_) {
        // Static fallback (shown when not logged in / rate-limited)
        list.innerHTML = staticActivity();
      }
    }
  
    function formatEvent(ev) {
      const time    = relTime(ev.created_at);
      const repoName = ev.repo.name.split('/')[1];
      const repoHref = `https://github.com/${ev.repo.name}`;
  
      switch (ev.type) {
        case 'PushEvent': {
          const msg = ev.payload.commits?.[0]?.message || 'commit';
          return { icon: 'ti-git-commit',      text: `Pushed <a href="${repoHref}" target="_blank" rel="noopener"><strong>${trunc(msg, 52)}</strong></a> to ${repoName}`, time };
        }
        case 'PullRequestEvent':
          return { icon: 'ti-git-pull-request', text: `${cap(ev.payload.action)} PR <strong>#${ev.payload.pull_request.number}</strong> — ${trunc(ev.payload.pull_request.title, 45)} in ${repoName}`, time };
        case 'CreateEvent':
          return { icon: 'ti-git-branch',       text: `Created ${ev.payload.ref_type} <strong>${ev.payload.ref || repoName}</strong>`, time };
        case 'WatchEvent':
          return { icon: 'ti-star',             text: `Starred <a href="${repoHref}" target="_blank" rel="noopener"><strong>${ev.repo.name}</strong></a>`, time };
        case 'ForkEvent':
          return { icon: 'ti-git-fork',         text: `Forked <strong>${ev.repo.name}</strong>`, time };
        case 'IssuesEvent':
          return { icon: 'ti-circle-dot',       text: `${cap(ev.payload.action)} issue <strong>#${ev.payload.issue.number}</strong> in ${repoName}`, time };
        case 'ReleaseEvent':
          return { icon: 'ti-tag',              text: `Released <strong>${ev.payload.release.tag_name}</strong> in ${repoName}`, time };
        default:
          return { icon: 'ti-code',             text: `${ev.type.replace('Event', '')} in ${repoName}`, time };
      }
    }
  
    function staticActivity() {
      return `
        <div class="activity-item">
          <div class="act-icon"><i class="ti ti-git-commit" aria-hidden="true"></i></div>
          <div class="act-text">
            <div class="act-main">Pushed <strong>feat: add Leaflet trip planner</strong> to tourist-app</div>
            <div class="act-time">2 hours ago</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="act-icon"><i class="ti ti-git-pull-request" aria-hidden="true"></i></div>
          <div class="act-text">
            <div class="act-main">Opened PR <strong>#14 — currency conversion module</strong> in tourist-app</div>
            <div class="act-time">5 hours ago</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="act-icon"><i class="ti ti-git-commit" aria-hidden="true"></i></div>
          <div class="act-text">
            <div class="act-main">Pushed <strong>fix: adaptive threshold tuning for hardwood floors</strong> to dustbot-vision</div>
            <div class="act-time">2 days ago</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="act-icon"><i class="ti ti-file-code" aria-hidden="true"></i></div>
          <div class="act-text">
            <div class="act-main">Created repo <strong>cubic-spline-interp</strong> — numerical methods assignment</div>
            <div class="act-time">3 days ago</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="act-icon"><i class="ti ti-star" aria-hidden="true"></i></div>
          <div class="act-text">
            <div class="act-main">Starred <strong>opencv/opencv</strong></div>
            <div class="act-time">4 days ago</div>
          </div>
        </div>
      `;
    }
  
    /* ── Helpers ── */
    function setStatCard(id, value, delta) {
      const el  = document.getElementById(id);
      const del = document.getElementById(id + '-delta');
      if (el)  el.textContent  = value === '—' ? '—' : String(value);
      if (del && delta) del.textContent = delta;
    }
  
    function relTime(iso) {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60)  return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs  < 24)  return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      if (days < 7)   return `${days}d ago`;
      return new Date(iso).toLocaleDateString();
    }
  
    function trunc(str, n) { return str.length > n ? str.slice(0, n) + '…' : str; }
    function cap(s)        { return s ? s[0].toUpperCase() + s.slice(1) : s; }
  
    return { loadStats, loadProjectStats, buildContribGraph, loadActivity };
  })();