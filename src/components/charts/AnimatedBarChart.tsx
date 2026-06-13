import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { useTheme } from "../../theme/ThemeProvider";
import { SPRING_PRESETS } from "../../animation/springs";
import { normalizeData, formatValue, getScaleTicks, type DataPoint } from "./chartUtils";

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
 * AnimatedBarChart — Vertical bar chart with bouncy spring reveals,
 * background gridlines, and Y-axis scale values.
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

  const padding = { top: 40, right: 30, bottom: 30, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const normalized = normalizeData(data);
  const chartColors = theme.colors.charts;

  // Grid / text entrance spring animation
  const gridSpring = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 30,
  });

  const gridOpacity = gridSpring * 0.15;
  const textOpacity = gridSpring;

  // Calculate ticks
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const yTicks = getScaleTicks(maxVal, 4);

  // Column width calculations
  const colStep = chartWidth / data.length;
  const barWidth = Math.min(64, colStep - 16);

  return (
    <div style={{ width, height, position: "relative" }}>
      {/* Background SVG Grid & Ticks */}
      <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {yTicks.map((tick, index) => {
          const tickRatio = index / (yTicks.length - 1);
          const y = padding.top + chartHeight - tickRatio * chartHeight;

          return (
            <g key={`grid-${index}`}>
              {/* Horizontal Gridline */}
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke={theme.colors.border}
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={gridOpacity}
              />

              {/* Y Tick Label */}
              <text
                x={padding.left - 12}
                y={y + 4}
                textAnchor="end"
                fill={theme.colors.mutedText}
                fontFamily={theme.resolvedFonts.mono}
                fontSize={11}
                opacity={textOpacity}
              >
                {formatValue(tick)}
              </text>
            </g>
          );
        })}

        {/* X Axis Labels */}
        {showLabels &&
          data.map((point, i) => {
            const x = padding.left + (i + 0.5) * colStep;
            const y = padding.top + chartHeight + 20;

            return (
              <text
                key={`x-label-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                fill={theme.colors.mutedText}
                fontFamily={theme.resolvedFonts.body}
                fontSize={11}
                opacity={textOpacity}
              >
                {point.label}
              </text>
            );
          })}
      </svg>

      {/* Floating Bars Area */}
      <div
        style={{
          position: "absolute",
          left: padding.left,
          top: padding.top,
          width: chartWidth,
          height: chartHeight,
          overflow: "visible",
        }}
      >
        {data.map((point, index) => {
          const delay = startFrame + index * staggerFrames;

          // Bouncy spring for playful layout growth
          const springVal = spring({
            frame: frame - delay,
            fps,
            config: SPRING_PRESETS.bouncy,
            durationInFrames: 45,
          });

          const barMaxHeight = chartHeight;
          const barHeight = interpolate(
            springVal,
            [0, 1],
            [0, normalized[index] * barMaxHeight]
          );

          const barColor = chartColors[index % chartColors.length];
          const colCenterX = (index + 0.5) * colStep;
          const barLeft = colCenterX - barWidth / 2;

          return (
            <div
              key={point.label}
              style={{
                position: "absolute",
                left: barLeft,
                bottom: 0,
                width: barWidth,
                height: barHeight,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {/* Value label popping in above */}
              {showValues && springVal > 0.1 && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    marginBottom: 6,
                    fontFamily: theme.resolvedFonts.mono,
                    fontSize: 12,
                    fontWeight: "bold",
                    color: theme.colors.text,
                    opacity: interpolate(springVal, [0.3, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    transform: `scale(${interpolate(springVal, [0.3, 1], [0.8, 1], { extrapolateLeft: "clamp" })})`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatValue(point.value)}
                </span>
              )}

              {/* Bar with gradient and smooth top-rounded corners */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(to top, ${barColor}22, ${barColor})`,
                  border: `1px solid ${barColor}44`,
                  borderRadius: `${Math.max(4, barWidth / 6)}px ${Math.max(4, barWidth / 6)}px 0 0`,
                  boxShadow: `0 4px 16px ${barColor}15`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
