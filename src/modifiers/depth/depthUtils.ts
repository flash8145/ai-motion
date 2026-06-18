/**
 * depthUtils — shared helpers for depth modifiers.
 *
 * Depth fields scatter decorative elements (particles, shapes, glass panels)
 * across the frame. Their positions MUST be deterministic so every rendered
 * frame — and every re-render on the render farm — produces identical layout.
 * We therefore seed a tiny PRNG instead of Math.random().
 */

/** mulberry32 — fast, deterministic seeded PRNG returning 0–1. */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface DepthElement {
  /** Base position in %. */
  x: number;
  y: number;
  /** Size in px. */
  size: number;
  /** 0 (far) → 1 (near): drives blur, parallax amplitude, opacity. */
  depth: number;
  /** Phase offset so elements don't move in lockstep. */
  phase: number;
  /** Per-element rotation speed (deg/frame). */
  rotSpeed: number;
  /** Index into a colour palette. */
  colorIndex: number;
}

/** Generates a stable field of depth elements from a seed. */
export function generateField(
  count: number,
  seed: number,
  minSize: number,
  maxSize: number,
): DepthElement[] {
  const rng = mulberry32(seed);
  const elements: DepthElement[] = [];
  for (let i = 0; i < count; i++) {
    const depth = rng();
    elements.push({
      x: rng() * 100,
      y: rng() * 100,
      size: minSize + rng() * (maxSize - minSize),
      depth,
      phase: rng() * Math.PI * 2,
      rotSpeed: (rng() - 0.5) * 0.6,
      colorIndex: Math.floor(rng() * 8),
    });
  }
  return elements;
}

/** Wraps a value into [0, range) — used to loop drifting particles. */
export function wrap(value: number, range: number): number {
  return ((value % range) + range) % range;
}
