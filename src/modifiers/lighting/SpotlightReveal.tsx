/**
 * SpotlightReveal — darkens the whole frame except a circular spotlight that
 * grows (and/or moves) to reveal the scene out of the shadows. A dramatic
 * opener. Unlike the additive lights this composites NORMALLY (it darkens).
 *
 * params:
 *   originX (50), originY (50)   — spotlight centre in %
 *   fromRadius (0), toRadius (820) — spotlight radius in px
 *   feather (240)                — soft falloff width in px
 *   darkness (0.88)              — 0–1 opacity of the surrounding shadow
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { LightLayer } from "./LightLayer";
import {
  type ModifierComponentProps,
  getModifierProgress,
  readNumber,
} from "../types";

export const SpotlightReveal: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = getModifierProgress(frame, modifier, sceneDurationFrames);
  const params = modifier.params;

  const ox = readNumber(params, "originX", 50);
  const oy = readNumber(params, "originY", 50);
  const fromRadius = readNumber(params, "fromRadius", 0);
  const toRadius = readNumber(params, "toRadius", 820);
  const feather = readNumber(params, "feather", 240);
  const darkness = readNumber(params, "darkness", 0.88);

  const r = interpolate(p, [0, 1], [fromRadius, toRadius]);

  const style: React.CSSProperties = {
    background: `radial-gradient(circle at ${ox}% ${oy}%, transparent ${r}px, rgba(0,0,0,${darkness}) ${r + feather}px)`,
    mixBlendMode: "normal",
  };

  return <LightLayer layers={[style]}>{children}</LightLayer>;
};
