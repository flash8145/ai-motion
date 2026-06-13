/**
 * Cubic-bezier easing curve configurations.
 *
 * These are used with Remotion's `Easing.bezier(x1, y1, x2, y2)`
 * inside `interpolate()` calls.
 *
 * CSS transitions/animations are FORBIDDEN in Remotion — these are
 * the Remotion-compatible equivalent, applied via interpolate().
 *
 * Usage:
 *   import { interpolate, Easing } from "remotion";
 *   import { EASINGS } from "../animation/easings";
 *
 *   const opacity = interpolate(frame, [0, 60], [0, 1], {
 *     easing: Easing.bezier(...EASINGS.easeOutQuart),
 *     extrapolateLeft: "clamp",
 *     extrapolateRight: "clamp",
 *   });
 */

/** Tuple of [x1, y1, x2, y2] for Easing.bezier() */
export type BezierTuple = [number, number, number, number];

export const EASINGS = {
  /** Strong ease-out, no overshoot — ideal for entrances */
  easeOutQuart: [0.16, 1, 0.3, 1] as BezierTuple,

  /** Symmetric ease-in-out — editorial / slow fades */
  easeInOut: [0.77, 0, 0.175, 1] as BezierTuple,

  /** Smooth ease-in-out (balanced) */
  easeInOutSmooth: [0.45, 0, 0.55, 1] as BezierTuple,

  /** Playful overshoot — for emphasis (badges, popups) */
  overshoot: [0.34, 1.56, 0.64, 1] as BezierTuple,

  /** Standard ease-out for UI elements */
  easeOut: [0.22, 1, 0.36, 1] as BezierTuple,

  /** Ease-in for exit animations */
  easeIn: [0.55, 0, 1, 0.45] as BezierTuple,

  /** Apple-style deceleration */
  appleDecelerate: [0.1, 0.9, 0.2, 1] as BezierTuple,
} as const;

export type EasingPresetName = keyof typeof EASINGS;
