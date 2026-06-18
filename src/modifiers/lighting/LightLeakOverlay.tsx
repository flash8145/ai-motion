/**
 * LightLeakOverlay — warm analog "film light leaks" bleeding in from the edges,
 * drifting and flickering. Gives footage an organic, shot-on-film feel.
 *
 * params:
 *   colors (["#FF7A18","#FF3D6E","#FFD15C"])  — leak palette
 *   intensity (0.5)
 *   driftPeriod (220)
 *   flicker (1)                 — 1 = subtle opacity flutter, 0 = steady
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { LightLayer } from "./LightLayer";
import { type ModifierComponentProps, readNumber } from "../types";

// Corner anchors the three leaks bleed from.
const ANCHORS = [
  { x: 8, y: 12 },
  { x: 96, y: 30 },
  { x: 70, y: 98 },
];

export const LightLeakOverlay: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const rawColors = params?.colors;
  const colors: string[] =
    Array.isArray(rawColors) && rawColors.every((c) => typeof c === "string")
      ? (rawColors as string[])
      : ["#FF7A18", "#FF3D6E", "#FFD15C"];

  const intensity = readNumber(params, "intensity", 0.5);
  const driftPeriod = readNumber(params, "driftPeriod", 220);
  const flicker = readNumber(params, "flicker", 1);

  const t = ((frame - start) / driftPeriod) * Math.PI * 2;

  const layers: React.CSSProperties[] = ANCHORS.map((a, i) => {
    const color = colors[i % colors.length];
    const cx = a.x + Math.sin(t + i) * 6;
    const cy = a.y + Math.cos(t * 0.7 + i) * 6;
    const flick =
      flicker >= 1 ? 0.75 + 0.25 * Math.sin(t * 3 + i * 1.7) : 1;
    return {
      background: `radial-gradient(circle 40% at ${cx}% ${cy}%, ${color}, transparent 60%)`,
      opacity: intensity * flick,
    };
  });

  return <LightLayer layers={layers}>{children}</LightLayer>;
};
