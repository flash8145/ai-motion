import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { usePathLength, dashOffsetForProgress, computeDrawProgress } from "../utils/pathDraw";

export interface DrawnPathConfig {
  d: string;
  color?: string;
  strokeWidth?: number;
  startFrame?: number;
  drawDurationFrames?: number;
  fill?: string;
}

export interface PathLabel {
  text: string;
  x: number;
  y: number;
  showAtFrame: number;
}

interface PathDrawSceneProps {
  /** SVG paths drawn progressively (timelines, routes, signatures, diagrams). */
  paths: DrawnPathConfig[];
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  heading?: string;
  headingStart?: number;
  labels?: PathLabel[];
  background?: "theme" | "transparent";
}

const DrawnPath: React.FC<{ config: DrawnPathConfig; defaultColor: string }> = ({
  config,
  defaultColor,
}) => {
  const frame = useCurrentFrame();
  const { ref, length } = usePathLength<SVGPathElement>([config.d]);

  const startFrame = config.startFrame ?? 0;
  const duration = config.drawDurationFrames ?? 45;
  const drawProgress = computeDrawProgress(frame, startFrame, duration);
  const measured = length > 0;

  return (
    <path
      ref={ref}
      d={config.d}
      stroke={config.color ?? defaultColor}
      strokeWidth={config.strokeWidth ?? 3}
      fill={config.fill ?? "none"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={measured ? length : undefined}
      strokeDashoffset={measured ? dashOffsetForProgress(length, drawProgress) : undefined}
      opacity={measured ? 1 : 0}
    />
  );
};

/**
 * PathDrawScene — progressively draws one or more SVG paths
 * (timelines, map routes, signatures, connecting diagram lines)
 * using the stroke-dashoffset technique, with optional point labels.
 */
export const PathDrawScene: React.FC<PathDrawSceneProps> = ({
  paths,
  viewBoxWidth = 1920,
  viewBoxHeight = 1080,
  heading,
  headingStart = 0,
  labels = [],
  background = "transparent",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const backgroundColor =
    background === "theme" ? theme.colors.background : "transparent";

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {heading && (
        <div style={{ position: "absolute", top: 80, width: "100%", textAlign: "center" }}>
          <AnimatedText
            text={heading}
            startFrame={headingStart}
            fontSize={56}
            fontWeight={700}
          />
        </div>
      )}

      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {paths.map((pathConfig, index) => (
          <DrawnPath key={index} config={pathConfig} defaultColor={theme.colors.primary} />
        ))}
      </svg>

      {labels.map((label, index) => {
        const opacity = interpolate(
          frame - label.showAtFrame,
          [0, 12],
          [0, 1],
          {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );
        const translateY = interpolate(frame - label.showAtFrame, [0, 12], [10, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: label.x,
              top: label.y,
              opacity,
              transform: `translate(-50%, -50%) translateY(${translateY}px)`,
              color: theme.colors.text,
              fontFamily: theme.resolvedFonts.body,
              fontSize: 22,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {label.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
