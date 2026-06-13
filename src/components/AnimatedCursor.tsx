import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";

// ─── Public interfaces ───────────────────────────────────────────

export interface CursorPoint {
  /** X position in px */
  x: number;
  /** Y position in px */
  y: number;
  /** Frame at which the cursor should arrive at this point */
  frame: number;
  /** If true a click animation triggers when arriving */
  click?: boolean;
}

export interface AnimatedCursorProps {
  /** Ordered waypoints the cursor moves through */
  points: CursorPoint[];
  /** Additional frames at which a click fires (independent of points) */
  clickFrames?: number[];
  /** Cursor size in px. Default: 24 */
  size?: number;
  /** Cursor fill colour. Default: '#FFFFFF' */
  color?: string;
  /** Whether to render trailing ghost copies. Default: true */
  showTrail?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────

/** Resolve current (x, y) position by interpolating between the two
 *  surrounding waypoints using a smooth Bezier easing. */
function resolvePosition(
  frame: number,
  points: CursorPoint[],
): { x: number; y: number } {
  if (points.length === 0) return { x: 0, y: 0 };

  // Before first waypoint — stay at start
  if (frame <= points[0].frame) {
    return { x: points[0].x, y: points[0].y };
  }

  // After last waypoint — stay at end
  if (frame >= points[points.length - 1].frame) {
    return {
      x: points[points.length - 1].x,
      y: points[points.length - 1].y,
    };
  }

  // Find active segment
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];

    if (frame >= curr.frame && frame <= next.frame) {
      const t = interpolate(
        frame,
        [curr.frame, next.frame],
        [0, 1],
        {
          easing: Easing.bezier(...EASINGS.easeInOutSmooth),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      );
      return {
        x: interpolate(t, [0, 1], [curr.x, next.x]),
        y: interpolate(t, [0, 1], [curr.y, next.y]),
      };
    }
  }

  return { x: points[0].x, y: points[0].y };
}

/** Check whether the cursor is "dwelling" — i.e. it has been at
 *  the same waypoint target for >dwellThreshold frames. */
function isDwelling(
  frame: number,
  points: CursorPoint[],
  dwellThreshold: number,
): boolean {
  for (const pt of points) {
    // Dwelling means we arrived at this point and are staying
    if (frame >= pt.frame && frame <= pt.frame + dwellThreshold) {
      // Check if there's a next point — if so, only dwell if we
      // haven't started moving toward it yet.
      const ptIndex = points.indexOf(pt);
      const next = points[ptIndex + 1];
      if (!next || frame < next.frame) {
        if (frame - pt.frame >= dwellThreshold) {
          return true;
        }
      }
    }
  }
  return false;
}

/** Collect all click frames — from points with click:true + explicit clickFrames */
function collectClickFrames(
  points: CursorPoint[],
  extraClickFrames?: number[],
): number[] {
  const frames: number[] = [];
  for (const pt of points) {
    if (pt.click) frames.push(pt.frame);
  }
  if (extraClickFrames) frames.push(...extraClickFrames);
  return frames;
}

// ─── Constants ───────────────────────────────────────────────────

/** Click animation total duration in frames */
const CLICK_DURATION = 16;
/** Ripple total duration in frames */
const RIPPLE_DURATION = 22;
/** Number of trailing ghost copies */
const TRAIL_COUNT = 3;
/** Frame delay between each trailing ghost */
const TRAIL_LAG = 2;
/** Dwell threshold in frames before hover scale activates */
const DWELL_THRESHOLD = 10;

// ─── Component ───────────────────────────────────────────────────

/**
 * AnimatedCursor — Premium animated cursor that smoothly moves between
 * waypoints with Bezier easing. Supports hover scale, click squish,
 * expanding ripple rings, and trailing ghost copies.
 *
 * This is a composable overlay — it renders no background.
 */
export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  points,
  clickFrames: extraClickFrames,
  size = 24,
  color = "#FFFFFF",
  showTrail = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  if (points.length === 0) return null;

  const resolvedColor = color ?? theme.colors.text;

  // ── Current position ──────────────────────────────────────────
  const { x, y } = resolvePosition(frame, points);

  // ── Hover dwell detection ─────────────────────────────────────
  const hovering = isDwelling(frame, points, DWELL_THRESHOLD);

  const hoverScale = hovering
    ? interpolate(
        spring({
          frame: frame - DWELL_THRESHOLD,
          fps,
          config: SPRING_PRESETS.gentle,
          durationInFrames: 20,
        }),
        [0, 1],
        [1, 1.1],
      )
    : 1;

  // ── Click detection ───────────────────────────────────────────
  const allClickFrames = collectClickFrames(points, extraClickFrames);

  // Find the most relevant active click
  let activeClickStart: number | null = null;
  for (const cf of allClickFrames) {
    if (frame >= cf && frame < cf + CLICK_DURATION) {
      activeClickStart = cf;
      break;
    }
  }

  // Click squish: scale down to 0.85 then spring back
  const clickScale =
    activeClickStart !== null
      ? interpolate(
          frame - activeClickStart,
          [0, 4, 10, CLICK_DURATION],
          [1, 0.85, 1.05, 1],
          {
            easing: Easing.bezier(...EASINGS.easeInOutSmooth),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 1;

  // ── Ripple rings ──────────────────────────────────────────────
  const ripples: { scale: number; opacity: number }[] = [];

  for (const cf of allClickFrames) {
    if (frame >= cf && frame < cf + RIPPLE_DURATION) {
      // 3 concentric rings staggered by 3 frames
      for (let ring = 0; ring < 3; ring++) {
        const ringDelay = ring * 3;
        const elapsed = frame - cf - ringDelay;

        if (elapsed < 0) {
          ripples.push({ scale: 0, opacity: 0 });
          continue;
        }

        const ringScale = interpolate(
          elapsed,
          [0, RIPPLE_DURATION - ringDelay],
          [0.3, 2.2 + ring * 0.5],
          {
            easing: Easing.bezier(...EASINGS.easeOut),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        const ringOpacity = interpolate(
          elapsed,
          [0, 4, RIPPLE_DURATION - ringDelay],
          [0.5 - ring * 0.1, 0.4 - ring * 0.1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        ripples.push({ scale: ringScale, opacity: ringOpacity });
      }
    }
  }

  // ── Trail (ghost copies) ──────────────────────────────────────
  const trailPositions: { x: number; y: number; opacity: number }[] = [];
  if (showTrail) {
    for (let t = 1; t <= TRAIL_COUNT; t++) {
      const lagFrame = frame - t * TRAIL_LAG;
      const pos = resolvePosition(lagFrame, points);
      trailPositions.push({
        x: pos.x,
        y: pos.y,
        opacity: interpolate(t, [1, TRAIL_COUNT], [0.35, 0.08], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      });
    }
  }

  // ── Combined scale ────────────────────────────────────────────
  const combinedScale = hoverScale * clickScale;

  // ── Entry fade (cursor fades in at the start) ─────────────────
  const entryOpacity = interpolate(
    frame,
    [points[0].frame, points[0].frame + 8],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // ── Cursor SVG path ───────────────────────────────────────────
  const cursorSvg = (
    fillColor: string,
    fillOpacity: number = 1,
    cursorSize: number = size,
  ) => (
    <svg
      width={cursorSize}
      height={cursorSize * 1.3}
      viewBox="0 0 24 31"
      fill="none"
      style={{
        filter:
          fillOpacity > 0.5
            ? "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.45))"
            : "none",
      }}
    >
      <path
        d="M1 1L1 22.5L6.5 17.5L11.5 27.5L15.5 25.5L10.5 15.5L18 15.5L1 1Z"
        fill={fillColor}
        fillOpacity={fillOpacity}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth={fillOpacity > 0.5 ? 0.8 : 0}
      />
    </svg>
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* ── Trail ghosts ─────────────────────────────────────── */}
      {trailPositions.map((trail, i) => (
        <div
          key={`trail-${i}`}
          style={{
            position: "absolute",
            left: trail.x,
            top: trail.y,
            opacity: trail.opacity * entryOpacity,
            willChange: "transform, opacity",
          }}
        >
          {cursorSvg(resolvedColor, trail.opacity, size * 0.9)}
        </div>
      ))}

      {/* ── Ripple rings ─────────────────────────────────────── */}
      {ripples.map(
        (ripple, i) =>
          ripple.opacity > 0 && (
            <div
              key={`ripple-${i}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: size * 2,
                height: size * 2,
                borderRadius: "50%",
                border: `2px solid ${resolvedColor}`,
                opacity: ripple.opacity * entryOpacity,
                transform: `translate(-50%, -50%) scale(${ripple.scale})`,
                willChange: "transform, opacity",
              }}
            />
          ),
      )}

      {/* ── Main cursor ──────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `scale(${combinedScale})`,
          transformOrigin: "top left",
          opacity: entryOpacity,
          willChange: "transform, opacity",
        }}
      >
        {cursorSvg(resolvedColor)}
      </div>
    </div>
  );
};
