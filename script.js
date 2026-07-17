/* ================================================================
   GABAY EduTech - Main Script
   
   How this file is organized (use Ctrl+F to jump to a section):
   
     1. DATA           All text content. Edit here to update the platform.
     2. STATE          What is happening right now (current view, step, etc.)
     3. STORAGE        Saving and loading from localStorage.
     4. HELPERS        Small reusable utility functions.
     5. NAVIGATION     Moving between views cleanly and reliably.
     6. COURSE ENGINE  Stepping through modules, locking, completion logic.
     7. SIDEBAR        Building the dynamic navigation sidebar.
     8. VIEWS          Pure functions that return HTML for each screen.
     9. RENDERER       Puts the right view on screen, updates headers.
    10. BIND           Wires up clicks and inputs after each render.
    11. INIT           Starts everything when the page loads.
   ================================================================ */


/* ================================================================
   1. DATA
   All text content lives here. To change what the platform says,
   edit this block. You do not need to touch any other section.
   ================================================================ */
const DATA = {

  /* The two learning modules in the guided journey */
  modules: [
    {
      id:       'lpc',
      num:      1,
      title:    'Lesson Planning Challenge',
      subtitle: 'Curriculum and Pedagogy',
      desc:     'Plan a complete lesson on your own first, so every choice in class comes from you, not a chatbot.',
    },
    {
      id:       'journal',
      num:      2,
      title:    'Reflective Journal',
      subtitle: 'Reflection and Self-Assessment',
      desc:     'Reflect on how you planned and how much you leaned on AI, then grow from what you notice.',
    },
  ],

  /* The 11 lesson plan elements, shown one per screen */
  elements: [
    {
      title:      'Learning Outcomes',
      definition: 'What learners should know, understand, and demonstrate by the end of the lesson, aligned to a curriculum standard or MELC.',
      why:        'Keeps every decision in the lesson anchored to a clear educational purpose.',
      example:    'Learners demonstrate understanding of the particle nature of matter through observation and explanation.',
    },
    {
      title:      'Objectives',
      definition: 'Specific, measurable targets for the lesson across three domains: cognitive (thinking), affective (values), and psychomotor (skills).',
      why:        'Breaks a broad learning outcome into concrete goals you can actually measure by the end of class.',
      example:    'Cognitive: explain how temperature affects particle movement. Affective: appreciate water conservation. Psychomotor: demonstrate proper laboratory safety.',
    },
    {
      title:      'Topic',
      definition: 'The specific subject matter and subtopic covered in this lesson.',
      why:        'Sets a clear scope so you are not trying to teach everything at once.',
      example:    'Science 7, States of Matter: Changes in States.',
    },
    {
      title:      'References',
      definition: 'The sources used to prepare and verify the lesson content.',
      why:        'Keeps the lesson accurate and demonstrates academic integrity.',
      example:    'K-12 Curriculum Guide (Science 7), MATATAG Curriculum, DepEd Learning Resource Portal.',
    },
    {
      title:      'Instructional Materials',
      definition: 'The tools, resources, and media used during teaching, both traditional and digital.',
      why:        'Choosing the right materials makes abstract concepts concrete and keeps learners engaged.',
      example:    'Printed diagrams of particle arrangement, ice cubes for demonstration, PhET States of Matter simulation.',
    },
    {
      title:      'Learning Activities',
      definition: 'The structured tasks learners do during the lesson to actively engage with the content.',
      why:        'Learning happens through doing. Activities move learners from passive recipients to active thinkers.',
      example:    'Paired observation activity, small-group discussion on phase changes, written reflection prompt.',
    },
    {
      title:      'Concept',
      definition: 'The single core idea or principle at the heart of the lesson.',
      why:        'A lesson without a central concept scatters attention. One clear idea helps everything else connect.',
      example:    'Matter changes its state when thermal energy is added or removed, causing particles to move differently.',
    },
    {
      title:      'Skills to Develop',
      definition: 'The cognitive, digital, and collaborative skills the lesson intentionally builds alongside content knowledge.',
      why:        'Connects the lesson to 21st-century competencies beyond content alone.',
      example:    'Scientific reasoning, data analysis, responsible use of digital tools, communication of findings.',
    },
    {
      title:      'Values Integration',
      definition: 'The character values, civic responsibilities, or ethical sensibilities woven into the lesson.',
      why:        'Education forms the whole person. Values integration makes the classroom a place of character development too.',
      example:    'Environmental stewardship through a water conservation activity.',
    },
    {
      title:      'Methodology',
      definition: 'The overall teaching approach: the philosophical stance on how learning should happen in this lesson.',
      why:        'Your methodology shapes every other decision: how you arrange activities, how you ask questions, how you handle mistakes.',
      example:    'Inquiry-based learning with guided discovery and collaborative problem-solving.',
    },
    {
      title:      'Strategy Applied',
      definition: 'The specific instructional framework that structures the lesson procedure: either the 5Es or 7Es model.',
      why:        'A clear framework keeps the lesson coherent and ensures each phase serves a distinct learning purpose.',
      example:    'You choose 5Es (Engage, Explore, Explain, Elaborate, Evaluate) or 7Es (which adds Elicit and Extend) in the workspace.',
    },
  ],

  /* Challenge guidelines */
  guidelines: {
    rules: [
      'Create your lesson plan using your own thinking, not AI.',
      'Avoid AI-generated first drafts. Write your own ideas first.',
      'Draw from your own instructional experience and classroom knowledge.',
      'Integrate technology meaningfully, not just because it is available.',
      'Reflect honestly on your planning decisions after you submit.',
    ],
    ok:  ['Grammar checking', 'Formatting and layout help', 'Refining your own ideas', 'Reflection support'],
    no:  ['AI-generated first drafts', 'Copy-pasting AI output without changes', 'AI-created assessments used unmodified'],
  },

  /*
    Lesson procedure phases.
    fivesToo: true  = part of both 5Es and 7Es
    fivesToo: false = 7Es only (added = true flags these visually)
  */
  phases: [
    { k: 'Greetings',      fivesToo: true,  added: false },
    { k: 'Opening Prayer', fivesToo: true,  added: false },
    { k: 'Recall',         fivesToo: true,  added: false },
    { k: 'Elicit',         fivesToo: false, added: true,  hint: 'Draw out what learners already know.' },
    { k: 'Engage',         fivesToo: true,  added: false, hint: 'Spark curiosity and motivation.' },
    { k: 'Explore',        fivesToo: true,  added: false, hint: 'Let learners investigate hands-on.' },
    { k: 'Explain',        fivesToo: true,  added: false, hint: 'Clarify findings and introduce formal terms.' },
    { k: 'Elaborate',      fivesToo: true,  added: false, hint: 'Apply the concept to new situations.' },
    { k: 'Evaluate',       fivesToo: true,  added: false, hint: 'Measure and check understanding.' },
    { k: 'Extend',         fivesToo: false, added: true,  hint: 'Push learning beyond the classroom.' },
  ],

  /* Reflective journal sections and questions */
  journal: [
    {
      section: 'Learning Experience',
      questions: [
        'What important concepts did you learn from the lesson planning session?',
        'What challenges did you encounter while creating your lesson plan independently?',
        'Which lesson planning component was most difficult to accomplish, and why?',
        'How did this activity improve your confidence as a future teacher?',
      ],
    },
    {
      section: 'Lesson Planning Decisions',
      questions: [
        'How did you select your teaching strategies and learning activities?',
        'How did your lesson objectives align with the curriculum competencies?',
        'In what ways did your lesson promote learner-centered instruction?',
        'Which part of your lesson plan was the strongest, and why?',
        'If you had another opportunity, what part of your lesson plan would you improve?',
      ],
    },
    {
      section: 'Responsible AI Use',
      questions: [
        'Did you use AI tools during this activity? If yes, describe how you used them.',
        'Which parts of your lesson plan did you complete entirely on your own, without AI?',
      ],
    },
  ],

  /* Self-assessment indicators (rated 1 to 5) */
  indicators: [
    'I created original instructional ideas independently.',
    'I aligned my lesson with the curriculum competencies.',
    'I integrated technology in a meaningful and intentional way.',
    'I minimized unnecessary dependence on AI tools.',
    'I reflected critically on my own teaching decisions.',
    'I demonstrated learner-centered instructional planning.',
    'I improved my confidence in lesson planning through this activity.',
    'I practiced responsible and ethical use of AI.',
  ],

  /* Science Lab simulations, organized by subject */
  sims: {
    'Physics': [
      { name: 'PhET Simulations',  desc: 'Mechanics, waves, circuits, and energy simulations', url: 'https://phet.colorado.edu' },
      { name: 'oPhysics',          desc: 'Interactive physics demonstrations and visualizations', url: 'https://ophysics.com' },
      { name: 'Falstad Applets',   desc: 'Circuits, waves, optics, and electromagnetism',        url: 'https://falstad.com' },
      { name: 'myPhysicsLab',      desc: 'Real-time classical mechanics simulations',            url: 'https://myphysicslab.com' },
      { name: 'CK-12 Simulations', desc: 'Curriculum-aligned physics interactives',              url: 'https://interactives.ck12.org' },
    ],
    'Chemistry': [
      { name: 'ChemCollective',    desc: 'Virtual lab tasks with authentic chemistry problems', url: 'https://chemcollective.org' },
      { name: 'PhET Chemistry',    desc: 'Molecules, reactions, pH, and concentration',         url: 'https://phet.colorado.edu' },
      { name: 'MolView',           desc: '3D molecular structure visualization',                url: 'https://molview.org' },
      { name: 'LibreTexts Chem',   desc: 'Open-access chemistry simulations and resources',     url: 'https://chem.libretexts.org' },
      { name: 'PraxiLabs',         desc: 'Virtual chemistry laboratory simulations',            url: 'https://praxilabs.com' },
    ],
    'Biology': [
      { name: 'HHMI BioInteractive', desc: 'Peer-reviewed biology virtual labs and films',    url: 'https://www.biointeractive.org' },
      { name: 'LabXchange',          desc: 'Free science platform built by Harvard',           url: 'https://www.labxchange.org' },
      { name: 'Concord Consortium',  desc: 'Research-based biology simulations',               url: 'https://learn.concord.org' },
      { name: 'Virtual Biology Lab', desc: 'Inquiry-based biology models',                    url: 'https://virtualbiologylab.org' },
      { name: 'Connected Bio',       desc: 'Multi-level models for genetics and evolution',    url: 'https://connectedbio.org' },
    ],
    'Earth Science': [
      { name: 'PhET Earth & Space', desc: 'Earth and space science simulations',              url: 'https://phet.colorado.edu' },
      { name: 'NASA Sea Level',     desc: 'Glaciers, ice sheets, and rising sea levels',      url: 'https://sealevel.nasa.gov' },
      { name: 'UCAR SciEd',         desc: 'Weather, climate, and atmosphere resources',       url: 'https://scied.ucar.edu' },
      { name: 'Nat Geo Education',  desc: 'Tectonics, climate, and Earth systems',            url: 'https://education.nationalgeographic.org' },
      { name: 'PBS LearningMedia',  desc: 'Plate boundaries, earthquakes, and volcanoes',     url: 'https://www.pbslearningmedia.org' },
    ],
  },
};


/* ================================================================
   2. STATE
   What is happening right now. Not all of this persists between
   sessions. See STORAGE for what gets saved to localStorage.
   ================================================================ */
const state = {
  /*
    Which top-level page is showing.
    Values: 'dashboard' | 'lab' | 'about' | 'export'
    (Module steps are handled by state.course, not state.view.)
  */
  view: 'dashboard',

  /*
    When inside a module: { id, step, isReview }
    - id:       'lpc' or 'journal'
    - step:     current step index (0-based)
    - isReview: true when the user has already completed the
                module and is revisiting freely
    null when on any top-level page.
  */
  course: null,

  /* Typed content in the lesson plan workspace */
  ws: {},

  /* Journal text answers: keyed by "sectionIndex-questionIndex" */
  journal: {},

  /* Self-assessment radio values: keyed by indicator index */
  ratings: {},

  /* Active subject tab in the Science Lab */
  labSubject: 'Physics',

  /* Current search query in the Science Lab */
  labSearch: '',

  /* Which PDF export to show: 'lpc' or 'journal' */
  exportType: null,
};


/* ================================================================
   3. STORAGE
   Thin wrappers around localStorage. All keys are prefixed with
   'gabay_' to avoid collisions with other scripts on the page.
   ================================================================ */
const store = {
  get:    (k)    => { try { return JSON.parse(localStorage.getItem('gabay_' + k)); } catch(e) { return null; } },
  set:    (k, v) => { try { localStorage.setItem('gabay_' + k, JSON.stringify(v)); } catch(e) {} },
  remove: (k)    => { try { localStorage.removeItem('gabay_' + k); } catch(e) {} },
};

/* Convenience functions for the most-used items */
const getUser  = ()   => store.get('user');
const getProg  = ()   => store.get('prog') || {};
const isDone   = (id) => !!getProg()[id + '_done'];

/* Mark a module complete */
function markDone(id) {
  const p = getProg();
  p[id + '_done'] = true;
  store.set('prog', p);
}

/* Remember which step the user is on so they can continue later */
function saveStep(id, step) {
  const p = getProg();
  p[id + '_step'] = step;
  store.set('prog', p);
}
function getSavedStep(id) {
  return getProg()[id + '_step'] || 0;
}

/* Persist all typed content (workspace, journal, ratings) */
function saveContent() {
  store.set('ws',      state.ws);
  store.set('journal', state.journal);
  store.set('ratings', state.ratings);
}

/* Load all typed content back into state (called on login) */
function loadContent() {
  state.ws      = store.get('ws')      || {};
  state.journal = store.get('journal') || {};
  state.ratings = store.get('ratings') || {};
}


/* ================================================================
   4. HELPERS
   Small, pure utility functions.
   ================================================================ */

/* Escape user-typed content before inserting it into HTML */
const esc = (s) =>
  String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* Quick getElementById shorthand */
const $ = (id) => document.getElementById(id);

/* Time-based greeting (used on the dashboard) */
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* Make a textarea grow to fit its content instead of showing a scrollbar */
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

/* Apply autoGrow to every textarea in a container */
function initAutoGrow(container) {
  container.querySelectorAll('textarea').forEach(ta => {
    autoGrow(ta);
    ta.addEventListener('input', () => autoGrow(ta));
  });
}

/*
  Save a field's value into state on every keystroke.
  Fields use data-save-key (the key) and data-store-in ('ws' or 'journal').
*/
function bindAutoSave(container) {
  container.querySelectorAll('[data-save-key]').forEach(el => {
    el.addEventListener('input', () => {
      const key    = el.dataset.saveKey;
      const target = el.dataset.storeIn;
      if (target === 'ws')      state.ws[key]      = el.value;
      if (target === 'journal') state.journal[key] = el.value;
      saveContent();
    });
  });
}

/* Respect the user's OS preference for reduced motion */
const SCROLL_BEHAVIOR = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';


/* ================================================================
   5. NAVIGATION
   All navigation goes through these two functions.

   Using explicit function calls (not hashchange events) avoids
   a timing bug we hit in an earlier build: the browser does not
   always fire hashchange before the code that depends on it runs.
   These functions always call render() directly and immediately.
   ================================================================ */

/* Navigate to a top-level page (dashboard, lab, about, export) */
function navigateTo(view, options = {}) {
  state.course     = null;
  state.view       = view;
  state.exportType = options.exportType || null;
  closeSidebar();
  render();
}

/* Enter a module at a specific step */
function enterModule(id, step) {
  if (!isUnlocked(id)) return; /* Silently ignore locked modules */

  const done = isDone(id);
  state.course = {
    id,
    step:     step !== undefined ? step : (done ? 0 : getSavedStep(id)),
    isReview: done,
  };
  state.view = id;
  closeSidebar();
  renderStep();
}

/* Leave a module and go back to the dashboard */
function exitModule() {
  if (state.course) saveStep(state.course.id, state.course.step);
  state.course = null;
  state.view   = 'dashboard';
  render();
}


/* ================================================================
   6. COURSE ENGINE
   Defines what steps exist in each module, controls gating,
   and handles advancing through steps.
   ================================================================ */

/*
  Returns an ordered array of step objects for a given module.
  Each object has a 'type' field that tells the renderer
  which view function to call.
*/
function stepsFor(id) {
  if (id === 'lpc') {
    return [
      /* One screen per lesson plan element (11 total) */
      ...DATA.elements.map((el, i) => ({ type: 'element', elementIndex: i })),
      /* Guidelines screen */
      { type: 'guidelines' },
      /* The fillable lesson plan workspace */
      { type: 'workspace' },
      /* Completion screen (always last) */
      { type: 'complete' },
    ];
  }
  if (id === 'journal') {
    /* Flatten all journal questions into one step each */
    const qSteps = DATA.journal.flatMap((section, si) =>
      section.questions.map((q, qi) => ({
        type:          'question',
        sectionIndex:  si,
        questionIndex: qi,
        key:           `${si}-${qi}`,
      }))
    );
    return [
      ...qSteps,
      { type: 'selfassess' },
      { type: 'complete' },
    ];
  }
  return [];
}

/* Sequential gating: Lesson Planning must be done before Journal */
function isUnlocked(id) {
  if (id === 'lpc')     return true;
  if (id === 'journal') return isDone('lpc');
  return false;
}

/*
  Advance to the next step.
  If the next step is 'complete', mark the module as done first.
*/
function goNext() {
  if (!state.course) return;
  const steps = stepsFor(state.course.id);
  const next  = state.course.step + 1;

  if (next >= steps.length) return;

  /* Entering the complete screen means we are done */
  if (steps[next].type === 'complete') {
    markDone(state.course.id);
    state.course.isReview = true;
  }

  state.course.step = next;
  saveStep(state.course.id, next);
  renderStep();
}

/*
  Go back one step.
  Only available in review mode: first-pass is strictly linear.
*/
function goPrev() {
  if (!state.course || state.course.step <= 0) return;
  state.course.step--;
  saveStep(state.course.id, state.course.step);
  renderStep();
}

/*
  Jump directly to a step within a module (review mode, via the
  sidebar accordion).

  Lesson Planning elements stand alone, so clicking one straight
  from the dashboard enters the module fresh at that exact step.

  The Reflective Journal builds each answer on the ones before it,
  so a cold click (not already inside the module) is a no-op, same
  as the original behavior -- Journal can only be entered from its
  module header, which always starts at the beginning.
*/
function jumpToStep(id, step) {
  if (state.course && state.course.id === id) {
    state.course.step = step;
    saveStep(id, step);
    renderStep();
    return;
  }
  if (id === 'journal') return; /* Must enter from the start */
  enterModule(id, step);
}


/* ================================================================
   7. SIDEBAR
   Builds the sidebar HTML dynamically to reflect the current
   view, module state, and progress, then wires up its events.
   ================================================================ */
function buildSidebarHTML() {
  const v = state.view;

  /* --- Module entry: title + status badge + optional accordion --- */
  function moduleEntry(mod) {
    const unlocked = isUnlocked(mod.id);
    const done     = isDone(mod.id);
    const active   = state.course && state.course.id === mod.id;

    /*
      Status indicator. Done and locked communicate through an icon
      alone -- a checkmark or a lock reads faster than a text badge,
      especially at sidebar width. Active keeps its text pill since
      there's no single glyph for "this is the one you're in".
    */
    let badge = '';
    let statusText = '';
    if (done) {
      statusText = ', completed';
      badge = `<span class="sb-status-icon sb-status-icon-done" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="9"/>
                    <polyline points="8 12.3 10.8 15 16 9.5"/>
                  </svg>
                </span>`;
    } else if (active) {
      statusText = ', active';
      badge = `<span class="sb-module-status sb-status-active">Active</span>`;
    } else if (!unlocked) {
      statusText = ', locked';
      badge = `<span class="sb-status-icon sb-status-icon-locked" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="10.5" width="14" height="9.5" rx="2"/>
                    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>
                  </svg>
                </span>`;
    }

    /* Header classes */
    let hdrClass = 'sb-module-hdr';
    if (active) hdrClass += ' is-active';
    if (done)   hdrClass += ' is-done';

    /*
      Accordion: show step list when this module is active (you are
      inside it) or done (free navigation in review mode).
    */
    let accordion = '';
    if (active || done) {
      const steps = stepsFor(mod.id);

      /*
        Build one sidebar item per step.
        Skip the complete screen (no sidebar link needed).
        For journal questions, only show the section name once
        (on the first question of each section).
      */
      const items = steps
        .map((s, i) => {
          /* Label for this step */
          let label = '';
          if (s.type === 'element')    label = DATA.elements[s.elementIndex].title;
          if (s.type === 'guidelines') label = 'Challenge Guidelines';
          if (s.type === 'workspace')  label = 'Build Your Plan';
          if (s.type === 'question') {
            /* Only show section header on first question in that section */
            if (s.questionIndex > 0) return null;
            label = DATA.journal[s.sectionIndex].section;
          }
          if (s.type === 'selfassess') label = 'Self-Assessment';
          if (s.type === 'complete')   return null; /* Skip */

          if (!label) return null;

          /* Visual state */
          const isCurrent = active && state.course.step === i;
          const isPast    = active ? state.course.step > i : done;

          let cls = 'sb-step-item';
          if (isCurrent) cls += ' is-current';
          if (isPast)    cls += ' is-done';

          /* In review mode: clickable buttons. First pass: static spans. */
          if (done) {
            return `<button class="${cls}" data-jump-module="${mod.id}" data-jump="${i}"
                            aria-label="Go to: ${esc(label)}">
                      <span class="sb-step-dot"></span>${esc(label)}
                    </button>`;
          }
          return `<span class="${cls}">
                    <span class="sb-step-dot"></span>${esc(label)}
                  </span>`;
        })
        .filter(Boolean) /* Remove nulls */
        .join('');

      accordion = `<div class="sb-accordion">${items}</div>`;
    }

    /* Make the module header clickable only if unlocked */
    const attrs = unlocked
      ? `data-enter-module="${mod.id}"`
      : `disabled aria-disabled="true"`;

    return `
      <div class="sb-module">
        <button class="${hdrClass}" ${attrs} aria-label="${esc(mod.title)}${statusText}">
          ${esc(mod.title)} ${badge}
        </button>
        ${accordion}
      </div>`;
  }

  /* --- Assemble the full nav --- */
  return `
    <p class="sb-section-label">Learning Journey</p>
    ${DATA.modules.map(moduleEntry).join('')}

    <div class="sb-divider"></div>

    <p class="sb-section-label">Resources</p>
    <button class="sb-link ${v === 'lab' ? 'is-active' : ''}" data-nav="lab">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 3h6l1 7H8L9 3z"/>
        <path d="M8 10l-4 9a1 1 0 0 0 .9 1.4h14.2a1 1 0 0 0 .9-1.4L16 10"/>
        <line x1="12" y1="3" x2="12" y2="10"/>
      </svg>
      Science Innovation Lab
    </button>

    <div class="sb-divider"></div>

    <button class="sb-link ${v === 'about' ? 'is-active' : ''}" data-nav="about">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      About GABAY
    </button>`;
}

/* Rebuild sidebar HTML and re-attach its event listeners */
function renderSidebar() {
  $('sidebar-nav').innerHTML = buildSidebarHTML();

  /* Module header buttons */
  $('sidebar-nav').querySelectorAll('[data-enter-module]').forEach(btn =>
    btn.addEventListener('click', () => enterModule(btn.dataset.enterModule)));

  /* Step jump buttons (review mode accordion) */
  $('sidebar-nav').querySelectorAll('[data-jump]').forEach(btn =>
    btn.addEventListener('click', () =>
      jumpToStep(btn.dataset.jumpModule, Number(btn.dataset.jump))));

  /* Top-level nav links (Lab, About) */
  $('sidebar-nav').querySelectorAll('[data-nav]').forEach(btn =>
    btn.addEventListener('click', () => navigateTo(btn.dataset.nav)));
}

/* --- Sidebar open / close (mobile drawer) --- */
const sidebar  = $('sidebar');
const backdrop = $('sidebar-backdrop');

function openSidebar() {
  sidebar.classList.add('is-open');
  backdrop.classList.add('is-open');
  $('mobile-menu-btn').setAttribute('aria-expanded', 'true');
  $('sidebar-close-btn').focus();
}
function closeSidebar() {
  sidebar.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  $('mobile-menu-btn').setAttribute('aria-expanded', 'false');
}


/* ================================================================
   8. VIEWS
   Pure functions: read DATA and state, return an HTML string.
   No DOM mutations happen inside these functions.
   ================================================================ */

/* --- Dashboard --- */
function vDashboard() {
  const user     = getUser() || { name: 'there' };
  const lpcDone  = isDone('lpc');
  const jrnDone  = isDone('journal');
  const bothDone = lpcDone && jrnDone;
  const doneCount = [lpcDone, jrnDone].filter(Boolean).length;

  /* Decide which module to feature on the "Continue" card */
  let featured   = null;
  let actionLabel = 'Start';
  if (!lpcDone) {
    featured    = DATA.modules[0];
    actionLabel = getSavedStep('lpc') > 0 ? 'Continue' : 'Start';
  } else if (!jrnDone) {
    featured    = DATA.modules[1];
    actionLabel = getSavedStep('journal') > 0 ? 'Continue' : 'Start';
  }

  /*
    While Lesson Planning is unfinished, the Journal is gated. Rather
    than leave that unexplained, name the reason next to a lock icon
    so it's scannable without reading a full sentence -- useful on
    mobile especially.
  */
  const lockedHint = !lpcDone
    ? `<div class="dash-locked-hint">
         <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
           <rect x="5" y="10.5" width="14" height="9.5" rx="2"/>
           <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>
         </svg>
         Finish Module ${DATA.modules[0].num} to unlock ${esc(DATA.modules[1].title)}
       </div>`
    : '';

  const continueCard = bothDone
    ? `<div class="dash-complete-banner">
         <h2>&#x1F389; Journey Complete</h2>
         <p>You have finished both modules. Use the sidebar to review your work or explore the Science Lab.</p>
       </div>`
    : `<div class="dash-continue-card">
         <h2>Continue Learning</h2>
         <p class="dash-module-title">${esc(featured.title)}</p>
         <div class="dash-progress-row">
           <span class="dash-progress-label">${esc(featured.subtitle)}</span>
           <button class="btn btn-primary" data-enter-module="${featured.id}">
             ${actionLabel} &rarr;
           </button>
         </div>
         ${lockedHint}
       </div>`;

  return `
    <div class="dashboard">
      <div class="dash-greeting">
        <p class="eyebrow">Your Course</p>
        <h1>${esc(greeting())}, ${esc(user.name)}.</h1>
        <p class="lede" style="margin-bottom:0">
          AI can plan with you, but it cannot teach for you.
          The skills you build here are yours to keep.
        </p>
      </div>

      ${continueCard}

      <div class="dash-prog-card">
        <p class="dash-prog-fraction">${doneCount}/2</p>
        <p class="dash-prog-of">modules complete</p>
        <div class="dash-segs">
          ${[lpcDone, jrnDone].map(d => `<div class="dash-seg ${d ? 'is-done' : ''}"></div>`).join('')}
        </div>
        <div class="dash-seg-labels">
          <span>Lesson Planning</span><span>Reflection</span>
        </div>
      </div>

      <div class="dash-resource-card">
        <div>
          <h3>&#x1F52C; Science Innovation Lab</h3>
          <p>Browse curated simulations to support your lesson planning.</p>
        </div>
        <button class="btn btn-ghost btn-sm" data-nav="lab">Open Library</button>
      </div>
    </div>`;
}

/* --- One lesson element screen --- */
function vElement(step) {
  const el  = DATA.elements[step.elementIndex];
  const num = step.elementIndex + 1;
  return `
    <div class="step-screen">
      <span class="step-count">Element ${num} of ${DATA.elements.length}</span>
      <h1>${esc(el.title)}</h1>
      <p class="step-def">${esc(el.definition)}</p>
      <span class="kicker">Why it matters</span>
      <p style="color:var(--text-soft);max-width:var(--content-max)">${esc(el.why)}</p>
      <span class="kicker" style="margin-top:1.2rem">Example</span>
      <div class="step-example">${esc(el.example)}</div>
    </div>`;
}

/* --- Guidelines screen --- */
function vGuidelines() {
  const g = DATA.guidelines;
  return `
    <div class="step-screen">
      <span class="step-count">Before you begin</span>
      <h1>Challenge Guidelines</h1>
      <p class="step-def">
        The goal is to grow your own judgment as a teacher.
        Use AI to help polish, never to do the thinking for you.
      </p>
      <ul class="guidelines-rules">
        ${g.rules.map((r, i) => `
          <li>
            <span class="rule-num">${i + 1}</span>
            <span>${esc(r)}</span>
          </li>`).join('')}
      </ul>
      <div class="guidelines-grid">
        <div class="guidelines-panel ok">
          <h3>AI is fine, after your draft</h3>
          <ul>${g.ok.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
        <div class="guidelines-panel no">
          <h3>Not allowed</h3>
          <ul>${g.no.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`;
}

/* --- Lesson plan workspace --- */
function vWorkspace() {
  const strat  = state.ws.strategy || '7es';
  const phases = DATA.phases.filter(p => strat === '7es' || p.fivesToo);

  /* Helper: one labeled textarea with auto-save */
  function field(key, label, placeholder, storeIn = 'ws') {
    const val = storeIn === 'ws' ? (state.ws[key] || '') : '';
    return `
      <div class="field-group">
        <label for="ws-${key}">${esc(label)}</label>
        <textarea
          id="ws-${key}"
          data-save-key="${key}"
          data-store-in="${storeIn}"
          placeholder="${esc(placeholder)}"
        >${esc(val)}</textarea>
      </div>`;
  }

  return `
    <div class="workspace">
      <span class="step-count">Lesson Planning Workspace</span>
      <h1>Build Your Plan</h1>
      <p class="lede" style="margin-bottom:2rem">
        Write it yourself first. Every field saves automatically as you type.
      </p>

      <h2>Lesson Details</h2>
      <div class="ws-two-col">
        ${field('name',  'Teacher Name',    'e.g., Maria Santos')}
        ${field('grade', 'Grade & Subject', 'e.g., Grade 7 Science')}
      </div>
      ${field('topic', 'Topic', 'e.g., Science 7, States of Matter: Phase Changes')}

      <h2>Objectives</h2>
      ${field('outcomes', 'Learning Outcomes',            'What should learners know and demonstrate?')}
      ${field('obj_cog',  'Cognitive Objective (thinking)', 'e.g., Explain how temperature affects particle movement.')}
      ${field('obj_aff',  'Affective Objective (values)',   'e.g., Appreciate the importance of water conservation.')}
      ${field('obj_psy',  'Psychomotor Objective (skills)', 'e.g., Demonstrate proper laboratory safety procedure.')}

      <h2>Subject Matter</h2>
      ${field('references',  'References',            'K-12 Curriculum Guide, DepEd modules, textbooks...')}
      ${field('materials',   'Instructional Materials','Charts, slides, videos, simulations...')}
      ${field('values',      'Values Integration',    'e.g., Environmental stewardship, scientific honesty.')}

      <h2>Methodology</h2>
      ${field('methodology', 'Teaching Methodology', 'e.g., Inquiry-based learning with guided discovery.')}

      <h2>Strategy</h2>
      <div class="field-group">
        <label>Instructional Framework</label>
        <div class="strategy-toggle" role="group" aria-label="Choose lesson strategy">
          <button data-strat="5es" aria-pressed="${strat === '5es'}">5Es</button>
          <button data-strat="7es" aria-pressed="${strat === '7es'}">7Es</button>
        </div>
        <p class="muted" style="margin-top:0.5rem">
          ${strat === '7es'
            ? '7Es adds Elicit (surfaces prior knowledge) and Extend (pushes learning further).'
            : '5Es is the core sequence. Switch to 7Es to add Elicit and Extend.'}
        </p>
      </div>

      <h2>Lesson Procedure</h2>
      ${phases.map(p => `
        <div class="phase-card">
          <div class="phase-card-hdr">
            <h3>${esc(p.k)}</h3>
            ${p.added ? '<span class="phase-tag">7Es only</span>' : ''}
          </div>
          ${p.hint ? `<p class="phase-hint">${esc(p.hint)}</p>` : ''}
          <div class="ws-two-col">
            <div class="field-group">
              <label for="ws-t_${p.k}">Teacher Activity</label>
              <textarea id="ws-t_${p.k}" data-save-key="t_${p.k}" data-store-in="ws"
                        placeholder="What will you do?">${esc(state.ws['t_' + p.k] || '')}</textarea>
            </div>
            <div class="field-group">
              <label for="ws-s_${p.k}">Student Activity</label>
              <textarea id="ws-s_${p.k}" data-save-key="s_${p.k}" data-store-in="ws"
                        placeholder="What will students do?">${esc(state.ws['s_' + p.k] || '')}</textarea>
            </div>
          </div>
        </div>`).join('')}

      <div style="margin-top:1.5rem">
        <button class="btn btn-primary" data-go-next>Submit My Plan &rarr;</button>
      </div>
    </div>`;
}

/* --- One journal question screen --- */
function vQuestion(step) {
  const section  = DATA.journal[step.sectionIndex];
  const question = section.questions[step.questionIndex];
  const saved    = state.journal[step.key] || '';

  /* Calculate question number across all sections */
  const qNum = DATA.journal
    .slice(0, step.sectionIndex)
    .reduce((sum, s) => sum + s.questions.length, 0) + step.questionIndex + 1;
  const qTotal = DATA.journal.reduce((sum, s) => sum + s.questions.length, 0);

  return `
    <div class="step-screen">
      <span class="question-section">${esc(section.section)}</span>
      <p class="question-text">${esc(question)}</p>
      <div class="field-group">
        <label for="q-${step.key}" class="muted">Question ${qNum} of ${qTotal}</label>
        <textarea
          id="q-${step.key}"
          data-save-key="${step.key}"
          data-store-in="journal"
          placeholder="Write honestly. A sentence or two is enough."
          rows="5"
        >${esc(saved)}</textarea>
      </div>
    </div>`;
}

/* --- Self-assessment screen --- */
function vSelfAssess() {
  return `
    <div class="self-assess">
      <span class="step-count">Final step</span>
      <h1>Self-Assessment</h1>
      <p class="lede" style="margin-bottom:1.6rem">
        Rate yourself honestly.
        1 means strongly disagree, 5 means strongly agree. There are no wrong answers.
      </p>
      ${DATA.indicators.map((text, i) => `
        <div class="rating-row">
          <span class="rating-label">${esc(text)}</span>
          <span class="rating-scale" role="radiogroup" aria-label="${esc(text)}">
            ${[1,2,3,4,5].map(n => `
              <label>
                <input type="radio" name="rating-${i}" value="${n}"
                       ${state.ratings[i] == n ? 'checked' : ''}>
                <span class="rating-dot">${n}</span>
              </label>`).join('')}
          </span>
        </div>`).join('')}
      <div style="margin-top:1.6rem">
        <button class="btn btn-primary" data-go-next>Submit Reflection &rarr;</button>
      </div>
    </div>`;
}

/* --- Module complete screen --- */
function vComplete(id) {
  const c = id === 'lpc'
    ? {
        title:   'Lesson Plan Complete.',
        message: 'You built this lesson plan yourself, from start to finish. That is how the skill develops.',
        nextLabel: 'Continue to Reflection &rarr;',
        nextAttr:  'data-enter-module="journal"',
        exportType: 'lpc',
        exportLabel: 'Export Lesson Plan',
      }
    : {
        title:   'Reflection Complete.',
        message: 'Honest reflection is where one good lesson becomes a better habit. Well done.',
        nextLabel: 'Return to Dashboard',
        nextAttr:  'data-go-dashboard',
        exportType: 'journal',
        exportLabel: 'Export Journal',
      };

  return `
    <div class="complete-screen">
      <div class="complete-check" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h1>${esc(c.title)}</h1>
      <p class="lede">${esc(c.message)}</p>
      <div class="complete-actions">
        <button class="btn btn-primary" ${c.nextAttr}>${c.nextLabel}</button>
        <button class="btn btn-ghost"   data-export="${c.exportType}">${c.exportLabel}</button>
      </div>
    </div>`;
}

/* --- Science Innovation Laboratory --- */
function vLab() {
  const subjects = Object.keys(DATA.sims);
  const q        = state.labSearch.trim().toLowerCase();
  const sims     = q
    ? subjects.flatMap(sub =>
        DATA.sims[sub]
          .filter(s => (s.name + s.desc).toLowerCase().includes(q))
          .map(s => ({ ...s, _sub: sub }))
      )
    : DATA.sims[state.labSubject];

  return `
    <div class="lab-screen">
      <p class="eyebrow">Reference Library</p>
      <h1>Science Innovation Lab</h1>
      <p class="lede">
        Browse curated virtual simulations for your science lessons.
        This library is always available and does not affect your module progress.
      </p>

      <div class="lab-tabs" role="group" aria-label="Filter by subject">
        ${subjects.map(sub => `
          <button
            class="lab-tab ${!q && state.labSubject === sub ? 'is-active' : ''}"
            data-tab="${esc(sub)}"
            aria-pressed="${!q && state.labSubject === sub}"
          >${esc(sub)}</button>`).join('')}
      </div>

      <div class="field-group" style="max-width:480px">
        <label for="lab-search">Search all simulations</label>
        <input type="text" id="lab-search"
               placeholder="e.g., circuits, photosynthesis, plate tectonics"
               value="${esc(state.labSearch)}">
      </div>

      <p class="muted" style="margin-bottom:0.8rem">
        ${q
          ? `Showing results for "${esc(state.labSearch)}" (${sims.length} found)`
          : `Showing ${esc(state.labSubject)} (${sims.length} simulations)`}
      </p>

      <div class="sim-list" id="sim-list">
        ${simCards(sims, q)}
      </div>
    </div>`;
}

/* Helper: renders simulation cards, used by both vLab and the live search update */
function simCards(sims, showSubject) {
  if (!sims.length) return '<p class="muted">No simulations found. Try a different search term.</p>';
  return sims.map(s => `
    <div class="sim-card">
      <h3>${esc(s.name)}${s._sub ? ` <span class="muted" style="font-size:0.8rem">&middot; ${esc(s._sub)}</span>` : ''}</h3>
      <p>${esc(s.desc)}</p>
      <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Open simulation &nearr;</a>
    </div>`).join('');
}

/* --- About GABAY --- */
function vAbout() {
  return `
    <div class="about-screen">
      <p class="eyebrow">About This Platform</p>
      <h1>GABAY EduTech</h1>
      <p class="lede">
        A guided coursework platform developed as part of a research study on
        Intelligent-TPACK development among pre-service science teachers.
      </p>
      <p class="motto">
        Guiding future teachers toward intelligent and responsible technology integration.
      </p>

      <h2>Research Overview</h2>
      <p>
        This platform supports a study examining how pre-service science teachers can develop
        independent lesson planning, pedagogical reflection, and responsible AI use.
        It is designed to guide, not replace, the teacher's own thinking.
      </p>

      <h2>Research Objectives</h2>
      <ul>
        <li>Develop independent lesson planning skills among pre-service science teachers.</li>
        <li>Foster critical reflection on the role of AI in teaching preparation.</li>
        <li>Promote responsible and intentional technology integration in education.</li>
      </ul>

      <h2>The Research Team</h2>
      <div class="team-grid" style="margin-top:0.9rem">
        <div class="team-card">
          <p class="tc-name">John Napoleon G. Florita</p>
          <p class="tc-role">Leader</p>
        </div>
        <div class="team-card">
          <p class="tc-name">Ma. Christine M. Convocar</p>
          <p class="tc-role">Member</p>
        </div>
        <div class="team-card">
          <p class="tc-name">Jennifer D. Villaester</p>
          <p class="tc-role">Member</p>
        </div>
        <div class="team-card">
          <p class="tc-name">Niño R. Villa</p>
          <p class="tc-role">Member</p>
        </div>
      </div>

      <h2>Acknowledgements</h2>
      <p>
        The researchers thank the participating institutions, their faculty advisers, and the
        pre-service teachers who generously gave their time to this study.
      </p>
    </div>`;
}

/* --- PDF export: lesson plan --- */
function vExportLpc() {
  const ws    = state.ws;
  const strat = ws.strategy || '7es';
  const phases = DATA.phases.filter(p => strat === '7es' || p.fivesToo);
  const meta  = [ws.name, ws.grade].filter(Boolean).map(esc).join(' &middot; ');

  return `
    <div class="export-screen">
      <div class="export-actions no-print">
        <button class="btn btn-primary" id="print-btn">Save as PDF</button>
        <button class="btn btn-ghost"   data-go-dashboard>Back to Dashboard</button>
      </div>
      <p class="muted no-print" style="margin-bottom:1.4rem">
        Review your lesson plan below, then click "Save as PDF" to open your browser's print dialog.
        Choose "Save as PDF" as the destination.
      </p>
      <div class="print-doc">
        <div class="pd-head">
          <p class="pd-title">Lesson Plan</p>
          ${meta ? `<p class="pd-meta">${meta}</p>` : ''}
        </div>
        <p class="pd-h">I. Learning Outcomes</p>
        <p>${esc(ws.outcomes || '')}</p>
        <p class="pd-h">II. Objectives</p>
        <table class="pd-table"><tbody>
          <tr><th>Cognitive</th><td>${esc(ws.obj_cog || '')}</td></tr>
          <tr><th>Affective</th><td>${esc(ws.obj_aff || '')}</td></tr>
          <tr><th>Psychomotor</th><td>${esc(ws.obj_psy || '')}</td></tr>
        </tbody></table>
        <p class="pd-h">III. Subject Matter</p>
        <table class="pd-table"><tbody>
          <tr><th>Topic</th><td>${esc(ws.topic || '')}</td></tr>
          <tr><th>References</th><td>${esc(ws.references || '')}</td></tr>
          <tr><th>Materials</th><td>${esc(ws.materials || '')}</td></tr>
          <tr><th>Values</th><td>${esc(ws.values || '')}</td></tr>
        </tbody></table>
        <p class="pd-h">IV. Methodology</p>
        <p>${esc(ws.methodology || '')}</p>
        <p class="pd-h">V. Procedure (${strat.toUpperCase()})</p>
        <table class="pd-table proc">
          <thead><tr><th>Phase</th><th>Teacher Activity</th><th>Student Activity</th></tr></thead>
          <tbody>
            ${phases.map(p => `
              <tr>
                <th>${esc(p.k)}</th>
                <td>${esc(ws['t_' + p.k] || '')}</td>
                <td>${esc(ws['s_' + p.k] || '')}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

/* --- PDF export: reflective journal --- */
function vExportJournal() {
  const j = state.journal;
  const r = state.ratings;

  return `
    <div class="export-screen">
      <div class="export-actions no-print">
        <button class="btn btn-primary" id="print-btn">Save as PDF</button>
        <button class="btn btn-ghost"   data-go-dashboard>Back to Dashboard</button>
      </div>
      <p class="muted no-print" style="margin-bottom:1.4rem">
        Review your reflection below, then save it as PDF.
      </p>
      <div class="print-doc">
        <div class="pd-head">
          <p class="pd-title">Reflective Teaching Journal</p>
        </div>
        ${DATA.journal.map((section, si) =>
          section.questions.map((q, qi) => {
            const key = `${si}-${qi}`;
            return `
              <p class="pd-h">${esc(section.section)}</p>
              <p style="font-size:0.85rem;color:#555;margin-bottom:0.3rem">${esc(q)}</p>
              <p style="margin-bottom:0.9rem">${esc(j[key] || '')}</p>`;
          }).join('')
        ).join('')}
        <p class="pd-h">Self-Assessment</p>
        <table class="pd-table"><tbody>
          ${DATA.indicators.map((text, i) => `
            <tr>
              <th style="width:auto">${esc(text)}</th>
              <td style="width:3rem;text-align:center;font-weight:700">${esc(r[i] || '')}</td>
            </tr>`).join('')}
        </tbody></table>
      </div>
    </div>`;
}


/* ================================================================
   9. RENDERER
   Maps state to the correct view and updates surrounding chrome.
   ================================================================ */

/* Maps a step object to the right view function */
function stepHTML(step) {
  switch (step.type) {
    case 'element':    return vElement(step);
    case 'guidelines': return vGuidelines();
    case 'workspace':  return vWorkspace();
    case 'question':   return vQuestion(step);
    case 'selfassess': return vSelfAssess();
    case 'complete':   return vComplete(state.course.id);
    default:           return '';
  }
}

/*
  renderStep() is called whenever we are inside a module.
  It renders the current step, updates the course header,
  and appends the navigation bar at the bottom.
*/
function renderStep() {
  const { id, step: idx, isReview } = state.course;
  const steps = stepsFor(id);
  const step  = steps[idx];
  const total = steps.length;
  const mod   = DATA.modules.find(m => m.id === id);

  /* Show course header, hide mobile bar */
  $('course-hdr').hidden        = false;
  $('mobile-bar').style.display = 'none';

  /* Update course header text */
  $('course-hdr-title').textContent = mod ? mod.title : '';
  $('course-hdr-step').textContent  = step.type !== 'complete'
    ? `${idx + 1} / ${total - 1}` /* -1: exclude complete screen from count */
    : '';

  /* Update progress bar percentage */
  const pct = total > 1 ? Math.round((idx / (total - 1)) * 100) : 100;
  $('course-progress-fill').style.width = pct + '%';
  $('course-progress').setAttribute('aria-valuenow', String(pct));

  /* Hide the Quit button on the complete screen */
  $('quit-btn').hidden = step.type === 'complete';

  /* Render step content */
  $('app').innerHTML = stepHTML(step);

  /*
    Append the sticky navigation bar at the bottom.
    Workspace and self-assess have their own inline submit buttons,
    so they don't need a Continue button in the bar.
  */
  if (step.type !== 'complete') {
    const hasInlineSubmit = step.type === 'workspace' || step.type === 'selfassess';
    const isLastContent   = idx === total - 2; /* One step before complete */
    const showBack        = isReview && idx > 0;

    if (!hasInlineSubmit) {
      const backHTML = showBack
        ? `<button class="step-back-btn" data-go-prev>&larr; Back</button>`
        : `<span></span>`; /* Keeps flex space-between balanced */

      const nextLabel = isLastContent ? 'Finish &#10003;' : 'Continue &rarr;';

      $('app').insertAdjacentHTML('beforeend', `
        <div class="step-actions">
          ${backHTML}
          <button class="btn btn-primary" data-go-next>${nextLabel}</button>
        </div>`);
    } else if (isReview && showBack) {
      /* In review mode, still show the Back button even on inline-submit screens */
      $('app').insertAdjacentHTML('beforeend', `
        <div class="step-actions">
          <button class="step-back-btn" data-go-prev>&larr; Back</button>
          <span></span>
        </div>`);
    }
  }

  /* Wire up all events for this step */
  bindStep(step);

  /* Update sidebar to reflect current position */
  renderSidebar();

  /* Scroll to top and move focus for screen reader announcements */
  window.scrollTo({ top: 0, behavior: 'auto' });
  $('main-content').focus();
}

/*
  render() is called for top-level pages:
  dashboard, lab, about, and the export views.
*/
function render() {
  /* Always hide the course header on top-level pages */
  $('course-hdr').hidden        = true;
  $('mobile-bar').style.display = '';

  /* Pick the right view */
  let html = '';
  switch (state.view) {
    case 'lab':      html = vLab();           break;
    case 'about':    html = vAbout();         break;
    case 'export':
      html = state.exportType === 'lpc' ? vExportLpc() : vExportJournal();
      break;
    default:         html = vDashboard();     break;
  }

  $('app').innerHTML = html;

  /* Wire up events for this view */
  bindView();

  /* Update sidebar */
  renderSidebar();

  /* Scroll to top */
  window.scrollTo({ top: 0, behavior: 'auto' });
  updateScrollFab();
}


/* ================================================================
   10. BIND
   Wires up event listeners after each render.
   Split into bindStep() and bindView() for clarity.
   ================================================================ */

/* Events for module step screens */
function bindStep(step) {
  const app = $('app');

  /* Auto-growing textareas and auto-save */
  initAutoGrow(app);
  bindAutoSave(app);

  /* Navigation buttons */
  app.querySelectorAll('[data-go-next]').forEach(b => b.addEventListener('click', goNext));
  app.querySelectorAll('[data-go-prev]').forEach(b => b.addEventListener('click', goPrev));

  /* Complete screen actions */
  app.querySelectorAll('[data-go-dashboard]').forEach(b =>
    b.addEventListener('click', () => { state.course = null; navigateTo('dashboard'); }));

  app.querySelectorAll('[data-enter-module]').forEach(b =>
    b.addEventListener('click', () => enterModule(b.dataset.enterModule)));

  app.querySelectorAll('[data-export]').forEach(b =>
    b.addEventListener('click', () => {
      state.course = null;
      navigateTo('export', { exportType: b.dataset.export });
    }));

  /* Workspace: strategy toggle (5Es / 7Es) */
  if (step.type === 'workspace') {
    app.querySelectorAll('[data-strat]').forEach(b =>
      b.addEventListener('click', () => {
        const y = window.scrollY; /* Preserve the user's scroll position */
        state.ws.strategy = b.dataset.strat;
        saveContent();
        renderStep();
        requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
      }));
  }

  /* Self-assess: save radio selection */
  if (step.type === 'selfassess') {
    app.querySelectorAll('[type="radio"]').forEach(r =>
      r.addEventListener('change', e => {
        const match = e.target.name.match(/rating-(\d+)/);
        if (match) {
          state.ratings[Number(match[1])] = Number(e.target.value);
          saveContent();
        }
      }));
  }
}

/* Events for top-level pages */
function bindView() {
  const app = $('app');

  /* Common navigation actions */
  app.querySelectorAll('[data-nav]').forEach(b =>
    b.addEventListener('click', () => navigateTo(b.dataset.nav)));

  app.querySelectorAll('[data-go-dashboard]').forEach(b =>
    b.addEventListener('click', () => navigateTo('dashboard')));

  app.querySelectorAll('[data-enter-module]').forEach(b =>
    b.addEventListener('click', () => enterModule(b.dataset.enterModule)));

  /* Export: print button */
  const printBtn = $('print-btn');
  if (printBtn) printBtn.addEventListener('click', () => { try { window.print(); } catch(e) {} });

  /* Science Lab: subject tabs and live search */
  if (state.view === 'lab') {
    app.querySelectorAll('[data-tab]').forEach(b =>
      b.addEventListener('click', () => {
        state.labSubject = b.dataset.tab;
        state.labSearch  = '';
        render();
      }));

    const searchEl = $('lab-search');
    if (searchEl) {
      searchEl.addEventListener('input', e => {
        state.labSearch = e.target.value;

        /* Update only the sim list, not the entire page */
        const subjects = Object.keys(DATA.sims);
        const q        = state.labSearch.trim().toLowerCase();
        const newSims  = q
          ? subjects.flatMap(sub =>
              DATA.sims[sub]
                .filter(s => (s.name + s.desc).toLowerCase().includes(q))
                .map(s => ({ ...s, _sub: sub }))
            )
          : DATA.sims[state.labSubject];

        const list = $('sim-list');
        if (list) list.innerHTML = simCards(newSims, !!q);

        /* Update tab active states to match */
        app.querySelectorAll('[data-tab]').forEach(t =>
          t.classList.toggle('is-active', !q && state.labSubject === t.dataset.tab));
      });
    }
  }

  updateScrollFab();
}


/* ================================================================
   11. INIT
   Sets up all static event listeners and starts the application.
   ================================================================ */

/* --- Login --- */
function handleLogin() {
  const name  = $('login-name').value.trim();
  const email = $('login-email').value.trim().toLowerCase();
  const errEl = $('login-error');
  const valid = name.length > 0 && email.includes('@') && email.endsWith('.edu.ph');

  if (!valid) { errEl.hidden = false; return; }

  errEl.hidden = true;
  store.set('user', { name, email });
  loadContent();
  showApp();
  navigateTo('dashboard');
}

$('login-submit').addEventListener('click', handleLogin);
['login-name', 'login-email'].forEach(id =>
  $(id).addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); }));

function showLogin() {
  $('login-screen').style.display = 'flex';
  $('app-wrapper').hidden = true;
}

function showApp() {
  $('login-screen').style.display = 'none';
  $('app-wrapper').hidden = false;
  /* Fill in user info in the sidebar footer */
  const user = getUser();
  if (user) {
    $('sidebar-user-info').innerHTML =
      `<p class="sb-user-name">${esc(user.name)}</p>
       <p class="sb-user-email">${esc(user.email)}</p>`;
  }
}

/* --- Logout --- */
$('logout-btn').addEventListener('click', () => {
  /* Clear everything: storage and in-memory state */
  ['user','prog','ws','journal','ratings'].forEach(k => store.remove(k));
  state.ws = {}; state.journal = {}; state.ratings = {};
  state.course = null; state.view = 'dashboard';
  closeSidebar();
  showLogin();
});

/* --- Mobile sidebar --- */
$('mobile-menu-btn').addEventListener('click', openSidebar);
$('sidebar-close-btn').addEventListener('click', closeSidebar);
$('sidebar-backdrop').addEventListener('click', closeSidebar);
$('sidebar').addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

/* --- Sidebar logo: go to dashboard --- */
$('sidebar-logo-btn').addEventListener('click', () => {
  state.course = null;
  navigateTo('dashboard');
});

/* --- Quit modal --- */
function openQuitModal()  {
  $('quit-modal').hidden = false;
  $('modal-stay').focus();
}
function closeQuitModal() {
  $('quit-modal').hidden = true;
  $('quit-btn').focus();
}

$('quit-btn').addEventListener('click', openQuitModal);
$('modal-stay').addEventListener('click', closeQuitModal);
$('modal-leave').addEventListener('click', () => { closeQuitModal(); exitModule(); });

/* Focus trap inside the modal (WCAG 2.1.2 - No Keyboard Trap) */
$('quit-modal').addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeQuitModal(); return; }
  if (e.key !== 'Tab')    return;
  const els = [$('modal-stay'), $('modal-leave')];
  const i   = els.indexOf(document.activeElement);
  e.preventDefault();
  els[(i + (e.shiftKey ? -1 : 1) + els.length) % els.length].focus();
});

/* --- Scroll FAB --- */
const fab = $('scroll-fab');

function updateScrollFab() {
  const canScroll = document.body.scrollHeight - window.innerHeight > 60;
  fab.parentElement.style.display = canScroll ? 'block' : 'none';
  const atTop   = window.scrollY < (document.body.scrollHeight - window.innerHeight) / 2;
  fab.innerHTML = atTop ? '&#8595;' : '&#8593;';
  fab.setAttribute('aria-label', atTop ? 'Scroll to bottom' : 'Scroll to top');
  fab.title = atTop ? 'Scroll to bottom' : 'Scroll to top';
}

fab.addEventListener('click', () => {
  const atTop = window.scrollY < (document.body.scrollHeight - window.innerHeight) / 2;
  window.scrollTo({ top: atTop ? document.body.scrollHeight : 0, behavior: SCROLL_BEHAVIOR });
});
window.addEventListener('scroll', updateScrollFab, { passive: true });
window.addEventListener('resize', updateScrollFab);

/* --- Start the app --- */
const existingUser = getUser();
if (existingUser) {
  loadContent();
  showApp();
  navigateTo('dashboard');
} else {
  showLogin();
}
