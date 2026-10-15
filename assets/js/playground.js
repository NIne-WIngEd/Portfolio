/* Discrete, local toys for the optional personal page. No accounts or telemetry. */
(() => {
  'use strict';
  const scene = document.querySelector('[data-scene]');
  if (!scene || typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  const dialogs = [...document.querySelectorAll('.play-dialog')];
  const reaction = document.querySelector('[data-scene-reaction]');
  const propStories = {
  "desk-coffee": [
    "Four steps. One early shift…",
    "The order my hands remember…",
    "Starbucks training had me making shaken espresso, refreshers, matcha and americanos. This is the brown-sugar oatmilk one: ice, espresso, shake, milk. Some things I learned have a very different kind of lab bench."
  ],
  "desk-cards": [
    "Dinner was supposed to be the plan…",
    "Then someone brought out UNO…",
    "We cooked khichuri, meat and kheer for Eid, had friends over, and ended up playing UNO until 1:30 a.m. Four matches. I won two. Apparently I kept the statistics as carefully as the memory."
  ],
  "desk-a-question": [
    "The teacher gave it an A. I wasn’t done…",
    "The answer that went moldy…",
    "In seventh grade, a bread experiment left me wondering what the instructions hadn’t taught me to see. I went back with a microscope and a microbiology book. The bread went bad before I finished. Hey, I tried, though."
  ],
  "desk-context": [
    "Everyone ruled out one house…",
    "The argument escaped the castle…",
    "My friends picked every Hogwarts house except Slytherin. I asked whether ambition, calculation and pride were always bad. We started by choosing a house and ended up arguing about what circumstances do to a virtue."
  ],
  "desk-reservoir": [
    "The model had an unexpected second life…",
    "Sixty-four families, one useful piece…",
    "A water-level controller in my robotics model turned out to be useful beyond the competition. I proposed adapting it for our building’s reservoir. The neighbors helped bring it to life; the part I remember best is that the idea became something we made together."
  ],
  "desk-music": [
    "There’s a reason I once dropped the ‘a’…",
    "A small spelling confession…",
    "Zayn was my favorite in One Direction. I liked him enough to start spelling my name ‘Rayn’ for a while. Before music became a whole collection of memories, it had already edited my name."
  ],
  "desk-screen": [
    "I know what happens. Press play anyway…",
    "The plot isn’t the only reason…",
    "I used to dismiss dramas. Then my sister’s enthusiasm pulled me in, and now I have favorites I return to. Knowing the ending doesn’t seem to stop me from wanting another episode."
  ],
  "desk-fall": [
    "The calendar calls it an ending…",
    "I keep reading it as a beginning…",
    "Fall is my favorite season. The leaves are winding down, but something about it makes me hopeful. I don’t need the year to start over to feel like something might."
  ],
  "rooftop-telescope": [
    "Someone made the sky feel reachable…",
    "A childhood voice, a bigger horizon…",
    "I wrote about how Kalpana Chawla stayed with me through childhood. Space was one of the first ways I imagined a life in research and creation. A telescope belongs here for that earlier version of me, still looking up."
  ],
  "rooftop-chess": [
    "It looks like the wrong direction…",
    "My kind of sport has a pause in it…",
    "Chess and pool both get my attention. I’m drawn to games where a small adjustment in aim or a longer look can change the result. A knight taking the long way round feels quite at home here."
  ],
  "rooftop-headphones": [
    "This song knows which year it is…",
    "The playlist is also a time machine…",
    "Some songs arrive with dates attached: ‘Cardigan’ takes me to August 2020 and March 2022; NewJeans takes me to 2023. I don’t just remember hearing them. For a moment, I remember how being me felt then."
  ],
  "rooftop-coffee": [
    "The kitchen had another experiment…",
    "An unexpected pair of cooks…",
    "During COVID, my mother and I started trying a new dish every day. We discovered we were pretty good cooks who usually just didn’t cook. This cup is for the unhurried time around making something together."
  ],
  "rooftop-star-chart": [
    "These stars refuse to pick one side…",
    "My allegiances need a diagram…",
    "Real Madrid is my team. I also support Argentina and Messi. Yes, I can hear the objection already. Some of my favorite stars make a deeply inconvenient constellation."
  ],
  "airport-departures": [
    "We were thirteen. The gate was real…",
    "Before ‘abroad’ became familiar…",
    "My friends and I prepared for our exchange trips together. We were thirteen, about to travel to the US, and full of plans for the year ahead. I remember how big the world felt before we had even left."
  ],
  "airport-suitcase": [
    "This time, the bags were coming together…",
    "A reunion with a stop along the way…",
    "For a family trip to Turkey, we came from different countries to meet up. There was a stop in Paris for New Year, then a week in Istanbul. I like that an airport can be the beginning of everyone being in the same place again."
  ],
  "airport-postcards": [
    "I’d seen it drawn. Then I arrived…",
    "The country on the other side of the screen…",
    "Before my exchange in Osaka, Japan was a place I mostly knew through anime. Then I got to live there. It’s a strange, lovely shift when a place you’ve imagined starts supplying its own details."
  ],
  "airport-book": [
    "It started with a birthday present…",
    "A castle small enough to carry…",
    "My mother gave me the Harry Potter books for my sixth birthday. They became a large part of my childhood. A book is still a very efficient way to carry a much bigger world into a waiting room."
  ],
  "airport-paper-plane": [
    "The page had a character before it had wings…",
    "I once gave a robot a movie…",
    "For a robotics project, I wrote a story around a character named Samara and filmed it with friends inside our smart-city model. A story on a page became something we could build and play out together. This paper gets to become something too."
  ],
  "forest-lantern": [
    "The light was waiting for someone…",
    "A staircase that noticed…",
    "One of my community projects was automatic stair lighting: the lights came on when someone was nearby. A sensor doing a small, considerate job. I like that kind of invention—something you can appreciate without needing its explanation first."
  ],
  "forest-tent": [
    "Three nights. A very different room…",
    "The outside stopped being a backdrop…",
    "I spent three nights in a swamp forest. A tent makes the boundary between your little room and the rest of the world rather thin. That expedition is one of the chapters I wanted this camp to keep."
  ],
  "forest-compass": [
    "The map was hiding more than a route…",
    "Learning to read a landscape…",
    "Earth- and climate-science activities took me into topographic maps, biodiversity mapping and questions about planetary boundaries. I was learning to look at a landscape for more than where I could walk next. Direction is only one thing a map can tell you."
  ],
  "forest-boots": [
    "The weather had a suggestion. We ignored it…",
    "Not every wet shoe needs an expedition…",
    "One night, a friend and I played pickleball in the rain. That was the whole update I added at 9:38 p.m. Sometimes the part of a day worth keeping is just that you went outside and played anyway."
  ],
  "sea-paper-boat": [
    "Fifteen days, with nowhere to hurry off to…",
    "The part of the voyage I kept…",
    "Before high school, I joined my father on a fifteen-day cruise. He’s a sailor, so time together has always mattered to me. We talked about family, life and the future; the horizon had plenty of room for all three."
  ],
  "sea-compass": [
    "I tried to find the one direction…",
    "It kept turning into another subject…",
    "During COVID, I went looking for the common root of my interests: computational biology, quantum chemistry, particle physics, geology. Research and creation kept turning up in every direction. I started to recognize the thread without needing all the subjects to stay the same."
  ],
  "sea-notebook": [
    "The person on this page took five years to arrive…",
    "A reply to an earlier me…",
    "In a personal essay, I spoke back to the diary I’d started five years earlier, as the person we’d once imagined. A thank-you for the courage back then, and a promise to keep going. I wanted that earlier version of me to know I hadn’t given up."
  ],
  "sea-porthole": [
    "It works. Now try explaining why…",
    "The other side of understanding…",
    "At Roboment, I went from learning robotics to helping other people troubleshoot their projects. A working circuit was a good start; helping someone understand it was another challenge. This little window is for the moment a connection finally makes sense."
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
  const coffeeLines = ['Start with the ice.', 'Now the espresso.', 'A little shake?', 'Finish with the milk.', 'A little something we made.'];
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
