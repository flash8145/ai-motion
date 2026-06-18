/**
 * EdgeLight — rim lighting along the frame's edges, as if a light source sits
 * just off-screen. Subtly separates the scene from the canvas border.
 *
 * params:
 *   color (#FFFFFF)
 *   side ("all")                — "top" | "bottom" | "left" | "right" | "all"
 *   thickness (16)              — falloff depth in %
 *   intensity (0.45)
 *   breathe (1)                 — 1 = gentle intensity pulse, 0 = steady
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { LightLayer } from "./LightLayer";
import {
  type ModifierComponentProps,
  readNumber,
  readString,
} from "../types";

function edgeBackground(side: string, color: string, t: number): string {
  switch (side) {
    case "top":
      return `linear-gradient(180deg, ${color}, transparent ${t}%)`;
    case "bottom":
      return `linear-gradient(0deg, ${color}, transparent ${t}%)`;
    case "left":
      return `linear-gradient(90deg, ${color}, transparent ${t}%)`;
    case "right":
      return `linear-gradient(270deg, ${color}, transparent ${t}%)`;
    case "all":
    default:
      return `radial-gradient(ellipse at center, transparent ${100 - t * 2}%, ${color} 100%)`;
  }
}

export const EdgeLight: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const color = readString(params, "color", "#FFFFFF");
  const side = readString(params, "side", "all");
  const thickness = readNumber(params, "thickness", 16);
  const intensity = readNumber(params, "intensity", 0.45);
  const breathe = readNumber(params, "breathe", 1);

  const pulse =
    breathe >= 1
      ? 0.8 + 0.2 * Math.sin(((frame - start) / 110) * Math.PI * 2)
      : 1;

  const style: React.CSSProperties = {
    background: edgeBackground(side, color, thickness),
    opacity: intensity * pulse,
  };

  return <LightLayer layers={[style]}>{children}</LightLayer>;
};
