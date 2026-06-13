import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { useTheme } from "../../theme/ThemeProvider";
import { SPRING_PRESETS } from "../../animation/springs";
import { normalizeData, formatValue, type DataPoint } from "./chartUtils";

interface AnimatedBarChartProps {
  data: DataPoint[];
  /** Width of the chart area. Default: 600 */
  width?: number;
  /** Height of the chart area. Default: 300 */
  height?: number;
  /** Delay in frames before animation starts. Default: 0 */
  startFrame?: number;
  /** Stagger delay between bars. Default: 4 */
  staggerFrames?: number;
  /** Whether to show value labels above bars. Default: true */
  showValues?: boolean;
  /** Whether to show labels below bars. Default: true */
  showLabels?: boolean;
}

/**
 * AnimatedBarChart — Spring-animated vertical bar chart.
 * Bars grow from bottom to top with staggered spring motion.
 */
export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  width = 600,
  height = 300,
  startFrame = 0,
  staggerFrames = 4,
  showValues = true,
  showLabels = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const normalized = normalizeData(data);
  const barWidth = Math.min(60, (width - 40) / data.length - 12);
  const chartColors = theme.colors.charts;
  const labelPadding = showLabels ? 30 : 0;
  const valuePadding = showValues ? 24 : 0;
  const barAreaHeight = height - labelPadding - valuePadding;

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 12,
        position: "relative",
      }}
    >
      {data.map((point, index) => {
        const delay = startFrame + index * staggerFrames;

        const springVal = spring({
          frame: frame - delay,
          fps,
          config: SPRING_PRESETS.smooth,
          durationInFrames: 40,
        });

        const barHeight = interpolate(
          springVal,
          [0, 1],
          [0, normalized[index] * barAreaHeight]
        );

        const barColor = chartColors[index % chartColors.length];

        return (
          <div
            key={point.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              height: "100%",
            }}
          >
            {/* Value label */}
            {showValues && (
              <span
                style={{
                  fontFamily: theme.resolvedFonts.mono,
                  fontSize: 12,
                  color: theme.colors.mutedText,
                  marginBottom: 6,
                  opacity: springVal,
                }}
              >
                {formatValue(point.value)}
              </span>
            )}

            {/* Bar */}
            <div
              style={{
                width: barWidth,
                height: barHeight,
                backgroundColor: barColor,
                borderRadius: `${barWidth / 4}px ${barWidth / 4}px 0 0`,
                minHeight: 2,
              }}
            />

            {/* Label */}
            {showLabels && (
              <span
                style={{
                  fontFamily: theme.resolvedFonts.body,
                  fontSize: 11,
                  color: theme.colors.mutedText,
                  marginTop: 8,
                  textAlign: "center",
                  maxWidth: barWidth + 16,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {point.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
