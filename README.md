# Rayan — An open notebook

A five-page static personal website at https://nine-winged.github.io/Portfolio/.
GitHub Pages publishes the root of `main`; there is no build step.

## Local preview

Run `python -m http.server 8047 --bind 127.0.0.1` here and open http://127.0.0.1:8047/.
No package installation, external fonts or animation libraries are required.

## Content and routes

- `index.html`: personal introduction, illustrated story mosaic, music/rewatch/everyday margins, and current work.
- `journey.html`: five stories with anchor links, optional margin notes and a reservoir-control illustration.
- `work.html`: questions behind current AI, scientific software and GPU projects, with verified milestones.
- `research.html`: questions, methods, lab work and publications.
- `achievements.html`: supporting recognition and selected context.

Content lives directly in HTML and stays readable without the script bundle.
Sources for the personal adaptations were reviewed with the user in October 2026;
private original documents and journal entries are not included in this repository.

## Enhancement and assets

`assets/css/styles.css` contains the shared design and notebook styles.
`assets/js/main.js` enables the mobile menu, project filters, optional mosaic motion
and the two-state reservoir illustration. Controls appear only after initialization.
Motion respects reduced-motion preferences, can be paused, and stops offscreen or
in a hidden tab. The reservoir drawing is an explanatory sketch, not installation data.
The current resume is `assets/docs/Mostakim_Khan_Rayan_Resume.pdf`, linked in every footer.

Research status was reviewed in October 2026. The SoftwareX manuscript has a revision
invitation and a public SSRN preprint. Personal AI remains in development; new decoder
heads still need training and behavioral qualification remains pending. Iris/RAFT
contributions are merged; the listed cuML contributions remain open. Update these
statements only when new evidence supports the change.
