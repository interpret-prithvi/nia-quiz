/**
 * generalRound.js
 * General Round – NIA Koshi Province Quiz Competition
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════
     FIXED SCHOOL REGISTRY  (backend only, never displayed)
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
     QUESTIONS with answers — matched exactly from quiz_data.json
  ═══════════════════════════════════════ */
  var QUESTIONS = [
    {
      id: 1,
      q: "नेपालमा कृषि बीमा औपचारिक रुपमा कहिले देखि सुरुवात गरिएको हो?",
      a: "वि. सं. २०६९"
    },
    {
      id: 2,
      q: "सवारी साधनको बीमा गर्दा बीमितले कुनै वर्ष दाबी (Claim) नगरेमा आगामी वर्षको नवीकरण शुल्कमा पाइने छुटलाई के भनिन्छ?",
      a: "No Claim Discount - NCD"
    },
    {
      id: 3,
      q: "कृषि बीमा कार्यक्रमलाई व्यवस्थित र पारदर्शी बनाउन सञ्चालनमा ल्याइएको सफ्टवेयर को नाम के हो?",
      a: "ALIS (Agriculture and Livestock Insurance System)"
    },
    {
      id: 4,
      q: "कृषि, पशुपन्छी तथा जडिबूटी बीमा निर्देशिका, २०७९ अन्तर्गत कृषकहरूको सुरक्षणका लागि प्रति कृषक कति रकम बराबरको दुर्घटना बीमा (Accidental Insurance) अनिवार्य रूपमा गर्नुपर्ने व्यवस्था रहेको छ?",
      a: "रु २ लाख"
    },
    {
      id: 5,
      q: "बीमा ऐन, २०७९ बमोजिम नेपाल बीमा प्राधिकरणको कार्यकारी प्रमुख को रूपमा कसले कार्य गर्दछ?",
      a: "नेपाल बीमा प्राधिकरणको अध्यक्ष"
    },
    {
      id: 6,
      q: "बीमा कम्पनी र पुनर्बीमा कम्पनी बिच निश्चित अवधिभरिका सबै जोखिमहरू स्वतः हस्तान्तरण हुने गरी गरिने लिखित सम्झौतालाई के भनिन्छ?",
      a: "ट्रिटी पुनर्बीमा (Treaty Reinsurance)"
    },
    {
      id: 7,
      q: "प्राधिकरणको कर्मचारी सेवा विनियमावली को अधिकार प्रयोग गरी नयाँ कर्मचारी भर्ना गर्दा लिखित परीक्षा सञ्चालन गर्ने पूर्ण जिम्मेवारी कुन निकायलाई दिइएको छ?",
      a: "लोक सेवा आयोग (Public Service Commission)"
    },
    {
      id: 8,
      q: "गैर-समानुपातिक (non-Proportional) पुनर्बीमाको अर्को प्रचलित नाम के हो, जहाँ क्षति एउटा निश्चित सीमाभन्दा बढी भएपछि मात्र पुनर्बीमा कम्पनीले बेहोर्छ?",
      a: "एक्सेस अफ लस (Excess of Loss - XL)"
    },
    {
      id: 9,
      q: "सम्पत्ति शुद्धीकरण तथा आतंकवादी क्रियाकलापमा वित्तीय लगानी निवारण (AML-CFT) निर्देशिका अनुसार कति रकम भन्दा बढीको एकल प्रिमियम (Single Premium) भुक्तानी गर्दा ग्राहकको आयस्रोतको विवरण अनिवार्य रूपमा लिनुपर्छ?",
      a: "रु ५ लाख वा सोभन्दा बढी"
    },
    {
      id: 10,
      q: "आगामी आर्थिक वर्ष देखि बीमा अभिकर्ताहरुले कमिशन बापत नेपाल सरकारलाई कति Tax बुझाउनु पर्छ?",
      a: "0.2 (20%)"
    },
    {
      id: 11,
      q: "जीवन बीमामा नविकरणको लागि तोकिएको मिति नाघेपछि पनि बीमालेख व्यतित हुन नदिई प्रिमियम बुझाउन पाइने अतिरिक्त समयलाई के भनिन्छ?",
      a: "Grace Period (ग्रेस पिरियड)"
    },
    {
      id: 12,
      q: "यदि कुनै व्यक्तिले आफ्नो सम्पत्तिको वास्तविक मूल्य भन्दा कम रकमको बीमा गर्दछ भने त्यस अन्तर्राष्ट्रिय अभ्यासलाई के भनिन्छ?",
      a: "न्यून बीमा (Under-insurance)"
    },
    {
      id: 13,
      q: "बीमा समिति कहिले देखि विधिवत् रुपमा नेपाल बीमा प्राधिकरणमा परिणत भएको हो?",
      a: "वि.सं. २०७९ साल कात्तिक २२ गते (तदनुसार सन् २०२२ नोभेम्बर ८)"
    },
    {
      id: 14,
      q: "आर्थिक सर्वेक्षण २०८२/८३ अनुसार चालु आ.व.को कुल गाह्रस्थ उत्पादन (GDP) कति रहने अनुमान गरिएको छ?",
      a: "रू. ६६ खर्व ९ करोड"
    },
    {
      id: 15,
      q: "नेपाल बीमा प्राधिकरणको सञ्चालक समितिमा अध्यक्ष सहित कति जना सदस्य रहने व्यवस्था छ?",
      a: "६ जना"
    },
    {
      id: 16,
      q: "इन्सुरेवल इन्ट्रेस्ट (Insurable Interest - बीमायोग्य हित) को सिद्धान्त अनुसार बीमितको सम्पत्तिसँग कस्तो सम्बन्ध हुनुपर्छ?",
      a: "कानूनी तथा वित्तीय हित (Financial Stake)"
    },
    {
      id: 17,
      q: "आर्थिक वर्ष २०८१/८२ मा कुल गार्हस्थ उत्पादन (GDP) मा बीमा क्षेत्रको अनुपात कति प्रतिशत पुगेको छ?",
      a: "३.७२ प्रतिशत"
    },
    {
      id: 18,
      q: "अन्तर्राष्ट्रिय अभ्यास अनुसार बीमा दाबी गर्दा बीमित आफैंले बेहोर्नुपर्ने निश्चित रकमलाई के भनिन्छ?",
      a: "डिडक्टिबल / एक्सेस (Deductible / Excess)"
    },
    {
      id: 19,
      q: "आर्थिक वर्ष २०८१/८२ मा निर्जीवन बीमा व्यवसाय अन्तर्गत सबैभन्दा बढी बीमाशुल्क कुन पोर्टफोलियोबाट संकलन भएको छ?",
      a: "मोटर बीमा क्षेत्रबाट"
    },
    {
      id: 20,
      q: "नेपाल सरकारको बजेट वक्तव्य अनुसार आगामी आर्थिक वर्ष देखि घरधनीहरूलाई आवासीय भवन बीमा (Residential Building Insurance) मा प्रोत्साहित गर्न कति रकमसम्मको बीमाशुल्क (Premium) लाई आयकर गणना गर्दा घटाउन पाउने (Tax-Deductible) व्यवस्था गरिएको छ?",
      a: "१० हजार रुपैयाँ (पहिले ५,००० रुपैयाँ रहेको सीमालाई बढाएर १०,००० रुपैयाँ पुर्‍याइएको छ)"
    },
    {
      id: 21,
      q: "कुनै पनि घटनाबाट भएको वास्तविक नोक्सानी जति छ, त्यति मात्रै क्षतिपूर्ति भुक्तानी गर्ने बीमाको आधारभूत अन्तर्राष्ट्रिय सिद्धान्त कुन हो?",
      a: "क्षतिपुर्तिको सिद्धान्त (Principle of Indemnity)"
    },
    {
      id: 22,
      q: "ठूला प्राकृतिक विपत्तिहरू (जस्तै: भूकम्प, बाढी) बाट हुन सक्ने ठूलो आर्थिक क्षतिबाट बच्न बीमा कम्पनीहरूले कुन पुनर्बीमाको प्रयोग बढी गर्छन्?",
      a: "क्याटास्ट्रोफी पुनर्बीमा (Catastrophe Reinsurance / Cat XL)"
    },
    {
      id: 23,
      q: "नेपाल बीमा प्राधिकरण नामकरण हुनु भन्दा अगाडि यसको नाम के थियो?",
      a: "बीमा समिति"
    },
    {
      id: 24,
      q: "सवारी साधन दुर्घटनामा तेस्रो पक्षको दुर्घटनाबाट घाइते भएमा अधिकतम औषधि उपचार खर्च कति पाइन्छ?",
      a: "रु ३ लाख"
    },
    {
      id: 25,
      q: "ठूलो रकम वा उच्च जोखिम भएको कुनै एउटै सम्पत्ति वा व्यवसायको बीमा दुई वा दुईभन्दा बढी बीमा कम्पनीहरू मिलेर संयुक्तरूपमा गर्ने प्रक्रियालाई के भनिन्छ?",
      a: "सह-बीमा (Co-insurance)"
    },
    {
      id: 26,
      q: "कुनै निश्चित सम्झौता बिना, प्रत्येक जोखिमको छुट्टाछुट्टै मूल्याङ्कन गरेर गरिने पुनर्बीमालाई के भनिन्छ?",
      a: "फ्याकल्टेटिभ पुनर्बीमा (Facultative Reinsurance)"
    },
    {
      id: 27,
      q: "बीमा ऐन, २०७९ अनुसार नेपाल बीमा प्राधिकरणको सञ्चालक समितिको अध्यक्षको नियुक्ति कसले गर्दछ?",
      a: "नेपाल सरकार (मन्त्रिपरिषद्)"
    },
    {
      id: 28,
      q: "पेरिल (Peril) भन्नाले बीमाको भाषामा के बुझिन्छ?",
      a: "नोक्सानीको सम्भावित कारण (Cause of loss)"
    },
    {
      id: 29,
      q: "लघु बीमा निर्देशिका, २०७९ (Micro Insurance Directive, 2079) अनुसार लघु निर्जीवन बीमा अन्तर्गत लघु घर वा सम्पत्ति बीमाको अधिकतम बीमाङ्क रकम (Maximum Sum Insured) को सीमा कति तोकिएको छ?",
      a: "रु ५० लाख सम्म"
    },
    {
      id: 30,
      q: "बीमा नियमावली, २०८१ को परिभाषा बमोजिम बीमायोग्य व्यक्ति र सम्पत्तिमा निहित जोखिमको विश्लेषण गरी बीमाशुल्क तथा बीमाका सर्त निर्धारण गर्ने मध्यस्थकर्ता लाई के भनिन्छ?",
      a: "Underwriter (अण्डरराइटर)"
    }
  ];

  /* ─── Constants ─── */
  var TOTAL_Q   = 30;
  var TEAMS_KEY = 'quizTeams';
  var DONE_KEY  = 'generalDone';

  /* ─── State ─── */
  var currentQ       = -1;   // -1 = intro slide (button 0)
  var doneSet        = new Set();
  var answerVisible  = false; // tracks if answer is currently shown
  var teams          = [];

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
     PREV / NEXT — wired in JS (not inline onclick)
  ═══════════════════════════════════════ */
  prevBtn.addEventListener('click', function () {
    if (currentQ > 0) goTo(currentQ - 1);
  });

  nextBtn.addEventListener('click', function () {
    if (currentQ < TOTAL_Q - 1) goTo(currentQ + 1);
  });

  /* ═══════════════════════════════════════
     SHOW ANSWER BUTTON
  ═══════════════════════════════════════ */
  showAnsBtn.addEventListener('click', function () {
    if (answerVisible) {
      // Hide answer
      answerBox.style.display = 'none';
      showAnsBtn.textContent  = '👁 Show Answer';
      showAnsBtn.classList.remove('btn-ans-active');
      answerVisible = false;
    } else {
      // Show answer
      var q = QUESTIONS[currentQ];
      answerText.textContent = q ? q.a : '—';
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
     Button 0 = intro slide ("General Round" title)
     Buttons 1–30 = actual questions
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
    introBtn.title = 'General Round – Intro';
    introBtn.addEventListener('click', function () { goTo(-1); });
    introWrap.appendChild(introBtn);
    qGrid.appendChild(introWrap);

    // Buttons 1–30
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
        // intro button — just track active state
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
     NAVIGATE TO QUESTION
     idx === -1 → intro slide
     idx 0–29  → actual questions
  ═══════════════════════════════════════ */
  function goTo(idx) {
    if (idx < -1 || idx >= TOTAL_Q) return;
    currentQ = idx;
    // Always hide answer when changing slide
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
      qLabel.textContent       = 'General Round';
      qNumber.textContent      = '';
      questionText.textContent = 'General Round';
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
