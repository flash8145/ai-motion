import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";

interface KineticTextProps {
  /** Lines of text to animate. Each line gets its own animation treatment. */
  lines: Array<{
    text: string;
    fontSize?: number;
    fontWeight?: number;
    color?: string;
  }>;
  /** Frame at which the first line starts. Default: 5 */
  startFrame?: number;
  /** Frames between each line start. Default: 12 */
  lineStagger?: number;
}

/**
 * KineticText — Kinetic typography scene where each line of text
 * appears with a different spring-driven translateY and scale,
 * creating a dynamic, energetic reading experience.
 */
export const KineticText: React.FC<KineticTextProps> = ({
  lines,
  startFrame = 5,
  lineStagger = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Pre-assign alternating sizes if not specified
  const processedLines = useMemo(
    () =>
      lines.map((line, i) => ({
        ...line,
        fontSize: line.fontSize ?? (i % 2 === 0 ? 56 : 42),
        fontWeight: line.fontWeight ?? (i % 2 === 0 ? 800 : 500),
        color: line.color ?? (i % 2 === 0 ? theme.colors.text : theme.colors.mutedText),
      })),
    [lines, theme]
  );

  return (
    <AbsoluteFill>
      <GradientBackground opacity={0.6} />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          gap: 16,
        }}
      >
        {processedLines.map((line, index) => {
          const delay = startFrame + index * lineStagger;

          const springVal = spring({
            frame: frame - delay,
            fps,
            config: SPRING_PRESETS.smooth,
            durationInFrames: 35,
          });

          const translateY = interpolate(springVal, [0, 1], [60, 0]);
          const scale = interpolate(springVal, [0, 1], [0.9, 1]);

          const opacity = interpolate(
            frame - delay,
            [0, 15],
            [0, 1],
            {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          // Subtle horizontal shift for visual dynamism
          const translateX = index % 2 === 0 ? -20 : 20;
          const xSpring = interpolate(springVal, [0, 1], [translateX, 0]);

          return (
            <div
              key={`line-${index}`}
              style={{
                fontFamily: theme.resolvedFonts.heading,
                fontSize: line.fontSize,
                fontWeight: line.fontWeight,
                color: line.color,
                opacity,
                transform: `translateY(${translateY}px) translateX(${xSpring}px) scale(${scale})`,
                textAlign: "center",
                willChange: "transform, opacity",
                lineHeight: 1.2,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
