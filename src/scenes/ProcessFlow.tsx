import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { SPRING_PRESETS } from "../animation/springs";
import { dashOffsetForProgress, computeDrawProgress, lineLength } from "../utils/pathDraw";

export interface ProcessFlowStep {
  icon?: string;
  emoji?: string;
  title: string;
  description?: string;
}

interface ProcessFlowProps {
  /** Ordered steps rendered as connected nodes — the classic explainer-video "process flow". */
  steps: ProcessFlowStep[];
  direction?: "horizontal" | "vertical";
  heading?: string;
  headingStart?: number;
  stepsStart?: number;
  stepStagger?: number;
  accentColor?: string;
  canvasWidth?: number;
  canvasHeight?: number;
}

function getNodePositions(
  count: number,
  direction: "horizontal" | "vertical",
  width: number,
  height: number,
  topOffset: number
): Array<{ x: number; y: number }> {
  const margin = 160;
  const usableHeight = height - topOffset;

  if (direction === "vertical") {
    const step = count > 1 ? (usableHeight - margin) / (count - 1) : 0;
    return Array.from({ length: count }, (_, i) => ({
      x: width / 2,
      y: topOffset + margin / 2 + step * i,
    }));
  }

  const step = count > 1 ? (width - margin * 2) / (count - 1) : 0;
  return Array.from({ length: count }, (_, i) => ({
    x: margin + step * i,
    y: topOffset + usableHeight / 2,
  }));
}

const ConnectingLine: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  startFrame: number;
  durationFrames: number;
  color: string;
}> = ({ from, to, startFrame, durationFrames, color }) => {
  const frame = useCurrentFrame();
  const length = lineLength(from, to);
  const drawProgress = computeDrawProgress(frame, startFrame, durationFrames);

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth={3}
      strokeDasharray={length}
      strokeDashoffset={dashOffsetForProgress(length, drawProgress)}
      strokeLinecap="round"
    />
  );
};

/**
 * ProcessFlow — sequentially reveals connected step nodes with
 * draw-on connecting lines, for "step 1 -> step 2 -> step 3"
 * explainer-video diagrams.
 */
export const ProcessFlow: React.FC<ProcessFlowProps> = ({
  steps,
  direction = "horizontal",
  heading,
  headingStart = 0,
  stepsStart = 20,
  stepStagger = 35,
  accentColor,
  canvasWidth = 1920,
  canvasHeight = 1080,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const color = accentColor ?? theme.colors.primary;
  const topOffset = heading ? 220 : 100;

  const positions = useMemo(
    () => getNodePositions(steps.length, direction, canvasWidth, canvasHeight, topOffset),
    [steps.length, direction, canvasWidth, canvasHeight, topOffset]
  );

  return (
    <AbsoluteFill>
      {heading && (
        <div style={{ position: "absolute", top: 80, width: "100%", textAlign: "center" }}>
          <AnimatedText text={heading} startFrame={headingStart} fontSize={56} fontWeight={700} />
        </div>
      )}

      <svg
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {positions.slice(0, -1).map((pos, i) => (
          <ConnectingLine
            key={i}
            from={pos}
            to={positions[i + 1]}
            startFrame={stepsStart + i * stepStagger + 12}
            durationFrames={Math.max(10, stepStagger - 12)}
            color={theme.colors.border}
          />
        ))}
      </svg>

      {steps.map((step, i) => {
        const nodeStart = stepsStart + i * stepStagger;
        const localFrame = frame - nodeStart;

        const pop = spring({
          frame: localFrame,
          fps,
          config: SPRING_PRESETS.bouncy,
          durationInFrames: 25,
        });

        const scale = interpolate(pop, [0, 1], [0.3, 1]);
        const opacity = interpolate(localFrame, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const textOpacity = interpolate(localFrame, [10, 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const pos = positions[i];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (pos.x / canvasWidth) * 100 + "%",
              top: (pos.y / canvasHeight) * 100 + "%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              width: 260,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundColor: theme.colors.surface,
                border: `2px solid ${color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity,
                transform: `scale(${scale})`,
                willChange: "transform, opacity",
                fontSize: 40,
              }}
            >
              {step.emoji ? (
                step.emoji
              ) : step.icon ? (
                <svg width={36} height={36} viewBox="0 0 24 24">
                  <path d={step.icon} fill={color} />
                </svg>
              ) : (
                <span style={{ color, fontWeight: 800, fontSize: 32 }}>{i + 1}</span>
              )}
            </div>

            <div
              style={{
                textAlign: "center",
                opacity: textOpacity,
                transform: `translateY(${interpolate(textOpacity, [0, 1], [10, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize: 24,
                  fontWeight: 700,
                  color: theme.colors.text,
                }}
              >
                {step.title}
              </div>
              {step.description && (
                <div
                  style={{
                    fontFamily: theme.resolvedFonts.body,
                    fontSize: 16,
                    color: theme.colors.mutedText,
                    marginTop: 4,
                  }}
                >
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
