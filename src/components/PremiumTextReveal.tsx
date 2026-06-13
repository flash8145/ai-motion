import React, { useMemo } from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EASINGS } from "../animation/easings";
import { SPRING_PRESETS } from "../animation/springs";
import { useTheme } from "../theme/ThemeProvider";

export interface PremiumTextRevealProps {
  text: string;
  stagger?: number;
  blur?: number;
  offsetY?: number;
  startFrame?: number;
  splitBy?: "words" | "characters";
  fontSize?: number;
  fontWeight?: React.CSSProperties["fontWeight"];
  fontFamily?: string;
  color?: string;
  lineHeight?: number;
  textAlign?: React.CSSProperties["textAlign"];
}

export const PremiumTextReveal: React.FC<PremiumTextRevealProps> = ({
  text,
  stagger = 3,
  blur = 16,
  offsetY = 28,
  startFrame = 0,
  splitBy = "words",
  fontSize = 72,
  fontWeight = 700,
  fontFamily,
  color,
  lineHeight = 1.08,
  textAlign = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const units = useMemo(
    () => (splitBy === "characters" ? Array.from(text) : text.trim().split(/\s+/)),
    [splitBy, text],
  );

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
        columnGap: splitBy === "words" ? fontSize * 0.22 : 0,
        textAlign,
      }}
    >
      {units.map((unit, index) => {
        const delay = startFrame + index * stagger;
        const entry = spring({
          frame: frame - delay,
          fps,
          config: SPRING_PRESETS.slow,
          durationInFrames: 34,
        });

        const opacity = interpolate(frame - delay, [0, 18], [0, 1], {
          easing: Easing.bezier(...EASINGS.appleDecelerate),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const translateY = interpolate(entry, [0, 1], [offsetY, 0]);
        const blurValue = interpolate(entry, [0, 1], [blur, 0]);

        return (
          <span
            key={`${unit}-${index}`}
            style={{
              display: "inline-block",
              whiteSpace: unit === " " ? "pre" : "normal",
              fontFamily: fontFamily ?? theme.resolvedFonts.heading,
              fontSize,
              fontWeight,
              color: color ?? theme.colors.text,
              lineHeight,
              opacity,
              filter: `blur(${blurValue}px)`,
              transform: `translateY(${translateY}px)`,
              willChange: "opacity, filter, transform",
            }}
          >
            {unit}
          </span>
        );
      })}
    </div>
  );
};

export const PremiumTextRevealExample: React.FC = () => (
  <PremiumTextReveal text="Control everything by voice" stagger={4} />
);
