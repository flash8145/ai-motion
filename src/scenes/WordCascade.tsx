import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";

interface WordCascadeProps {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  /** Frames between each word. Default 5 */
  wordStagger?: number;
  startFrame?: number;
  maxWidth?: number;
  /** Highlight color applied to words wrapped in *asterisks*. */
  accentColor?: string;
}

/**
 * WordCascade — words tumble in one after another (drop + fade + slight
 * settle), like a waterfall of type. Wrap a word in *asterisks* to accent it.
 */
export const WordCascade: React.FC<WordCascadeProps> = ({
  text,
  fontSize = 72,
  fontWeight = 700,
  color,
  backgroundColor,
  wordStagger = 5,
  startFrame = 6,
  maxWidth = 1000,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const words = useMemo(() => text.split(" "), [text]);
  const textColor = color ?? theme.colors.text;
  const accent = accentColor ?? theme.colors.primary;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: `${fontSize * 0.18}px ${fontSize * 0.3}px`,
          maxWidth,
          justifyContent: "center",
        }}
      >
        {words.map((raw, i) => {
          const isAccent = raw.startsWith("*") && raw.endsWith("*");
          const word = isAccent ? raw.slice(1, -1) : raw;
          const wordStart = startFrame + i * wordStagger;
          const s = spring({
            frame: frame - wordStart,
            fps,
            config: SPRING_PRESETS.smooth,
            durationInFrames: 26,
          });
          const translateY = interpolate(s, [0, 1], [-50, 0]);
          const opacity = interpolate(s, [0, 0.6], [0, 1], {
            extrapolateRight: "clamp",
          });
          return (
            <span
              key={`wc-${i}`}
              style={{
                display: "inline-block",
                transform: `translateY(${translateY}px)`,
                opacity,
                fontFamily: theme.resolvedFonts.heading,
                fontSize,
                fontWeight,
                color: isAccent ? accent : textColor,
                willChange: "transform, opacity",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
