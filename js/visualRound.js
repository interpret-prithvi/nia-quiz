/**
 * visualRound.js
 * Visual Round – NIA Koshi Province Quiz Competition
 *
 * Q1–8  : question image  ../visualround/Nq.png
 *          answer image   ../visualround/Na.png
 *
 * Q9–16 : question image  ../visualround/<name>.png
 *          answer         text string (hardcoded)
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════
     FIXED SCHOOL REGISTRY
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
     type: 'image'  → show answer image (Na.png)
     type: 'text'   → show answer as text string
  ═══════════════════════════════════════ */
  var QUESTIONS = [
    // Q1–8: image question + image answer
    { id: 1,  q: '../visualround/1q.png', aType: 'image', a: '../visualround/1a.png' },
    { id: 2,  q: '../visualround/2q.png', aType: 'image', a: '../visualround/2a.png' },
    { id: 3,  q: '../visualround/3q.png', aType: 'image', a: '../visualround/3a.png' },
    { id: 4,  q: '../visualround/4q.png', aType: 'image', a: '../visualround/4a.png' },
    { id: 5,  q: '../visualround/5q.png', aType: 'image', a: '../visualround/5a.png' },
    { id: 6,  q: '../visualround/6q.png', aType: 'image', a: '../visualround/6a.png' },
    { id: 7,  q: '../visualround/7q.png', aType: 'image', a: '../visualround/7a.png' },
    { id: 8,  q: '../visualround/8q.png', aType: 'image', a: '../visualround/8a.png' },

    // Q9–16: named image question + text answer
    { id: 9,  q: '../visualround/9. Agriculture Insurance.png',       aType: 'text', a: 'Agriculture Insurance' },
    { id: 10, q: '../visualround/10. Aviation Insurance.png',          aType: 'text', a: 'Aviation Insurance' },
    { id: 11, q: '../visualround/11. Engineering Insurance.png',       aType: 'text', a: 'Engineering Insurance' },
    { id: 12, q: '../visualround/12. health:medical insurance.png',    aType: 'text', a: 'Health / Medical Insurance' },
    { id: 13, q: '../visualround/13. Life Insurance.png',              aType: 'text', a: 'Life Insurance' },
    { id: 14, q: '../visualround/14. Marine Insurance.png',            aType: 'text', a: 'Marine Insurance' },
    { id: 15, q: '../visualround/15. Motor Insurance.png',             aType: 'text', a: 'Motor Insurance' },
    { id: 16, q: '../visualround/16. Property Insurance.png',          aType: 'text', a: 'Property Insurance' }
  ];

  /* ─── Constants ─── */
  var TOTAL_Q   = 16;
  var TEAMS_KEY = 'quizTeams';
  var DONE_KEY  = 'visualDone';

  /* ─── State ─── */
  var currentQ      = -1;   // -1 = intro slide (button 0)
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
      hideAnswer();
    } else {
      showAnswer();
    }
  });

  function showAnswer() {
    var q = QUESTIONS[currentQ];
    if (!q) return;

    answerBox.style.display = 'block';

    if (q.aType === 'image') {
      answerImg.src           = q.a;
      answerImg.alt           = 'Answer for Question ' + (currentQ + 1);
      answerImg.style.display = 'block';
      answerText.style.display = 'none';
      answerText.textContent  = '';
    } else {
      // text answer
      answerText.textContent   = q.a;
      answerText.style.display = 'block';
      answerImg.style.display  = 'none';
      answerImg.src            = '';
    }

    showAnsBtn.textContent = '🙈 Hide Answer';
    showAnsBtn.classList.add('btn-ans-active');
    answerVisible = true;
  }

  function hideAnswer() {
    answerBox.style.display  = 'none';
    answerImg.src            = '';
    answerImg.style.display  = 'none';
    answerText.textContent   = '';
    answerText.style.display = 'none';
    showAnsBtn.textContent   = '� Show Answer';
    showAnsBtn.classList.remove('btn-ans-active');
    answerVisible = false;
  }

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
     Button 0 = intro slide ("Visual Round" title)
     Buttons 1–16 = actual questions
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
    introBtn.title = 'Visual Round – Intro';
    introBtn.addEventListener('click', function () { goTo(-1); });
    introWrap.appendChild(introBtn);
    qGrid.appendChild(introWrap);

    // Buttons 1–16
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
      var idx    = parseInt(wrap.getAttribute('data-idx'), 10);
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
    hideAnswer();
    renderQuestion();
    updateGrid();
    updateNavBtns();
  }

  function renderQuestion() {
    if (currentQ === -1) {
      // ── Intro slide ──
      qLabel.textContent       = 'Visual Round';
      qNumber.textContent      = 'Visual Round';
      qNumber.classList.add('intro-title');
      questionImg.src          = '';
      questionImg.alt          = '';
      var imgWrap = document.getElementById('questionImgWrap');
      if (imgWrap) imgWrap.style.display = 'none';
      showAnsBtn.style.display = 'none';
      return;
    }
    // ── Normal question ──
    qNumber.classList.remove('intro-title');
    showAnsBtn.style.display = '';
    var imgWrap = document.getElementById('questionImgWrap');
    if (imgWrap) imgWrap.style.display = '';
    var q = QUESTIONS[currentQ];
    qLabel.textContent  = 'Q' + (currentQ + 1) + ' / ' + TOTAL_Q;
    qNumber.textContent = 'Question ' + (currentQ + 1);
    if (q) {
      questionImg.src = q.q;
      questionImg.alt = 'Visual Question ' + (currentQ + 1);
    }
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
