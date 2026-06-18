/**
 * HumanCursor — a realistic pointer that glides between waypoints with human
 * easing, presses on clicks (with a ripple ring), and can show labels. The
 * workhorse for product/SaaS walkthroughs.
 */
import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../theme/ThemeProvider";
import { CursorPointer } from "./CursorPointer";
import { sampleCursor, type CursorWaypoint } from "./cursorPath";

interface HumanCursorProps {
  path: CursorWaypoint[];
  startFrame: number;
  durationFrames: number;
  color?: string;
  size?: number;
  rippleColor?: string;
}

export const HumanCursor: React.FC<HumanCursorProps> = ({
  path,
  startFrame,
  durationFrames,
  color,
  size = 24,
  rippleColor,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const local = frame - startFrame;
  const safePath = useMemo(() => (path?.length ? path : [{ x: 0, y: 0 }]), [path]);

  if (local < 0 || local > durationFrames) return null;

  const { x, y, clicking, label } = sampleCursor(safePath, local, durationFrames);
  const opacity = interpolate(
    local,
    [0, 8, durationFrames - 8, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const cursorColor = color ?? theme.colors.text;
  const ripple = rippleColor ?? theme.colors.primary;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        pointerEvents: "none",
        zIndex: 120,
        willChange: "transform, left, top",
      }}
    >
      {/* Click ripple */}
      {clicking > 0 && (
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 4,
            width: 8 + clicking * 52,
            height: 8 + clicking * 52,
            marginLeft: -(4 + clicking * 26),
            marginTop: -(4 + clicking * 26),
            borderRadius: "50%",
            border: `2px solid ${ripple}`,
            opacity: (1 - clicking) * 0.9,
          }}
        />
      )}
      <CursorPointer color={cursorColor} size={size} pressed={clicking} />
      {label && (
        <span
          style={{
            position: "absolute",
            left: size + 6,
            top: 2,
            fontFamily: theme.resolvedFonts.body,
            fontSize: 14,
            color: theme.colors.text,
            backgroundColor: `${theme.colors.surface}E6`,
            border: `1px solid ${theme.colors.border}`,
            padding: "4px 10px",
            borderRadius: 6,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
