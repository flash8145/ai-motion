/**
 * Interpolation helper utilities.
 * Thin wrappers over Remotion's interpolate() for common patterns.
 */

import { interpolate, Easing } from "remotion";
import { EASINGS } from "../animation/easings";

/**
 * Creates a progress value from 0 to 1 with standard easing.
 */
export function progress(
  frame: number,
  startFrame: number,
  durationFrames: number,
  easing: readonly [number, number, number, number] = EASINGS.easeOutQuart
): number {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    easing: Easing.bezier(...easing),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * Creates a fade-in-out lifecycle opacity value.
 */
export function fadeInOut(
  frame: number,
  startFrame: number,
  durationFrames: number,
  fadeFrames: number = 10
): number {
  const fadeIn = interpolate(
    frame,
    [startFrame, startFrame + fadeFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const endFrame = startFrame + durationFrames;
  const fadeOut = interpolate(
    frame,
    [endFrame - fadeFrames, endFrame],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return Math.min(fadeIn, fadeOut);
}

/**
 * Converts seconds to frames at a given FPS.
 */
export function secToFrames(seconds: number, fps: number): number {
  return Math.round(seconds * fps);
}
