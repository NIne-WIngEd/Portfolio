/* An original, optional instrumental. All sound is synthesized locally.
 * Sixteen bars at 76 BPM, played twice with a quieter final cadence.
 * No recordings, samples, lyrics, or quoted melodies are used. */
(() => {
  'use strict';

  const toggle = document.querySelector('[data-sound-toggle]');
  const volume = document.querySelector('[data-sound-volume]');
  const status = document.querySelector('[data-sound-status]');
  if (!toggle) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const beat = 60 / 76;
  const passes = 2;
  const score = compose();
  const endBeat = 16 * 4 * passes;
  const lookAhead = 0.24;
  let context = null;
  let instrument = null;
  let timeline = null;
  let scheduler = null;
  let playing = false;
  let busy = false;
  let unavailable = false;
  let disposed = false;

  toggle.textContent = 'Sound off';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.dataset.audioState = 'off';
  if (volume) {
    volume.min = '0';
    volume.max = '100';
    volume.step = '1';
    volume.value = '25';
    volume.disabled = !AudioContextClass;
  }
  toggle.disabled = !AudioContextClass;
  toggle.hidden = false;
  if (status) status.textContent = AudioContextClass ? 'An original little instrumental' : 'Sound is unavailable in this browser';
  if (!AudioContextClass) return;

  // The harmony and four answering phrases are a composed score, not random notes.
  function compose() {
    const harmony = [
      { bass: 38, chord: [54, 57, 61, 64] }, // Dmaj9
      { bass: 37, chord: [52, 57, 59, 64] }, // Aadd9 / C#
      { bass: 35, chord: [50, 54, 57, 61] }, // Bm9
      { bass: 43, chord: [47, 50, 54, 57] }, // Gmaj9
      { bass: 40, chord: [55, 59, 62, 66] }, // Em9
      { bass: 42, chord: [50, 57, 62, 64] }, // Dadd9 / F#
      { bass: 43, chord: [50, 54, 57, 59] }, // Gmaj9
      { bass: 45, chord: [50, 52, 57, 59], turn: [49, 52, 55, 59] }, // A sus to A9
      { bass: 35, chord: [54, 57, 61, 62] }, // Bm9
      { bass: 45, chord: [54, 57, 61, 64] }, // F#m7 / A
      { bass: 43, chord: [54, 57, 59, 62] }, // Gmaj9
      { bass: 42, chord: [50, 57, 62, 64] }, // Dadd9 / F#
      { bass: 40, chord: [55, 59, 62, 66] }, // Em9
      { bass: 45, chord: [52, 57, 59, 61] }, // Aadd9
      { bass: 38, chord: [54, 57, 61, 64] }, // Dmaj9
      { bass: 38, chord: [54, 57, 59, 64] }, // D6/9
    ];
    // [beat within the bar, MIDI pitch, length in beats]. Rests are intentional.
    const phrases = [
      [[0.5, 66, 0.7], [1.5, 69, 0.5], [2.5, 76, 0.7], [3.5, 73, 0.45]],
      [[0.25, 71, 0.9], [1.75, 69, 1.25]],
      [[0.5, 66, 0.5], [1.25, 69, 0.5], [2, 74, 0.8], [3, 73, 0.7]],
      [[0, 71, 0.9], [1.5, 69, 0.5], [2.5, 66, 1.0]],
      [[0.5, 67, 0.55], [1.5, 71, 0.6], [2.75, 78, 0.7]],
      [[0.5, 76, 0.7], [1.75, 74, 0.8], [3, 69, 0.5]],
      [[0, 71, 0.7], [1.5, 74, 0.55], [2.25, 69, 0.5], [3, 66, 0.8]],
      [[0.5, 64, 0.8], [1.75, 66, 0.5], [2.75, 64, 0.8]],
      [[0.25, 73, 0.5], [1, 74, 0.75], [2.5, 78, 0.6], [3.5, 76, 0.45]],
      [[0.5, 73, 0.75], [1.75, 69, 0.6], [3, 66, 0.65]],
      [[0.25, 71, 0.7], [1.5, 74, 0.55], [2.5, 78, 0.75]],
      [[0.5, 76, 0.8], [2, 74, 0.7], [3, 69, 0.6]],
      [[0.25, 71, 0.65], [1.5, 67, 0.65], [2.75, 66, 0.6]],
      [[0.5, 64, 0.65], [1.5, 69, 0.65], [2.75, 73, 0.7]],
      [[0.5, 74, 1.0], [2, 73, 0.6], [3, 69, 0.75]],
      [[0.5, 66, 0.85], [2, 64, 0.7], [3, 62, 1.7]],
    ];
    const events = [];
    function add(kind, at, note, length, velocity, pan = 0) {
      events.push({ kind, at, note, length, velocity, pan });
    }
    for (let pass = 0; pass < passes; pass++) {
      harmony.forEach((bar, index) => {
        const at = (pass * 16 + index) * 4;
        const last = index === 15 && pass === passes - 1;
        const shade = index >= 14 ? 0.78 : 1;
        bar.chord.forEach((note, voice) => {
          add('pad', at, note, bar.turn ? 2 : 4, 0.48 * shade, (voice - 1.5) * 0.28);
          add('keys', at + voice * 0.035, note, last ? 4 : 2.15, (0.78 - voice * 0.05) * shade, (voice - 1.5) * 0.16);
        });
        if (bar.turn) bar.turn.forEach((note, voice) => {
          add('pad', at + 2, note, 2, 0.42, (voice - 1.5) * 0.28);
          add('keys', at + 2.5 + voice * 0.03, note, 1.1, 0.46, (voice - 1.5) * 0.16);
        });
        else if (index > 1 && index < 14) {
          // A smaller offbeat answer leaves room for the melody.
          [bar.chord[1], bar.chord[3]].forEach((note, voice) => {
            add('keys', at + 2.5 + voice * 0.05, note, 1.1, 0.38, voice ? 0.24 : -0.24);
          });
        }
        add('bass', at, bar.bass, last ? 4.5 : 2.7, 0.74 * shade);
        if (index >= 4 && index < 14) add('bass', at + 2.75, bar.bass + 12, 0.75, 0.3);
        phrases[index].forEach(([offset, note, length], phraseNote) => {
          const velocity = (phraseNote === 0 ? 0.8 : 0.64) * shade;
          add('pluck', at + offset, note, length, velocity, phraseNote % 2 ? 0.12 : -0.1);
          // The second pass has an occasional high, quiet answer.
          if (pass === 1 && index >= 4 && index < 12 && phraseNote === 1) {
            add('keys', at + offset + 0.5, note + 12, 0.8, 0.2, 0.32);
          }
        });
        // Percussion enters gradually, and leaves before the last cadence.
        if (index >= 2 && index < 14) {
          add('pulse', at, 0, 0.3, index < 4 ? 0.42 : 0.58);
          if (index >= 4) add('pulse', at + 2.25, 0, 0.3, 0.36);
          add('brush', at + 1.5, 0, 0.12, 0.28, -0.25);
          add('brush', at + 3.5, 0, 0.12, index % 4 === 3 ? 0.2 : 0.31, 0.25);
        }
      });
    }
    return events.sort((a, b) => a.at - b.at);
  }

  function setState(state, message) {
    toggle.dataset.audioState = state;
    const on = state === 'running';
    toggle.textContent = on ? 'Sound on' : 'Sound off';
    toggle.setAttribute('aria-pressed', String(on));
    if (status && message) status.textContent = message;
  }

  function chosenVolume() {
    const value = volume ? Number(volume.value) : 25;
    return 0.22 * Math.max(0, Math.min(100, Number.isFinite(value) ? value : 25)) / 100;
  }

  function stopScheduler() {
    if (scheduler !== null) window.clearInterval(scheduler);
    scheduler = null;
  }

  function tick() {
    if (!playing || !timeline || !context || context.state !== 'running') return;
    try {
      const horizon = context.currentTime + lookAhead;
      while (timeline.cursor < score.length) {
        const event = score[timeline.cursor];
        const at = timeline.start + event.at * beat;
        if (at > horizon) break;
        // A stalled foreground thread should skip missed notes, not burst them.
        if (at >= context.currentTime - 0.04) instrument.play(event, Math.max(at, context.currentTime + 0.004), beat);
        timeline.cursor++;
      }
      const finish = timeline.start + endBeat * beat + 2.6;
      if (context.currentTime >= finish - 0.8 && !timeline.ending) {
        timeline.ending = true;
        instrument.level(0, 0.75);
      }
      if (context.currentTime >= finish) void turnOff('Finished · play again');
    } catch (error) {
      disableAudio(error);
    }
  }

  async function turnOn() {
    if (busy || unavailable || disposed) return;
    busy = true;
    toggle.disabled = true;
    try {
      // Creation and resume occur only inside the explicit Sound button click.
      if (!context) {
        context = new AudioContextClass({ latencyHint: 'playback' });
        instrument = createInstruments(context);
        const ownContext = context;
        context.addEventListener('statechange', () => {
          if (disposed || unavailable || busy || context !== ownContext) return;
          if (context.state !== 'running' && playing) {
            playing = false;
            stopScheduler();
            instrument.level(0, 0);
            setState('suspended', 'Paused · tap Sound on to continue');
            if (context.state === 'closed') disableAudio();
            else void context.suspend().catch(disableAudio);
          }
          // A browser interruption or visibility change never grants permission to resume.
          if (context.state === 'running' && !playing) {
            instrument.level(0, 0);
            void context.suspend().catch(disableAudio);
          }
        });
      }
      if (context.state !== 'running') await context.resume();
      if (disposed) return;
      if (document.hidden || context.state !== 'running') {
        await context.suspend();
        setState('suspended', 'Paused · tap Sound on to continue');
        return;
      }
      if (!timeline) timeline = { start: context.currentTime + 0.09, cursor: 0, ending: false };
      playing = true;
      instrument.level(timeline.ending ? 0 : chosenVolume(), 0.35);
      setState('running', 'Playing an original little instrumental');
      stopScheduler();
      tick();
      if (playing) scheduler = window.setInterval(tick, 70);
    } catch (error) {
      disableAudio(error);
    } finally {
      busy = false;
      toggle.disabled = unavailable || disposed;
    }
  }

  async function turnOff(message = 'An original little instrumental') {
    if (busy || !context || disposed) return;
    busy = true;
    toggle.disabled = true;
    playing = false;
    stopScheduler();
    timeline = null;
    setState('off', message);
    try {
      instrument.level(0, 0.08);
      instrument.stop(context.currentTime + 0.1);
      if (context.state === 'running') {
        await new Promise(resolve => window.setTimeout(resolve, 110));
      }
      if (!disposed && context) {
        // A fresh graph on the next click avoids replaying a previous room/echo tail.
        const stoppedContext = context;
        instrument.dispose();
        await stoppedContext.close();
        if (context === stoppedContext) {
          context = null;
          instrument = null;
        }
      }
    } catch (error) {
      disableAudio(error);
    } finally {
      busy = false;
      toggle.disabled = unavailable || disposed;
    }
  }

  function pauseWhenHidden() {
    if (!document.hidden || !context || disposed || unavailable) return;
    if (!playing) return;
    playing = false;
    stopScheduler();
    // Suspending freezes currentTime and preserves the score position and voice tails.
    // There is intentionally no corresponding resume on visibilitychange.
    instrument.level(0, 0);
    setState('suspended', 'Paused · tap Sound on to continue');
    void context.suspend().catch(disableAudio);
  }

  function disableAudio() {
    unavailable = true;
    playing = false;
    timeline = null;
    stopScheduler();
    if (instrument) instrument.dispose();
    if (context && context.state !== 'closed') void context.close().catch(() => {});
    setState('off', 'Sound is unavailable in this browser');
    toggle.disabled = true;
    if (volume) volume.disabled = true;
  }

  toggle.addEventListener('click', () => {
    if (playing) void turnOff();
    else void turnOn();
  });
  if (volume) volume.addEventListener('input', () => {
    if (playing && instrument && timeline && !timeline.ending) instrument.level(chosenVolume(), 0.08);
  });
  document.addEventListener('visibilitychange', pauseWhenHidden);
  window.addEventListener('pagehide', () => {
    playing = false;
    timeline = null;
    stopScheduler();
    if (instrument) instrument.dispose();
    if (context && context.state !== 'closed') void context.close().catch(() => {});
    context = null;
    instrument = null;
    disposed = true;
    setState('off');
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      // A restored page remains silent and may create a fresh context on a click.
      disposed = false;
      busy = false;
      toggle.disabled = unavailable;
      setState('off', 'An original little instrumental');
    }
  });

  function createInstruments(ctx) {
    const connections = [];
    const sources = new Set();
    const sum = ctx.createGain();
    const lowpass = ctx.createBiquadFilter();
    const compressor = ctx.createDynamicsCompressor();
    const master = ctx.createGain();
    const reverb = ctx.createConvolver();
    const wet = ctx.createGain();
    const delay = ctx.createDelay(1);
    const echoFilter = ctx.createBiquadFilter();
    const feedback = ctx.createGain();
    const echo = ctx.createGain();
    const send = ctx.createGain();
    connections.push(sum, lowpass, compressor, master, reverb, wet, delay, echoFilter, feedback, echo, send);
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 6800;
    compressor.threshold.value = -15;
    compressor.knee.value = 12;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.012;
    compressor.release.value = 0.24;
    master.gain.value = 0;
    wet.gain.value = 0.21;
    delay.delayTime.value = beat * 0.75;
    echoFilter.type = 'lowpass';
    echoFilter.frequency.value = 1750;
    feedback.gain.value = 0.2;
    echo.gain.value = 0.15;
    send.gain.value = 0.6;
    reverb.buffer = roomImpulse(ctx);
    sum.connect(lowpass);
    lowpass.connect(compressor);
    compressor.connect(master);
    master.connect(ctx.destination);
    reverb.connect(wet);
    wet.connect(sum);
    send.connect(delay);
    delay.connect(echoFilter);
    echoFilter.connect(feedback);
    feedback.connect(delay);
    echoFilter.connect(echo);
    echo.connect(sum);
    const brushBuffer = softNoise(ctx);

    function route(at, length, attack, amplitude, pan, mode) {
      const envelope = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const nodes = [envelope, filter];
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(mode === 'pad' ? 1150 : mode === 'bass' ? 480 : 3600, at);
      filter.Q.value = 0.3;
      envelope.gain.setValueAtTime(0.0001, at);
      envelope.gain.linearRampToValueAtTime(amplitude, at + attack);
      const release = mode === 'pad' ? 0.85 : mode === 'bass' ? 0.23 : 0.65;
      if (mode === 'pad') envelope.gain.setValueAtTime(amplitude * 0.9, at + Math.max(attack, length - 0.25));
      else envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, amplitude * (mode === 'bass' ? 0.58 : 0.17)), at + Math.max(attack + 0.02, length));
      envelope.gain.exponentialRampToValueAtTime(0.0001, at + length + release);
      envelope.connect(filter);
      let output = filter;
      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.value = pan;
        filter.connect(panner);
        nodes.push(panner);
        output = panner;
      }
      output.connect(sum);
      if (mode !== 'bass' && mode !== 'pulse') output.connect(reverb);
      if (mode === 'pluck') output.connect(send);
      return { envelope, nodes, finish: at + length + release + 0.02 };
    }

    function track(oscillators, nodes, at, finish) {
      let active = oscillators.length;
      for (const source of oscillators) {
        sources.add(source);
        source.addEventListener('ended', () => {
          sources.delete(source);
          if (--active === 0) nodes.forEach(node => node.disconnect());
        }, { once: true });
        source.start(at);
        source.stop(finish);
      }
    }

    function pitched(event, at, secondsPerBeat) {
      const frequency = 440 * 2 ** ((event.note - 69) / 12);
      const length = event.length * secondsPerBeat;
      const kind = event.kind;
      const amplitude = event.velocity * (kind === 'pad' ? 0.062 : kind === 'bass' ? 0.22 : kind === 'keys' ? 0.16 : 0.11);
      const attack = kind === 'pad' ? 0.38 : kind === 'bass' ? 0.018 : 0.012;
      const voice = route(at, length, attack, amplitude, event.pan, kind);
      const layers = kind === 'keys'
        ? [[1, 1, 'sine', 0], [2, 0.28, 'sine', 3], [4, 0.045, 'sine', -2]]
        : kind === 'pad'
          ? [[1, 0.7, 'triangle', -5], [1, 0.55, 'sine', 5]]
          : kind === 'bass'
            ? [[1, 0.85, 'sine', 0], [2, 0.12, 'triangle', 0]]
            : [[1, 0.8, 'triangle', 0], [2, 0.12, 'sine', 1]];
      const oscillators = layers.map(([ratio, strength, wave, detune]) => {
        const oscillator = ctx.createOscillator();
        const partial = ctx.createGain();
        oscillator.type = wave;
        oscillator.frequency.setValueAtTime(frequency * ratio, at);
        oscillator.detune.value = detune;
        partial.gain.value = strength;
        oscillator.connect(partial);
        partial.connect(voice.envelope);
        voice.nodes.push(oscillator, partial);
        return oscillator;
      });
      track(oscillators, voice.nodes, at, voice.finish);
    }

    function percussion(event, at) {
      if (event.kind === 'pulse') {
        const voice = route(at, 0.16, 0.008, event.velocity * 0.14, 0, 'pulse');
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, at);
        oscillator.frequency.exponentialRampToValueAtTime(45, at + 0.09);
        oscillator.connect(voice.envelope);
        voice.nodes.push(oscillator);
        track([oscillator], voice.nodes, at, at + 0.28);
      } else {
        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        filter.type = 'bandpass';
        filter.frequency.value = 2450;
        filter.Q.value = 0.5;
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.linearRampToValueAtTime(event.velocity * 0.045, at + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.13);
        source.buffer = brushBuffer;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(sum);
        track([source], [source, filter, gain], at, at + 0.15);
      }
    }

    return {
      play(event, at, secondsPerBeat) {
        if (event.kind === 'pulse' || event.kind === 'brush') percussion(event, at);
        else pitched(event, at, secondsPerBeat);
      },
      level(value, transition) {
        const now = ctx.currentTime;
        if (master.gain.cancelAndHoldAtTime) master.gain.cancelAndHoldAtTime(now);
        else {
          master.gain.cancelScheduledValues(now);
          master.gain.setValueAtTime(master.gain.value, now);
        }
        master.gain.linearRampToValueAtTime(value, now + transition);
      },
      stop(at) {
        for (const source of sources) {
          try { source.stop(at); } catch (_) { /* A source may have just ended. */ }
        }
      },
      dispose() {
        this.stop(ctx.currentTime);
        connections.forEach(node => node.disconnect());
      },
    };
  }

  // Deterministic procedural room response and brushed noise; no fetched media.
  function randomStream(seed) {
    return () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 4294967296;
    };
  }

  function roomImpulse(ctx) {
    const seconds = 1.8;
    const buffer = ctx.createBuffer(2, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
    const random = randomStream(84371);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let softened = 0;
      for (let i = 0; i < data.length; i++) {
        softened = softened * 0.68 + (random() * 2 - 1) * 0.32;
        const progress = i / data.length;
        data[i] = softened * Math.exp(-progress * 6) * Math.min(1, i / (ctx.sampleRate * 0.012));
      }
    }
    return buffer;
  }

  function softNoise(ctx) {
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.16), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    const random = randomStream(97213);
    for (let i = 0; i < data.length; i++) data[i] = random() * 2 - 1;
    return buffer;
  }
})();
