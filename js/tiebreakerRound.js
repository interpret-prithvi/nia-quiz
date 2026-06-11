/**
 * tiebreakerRound.js
 * Tie-Breaker Round – NIA Koshi Province Quiz Competition
 * Same logic as generalRound.js, 5 questions only.
 * Scores add to the same quizTeams localStorage key.
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════
     FIXED SCHOOL REGISTRY (backend only)
  ═══════════════════════════════════════ */
  var SCHOOLS = [
    { id: 1, name: 'Shree Pokhariya Secondary School' },
    { id: 2, name: 'Birat Campus Biratnagar' },
    { id: 3, name: 'Shiksha Deep Boarding Secondary School' },
    { id: 4, name: 'City Secondary School' },
    { id: 5, name: 'Merryland Secondary School' },
    { id: 6, name: 'Siddhartha Shishu Sadan' }
  ];

  /* ═══════════════════════════════════════
     TIE-BREAKER QUESTIONS — from quiz_data.json TieBreaker sheet
  ═══════════════════════════════════════ */
  var QUESTIONS = [
    {
      id: 1,
      q: "हाल प्रचलित बीमा ऐन कुन हो?",
      a: "बीमा ऐन, २०७९"
    },
    {
      id: 2,
      q: "नेपालमा हाल कतिवटा लघु जीवन बीमा कम्पनी छन्?",
      a: "३ वटा"
    },
    {
      id: 3,
      q: "नेपालमा तीनवटा ठूलो कम्पनी मर्जर भई बनेको जीवन बीमा कम्पनी कुन हो?",
      a: "Himalayan Life Insurance Limited"
    },
    {
      id: 4,
      q: "विराटनगरमा केन्द्रीय कार्यालय रही स्थापित भएको बीमा कम्पनी कुन हो?",
      a: "Guardian Micro Life Insurance"
    },
    {
      id: 5,
      q: "हाल नेपाल बीमा प्राधिकरणका कार्यकारी निर्देशक को हुन्?",
      a: "श्री सुशील देव सुवेदी"
    }
  ];

  /* ─── Constants ─── */
  var TOTAL_Q   = 5;
  var TEAMS_KEY = 'quizTeams';       // same key — scores accumulate across rounds
  var DONE_KEY  = 'tiebreakerDone';  // separate done-set from general round

  /* ─── State ─── */
  var currentQ      = -1;   // -1 = intro slide (button 0)
  var doneSet       = new Set();
  var answerVisible = false;
  var teams         = [];

  /* ─── DOM refs ─── */
  var qGrid        = document.getElementById('qGrid');
  var qLabel       = document.getElementById('qLabel');
  var qNumber      = document.getElementById('qNumber');
  var questionText = document.getElementById('questionText');
  var answerBox    = document.getElementById('answerBox');
  var answerText   = document.getElementById('answerText');
  var showAnsBtn   = document.getElementById('showAnsBtn');
  var schoolsList  = document.getElementById('schoolsList');
  var prevBtn      = document.getElementById('prevBtn');
  var nextBtn      = document.getElementById('nextBtn');

  /* ═══════════════════════════════════════
     PREV / NEXT
  ═══════════════════════════════════════ */
  prevBtn.addEventListener('click', function () {
    if (currentQ > -1) goTo(currentQ - 1);
  });

  nextBtn.addEventListener('click', function () {
    if (currentQ < TOTAL_Q - 1) goTo(currentQ + 1);
  });

  /* ═══════════════════════════════════════
     SHOW / HIDE ANSWER
  ═══════════════════════════════════════ */
  showAnsBtn.addEventListener('click', function () {
    if (answerVisible) {
      answerBox.style.display = 'none';
      showAnsBtn.textContent  = '👁 Show Answer';
      showAnsBtn.classList.remove('btn-ans-active');
      answerVisible = false;
    } else {
      var q = QUESTIONS[currentQ];
      answerText.textContent  = q ? q.a : '—';
      answerBox.style.display = 'block';
      showAnsBtn.textContent  = '🙈 Hide Answer';
      showAnsBtn.classList.add('btn-ans-active');
      answerVisible = true;
    }
  });

  /* ═══════════════════════════════════════
     LOAD / SAVE
  ═══════════════════════════════════════ */
  function loadState() {
    try {
      var raw = localStorage.getItem(DONE_KEY);
      if (raw) doneSet = new Set(JSON.parse(raw));
    } catch (_) {}

    try {
      var raw2 = localStorage.getItem(TEAMS_KEY);
      if (raw2) teams = JSON.parse(raw2);
    } catch (_) {}

    // Ensure all 6 schools exist in teams
    SCHOOLS.forEach(function (school) {
      var exists = teams.find(function (t) { return t.id === school.id; });
      if (!exists) teams.push({ id: school.id, name: school.name, score: 0 });
    });

    saveTeams();
  }

  function saveTeams() {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  }

  function saveDone() {
    localStorage.setItem(DONE_KEY, JSON.stringify(Array.from(doneSet)));
  }

  function getTeamById(id) {
    return teams.find(function (t) { return t.id === id; });
  }

  /* ═══════════════════════════════════════
     QUESTION NAVIGATOR GRID
     Button 0 = intro slide ("Tie-Breaker" title)
     Buttons 1–5 = actual questions
  ═══════════════════════════════════════ */
  function buildGrid() {
    qGrid.innerHTML = '';

    // Button 0 — intro slide
    var introWrap = document.createElement('div');
    introWrap.className = 'q-btn-wrap';
    introWrap.setAttribute('data-idx', -1);

    var introCircle = document.createElement('button');
    introCircle.type      = 'button';
    introCircle.className = 'q-circle';
    introCircle.style.visibility = 'hidden'; // no done-circle for intro
    introWrap.appendChild(introCircle);

    var introBtn = document.createElement('button');
    introBtn.type      = 'button';
    introBtn.className = 'q-btn intro-btn' + (currentQ === -1 ? ' active' : '');
    introBtn.textContent = '0';
    introBtn.title = 'Tie-Breaker – Intro';
    introBtn.addEventListener('click', function () { goTo(-1); });
    introWrap.appendChild(introBtn);
    qGrid.appendChild(introWrap);

    // Buttons 1–5
    for (var i = 0; i < TOTAL_Q; i++) {
      (function (idx) {
        var wrap = document.createElement('div');
        wrap.className = 'q-btn-wrap';
        wrap.setAttribute('data-idx', idx);

        var circle = document.createElement('button');
        circle.type      = 'button';
        circle.className = 'q-circle' + (doneSet.has(idx) ? ' done' : '');
        circle.title     = doneSet.has(idx) ? 'Mark as pending' : 'Mark as done';
        circle.addEventListener('click', function (e) {
          e.stopPropagation();
          toggleDone(idx);
        });

        var btn = document.createElement('button');
        btn.type      = 'button';
        btn.className = 'q-btn' +
          (idx === currentQ ? ' active' : '') +
          (doneSet.has(idx) ? ' done-btn' : '');
        btn.textContent = idx + 1;
        btn.addEventListener('click', function () { goTo(idx); });

        wrap.appendChild(circle);
        wrap.appendChild(btn);
        qGrid.appendChild(wrap);
      })(i);
    }
  }

  function updateGrid() {
    var wraps = qGrid.querySelectorAll('.q-btn-wrap');
    wraps.forEach(function (wrap) {
      var idx    = parseInt(wrap.getAttribute('data-idx'));
      var circle = wrap.querySelector('.q-circle');
      var btn    = wrap.querySelector('.q-btn');

      if (idx === -1) {
        btn.className = 'q-btn intro-btn' + (currentQ === -1 ? ' active' : '');
        return;
      }

      var isDone   = doneSet.has(idx);
      var isActive = idx === currentQ;
      circle.className = 'q-circle' + (isDone ? ' done' : '');
      circle.title     = isDone ? 'Mark as pending' : 'Mark as done';
      btn.className    = 'q-btn' + (isActive ? ' active' : '') + (isDone ? ' done-btn' : '');
    });
  }

  function toggleDone(idx) {
    if (doneSet.has(idx)) { doneSet.delete(idx); } else { doneSet.add(idx); }
    saveDone();
    updateGrid();
  }

  /* ═══════════════════════════════════════
     NAVIGATE
  ═══════════════════════════════════════ */
  function goTo(idx) {
    if (idx < -1 || idx >= TOTAL_Q) return;
    currentQ = idx;
    answerBox.style.display = 'none';
    showAnsBtn.textContent  = '👁 Show Answer';
    showAnsBtn.classList.remove('btn-ans-active');
    answerVisible = false;
    renderQuestion();
    updateGrid();
    updateNavBtns();
  }

  function renderQuestion() {
    if (currentQ === -1) {
      // ── Intro slide ──
      qLabel.textContent       = 'Tie-Breaker';
      qNumber.textContent      = '';
      questionText.textContent = 'Tie-Breaker';
      questionText.classList.add('intro-title');
      showAnsBtn.style.display = 'none';
      return;
    }
    // ── Normal question ──
    questionText.classList.remove('intro-title');
    showAnsBtn.style.display = '';
    var q = QUESTIONS[currentQ];
    qLabel.textContent       = 'Q' + (currentQ + 1) + ' / ' + TOTAL_Q;
    qNumber.textContent      = 'Question ' + (currentQ + 1);
    questionText.textContent = q ? q.q : '—';
  }

  function updateNavBtns() {
    prevBtn.disabled = currentQ === -1;
    nextBtn.disabled = currentQ === TOTAL_Q - 1;
  }

  /* ═══════════════════════════════════════
     SCORE PANEL
  ═══════════════════════════════════════ */
  function buildSchoolsPanel() {
    schoolsList.innerHTML = '';

    SCHOOLS.forEach(function (school) {
      var team = getTeamById(school.id);

      var row = document.createElement('div');
      row.className = 'school-row';
      row.id        = 'school-row-' + school.id;
      row.setAttribute('data-school-id', school.id);

      var nameRow = document.createElement('div');
      nameRow.className = 'school-name-row';
      var nameLabel = document.createElement('span');
      nameLabel.className   = 'school-name-label';
      nameLabel.textContent = school.name;
      nameRow.appendChild(nameLabel);

      var scoreRow = document.createElement('div');
      scoreRow.className = 'school-score-row';

      var totalSpan = document.createElement('span');
      totalSpan.className   = 'school-total';
      totalSpan.id          = 'total-' + school.id;
      totalSpan.textContent = team ? team.score : 0;

      var ptsLabel = document.createElement('span');
      ptsLabel.className   = 'score-label';
      ptsLabel.textContent = 'pts';

      var addInput = document.createElement('input');
      addInput.type        = 'number';
      addInput.className   = 'score-add-input';
      addInput.placeholder = '+pts';
      addInput.min         = '0';

      var addBtn = document.createElement('button');
      addBtn.type        = 'button';
      addBtn.className   = 'btn-add-score';
      addBtn.textContent = '+ Add';

      (function (sid, inp) {
        addBtn.addEventListener('click', function () { addScore(sid, inp); });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') addScore(sid, inp);
        });
      })(school.id, addInput);

      scoreRow.appendChild(totalSpan);
      scoreRow.appendChild(ptsLabel);
      scoreRow.appendChild(addInput);
      scoreRow.appendChild(addBtn);

      row.appendChild(nameRow);
      row.appendChild(scoreRow);
      schoolsList.appendChild(row);
    });
  }

  function addScore(schoolId, inputEl) {
    var val = parseInt(inputEl.value, 10);
    if (isNaN(val) || val < 0) { inputEl.value = ''; return; }
    var team = getTeamById(schoolId);
    if (!team) return;
    team.score += val;
    saveTeams();
    var totalSpan = document.getElementById('total-' + schoolId);
    if (totalSpan) totalSpan.textContent = team.score;
    var row = document.getElementById('school-row-' + schoolId);
    if (row) {
      row.classList.remove('flash-green');
      void row.offsetWidth;
      row.classList.add('flash-green');
    }
    inputEl.value = '';
    inputEl.focus();
  }

  /* ═══════════════════════════════════════
     INIT
  ═══════════════════════════════════════ */
  function init() {
    loadState();
    buildGrid();
    buildSchoolsPanel();
    renderQuestion();
    updateNavBtns();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
