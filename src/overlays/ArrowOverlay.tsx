import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface ArrowOverlayProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  startFrame: number;
  durationFrames: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * ArrowOverlay — Draws an animated arrow between two points
 * using SVG strokeDashoffset.
 */
export const ArrowOverlay: React.FC<ArrowOverlayProps> = ({
  from,
  to,
  startFrame,
  durationFrames,
  color,
  strokeWidth = 2,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > durationFrames) return null;

  const lineColor = color ?? theme.colors.primary;

  // Calculate arrow geometry
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // Draw progress
  const drawProgress = interpolate(localFrame, [0, 20], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit fade
  const exitOpacity = interpolate(
    localFrame,
    [durationFrames - 10, durationFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const dashOffset = length * (1 - drawProgress);

  // Arrowhead points
  const arrowSize = 10;
  const arrowX = to.x;
  const arrowY = to.y;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 100,
        opacity: exitOpacity,
      }}
    >
      {/* Line */}
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeDasharray={length}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
      />

      {/* Arrowhead */}
      <polygon
        points={`
          ${arrowX},${arrowY}
          ${arrowX - arrowSize * Math.cos(angle - 0.4)},${arrowY - arrowSize * Math.sin(angle - 0.4)}
          ${arrowX - arrowSize * Math.cos(angle + 0.4)},${arrowY - arrowSize * Math.sin(angle + 0.4)}
        `}
        fill={lineColor}
        opacity={drawProgress}
      />
    </svg>
  );
};
