/**
 * SlideTransition — scene slides in from a chosen direction. Flexible
 * replacement for the fixed legacy slide-up / slide-left.
 *
 * params: direction ("up"|"down"|"left"|"right", default "up"), fade (1|0)
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { type TransitionComponentProps, tProgress, readString, readNumber } from "./util";

export const SlideTransition: React.FC<TransitionComponentProps> = ({
  frame,
  durationFrames,
  params,
  children,
}) => {
  if (frame >= durationFrames) return <AbsoluteFill>{children}</AbsoluteFill>;

  const direction = readString(params, "direction", "up");
  const fade = readNumber(params, "fade", 1);
  const p = tProgress(frame, durationFrames);
  const off = (1 - p) * 100; // % offset

  let transform = "none";
  switch (direction) {
    case "down":
      transform = `translateY(${-off}%)`;
      break;
    case "left":
      transform = `translateX(${off}%)`;
      break;
    case "right":
      transform = `translateX(${-off}%)`;
      break;
    case "up":
    default:
      transform = `translateY(${off}%)`;
  }

  return (
    <AbsoluteFill
      style={{ transform, opacity: fade >= 1 ? p : 1, willChange: "transform, opacity" }}
    >
      {children}
    </AbsoluteFill>
  );
};
