# Rayan — portfolio & a small detour

A five-page static website at https://nine-winged.github.io/Portfolio/.
GitHub Pages publishes the root of main; there is no build step.

## Local preview

Run python -m http.server 8047 --bind 127.0.0.1 here.
No package installation, external fonts or animation libraries are needed.

## Content and routes

- index.html: professional introduction, abstract cobalt contour, current focus and four selected work areas, with a secondary link to the playground.
- journey.html: an optional illustrated playground. Coffee, a matching game and an unfinished investigation lead the interactions; context, a reservoir model, music, fall and two dramas offer further discoveries. Brief source notes are optional.
- work.html: questions behind current AI, scientific software and GPU projects, with verified milestones.
- research.html: questions, methods, lab work and publications.
- achievements.html: recognition and selected context.

Professional content lives in HTML. Navigation, project cases, resume and the playground illustration remain available without JavaScript. The playground requires JavaScript for its toys and provides a short static introduction otherwise. Personal source documents and private journal entries are not included in this repo.

## Enhancement and assets

assets/js/main.js handles shared navigation and project filters. assets/js/home-motion.js handles the home contour and its pause control. assets/js/playground.js handles the personal toys, native dialogs, resets and motion control; assets/css/playground.css is isolated to the personal page. assets/img/after-hours.svg is original vector artwork for a symbolic setting.

assets/js/playground-audio.js synthesizes an original instrumental locally with Web Audio: 16 bars at 76 BPM, two passes and an ending. It uses no recordings, samples or lyrics. The user requested a soft instrumental informed by BTS; Pied Piper, Butterfly and Blue & Grey are linked as musical references. Playback starts only from the sound button. Volume is adjustable, and hiding the page suspends playback until another explicit click. No Spotify player, account connection, analytics or remote audio request is made by the site.

Continuous motion honors reduced-motion preferences, can be paused, and stops offscreen or in hidden tabs. Precision-free object buttons and keyboard controls are available alongside illustrated hotspots. Native dialogs close on Escape and restore focus. The reservoir and bread are symbolic illustrations, not recorded experimental or installation data.

The canonical resume is assets/docs/Mostakim_Khan_Rayan_Resume.pdf, linked in every footer. Research status was reviewed in October 2026. The SoftwareX manuscript has a revision invitation and a public SSRN preprint. Personal AI is in development; new decoder heads still need training and behavioral qualification remains pending. Iris/RAFT contributions are merged; listed cuML work remains open. Update these statements only when new evidence supports the change.
