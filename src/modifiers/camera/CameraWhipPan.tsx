/**
 * CameraWhipPan — a fast directional snap with heavy motion blur, used as an
 * energetic in/out accent (place a short one at a scene's start). The frame
 * rushes in from `distance` and settles sharp.
 *
 * params:
 *   distance (900)          — px the frame travels (sign = direction)
 *   axis ("x")              — "x" | "y"
 *   maxBlur (40)            — peak motion blur in px
 *   overscan (1.18)
 *
 * Defaults to a short ~12f move via durationFrames if none is provided.
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CameraStage } from "./CameraStage";
import {
  type ModifierComponentProps,
  getModifierProgress,
  readNumber,
  readString,
} from "../types";

export const CameraWhipPan: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  // Whips are short by nature — default to a 12-frame snap if unspecified.
  const effective = {
    ...modifier,
    durationFrames: modifier.durationFrames ?? 12,
  };
  const p = getModifierProgress(frame, effective, sceneDurationFrames);
  const params = modifier.params;

  const distance = readNumber(params, "distance", 900);
  const axis = readString(params, "axis", "x");
  const maxBlur = readNumber(params, "maxBlur", 40);
  const overscan = readNumber(params, "overscan", 1.18);

  // Travel from `distance` → 0; blur scales with remaining distance (velocity).
  const offset = interpolate(p, [0, 1], [distance, 0]);
  const blur = interpolate(p, [0, 1], [maxBlur, 0]);
  const translate =
    axis === "y" ? `translateY(${offset}px)` : `translateX(${offset}px)`;

  return (
    <CameraStage
      transform={`scale(${overscan}) ${translate}`}
      filter={`blur(${Math.max(0, blur)}px)`}
    >
      {children}
    </CameraStage>
  );
};
