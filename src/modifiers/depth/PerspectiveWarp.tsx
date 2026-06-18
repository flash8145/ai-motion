/**
 * PerspectiveWarp — tilts the whole scene plane in 3D space to give a flat
 * composition real depth. Eases from a stronger warp to the target tilt so it
 * "settles" into place. Distinct from CameraOrbit (which continuously arcs).
 *
 * params:
 *   rotateX (8), rotateY (-12)   — target tilt in deg
 *   perspective (1200)
 *   scale (1.06)                 — overscan to hide tilted edges
 *   settle (1)                   — 1 = animate in from a stronger warp, 0 = static
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CameraStage } from "../camera/CameraStage";
import {
  type ModifierComponentProps,
  getModifierProgress,
  readNumber,
} from "../types";

export const PerspectiveWarp: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = getModifierProgress(frame, modifier, sceneDurationFrames);
  const params = modifier.params;

  const rotX = readNumber(params, "rotateX", 8);
  const rotY = readNumber(params, "rotateY", -12);
  const perspective = readNumber(params, "perspective", 1200);
  const scale = readNumber(params, "scale", 1.06);
  const settle = readNumber(params, "settle", 1);

  // Ease in from ~1.8× the target tilt so the plane swings into place.
  const k = settle >= 1 ? interpolate(p, [0, 1], [1.8, 1]) : 1;

  return (
    <CameraStage
      perspective={perspective}
      transform={`scale(${scale}) rotateX(${rotX * k}deg) rotateY(${rotY * k}deg)`}
    >
      {children}
    </CameraStage>
  );
};
