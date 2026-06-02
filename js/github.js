
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
    async function api(path){
        const res = await fetch(`${BASE}${path}`, { headers: headers() });
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return res.json();
    }
    
    /* ── User profile + repo list → fills stat cards ── */
    async function loadstats(){
        try {
            const [user, repos] = await Promise.all([
              api(`/users/${CONFIG.github.username}`),
              api(`/users/${CONFIG.github.username}/repos?per_page=100&sort=updated`),
            ]);

            const Totalstars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
            setStatCard('stat-repos',     user.public_repos, `updated ${relTime(user.updated_at)}`);
            setStatCard('stat-followers', user.followers,    '');
            setStatCard('stat-stars',     totalStars,        'across all public repos');
            setStatCard('stat-commits',   '—',               'see contribution graph');
 
      return repos;
    } catch (e) {
      console.warn('[GitHub] stats failed:', e.message);
      return [];
    }

    };
});