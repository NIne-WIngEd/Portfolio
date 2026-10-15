/* Discrete, local toys for the optional personal page. No accounts or telemetry. */
(() => {
  'use strict';
  const scene = document.querySelector('[data-scene]');
  if (!scene || typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  const dialogs = [...document.querySelectorAll('.play-dialog')];
  const reaction = document.querySelector('[data-scene-reaction]');
  const propStories = {
  "desk-coffee": [
    "The cup before the rest…",
    "Before the first sip…",
    "Morning shifts taught me how to make this. There’s a little craft hiding inside something that looks like an ordinary cup."
  ],
  "desk-cards": [
    "Just one round. Probably…",
    "The part after ‘one more’…",
    "Cards with friends have a way of making a small moment last longer. The game here is different; the excuse to stay is familiar."
  ],
  "desk-a-question": [
    "The A wasn’t the ending…",
    "What happened after the grade…",
    "An A on a bread experiment left me with another question. I tried a microscope and a microbiology book; the bread went bad before I finished."
  ],
  "desk-context": [
    "Good. Until you change one thing…",
    "How a house became a question…",
    "A conversation about Hogwarts houses turned into a debate about character. I wanted to know what happened to a ‘good’ quality when the circumstances changed."
  ],
  "desk-reservoir": [
    "One wire. Sixty-four families…",
    "The part beyond the model…",
    "I adapted a competition model’s water-level control for a building serving 64 families. The community helped turn the little idea into something useful."
  ],
  "desk-music": [
    "There’s something under the quiet…",
    "What stays after the song…",
    "BTS and One Direction are part of my story. I like the way music can hold a feeling after the words have run out."
  ],
  "desk-screen": [
    "The credits weren’t the ending…",
    "What followed me off-screen…",
    "Some stories send me back to the beginning. Another nudged me toward keeping a journal; I wanted somewhere for the feeling to go."
  ],
  "desk-fall": [
    "Something changes with the leaves…",
    "The season I keep returning to…",
    "Fall is my favorite season. Something about it makes me hopeful, even when the calendar says things are winding down."
  ],
  "rooftop-telescope": [
    "There’s more past the last light…",
    "Why this points farther…",
    "A bread experiment once sent me chasing answers through a microscope and a microbiology book. Change the lens; I still want to look a little farther."
  ],
  "rooftop-chess": [
    "The obvious move isn’t the only one…",
    "The move I didn’t see…",
    "Chess and pool both pull me in. I like the pause before a move, when looking a little longer can change what you thought you saw."
  ],
  "rooftop-headphones": [
    "This night has another layer…",
    "The city, a little quieter…",
    "Music has meant a lot to me, especially BTS. This rooftop gets its own original melody: a little space for the feeling between notes."
  ],
  "rooftop-coffee": [
    "This cup has a morning behind it…",
    "Where the habit began…",
    "I learned to make coffee on morning shifts. Here the same small ritual has wandered into an imagined late-night scene."
  ],
  "rooftop-star-chart": [
    "Those dots could be something else…",
    "The pattern after the pattern…",
    "My learning has never fitted neatly in one box. I like following the connections between science, people and the questions they leave each other."
  ],
  "airport-departures": [
    "The board changed. So did the view…",
    "The chapter between places…",
    "Japan and Wisconsin were both student-exchange chapters for me. A different place can quietly rearrange what feels familiar."
  ],
  "airport-suitcase": [
    "Some things don’t fit in here…",
    "What comes back with you…",
    "The suitcase is imagined, but those exchanges are part of my life. I brought back more ways of looking at things than any bag could hold."
  ],
  "airport-postcards": [
    "Turn it over. There’s another side…",
    "Two places in my story…",
    "Japan and Wisconsin each became a chapter away from home. These little drawings are a way to revisit them without pretending a postcard holds the whole story."
  ],
  "airport-book": [
    "The margin has another idea…",
    "The page that kept opening…",
    "Harry Potter was part of my childhood reading. A discussion about its houses eventually escaped the page and became a much larger question about people."
  ],
  "airport-paper-plane": [
    "It hasn’t quite left yet…",
    "A small departure of its own…",
    "Japan and Wisconsin both made away from home part of my story. This little flight is for the bit in between: wondering what happens when you go."
  ],
  "forest-lantern": [
    "The dark is keeping a few things…",
    "What the small light brings back…",
    "I spent three nights in a swamp forest. It was a very different way to meet the world than sitting safely behind a desk."
  ],
  "forest-tent": [
    "There’s a way in. First…",
    "The room with a much bigger outside…",
    "Three nights in a swamp forest made for a very different room. The world feels a little larger when you step outside your usual one."
  ],
  "forest-compass": [
    "A straight line won’t tell you everything…",
    "A direction, then another…",
    "The forest expedition is part of my story. This compass turns that memory into a small invitation to try a direction you weren’t already facing."
  ],
  "forest-boots": [
    "These didn’t stay clean for long…",
    "What the boots bring back…",
    "I spent three nights in a swamp forest. The footprints here are imagined, but stepping outside my usual surroundings was very real."
  ],
  "sea-paper-boat": [
    "A little push. Then what?",
    "The question that travelled…",
    "Before high school, I spent fifteen days on a ship with my father. The paper boat is imagined; the long horizon is borrowed from that memory."
  ],
  "sea-compass": [
    "The horizon isn’t a finish line…",
    "Where looking farther began…",
    "A fifteen-day cruise with my father gave me a different view of the world. This compass is a small reminder that there can be more than one direction to follow."
  ],
  "sea-notebook": [
    "One conversation wasn’t finished…",
    "The page after the voyage…",
    "On that cruise, a conversation with my father wandered into batteries, automation and energy losses. The voyage ended; there was still plenty to wonder about."
  ],
  "sea-porthole": [
    "There’s a missing piece behind this…",
    "What the conversation lit up…",
    "A discussion at sea with my father led into batteries and automation. This little circuit is an imagined way to keep playing with the question."
  ]
};
  const focusTargets = new WeakMap();
  let mismatchTimer = null;
  let flipped = [];
  let cardsLocked = false;
  let matches = 0;
  const table = document.querySelector('[data-match-table]');
  const cardStatus = document.querySelector('[data-card-status]');
  function clearMismatch() {
    window.clearTimeout(mismatchTimer);
    mismatchTimer = null;
    flipped.forEach(card => {
      if (!card.classList.contains('matched')) {
        card.classList.remove('flipped');
        card.textContent = '✳';
        card.setAttribute('aria-label', `Turn card ${card.dataset.index}`);
      }
    });
    flipped = [];
    cardsLocked = false;
  }
  function openToy(id, invoker) {
    const dialog = document.getElementById(id);
    if (!dialog || !dialogs.includes(dialog)) return;
    const parentDialog = invoker?.closest('.play-dialog');
    const origin = (parentDialog && focusTargets.get(parentDialog)) || invoker || document.querySelector(`[data-open="${id}"]`);
    dialogs.forEach(other => { if (other.open) other.close(); });
    focusTargets.set(dialog, origin);
    const matching = [...document.querySelectorAll(`[data-open="${id}"][data-prop]`)];
    const samePlace = matching.find(button => button.dataset.prop.startsWith(`${scene.dataset.place}-`));
    const fallback = id === 'music-dialog' ? 'desk-music' : (id === 'context-dialog' ? 'desk-context' : null);
    const propKey = invoker?.dataset.prop || samePlace?.dataset.prop || fallback || matching[0]?.dataset.prop;
    const story = propStories[propKey];
    const section = dialog.querySelector('[data-prop-story]');
    if (story && section) {
      section.dataset.propStory = propKey;
      section.querySelector('h3').textContent = story[1];
      section.querySelector('p').textContent = story[2];
    }
    dialog.showModal();
    reaction.textContent = 'Make yourself at home.';
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button[data-open]');
    if (button) openToy(button.dataset.open, button);
  });
  dialogs.forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (dialog.id === 'cards-dialog') clearMismatch();
      const target = focusTargets.get(dialog);
      if (!dialogs.some(other => other.open) && target?.isConnected) target.focus();
      focusTargets.delete(dialog);
    });
  });

  // A four-step cup, with a visual result after every action.
  const coffeeBench = document.querySelector('.coffee-bench');
  const coffeeButtons = [...document.querySelectorAll('[data-coffee]')];
  const coffeeStatus = document.querySelector('[data-coffee-status]');
  let coffeeStage = 0;
  const coffeeLines = ['Start with the ice.', 'Now the espresso.', 'A little shake?', 'Finish with the milk.', 'Learned this on morning shifts.'];
  function renderCoffee() {
    coffeeBench.dataset.coffeeStage = String(coffeeStage);
    coffeeStatus.textContent = coffeeLines[coffeeStage];
    coffeeButtons.forEach((button, index) => {
      button.disabled = index !== coffeeStage;
      button.classList.toggle('done', index < coffeeStage);
    });
  }
  coffeeButtons.forEach((button, index) => button.addEventListener('click', () => {
    if (index !== coffeeStage || coffeeStage >= 4) return;
    coffeeStage++;
    renderCoffee();
    const next = coffeeButtons[coffeeStage] || document.querySelector('[data-reset-coffee]');
    next.focus();
    if (coffeeStage === 4) reaction.textContent = 'One cup. A little less sleepy.';
  }));
  document.querySelector('[data-reset-coffee]').addEventListener('click', () => { coffeeStage = 0; renderCoffee(); coffeeButtons[0].focus(); });

  // Original matching game. Closing or redealing clears an in-flight mismatch.
  const symbols = ['☀', '☀', '❧', '❧', '✦', '✦'];
  function deal() {
    clearMismatch();
    matches = 0;
    const deck = [...symbols];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    table.replaceChildren();
    deck.forEach((symbol, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'match-card';
      card.textContent = '✳';
      card.dataset.index = String(index + 1);
      card.dataset.symbol = symbol;
      card.setAttribute('aria-label', `Turn card ${index + 1}`);
      card.addEventListener('click', () => {
        if (cardsLocked || card.disabled || flipped.includes(card)) return;
        card.classList.add('flipped');
        card.textContent = symbol;
        card.setAttribute('aria-label', `Card ${index + 1}: ${symbol}`);
        flipped.push(card);
        if (flipped.length !== 2) { cardStatus.textContent = 'And the other one?'; return; }
        if (flipped[0].dataset.symbol === flipped[1].dataset.symbol) {
          flipped.forEach(match => { match.classList.add('matched'); match.disabled = true; });
          matches++;
          flipped = [];
          cardStatus.textContent = matches === 3 ? 'All three. Okay, one more?' : `${matches} of 3 pairs. Keep going.`;
          if (matches === 3) reaction.textContent = 'That was supposed to be one quick round.';
        } else {
          cardsLocked = true;
          cardStatus.textContent = 'Not quite. Try two again.';
          mismatchTimer = window.setTimeout(clearMismatch, 850);
        }
      });
      table.append(card);
    });
    cardStatus.textContent = 'Pick two. I’ll wait.';
  }
  document.querySelector('[data-reset-cards]').addEventListener('click', deal);
  deal();

  // The investigation stays unfinished, as it did in the source essay.
  const inspection = document.querySelector('[data-inspection]');
  const breadStatus = document.querySelector('[data-bread-status]');
  const inspectButton = document.querySelector('[data-inspect]');
  let inspectionStep = 0;
  const investigationLines = ['My teacher gave me an A. I had a question.', 'More shapes. Still more questions.', 'Hey, I tried, though.'];
  inspectButton.addEventListener('click', () => {
    inspectionStep = (inspectionStep + 1) % 3;
    inspection.dataset.inspection = String(inspectionStep);
    breadStatus.textContent = investigationLines[inspectionStep];
    inspectButton.textContent = ['Take a closer look ↗', 'And then? ↗', 'Look again ↺'][inspectionStep];
    reaction.textContent = 'The question outlasted the assignment.';
  });
  document.querySelector('[data-lens]').addEventListener('input', event => {
    const position = 20 + Number(event.target.value) * .6;
    document.querySelector('.inspection-lens').style.left = `calc(${position}% - 41px)`;
  });

  // Explicit imagined circumstances; no score or judgments about the visitor.
  const wordStage = document.querySelector('[data-context]');
  const qualities = {
    ambition: ['Ambition', 'Making a plan', 'It can help you begin something worth trying.', 'Sharing the spotlight', 'Whose turn is it to be heard?'],
    calculation: ['Calculation', 'Using a limited resource', 'Thinking ahead can leave more for everyone.', 'Keeping a friendship', 'Some things are difficult to turn into a calculation.'],
    protectiveness: ['Protectiveness', 'Offering a hand', 'A little care can make someone feel safer.', 'Choosing for someone else', 'Care can leave too little room for their choice.']
  };
  let quality = 'ambition';
  let circumstance = 0;
  function renderContext() {
    const values = qualities[quality];
    wordStage.dataset.context = String(circumstance);
    document.querySelector('[data-quality-label]').textContent = values[0];
    document.querySelector('[data-context-caption]').textContent = values[circumstance ? 3 : 1];
    document.querySelector('[data-context-status]').textContent = values[circumstance ? 4 : 2];
    document.querySelectorAll('[data-quality]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.quality === quality)));
  }
  document.querySelectorAll('[data-quality]').forEach(button => button.addEventListener('click', () => { quality = button.dataset.quality; renderContext(); }));
  document.querySelector('[data-change-context]').addEventListener('click', () => { circumstance = 1 - circumstance; renderContext(); reaction.textContent = 'I usually have a “but what if…” somewhere.'; });

  const waterBench = document.querySelector('[data-water]');
  const waterStatus = document.querySelector('[data-water-status]');
  const connectButton = document.querySelector('[data-connect-sensor]');
  function connectWater(connected) {
    waterBench.dataset.water = connected ? 'connected' : 'manual';
    waterStatus.textContent = connected ? 'At the threshold, the signal stops the motor.' : 'The motor needs someone to stop it.';
    document.querySelector('[data-motor-label]').textContent = connected ? 'Motor stopped' : 'Motor on';
    connectButton.disabled = connected;
    if (connected) reaction.textContent = 'An idea feels different when someone can use it.';
  }
  connectButton.addEventListener('click', () => connectWater(true));
  document.querySelector('[data-reset-water]').addEventListener('click', () => connectWater(false));

  let fall = false;
  document.addEventListener('click', event => {
    if (!event.target.closest('button[data-fall]')) return;
    fall = !fall;
    scene.classList.toggle('fall-in', fall);
    document.querySelector('[data-autumn]').dataset.autumn = String(fall);
    document.querySelectorAll('[data-fall]').forEach(choice => choice.setAttribute('aria-pressed', String(fall)));
    reaction.textContent = fall ? 'Fall is my favorite. I tend to get hopeful in fall.' : 'There’s no particular order.';
  });

  let island = false;
  let rewatches = 0;
  const screen = document.querySelector('[data-screen]');
  const showStatus = document.querySelector('[data-show-status]');
  document.querySelector('[data-show-next]').addEventListener('click', () => {
    island = !island;
    rewatches = 0;
    screen.dataset.screen = island ? 'island' : 'winter';
    document.querySelector('[data-show-title]').textContent = island ? 'An island that keeps the seasons' : 'A winter with room for warmth';
    screen.querySelector('.screen-number').textContent = island ? '02' : '01';
    showStatus.textContent = island ? 'This one left a blank page waiting for me.' : 'Back to this one. Again.';
  });
  document.querySelector('[data-rewatch]').addEventListener('click', () => {
    rewatches++;
    screen.classList.remove('replaying');
    window.requestAnimationFrame(() => screen.classList.add('replaying'));
    showStatus.textContent = rewatches > 1 ? 'Okay. One more.' : 'Apparently, one watch wasn’t the plan.';
  });

  const soundToggle = document.querySelector('[data-sound-toggle]');
  const soundShortcut = document.querySelector('[data-audio-shortcut]');
  soundShortcut.addEventListener('click', () => soundToggle.click());
  function audioAppearance() {
    const running = soundToggle.dataset.audioState === 'running';
    document.body.dataset.audio = running ? 'running' : 'off';
    soundShortcut.textContent = running ? 'Turn sound off ♫' : 'Turn sound on ♫';
  }
  new MutationObserver(audioAppearance).observe(soundToggle, { attributes:true, attributeFilter:['data-audio-state'] });

  const motionButton = document.querySelector('[data-motion-toggle]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused = false;
  let sceneVisible = true;
  function motionAppearance() {
    document.body.dataset.motion = (manuallyPaused || reduced.matches || document.hidden || !sceneVisible) ? 'paused' : 'running';
    motionButton.hidden = reduced.matches;
    motionButton.textContent = manuallyPaused ? 'Play motion' : 'Pause motion';
  }
  motionButton.addEventListener('click', () => { manuallyPaused = !manuallyPaused; motionAppearance(); });
  reduced.addEventListener('change', motionAppearance);
  document.addEventListener('visibilitychange', motionAppearance);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { sceneVisible = entries[0].isIntersecting; motionAppearance(); }).observe(scene);

  // Each place uses its own original illustration and a small set of physical toys.
  const places = {
    desk: { image:'after-hours.svg', title:'A few things I can’t leave alone.', line:'There’s no particular order.', alt:'An illustrated desk with coffee, cards, an investigation, a reservoir model and an autumn window.', objects:[
      ['coffee-dialog','Coffee?','Coffee',430,440], ['cards-dialog','One quick round','Cards',700,510],
      ['bread-dialog','Look again','A question',280,340], ['context-dialog','It depends…','Context',830,350],
      ['water-dialog','One small change','Reservoir',1015,445], ['music-dialog','A little music','Music',160,520],
      ['screen-dialog','One more episode','Screen',935,180], ['fall-dialog','Let fall in','Fall',300,150]
    ]},
    rooftop: { image:'rooftop.svg', title:'The city is still awake.', line:'A good night for one more move.', alt:'A late-night rooftop with a telescope, city lights, a chessboard, coffee and headphones.', objects:[
      ['sky-dialog','A little farther','Telescope',275,300], ['chess-dialog','Your move','Chess',820,495],
      ['music-dialog','Night music','Headphones',430,520], ['coffee-dialog','Still awake?','Coffee',670,490],
      ['sky-dialog','Connect the dots','Star chart',930,200]
    ]},
    airport: { image:'airport.svg', title:'Somewhere between here and there.', line:'A gate, a book, and a little time.', alt:'A bright airport waiting corner with a plane outside, luggage, postcards, a book and a paper plane.', objects:[
      ['travel-dialog','A change of scenery','Departures',920,170], ['travel-dialog','A few things to carry','Suitcase',250,520],
      ['travel-dialog','Wish you were here','Postcards',600,465], ['book-dialog','One more page','Book',840,500],
      ['flight-dialog','Cleared for takeoff','Paper plane',410,340]
    ]},
    forest: { image:'forest-camp.svg', title:'Just outside the familiar.', line:'Leave a little room for the unexpected.', alt:'A dusk camp among forest roots and water, with a lantern, tent, compass and muddy boots.', objects:[
      ['camp-dialog','A little light','Lantern',300,430], ['camp-dialog','What’s in there?','Tent',720,420],
      ['compass-dialog','Find your bearings','Compass',965,530], ['trail-dialog','Worth the mud','Boots',565,560]
    ]},
    sea: { image:'ship-deck.svg', title:'The horizon has room.', line:'A small push can start a long question.', alt:'A ship deck at dusk with an open horizon, a paper boat, a compass, a notebook and a porthole.', objects:[
      ['sea-dialog','Give it a push','Paper boat',600,430], ['compass-dialog','Follow the horizon','Compass',290,470],
      ['sea-dialog','A question at sea','Notebook',825,510], ['circuit-dialog','Make a connection','Porthole',970,300]
    ]}
  };
  const hotspots = document.querySelector('.scene-hotspots');
  const objectMenu = document.querySelector('.object-menu');
  const placeButtons = [...document.querySelectorAll('button[data-place]')];
  function setPlace(key) {
    if (!places[key]) return;
    const place = places[key];
    scene.dataset.place = key;
    const image = scene.querySelector('.room-illustration');
    image.src = `assets/img/${place.image}`;
    image.alt = place.alt;
    document.querySelector('[data-place-title]').textContent = place.title;
    reaction.textContent = place.line;
    placeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.place === key)));
    hotspots.replaceChildren();
    objectMenu.replaceChildren();
    const prompt = document.createElement('span');
    prompt.textContent = 'Or pick here';
    objectMenu.append(prompt);
    place.objects.forEach(([id, label, name, x, y]) => {
      const hotspot = document.createElement('button');
      hotspot.type = 'button';
      hotspot.className = 'scene-hotspot';
      hotspot.style.left = `${x / 12}%`;
      hotspot.style.top = `${y / 7.2}%`;
      const propKey = `${key}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const teaser = propStories[propKey][0];
      hotspot.setAttribute('aria-label', `${name}: ${teaser}`);
      const pin = document.createElement('span'); pin.className = 'hotspot-pin'; pin.textContent = id === 'bread-dialog' ? '?' : '+'; pin.setAttribute('aria-hidden', 'true');
      const caption = document.createElement('span'); caption.className = 'hotspot-label'; caption.textContent = teaser;
      hotspot.append(pin, caption);
      const choice = document.createElement('button'); choice.type = 'button'; choice.textContent = name;
      [hotspot, choice].forEach(button => {
        button.dataset.open = id;
        button.dataset.prop = propKey;
      });
      hotspots.append(hotspot); objectMenu.append(choice);
    });
    document.dispatchEvent(new CustomEvent('playground:place', { detail:{ place:key } }));
  }
  placeButtons.forEach(button => button.addEventListener('click', () => setPlace(button.dataset.place)));
  document.querySelector('.place-picker').hidden = false;
  setPlace('desk');

  document.querySelector('.scene-hotspots').hidden = false;
  document.querySelector('.object-menu').hidden = false;
  document.querySelectorAll('.scene-tools [data-open]').forEach(button => { button.hidden = false; });
  document.body.classList.add('playground-ready');
  motionAppearance();
  audioAppearance();
  const legacy = { bread:'bread-dialog', reservoir:'water-dialog', context:'context-dialog' };
  const fragment = window.location.hash.slice(1);
  const linkedDialog = legacy[fragment] || fragment;
  if (places[fragment]) setPlace(fragment);
  else if (dialogs.some(dialog => dialog.id === linkedDialog)) {
    const home = Object.keys(places).find(key => places[key].objects.some(object => object[0] === linkedDialog));
    if (home) setPlace(home);
    openToy(linkedDialog);
  }
})();
