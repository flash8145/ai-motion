import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { GlassPanel } from "../components/primitives/GlassPanel";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { SPRING_PRESETS } from "../animation/springs";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  heading?: string;
  subtitle?: string;
  features: Feature[];
  /** Columns in the grid. Default: 3 */
  columns?: number;
  headingStart?: number;
  gridStart?: number;
  itemStagger?: number;
}

/**
 * FeatureGrid — Displays a heading and a responsive grid of feature cards,
 * each with an emoji icon, title, and description.
 */
export const FeatureGrid: React.FC<FeatureGridProps> = ({
  heading = "Everything You Need",
  subtitle,
  features,
  columns = 3,
  headingStart = 5,
  gridStart = 20,
  itemStagger = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const itemWidth = Math.min(
    320,
    (1100 - (columns - 1) * 20) / columns
  );

  return (
    <AbsoluteFill>
      <GradientBackground opacity={0.4} />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: 36,
        }}
      >
        {/* Heading */}
        <AnimatedText
          text={heading}
          splitBy="words"
          staggerFrames={3}
          startFrame={headingStart}
          fontSize={44}
          fontWeight={700}
          lineHeight={1.2}
          isHeading
        />

        {subtitle && (
          <AnimatedText
            text={subtitle}
            splitBy="words"
            staggerFrames={2}
            startFrame={headingStart + 8}
            fontSize={18}
            fontWeight={400}
            color={theme.colors.mutedText}
            lineHeight={1.5}
            maxWidth={600}
            isHeading={false}
          />
        )}

        {/* Grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            justifyContent: "center",
            maxWidth: columns * itemWidth + (columns - 1) * 20,
          }}
        >
          {features.map((feat, index) => {
            const delay = gridStart + index * itemStagger;

            const itemSpring = spring({
              frame: frame - delay,
              fps,
              config: SPRING_PRESETS.smooth,
              durationInFrames: 30,
            });

            const itemY = interpolate(itemSpring, [0, 1], [40, 0]);
            const itemScale = interpolate(itemSpring, [0, 1], [0.92, 1]);
            const itemOpacity = interpolate(
              frame - delay,
              [0, 12],
              [0, 1],
              {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            return (
              <div
                key={`feature-${index}`}
                style={{
                  width: itemWidth,
                  transform: `translateY(${itemY}px) scale(${itemScale})`,
                  opacity: itemOpacity,
                  willChange: "transform, opacity",
                }}
              >
                <GlassPanel padding={24} style={{ height: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: `${theme.colors.primary}22`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                      }}
                    >
                      {feat.icon}
                    </div>

                    {/* Title */}
                    <div
                      style={{
                        fontFamily: theme.resolvedFonts.heading,
                        fontSize: 17,
                        fontWeight: 600,
                        color: theme.colors.text,
                      }}
                    >
                      {feat.title}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontFamily: theme.resolvedFonts.body,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: theme.colors.mutedText,
                        margin: 0,
                      }}
                    >
                      {feat.description}
                    </p>
                  </div>
                </GlassPanel>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
