# Site structure

The site keeps five static routes. index.html leads with work; journey.html is the optional personal playground. Work, research and recognition remain directly accessible from every page. Existing filenames are retained for incoming links.

Shared presentation is in assets/css/styles.css. Home additions are isolated in home-restore.css; personal-page presentation is in playground.css and playground-worlds.css.

Shared menu/filter behavior is in assets/js/main.js. The home contour is isolated in home-motion.js. Place selection and existing personal interactions are isolated in playground.js; the ten new visual toys are in playground-worlds.js, with optional local audio synthesis in playground-audio.js.

Native dialogs use IDs ending in -dialog and can be reached directly by hash, such as journey.html#water-dialog and journey.html#bread-dialog. Their controls have short discrete states. No game engine, remote content API or backend is used.

The five original scene SVGs in assets/img/ use a 1200x720 coordinate system shared with the HTML hotspots. The scene registry contains object coordinates and native dialog destinations; propStories supplies each object's cliffhanger and closing explanation. Hotspot and menu invokers carry data-prop so shared dialogs display the right story. Place hashes include #rooftop, #airport, #forest and #sea. An object button list supplies an alternative to precise selection. Scene changes emit playground:place; the audio module selects its own score and fades the previous graph before disposing it. Sound starts only after a click, and scene selection never resumes suspended playback. The canonical resume is assets/docs/Rayan_Khan_Resume.pdf; the old URL is preserved as an identical updated copy.

Professional facts are explicit HTML rather than generated from a second data bundle. Curated personal adaptations appear only in the experience; raw sources are not stored here. GitHub Pages publishes the repository root from main.
