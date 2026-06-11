/**
 * visualRound.js
 * Visual Round – NIA Koshi Province Quiz Competition
 *
 * Questions 1–8 use image pairs:
 *   ../visualround/Nq.png  = question image for Q N
 *   ../visualround/Na.png  = answer image for Q N
 *
 * Scores are cumulative — they build on whatever is already in
 * localStorage under the key 'quizTeams' (set by previous rounds).
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════
     FIXED SCHOOL REGISTRY  (IDs must stay stable across all rounds)
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
     QUESTION DEFINITIONS
     q = path to question image
     a = path to answer image
  ═══════════════════════════════════════ */
  var QUESTIONS = [];
  for (var n = 1; n <= 8; n++) {
    QUESTIONS.push({
      id: n,
      q: '../visualround/' + n + 'q.png',
      a: '../visualround/' + n + 'a.png'
    });
  }

  /* ─── Constants ─── */
  var TOTAL_Q   = 8;
  var TEAMS_KEY = 'quizTeams';        // shared key — same as all other rounds
  var DONE_KEY  = 'visualDone';       // visual-round-specific done tracking

  /* ─── State ─── */
  var currentQ      = 0;
  var doneSet       = new Set();
  var answerVisible = false;
  var teams         = [];

  /* ─── DOM refs ─── */
  var qGrid        = document.getElementById('qGrid');
  var qLabel       = document.getElementById('qLabel');
  var qNumber      = document.getElementById('qNumber');
  var questionImg  = document.getElementById('questionImg');
  var answerBox    = document.getElementById('answerBox');
  var answerImg    = document.getElementById('answerImg');
  var showAnsBtn   = document.getElementById('showAnsBtn');
  var schoolsList  = document.getElementById('schoolsList');
  var prevBtn      = document.getElementById('prevBtn');
  var nextBtn      = document.getElementById('nextBtn');

  /* ═══════════════════════════════════════
     PREV / NEXT NAVIGATION
  ═══════════════════════════════════════ */
  prevBtn.addEventListener('click', function () {
    if (currentQ > 0) goTo(currentQ - 1);
  });

  nextBtn.addEventListener('click', function () {
    if (currentQ < TOTAL_Q - 1) goTo(currentQ + 1);
  });

  /* ═══════════════════════════════════════
     SHOW / HIDE ANSWER BUTTON
  ═══════════════════════════════════════ */
  showAnsBtn.addEventListener('click', function () {
    if (answerVisible) {
      answerBox.style.display    = 'none';
      showAnsBtn.textContent     = '👁 Show Answer';
      showAnsBtn.classList.remove('btn-ans-active');
      answerVisible = false;
    } else {
      var q = QUESTIONS[currentQ];
      answerImg.src              = q ? q.a : '';
      answerImg.alt              = 'Answer for Question ' + (currentQ + 1);
      answerBox.style.display    = 'block';
      showAnsBtn.textContent     = '🙈 Hide Answer';
      showAnsBtn.classList.add('btn-ans-active');
      answerVisible = true;
    }
  });

  /* ═══════════════════════════════════════
     LOAD / SAVE
  ═══════════════════════════════════════ */
  function loadState() {
    /* Done set — visual round only */
    try {
      var raw = localStorage.getItem(DONE_KEY);
      if (raw) doneSet = new Set(JSON.parse(raw));
    } catch (_) {}

    /* Teams — cumulative across ALL rounds */
    try {
      var raw2 = localStorage.getItem(TEAMS_KEY);
      if (raw2) teams = JSON.parse(raw2);
    } catch (_) {}

    /* Ensure every school in our registry exists in teams */
    SCHOOLS.forEach(function (school) {
      var exists = teams.find(function (t) { return t.id === school.id; });
      if (!exists) {
        teams.push({ id: school.id, name: school.name, score: 0 });
      }
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
  ═══════════════════════════════════════ */
  function buildGrid() {
    qGrid.innerHTML = '';
    for (var i = 0; i < TOTAL_Q; i++) {
      (function (idx) {
        var wrap = document.createElement('div');
        wrap.className = 'q-btn-wrap';
        wrap.setAttribute('data-idx', idx);

        /* Small circle — toggle done/pending */
        var circle = document.createElement('button');
        circle.type      = 'button';
        circle.className = 'q-circle' + (doneSet.has(idx) ? ' done' : '');
        circle.title     = doneSet.has(idx) ? 'Mark as pending' : 'Mark as done';
        circle.addEventListener('click', function (e) {
          e.stopPropagation();
          toggleDone(idx);
        });

        /* Question number button */
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
      var idx    = parseInt(wrap.getAttribute('data-idx'), 10);
      var circle = wrap.querySelector('.q-circle');
      var btn    = wrap.querySelector('.q-btn');
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
     NAVIGATE TO QUESTION
  ═══════════════════════════════════════ */
  function goTo(idx) {
    if (idx < 0 || idx >= TOTAL_Q) return;
    currentQ = idx;

    /* Always hide answer when changing question */
    answerBox.style.display    = 'none';
    showAnsBtn.textContent     = '👁 Show Answer';
    showAnsBtn.classList.remove('btn-ans-active');
    answerVisible = false;

    renderQuestion();
    updateGrid();
    updateNavBtns();
  }

  function renderQuestion() {
    var q = QUESTIONS[currentQ];
    qLabel.textContent  = 'Q' + (currentQ + 1) + ' / ' + TOTAL_Q;
    qNumber.textContent = 'Question ' + (currentQ + 1);
    questionImg.src     = q ? q.q : '';
    questionImg.alt     = 'Question ' + (currentQ + 1);
  }

  function updateNavBtns() {
    prevBtn.disabled = currentQ === 0;
    nextBtn.disabled = currentQ === TOTAL_Q - 1;
  }

  /* ═══════════════════════════════════════
     SCORE PANEL — right side
  ═══════════════════════════════════════ */
  function buildSchoolsPanel() {
    schoolsList.innerHTML = '';

    SCHOOLS.forEach(function (school) {
      var team = getTeamById(school.id);

      var row = document.createElement('div');
      row.className = 'school-row';
      row.id        = 'school-row-' + school.id;
      row.setAttribute('data-school-id', school.id);

      /* School name */
      var nameRow = document.createElement('div');
      nameRow.className = 'school-name-row';

      var nameLabel = document.createElement('span');
      nameLabel.className   = 'school-name-label';
      nameLabel.textContent = school.name;
      nameRow.appendChild(nameLabel);

      /* Score row */
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

      /* Closure so each row captures its own schoolId and input */
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

    /* Update displayed total */
    var totalSpan = document.getElementById('total-' + schoolId);
    if (totalSpan) totalSpan.textContent = team.score;

    /* Flash the row green */
    var row = document.getElementById('school-row-' + schoolId);
    if (row) {
      row.classList.remove('flash-green');
      void row.offsetWidth; /* reflow to restart animation */
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
