/**
 * Path-draw utilities — generalizes the stroke-dashoffset "draw-on"
 * technique (already used ad-hoc in ArrowOverlay) into a reusable
 * hook + helpers for any SVG <path> or <line>.
 */

import { useLayoutEffect, useRef, useState } from "react";
import { EASINGS, type BezierTuple } from "../animation/easings";
import { progress as easedProgress } from "./interpolation";

/**
 * Measures the total length of a rendered SVG path/line element.
 * Returns a ref to attach to the element and its measured length
 * (0 until the layout effect runs, which happens before paint).
 */
export function usePathLength<T extends SVGPathElement | SVGLineElement>(
  deps: ReadonlyArray<unknown> = []
): { ref: React.RefObject<T | null>; length: number } {
  const ref = useRef<T>(null);
  const [length, setLength] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      setLength(ref.current.getTotalLength());
    }
    // deps intentionally controls re-measurement (e.g. when `d` changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ref, length };
}

/** Converts a 0-1 draw progress into a strokeDashoffset for a path of `length`. */
export function dashOffsetForProgress(length: number, progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return length * (1 - clamped);
}

/**
 * Computes 0-1 draw progress for a path/line given the current frame,
 * start frame, and draw duration, with premium ease-out by default.
 */
export function computeDrawProgress(
  frame: number,
  startFrame: number,
  drawDurationFrames: number,
  easing: BezierTuple = EASINGS.easeOutQuart
): number {
  return easedProgress(frame, startFrame, drawDurationFrames, easing);
}

/** Straight-line length between two points (no DOM measurement needed). */
export function lineLength(from: { x: number; y: number }, to: { x: number; y: number }): number {
  return Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
}
