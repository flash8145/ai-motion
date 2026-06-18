/**
 * CameraPullOut — slow zoom away from the content, revealing the wider frame.
 *
 * params:
 *   fromScale (1.2), toScale (1.0)
 *   originX, originY — focal point in %, 0–100 (default 50/50 = centre)
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CameraStage } from "./CameraStage";
import {
  type ModifierComponentProps,
  getModifierProgress,
  readNumber,
} from "../types";

export const CameraPullOut: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = getModifierProgress(frame, modifier, sceneDurationFrames);
  const params = modifier.params;

  const fromScale = readNumber(params, "fromScale", 1.2);
  const toScale = readNumber(params, "toScale", 1.0);
  const originX = readNumber(params, "originX", 50);
  const originY = readNumber(params, "originY", 50);

  const scale = interpolate(p, [0, 1], [fromScale, toScale]);

  return (
    <CameraStage
      transform={`scale(${scale})`}
      transformOrigin={`${originX}% ${originY}%`}
    >
      {children}
    </CameraStage>
  );
};
