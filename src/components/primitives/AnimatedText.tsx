import React, { useMemo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../../theme/ThemeProvider";
import { SPRING_PRESETS } from "../../animation/springs";

type SplitMode = "words" | "characters";

interface AnimatedTextProps {
  text: string;
  /** Split into "words" or individual "characters". Default: "words" */
  splitBy?: SplitMode;
  /** Delay in frames between each word/character reveal. Default: 3 */
  staggerFrames?: number;
  /** Starting frame offset for the animation. Default: 0 */
  startFrame?: number;
  /** Font size in px */
  fontSize?: number;
  /** Font weight */
  fontWeight?: number | string;
  /** Color override — falls back to theme text color */
  color?: string;
  /** Text alignment */
  textAlign?: React.CSSProperties["textAlign"];
  /** Line height multiplier. Default: 1.3 */
  lineHeight?: number;
  /** Max width of text container */
  maxWidth?: number;
  /** Whether to use heading font (true) or body font (false). Default: true */
  isHeading?: boolean;
  /** Custom animation style: "reveal" (default), "bounce" (spring rotation), "neon" (glowing neon) */
  animationType?: "reveal" | "bounce" | "neon";
}

/**
 * AnimatedText — Splits text into words or characters and reveals
 * each unit with a staggered spring-driven reveal, bounce, or neon animation.
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  splitBy = "words",
  staggerFrames = 3,
  startFrame = 0,
  fontSize = 64,
  fontWeight = 700,
  color,
  textAlign = "center",
  lineHeight = 1.3,
  maxWidth,
  isHeading = true,
  animationType = "reveal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const units = useMemo(() => {
    if (splitBy === "characters") {
      return text.split("");
    }
    return text.split(" ");
  }, [text, splitBy]);

  const fontFamily = isHeading
    ? theme.resolvedFonts.heading
    : theme.resolvedFonts.body;

  const resolvedColor = color ?? theme.colors.text;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent:
          textAlign === "center"
            ? "center"
            : textAlign === "right"
              ? "flex-end"
              : "flex-start",
        maxWidth: maxWidth ?? "100%",
        gap: splitBy === "words" ? `0 ${fontSize * 0.25}px` : "0",
      }}
    >
      {units.map((unit, index) => {
        const delay = startFrame + index * staggerFrames;

        const springVal = spring({
          frame: frame - delay,
          fps,
          config: SPRING_PRESETS.smooth,
          durationInFrames: 30,
        });

        const translateY = interpolate(springVal, [0, 1], [40, 0]);

        const opacity = interpolate(
          frame - delay,
          [0, 12],
          [0, 1],
          {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        let transformStr = `translateY(${translateY}px)`;
        if (animationType === "bounce") {
          const scale = interpolate(springVal, [0, 1], [0.4, 1]);
          const rotateZ = interpolate(springVal, [0, 1], [-20, 0]);
          transformStr = `translateY(${translateY}px) scale(${scale}) rotate(${rotateZ}deg)`;
        }

        const glowColor = resolvedColor === "#FFFFFF" || resolvedColor === "#FFF0F5" || resolvedColor === "#FFF"
          ? theme.colors.primary
          : resolvedColor;

        const textShadowStr = animationType === "neon" && opacity > 0
          ? `0 0 4px ${glowColor}, 0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 35px ${glowColor}`
          : "none";

        return (
          <span
            key={`${unit}-${index}`}
            style={{
              display: "inline-block",
              fontFamily,
              fontSize,
              fontWeight,
              color: resolvedColor,
              lineHeight,
              transform: transformStr,
              opacity,
              textShadow: textShadowStr,
              willChange: "transform, opacity",
            }}
          >
            {unit === " " ? "\u00A0" : unit}
          </span>
        );
      })}
    </div>
  );
};
