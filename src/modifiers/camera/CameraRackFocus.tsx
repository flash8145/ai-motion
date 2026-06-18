/**
 * CameraRackFocus — pulls focus by animating a blur on the whole layer, e.g.
 * starting soft and snapping sharp (focus-in) or vice versa. A faint scale
 * "breathing" sells the lens move.
 *
 * params:
 *   fromBlur (14), toBlur (0)   — px of gaussian blur
 *   fromScale (1.03), toScale (1.0)
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CameraStage } from "./CameraStage";
import {
  type ModifierComponentProps,
  getModifierProgress,
  readNumber,
} from "../types";

export const CameraRackFocus: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = getModifierProgress(frame, modifier, sceneDurationFrames);
  const params = modifier.params;

  const fromBlur = readNumber(params, "fromBlur", 14);
  const toBlur = readNumber(params, "toBlur", 0);
  const fromScale = readNumber(params, "fromScale", 1.03);
  const toScale = readNumber(params, "toScale", 1.0);

  const blur = interpolate(p, [0, 1], [fromBlur, toBlur]);
  const scale = interpolate(p, [0, 1], [fromScale, toScale]);

  return (
    <CameraStage
      transform={`scale(${scale})`}
      filter={`blur(${Math.max(0, blur)}px)`}
    >
      {children}
    </CameraStage>
  );
};
