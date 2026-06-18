import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { EASINGS } from "../animation/easings";

interface SplitTextRevealProps {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  /** Frames between each word's reveal. Default 4 */
  wordStagger?: number;
  startFrame?: number;
  maxWidth?: number;
  align?: "left" | "center";
}

/**
 * SplitTextReveal — each word slides up from behind a mask (overflow-clip),
 * staggered. The signature "premium editorial" headline entrance.
 */
export const SplitTextReveal: React.FC<SplitTextRevealProps> = ({
  text,
  fontSize = 96,
  fontWeight = 800,
  color,
  backgroundColor,
  wordStagger = 4,
  startFrame = 6,
  maxWidth = 1100,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const words = useMemo(() => text.split(" "), [text]);
  const textColor = color ?? theme.colors.text;

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
          gap: `0 ${fontSize * 0.28}px`,
          maxWidth,
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        {words.map((word, i) => {
          const wordStart = startFrame + i * wordStagger;
          const p = interpolate(frame - wordStart, [0, 16], [0, 1], {
            easing: Easing.bezier(...EASINGS.easeOutQuart),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const translateY = interpolate(p, [0, 1], [110, 0]);
          return (
            <span
              key={`w-${i}`}
              style={{
                display: "inline-block",
                overflow: "hidden",
                lineHeight: 1.05,
                paddingBottom: fontSize * 0.06,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: `translateY(${translateY}%)`,
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize,
                  fontWeight,
                  color: textColor,
                  willChange: "transform",
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
