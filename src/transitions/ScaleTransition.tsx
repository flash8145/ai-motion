/**
 * ScaleTransition — scene scales into place (with a touch of overshoot) and
 * fades in. More dramatic than the legacy "zoom".
 *
 * params: from (0.5), overshoot (1|0)
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EASINGS } from "../animation/easings";
import { type TransitionComponentProps, tProgress, readNumber } from "./util";

export const ScaleTransition: React.FC<TransitionComponentProps> = ({
  frame,
  durationFrames,
  params,
  children,
}) => {
  if (frame >= durationFrames) return <AbsoluteFill>{children}</AbsoluteFill>;

  const from = readNumber(params, "from", 0.5);
  const overshoot = readNumber(params, "overshoot", 1);
  const p = tProgress(
    frame,
    durationFrames,
    overshoot >= 1 ? EASINGS.overshoot : EASINGS.easeOutQuart,
  );
  const scale = from + (1 - from) * p;

  return (
    <AbsoluteFill
      style={{ transform: `scale(${scale})`, opacity: p, willChange: "transform, opacity" }}
    >
      {children}
    </AbsoluteFill>
  );
};
