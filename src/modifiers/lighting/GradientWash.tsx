/**
 * GradientWash — a full-frame colour gradient that slowly drifts its position,
 * washing the scene in shifting hues. Use "soft-light" / "overlay" blends to
 * tint without blowing out detail.
 *
 * params:
 *   colors (["#5B8CFF","#A66BFF","#FF6F91"])  — wash palette
 *   angle (120)
 *   period (300)                — frames per full drift cycle
 *   intensity (0.4)
 *   blend ("soft-light")        — CSS mix-blend-mode for the wash
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { LightLayer } from "./LightLayer";
import {
  type ModifierComponentProps,
  readNumber,
  readString,
} from "../types";

export const GradientWash: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const rawColors = params?.colors;
  const colors: string[] =
    Array.isArray(rawColors) && rawColors.every((c) => typeof c === "string")
      ? (rawColors as string[])
      : ["#5B8CFF", "#A66BFF", "#FF6F91"];

  const angle = readNumber(params, "angle", 120);
  const period = readNumber(params, "period", 300);
  const intensity = readNumber(params, "intensity", 0.4);
  const blend = readString(params, "blend", "soft-light");

  const t = ((frame - start) / period) * Math.PI * 2;
  const pos = 50 + Math.sin(t) * 50; // 0–100% drift

  const style: React.CSSProperties = {
    background: `linear-gradient(${angle}deg, ${colors.join(", ")})`,
    backgroundSize: "220% 220%",
    backgroundPosition: `${pos}% 50%`,
    opacity: intensity,
    mixBlendMode: blend as React.CSSProperties["mixBlendMode"],
  };

  return <LightLayer layers={[style]}>{children}</LightLayer>;
};
