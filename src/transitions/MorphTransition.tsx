/**
 * MorphTransition — scene morphs into being: an oversized, blurred, skewed
 * state resolves into the sharp final frame. Fluid, organic reveal.
 *
 * params: scaleFrom (1.25), blur (18), skew (6)
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { type TransitionComponentProps, tProgress, readNumber } from "./util";

export const MorphTransition: React.FC<TransitionComponentProps> = ({
  frame,
  durationFrames,
  params,
  children,
}) => {
  if (frame >= durationFrames) return <AbsoluteFill>{children}</AbsoluteFill>;

  const scaleFrom = readNumber(params, "scaleFrom", 1.25);
  const maxBlur = readNumber(params, "blur", 18);
  const maxSkew = readNumber(params, "skew", 6);
  const p = tProgress(frame, durationFrames);

  const scale = scaleFrom + (1 - scaleFrom) * p;
  const blur = (1 - p) * maxBlur;
  const skew = (1 - p) * maxSkew;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) skew(${skew}deg, ${skew * 0.4}deg)`,
        filter: `blur(${blur}px)`,
        opacity: p,
        willChange: "transform, filter, opacity",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
