/**
 * AICommandCursor — a glowing AI-driven cursor trailing a "command" pill, for
 * agent / voice-control demos (e.g. an AI controlling the computer). The pill
 * types its command out and a pulsing dot marks AI activity.
 */
import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../theme/ThemeProvider";
import { CursorPointer } from "./CursorPointer";
import { sampleCursor, type CursorWaypoint } from "./cursorPath";

interface AICommandCursorProps {
  path: CursorWaypoint[];
  startFrame: number;
  durationFrames: number;
  /** Command text shown in the trailing pill. */
  command?: string;
  accentColor?: string;
  size?: number;
}

export const AICommandCursor: React.FC<AICommandCursorProps> = ({
  path,
  startFrame,
  durationFrames,
  command,
  accentColor,
  size = 24,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const local = frame - startFrame;
  const safePath = useMemo(() => (path?.length ? path : [{ x: 0, y: 0 }]), [path]);

  if (local < 0 || local > durationFrames) return null;

  const { x, y, clicking } = sampleCursor(safePath, local, durationFrames);
  const accent = accentColor ?? theme.colors.primary;
  const opacity = interpolate(
    local,
    [0, 8, durationFrames - 8, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Type the command out, then hold.
  const cmd = command ?? "";
  const typed = cmd.slice(
    0,
    Math.floor(
      interpolate(local, [10, 10 + cmd.length * 1.5], [0, cmd.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );
  const pulse = 0.6 + 0.4 * Math.sin(local * 0.25);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        pointerEvents: "none",
        zIndex: 120,
      }}
    >
      {/* Glow halo */}
      <div
        style={{
          position: "absolute",
          left: 2,
          top: 2,
          width: 46,
          height: 46,
          marginLeft: -23,
          marginTop: -23,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}55, transparent 70%)`,
          opacity: pulse,
        }}
      />
      <CursorPointer color="#FFFFFF" size={size} pressed={clicking} glow={accent} />

      {/* Command pill */}
      {cmd.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: size + 8,
            top: -6,
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: `${theme.colors.surface}F2`,
            border: `1px solid ${accent}`,
            boxShadow: `0 0 18px ${accent}55`,
            padding: "7px 14px",
            borderRadius: 999,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: accent,
              opacity: pulse,
              boxShadow: `0 0 8px ${accent}`,
            }}
          />
          <span
            style={{
              fontFamily: theme.resolvedFonts.body,
              fontSize: 15,
              fontWeight: 600,
              color: theme.colors.text,
            }}
          >
            {typed}
          </span>
        </div>
      )}
    </div>
  );
};
