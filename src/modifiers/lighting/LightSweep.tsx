/**
 * LightSweep — a diagonal band of light glides across the whole frame, like a
 * reflection passing over glass. Classic "premium product" accent.
 *
 * params:
 *   color (#FFFFFF), angle (20)        — stripe tilt in deg
 *   bandWidth (12)                     — half-width of the stripe in %
 *   intensity (0.6)
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { LightLayer } from "./LightLayer";
import {
  type ModifierComponentProps,
  getModifierProgress,
  readNumber,
  readString,
} from "../types";

export const LightSweep: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = getModifierProgress(frame, modifier, sceneDurationFrames);
  const params = modifier.params;

  const color = readString(params, "color", "#FFFFFF");
  const angle = readNumber(params, "angle", 20);
  const bandWidth = readNumber(params, "bandWidth", 12);
  const intensity = readNumber(params, "intensity", 0.6);

  // Stripe travels across an overscaled layer; sin envelope fades the entry/exit.
  const translate = interpolate(p, [0, 1], [-60, 60]);
  const envelope = Math.sin(Math.min(Math.max(p, 0), 1) * Math.PI);

  const style: React.CSSProperties = {
    width: "220%",
    left: "-60%",
    background: `linear-gradient(${angle}deg, transparent ${50 - bandWidth}%, ${color} 50%, transparent ${50 + bandWidth}%)`,
    transform: `translateX(${translate}%)`,
    opacity: intensity * envelope,
  };

  return <LightLayer layers={[style]}>{children}</LightLayer>;
};
