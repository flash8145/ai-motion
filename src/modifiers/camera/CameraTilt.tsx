/**
 * CameraTilt — vertical sweep with a subtle perspective tilt, as if the
 * camera pivots up or down. Overscan hides the translated edges.
 *
 * params:
 *   fromY (80), toY (-80)   — vertical travel in px (down→up tilt)
 *   fromTilt (6), toTilt (-2) — rotateX degrees through the move
 *   overscan (1.14)
 *   perspective (1400)
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CameraStage } from "./CameraStage";
import {
  type ModifierComponentProps,
  getModifierProgress,
  readNumber,
} from "../types";

export const CameraTilt: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = getModifierProgress(frame, modifier, sceneDurationFrames);
  const params = modifier.params;

  const fromY = readNumber(params, "fromY", 80);
  const toY = readNumber(params, "toY", -80);
  const fromTilt = readNumber(params, "fromTilt", 6);
  const toTilt = readNumber(params, "toTilt", -2);
  const overscan = readNumber(params, "overscan", 1.14);
  const perspective = readNumber(params, "perspective", 1400);

  const y = interpolate(p, [0, 1], [fromY, toY]);
  const tilt = interpolate(p, [0, 1], [fromTilt, toTilt]);

  return (
    <CameraStage
      perspective={perspective}
      transform={`scale(${overscan}) translateY(${y}px) rotateX(${tilt}deg)`}
    >
      {children}
    </CameraStage>
  );
};
