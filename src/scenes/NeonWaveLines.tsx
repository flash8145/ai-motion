import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";
import { useTheme } from "../theme/ThemeProvider";

// Imported per codebase convention
void SPRING_PRESETS;

export interface NeonWaveLine {
  color: string;
  amplitude?: number;
  frequency?: number;
  phaseOffset?: number;
  yOffset?: number;
  strokeWidth?: number;
  startFrame?: number;
  drawDuration?: number;
}

interface NeonWaveLinesProps {
  waves?: NeonWaveLine[];
  canvasWidth?: number;
  canvasHeight?: number;
  glowBlur?: number;
  centerY?: number;
}

const DEFAULT_WAVES: NeonWaveLine[] = [
  { color: "#00FFFF",  amplitude: 80,  frequency: 1.5, phaseOffset: 0,    yOffset: 0,   strokeWidth: 2,   startFrame: 0,  drawDuration: 45 },
  { color: "#FFD700",  amplitude: 55,  frequency: 2,   phaseOffset: 0.8,  yOffset: 10,  strokeWidth: 1.5, startFrame: 3,  drawDuration: 45 },
  { color: "#00FF88",  amplitude: 70,  frequency: 1.8, phaseOffset: 1.6,  yOffset: -5,  strokeWidth: 1.5, startFrame: 6,  drawDuration: 45 },
  { color: "#CC66FF",  amplitude: 45,  frequency: 2.5, phaseOffset: 2.4,  yOffset: 15,  strokeWidth: 2,   startFrame: 9,  drawDuration: 45 },
  { color: "#FF66CC",  amplitude: 60,  frequency: 1.2, phaseOffset: 3.2,  yOffset: -10, strokeWidth: 1.5, startFrame: 12, drawDuration: 45 },
];

function buildWavePath(
  canvasWidth: number,
  centerY: number,
  amplitude: number,
  frequency: number,
  phaseOffset: number,
  yOffset: number
): string {
  const sampleCount = 200;
  const points: string[] = [];

  for (let i = 0; i <= sampleCount; i++) {
    const x = (i / sampleCount) * canvasWidth;
    const y =
      centerY +
      yOffset +
      amplitude * Math.sin((i / sampleCount) * frequency * 2 * Math.PI + phaseOffset);
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return points.join(" ");
}

export const NeonWaveLines: React.FC<NeonWaveLinesProps> = ({
  waves,
  canvasWidth = 1080,
  canvasHeight = 1920,
  glowBlur = 4,
  centerY,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  // theme imported per codebase convention — colors come from props for neon scenes
  void theme;

  const resolvedCenterY = centerY ?? canvasHeight / 2;
  const resolvedWaves = waves ?? DEFAULT_WAVES;

  const wavePaths = useMemo(() => {
    return resolvedWaves.map((wave) =>
      buildWavePath(
        canvasWidth,
        resolvedCenterY,
        wave.amplitude ?? 60,
        wave.frequency ?? 2,
        wave.phaseOffset ?? 0,
        wave.yOffset ?? 0
      )
    );
  }, [resolvedWaves, canvasWidth, resolvedCenterY]);

  // Approximate path length — slight overestimate
  const pathLength = canvasWidth * 1.05;

  return (
    <AbsoluteFill>
      <svg width={canvasWidth} height={canvasHeight} viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}>
        <rect width="100%" height="100%" fill="#000000" />

        <defs>
          <filter id="waveGlow" x="-10%" y="-80%" width="120%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={glowBlur} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {resolvedWaves.map((wave, i) => {
          const waveStartFrame = wave.startFrame ?? 0;
          const drawDuration = wave.drawDuration ?? 40;

          const dashOffset = interpolate(
            frame,
            [waveStartFrame, waveStartFrame + drawDuration],
            [pathLength, 0],
            {
              easing: Easing.bezier(...EASINGS.easeOutQuart),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <path
              key={`wave-${i}`}
              d={wavePaths[i]}
              fill="none"
              stroke={wave.color}
              strokeWidth={wave.strokeWidth ?? 2}
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={dashOffset}
              filter="url(#waveGlow)"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
