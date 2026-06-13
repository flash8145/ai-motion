import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../../theme/ThemeProvider";
import { SPRING_PRESETS } from "../../animation/springs";
import { EASINGS } from "../../animation/easings";
import {
  normalizeData,
  distributeX,
  generateSmoothPath,
  getScaleTicks,
  getLinePositionAtProgress,
  formatValue,
  type DataPoint,
} from "./chartUtils";

interface AnimatedLineChartProps {
  data: DataPoint[];
  /** Width of the SVG chart. Default: 600 */
  width?: number;
  /** Height of the SVG chart. Default: 300 */
  height?: number;
  /** Frame at which draw animation starts. Default: 0 */
  startFrame?: number;
  /** Duration of the line-draw animation in frames. Default: 45 */
  drawDuration?: number;
  /** Line color override. Falls back to theme primary. */
  lineColor?: string;
  /** Stroke width. Default: 3 */
  strokeWidth?: number;
  /** Whether to show dots at data points. Default: true */
  showDots?: boolean;
  /** Whether to show gradient fill under the line. Default: true */
  showFill?: boolean;
}

/**
 * AnimatedLineChart — Draws a smooth SVG line with dynamic tracking cursor,
 * animated gridlines, and Y-axis tick values.
 */
export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  width = 600,
  height = 300,
  startFrame = 0,
  drawDuration = 45,
  lineColor,
  strokeWidth = 3,
  showDots = true,
  showFill = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const color = lineColor ?? theme.colors.primary;
  const padding = { top: 40, right: 30, bottom: 30, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const normalized = normalizeData(data);
  const xPositions = distributeX(data.length, chartWidth, 0);

  const points = normalized.map((val, i) => ({
    x: padding.left + xPositions[i],
    y: padding.top + chartHeight - val * chartHeight,
  }));

  const pathD = generateSmoothPath(points);

  // Fill path (closed area under the line)
  const fillPathD = pathD
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : "";

  // Approximate total path length for dash animation
  const totalLength = chartWidth * 1.5;

  const drawProgress = interpolate(
    frame - startFrame,
    [0, drawDuration],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const dashOffset = totalLength * (1 - drawProgress);

  // Entrance spring for gridlines and text
  const gridSpring = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 30,
  });

  const gridOpacity = gridSpring * 0.15; // subtle gridlines
  const textOpacity = gridSpring;

  // Calculate ticks
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const yTicks = getScaleTicks(maxVal, 4);

  // Current tracking cursor position and interpolated value
  const cursorPosition = getLinePositionAtProgress(points, drawProgress);

  const interpolatedValue = (() => {
    if (data.length === 0) return 0;
    if (drawProgress <= 0) return data[0].value;
    if (drawProgress >= 1) return data[data.length - 1].value;

    const segmentsCount = data.length - 1;
    const rawIndex = drawProgress * segmentsCount;
    const segmentIndex = Math.min(segmentsCount - 1, Math.floor(rawIndex));
    const t = rawIndex - segmentIndex;
    const val0 = data[segmentIndex].value;
    const val1 = data[segmentIndex + 1].value;
    return val0 + (val1 - val0) * t;
  })();

  const dotOpacity = interpolate(
    frame - startFrame,
    [drawDuration * 0.6, drawDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const gradientId = `line-fill-${color.replace("#", "")}`;
  const glowFilterId = `glow-${color.replace("#", "")}`;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <filter id={glowFilterId} x="-20%" y="-20%" width={width + 40} height={height + 40}>
          <feGaussianBlur stdDeviation={3} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Gridlines and Y ticks */}
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
      {data.map((point, i) => {
        const x = padding.left + xPositions[i];
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

      {/* Fill area */}
      {showFill && fillPathD && (
        <path
          d={fillPathD}
          fill={`url(#${gradientId})`}
          opacity={drawProgress * 0.75}
        />
      )}

      {/* Line */}
      {pathD && (
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={dashOffset}
          filter={`url(#${glowFilterId})`}
        />
      )}

      {/* Tracking vertical cursor line */}
      {drawProgress > 0 && drawProgress < 1 && (
        <line
          x1={cursorPosition.x}
          y1={padding.top}
          x2={cursorPosition.x}
          y2={padding.top + chartHeight}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="3 3"
          opacity={0.3}
        />
      )}

      {/* Tracking highlight cursor dot */}
      {drawProgress > 0 && (
        <g opacity={drawProgress}>
          <circle
            cx={cursorPosition.x}
            cy={cursorPosition.y}
            r={8}
            fill={color}
            opacity={0.2}
          />
          <circle
            cx={cursorPosition.x}
            cy={cursorPosition.y}
            r={4}
            fill={color}
            stroke={theme.colors.background}
            strokeWidth={1.5}
          />
        </g>
      )}

      {/* Floating active value tooltip */}
      {drawProgress > 0 && drawProgress <= 1 && (
        <g
          transform={`translate(${cursorPosition.x}, ${cursorPosition.y - 20})`}
          opacity={drawProgress}
        >
          {/* Tooltip Background */}
          <rect
            x={-35}
            y={-22}
            width={70}
            height={22}
            rx={4}
            fill={theme.colors.surface}
            stroke={theme.colors.border}
            strokeWidth={1}
            style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))" }}
          />
          {/* Tooltip Text */}
          <text
            x={0}
            y={-7}
            textAnchor="middle"
            fill={theme.colors.text}
            fontFamily={theme.resolvedFonts.mono}
            fontSize={10}
            fontWeight="bold"
          >
            {formatValue(interpolatedValue)}
          </text>
        </g>
      )}

      {/* Fixed static dot highlights (pop in after line finishes drawing) */}
      {showDots &&
        points.map((pt, i) => (
          <circle
            key={`dot-${i}`}
            cx={pt.x}
            cy={pt.y}
            r={5}
            fill={color}
            stroke={theme.colors.background}
            strokeWidth={2}
            opacity={dotOpacity}
          />
        ))}
    </svg>
  );
};
