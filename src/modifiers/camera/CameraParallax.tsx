/**
 * CameraParallax — slow, continuous drift (gentle sinusoidal float) that adds
 * life to otherwise static backgrounds. Loops smoothly rather than running a
 * single start→end move, so it pairs well with depth/foreground layers.
 *
 * params:
 *   amplitudeX (40), amplitudeY (24)  — drift distance in px
 *   periodFrames (240)                — frames per full oscillation
 *   overscan (1.12)
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { CameraStage } from "./CameraStage";
import {
  type ModifierComponentProps,
  readNumber,
} from "../types";

export const CameraParallax: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const amplitudeX = readNumber(params, "amplitudeX", 40);
  const amplitudeY = readNumber(params, "amplitudeY", 24);
  const periodFrames = readNumber(params, "periodFrames", 240);
  const overscan = readNumber(params, "overscan", 1.12);

  const t = ((frame - start) / periodFrames) * Math.PI * 2;
  const x = Math.sin(t) * amplitudeX;
  // Quarter-phase offset so vertical drift feels like an orbit, not a diagonal.
  const y = Math.sin(t + Math.PI / 2) * amplitudeY;

  return (
    <CameraStage transform={`scale(${overscan}) translate(${x}px, ${y}px)`}>
      {children}
    </CameraStage>
  );
};
