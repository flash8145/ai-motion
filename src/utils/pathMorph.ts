/**
 * SVG path morphing utilities, built on `flubber`.
 * Lets a scene smoothly tween one icon/shape's path data into another,
 * the way After Effects' shape-layer path keyframes work.
 */

import { interpolate as flubberInterpolate } from "flubber";

/** Morphs between two SVG path `d` strings at progress `t` (0-1). */
export function morphPath(fromPath: string, toPath: string, t: number): string {
  if (fromPath === toPath) return fromPath;
  const clamped = Math.min(1, Math.max(0, t));
  const interpolator = flubberInterpolate(fromPath, toPath, { maxSegmentLength: 2 });
  return interpolator(clamped);
}

/**
 * Morphs across a sequence of 2+ shapes given a global progress value
 * spanning the whole sequence (0 = first shape, 1 = last shape).
 * Useful for IconMorph scenes that cycle through several icons.
 */
export function morphPathSequence(paths: string[], globalT: number): string {
  if (paths.length === 0) return "";
  if (paths.length === 1) return paths[0];

  const segments = paths.length - 1;
  const clamped = Math.min(1, Math.max(0, globalT));
  const segmentProgress = clamped * segments;
  const segmentIndex = Math.min(segments - 1, Math.floor(segmentProgress));
  const localT = segmentProgress - segmentIndex;

  return morphPath(paths[segmentIndex], paths[segmentIndex + 1], localT);
}
