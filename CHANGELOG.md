# Changelog

All notable changes to GABAY EduTech are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), listed newest first.

## [1.0.4] - Reverted logout persistence, restored full reset

### Changed
- Version 1.0.3 changed logout to preserve saved progress, on the assumption that persistence was always the intended behavior. On review, this created a worse problem than the one it solved.
- This prototype has no backend and no real accounts. `localStorage` is scoped to the browser, not to a person. If progress survived logout, a second person logging in on the same device would see the first person's saved work appear under their own name, which is a more serious problem than losing progress on logout.
- Logout now clears everything again: session, progress flags, and all typed content. Logging out is treated as handing the device to the next person with a clean slate, which is the correct behavior for a single-device simulation without real user accounts.

## [1.0.3] - Logout session fix (superseded by 1.0.4)

### Fixed
- Logging out was clearing every key in `localStorage`, including saved progress, workspace content, journal answers, and self-assessment ratings, not just the login session.
- Root cause: the logout handler looped over five storage keys (`user`, `prog`, `ws`, `journal`, `ratings`) and deleted all of them, when only `user` needed to go.
- Fix at the time: logout was changed to remove only the session key, leaving all saved content in place.
- Note: this change was reverted in 1.0.4 once the shared-device implication became clear. Kept here for an accurate history rather than erased.

## [1.0.2] - Favicon fix for Android Chrome

### Fixed
- The compass icon was not appearing in the browser tab on Android Chrome. Instead, the browser fell back to showing the first letter of the page title.
- Root cause: the favicon was implemented as an SVG data URI. Android Chrome does not render SVG data-URI favicons and silently ignores them, unlike desktop browsers and iOS Safari.
- Fix: the favicon is now generated at runtime with the Canvas API. A small inline script draws the compass emoji onto a 64x64 canvas and sets the resulting PNG as the favicon. This renders correctly across every browser tested, including Android Chrome.

## [1.0.1] - Mobile navigation and visual fixes

### Fixed
- **Mobile sidebar could silently block all taps after closing.** The backdrop behind the sidebar was controlled with `display: block` / `display: none`, but a responsive media query independently forced `display: block` at narrow widths. Clearing the inline style on close fell back to that media query value, leaving an invisible layer sitting over the entire page that absorbed every tap. Fixed by switching the backdrop to `opacity` and `pointer-events` instead of toggling `display`, so closing the sidebar can no longer leave a hidden layer capturing input.
- **"About This Platform" eyebrow label was not amber like the rest of the site.** A general text-color rule for paragraphs inside the About page (`.about-screen p`) was overriding the amber `.eyebrow` class, since the eyebrow element is still a `<p>` tag underneath. Fixed by excluding `.eyebrow` from that rule with a `:not()` selector.

## [1.0.0] - Initial release

The first complete, deployed version of the platform, built to match the finalized design specification: a guided two-module learning journey with a persistent sidebar, single-purpose dashboard, and a strict separation between progress and content.

### Added
- **Login gate** simulating institutional access: name and email required, `.edu.ph` domain enforced client-side, inline error messaging on invalid input.
- **Dashboard** showing exactly one primary action ("Continue Learning") plus a segmented progress indicator (X of 2 modules complete) and a shortcut into the Science Lab.
- **Lesson Planning Challenge module**: 11 individual screens covering each element of a lesson plan (Learning Outcomes, Objectives, Topic, References, Instructional Materials, Learning Activities, Concept, Skills to Develop, Values Integration, Methodology, Strategy Applied), followed by a guidelines screen and a full fillable workspace with a live 5Es / 7Es strategy toggle that adjusts the procedure fields shown.
- **Reflective Journal module**: 11 open-ended questions across three themed sections (Learning Experience, Lesson Planning Decisions, Responsible AI Use), followed by an 8-indicator self-assessment rated 1 to 5.
- **Sequential module gating**: the Journal stays locked, with its sidebar entry disabled, until the Lesson Planning module is marked complete.
- **Review mode**: once a module is completed, its sidebar accordion switches from static progress markers to fully clickable step links, so any element, question, or workspace section can be revisited or edited directly, without replaying the module from the start.
- **Progress and content stored separately**: a module's completion flag is set once and never reversed, while every field inside it stays editable indefinitely. Nothing about the interface treats a finished module as locked.
- **Science Innovation Lab**: a subject-tabbed, live-searchable library of virtual science simulations across Physics, Chemistry, Biology, and Earth Science. Always accessible from the sidebar, never gated, and does not affect module progress.
- **About GABAY page**: research context, objectives, and a team section.
- **PDF export** for both the lesson plan and the reflective journal, formatted as a clean printable document and generated through the browser's native print dialog, no external library required.
- **Automatic persistence** via `localStorage`: login session, module completion, current step, and every typed field are saved continuously, so closing the tab and returning later resumes exactly where the user left off.
- **Fully responsive layout**: a sticky sidebar rail on desktop that converts to a slide-in drawer with a hamburger toggle on tablet and mobile.
- **Accessibility built in from the start**: a skip-to-content link, visible keyboard focus rings throughout, `role="progressbar"` with live ARIA values on the module progress bar, `role="dialog"` with a focus trap on the Quit confirmation modal, `aria-live` regions on form errors, and full support for `prefers-reduced-motion`.

### Verified
- Every file passed a Node.js syntax check.
- Every element ID referenced in the JavaScript was cross-checked against the HTML to confirm it exists.
- Every CSS class toggled by the JavaScript was cross-checked against the stylesheet to confirm it's defined.
- A 54-point automated check confirmed every major feature described above was present and wired up correctly before deployment.

### Deployed
- Live at [gabay-edutech.netlify.app](https://gabay-edutech.netlify.app), connected to this GitHub repository for continuous deployment.
