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

export type SerifRevealType = "characters" | "words";

export interface SerifFeatureTitleProps {
  text: string;
  fontFamily?: string;
  revealType?: SerifRevealType;
  blurAmount?: number;
  fontSize?: number;
  fontWeight?: React.CSSProperties["fontWeight"];
  color?: string;
  startFrame?: number;
  stagger?: number;
  lineHeight?: number;
  textAlign?: React.CSSProperties["textAlign"];
}

export const SerifFeatureTitle: React.FC<SerifFeatureTitleProps> = ({
  text,
  fontFamily = "Georgia, 'Times New Roman', serif",
  revealType = "characters",
  blurAmount = 10,
  fontSize = 96,
  fontWeight = 500,
  color = "#0B0B0B",
  startFrame = 0,
  stagger,
  lineHeight = 1.02,
  textAlign = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const units = useMemo(() => {
    if (revealType === "words") {
      return text.trim().split(/\s+/);
    }

    return Array.from(text);
  }, [revealType, text]);

  const resolvedStagger = stagger ?? (revealType === "words" ? 5 : 1.5);

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
        columnGap: revealType === "words" ? fontSize * 0.18 : 0,
        textAlign,
      }}
    >
      {units.map((unit, index) => {
        const delay = startFrame + index * resolvedStagger;
        const entry = spring({
          frame: frame - delay,
          fps,
          config: SPRING_PRESETS.gentle,
          durationInFrames: 28,
        });

        const opacity = interpolate(frame - delay, [0, 18], [0, 1], {
          easing: Easing.bezier(...EASINGS.easeOutQuart),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const translateY = interpolate(entry, [0, 1], [14, 0]);
        const blur = interpolate(entry, [0, 1], [blurAmount, 0]);

        return (
          <span
            key={`${unit}-${index}`}
            style={{
              display: "inline-block",
              whiteSpace: unit === " " ? "pre" : "normal",
              fontFamily,
              fontSize,
              fontWeight,
              color,
              lineHeight,
              opacity,
              filter: `blur(${blur}px)`,
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

export const SerifFeatureTitleExample: React.FC = () => (
  <SerifFeatureTitle text="Meet Lemon" blurAmount={8} fontSize={110} />
);
