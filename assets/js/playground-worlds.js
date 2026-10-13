/* Small, original toys for the places beyond the desk. Everything stays in this page. */
(() => {
  'use strict';
  const worlds = document.querySelectorAll('.world-dialog');
  if (!worlds.length) return;
  const get = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];

  // Connect a shape of your own; the chart is imagined, rather than a real constellation.
  const sky = get('[data-sky]');
  const stars = all('[data-star]');
  const starPoints = [[80, 166], [213, 72], [360, 154]];
  let selectedStars = [];
  function renderSky() {
    stars.forEach((star, index) => star.setAttribute('aria-pressed', String(selectedStars.includes(index))));
    get('[data-star-line]').setAttribute('points', selectedStars.map(index => starPoints[index].join(',')).join(' '));
    get('[data-sky-status]').textContent = selectedStars.length === 3 ? 'A new shape. No official name required.' : `${selectedStars.length} of 3 stars. Join the dots your way.`;
  }
  stars.forEach((star, index) => star.addEventListener('click', () => {
    selectedStars = selectedStars.includes(index) ? selectedStars.filter(item => item !== index) : [...selectedStars, index];
    renderSky();
  }));
  get('[data-sky-turn]').addEventListener('input', event => sky.style.setProperty('--sky-turn', `${event.target.value}deg`));
  get('[data-sky-reset]').addEventListener('click', () => {
    selectedStars = [];
    get('[data-sky-turn]').value = '0';
    sky.style.setProperty('--sky-turn', '0deg');
    renderSky();
  });

  // A knight's L, with every legal move available as a native button.
  const chess = get('[data-knight-board]');
  const knightSteps = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
  let knight = [0, 4];
  let hops = 0;
  const chessButtons = [];
  const squareName = (x, y) => `${'ABCDE'[x]}${5 - y}`;
  function legalSquare(x, y) {
    return knightSteps.some(([dx, dy]) => knight[0] + dx === x && knight[1] + dy === y);
  }
  function renderKnight() {
    const arrived = knight[0] === 4 && knight[1] === 0;
    chessButtons.forEach(button => {
      const x = Number(button.dataset.x);
      const y = Number(button.dataset.y);
      const occupied = knight[0] === x && knight[1] === y;
      const legal = !arrived && legalSquare(x, y);
      button.disabled = !legal;
      button.classList.toggle('knight-current', occupied);
      button.classList.toggle('knight-legal', legal);
      button.textContent = occupied ? '♞' : (x === 4 && y === 0 ? '✦' : (legal ? '·' : ''));
      button.setAttribute('aria-label', `${occupied ? 'Knight at' : (x === 4 && y === 0 ? 'Star at' : (legal ? 'Move knight to' : 'Square'))} ${squareName(x, y)}`);
    });
    get('[data-knight-status]').textContent = arrived ? `${hops} hops. Star reached. Another route?` : `${hops} hops. Take an L-shaped step toward the star.`;
  }
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.x = String(x);
      button.dataset.y = String(y);
      button.className = `knight-square ${(x + y) % 2 ? 'square-dark' : 'square-light'}`;
      button.addEventListener('click', () => {
        if (!legalSquare(x, y) || button.disabled) return;
        knight = [x, y];
        hops++;
        renderKnight();
        (chessButtons.find(square => !square.disabled) || get('[data-knight-reset]')).focus();
      });
      chessButtons.push(button);
      chess.append(button);
    }
  }
  get('[data-knight-reset]').addEventListener('click', () => {
    knight = [0, 4];
    hops = 0;
    renderKnight();
    chessButtons.find(square => !square.disabled)?.focus();
  });
  renderKnight();

  // Two real places, drawn as little postcards, with no private itinerary attached.
  const postcard = get('[data-postcard]');
  const countries = all('button[data-country]');
  let country = 'japan';
  let back = false;
  const stamped = new Set();
  function renderPostcard() {
    postcard.dataset.country = country;
    postcard.dataset.side = back ? 'back' : 'front';
    postcard.dataset.stamped = String(stamped.has(country));
    const name = country === 'japan' ? 'Japan' : 'Wisconsin';
    get('[data-country-title]').textContent = name;
    get('[data-postcard-destination]').textContent = name;
    get('[data-postcard-flip]').textContent = back ? 'See the drawing ↺' : 'Turn it over ↺';
    get('[data-postcard-flip]').setAttribute('aria-pressed', String(back));
    get('[data-postcard-stamp]').disabled = stamped.has(country);
    get('[data-postcard-status]').textContent = stamped.has(country) ? 'A small mark from a bigger chapter.' : 'Pick a place. Leave a little stamp.';
    countries.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.country === country)));
  }
  countries.forEach(button => button.addEventListener('click', () => { country = button.dataset.country; back = false; renderPostcard(); }));
  get('[data-postcard-flip]').addEventListener('click', () => { back = !back; renderPostcard(); });
  get('[data-postcard-stamp]').addEventListener('click', () => { stamped.add(country); renderPostcard(); get('[data-postcard-flip]').focus(); });
  get('[data-postcard-reset]').addEventListener('click', () => { stamped.clear(); back = false; renderPostcard(); });

  // A reader's small detour into the existing context toy.
  const book = get('[data-world-book]');
  let bookPage = 0;
  let bookLight = false;
  get('[data-book-page]').addEventListener('click', () => {
    bookPage = (bookPage + 1) % 3;
    book.dataset.page = String(bookPage);
    get('[data-book-status]').textContent = ['A castle. A possibility.', 'A maze. Probably another question.', 'Same stars. A different way to connect them.'][bookPage];
  });
  get('[data-book-light]').addEventListener('click', event => {
    bookLight = !bookLight;
    book.dataset.light = String(bookLight);
    event.currentTarget.setAttribute('aria-pressed', String(bookLight));
    event.currentTarget.textContent = bookLight ? 'Put the lamp out' : 'A little reading light';
  });

  // A launch you can aim without dragging. The flight is a playful drawing, not a simulator.
  const flight = get('[data-paper-flight]');
  const flightAngle = get('[data-flight-angle]');
  const flightPlane = get('[data-flight-plane]');
  let throws = 0;
  function clearFlight() {
    flight.dataset.flight = 'ready';
    flightPlane.classList.remove('flying');
    flightPlane.style.transform = 'translate(0px, 0px) rotate(-12deg)';
    get('[data-flight-path]').setAttribute('d', 'M55 170');
    get('[data-flight-launch]').textContent = 'Let it fly ↗';
    get('[data-flight-status]').textContent = 'Aim a little. Then let go.';
    throws = 0;
  }
  flightAngle.addEventListener('input', () => {
    get('[data-flight-angle-value]').textContent = `${flightAngle.value}°`;
  });
  get('[data-flight-launch]').addEventListener('click', () => {
    const angle = Number(flightAngle.value);
    const distance = 235 + Math.sin(angle * Math.PI / 90) * 85;
    const height = 75 + (angle - 20) * 1.15;
    flight.dataset.flight = 'sent';
    flight.style.setProperty('--flight-distance', `${distance}px`);
    flight.style.setProperty('--flight-mid', `${distance / 2}px`);
    flight.style.setProperty('--flight-lift', `${-height / 2 - 4}px`);
    flightPlane.classList.remove('flying');
    flightPlane.getBoundingClientRect(); // Restart a short, click-triggered flight without a timer.
    flightPlane.style.transform = `translate(${distance}px, -8px) rotate(7deg)`;
    flightPlane.classList.add('flying');
    get('[data-flight-path]').setAttribute('d', `M55 170 Q${55 + distance / 2} ${170 - height} ${55 + distance} 162`);
    throws++;
    get('[data-flight-status]').textContent = throws === 1 ? 'A small departure. No boarding pass required.' : 'This was supposed to be one throw.';
    get('[data-flight-launch]').textContent = 'Try another angle ↗';
  });
  get('[data-flight-reset]').addEventListener('click', clearFlight);
  get('#flight-dialog').addEventListener('close', () => flightPlane.classList.remove('flying'));

  // Finding forest marks is a sequence of distinct actions, rather than a story to read.
  const camp = get('[data-forest-camp]');
  const campMarks = all('[data-camp-mark]');
  let lantern = false;
  const found = new Set();
  let tentOpen = false;
  function renderCamp() {
    camp.dataset.lantern = String(lantern);
    camp.dataset.tent = tentOpen ? 'open' : 'closed';
    get('[data-camp-lantern]').setAttribute('aria-pressed', String(lantern));
    get('[data-camp-lantern]').textContent = lantern ? 'Lantern off' : 'Light the lantern';
    campMarks.forEach(button => {
      button.hidden = !lantern;
      button.disabled = found.has(button.dataset.campMark);
      button.classList.toggle('mark-found', found.has(button.dataset.campMark));
    });
    get('[data-camp-tent]').disabled = found.size < 3 || tentOpen;
    get('[data-camp-status]').textContent = tentOpen ? 'A small shelter. A very big outside.' : (found.size === 3 ? 'Three little signs. The tent is waiting.' : (lantern ? `${found.size} of 3 forest marks found. Look around.` : 'It starts with a little light.'));
  }
  get('[data-camp-lantern]').addEventListener('click', () => { lantern = !lantern; renderCamp(); });
  campMarks.forEach(button => button.addEventListener('click', () => {
    found.add(button.dataset.campMark);
    renderCamp();
    (campMarks.find(mark => !mark.disabled) || get('[data-camp-tent]')).focus();
  }));
  get('[data-camp-tent]').addEventListener('click', () => { tentOpen = true; renderCamp(); });
  get('[data-camp-reset]').addEventListener('click', () => { lantern = false; found.clear(); tentOpen = false; renderCamp(); });

  // Waves, a paper boat, and an optional notebook from the source story.
  const sea = get('[data-paper-sea]');
  let boatStep = 0;
  get('[data-boat-push]').addEventListener('click', () => {
    boatStep = (boatStep + 1) % 4;
    sea.dataset.boat = String(boatStep);
    sea.style.setProperty('--boat-x', `${boatStep * 73}px`);
    sea.style.setProperty('--boat-turn', `${[0, -5, 4, -2][boatStep]}deg`);
    get('[data-sea-status]').textContent = ['Back for another trip.', 'A little wake behind it.', 'A little farther than before.', 'Questions travel well.'][boatStep];
  });
  get('[data-boat-reset]').addEventListener('click', () => {
    boatStep = 0;
    sea.dataset.boat = '0';
    sea.style.setProperty('--boat-x', '0px');
    sea.style.setProperty('--boat-turn', '0deg');
    get('[data-sea-status]').textContent = 'Give the boat a little push.';
  });

  // A symbolic circuit inspired by the questions at sea, with a visible gap and switch.
  const circuit = get('[data-ship-circuit]');
  let wire = false;
  let switchClosed = false;
  function renderCircuit() {
    circuit.dataset.wire = String(wire);
    circuit.dataset.power = String(wire && switchClosed);
    get('[data-circuit-wire]').disabled = wire;
    get('[data-circuit-switch]').disabled = !wire;
    get('[data-circuit-switch]').setAttribute('aria-pressed', String(switchClosed));
    get('[data-circuit-switch]').textContent = switchClosed ? 'Open the switch' : 'Close the switch';
    get('[data-circuit-status]').textContent = switchClosed ? 'A complete path. A little light.' : (wire ? 'The gap is bridged. One switch left.' : 'The wire stops just short.');
  }
  get('[data-circuit-wire]').addEventListener('click', () => { wire = true; renderCircuit(); get('[data-circuit-switch]').focus(); });
  get('[data-circuit-switch]').addEventListener('click', () => { switchClosed = !switchClosed; renderCircuit(); });
  get('[data-circuit-reset]').addEventListener('click', () => { wire = false; switchClosed = false; renderCircuit(); });

  renderSky();
  renderPostcard();
  renderCamp();
  renderCircuit();
})();
