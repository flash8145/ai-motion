/**
 * BlurTransition — scene resolves out of a heavy blur (with a faint scale
 * breath) and fades in. Soft, premium focus-in.
 *
 * params: blur (26), scaleFrom (1.04)
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { type TransitionComponentProps, tProgress, readNumber } from "./util";

export const BlurTransition: React.FC<TransitionComponentProps> = ({
  frame,
  durationFrames,
  params,
  children,
}) => {
  if (frame >= durationFrames) return <AbsoluteFill>{children}</AbsoluteFill>;

  const maxBlur = readNumber(params, "blur", 26);
  const scaleFrom = readNumber(params, "scaleFrom", 1.04);
  const p = tProgress(frame, durationFrames);
  const blur = (1 - p) * maxBlur;
  const scale = scaleFrom + (1 - scaleFrom) * p;

  return (
    <AbsoluteFill
      style={{
        filter: `blur(${blur}px)`,
        transform: `scale(${scale})`,
        opacity: p,
        willChange: "filter, transform, opacity",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
