# GABAY EduTech

**A guided coursework platform that helps pre-service teachers build independent lesson-planning skills before leaning on AI.**

**Live site:** [gabay-edutech.netlify.app](https://gabay-edutech.netlify.app)

---

## Overview

GABAY EduTech was built as a research prototype for a thesis study on Intelligent-TPACK development among pre-service science teachers in the Philippines. The core argument behind the platform is simple: AI can help a teacher plan, but it cannot teach for them. Skills like lesson design and reflective judgment only form if a teacher builds them independently first.

The platform walks users through two sequential learning modules, both gated so the second only unlocks once the first is genuinely complete. A reference library of science simulations and a research-context page round out the experience. Every design decision, from the single-action dashboard to the strict step-by-step module flow, comes back to one guiding principle: **guide, don't overwhelm.**

## Features

- **Institutional login gate** simulating `.edu.ph` access control
- **Lesson Planning Challenge** - 11 lesson-element screens, guidelines, and a full fillable workspace with a 5Es / 7Es strategy toggle
- **Reflective Journal** - 11 guided questions across three themes, plus an 8-point self-assessment
- **Sequential module gating** - the Journal stays locked until the Lesson Plan is complete
- **Review mode** - once a module is finished, every step becomes a direct, clickable entry point for revisiting or editing
- **Science Innovation Lab** - a searchable, subject-filtered library of virtual science simulations, always accessible and never gated
- **PDF export** for both the lesson plan and the journal, generated through the browser's native print dialog
- **Persistent progress** - login state, step position, and everything typed are saved automatically via `localStorage`
- **Fully responsive** - a sticky sidebar on desktop, a slide-in drawer with backdrop on mobile
- **Built with accessibility in mind** - skip links, visible focus states, ARIA roles on the progress bar and modal, reduced-motion support, and color contrast checked against WCAG AA

## Tech stack

No frameworks, no build step, no backend.

- **HTML5** - semantic structure, ARIA attributes
- **CSS3** - custom properties as design tokens, responsive layout, CSS animations
- **JavaScript (ES6+)** - vanilla DOM rendering, `localStorage` persistence, Canvas API for the favicon
- **Hosting** - static deployment on Netlify, source controlled on GitHub

## Project structure

```
├── index.html   # Semantic HTML shell - login screen, sidebar, app frame
├── style.css    # Full stylesheet, organized into labeled sections
└── script.js    # App logic - content, state, routing, views, rendering
```

`script.js` is organized into clearly labeled layers: content data, runtime state, storage, navigation, a small course engine that controls step order and locking, view functions that return HTML, and a thin layer that binds events after each render. All platform text lives in a single `DATA` block at the top of the file, so updating copy never requires touching rendering logic.

## Running it locally

No install, no dependencies.

```bash
git clone https://github.com/<your-username>/gabay-edutech.git
cd gabay-edutech
```

Then just open `index.html` in a browser. That's the whole setup.

## Design philosophy

The interface intentionally avoids showing everything at once. Modules are strictly linear on first pass, one screen and one decision at a time, because a research platform meant to reduce AI-reliance shouldn't overwhelm the user into reaching for a summarizer. Progress and content are treated as separate concerns: a completed module's status never reverses, but the content inside it is always editable, and exporting a PDF is just a snapshot the user chooses to take, not a locked submission.

## Known limitations

This is a client-side prototype, not a production system. Worth knowing:

- The `.edu.ph` login check is a front-end simulation, not real authentication
- Progress and content are stored in the browser only; there is no backend or database
- There's no instructor-facing submission system; PDF export is manual
- The Science Lab ships with a working sample of simulations; the full intended set is a straightforward content addition, not an architecture change

## About this project

Built solo, end to end: research alignment, UI/UX design, development, testing, deployment, and documentation. Originally developed as a commissioned thesis research output. Shared for portfolio purposes; not licensed for reuse.

If you're reviewing this as part of a hiring process or want to talk about the build, feel free to reach out.
