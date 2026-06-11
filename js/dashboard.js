/**
 * dashboard.js
 * Quiz Competition Management System – NIA Koshi Province
 * Handles leaderboard rendering from localStorage.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     DEFAULT SCHOOL DATA
     Seeds localStorage on first load.
     Keys: quizTeams  (array of {id, name, score})
  ───────────────────────────────────────── */
  const DEFAULT_TEAMS = [
    { id: 1, name: 'Shree Pokhariya Secondary School',          score: 0 },
    { id: 2, name: 'Birat Campus Biratnagar',                   score: 0 },
    { id: 3, name: 'Shiksha Deep Boarding Secondary School',    score: 0 },
    { id: 4, name: 'City Secondary School',                     score: 0 },
    { id: 5, name: 'Merryland Secondary School',                score: 0 },
    { id: 6, name: 'Siddhartha Shishu Sadan',                   score: 0 },
  ];

  const STORAGE_KEY = 'quizTeams';

  /* ─────────────────────────────────────────
     STORAGE HELPERS
  ───────────────────────────────────────── */
  function loadTeams() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) { /* ignore parse errors */ }
    return DEFAULT_TEAMS.map(t => ({ ...t }));
  }

  function saveTeams(teams) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    } catch (_) { /* storage may be unavailable */ }
  }

  function resetTeams() {
    const fresh = DEFAULT_TEAMS.map(t => ({ ...t, score: 0 }));
    saveTeams(fresh);
    return fresh;
  }

  /* ─────────────────────────────────────────
     RANK BADGES
  ───────────────────────────────────────── */
  function rankBadge(rank) {
    return `<span class="rank-number">${rank}</span>`;
  }

  /* ─────────────────────────────────────────
     RENDER LEADERBOARD
  ───────────────────────────────────────── */
  function renderLeaderboard(teams) {
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;

    // Sort descending by score, then alphabetically for ties
    const sorted = [...teams].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name);
    });

    tbody.innerHTML = '';

    sorted.forEach((team, index) => {
      const rank = index + 1;
      const rankClass = rank <= 3 ? ` rank-${rank}` : '';

      const tr = document.createElement('tr');
      tr.className = rankClass.trim();
      tr.setAttribute('data-team-id', team.id);

      tr.innerHTML = `
        <td class="rank-cell col-rank">${rankBadge(rank)}</td>
        <td class="school-cell col-school">${escapeHtml(team.name)}</td>
        <td class="score-cell col-score">
          <span class="score-pill">${team.score}</span>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  /* ─────────────────────────────────────────
     HTML ESCAPE (safety)
  ───────────────────────────────────────── */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  /* ─────────────────────────────────────────
     RESET BUTTON
  ───────────────────────────────────────── */
  function initResetButton() {
    const btn = document.getElementById('resetBtn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const confirmed = window.confirm(
        'Are you sure you want to reset all scores to 0?\nThis cannot be undone.'
      );
      if (!confirmed) return;
      const fresh = resetTeams();
      renderLeaderboard(fresh);
    });
  }

  /* ─────────────────────────────────────────
     LIVE REFRESH
     Polls localStorage every 5 seconds so score
     changes from other round pages reflect here.
  ───────────────────────────────────────── */
  function startLiveRefresh() {
    setInterval(function () {
      const teams = loadTeams();
      renderLeaderboard(teams);
    }, 5000);
  }

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  function init() {
    const teams = loadTeams();

    // Seed storage if not yet set (first visit)
    if (!localStorage.getItem(STORAGE_KEY)) {
      saveTeams(teams);
    }

    renderLeaderboard(teams);
    initResetButton();
    startLiveRefresh();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
