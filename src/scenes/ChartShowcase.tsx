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
import { AnimatedLineChart } from "../components/charts/AnimatedLineChart";
import { AnimatedBarChart } from "../components/charts/AnimatedBarChart";
import type { DataPoint } from "../components/charts/chartUtils";

interface ChartShowcaseProps {
  chartType: "line" | "bar";
  heading?: string;
  subtitle?: string;
  data: DataPoint[];
  chartWidth?: number;
  chartHeight?: number;
  headingStart?: number;
  chartStart?: number;
  showValues?: boolean;
  showLabels?: boolean;
}

/**
 * ChartShowcase — Draws a full-screen layout centered on an animated
 * data chart (line or bar) wrapped inside a premium glassmorphic card.
 */
export const ChartShowcase: React.FC<ChartShowcaseProps> = ({
  chartType,
  heading,
  subtitle,
  data,
  chartWidth = 800,
  chartHeight = 400,
  headingStart = 5,
  chartStart = 20,
  showValues = true,
  showLabels = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Panel entrance spring animation
  const panelSpring = spring({
    frame: frame - chartStart,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 35,
  });

  const panelY = interpolate(panelSpring, [0, 1], [50, 0]);
  const panelScale = interpolate(panelSpring, [0, 1], [0.95, 1]);
  const panelOpacity = interpolate(
    frame - chartStart,
    [0, 15],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
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
          padding: "0 60px",
          gap: 28,
        }}
      >
        {/* Title */}
        {heading && (
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
        )}

        {/* Subtitle */}
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
            isHeading={false}
          />
        )}

        {/* Chart Container Panel */}
        <div
          style={{
            transform: `translateY(${panelY}px) scale(${panelScale})`,
            opacity: panelOpacity,
            willChange: "transform, opacity",
          }}
        >
          <GlassPanel
            padding={32}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {chartType === "line" ? (
              <AnimatedLineChart
                data={data}
                width={chartWidth}
                height={chartHeight}
                startFrame={chartStart + 10}
                drawDuration={45}
                showDots={true}
                showFill={true}
              />
            ) : (
              <AnimatedBarChart
                data={data}
                width={chartWidth}
                height={chartHeight}
                startFrame={chartStart + 10}
                staggerFrames={4}
                showValues={showValues}
                showLabels={showLabels}
              />
            )}
          </GlassPanel>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
