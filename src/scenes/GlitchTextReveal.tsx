import React from "react";
import { AbsoluteFill, useCurrentFrame, random, interpolate } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface GlitchTextRevealProps {
  headline: string;
  subtitle?: string;
  startFrame?: number;
  glitchDurationFrames?: number;
  fontSize?: number;
  color?: string;
}

function glitchOffset(seedBase: string, frame: number, stepFrames: number, magnitude: number): number {
  const step = Math.floor(frame / stepFrames);
  return (random(`${seedBase}-${step}`) - 0.5) * magnitude;
}

/**
 * GlitchTextReveal — RGB-channel-split glitch effect that settles into
 * clean text. All jitter is derived from remotion's seeded random(),
 * stepped in fixed frame buckets, so the glitch is fully deterministic
 * across renders.
 */
export const GlitchTextReveal: React.FC<GlitchTextRevealProps> = ({
  headline,
  subtitle,
  startFrame = 0,
  glitchDurationFrames = 35,
  fontSize = 88,
  color,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const local = frame - startFrame;

  const settleProgress = interpolate(local, [0, glitchDurationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const baseColor = color ?? theme.colors.text;
  const jitterX = glitchOffset("glitch-x", local, 3, 12) * settleProgress;
  const sliceY = glitchOffset("glitch-y", local, 4, 6) * settleProgress;
  const redOffset = glitchOffset("glitch-red", local, 2, 10) * settleProgress;
  const cyanOffset = glitchOffset("glitch-cyan", local, 2, 10) * settleProgress;

  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textStyle: React.CSSProperties = {
    fontFamily: theme.resolvedFonts.heading,
    fontSize,
    fontWeight: 800,
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}
    >
      <div style={{ position: "relative", opacity }}>
        <div
          style={{
            ...textStyle,
            position: "absolute",
            inset: 0,
            color: "#FF375F",
            transform: `translate(${redOffset}px, ${sliceY}px)`,
            mixBlendMode: "screen",
            opacity: settleProgress * 0.8,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            ...textStyle,
            position: "absolute",
            inset: 0,
            color: "#0AFFEF",
            transform: `translate(${cyanOffset}px, ${-sliceY}px)`,
            mixBlendMode: "screen",
            opacity: settleProgress * 0.8,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            ...textStyle,
            position: "relative",
            color: baseColor,
            transform: `translate(${jitterX}px, 0)`,
          }}
        >
          {headline}
        </div>
      </div>
      {subtitle && (
        <div
          style={{
            color: theme.colors.mutedText,
            fontFamily: theme.resolvedFonts.body,
            fontSize: 24,
            opacity,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
