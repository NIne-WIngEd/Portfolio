# Rayan Khan — portfolio & a small detour

A five-page static website at https://nine-winged.github.io/Portfolio/.
GitHub Pages publishes the root of main; there is no build step.

## Local preview

Run python -m http.server 8047 --bind 127.0.0.1 here.
No package installation, external fonts or animation libraries are needed.

## Content and routes

- index.html: professional introduction, abstract cobalt contour, current focus and four selected work areas, with a secondary link to the playground.
- journey.html: an optional illustrated playground. Five original illustrated places: a desk, late-night rooftop, airport waiting corner, forest camp and ship deck. All 26 props have a cliffhanger invitation and a short personal explanation at the end of their interaction. Shared toys retain different closing notes for each object. Screen stories use winter and island metaphors.
- work.html: questions behind current AI, scientific software and GPU projects, with verified milestones.
- research.html: questions, methods, lab work and publications.
- achievements.html: recognition and selected context.

Professional content lives in HTML. Navigation, project cases, resume and the playground illustration remain available without JavaScript. The playground requires JavaScript for its toys and provides a short introduction and all five illustrations otherwise. Personal source documents and private journal entries are not included in this repo.

## Enhancement and assets

assets/js/main.js handles shared navigation and project filters. assets/js/home-motion.js handles the home contour and its pause control. assets/js/playground.js handles place selection, existing toys, native dialogs, resets and motion control. playground-worlds.js adds the new toys. playground.css and playground-worlds.css are isolated to the personal page. All five scene SVGs use a 1200x720 coordinate system. Rooftop and airport are creative composite settings, not reconstructions of private events.

assets/js/playground-audio.js synthesizes five original instrumentals locally with Web Audio. The desk has warm keys at 76 BPM, rooftop has spacious minor harmonies at 66 BPM, departures has a brighter pulse at 88 BPM, camp has open fifths at 60 BPM, and the ship has a swaying three-beat piece at 70 BPM. Each uses two passes and an ending, with distinct notes and instrumentation. Scene changes fade between scores while preserving volume and playback consent. It uses no recordings, samples or lyrics. The user requested soft instrumentals informed by BTS; Pied Piper, Butterfly and Blue & Grey are linked as broad musical references. Playback starts only from the sound button. Volume is adjustable, and hiding the page suspends playback until another explicit click. No Spotify player, account connection, analytics or remote audio request is made by the site.

Continuous motion honors reduced-motion preferences, can be paused, and stops offscreen or in hidden tabs. Precision-free object buttons and keyboard controls are available alongside illustrated hotspots. Native dialogs close on Escape and restore focus. The reservoir and bread are symbolic illustrations, not recorded experimental or installation data.

The canonical resume is assets/docs/Rayan_Khan_Resume.pdf, linked in every footer. Its heading and PDF metadata use Rayan Khan; the supplied resume body and links are preserved. The former filename remains an identical copy for incoming links. Research status was reviewed in October 2026. The SoftwareX manuscript has a revision invitation and a public SSRN preprint. Personal AI is in development; new decoder heads still need training and behavioral qualification remains pending. Iris/RAFT contributions are merged; listed cuML work remains open. Update these statements only when new evidence supports the change.
