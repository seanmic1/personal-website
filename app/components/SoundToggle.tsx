"use client";

import { useEffect, useRef, useState } from "react";
import type { Sound } from "../lib/audio/useSound";

/**
 * Resting bar heights, as a fraction of the glyph. Shaped rather than flat so
 * the meter still reads as a meter when it is sitting still.
 */
const BAR_HEIGHTS = [0.44, 0.72, 1, 0.76, 0.5];
const BARS = BAR_HEIGHTS.length;

/** Bars settle at slightly different rates, so it never moves as one block. */
const SMOOTHING = [0.3, 0.26, 0.22, 0.24, 0.28];

/** Height of the tallest bar, in px. The rest are scaled off it. */
const GLYPH = 15;

/** Height every bar collapses to when muted, in px. */
const MUTED_TICK = 2;

/**
 * A five-band meter driven by the real master output, so it tells the truth
 * about whether anything is playing. Doubles as the affordance that sound
 * exists at all, since the page can't start making noise on its own.
 *
 * Muted it is a flat, grey, entirely still row of ticks. Unmuted it comes
 * alive: the bars ride their own frequency bands, a halo breathes with the
 * overall level, and two arcs turn around the rim — none of which is decoration
 * you could get without the sound actually running.
 */
export default function SoundToggle({ sound }: { sound: Sound }) {
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const haloRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const { engine, running, wanted, supported, toggle } = sound;
  const [reduced, setReduced] = useState(false);

  // "On" means audible, not merely intended — see useSound.toggle.
  const on = wanted && running;

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const setBars = (fn: (i: number) => number) =>
      bars.current.forEach((b, i) => b && (b.style.transform = `scaleY(${fn(i).toFixed(3)})`));

    if (!engine || !on) {
      // Muted: a flat, even row of ticks. Scaled per bar rather than by one
      // factor, so the shaped heights collapse to the same 2px and it reads as
      // a level line instead of five dots of five different sizes.
      setBars((i) => MUTED_TICK / (GLYPH * BAR_HEIGHTS[i]));
      if (haloRef.current) haloRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
      return;
    }

    if (reduced) {
      // No meter to watch, but the button still has to read as "sound is on".
      setBars((i) => BAR_HEIGHTS[i]);
      if (haloRef.current) haloRef.current.style.opacity = "0.5";
      if (ringRef.current) ringRef.current.style.opacity = "0.45";
      return;
    }

    let raf = 0;
    const bands = new Float32Array(BARS);
    const smoothed = new Float32Array(BARS);
    let glow = 0;

    const tick = () => {
      engine.bands(bands);
      let sum = 0;
      for (let i = 0; i < BARS; i++) {
        // The glyph's shape already lives in each bar's own height, so this is
        // the band level straight through — squaring the shape in would flatten
        // the outer two bars into nothing.
        const target = Math.max(0.12, Math.min(1, bands[i] * 1.1 + 0.08));
        smoothed[i] += (target - smoothed[i]) * SMOOTHING[i];
        sum += smoothed[i];
        const bar = bars.current[i];
        if (bar) bar.style.transform = `scaleY(${smoothed[i].toFixed(3)})`;
      }

      // The halo and the rim ride the whole glyph rather than any one band, so
      // they swell on a swoosh and stay quiet under the bed.
      glow += (sum / BARS - glow) * 0.12;
      if (haloRef.current) {
        haloRef.current.style.opacity = (0.18 + glow * 0.55).toFixed(3);
        haloRef.current.style.transform = `scale(${(0.75 + glow * 0.55).toFixed(3)})`;
      }
      if (ringRef.current) ringRef.current.style.opacity = (0.3 + glow * 0.6).toFixed(3);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engine, on, reduced]);

  if (!supported) return null;

  const label = on ? "Turn sound off" : "Turn sound on";

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
      {wanted && !running && (
        <span className="font-mono text-[10px] tracking-[0.18em] text-ink-faint">
          CLICK ANYWHERE
        </span>
      )}
      <button
        type="button"
        data-sound-toggle
        onClick={toggle}
        aria-pressed={on}
        aria-label={label}
        title={label}
        className={`group relative flex h-10 w-10 items-center justify-center rounded-full border bg-ground/80 backdrop-blur transition-colors ${
          on ? "border-string/50" : "border-line hover:border-string/40"
        }`}
      >
        {/* Breathes with the level. Behind everything, and never catches a click. */}
        <span
          ref={haloRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-string/40 opacity-0 blur-[7px] transition-opacity duration-300"
        />

        {/* Two arcs turning at different rates. Only ever visible when playing. */}
        <span
          ref={ringRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[3px] opacity-0 transition-opacity duration-300"
        >
          <svg viewBox="0 0 44 44" className="h-full w-full">
            <circle
              className="meter-arc-a"
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke="#E0A03F"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="14 112"
            />
            <circle
              className="meter-arc-b"
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke="#E0A03F"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="6 56"
              opacity="0.65"
            />
          </svg>
        </span>

        <span className="relative flex items-center gap-[2.5px]" style={{ height: GLYPH }}>
          {BAR_HEIGHTS.map((h, i) => (
            <span
              key={i}
              ref={(el) => {
                bars.current[i] = el;
              }}
              className={`block w-[2px] origin-center rounded-full transition-colors duration-300 ${
                on ? "bg-string shadow-[0_0_6px_rgba(224,160,63,0.55)]" : "bg-ink-faint"
              }`}
              style={{ height: GLYPH * h, transform: `scaleY(${MUTED_TICK / (GLYPH * h)})` }}
            />
          ))}
        </span>
      </button>
    </div>
  );
}
