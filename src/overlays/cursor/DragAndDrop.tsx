/**
 * DragAndDrop — a cursor reaches an item, grabs it (hand + lift), drags it from
 * `from` to `to`, and releases. Demonstrates drag interactions in UI mockups.
 */
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../../theme/ThemeProvider";
import { EASINGS } from "../../animation/easings";
import { CursorPointer } from "./CursorPointer";

interface Point {
  x: number;
  y: number;
}

interface DragAndDropProps {
  from: Point;
  to: Point;
  startFrame: number;
  durationFrames: number;
  /** Dragged item dimensions / look. */
  item?: { label?: string; width?: number; height?: number; color?: string };
  cursorColor?: string;
}

export const DragAndDrop: React.FC<DragAndDropProps> = ({
  from,
  to,
  startFrame,
  durationFrames,
  item,
  cursorColor,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const local = frame - startFrame;

  if (local < 0 || local > durationFrames) return null;

  const ease = Easing.bezier(...EASINGS.easeInOutSmooth);
  const reachEnd = durationFrames * 0.26;
  const dragStart = durationFrames * 0.34;
  const dragEnd = durationFrames * 0.82;

  const entry: Point = { x: from.x - 140, y: from.y - 90 };

  // Cursor position.
  let cx: number;
  let cy: number;
  if (local <= reachEnd) {
    const t = ease(interpolate(local, [0, reachEnd], [0, 1], { extrapolateRight: "clamp" }));
    cx = entry.x + (from.x - entry.x) * t;
    cy = entry.y + (from.y - entry.y) * t;
  } else {
    const t = ease(
      interpolate(local, [dragStart, dragEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
    cx = from.x + (to.x - from.x) * t;
    cy = from.y + (to.y - from.y) * t;
  }

  const grabbing = local > reachEnd && local < dragEnd;
  const dropPulse =
    local >= dragEnd
      ? interpolate(local, [dragEnd, dragEnd + 8], [1, 0], { extrapolateRight: "clamp" })
      : 0;

  // Item position: at `from` until grabbed, follows cursor while dragging, then `to`.
  const w = item?.width ?? 180;
  const h = item?.height ?? 110;
  let ix: number;
  let iy: number;
  if (local < reachEnd) {
    ix = from.x;
    iy = from.y;
  } else if (local < dragEnd) {
    ix = cx;
    iy = cy;
  } else {
    ix = to.x;
    iy = to.y;
  }
  const lift = grabbing ? 1 : 0;
  const opacity = interpolate(
    local,
    [0, 8, durationFrames - 8, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none", zIndex: 120 }}>
      {/* Dragged item */}
      <div
        style={{
          position: "absolute",
          left: ix - w * 0.18,
          top: iy - h * 0.18,
          width: w,
          height: h,
          borderRadius: 14,
          background: item?.color ?? theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: grabbing
            ? "0 24px 48px rgba(0,0,0,0.35)"
            : "0 6px 16px rgba(0,0,0,0.18)",
          transform: `scale(${1 + lift * 0.05})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.resolvedFonts.body,
          fontSize: 18,
          fontWeight: 600,
          color: theme.colors.text,
          willChange: "left, top, transform",
        }}
      >
        {item?.label ?? ""}
      </div>

      {/* Drop ripple */}
      {dropPulse > 0 && (
        <div
          style={{
            position: "absolute",
            left: to.x,
            top: to.y,
            width: 8 + (1 - dropPulse) * 60,
            height: 8 + (1 - dropPulse) * 60,
            marginLeft: -(4 + (1 - dropPulse) * 30),
            marginTop: -(4 + (1 - dropPulse) * 30),
            borderRadius: "50%",
            border: `2px solid ${theme.colors.primary}`,
            opacity: dropPulse * 0.8,
          }}
        />
      )}

      {/* Cursor */}
      <div style={{ position: "absolute", left: cx, top: cy }}>
        <CursorPointer
          color={cursorColor ?? theme.colors.text}
          size={24}
          variant={grabbing ? "grab" : "arrow"}
          pressed={grabbing ? 0.4 : 0}
        />
      </div>
    </div>
  );
};
