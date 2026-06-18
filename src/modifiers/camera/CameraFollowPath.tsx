/**
 * CameraFollowPath — moves the frame through a series of waypoints over time,
 * for guided "tour" moves across a layout. Each waypoint is interpolated
 * independently so the camera eases between arbitrary positions/zooms.
 *
 * params:
 *   path: Array<{ frame: number; x: number; y: number; scale?: number }>
 *     frame  — scene-local frame for this waypoint
 *     x, y   — translation in px (camera offset; positive x pushes content left)
 *     scale  — optional zoom at this waypoint (default 1.1 overscan)
 *   overscan (1.1) — fallback scale when a waypoint omits `scale`
 *
 * Falls back to a gentle diagonal drift when no path is supplied.
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CameraStage } from "./CameraStage";
import { type ModifierComponentProps, readNumber } from "../types";

interface Waypoint {
  frame: number;
  x: number;
  y: number;
  scale?: number;
}

export const CameraFollowPath: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const overscan = readNumber(params, "overscan", 1.1);

  const raw = params?.path;
  let path: Waypoint[] = Array.isArray(raw)
    ? (raw as Waypoint[]).filter(
        (w) =>
          w &&
          typeof w.frame === "number" &&
          typeof w.x === "number" &&
          typeof w.y === "number",
      )
    : [];

  // Sensible default: drift from one corner bias to the other across the scene.
  if (path.length < 2) {
    path = [
      { frame: 0, x: -60, y: -30, scale: overscan },
      { frame: sceneDurationFrames, x: 60, y: 30, scale: overscan },
    ];
  }

  path.sort((a, b) => a.frame - b.frame);

  const frames = path.map((w) => w.frame);
  const xs = path.map((w) => -w.x); // camera offset → inverse content translate
  const ys = path.map((w) => -w.y);
  const scales = path.map((w) =>
    typeof w.scale === "number" ? w.scale : overscan,
  );

  const x = interpolate(frame, frames, xs, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, frames, ys, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, frames, scales, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <CameraStage transform={`scale(${scale}) translate(${x}px, ${y}px)`}>
      {children}
    </CameraStage>
  );
};
