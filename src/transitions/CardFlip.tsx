/**
 * CardFlip — the scene flips into view like a card rotating on its vertical
 * (or horizontal) axis, in 3D perspective.
 *
 * params: axis ("y"|"x", default "y"), from (-90), perspective (1600)
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { type TransitionComponentProps, tProgress, readNumber, readString } from "./util";

export const CardFlip: React.FC<TransitionComponentProps> = ({
  frame,
  durationFrames,
  params,
  children,
}) => {
  if (frame >= durationFrames) return <AbsoluteFill>{children}</AbsoluteFill>;

  const axis = readString(params, "axis", "y");
  const from = readNumber(params, "from", -90);
  const perspective = readNumber(params, "perspective", 1600);
  const p = tProgress(frame, durationFrames);

  const angle = from * (1 - p);
  const rotate = axis === "x" ? `rotateX(${angle}deg)` : `rotateY(${angle}deg)`;
  // Fade the "edge-on" portion so the back of the card isn't seen.
  const opacity = Math.min(1, p * 2);

  return (
    <AbsoluteFill style={{ perspective: `${perspective}px` }}>
      <AbsoluteFill
        style={{
          transform: rotate,
          transformOrigin: "center center",
          backfaceVisibility: "hidden",
          opacity,
          willChange: "transform, opacity",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
