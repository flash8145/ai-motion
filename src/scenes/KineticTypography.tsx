import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";

interface KineticLine {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  /** Background highlight bar behind the line. */
  highlight?: string;
  align?: "left" | "center" | "right";
  /** Punch-in style. Default "scale" */
  motion?: "scale" | "slide" | "pop";
}

interface KineticTypographyProps {
  lines: KineticLine[];
  backgroundColor?: string;
  startFrame?: number;
  /** Frames between each line. Default 8 */
  lineStagger?: number;
}

/**
 * KineticTypography — punchy editorial stacked lines with mixed size/weight,
 * each snapping in with a spring. Lines can carry a highlight bar for emphasis.
 */
export const KineticTypography: React.FC<KineticTypographyProps> = ({
  lines,
  backgroundColor,
  startFrame = 6,
  lineStagger = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        gap: 6,
      }}
    >
      {lines.map((line, i) => {
        const lineStart = startFrame + i * lineStagger;
        const motion = line.motion ?? "scale";
        const s = spring({
          frame: frame - lineStart,
          fps,
          config: motion === "pop" ? SPRING_PRESETS.bouncy : SPRING_PRESETS.snappy,
          durationInFrames: 28,
        });
        const opacity = interpolate(s, [0, 0.5], [0, 1], {
          extrapolateRight: "clamp",
        });

        let transform = "none";
        if (motion === "slide") {
          transform = `translateX(${interpolate(s, [0, 1], [-80, 0])}px)`;
        } else {
          transform = `scale(${interpolate(s, [0, 1], [0.6, 1])})`;
        }

        const align = line.align ?? "center";
        const justify =
          align === "left"
            ? "flex-start"
            : align === "right"
              ? "flex-end"
              : "center";

        return (
          <div
            key={`kt-${i}`}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: justify,
              opacity,
              transform,
              transformOrigin: justify,
              willChange: "transform, opacity",
            }}
          >
            <span
              style={{
                fontFamily: theme.resolvedFonts.heading,
                fontSize: line.fontSize ?? 88,
                fontWeight: line.fontWeight ?? 800,
                color: line.color ?? theme.colors.text,
                lineHeight: 1.05,
                padding: line.highlight ? "0 18px" : 0,
                borderRadius: line.highlight ? 10 : 0,
                backgroundColor: line.highlight ?? "transparent",
              }}
            >
              {line.text}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
