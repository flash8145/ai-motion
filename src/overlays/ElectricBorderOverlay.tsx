import React from "react";
import { useCurrentFrame, random } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface ElectricBorderOverlayProps {
  position: { x: number; y: number; width?: number; height?: number };
  startFrame: number;
  durationFrames: number;
  color?: string;
}

/**
 * ElectricBorderOverlay — a jittery, glowing border for highlighting a
 * region (e.g. framing a feature in a product shot). The jitter steps
 * every 2 frames via remotion's seeded random(), giving an "electric"
 * flicker that stays deterministic across renders.
 */
export const ElectricBorderOverlay: React.FC<ElectricBorderOverlayProps> = ({
  position,
  startFrame,
  durationFrames,
  color,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > durationFrames) return null;

  const accent = color ?? theme.colors.primary;
  const width = position.width ?? 300;
  const height = position.height ?? 180;
  const jitterStep = Math.floor(localFrame / 2);
  const jitter = (seed: string) => (random(`electric-${seed}-${jitterStep}`) - 0.5) * 3;
  const filterId = `electric-glow-${position.x}-${position.y}`;

  return (
    <svg
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width,
        height,
        pointerEvents: "none",
        zIndex: 90,
        overflow: "visible",
      }}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <rect
        x={2 + jitter("a")}
        y={2 + jitter("b")}
        width={width - 4}
        height={height - 4}
        rx={12}
        fill="none"
        stroke={accent}
        strokeWidth={3}
        filter={`url(#${filterId})`}
        opacity={0.7}
      />
      <rect
        x={2 + jitter("c")}
        y={2 + jitter("d")}
        width={width - 4}
        height={height - 4}
        rx={12}
        fill="none"
        stroke={accent}
        strokeWidth={1.5}
      />
    </svg>
  );
};
