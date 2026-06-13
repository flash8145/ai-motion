import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../../theme/ThemeProvider";
import { EASINGS } from "../../animation/easings";
import {
  normalizeData,
  distributeX,
  generateSmoothPath,
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
 * AnimatedLineChart — Draws a smooth SVG line via strokeDashoffset animation.
 * Uses Remotion's interpolate() for the draw reveal.
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
  const theme = useTheme();

  const color = lineColor ?? theme.colors.primary;
  const padding = { top: 20, right: 20, bottom: 20, left: 20 };
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

  // Dot appearance
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

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Fill area */}
      {showFill && fillPathD && (
        <path
          d={fillPathD}
          fill={`url(#${gradientId})`}
          opacity={drawProgress * 0.6}
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
        />
      )}

      {/* Data point dots */}
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
