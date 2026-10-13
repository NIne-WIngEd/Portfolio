/* Discrete, local toys for the optional personal page. No accounts or telemetry. */
(() => {
  'use strict';
  const scene = document.querySelector('[data-scene]');
  if (!scene || typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  const dialogs = [...document.querySelectorAll('.play-dialog')];
  const reaction = document.querySelector('[data-scene-reaction]');
  let returnFocus = null;
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
    dialogs.forEach(other => { if (other.open) other.close(); });
    returnFocus = invoker || document.querySelector(`[data-open="${id}"]`);
    dialog.showModal();
    reaction.textContent = 'Make yourself at home.';
  }
  document.querySelectorAll('[data-open]').forEach(button => {
    button.addEventListener('click', () => openToy(button.dataset.open, button));
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
      if (returnFocus?.isConnected) returnFocus.focus();
      returnFocus = null;
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
  document.querySelectorAll('[data-fall]').forEach(button => button.addEventListener('click', () => {
    fall = !fall;
    scene.classList.toggle('fall-in', fall);
    document.querySelectorAll('[data-fall]').forEach(choice => choice.setAttribute('aria-pressed', String(fall)));
    reaction.textContent = fall ? 'Fall is my favorite. I tend to get hopeful in fall.' : 'There’s no particular order.';
  }));

  let tangerines = false;
  let rewatches = 0;
  const screen = document.querySelector('[data-screen]');
  const showStatus = document.querySelector('[data-show-status]');
  document.querySelector('[data-show-next]').addEventListener('click', () => {
    tangerines = !tangerines;
    rewatches = 0;
    screen.dataset.screen = tangerines ? 'tangerines' : 'frost';
    document.querySelector('[data-show-title]').textContent = tangerines ? 'When Life Gives You Tangerines' : 'The First Frost';
    screen.querySelector('.screen-number').textContent = tangerines ? '02' : '01';
    showStatus.textContent = tangerines ? 'This one nudged me into starting a journal.' : 'Back to this one. Again.';
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

  document.querySelector('.scene-hotspots').hidden = false;
  document.querySelector('.object-menu').hidden = false;
  document.querySelectorAll('.scene-tools [data-open]').forEach(button => { button.hidden = false; });
  document.body.classList.add('playground-ready');
  motionAppearance();
  audioAppearance();
  const legacy = { bread:'bread-dialog', reservoir:'water-dialog', context:'context-dialog' };
  const fragment = window.location.hash.slice(1);
  const linkedDialog = legacy[fragment] || fragment;
  if (linkedDialog) openToy(linkedDialog);
})();
