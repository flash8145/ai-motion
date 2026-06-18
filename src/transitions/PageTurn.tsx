/**
 * PageTurn — the scene swings in like a page turning on its spine (hinged at an
 * edge), with a moving shadow gradient that sells the curl.
 *
 * params: hinge ("left"|"right", default "left"), from (105), perspective (2000)
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { type TransitionComponentProps, tProgress, readNumber, readString } from "./util";

export const PageTurn: React.FC<TransitionComponentProps> = ({
  frame,
  durationFrames,
  params,
  children,
}) => {
  if (frame >= durationFrames) return <AbsoluteFill>{children}</AbsoluteFill>;

  const hinge = readString(params, "hinge", "left");
  const from = readNumber(params, "from", 105);
  const perspective = readNumber(params, "perspective", 2000);
  const p = tProgress(frame, durationFrames);

  const left = hinge === "left";
  // Swing from `from` degrees down to 0.
  const angle = (left ? from : -from) * (1 - p);
  const shadeOpacity = interpolate(p, [0, 1], [0.55, 0]);

  return (
    <AbsoluteFill style={{ perspective: `${perspective}px` }}>
      <AbsoluteFill
        style={{
          transform: `rotateY(${angle}deg)`,
          transformOrigin: left ? "left center" : "right center",
          willChange: "transform",
        }}
      >
        {children}
        {/* Curl shadow */}
        <AbsoluteFill
          style={{
            background: left
              ? `linear-gradient(90deg, rgba(0,0,0,${shadeOpacity}) 0%, transparent 55%)`
              : `linear-gradient(270deg, rgba(0,0,0,${shadeOpacity}) 0%, transparent 55%)`,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
