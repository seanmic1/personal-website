/**
 * The dot never moves. It sits at the middle of the screen and scrolling drags
 * the nodes strung along the line past it, so the eye locks to one place and
 * stays there.
 *
 * The line itself is a line. It does not ripple, sag or wobble.
 *
 * An earlier version simulated a vibrating string — a wake, travelling wave
 * packets, a bow through the contact point — and it was wrong for this input.
 * Scroll is noisy: wheel deltas arrive in lumps, trackpads coast, and any model
 * that differentiates that signal turns every lump into a visible kink. At
 * 60fps that reads as jitter, not as physics. So the geometry is now fixed, and
 * everything that moves moves around the dot instead:
 *
 *   near    how close the nearest node is to the dot, 0 to 1. The dot draws
 *           down to a point between nodes and blooms as one lands on it.
 *   pulse   a decaying envelope thrown by an arrival or by a card opening.
 *           Drives the dot's overshoot, its halo, and the ring it sheds.
 *   rush    smoothed scroll speed. Stretches the bloom along the line into a
 *           streak, and suppresses the per-node bloom so that flying past ten
 *           nodes doesn't strobe.
 *
 * All of it is smooth by construction: every quantity is an eased approach to a
 * target, nothing differentiates the scroll, and there are no oscillators. The
 * fastest anything can move is the eased pan itself.
 *
 * `u` runs 0→1 across the visible along-axis. One set of maths drives both the
 * horizontal desktop line and the vertical mobile one.
 */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Where the dot lives. */
export const CENTER = 0.5;

/**
 * Gap between adjacent nodes, as a fraction of the visible along-axis.
 * Mirrored by --pitch in globals.css, which positions the nodes on the server
 * render before any JS has run. Change both together.
 */
export const NODE_PITCH = 0.42;

/** Frame-rate independent easing. The only way anything here moves. */
export const approach = (current: number, target: number, rate: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-rate * dt));

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const TUNING = {
  // ── the dot ───────────────────────────────────────────────────────────────
  /** Radius between nodes, holding nothing. */
  dotMin: 4.5,
  /** Radius with a node fully landed on it. Matches nodeDotMax/2, so the two
   *  coincide exactly and read as one object rather than two stacked ones. */
  dotMax: 7,
  /** Extra radius at the peak of a pulse. */
  dotPulse: 3.2,

  /** Halo, as a multiple of the dot and then some. */
  haloScale: 2.4,
  haloPulse: 15,
  haloPress: 7,
  haloAlpha: 0.12,
  haloAlphaPulse: 0.2,
  haloAlphaPress: 0.1,

  /** The ring an arrival sheds: expands once, fades, gone. */
  ringGap: 4,
  ringTo: 32,
  ringSeconds: 0.62,
  ringAlpha: 0.5,
  ringWidth: 1.5,

  /** The bloom on the line under the dot, stretched by speed into a streak. */
  streakBase: 26,
  streakRush: 170,
  streakCross: 6,
  /** How far the streak lags behind the dot at full tilt. */
  streakLag: 26,
  streakAlpha: 0.1,
  streakAlphaRush: 0.16,
  streakAlphaPulse: 0.2,

  // ── the nodes ─────────────────────────────────────────────────────────────
  /** Dot diameter at the far edge of legibility, and under the dot. */
  nodeDotMin: 5,
  nodeDotMax: 14,
  /** How sharply size falls away from the dot. Higher keeps neighbours small. */
  nodeCurve: 2.4,
  /** Glow radius, in px, on a node sitting under the dot. */
  nodeGlow: 16,
  /** Distance from centre, in along-fractions, at which a node has faded out. */
  fadeAt: 0.72,

  // ── beats ─────────────────────────────────────────────────────────────────
  /** Strength of the beat a node makes as it lands under the dot. */
  nodeBeat: 0.75,
  /** Nearness at which a node counts as landed. The beat is thrown on the
   *  crossing, not when the snap target changes hands — the target changes
   *  hands on a hysteresis, long before the node is anywhere near the dot. */
  landAt: 0.88,
  /** How much speed suppresses the landing beat. At a flat-out scroll the nodes
   *  arrive faster than a beat decays, and ten stacked beats read as a flicker
   *  rather than as ten arrivals — but they should still tick, not vanish. */
  landRushDamp: 0.7,
  /** Strength of the beat a card makes as it opens. */
  openBeat: 1,
  /**
   * The beat is an attack-decay envelope, not a step. Setting the pulse
   * straight to its peak pops: the halo would gain 11px between two frames.
   * The attack rate spreads that over ~6 frames, which reads as a bloom.
   */
  pulseAttack: 22,
  /** Per second, exponential. Half-life is about 200ms. */
  pulseDecay: 3.4,
  /** Fraction of the ring's life spent fading in, so it doesn't pop either. */
  ringOnset: 0.18,
  /** How far through its life a ring must be before a new beat may replace it. */
  ringRethrow: 0.4,

  // ── smoothing ─────────────────────────────────────────────────────────────
  /** Scroll speed that counts as full tilt. Low, so an ordinary wheel scroll
   *  saturates it instead of barely registering. */
  rushSpeed: 0.16,
  rushRise: 9,
  rushFall: 3.5,
  /** Direction is slow to let go, so the streak is still leaning the right way
   *  as the scroll dies. It only ever offsets a blurred shape. */
  dirRise: 10,
  dirFall: 2,

  /**
   * Gravitation, not snapping. While the scroll is moving the line tracks it
   * freely; as it slows, the nearest node takes over and draws the row in.
   * `settleSpeed` is the raw scroll speed above which the node stops pulling at
   * all, and `gravityCurve` shapes how late the pull arrives.
   */
  settleSpeed: 0.12,
  gravityCurve: 1.6,
  /** How quickly the row closes on wherever it is being pulled. */
  panEase: 4.5,
  /** How far past the midpoint the scroll must go before the target node
   *  changes. Stops it flip-flopping when the scroll rests near a boundary. */
  snapHysteresis: 0.55,
};

export type Axis = "x" | "y";

export type Geometry = {
  w: number;
  h: number;
  axis: Axis;
};

export type MotionState = {
  /** 0 to 1 raw scroll position. Drives velocity and which node is nearest. */
  progress: number;
  /** Where the row actually sits: eased toward the snapped node rather than
   *  tracking the raw scroll, so the dot is never stranded between nodes. */
  pan: number;
  /** The node currently exerting the pull. */
  snapIndex: number;
  /** 0 to 1 — how close that node is to the dot right now. */
  near: number;
  /** 0 to 1 — the rendered envelope: attacks toward `strike`, then follows it
   *  down. This is what the dot, halo and streak actually read. */
  pulse: number;
  /** 0 to 1 — the decaying source `pulse` chases. Never rendered directly. */
  strike: number;
  /** Age of the shed ring, 0 to 1. At 1 there is no ring. */
  ring: number;
  /** How hard the ring was thrown. */
  ringAmp: number;
  /** 0 to 1 smoothed scroll speed. */
  rush: number;
  /** -1 to 1 smoothed scroll direction. Zero when still. */
  dir: number;
  /** 0 to 1 — how hard the line is being held (a card being open). */
  press: number;
};

export function createState(): MotionState {
  return {
    progress: 0,
    pan: 0,
    snapIndex: 0,
    near: 1,
    pulse: 0,
    strike: 0,
    ring: 1,
    ringAmp: 0,
    rush: 0,
    dir: 0,
    press: 0,
  };
}

export function geometryOf({ w, h, axis }: Geometry) {
  const alongLength = axis === "x" ? w : h;
  const crossLength = axis === "x" ? h : w;
  return { alongLength, baseline: crossLength / 2 };
}

/**
 * Which node is currently exerting the pull. The hysteresis means the scroll
 * has to commit past the midpoint before it changes hands, so hovering near a
 * boundary doesn't make the row waver between two nodes.
 */
export function snapTarget(progress: number, count: number, current: number): number {
  if (count <= 1) return 0;
  const x = clamp01(progress) * (count - 1);
  if (Math.abs(x - current) > TUNING.snapHysteresis) return Math.round(x);
  return current;
}

/**
 * How strongly the node is pulling right now, 0 to 1. Zero while the scroll is
 * moving quickly — the row is free to follow you — rising to 1 as it stops.
 */
export function gravity(rawVelocity: number): number {
  const speed = Math.min(1, Math.abs(rawVelocity) / TUNING.settleSpeed);
  return Math.pow(1 - speed, TUNING.gravityCurve);
}

/** Where node `i` currently sits along the line, in u-space. */
export function nodeU(i: number, pan: number, count: number): number {
  const travelled = clamp01(pan) * Math.max(0, count - 1);
  return CENTER + (i - travelled) * NODE_PITCH;
}

/**
 * How close the nearest node is to the dot, 0 to 1.
 *
 * Measured to whichever node is genuinely closest, NOT to the snap target. The
 * snap target changes hands on a hysteresis, so it teleports — and measuring to
 * it made this quantity jump from 0.92 to 0 in a single frame the moment a
 * parked scroll resumed. The true nearest node changes hands exactly at the
 * midpoint, where the distance is equal on both sides, so this is continuous.
 */
export function nearnessOf(pan: number, count: number): number {
  const travelled = clamp01(pan) * Math.max(0, count - 1);
  // Distance to the nearest node, in node-units. Never more than 0.5.
  const d = Math.abs(travelled - Math.round(travelled));
  return clamp01(1 - d / 0.5);
}

/** How visible a node is, given how far it has drifted from the dot. */
export function nodeOpacity(u: number): number {
  const d = Math.abs(u - CENTER);
  if (d >= TUNING.fadeAt) return 0;
  // Linear: the neighbours need to stay legible as they approach, so an eased
  // curve dims them too far too fast.
  return 1 - d / TUNING.fadeAt;
}

/** 0 to 1 — how much of a node's emphasis it has earned at `u`. */
export function nodeEmphasis(u: number): number {
  const d = Math.abs(u - CENTER);
  if (d >= TUNING.fadeAt) return 0;
  return Math.pow(1 - d / TUNING.fadeAt, TUNING.nodeCurve);
}

/** Diameter, in px, of the dot for a node at `u`. */
export function nodeDotSize(u: number): number {
  return mix(TUNING.nodeDotMin, TUNING.nodeDotMax, nodeEmphasis(u));
}

/** #0B0D10-era palette, as channels, for the two ramps below. */
const STRING: RGB = [224, 160, 63];
const STRING_DIM: RGB = [58, 74, 84];
const INK_FAINT: RGB = [134, 144, 153];

type RGB = [number, number, number];

const ramp = (from: RGB, to: RGB, t: number) =>
  `rgb(${Math.round(mix(from[0], to[0], t))} ${Math.round(mix(from[1], to[1], t))} ${Math.round(
    mix(from[2], to[2], t),
  )})`;

/**
 * A node's colour, ramped by emphasis rather than switched at a threshold —
 * the whole point of the row is that it warms up continuously as it arrives.
 *
 * Interpolated here rather than with CSS color-mix so there is no support
 * question to answer: paint() is already writing to these elements.
 */
export const nodeTint = (emphasis: number) => ramp(STRING_DIM, STRING, emphasis);
export const nodeLabelTint = (emphasis: number) => ramp(INK_FAINT, STRING, emphasis);

// ── what the dot looks like right now ───────────────────────────────────────

/**
 * The bloom, 0 to 1. Suppressed by speed: at a flat-out scroll the dot holds
 * steady and small, because a dot that inflates once per node while ten of them
 * fly past is a strobe, not an animation.
 */
function bloom(s: MotionState): number {
  return smoothstep(s.near) * (1 - s.rush * 0.85);
}

export function dotRadius(s: MotionState): number {
  return mix(TUNING.dotMin, TUNING.dotMax, bloom(s)) + s.pulse * TUNING.dotPulse;
}

export function haloRadius(s: MotionState): number {
  return dotRadius(s) * TUNING.haloScale + s.pulse * TUNING.haloPulse + s.press * TUNING.haloPress;
}

export function haloAlpha(s: MotionState): number {
  return TUNING.haloAlpha + s.pulse * TUNING.haloAlphaPulse + s.press * TUNING.haloAlphaPress;
}

/** The shed ring: radius, and the alpha it is drawn at. Alpha 0 means gone. */
export function ringOf(s: MotionState): { r: number; alpha: number } {
  if (s.ring >= 1) return { r: 0, alpha: 0 };
  const eased = 1 - Math.pow(1 - s.ring, 3); // fast out, easing to a stop
  return {
    r: mix(dotRadius(s) + TUNING.ringGap, TUNING.ringTo, eased),
    // Fades in over its first moments and out over the rest, so it grows out of
    // the dot rather than appearing at full strength beside it.
    alpha:
      Math.pow(1 - s.ring, 1.8) *
      Math.min(1, s.ring / TUNING.ringOnset) *
      TUNING.ringAlpha *
      s.ringAmp,
  };
}

/**
 * The bloom on the line, in along/cross radii and an alpha. Round and tight at
 * rest; stretched into a streak along the line, lagging behind the dot, once
 * the scroll is moving.
 */
export function streakOf(s: MotionState): {
  along: number;
  cross: number;
  offset: number;
  alpha: number;
} {
  return {
    along: TUNING.streakBase + s.rush * TUNING.streakRush,
    cross: TUNING.streakCross + s.pulse * 4,
    offset: -s.dir * s.rush * TUNING.streakLag,
    alpha:
      TUNING.streakAlpha + s.rush * TUNING.streakAlphaRush + s.pulse * TUNING.streakAlphaPulse,
  };
}

// ── geometry ────────────────────────────────────────────────────────────────

/** The line. Straight, and the same every frame. */
export function linePath(geom: Geometry): string {
  const g = geometryOf(geom);
  return geom.axis === "x"
    ? `M 0 ${g.baseline} L ${g.alongLength} ${g.baseline}`
    : `M ${g.baseline} 0 L ${g.baseline} ${g.alongLength}`;
}

/** Where the dot sits. Fixed, by definition. */
export function dotPoint(geom: Geometry): [number, number] {
  const g = geometryOf(geom);
  const along = CENTER * g.alongLength;
  return geom.axis === "x" ? [along, g.baseline] : [g.baseline, along];
}

// ── the simulation ──────────────────────────────────────────────────────────

/** Throw a beat: the dot overshoots, the halo flares, a ring leaves. */
export function beat(s: MotionState, strength: number): void {
  if (strength <= 0.01) return;
  s.strike = Math.min(1, Math.max(s.strike, strength));
  // Restarting a ring that is still bright would snap it back to the dot. Beats
  // that land on top of a young ring just feed the pulse instead.
  if (s.ring > TUNING.ringRethrow) {
    s.ring = 0;
    s.ringAmp = strength;
  }
}

/** True when nothing is moving and nothing is going to — the loop may park. */
export function isQuiet(s: MotionState): boolean {
  return (
    s.pulse === 0 && s.strike === 0 && s.ring >= 1 && s.rush < 0.005 && Math.abs(s.dir) < 0.01
  );
}

/** Advance the animation. Mutates and returns `s`. */
export function step(s: MotionState, dt: number, velocity: number, count: number): MotionState {
  const speed = Math.min(1, Math.abs(velocity) / TUNING.rushSpeed);
  s.rush = approach(s.rush, speed, speed > s.rush ? TUNING.rushRise : TUNING.rushFall, dt);
  if (s.rush < 0.002) s.rush = 0;

  // A node landing on the dot is the one event worth marking. Detected here, on
  // the crossing, so it fires at the moment the eye sees the two meet.
  const wasNear = s.near;
  s.near = nearnessOf(s.pan, count);
  if (s.near > TUNING.landAt && wasNear <= TUNING.landAt) {
    beat(s, TUNING.nodeBeat * (1 - s.rush * TUNING.landRushDamp));
  }

  const heading = Math.max(-1, Math.min(1, velocity / TUNING.rushSpeed));
  const rate = Math.abs(heading) > Math.abs(s.dir) ? TUNING.dirRise : TUNING.dirFall;
  s.dir = approach(s.dir, heading, rate, dt);

  // Attack toward the strike, while the strike itself decays away. One
  // envelope, no discontinuity at either end.
  s.strike = approach(s.strike, 0, TUNING.pulseDecay, dt);
  s.pulse = approach(s.pulse, s.strike, TUNING.pulseAttack, dt);
  if (s.strike < 0.002) s.strike = 0;
  if (s.pulse < 0.002 && s.strike === 0) s.pulse = 0;

  if (s.ring < 1) s.ring = Math.min(1, s.ring + dt / TUNING.ringSeconds);

  return s;
}

/** Index of the node nearest the dot. There is always exactly one. */
export function nearestIndex(progress: number, count: number): number {
  if (count <= 1) return 0;
  return Math.round(clamp01(progress) * (count - 1));
}

/** Scroll progress that brings node `i` under the dot. */
export function progressOf(i: number, count: number): number {
  return count <= 1 ? 0 : i / (count - 1);
}
