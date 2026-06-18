/**
 * CameraOrbit — arcs around the content using a perspective rotateY (with an
 * optional rotateX), giving a premium 3D parallax feel to flat scenes.
 *
 * params:
 *   fromYaw (-14), toYaw (14)   — rotateY degrees
 *   fromPitch (0), toPitch (0)  — rotateX degrees
 *   overscan (1.16)             — hides edges exposed by the rotation
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

export const CameraOrbit: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = getModifierProgress(frame, modifier, sceneDurationFrames);
  const params = modifier.params;

  const fromYaw = readNumber(params, "fromYaw", -14);
  const toYaw = readNumber(params, "toYaw", 14);
  const fromPitch = readNumber(params, "fromPitch", 0);
  const toPitch = readNumber(params, "toPitch", 0);
  const overscan = readNumber(params, "overscan", 1.16);
  const perspective = readNumber(params, "perspective", 1400);

  const yaw = interpolate(p, [0, 1], [fromYaw, toYaw]);
  const pitch = interpolate(p, [0, 1], [fromPitch, toPitch]);

  return (
    <CameraStage
      perspective={perspective}
      transform={`scale(${overscan}) rotateX(${pitch}deg) rotateY(${yaw}deg)`}
    >
      {children}
    </CameraStage>
  );
};
