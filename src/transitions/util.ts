/**
 * Transition layer — shared types & helpers.
 *
 * These are RICH ENTRANCE transitions: a scene appears with the effect during
 * its `transitionIn` window, then the wrapper becomes a passthrough. They
 * extend the legacy style-based transitions (fade/slide/zoom) with
 * component-based effects that can render multiple animated elements
 * (grid cells, portal rings, page curl). Motion is driven by interpolate().
 */
import type React from "react";
import { interpolate, Easing } from "remotion";
import { EASINGS, type BezierTuple } from "../animation/easings";

export interface TransitionComponentProps {
  /** Scene-local frame. */
  frame: number;
  durationFrames: number;
  params?: Record<string, unknown>;
  children: React.ReactNode;
}

/** Eased 0→1 progress across the transition window. */
export function tProgress(
  frame: number,
  durationFrames: number,
  easing: BezierTuple = EASINGS.easeOutQuart,
): number {
  return interpolate(frame, [0, Math.max(1, durationFrames)], [0, 1], {
    easing: Easing.bezier(...easing),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function readNumber(
  params: Record<string, unknown> | undefined,
  key: string,
  fallback: number,
): number {
  const v = params?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

export function readString(
  params: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const v = params?.[key];
  return typeof v === "string" ? v : fallback;
}
