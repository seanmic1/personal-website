"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { channels, isExternal } from "../data/contact";
import { chapterOf, chapters, chapterStarts, type TimelineNode } from "../data/timeline";
import {
  approach,
  beat,
  clamp01,
  createState,
  dotPoint,
  dotRadius,
  geometryOf,
  gravity,
  haloAlpha,
  haloRadius,
  isQuiet,
  linePath,
  NODE_PITCH,
  nearestIndex,
  nodeDotSize,
  nodeEmphasis,
  nodeLabelTint,
  nodeOpacity,
  nodeTint,
  nodeU,
  progressOf,
  ringOf,
  snapTarget,
  step,
  streakOf,
  TUNING,
  type Axis,
  type Geometry,
  type MotionState,
} from "../lib/string-motion";
import NodeCard from "./NodeCard";

/**
 * Screens of scroll per node. Sets how long each node dwells.
 *
 * Fifteen nodes at the old 0.85 made the page fourteen screens tall, which is a
 * lot of flicking to get to the end. This is the shortest dwell that still lets
 * a node land, read and be left before the next one arrives.
 */
const SCREENS_PER_NODE = 0.7;

export default function Timeline({ nodes }: { nodes: TimelineNode[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const dotGroupRef = useRef<SVGGElement>(null);
  const streakRef = useRef<SVGEllipseElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const nodeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const markRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  /** Kept mounted through the exit animation. */
  const [closingId, setClosingId] = useState<string | null>(null);
  const [axis, setAxis] = useState<Axis>("x");
  const [reduced, setReduced] = useState(false);

  // Mutable simulation state, deliberately outside React — this updates every
  // frame and must never trigger a render.
  const sim = useRef<MotionState>(createState());
  const geom = useRef<Geometry>({ w: 0, h: 0, axis: "x" });
  const openRef = useRef<string | null>(null);
  const openIndexRef = useRef(-1);
  const activeRef = useRef(0);
  const wakeRef = useRef<() => void>(() => {});
  const readItRef = useRef<HTMLButtonElement | null>(null);

  const count = nodes.length;
  const openNode = nodes.find((n) => n.id === openId) ?? null;
  const closingNode = nodes.find((n) => n.id === closingId) ?? null;
  const shownNode = openNode ?? closingNode;

  // ── media queries ─────────────────────────────────────────────────────────
  useEffect(() => {
    const vertical = matchMedia("(max-width: 767px)");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setAxis(vertical.matches ? "y" : "x");
      setReduced(motion.matches);
    };
    sync();
    vertical.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      vertical.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  // ── geometry ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const r = stage.getBoundingClientRect();
      geom.current = { w: r.width, h: r.height, axis };
      // Neither the line's shape nor the dot's position depends on anything but
      // the stage, so both are written here and never again. Everything in the
      // dot group is drawn about its own origin and carried by this transform,
      // which is also what unhides it: until the stage has been measured there
      // is nowhere correct to put it.
      lineRef.current?.setAttribute("d", linePath(geom.current));
      const [dx, dy] = dotPoint(geom.current);
      dotGroupRef.current?.setAttribute("transform", `translate(${dx} ${dy})`);
      dotGroupRef.current?.setAttribute("visibility", "visible");
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [axis]);

  // ── the frame loop ────────────────────────────────────────────────────────
  const readProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    return total > 0 ? clamp01(-rect.top / total) : 0;
  }, []);

  const paint = useCallback(() => {
    const s = sim.current;
    const g = geom.current;
    if (!g.w || !g.h) return;

    const horizontal = g.axis === "x";

    // ── the dot and what surrounds it ──
    // The line is untouched; every moving thing lives here. Coordinates are
    // relative to the dot group's own origin, which sits on the dot.
    const streak = streakOf(s);
    streakRef.current?.setAttribute("cx", (horizontal ? streak.offset : 0).toFixed(1));
    streakRef.current?.setAttribute("cy", (horizontal ? 0 : streak.offset).toFixed(1));
    streakRef.current?.setAttribute("rx", (horizontal ? streak.along : streak.cross).toFixed(1));
    streakRef.current?.setAttribute("ry", (horizontal ? streak.cross : streak.along).toFixed(1));
    streakRef.current?.setAttribute("opacity", streak.alpha.toFixed(3));

    haloRef.current?.setAttribute("r", haloRadius(s).toFixed(2));
    haloRef.current?.setAttribute("opacity", haloAlpha(s).toFixed(3));

    const ring = ringOf(s);
    ringRef.current?.setAttribute("r", ring.r.toFixed(2));
    ringRef.current?.setAttribute("opacity", ring.alpha.toFixed(3));

    dotRef.current?.setAttribute("r", dotRadius(s).toFixed(2));

    // ── the nodes panning past ──
    // CSS lays each one out at its resting offset from centre, so JS supplies
    // the scroll pan and the emphasis each node has earned by being close.
    const { alongLength } = geometryOf(g);
    const pan = -s.pan * Math.max(0, count - 1) * NODE_PITCH * alongLength;
    for (let i = 0; i < count; i++) {
      const el = nodeRefs.current[i];
      if (!el) continue;
      const u = nodeU(i, s.pan, count);
      const opacity = nodeOpacity(u);
      el.style.setProperty("--ax", `${pan.toFixed(2)}px`);
      // On the <li> as a variable rather than as its opacity, so CSS can hand
      // the fade on to .node-hit alone and leave the rest of the node be.
      el.style.setProperty("--fade", opacity.toFixed(3));
      // Faded-out nodes must not catch the mouse, but they stay in the DOM and
      // in the accessibility tree so Tab still walks the whole timeline.
      // visibility:hidden would drop them out of it entirely.
      const hittable = opacity >= 0.05;
      el.style.pointerEvents = hittable ? "auto" : "none";
      // Most of the row is invisible at any moment. Nothing below would be
      // seen, and the two tints each cost a string.
      if (opacity <= 0.001) continue;

      const emphasis = nodeEmphasis(u);
      el.style.setProperty("--dot", `${nodeDotSize(u).toFixed(2)}px`);
      el.style.setProperty("--glow", `${(emphasis * TUNING.nodeGlow).toFixed(2)}px`);
      el.style.setProperty("--lit", emphasis.toFixed(3));
      el.style.setProperty("--tint", nodeTint(emphasis));
      el.style.setProperty("--label-tint", nodeLabelTint(emphasis));
    }

    // ── the act boundaries ──
    // Same pan, same fade, at a half index: each tick rides between the last
    // node of one act and the first of the next. Nothing else about them moves,
    // so they need neither size nor tint.
    for (let m = 0; m < chapterStarts.length; m++) {
      const el = markRefs.current[m];
      if (!el) continue;
      el.style.setProperty("--ax", `${pan.toFixed(2)}px`);
      el.style.opacity = nodeOpacity(nodeU(chapterStarts[m].at, s.pan, count)).toFixed(3);
    }
  }, [count]);

  useEffect(() => {
    if (reduced) return; // handled by the scroll listener below
    let raf = 0;
    let parked = false;
    let idleFrames = 0;
    let last = performance.now();
    let lastRaw = readProgress();
    let visible = true;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) || 0.016;
      last = now;

      const s = sim.current;
      const openIndex = openIndexRef.current;
      const isOpen = openIndex >= 0;

      // A card being open freezes the dot and holds the string down.
      const raw = readProgress();
      const rawVelocity = (raw - lastRaw) / dt;
      lastRaw = raw;
      s.progress = raw;

      // Gravitation rather than a snap. While you are scrolling the string
      // follows you; as you slow, the nearest node takes over and draws it in,
      // so it always comes to rest on a node without ever being yanked there.
      s.snapIndex = isOpen ? openIndex : snapTarget(raw, count, s.snapIndex);
      const nodeAt = progressOf(s.snapIndex, count);
      const pull = isOpen ? 1 : gravity(rawVelocity);
      const target = raw + (nodeAt - raw) * pull;

      const prevPan = s.pan;
      s.pan = approach(s.pan, target, TUNING.panEase, dt);
      const still = Math.abs(rawVelocity) < 1e-4;
      const restingOnNode = still && Math.abs(nodeAt - s.pan) < 0.0004;
      if (restingOnNode) s.pan = nodeAt;

      // Velocity comes from the row's own travel rather than the raw scroll, so
      // the streak matches what is actually moving on screen.
      const velocity = (s.pan - prevPan) / dt;
      s.press = approach(s.press, isOpen ? 1 : 0, 8, dt);

      step(s, dt, velocity, count);

      // The copy follows the snap target, which changes hands as soon as the
      // scroll commits — well before the node arrives. The dot's own beat is
      // thrown later, by step(), when the node actually lands.
      if (s.snapIndex !== activeRef.current) {
        activeRef.current = s.snapIndex;
        setActiveIndex(s.snapIndex);
      }

      paint();

      const settled =
        isQuiet(s) && restingOnNode && Math.abs(s.press - (isOpen ? 1 : 0)) < 0.005;
      idleFrames = settled ? idleFrames + 1 : 0;

      // Genuinely stop. Nothing is moving and nothing is going to move until
      // the visitor does something, so burning a frame every 16ms is waste.
      if (!visible || idleFrames > 20) {
        parked = true;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!parked) return;
      parked = false;
      idleFrames = 0;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const stage = stageRef.current;
    const io = stage
      ? new IntersectionObserver(
          ([e]) => {
            visible = e.isIntersecting;
            if (visible) wake();
          },
          { threshold: 0 },
        )
      : null;
    if (stage && io) io.observe(stage);

    raf = requestAnimationFrame(frame);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, [count, paint, readProgress, reduced]);

  // Reduced motion: no beats, no loop — just land on the node and repaint.
  useEffect(() => {
    if (!reduced) return;
    const update = () => {
      const s = sim.current;
      s.pulse = 0;
      s.strike = 0;
      s.ring = 1;
      s.ringAmp = 0;
      s.rush = 0;
      s.dir = 0;
      s.near = 1;
      s.press = openIndexRef.current >= 0 ? 1 : 0;
      s.progress = readProgress();
      s.snapIndex =
        openIndexRef.current >= 0 ? openIndexRef.current : nearestIndex(s.progress, count);
      s.pan = progressOf(s.snapIndex, count);
      if (s.snapIndex !== activeRef.current) {
        activeRef.current = s.snapIndex;
        setActiveIndex(s.snapIndex);
      }
      paint();
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [count, paint, readProgress, reduced]);

  // ── open / close ──────────────────────────────────────────────────────────
  const lockScroll = () => {
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
  };
  const unlockScroll = () => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  const open = useCallback(
    (id: string, pushHistory = true) => {
      openRef.current = id;
      openIndexRef.current = nodes.findIndex((n) => n.id === id);
      setClosingId(null);
      setOpenId(id);
      lockScroll();
      beat(sim.current, TUNING.openBeat);
      wakeRef.current();
      if (pushHistory) history.pushState(null, "", `#${id}`);
    },
    [nodes],
  );

  const close = useCallback(
    (popHistory = true) => {
      if (!openRef.current) return;
      const wasOpen = openRef.current;
      openRef.current = null;
      openIndexRef.current = -1;
      setOpenId(null);
      // Held mounted just long enough for balloon-out (200ms) to play.
      setClosingId(wasOpen);
      window.setTimeout(() => setClosingId((c) => (c === wasOpen ? null : c)), 240);
      unlockScroll();
      wakeRef.current();
      if (popHistory && window.location.hash) {
        history.pushState(null, "", window.location.pathname);
      }
      readItRef.current?.focus();
    },
    [],
  );

  // Deep link on load, and make the back button close the card.
  useEffect(() => {
    // Only a link followed on an already-open page glides there; one the page
    // was loaded with jumps, or it would sweep through every node first.
    let loaded = false;
    const fromHash = () => {
      const id = window.location.hash.replace(/^#/, "");

      // A chapter key (`/#career`) lands on that act's first node and leaves
      // every card shut: it is how the Intro hands a visitor to the string.
      // The fragment is dropped once used, so following the same link a second
      // time still fires hashchange.
      if (chapters.some((c) => c.key === id)) {
        close(false);
        const first = nodes.findIndex((n) => n.chapter === id);
        const track = trackRef.current;
        if (first >= 0 && track) {
          const t = progressOf(first, count);
          const smooth = loaded && !matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({
            top: track.offsetTop + t * (track.offsetHeight - window.innerHeight),
            behavior: smooth ? "smooth" : "auto",
          });
        }
        history.replaceState(null, "", window.location.pathname);
        return;
      }

      const i = nodes.findIndex((n) => n.id === id);
      if (i >= 0) {
        const track = trackRef.current;
        if (track) {
          const t = progressOf(i, count);
          window.scrollTo({
            top: track.offsetTop + t * (track.offsetHeight - window.innerHeight),
            behavior: "auto",
          });
        }
        open(id, false);
      } else {
        close(false);
      }
    };
    fromHash();
    loaded = true;
    // popstate covers back/forward. hashchange covers a fragment arriving on an
    // already-loaded page — someone pasting /#bfi into the bar, or an in-page
    // anchor — which popstate never fires for.
    window.addEventListener("popstate", fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("popstate", fromHash);
      window.removeEventListener("hashchange", fromHash);
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── keyboard ──────────────────────────────────────────────────────────────
  const scrollToNode = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const t = progressOf(Math.max(0, Math.min(count - 1, i)), count);
      window.scrollTo({
        top: track.offsetTop + t * (track.offsetHeight - window.innerHeight),
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [count, reduced],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openRef.current) return; // the card owns the keyboard while open
      const prev = axis === "x" ? "ArrowLeft" : "ArrowUp";
      const next = axis === "x" ? "ArrowRight" : "ArrowDown";
      if (e.key === prev) {
        e.preventDefault();
        scrollToNode(activeRef.current - 1);
      } else if (e.key === next) {
        e.preventDefault();
        scrollToNode(activeRef.current + 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToNode(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToNode(count - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [axis, count, scrollToNode]);

  const active = nodes[activeIndex] ?? nodes[0];
  const act = chapterOf(active);
  const trackHeight = `${Math.round(count * SCREENS_PER_NODE * 100 + 100)}vh`;

  /**
   * A node's appearance at pan 0 — the exact state the page loads in. Rendered
   * on the server so the row is already correct before the first frame, rather
   * than flashing every node at full opacity and then being corrected.
   */
  const restingStyle = (i: number): React.CSSProperties => {
    const u = nodeU(i, 0, count);
    const emphasis = nodeEmphasis(u);
    return {
      ["--i" as string]: i,
      ["--dot" as string]: `${nodeDotSize(u).toFixed(2)}px`,
      ["--glow" as string]: `${(emphasis * TUNING.nodeGlow).toFixed(2)}px`,
      ["--lit" as string]: emphasis.toFixed(3),
      ["--tint" as string]: nodeTint(emphasis),
      ["--label-tint" as string]: nodeLabelTint(emphasis),
      ["--fade" as string]: nodeOpacity(u).toFixed(3),
    };
  };

  /** The same, for a boundary tick, which only ever needs its place and fade. */
  const markStyle = (at: number): React.CSSProperties => ({
    ["--i" as string]: at,
    opacity: nodeOpacity(nodeU(at, 0, count)),
  });

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="/"
          className="font-display text-[13px] font-extrabold tracking-[0.14em] text-ink transition-opacity hover:opacity-70"
        >
          SEAN MICHAEL
        </a>
        <nav className="flex items-center gap-5">
          <a
            href="/blog"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
          >
            Writing
          </a>
          <a
            href="/contact"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
          >
            Contact
          </a>
        </nav>
      </header>

      <div ref={trackRef} style={{ height: trackHeight }}>
        <div className="sticky top-0 flex h-screen flex-col items-stretch justify-center">
          {/* ── the string ── */}
          <div ref={stageRef} className="relative h-[52vh] w-full shrink-0 overflow-hidden md:h-[300px]">
            <svg
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <filter id="dot-bloom" x="-100%" y="-400%" width="300%" height="900%">
                  <feGaussianBlur stdDeviation="9" />
                </filter>
              </defs>

              {/* The line. Written once per resize, never per frame. */}
              <path
                ref={lineRef}
                fill="none"
                stroke="#E0A03F"
                strokeWidth="1.6"
                opacity="0.5"
                strokeLinecap="round"
              />

              {/* Carried onto the dot by a transform set once per resize, and
                  hidden until then. Everything inside is driven per-frame. */}
              <g ref={dotGroupRef} visibility="hidden">
                <ellipse ref={streakRef} fill="#E0A03F" filter="url(#dot-bloom)" opacity="0" />
                <circle ref={haloRef} className="dot-breath" r="12" fill="#E0A03F" opacity="0.12" />
                <circle ref={ringRef} r="0" fill="none" stroke="#E0A03F" strokeWidth="1.5" opacity="0" />
                <circle ref={dotRef} r="7" fill="#E0A03F" />
              </g>
            </svg>

            {/* Where one act hands over to the next. Behind the nodes, so a
                node landing on a boundary still takes the click. */}
            <ul className="absolute inset-0" aria-hidden="true">
              {chapterStarts.map((boundary, m) => (
                <li
                  key={boundary.chapter.key}
                  ref={(el) => {
                    markRefs.current[m] = el;
                  }}
                  className={axis === "x" ? "mark-x" : "mark-y"}
                  style={markStyle(boundary.at)}
                >
                  <span className="mark-tick" />
                  <span
                    className={`mark-numeral ${
                      axis === "x"
                        ? "bottom-full left-1/2 mb-1.5 -translate-x-1/2"
                        : "right-full top-1/2 mr-2 -translate-y-1/2"
                    }`}
                  >
                    {boundary.chapter.numeral}
                  </span>
                </li>
              ))}
            </ul>

            <ol className="absolute inset-0" aria-hidden="true">
              {nodes.map((node, i) => (
                <li
                  key={node.id}
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  className={axis === "x" ? "node-x" : "node-y"}
                  style={restingStyle(i)}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => open(node.id)}
                    className="node-hit group"
                  >
                    {/* Size, glow and colour all ride --dot/--glow/--lit, which
                        paint() writes every frame. No CSS transition: a
                        transition would lag the scroll and fight it. */}
                    <span className="node-dot" />
                    <span
                      className={`node-year ${
                        axis === "x"
                          ? "left-1/2 top-full -translate-x-1/2"
                          : "left-full top-1/2 ml-1 -translate-y-1/2"
                      }`}
                    >
                      {node.year}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* ── the fixed slot: the only place text is ever read ── */}
          <div className="relative shrink-0 px-6 pt-6">
            <div
              className="peek mx-auto flex min-h-[11.5rem] max-w-lg flex-col items-center justify-start text-center"
              data-handed-off={openId !== null}
            >
              {/* Keyed on the act, not the node: it holds steady while you walk
                  a chapter and swaps only at a boundary, which is the whole
                  point of naming it. */}
              <p
                key={act.key}
                className="swap-in font-mono text-[9.5px] uppercase tracking-[0.28em] text-string/70"
              >
                {act.numeral} &nbsp;·&nbsp; {act.title}
              </p>

              {/* Keyed on the node so React remounts the block and the swap
                  animation replays — the copy arriving is the other half of
                  the beat the dot throws. */}
              <div key={active?.id} className="swap-in mt-4 flex flex-col items-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">
                  {active?.range ?? active?.year}
                </p>
                <p className="mt-3 font-display text-2xl font-extrabold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[32px]">
                  {active?.title}
                </p>
                <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-ink-mute sm:text-[15px]">
                  {active?.peek}
                </p>
              </div>
              <button
                type="button"
                ref={readItRef}
                onClick={() => {
                  if (active) open(active.id);
                }}
                className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-string underline decoration-string/30 underline-offset-4 transition-colors hover:decoration-string"
              >
                Read it
              </button>
              {/* Straight to an act, for the visitor who came for one of them —
                  usually the third. */}
              <nav aria-label="Chapters" className="mt-6 flex items-center gap-4 whitespace-nowrap sm:gap-5">
                {chapters.map((c) => {
                  const first = nodes.findIndex((n) => n.chapter === c.key);
                  if (first < 0) return null;
                  const current = c.key === act.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => scrollToNode(first)}
                      aria-current={current ? "step" : undefined}
                      className={`font-mono text-[10px] uppercase tracking-[0.2em] underline-offset-4 transition-colors ${
                        current
                          ? "text-string underline decoration-string/40"
                          : "text-ink-faint hover:text-ink"
                      }`}
                    >
                      {c.numeral}&nbsp;&nbsp;{c.short}
                    </button>
                  );
                })}
              </nav>
              <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint/70">
                {activeIndex + 1} / {count} &nbsp;·&nbsp; scroll or {axis === "x" ? "← →" : "↑ ↓"}
              </p>
            </div>
          </div>

          {/* ── the card, inflating out of the description ── */}
          {shownNode && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-5">
              <button
                type="button"
                aria-label="Close"
                tabIndex={-1}
                onClick={() => close()}
                className={`absolute inset-0 cursor-default bg-ground/80 backdrop-blur-[2px] ${
                  openId ? "backdrop-in" : "opacity-0 transition-opacity duration-200"
                }`}
              />
              <NodeCard node={shownNode} onClose={close} closing={openId === null} />
            </div>
          )}
        </div>
      </div>

      {/* ── the end of the line ── */}
      <footer className="border-t border-line px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            End of the line
          </p>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(isExternal(c.href) ? { target: "_blank", rel: "me noreferrer" } : {})}
                  className="flex items-baseline justify-between gap-6 py-3.5 transition-colors hover:text-string"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                    {c.label}
                  </span>
                  <span className="text-sm">{c.value}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/contact"
            className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-string underline decoration-string/30 underline-offset-4 transition-colors hover:decoration-string"
          >
            Or send me a message →
          </a>
          <p className="mt-8 font-mono text-[10px] tracking-[0.14em] text-ink-faint">
            © {new Date().getFullYear()} · Kuala Lumpur
          </p>
        </div>
      </footer>
    </>
  );
}
