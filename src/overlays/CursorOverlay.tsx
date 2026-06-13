import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface CursorOverlayProps {
  position: { x: number; y: number };
  startFrame: number;
  durationFrames: number;
  color?: string;
  label?: string;
}

/**
 * CursorOverlay — Shows a static cursor icon at a position
 * with a fade-in/out lifecycle. Useful for indicating click targets.
 */
export const CursorOverlay: React.FC<CursorOverlayProps> = ({
  position,
  startFrame,
  durationFrames,
  color,
  label,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > durationFrames) return null;

  const opacity = interpolate(
    localFrame,
    [0, 8, durationFrames - 8, durationFrames],
    [0, 1, 1, 0],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const cursorColor = color ?? theme.colors.text;

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        opacity,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <svg width={20} height={26} viewBox="0 0 24 31" fill="none">
        <path
          d="M1 1L1 22.5L6.5 17.5L11.5 27.5L15.5 25.5L10.5 15.5L18 15.5L1 1Z"
          fill={cursorColor}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth={1}
        />
      </svg>
      {label && (
        <span
          style={{
            position: "absolute",
            left: 24,
            top: 4,
            fontFamily: theme.resolvedFonts.body,
            fontSize: 12,
            color: theme.colors.text,
            backgroundColor: `${theme.colors.surface}DD`,
            padding: "3px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
