/**
 * CameraPan — horizontal sweep across the frame. A constant overscan scale
 * hides the empty edges that translation would otherwise reveal.
 *
 * params:
 *   fromX (80), toX (-80)   — horizontal travel in px (left→right sweep)
 *   overscan (1.12)         — scale applied to crop translated edges
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CameraStage } from "./CameraStage";
import {
  type ModifierComponentProps,
  getModifierProgress,
  readNumber,
} from "../types";

export const CameraPan: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = getModifierProgress(frame, modifier, sceneDurationFrames);
  const params = modifier.params;

  const fromX = readNumber(params, "fromX", 80);
  const toX = readNumber(params, "toX", -80);
  const overscan = readNumber(params, "overscan", 1.12);

  const x = interpolate(p, [0, 1], [fromX, toX]);

  return (
    <CameraStage transform={`scale(${overscan}) translateX(${x}px)`}>
      {children}
    </CameraStage>
  );
};
