import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { EASINGS } from "../animation/easings";

interface LetterMorphProps {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  /** Frames between each letter. Default 2.5 */
  letterStagger?: number;
  startFrame?: number;
}

/**
 * LetterMorph — each letter morphs into place from a blurred, scaled, rotated
 * state, settling sharp. Reads as type "materialising" out of focus.
 */
export const LetterMorph: React.FC<LetterMorphProps> = ({
  text,
  fontSize = 110,
  fontWeight = 700,
  color,
  backgroundColor,
  letterStagger = 2.5,
  startFrame = 6,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const chars = useMemo(() => text.split(""), [text]);
  const textColor = color ?? theme.colors.text;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {chars.map((char, i) => {
          const cStart = startFrame + i * letterStagger;
          const p = interpolate(frame - cStart, [0, 18], [0, 1], {
            easing: Easing.bezier(...EASINGS.easeOutQuart),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(p, [0, 1], [0.4, 1]);
          const rotate = interpolate(p, [0, 1], [-35, 0]);
          const blur = interpolate(p, [0, 1], [14, 0]);
          const opacity = interpolate(p, [0, 0.5], [0, 1], {
            extrapolateRight: "clamp",
          });
          return (
            <span
              key={`lm-${i}`}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                fontFamily: theme.resolvedFonts.heading,
                fontSize,
                fontWeight,
                color: textColor,
                opacity,
                filter: `blur(${blur}px)`,
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                willChange: "transform, filter, opacity",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
