/**
 * scoreboard.js
 * Live Leaderboard – NIA Koshi Province Quiz Competition
 */

(function () {
  'use strict';

  var TEAMS_KEY = 'quizTeams';

  /* Fixed school registry — same IDs as generalRound.js */
  var SCHOOLS = [
    { id: 1, name: 'Shree Pokhariya Secondary School' },
    { id: 2, name: 'Birat Campus Biratnagar' },
    { id: 3, name: 'Shiksha Deep Boarding Secondary School' },
    { id: 4, name: 'City Secondary School' },
    { id: 5, name: 'Merryland Secondary School' },
    { id: 6, name: 'Siddhartha Shishu Sadan' }
  ];

  function loadTeams() {
    try {
      var raw = localStorage.getItem(TEAMS_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    // Return default with 0 scores if nothing in storage
    return SCHOOLS.map(function (s) {
      return { id: s.id, name: s.name, score: 0 };
    });
  }

  /* ─── RENDER BOARD ─── */
  window.renderBoard = function () {
    var tbody = document.getElementById('sbBody');
    if (!tbody) return;

    var teams = loadTeams();

    var sorted = teams.slice().sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return (a.name || '').localeCompare(b.name || '');
    });

    tbody.innerHTML = '';

    sorted.forEach(function (team, index) {
      var rank      = index + 1;
      var rankClass = rank <= 3 ? 'rank-' + rank : '';

      var tr = document.createElement('tr');
      if (rankClass) tr.className = rankClass;

      tr.innerHTML =
        '<td class="rank-cell col-rank"><span class="rank-num">' + rank + '</span></td>' +
        '<td class="school-cell col-school">' + escapeHtml(team.name || '—') + '</td>' +
        '<td class="score-cell col-score"><span class="score-val">' + (team.score || 0) + '</span></td>';

      tbody.appendChild(tr);
    });
  };

  /* ─── RESET ALL SCORES TO ZERO ─── */
  window.resetScores = function () {
    var confirmed = window.confirm(
      'Reset all scores to zero?\n\nThis will clear every school\'s score. This cannot be undone.'
    );
    if (!confirmed) return;

    var zeroed = SCHOOLS.map(function (s) {
      return { id: s.id, name: s.name, score: 0 };
    });

    try {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(zeroed));
    } catch (_) {}

    window.renderBoard();

    // Brief visual feedback on the button
    var btn = document.querySelector('.btn-reset-scores');
    if (btn) {
      var original = btn.textContent;
      btn.textContent = '✓ Scores Reset';
      btn.style.background = '#1a7a3c';
      setTimeout(function () {
        btn.textContent = original;
        btn.style.background = '';
      }, 2000);
    }
  };

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(String(str)));
    return d.innerHTML;
  }

  /* Auto-refresh every 5 seconds */
  function startAutoRefresh() {
    setInterval(window.renderBoard, 5000);
  }

  function init() {
    window.renderBoard();
    startAutoRefresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
