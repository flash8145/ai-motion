/**
 * LensBloom — a blooming highlight that pulses with overexposure, plus an
 * optional anamorphic horizontal streak. Great on glossy product highlights.
 *
 * params:
 *   originX (50), originY (45)   — bloom centre in %
 *   color (#FFFFFF), radius (260) — bloom size in px
 *   intensity (0.7)
 *   pulsePeriod (90)             — frames per pulse
 *   streak (1)                   — 1 = show anamorphic streak, 0 = off
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { LightLayer } from "./LightLayer";
import {
  type ModifierComponentProps,
  readNumber,
  readString,
} from "../types";

export const LensBloom: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const ox = readNumber(params, "originX", 50);
  const oy = readNumber(params, "originY", 45);
  const color = readString(params, "color", "#FFFFFF");
  const radius = readNumber(params, "radius", 260);
  const intensity = readNumber(params, "intensity", 0.7);
  const pulsePeriod = readNumber(params, "pulsePeriod", 90);
  const streak = readNumber(params, "streak", 1);

  const t = ((frame - start) / pulsePeriod) * Math.PI * 2;
  const pulse = 0.55 + 0.45 * Math.sin(t);
  const opacity = intensity * pulse;

  const layers: React.CSSProperties[] = [
    {
      background: `radial-gradient(circle ${radius}px at ${ox}% ${oy}%, ${color}, transparent 65%)`,
      opacity,
    },
  ];

  if (streak >= 1) {
    layers.push({
      background: `radial-gradient(60% 1.6% at ${ox}% ${oy}%, ${color}, transparent 70%)`,
      opacity: opacity * 0.9,
    });
  }

  return <LightLayer layers={layers}>{children}</LightLayer>;
};
