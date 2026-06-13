/**
 * Scene transition utilities.
 *
 * These produce style objects (opacity, transform) that can be applied
 * to a wrapping div around a scene. They drive transitions using
 * Remotion's interpolate() — NOT CSS transitions.
 */

import { interpolate, Easing } from "remotion";
import type { TransitionType } from "../types/schema";
import { EASINGS } from "./easings";

export interface TransitionStyles {
  opacity: number;
  transform: string;
}

/**
 * Calculates the entrance transition style for a given frame.
 *
 * @param type        - The transition type
 * @param frame       - Current local frame of the scene (from useCurrentFrame)
 * @param duration    - Duration of the transition in frames
 * @returns Style object to apply to the scene wrapper
 */
export function getTransitionInStyle(
  type: TransitionType,
  frame: number,
  duration: number
): TransitionStyles {
  if (type === "none" || duration <= 0) {
    return { opacity: 1, transform: "none" };
  }

  const progress = interpolate(frame, [0, duration], [0, 1], {
    easing: Easing.bezier(...EASINGS.easeOutQuart),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  switch (type) {
    case "fade":
      return {
        opacity: progress,
        transform: "none",
      };

    case "slide-up": {
      const translateY = interpolate(progress, [0, 1], [60, 0]);
      return {
        opacity: progress,
        transform: `translateY(${translateY}px)`,
      };
    }

    case "slide-left": {
      const translateX = interpolate(progress, [0, 1], [80, 0]);
      return {
        opacity: progress,
        transform: `translateX(${translateX}px)`,
      };
    }

    case "zoom": {
      const scale = interpolate(progress, [0, 1], [0.85, 1]);
      return {
        opacity: progress,
        transform: `scale(${scale})`,
      };
    }

    default:
      return { opacity: 1, transform: "none" };
  }
}
