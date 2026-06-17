import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";

interface OrbitalCirclesProps {
  circleCount?: number;
  ringRadius?: number;
  circleSize?: number;
  strokeColor?: string;
  strokeWidth?: number;
  activeIndex?: number;
  eclipseColorA?: string;
  eclipseColorB?: string;
  centerText?: string;
  centerTextColor?: string;
  centerTextSize?: number;
  staggerFrames?: number;
  startFrame?: number;
}

export const OrbitalCircles: React.FC<OrbitalCirclesProps> = ({
  circleCount = 8,
  ringRadius = 280,
  circleSize = 90,
  strokeColor = "#6B5CE7",
  strokeWidth = 1.5,
  activeIndex = 7,
  eclipseColorA = "#0066FF",
  eclipseColorB = "#FF4500",
  centerText = "",
  centerTextColor = "#FFFFFF",
  centerTextSize = 36,
  staggerFrames = 8,
  startFrame = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const cx = 540;
  const cy = 960;

  const circlePositions = useMemo(() => {
    return Array.from({ length: circleCount }, (_, i) => {
      const angle = (i / circleCount) * 2 * Math.PI;
      return {
        x: cx + ringRadius * Math.cos(angle - Math.PI / 2),
        y: cy + ringRadius * Math.sin(angle - Math.PI / 2),
      };
    });
  }, [circleCount, ringRadius]);

  const allRevealedFrame = startFrame + circleCount * staggerFrames;

  const centerTextOpacity = interpolate(
    frame,
    [allRevealedFrame + 5, allRevealedFrame + 20],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        <defs>
          <radialGradient
            id="eclipseGlow"
            cx="70%"
            cy="50%"
            r="50%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor={eclipseColorB} stopOpacity="0.85" />
            <stop offset="50%" stopColor={eclipseColorA} stopOpacity="0.45" />
            <stop offset="100%" stopColor={eclipseColorA} stopOpacity="0" />
          </radialGradient>
        </defs>

        {circlePositions.map((pos, i) => {
          const delay = startFrame + i * staggerFrames;

          const springVal = spring({
            frame: frame - delay,
            fps,
            config: SPRING_PRESETS.snappy,
            durationInFrames: 25,
          });

          const radius = interpolate(springVal, [0, 1], [0, circleSize / 2]);

          const opacity = interpolate(
            frame - delay,
            [0, 12],
            [0, 1],
            {
              easing: Easing.bezier(...EASINGS.easeOutQuart),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const isActive = i === activeIndex;

          return (
            <g key={`circle-${i}`} opacity={opacity}>
              {/* Eclipse glow layer (active circle only) */}
              {isActive && (
                <>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius * 1.6}
                    fill="url(#eclipseGlow)"
                  />
                  {/* Dark eclipse core */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius * 0.82}
                    fill="#000000"
                  />
                </>
              )}

              {/* Main circle stroke */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
            </g>
          );
        })}

        {/* Center text */}
        {centerText && (
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fill={centerTextColor}
            fontSize={centerTextSize}
            fontFamily={theme.resolvedFonts.heading}
            fontWeight={300}
            opacity={centerTextOpacity}
          >
            {centerText}
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
