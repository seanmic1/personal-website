import { makeImpulseResponse, makePinkNoise } from "./buffers";

/** Every audible constant lives here, so tuning by ear is one file, one place. */
export const SOUND = {
  master: 0.5,
  fadeIn: 1.5,
  fadeOut: 0.15,

  ambient: {
    /** A bass in standard tuning — E1 A1 D2 G2. The site's chord is its subject. */
    notes: [41.203, 55.0, 73.416, 97.999],
    /** Quiet partials two octaves up for the glitter. */
    partials: [329.628, 493.883],
    /** Bed level. Everything else is mixed relative to this. */
    gain: 0.1,
    partialGain: 0.008,
    detuneCents: 6,
    cutoff: 700,
    cutoffSwing: 260,
    /** Slow enough to feel like breathing rather than a wobble. */
    lfoHz: 0.06,
    swellHz: 0.045,
    send: 0.55,
    /*
     * There is deliberately no ducking of the bed. Two attempts at a "gentle"
     * duck — closing the filter, trimming the level, dimming the partials —
     * both read as the hum stopping when a card opens. The drone's fundamentals
     * sit at 41–98 Hz, so on most speakers the only audible part of it is its
     * harmonics, and touching the filter at all takes those away. So: opening a
     * card leaves the bed exactly as it was, and only the scroll noise ducks.
     */
  },

  swoosh: {
    gain: 0.18,
    freqMin: 300,
    freqMax: 2200,
    q: 1.2,
    /** Velocity that counts as "full tilt". */
    velocityFull: 0.55,
    attack: 0.04,
    release: 0.35,
    send: 0.3,
  },

  tick: {
    freq: 1800,
    /** Cents added per node along the string — the menu-scroll rise. */
    centsPerNode: 40,
    gain: 0.075,
    decay: 0.045,
    send: 0.06,
    minIntervalMs: 80,
  },

  drop: {
    from: 1400,
    to: 380,
    sweep: 0.09,
    gain: 0.16,
    decay: 0.22,
    send: 0.6,
  },

  close: {
    from: 300,
    to: 520,
    sweep: 0.12,
    gain: 0.09,
    decay: 0.18,
    send: 0.45,
  },

  maxVoices: 12,
};

type Ctor = typeof AudioContext;

function audioContextCtor(): Ctor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

export function audioSupported() {
  return audioContextCtor() !== null;
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private reverbReturn!: GainNode;
  private convolver!: ConvolverNode;
  private analyser!: AnalyserNode;
  private meterBuf!: Float32Array;
  private spectrumBuf!: Uint8Array;

  private ambientGain!: GainNode;
  private ambientFilter!: BiquadFilterNode;
  private ambientPartials!: GainNode;
  private swooshGain!: GainNode;
  private swooshFilter!: BiquadFilterNode;

  private voices = 0;
  private lastTickAt = 0;
  /** Cancels a pending suspend if an unmute overtakes a mute. */
  private muteToken = 0;
  private ducked = false;
  private started = false;
  private lastSwooshGain = -1;
  private lastSwooshFreq = -1;

  get ready() {
    return this.started;
  }

  get state(): AudioContextState | "none" {
    return this.ctx?.state ?? "none";
  }

  /** Must be called from inside a real user gesture. Idempotent. */
  async start() {
    if (this.started) {
      try {
        await this.ctx?.resume();
      } catch {
        /* still blocked; nothing to undo */
      }
      return;
    }
    const Ctor = audioContextCtor();
    if (!Ctor) return;

    const ctx = new Ctor();
    this.ctx = ctx;

    // ── master bus ──────────────────────────────────────────────────────────
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.7;
    this.meterBuf = new Float32Array(this.analyser.fftSize);
    this.spectrumBuf = new Uint8Array(this.analyser.frequencyBinCount);
    this.master.connect(this.analyser); // tap only — not connected onward

    this.convolver = ctx.createConvolver();
    this.convolver.buffer = makeImpulseResponse(ctx);
    this.reverbReturn = ctx.createGain();
    this.reverbReturn.gain.value = 0.9;
    this.convolver.connect(this.reverbReturn);
    this.reverbReturn.connect(this.master);

    this.buildAmbient(ctx);
    this.buildSwoosh(ctx);

    this.started = true;
    try {
      await ctx.resume();
    } catch {
      // Blocked. The graph is built and idle; a later unmute can still start it.
    }
    this.master.gain.setTargetAtTime(SOUND.master, ctx.currentTime, SOUND.fadeIn / 3);
  }

  // ── ambient bed ───────────────────────────────────────────────────────────
  private buildAmbient(ctx: AudioContext) {
    const A = SOUND.ambient;

    this.ambientFilter = ctx.createBiquadFilter();
    this.ambientFilter.type = "lowpass";
    this.ambientFilter.frequency.value = A.cutoff;
    this.ambientFilter.Q.value = 0.7;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = A.gain;
    this.ambientFilter.connect(this.ambientGain);
    this.connectOut(this.ambientGain, A.send);

    // Cutoff breathes.
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = A.lfoHz;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = A.cutoffSwing;
    lfo.connect(lfoDepth).connect(this.ambientFilter.frequency);
    lfo.start();

    A.notes.forEach((freq, i) => {
      const noteGain = ctx.createGain();
      // Scaled by voice count so the four notes sum to about unity before the
      // bed gain, instead of stacking to eight times it.
      noteGain.gain.value = 1 / (A.notes.length * 2);
      noteGain.connect(this.ambientFilter);

      const swell = ctx.createOscillator();
      swell.type = "sine";
      swell.frequency.value = A.swellHz * (1 + i * 0.27);
      const swellDepth = ctx.createGain();
      swellDepth.gain.value = 0.06;
      swell.connect(swellDepth).connect(noteGain.gain);
      swell.start(ctx.currentTime + i * 0.9);

      for (const [type, detune] of [
        ["triangle", -A.detuneCents],
        ["sine", A.detuneCents],
      ] as const) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(noteGain);
        osc.start();
      }
    });

    // High partials, tremolo'd, driven harder when the string is moving.
    this.ambientPartials = ctx.createGain();
    this.ambientPartials.gain.value = A.partialGain;
    this.connectOut(this.ambientPartials, 0.8);

    A.partials.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const trem = ctx.createGain();
      trem.gain.value = 0.6;
      const lfo2 = ctx.createOscillator();
      lfo2.type = "sine";
      lfo2.frequency.value = 0.11 + i * 0.07;
      const depth = ctx.createGain();
      depth.gain.value = 0.4;
      lfo2.connect(depth).connect(trem.gain);
      lfo2.start();
      osc.connect(trem).connect(this.ambientPartials);
      osc.start();
    });
  }

  // ── scroll swoosh ─────────────────────────────────────────────────────────
  private buildSwoosh(ctx: AudioContext) {
    const S = SOUND.swoosh;
    const src = ctx.createBufferSource();
    src.buffer = makePinkNoise(ctx);
    src.loop = true;

    this.swooshFilter = ctx.createBiquadFilter();
    this.swooshFilter.type = "bandpass";
    this.swooshFilter.frequency.value = S.freqMin;
    this.swooshFilter.Q.value = S.q;

    this.swooshGain = ctx.createGain();
    this.swooshGain.gain.value = 0;

    src.connect(this.swooshFilter).connect(this.swooshGain);
    this.connectOut(this.swooshGain, S.send);
    // Runs forever at zero gain: starting and stopping a buffer source per
    // scroll event is both expensive and clicky.
    src.start();
  }

  /**
   * Route a source to both the dry master and the reverb send. Returns any
   * nodes it created, so one-shots can tear their own chain down again — a
   * long session fires thousands of ticks, and leaving a gain node wired to
   * the master bus for each one is a slow leak.
   */
  private connectOut(node: AudioNode, send: number): AudioNode[] {
    const ctx = this.ctx!;
    node.connect(this.master);
    if (send > 0) {
      const s = ctx.createGain();
      s.gain.value = send;
      node.connect(s).connect(this.convolver);
      return [s];
    }
    return [];
  }

  // ── continuous inputs, called from the animation frame ────────────────────

  /** `velocity` is progress-per-second from the string engine. */
  setVelocity(velocity: number) {
    if (!this.started || !this.ctx) return;
    const S = SOUND.swoosh;
    const norm = Math.min(1, Math.abs(velocity) / S.velocityFull);
    const t = this.ctx.currentTime;

    const target = norm * S.gain * (this.ducked ? 0.25 : 1);
    if (Math.abs(target - this.lastSwooshGain) > 0.002) {
      const current = this.swooshGain.gain.value;
      // Asymmetric: opens quickly, tails off slowly.
      const tc = (target > current ? S.attack : S.release) / 3;
      this.swooshGain.gain.setTargetAtTime(target, t, tc);
      this.lastSwooshGain = target;
    }

    // Direction nudges the filter: down sweeps up, up sweeps down.
    const bias = velocity >= 0 ? 1 : 0.82;
    const freq = (S.freqMin + norm * (S.freqMax - S.freqMin)) * bias;
    if (Math.abs(freq - this.lastSwooshFreq) > 12) {
      this.swooshFilter.frequency.setTargetAtTime(freq, t, 0.08);
      this.lastSwooshFreq = freq;
    }
  }

  /** String vibration amplitude → how much the partials shimmer. */
  setAmp(amp: number) {
    if (!this.started || !this.ctx) return;
    const A = SOUND.ambient;
    const target = A.partialGain * (1 + Math.min(1, amp * 3) * 2.5);
    this.ambientPartials.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
  }

  /**
   * A card being open silences the scroll noise and nothing else. The ambient
   * bed is untouched on purpose — see the note in SOUND.ambient.
   */
  setDucked(ducked: boolean) {
    if (!this.started || !this.ctx || this.ducked === ducked) return;
    this.ducked = ducked;
  }

  // ── one-shots ─────────────────────────────────────────────────────────────

  private canVoice() {
    return this.started && this.ctx && this.voices < SOUND.maxVoices;
  }

  private envelope(gain: number, attack: number, decay: number, send: number) {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    const sends = this.connectOut(g, send);
    return { g, t, end: t + attack + decay, chain: [g, ...sends] };
  }

  /**
   * Schedule a one-shot's teardown. Must be called *after* node.start(): stop()
   * on a node that was never started throws InvalidStateError. The catch is
   * belt-and-braces — if it ever throws again, the voice is released here
   * rather than left counted forever, which would silently disable every
   * subsequent one-shot once the count reached maxVoices.
   */
  private retire(node: AudioScheduledSourceNode, end: number, chain: AudioNode[] = []) {
    const release = () => {
      this.voices--;
      node.disconnect();
      for (const n of chain) n.disconnect();
    };
    this.voices++;
    node.onended = release;
    try {
      node.stop(end + 0.02);
    } catch {
      node.onended = null;
      release();
    }
  }

  /** Hover. Dry and close, so it reads as physical rather than spacey. */
  tick(index = 0) {
    if (!this.canVoice()) return;
    const now = performance.now();
    if (now - this.lastTickAt < SOUND.tick.minIntervalMs) return;
    this.lastTickAt = now;

    const ctx = this.ctx!;
    const T = SOUND.tick;
    const { g, t, end, chain } = this.envelope(T.gain, 0.001, T.decay, T.send);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = T.freq;
    osc.detune.value = index * T.centsPerNode;
    osc.connect(g);
    osc.start(t);
    this.retire(osc, end, chain);

    // A short filtered burst gives it the fingertip transient.
    const noise = ctx.createBufferSource();
    noise.buffer = makePinkNoise(ctx, 0.05);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2400;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(T.gain * 0.5, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
    noise.connect(hp).connect(ng);
    const noiseChain = [hp, ng, ...this.connectOut(ng, 0)];
    noise.start(t);
    this.retire(noise, t + 0.05, noiseChain);
  }

  /** Click. A drop falling into the room. */
  drop() {
    if (!this.canVoice()) return;
    const ctx = this.ctx!;
    const D = SOUND.drop;
    const { g, t, end, chain } = this.envelope(D.gain, 0.002, D.decay, D.send);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(D.from, t);
    osc.frequency.exponentialRampToValueAtTime(D.to, t + D.sweep);
    osc.connect(g);
    osc.start(t);
    this.retire(osc, end, chain);

    const plink = ctx.createBufferSource();
    plink.buffer = makePinkNoise(ctx, 0.04);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2000;
    bp.Q.value = 2;
    const pg = ctx.createGain();
    pg.gain.setValueAtTime(D.gain * 0.35, t);
    pg.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    plink.connect(bp).connect(pg);
    const plinkChain = [bp, pg, ...this.connectOut(pg, 0.2)];
    plink.start(t);
    this.retire(plink, t + 0.04, plinkChain);
  }

  /** Card close. The drop, inverted — softer, lower, rising. */
  release() {
    if (!this.canVoice()) return;
    const ctx = this.ctx!;
    const C = SOUND.close;
    const { g, t, end, chain } = this.envelope(C.gain, 0.004, C.decay, C.send);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(C.from, t);
    osc.frequency.exponentialRampToValueAtTime(C.to, t + C.sweep);
    osc.connect(g);
    osc.start(t);
    this.retire(osc, end, chain);
  }

  // ── transport ─────────────────────────────────────────────────────────────

  /** Fade out then suspend, so a muted page costs nothing. */
  async mute() {
    if (!this.started || !this.ctx) return;
    const token = ++this.muteToken;
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, SOUND.fadeOut / 3);
    await new Promise((r) => setTimeout(r, SOUND.fadeOut * 1000 + 60));
    // If an unmute landed while we were fading, don't suspend on top of it.
    if (token !== this.muteToken) return;
    try {
      await this.ctx.suspend();
    } catch {
      /* already suspended */
    }
  }

  async unmute() {
    if (!this.started || !this.ctx) return;
    this.muteToken++; // cancels any suspend still waiting out its fade
    try {
      await this.ctx.resume();
    } catch {
      /* blocked until the next real gesture */
    }
    this.master.gain.setTargetAtTime(SOUND.master, this.ctx.currentTime, SOUND.fadeIn / 3);
  }

  suspend() {
    void this.ctx?.suspend();
  }

  resume() {
    void this.ctx?.resume();
  }

  /** RMS of the master tap, 0→1, for the meter glyph. */
  level(): number {
    if (!this.started || this.ctx?.state !== "running") return 0;
    this.analyser.getFloatTimeDomainData(this.meterBuf);
    let sum = 0;
    for (let i = 0; i < this.meterBuf.length; i++) sum += this.meterBuf[i] * this.meterBuf[i];
    // Scaled so the bed sits around a third of full deflection, leaving the
    // swoosh and the one-shots somewhere to go.
    return Math.min(1, Math.sqrt(sum / this.meterBuf.length) * 14);
  }

  /**
   * Per-band level of the master tap, 0→1, written into `out`. One number per
   * bar of the meter glyph, so the bars move independently and the thing reads
   * as a spectrum rather than five copies of the same pulse.
   *
   * Log-spaced: everything this page makes lives between the bed's low drone
   * and the ticks' upper partials, and a linear split would put four of the
   * five bars on empty air.
   */
  bands(out: Float32Array): Float32Array {
    const n = out.length;
    if (!this.started || !this.ctx || this.ctx.state !== "running") {
      out.fill(0);
      return out;
    }
    this.analyser.getByteFrequencyData(this.spectrumBuf);

    const bins = this.spectrumBuf.length;
    const nyquist = this.ctx.sampleRate / 2;
    const lo = Math.max(1, Math.floor((METER_LOW_HZ / nyquist) * bins));
    const hi = Math.max(lo + n, Math.min(bins, Math.floor((METER_HIGH_HZ / nyquist) * bins)));
    const ratio = hi / lo;

    for (let i = 0; i < n; i++) {
      const from = Math.round(lo * Math.pow(ratio, i / n));
      const to = Math.max(from + 1, Math.round(lo * Math.pow(ratio, (i + 1) / n)));
      let peak = 0;
      for (let j = from; j < to && j < bins; j++) {
        if (this.spectrumBuf[j] > peak) peak = this.spectrumBuf[j];
      }
      // getByteFrequencyData is already in dB, so this is a straight normalise
      // with a little gain — the bed should read as movement, not a flat line.
      out[i] = Math.min(1, (peak / 255) * 1.85);
    }
    return out;
  }
}

/** The band the meter glyph spans. Below is rumble, above is nothing we make. */
const METER_LOW_HZ = 55;
const METER_HIGH_HZ = 6000;

let singleton: SoundEngine | null = null;

/** Exactly one AudioContext for the lifetime of the page. */
export function getSoundEngine() {
  if (!singleton) singleton = new SoundEngine();
  return singleton;
}
