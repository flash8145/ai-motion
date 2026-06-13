/**
 * Custom spring presets modeled after Apple's motion design language.
 * These are config objects compatible with Remotion's `spring()` function.
 *
 * Usage:
 *   import { spring, useCurrentFrame, useVideoConfig } from "remotion";
 *   import { SPRING_PRESETS } from "../animation/springs";
 *
 *   const frame = useCurrentFrame();
 *   const { fps } = useVideoConfig();
 *   const val = spring({ frame, fps, config: SPRING_PRESETS.snappy });
 */

export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
}

export const SPRING_PRESETS = {
  /** Fast popups, menus, click responses */
  snappy: {
    damping: 20,
    stiffness: 160,
    mass: 0.5,
  } as SpringConfig,

  /** Large slide-ins, device layout entries */
  smooth: {
    damping: 26,
    stiffness: 120,
    mass: 0.8,
  } as SpringConfig,

  /** Heavy text reveals, background pans */
  slow: {
    damping: 40,
    stiffness: 80,
    mass: 1.0,
  } as SpringConfig,

  /** Subtle micro-interactions, small badge pops */
  gentle: {
    damping: 30,
    stiffness: 100,
    mass: 0.6,
  } as SpringConfig,

  /** Bouncy overshoot for emphasis */
  bouncy: {
    damping: 12,
    stiffness: 200,
    mass: 0.5,
  } as SpringConfig,
} as const;

export type SpringPresetName = keyof typeof SPRING_PRESETS;
