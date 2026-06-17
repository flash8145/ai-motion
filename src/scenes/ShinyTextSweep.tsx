import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface ShinyTextSweepProps {
  text: string;
  subtitle?: string;
  startFrame?: number;
  sweepDurationFrames?: number;
  loop?: boolean;
  loopGapFrames?: number;
  fontSize?: number;
  baseColor?: string;
  shineColor?: string;
}

/**
 * ShinyTextSweep — a metallic highlight sweeps across the headline via
 * a frame-driven backgroundPosition on a text-clipped gradient. Optionally
 * loops for an ongoing premium shimmer (e.g. behind a CTA).
 */
export const ShinyTextSweep: React.FC<ShinyTextSweepProps> = ({
  text,
  subtitle,
  startFrame = 0,
  sweepDurationFrames = 45,
  loop = false,
  loopGapFrames = 60,
  fontSize = 88,
  baseColor,
  shineColor = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const cycle = sweepDurationFrames + loopGapFrames;
  const rawLocal = frame - startFrame;
  const local = loop ? ((rawLocal % cycle) + cycle) % cycle : rawLocal;

  const sweepPosition = interpolate(local, [0, sweepDurationFrames], [-60, 160], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resolvedBase = baseColor ?? theme.colors.text;
  const opacity = interpolate(rawLocal, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}
    >
      <div
        style={{
          fontFamily: theme.resolvedFonts.heading,
          fontSize,
          fontWeight: 800,
          opacity,
          backgroundImage: `linear-gradient(100deg, ${resolvedBase} 40%, ${shineColor} 50%, ${resolvedBase} 60%)`,
          backgroundSize: "250% 100%",
          backgroundPosition: `${sweepPosition}% 0`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
        }}
      >
        {text}
      </div>
      {subtitle && (
        <div
          style={{
            color: theme.colors.mutedText,
            fontFamily: theme.resolvedFonts.body,
            fontSize: 22,
            opacity,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
