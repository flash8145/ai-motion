/**
 * PortalTransition — the scene is revealed through an expanding circular portal
 * (clip-path) with a glowing ring riding the growing edge.
 *
 * params: originX (50), originY (50), ringColor (theme primary), ringWidth (10)
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { type TransitionComponentProps, tProgress, readNumber, readString } from "./util";

export const PortalTransition: React.FC<TransitionComponentProps> = ({
  frame,
  durationFrames,
  params,
  children,
}) => {
  const theme = useTheme();
  if (frame >= durationFrames) return <AbsoluteFill>{children}</AbsoluteFill>;

  const ox = readNumber(params, "originX", 50);
  const oy = readNumber(params, "originY", 50);
  const ringColor = readString(params, "ringColor", theme.colors.primary);
  const ringWidth = readNumber(params, "ringWidth", 10);

  const p = tProgress(frame, durationFrames);
  // Radius in vmax-ish %; 75% reaches the far corner from centre.
  const radius = p * 85;
  const clip = `circle(${radius}% at ${ox}% ${oy}%)`;
  const ringOpacity = interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringSize = radius * 2;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip, willChange: "clip-path" }}>
        {children}
      </AbsoluteFill>
      {/* Glowing ring on the portal edge */}
      <div
        style={{
          position: "absolute",
          left: `${ox}%`,
          top: `${oy}%`,
          width: `${ringSize}%`,
          height: `${ringSize}%`,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: `${ringWidth}px solid ${ringColor}`,
          boxShadow: `0 0 40px ${ringColor}, inset 0 0 40px ${ringColor}`,
          opacity: ringOpacity,
          pointerEvents: "none",
          willChange: "width, height, opacity",
        }}
      />
    </AbsoluteFill>
  );
};
