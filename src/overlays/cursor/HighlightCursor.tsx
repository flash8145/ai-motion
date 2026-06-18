/**
 * HighlightCursor — the cursor drag-selects a region: it moves to the area then
 * drags out a glowing marquee rectangle (translucent fill + border), as if
 * highlighting / selecting content. Optional label tags the selection.
 */
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../../theme/ThemeProvider";
import { EASINGS } from "../../animation/easings";
import { CursorPointer } from "./CursorPointer";

interface HighlightCursorProps {
  box: { x: number; y: number; width: number; height: number };
  startFrame: number;
  durationFrames: number;
  color?: string;
  label?: string;
  cursorColor?: string;
}

export const HighlightCursor: React.FC<HighlightCursorProps> = ({
  box,
  startFrame,
  durationFrames,
  color,
  label,
  cursorColor,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const local = frame - startFrame;

  if (local < 0 || local > durationFrames) return null;

  const ease = Easing.bezier(...EASINGS.easeInOutSmooth);
  const hl = color ?? theme.colors.primary;
  const reachEnd = durationFrames * 0.3;
  const entry = { x: box.x - 130, y: box.y - 80 };

  let cx: number;
  let cy: number;
  let sel = 0;
  if (local <= reachEnd) {
    const t = ease(interpolate(local, [0, reachEnd], [0, 1], { extrapolateRight: "clamp" }));
    cx = entry.x + (box.x - entry.x) * t;
    cy = entry.y + (box.y - entry.y) * t;
  } else {
    sel = ease(
      interpolate(local, [reachEnd, reachEnd + 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
    cx = box.x + box.width * sel;
    cy = box.y + box.height * sel;
  }

  const opacity = interpolate(
    local,
    [0, 8, durationFrames - 8, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none", zIndex: 120 }}>
      {/* Marquee selection */}
      {sel > 0 && (
        <div
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: box.width * sel,
            height: box.height * sel,
            borderRadius: 8,
            border: `2px solid ${hl}`,
            background: `${hl}1F`,
            boxShadow: `0 0 22px ${hl}44`,
          }}
        >
          {label && sel > 0.6 && (
            <span
              style={{
                position: "absolute",
                left: 0,
                top: -30,
                fontFamily: theme.resolvedFonts.body,
                fontSize: 13,
                fontWeight: 600,
                color: "#FFFFFF",
                backgroundColor: hl,
                padding: "3px 9px",
                borderRadius: 6,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          )}
        </div>
      )}

      {/* Cursor */}
      <div style={{ position: "absolute", left: cx, top: cy }}>
        <CursorPointer
          color={cursorColor ?? theme.colors.text}
          size={24}
          pressed={sel > 0 && sel < 1 ? 0.4 : 0}
        />
      </div>
    </div>
  );
};
