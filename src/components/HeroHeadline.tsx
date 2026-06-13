import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";
import { useTheme } from "../theme/ThemeProvider";

export interface HeroHeadlineProps {
  text: string;
  fontSize?: number;
  fontWeight?: React.CSSProperties["fontWeight"];
  revealDuration?: number;
  scaleAmount?: number;
  fontFamily?: string;
  color?: string;
  startFrame?: number;
  wordStagger?: number;
  lineHeight?: number;
  maxWidth?: number;
}

export const HeroHeadline: React.FC<HeroHeadlineProps> = ({
  text,
  fontSize = 112,
  fontWeight = 800,
  revealDuration = 28,
  scaleAmount = 0.045,
  fontFamily,
  color = "#FFFFFF",
  startFrame = 0,
  wordStagger = 5,
  lineHeight = 0.96,
  maxWidth = 1480,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const words = useMemo(() => text.trim().split(/\s+/), [text]);

  const containerSpring = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.slow,
    durationInFrames: revealDuration + words.length * wordStagger,
  });

  const containerScale = interpolate(
    containerSpring,
    [0, 1],
    [1, 1 + scaleAmount],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: fontSize * 0.22,
          rowGap: fontSize * 0.08,
          maxWidth,
          transform: `scale(${containerScale})`,
          willChange: "transform",
        }}
      >
        {words.map((word, index) => {
          const delay = startFrame + index * wordStagger;
          const wordSpring = spring({
            frame: frame - delay,
            fps,
            config: SPRING_PRESETS.gentle,
            durationInFrames: revealDuration,
          });

          const opacity = interpolate(frame - delay, [0, revealDuration], [0, 1], {
            easing: Easing.bezier(...EASINGS.easeOutQuart),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const wordScale = interpolate(wordSpring, [0, 1], [0.96, 1]);
          const translateY = interpolate(wordSpring, [0, 1], [18, 0]);

          return (
            <span
              key={`${word}-${index}`}
              style={{
                display: "inline-block",
                fontFamily: fontFamily ?? theme.resolvedFonts.heading,
                fontSize,
                fontWeight,
                color,
                lineHeight,
                opacity,
                transform: `translateY(${translateY}px) scale(${wordScale})`,
                willChange: "opacity, transform",
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

export const HeroHeadlineExample: React.FC = () => (
  <HeroHeadline
    text="Your computer, now voice first"
    fontSize={104}
    revealDuration={30}
    scaleAmount={0.035}
  />
);
