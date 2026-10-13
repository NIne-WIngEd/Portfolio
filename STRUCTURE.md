# Site structure

The site keeps five static routes. index.html leads with work; journey.html is the optional personal playground. Work, research and recognition remain directly accessible from every page. Existing filenames are retained for incoming links.

Shared presentation is in assets/css/styles.css. Home additions are isolated in home-restore.css; personal-page presentation is in playground.css.

Shared menu/filter behavior is in assets/js/main.js. The home contour is isolated in home-motion.js. Personal interactions are isolated in playground.js, with optional local audio synthesis in playground-audio.js.

Native dialogs use IDs ending in -dialog and can be reached directly by hash, such as journey.html#water-dialog and journey.html#bread-dialog. Their controls have short discrete states. No game engine, remote content API or backend is used.

assets/img/after-hours.svg uses a 1200x720 coordinate system shared with the HTML hotspots. An object button list supplies an alternative to precise selection. The resume remains under assets/docs/.

Professional facts are explicit HTML rather than generated from a second data bundle. Curated personal adaptations appear only in the experience; raw sources are not stored here. GitHub Pages publishes the repository root from main.
