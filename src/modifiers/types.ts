/**
 * Modifier layer — shared types & helpers.
 *
 * A "modifier" wraps a scene (and its overlays) to apply a camera move,
 * lighting pass, depth effect, etc. Modifiers are declared per-scene in the
 * Scene Graph JSON (`scene.modifiers[]`) and nested as wrappers by
 * VideoProject. Like everything else in this codebase, motion is driven by
 * Remotion's interpolate()/spring() — never CSS transitions.
 */

import type React from "react";
import { interpolate, Easing } from "remotion";
import { EASINGS } from "../animation/easings";
import type { EasingConfig, SceneModifier } from "../types/schema";

/** Props every modifier component receives. */
export interface ModifierComponentProps {
  modifier: SceneModifier;
  /** Total duration of the host scene, used to default a modifier's span. */
  sceneDurationFrames: number;
  children: React.ReactNode;
}

/**
 * Resolves a schema EasingConfig into a Remotion easing function.
 * Defaults to Apple-style deceleration — the right curve for camera moves.
 */
export function resolveEasing(
  easing?: EasingConfig,
): (input: number) => number {
  if (!easing) return Easing.bezier(...EASINGS.appleDecelerate);
  switch (easing.type) {
    case "linear":
      return Easing.linear;
    case "ease-in":
      return Easing.in(Easing.ease);
    case "ease-out":
      return Easing.out(Easing.ease);
    case "ease-in-out":
      return Easing.inOut(Easing.ease);
    case "cubic-bezier":
      return Easing.bezier(
        easing.x1 ?? 0.42,
        easing.y1 ?? 0,
        easing.x2 ?? 0.58,
        easing.y2 ?? 1,
      );
    default:
      return Easing.bezier(...EASINGS.appleDecelerate);
  }
}

/**
 * Eased 0→1 progress of a modifier over its [startFrame, startFrame+duration]
 * window. Defaults to spanning the whole scene when no duration is given.
 */
export function getModifierProgress(
  frame: number,
  modifier: SceneModifier,
  sceneDurationFrames: number,
): number {
  const start = modifier.startFrame ?? 0;
  const duration =
    modifier.durationFrames ?? Math.max(1, sceneDurationFrames - start);
  return interpolate(frame, [start, start + duration], [0, 1], {
    easing: resolveEasing(modifier.easing),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Safely read a numeric param with a fallback. */
export function readNumber(
  params: Record<string, unknown> | undefined,
  key: string,
  fallback: number,
): number {
  const v = params?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

/** Safely read a string param with a fallback. */
export function readString(
  params: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const v = params?.[key];
  return typeof v === "string" ? v : fallback;
}
