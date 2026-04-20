/* ============================================
   OFFLOAD — Audio Engine
   Web Audio API: Pink Noise & Binaural Beats
   ============================================ */

const AudioEngine = (() => {
  let audioContext = null;
  let pinkNoiseNode = null;
  let pinkGainNode = null;
  let binauralNodes = [];
  let binauralGainNode = null;
  let masterGain = null;

  // Initialize audio context on user interaction
  function getContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  }

  // ---- Pink Noise Generator ----
  // Pink noise has equal energy per octave — soothing for sleep
  function createPinkNoise() {
    const ctx = getContext();
    const bufferSize = 4096;
    const pinkNode = ctx.createScriptProcessor(bufferSize, 0, 1);

    // Paul Kellet's refined pink noise algorithm
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    pinkNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // Normalize
        b6 = white * 0.115926;
      }
    };

    return pinkNode;
  }

  // ---- Binaural Beat Generator ----
  // 4Hz theta wave for deep relaxation
  function createBinauralBeat(leftFreq = 200, rightFreq = 204) {
    const ctx = getContext();

    // Left channel oscillator
    const leftOsc = ctx.createOscillator();
    leftOsc.type = 'sine';
    leftOsc.frequency.value = leftFreq;

    // Right channel oscillator
    const rightOsc = ctx.createOscillator();
    rightOsc.type = 'sine';
    rightOsc.frequency.value = rightFreq;

    // Merger for stereo output
    const merger = ctx.createChannelMerger(2);

    // Panners for L/R separation
    const leftPanner = ctx.createStereoPanner();
    leftPanner.pan.value = -1;

    const rightPanner = ctx.createStereoPanner();
    rightPanner.pan.value = 1;

    // Connect: osc -> panner -> merger channel
    leftOsc.connect(leftPanner);
    leftPanner.connect(merger, 0, 0);
    rightOsc.connect(rightPanner);
    rightPanner.connect(merger, 0, 1);

    return { leftOsc, rightOsc, merger };
  }

  // ---- Descending Chime for Ceremony ----
  function playChime() {
    const ctx = getContext();
    const frequencies = [523.25, 440, 349.23, 261.63]; // C5, A4, F4, C4
    const now = ctx.currentTime;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.value = freq;

      filter.type = 'lowpass';
      filter.frequency.value = 2000;

      gain.gain.setValueAtTime(0.15, now + i * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.6 + 2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.6);
      osc.stop(now + i * 0.6 + 2);
    });
  }

  // ---- UI Sound Effects ----
  function playUISound(type) {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    switch (type) {
      case 'click':
        osc.type = 'sine';
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        break;
      case 'success':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        break;
      case 'complete':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        break;
      default:
        osc.type = 'sine';
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2);
  }

  // ---- Public API ----
  return {
    // Check if audio is available
    isAvailable() {
      return !!(window.AudioContext || window.webkitAudioContext);
    },

    // Start pink noise
    startPinkNoise(volume = 0.3) {
      const ctx = getContext();

      if (pinkNoiseNode) {
        this.stopPinkNoise();
      }

      masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(ctx.destination);

      pinkNoiseNode = createPinkNoise();
      pinkGainNode = ctx.createGain();
      pinkGainNode.gain.value = 1;

      // Lowpass filter to soften the noise
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      filter.Q.value = 0.5;

      pinkNoiseNode.connect(filter);
      filter.connect(pinkGainNode);
      pinkGainNode.connect(masterGain);

      return true;
    },

    // Stop pink noise
    stopPinkNoise() {
      if (pinkNoiseNode) {
        pinkNoiseNode.disconnect();
        pinkNoiseNode = null;
      }
      if (pinkGainNode) {
        pinkGainNode.disconnect();
        pinkGainNode = null;
      }
    },

    // Start binaural beats (4Hz theta)
    startBinauralBeats(volume = 0.08) {
      const ctx = getContext();

      if (binauralNodes.length > 0) {
        this.stopBinauralBeats();
      }

      if (!masterGain) {
        masterGain = ctx.createGain();
        masterGain.gain.value = 1;
        masterGain.connect(ctx.destination);
      }

      const { leftOsc, rightOsc, merger } = createBinauralBeat(200, 204);

      binauralGainNode = ctx.createGain();
      binauralGainNode.gain.value = volume;

      merger.connect(binauralGainNode);
      binauralGainNode.connect(masterGain);

      leftOsc.start();
      rightOsc.start();

      binauralNodes = [leftOsc, rightOsc];

      return true;
    },

    // Stop binaural beats
    stopBinauralBeats() {
      binauralNodes.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {
          // Already stopped
        }
      });
      binauralNodes = [];
      if (binauralGainNode) {
        binauralGainNode.disconnect();
        binauralGainNode = null;
      }
    },

    // Set master volume
    setVolume(value) {
      if (masterGain) {
        masterGain.gain.value = value;
      }
    },

    // Stop all audio
    stopAll() {
      this.stopPinkNoise();
      this.stopBinauralBeats();
      if (masterGain) {
        masterGain.disconnect();
        masterGain = null;
      }
    },

    // Play chime sequence
    playCeremonyChime() {
      playChime();
    },

    // Play UI sound
    playSound(type) {
      playUISound(type);
    },

    // Check if pink noise is playing
    isPinkNoisePlaying() {
      return !!pinkNoiseNode;
    },

    // Check if binaural is playing
    isBinauralPlaying() {
      return binauralNodes.length > 0;
    }
  };
})();

export { AudioEngine };
