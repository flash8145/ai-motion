/**
 * KeyframeEngine — generic multi-segment keyframe interpolation.
 *
 * Lets any numeric property (x, y, scale, rotation, opacity, custom)
 * be driven by an arbitrary list of `{ frame, value, easing }` points,
 * the same mental model as After Effects' timeline keyframes, instead
 * of being hard-coded into a single scene component.
 */

import { Easing } from "remotion";
import type { Keyframe, EasingConfig } from "../types/schema";

/** Converts a schema EasingConfig into a Remotion Easing function. */
export function resolveEasing(easing?: EasingConfig): (input: number) => number {
  if (!easing) return Easing.linear;

  switch (easing.type) {
    case "cubic-bezier":
      return Easing.bezier(
        easing.x1 ?? 0.16,
        easing.y1 ?? 1,
        easing.x2 ?? 0.3,
        easing.y2 ?? 1
      );
    case "ease-in":
      return Easing.in(Easing.ease);
    case "ease-out":
      return Easing.out(Easing.ease);
    case "ease-in-out":
      return Easing.inOut(Easing.ease);
    case "linear":
    default:
      return Easing.linear;
  }
}

/**
 * Interpolates a value across a sorted-by-frame list of keyframes.
 * - Before the first keyframe: holds the first value.
 * - After the last keyframe: holds the last value.
 * - Between two keyframes: applies the easing attached to the
 *   segment's target (later) keyframe, falling back to the segment's
 *   start keyframe, falling back to linear.
 */
export function interpolateKeyframes(frame: number, keyframes: Keyframe[]): number {
  if (keyframes.length === 0) return 0;

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);

  if (frame <= sorted[0].frame) return sorted[0].value;
  const last = sorted[sorted.length - 1];
  if (frame >= last.frame) return last.value;

  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i];
    const end = sorted[i + 1];

    if (frame >= start.frame && frame <= end.frame) {
      if (end.frame === start.frame) return end.value;

      const localProgress = (frame - start.frame) / (end.frame - start.frame);
      const easingFn = resolveEasing(end.easing ?? start.easing);
      const easedProgress = easingFn(localProgress);

      return start.value + (end.value - start.value) * easedProgress;
    }
  }

  return last.value;
}

/** A named bundle of keyframes for one animatable property (e.g. "x", "rotation"). */
export interface KeyframeTrack {
  property: string;
  keyframes: Keyframe[];
}

/** Resolves every track in a list to its current numeric value at `frame`. */
export function resolveKeyframeTracks(
  frame: number,
  tracks: KeyframeTrack[]
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const track of tracks) {
    result[track.property] = interpolateKeyframes(frame, track.keyframes);
  }
  return result;
}
