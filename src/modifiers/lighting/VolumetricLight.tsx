/**
 * VolumetricLight — god rays / light shafts radiating from a source point,
 * slowly rotating and masked to fade with distance. Adds cinematic atmosphere.
 *
 * params:
 *   originX (50), originY (0)   — light source position in %
 *   color (#FFFFFF)
 *   rayDensity (7)              — angular width of each ray pair in deg
 *   rotateSpeed (8)             — deg of slow rotation across the modifier span
 *   intensity (0.35)
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

export const VolumetricLight: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = getModifierProgress(frame, modifier, sceneDurationFrames);
  const params = modifier.params;

  const ox = readNumber(params, "originX", 50);
  const oy = readNumber(params, "originY", 0);
  const color = readString(params, "color", "#FFFFFF");
  const rayDensity = readNumber(params, "rayDensity", 7);
  const rotateSpeed = readNumber(params, "rotateSpeed", 8);
  const intensity = readNumber(params, "intensity", 0.35);

  const rot = interpolate(p, [0, 1], [0, rotateSpeed]);
  const fadeIn = interpolate(p, [0, 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mask = `radial-gradient(ellipse at ${ox}% ${oy}%, black 0%, transparent 65%)`;

  // Soft glow at the source.
  const glow: React.CSSProperties = {
    background: `radial-gradient(ellipse 60% 50% at ${ox}% ${oy}%, ${color}, transparent 60%)`,
    opacity: intensity * 0.8 * fadeIn,
  };

  // Radiating beams, masked so they dissipate away from the source.
  const rays: React.CSSProperties = {
    background: `repeating-conic-gradient(from ${rot}deg at ${ox}% ${oy}%, transparent 0deg, transparent ${rayDensity}deg, ${color} ${rayDensity}deg, ${color} ${rayDensity + 2}deg)`,
    maskImage: mask,
    WebkitMaskImage: mask,
    opacity: intensity * fadeIn,
  };

  return <LightLayer layers={[glow, rays]}>{children}</LightLayer>;
};
