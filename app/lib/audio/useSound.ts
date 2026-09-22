"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audioSupported, getSoundEngine, SoundEngine } from "./engine";

const KEY = "seanml:sound";

function readPreference(): "on" | "off" | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "on" || v === "off" ? v : null;
  } catch {
    return null; // private mode throws on access
  }
}

function writePreference(v: "on" | "off") {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* nothing we can do, and nothing that should break */
  }
}

export type Sound = {
  /** Does the visitor want sound? */
  wanted: boolean;
  /** Is the context actually running? False until a gesture unlocks it. */
  running: boolean;
  supported: boolean;
  toggle: () => void;
  engine: SoundEngine | null;
};

/**
 * Browsers refuse to produce audio before a real user gesture, and scroll does
 * not count as one. So the page always loads silent: we resolve what the
 * visitor wants, then wait for their first pointerdown or keypress to unlock it.
 */
export function useSound(): Sound {
  const [wanted, setWanted] = useState(false);
  const [running, setRunning] = useState(false);
  const [supported, setSupported] = useState(false);
  const engineRef = useRef<SoundEngine | null>(null);

  /**
   * `running` is read back off the context rather than assumed, because
   * resume() can be refused and we must not claim to be playing when we
   * aren't — the meter would sit dead and the visitor would think it's broken.
   */
  const syncRunning = useCallback(() => {
    const engine = engineRef.current;
    setRunning(!!engine && engine.state === "running");
  }, []);

  useEffect(() => {
    if (!audioSupported()) return;
    setSupported(true);
    engineRef.current = getSoundEngine();

    const stored = readPreference();
    if (stored) {
      setWanted(stored === "on");
      return;
    }
    // No stored choice: default on, except for visitors who have asked for
    // reduced motion — there is no "prefers reduced sound", but the intent
    // is close enough that erring quiet is the kinder default.
    const reduced =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    setWanted(!reduced);
  }, []);

  // Arm on the first real gesture.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !wanted || running) return;

    let cancelled = false;
    const unlock = (event: Event) => {
      if (cancelled) return;
      // The toggle owns its own gesture. Without this the visitor's first press
      // on it would unlock the sound here and then be read as "mute" by
      // toggle(), so the button that starts the sound would appear to stop it.
      const target = event.target;
      if (target instanceof Element && target.closest("[data-sound-toggle]")) return;

      void engine.start().finally(() => {
        if (!cancelled) syncRunning();
      });
      detach();
    };
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const detach = () => events.forEach((e) => window.removeEventListener(e, unlock));
    // Not `once`: an ignored press on the toggle must not consume the listener.
    events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));

    return () => {
      cancelled = true;
      detach();
    };
  }, [wanted, running, syncRunning]);

  // A hidden tab should cost nothing.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const onVisibility = () => {
      if (document.hidden) {
        engine.suspend();
      } else if (wanted) {
        engine.resume();
        setTimeout(syncRunning, 60);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [wanted, syncRunning]);

  const toggle = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    // Only mute when something is actually playing. On a fresh load `wanted`
    // is already true but the context is still locked, so the first press has
    // to start the sound — pressing it and getting silence would be nonsense.
    if (wanted && running) {
      setWanted(false);
      setRunning(false);
      writePreference("off");
      void engine.mute();
      return;
    }

    setWanted(true);
    writePreference("on");
    // This call originates in a click, so it is a valid gesture to unlock with.
    void engine
      .start()
      .then(() => engine.unmute())
      .finally(syncRunning);
  }, [wanted, running, syncRunning]);

  return { wanted, running, supported, toggle, engine: engineRef.current };
}
