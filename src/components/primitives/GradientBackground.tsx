import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { useTheme } from "../../theme/ThemeProvider";

interface GradientStop {
  color: string;
  /** Position in viewport: { x: 0-100%, y: 0-100% } */
  position: { x: number; y: number };
  /** Radius of the radial gradient in % */
  radius?: number;
}

interface GradientBackgroundProps {
  /** Custom gradient stops. Falls back to theme-derived gradients. */
  stops?: GradientStop[];
  /** Animation speed multiplier. Default: 1 */
  speed?: number;
  /** Overall opacity. Default: 1 */
  opacity?: number;
}

/**
 * GradientBackground — Animated fluid gradient background using
 * radial gradients whose positions shift over time.
 *
 * Uses Remotion's interpolate() for all motion — no CSS animations.
 */
export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  stops: customStops,
  speed = 1,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Generate default stops from theme colors
  const stops: GradientStop[] = customStops ?? [
    {
      color: theme.colors.primary,
      position: { x: 30, y: 30 },
      radius: 50,
    },
    {
      color: theme.colors.secondary,
      position: { x: 70, y: 60 },
      radius: 45,
    },
    {
      color: theme.colors.accent,
      position: { x: 50, y: 80 },
      radius: 40,
    },
  ];

  // Animate gradient positions
  const time = (frame / fps) * speed;

  const gradients = stops.map((stop, i) => {
    const phaseOffset = (i / stops.length) * Math.PI * 2;
    const radius = stop.radius ?? 45;

    const xShift = interpolate(
      Math.sin(time * 0.5 + phaseOffset),
      [-1, 1],
      [-15, 15]
    );
    const yShift = interpolate(
      Math.cos(time * 0.4 + phaseOffset + 1),
      [-1, 1],
      [-10, 10]
    );

    const x = stop.position.x + xShift;
    const y = stop.position.y + yShift;

    return `radial-gradient(circle ${radius}% at ${x}% ${y}%, ${stop.color}33 0%, transparent 70%)`;
  });

  // Smooth reveal
  const fadeIn = interpolate(frame, [0, Math.round(fps * 0.5)], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        opacity: fadeIn * opacity,
      }}
    >
      {/* Gradient layer */}
      <AbsoluteFill
        style={{
          backgroundImage: gradients.join(", "),
          filter: "blur(60px)",
        }}
      />
    </AbsoluteFill>
  );
};
