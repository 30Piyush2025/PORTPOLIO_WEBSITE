// Web Audio API Procedural Sound Synthesizer
// Completely synthesized in real-time - 0 external audio files!

export function createAudioEngine() {
  let ctx = null;
  let masterGain = null;
  let enabled = true;
  let humStarted = false;
  let activeNodes = new Set();
  let currentDrawerGlide = null;
  const masterVolume = 2.5;

  function connectToMaster(source, ...nodes) {
    let current = source;
    for (const node of nodes) {
      current.connect(node);
      current = node;
    }
    current.connect(masterGain);
    activeNodes.add(source);
    source.onended = () => {
      activeNodes.delete(source);
      try { source.disconnect(); } catch (e) {}
      nodes.forEach(n => {
        try { n.disconnect(); } catch (e) {}
      });
    };
    return source;
  }

  // Synthesize white noise burst through a filter
  function noiseBurst(duration, gainVal, filterFreq, filterType = 'lowpass', isSoft = false) {
    if (!ctx) return null;
    const sampleCount = Math.ceil(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const envelope = Math.sin((i / data.length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * (isSoft ? 0.11 : 1);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = filterFreq;

    const gain = ctx.createGain();
    gain.gain.value = gainVal;

    connectToMaster(source, filter, gain).start();
    return source;
  }

  // Synthesize downward pitch glide (mechanical thud / latch)
  function tonalThump(freq, gainVal, duration) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(gainVal, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    connectToMaster(osc, gain).start(t);
    osc.stop(t + duration + 0.01);
  }

  // Soft electrical ambient room tone
  function startHum() {
    if (humStarted || !ctx) return;
    humStarted = true;
    const humTones = [
      [50, 0.002, 'sine'],
      [100, 0.0028, 'sine'],
      [150, 0.00065, 'triangle']
    ];
    for (const [freq, vol, type] of humTones) {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.type = type;
      const gain = ctx.createGain();
      gain.gain.value = vol;
      osc.connect(gain).connect(masterGain);
      osc.start();
    }
  }

  function unlock() {
    if (!enabled || document.hidden) return;
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0;
      masterGain.connect(ctx.destination);
      startHum();
    }
    ctx.resume().catch(() => {});
    masterGain.gain.setTargetAtTime(masterVolume, ctx.currentTime, 0.12);
  }

  function stopAllActive() {
    for (const node of activeNodes) {
      try { node.stop(); } catch (e) {}
    }
    activeNodes.clear();
    currentDrawerGlide = null;
  }

  function setEnabled(val) {
    enabled = val;
    if (!enabled && ctx) {
      stopAllActive();
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.value = 0;
      ctx.suspend().catch(() => {});
    } else if (enabled) {
      unlock();
    }
  }

  function play(type = 'paper', durationOverride) {
    if (!enabled || document.hidden) return;
    unlock();
    if (!ctx) return;

    if (type === 'paper') {
      // Realistic paper rustle
      noiseBurst(0.2, 0.18, 2400, 'lowpass', true);
    } else if (type === 'drawer-open' || type === 'drawer-close') {
      if (currentDrawerGlide) {
        try { currentDrawerGlide.stop(); } catch (e) {}
      }
      const freq = type === 'drawer-open' ? 780 : 620;
      currentDrawerGlide = noiseBurst(durationOverride || 1.1, 0.04, freq, 'bandpass');
      tonalThump(165, 0.018, 0.075);
    } else if (type === 'drawer-open-stop' || type === 'drawer-close-stop') {
      if (currentDrawerGlide) {
        try { currentDrawerGlide.stop(); } catch (e) {}
        currentDrawerGlide = null;
      }
      const isClose = type === 'drawer-close-stop';
      tonalThump(isClose ? 125 : 180, isClose ? 0.045 : 0.022, isClose ? 0.18 : 0.1);
      noiseBurst(0.065, isClose ? 0.035 : 0.018, 1100);
    } else if (type === 'book-place') {
      tonalThump(95, 0.055, 0.24);
      noiseBurst(0.13, 0.026, 950);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) {
      stopAllActive();
      ctx.suspend().catch(() => {});
    } else if (enabled) {
      unlock();
    }
  });

  window.addEventListener('pagehide', () => {
    stopAllActive();
    ctx?.suspend().catch(() => {});
  });

  return {
    unlock,
    setEnabled,
    play
  };
}
