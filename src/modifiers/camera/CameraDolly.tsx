/**
 * CameraDolly — cinematic gliding move that combines a depth push (scale)
 * with a translation, e.g. a rising dolly-in. Distinct from PushIn (pure
 * zoom) because the frame also travels.
 *
 * params:
 *   fromScale (1.0), toScale (1.12)
 *   fromX (0), toX (0)      — horizontal travel in px
 *   fromY (40), toY (0)     — vertical travel in px
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CameraStage } from "./CameraStage";
import {
  type ModifierComponentProps,
  getModifierProgress,
  readNumber,
} from "../types";

export const CameraDolly: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = getModifierProgress(frame, modifier, sceneDurationFrames);
  const params = modifier.params;

  const fromScale = readNumber(params, "fromScale", 1.0);
  const toScale = readNumber(params, "toScale", 1.12);
  const fromX = readNumber(params, "fromX", 0);
  const toX = readNumber(params, "toX", 0);
  const fromY = readNumber(params, "fromY", 40);
  const toY = readNumber(params, "toY", 0);

  const scale = interpolate(p, [0, 1], [fromScale, toScale]);
  const x = interpolate(p, [0, 1], [fromX, toX]);
  const y = interpolate(p, [0, 1], [fromY, toY]);

  return (
    <CameraStage transform={`translate(${x}px, ${y}px) scale(${scale})`}>
      {children}
    </CameraStage>
  );
};
