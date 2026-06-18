/**
 * MovingGlow — a soft radial glow blob that drifts across the scene on a gentle
 * sinusoidal orbit, like a roaming key light. Loops smoothly.
 *
 * params:
 *   color (#5B8CFF), radius (440)   — glow size in px
 *   amplitudeX (24), amplitudeY (16) — drift range in %
 *   periodFrames (200)
 *   intensity (0.5)
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { LightLayer } from "./LightLayer";
import {
  type ModifierComponentProps,
  readNumber,
  readString,
} from "../types";

export const MovingGlow: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const color = readString(params, "color", "#5B8CFF");
  const radius = readNumber(params, "radius", 440);
  const ampX = readNumber(params, "amplitudeX", 24);
  const ampY = readNumber(params, "amplitudeY", 16);
  const periodFrames = readNumber(params, "periodFrames", 200);
  const intensity = readNumber(params, "intensity", 0.5);

  const t = ((frame - start) / periodFrames) * Math.PI * 2;
  const cx = 50 + Math.sin(t) * ampX;
  const cy = 50 + Math.cos(t * 0.8) * ampY;

  const style: React.CSSProperties = {
    background: `radial-gradient(circle ${radius}px at ${cx}% ${cy}%, ${color}, transparent 70%)`,
    opacity: intensity,
  };

  return <LightLayer layers={[style]}>{children}</LightLayer>;
};
