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
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { SPRING_PRESETS } from "../animation/springs";

interface StatItem {
  value: string;
  label: string;
  /** Optional prefix (e.g. "$", "+") */
  prefix?: string;
  /** Optional suffix (e.g. "%", "K", "M") */
  suffix?: string;
}

interface StatsCounterProps {
  heading?: string;
  stats: StatItem[];
  headingStart?: number;
  statsStart?: number;
  statStagger?: number;
}

/**
 * StatsCounter — Animated key metric counters with large values
 * that spring into view with staggered timing.
 */
export const StatsCounter: React.FC<StatsCounterProps> = ({
  heading,
  stats,
  headingStart = 5,
  statsStart = 18,
  statStagger = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  return (
    <AbsoluteFill>
      <GradientBackground opacity={0.5} />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: 48,
        }}
      >
        {heading && (
          <AnimatedText
            text={heading}
            splitBy="words"
            staggerFrames={3}
            startFrame={headingStart}
            fontSize={40}
            fontWeight={700}
            lineHeight={1.2}
            isHeading
          />
        )}

        <div
          style={{
            display: "flex",
            gap: 60,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat, index) => {
            const delay = statsStart + index * statStagger;

            const statSpring = spring({
              frame: frame - delay,
              fps,
              config: SPRING_PRESETS.smooth,
              durationInFrames: 35,
            });

            const valueY = interpolate(statSpring, [0, 1], [30, 0]);
            const valueScale = interpolate(statSpring, [0, 1], [0.8, 1]);
            const valueOpacity = interpolate(
              frame - delay,
              [0, 12],
              [0, 1],
              {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            // Label appears slightly after the value
            const labelOpacity = interpolate(
              frame - delay - 6,
              [0, 10],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            return (
              <div
                key={`stat-${index}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 140,
                }}
              >
                {/* Value */}
                <div
                  style={{
                    transform: `translateY(${valueY}px) scale(${valueScale})`,
                    opacity: valueOpacity,
                    willChange: "transform, opacity",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  {stat.prefix && (
                    <span
                      style={{
                        fontFamily: theme.resolvedFonts.heading,
                        fontSize: 36,
                        fontWeight: 600,
                        color: theme.colors.primary,
                      }}
                    >
                      {stat.prefix}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: theme.resolvedFonts.heading,
                      fontSize: 64,
                      fontWeight: 800,
                      color: theme.colors.text,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span
                      style={{
                        fontFamily: theme.resolvedFonts.heading,
                        fontSize: 36,
                        fontWeight: 600,
                        color: theme.colors.primary,
                      }}
                    >
                      {stat.suffix}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  style={{
                    fontFamily: theme.resolvedFonts.body,
                    fontSize: 16,
                    fontWeight: 500,
                    color: theme.colors.mutedText,
                    opacity: labelOpacity,
                    textAlign: "center",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
