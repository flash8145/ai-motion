import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { EASINGS } from "../../animation/easings";

interface CursorKeyframe {
  /** Frame at which cursor should be at this position */
  frame: number;
  /** Target x position */
  x: number;
  /** Target y position */
  y: number;
  /** Whether a click animation should play at this point */
  click?: boolean;
}

interface AnimatedCursorProps {
  /** Array of keyframes defining cursor movement path */
  keyframes: CursorKeyframe[];
  /** Cursor color. Default: white */
  color?: string;
  /** Cursor size (width). Default: 20 */
  size?: number;
  /** Whether to show a click ripple effect. Default: true */
  showClickRipple?: boolean;
}

/**
 * AnimatedCursor — A pointer cursor that smoothly moves between
 * keyframe positions and optionally shows a click ripple.
 *
 * All motion via Remotion's interpolate().
 */
export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  keyframes,
  color = "#FFFFFF",
  size = 20,
  showClickRipple = true,
}) => {
  const frame = useCurrentFrame();

  if (keyframes.length === 0) return null;

  // Find current segment
  let x = keyframes[0].x;
  let y = keyframes[0].y;
  let isClicking = false;

  if (frame <= keyframes[0].frame) {
    x = keyframes[0].x;
    y = keyframes[0].y;
  } else if (frame >= keyframes[keyframes.length - 1].frame) {
    x = keyframes[keyframes.length - 1].x;
    y = keyframes[keyframes.length - 1].y;
  } else {
    for (let i = 0; i < keyframes.length - 1; i++) {
      const curr = keyframes[i];
      const next = keyframes[i + 1];

      if (frame >= curr.frame && frame <= next.frame) {
        const progress = interpolate(
          frame,
          [curr.frame, next.frame],
          [0, 1],
          {
            easing: Easing.bezier(...EASINGS.easeInOutSmooth),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        x = interpolate(progress, [0, 1], [curr.x, next.x]);
        y = interpolate(progress, [0, 1], [curr.y, next.y]);
        break;
      }
    }
  }

  // Check if we're near a click keyframe
  for (const kf of keyframes) {
    if (kf.click && Math.abs(frame - kf.frame) < 8) {
      isClicking = true;
      break;
    }
  }

  // Click ripple animation
  const clickScale = isClicking
    ? interpolate(
        frame % 16,
        [0, 8, 16],
        [0, 1.5, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      )
    : 0;

  const clickOpacity = isClicking
    ? interpolate(
        frame % 16,
        [0, 4, 16],
        [0.6, 0.3, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      )
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* Click ripple */}
      {showClickRipple && isClicking && (
        <div
          style={{
            position: "absolute",
            width: size * 3,
            height: size * 3,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: clickOpacity,
            transform: `translate(-50%, -50%) scale(${clickScale})`,
            top: 0,
            left: 0,
          }}
        />
      )}

      {/* Cursor pointer SVG */}
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 24 31"
        fill="none"
        style={{
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          transform: isClicking ? "scale(0.9)" : "scale(1)",
        }}
      >
        <path
          d="M1 1L1 22.5L6.5 17.5L11.5 27.5L15.5 25.5L10.5 15.5L18 15.5L1 1Z"
          fill={color}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};
