/**
 * MultiCursor — several labelled cursors moving independently, Figma-style
 * multiplayer presence. Each has its own path, name tag, and color.
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../theme/ThemeProvider";
import { CursorPointer } from "./CursorPointer";
import { sampleCursor, type CursorWaypoint } from "./cursorPath";

interface MultiCursorAgent {
  path: CursorWaypoint[];
  label?: string;
  color?: string;
}

interface MultiCursorProps {
  cursors: MultiCursorAgent[];
  startFrame: number;
  durationFrames: number;
  size?: number;
}

const FALLBACK_COLORS = ["#5B8CFF", "#FF6F91", "#28E0B0", "#FFB020", "#A66BFF"];

export const MultiCursor: React.FC<MultiCursorProps> = ({
  cursors,
  startFrame,
  durationFrames,
  size = 22,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const local = frame - startFrame;

  if (local < 0 || local > durationFrames || !cursors?.length) return null;

  const opacity = interpolate(
    local,
    [0, 8, durationFrames - 8, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <>
      {cursors.map((agent, i) => {
        const color = agent.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
        const path = agent.path?.length ? agent.path : [{ x: 0, y: 0 }];
        const { x, y, clicking } = sampleCursor(path, local, durationFrames);
        return (
          <div
            key={`mc-${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity,
              pointerEvents: "none",
              zIndex: 120,
            }}
          >
            <CursorPointer color={color} size={size} pressed={clicking} />
            {agent.label && (
              <span
                style={{
                  position: "absolute",
                  left: size,
                  top: size,
                  fontFamily: theme.resolvedFonts.body,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  backgroundColor: color,
                  padding: "3px 9px",
                  borderRadius: 6,
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}
              >
                {agent.label}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
};
