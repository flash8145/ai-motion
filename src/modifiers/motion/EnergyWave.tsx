/**
 * EnergyWave — glowing sine wavefronts that ripple and sweep across the frame,
 * like an energy/audio pulse. Built as a crisp SVG stroke with neon glow.
 *
 * params:
 *   color (#7C5CFF), waveCount (2), amplitude (60), frequency (1.4)
 *   thickness (3), speed (0.06), sweep (1|0)  — sweep travels the wave vertically
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { type ModifierComponentProps, readNumber, readString } from "../types";

export const EnergyWave: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const color = readString(params, "color", "#7C5CFF");
  const waveCount = Math.max(1, Math.round(readNumber(params, "waveCount", 2)));
  const amplitude = readNumber(params, "amplitude", 60);
  const frequency = readNumber(params, "frequency", 1.4);
  const thickness = readNumber(params, "thickness", 3);
  const speed = readNumber(params, "speed", 0.06);
  const sweep = readNumber(params, "sweep", 1);

  const t = (frame - start) * speed;
  const steps = 60;

  const buildPath = (phase: number, yBase: number): string => {
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const y =
        yBase +
        Math.sin((i / steps) * Math.PI * 2 * frequency + phase) * amplitude;
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d;
  };

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <filter id={`ew-glow-${modifier.startFrame ?? 0}`}>
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {Array.from({ length: waveCount }).map((_, i) => {
            const phase = t + (i * Math.PI) / waveCount;
            const yBase =
              sweep >= 1
                ? height * (0.5 + 0.32 * Math.sin(t * 0.5 + i))
                : height * (0.35 + (0.3 * i) / Math.max(1, waveCount - 1));
            const opacity = 0.5 + 0.5 * (1 - i / waveCount);
            return (
              <path
                key={`ew-${i}`}
                d={buildPath(phase, yBase)}
                stroke={color}
                strokeWidth={thickness}
                fill="none"
                strokeLinecap="round"
                opacity={opacity}
                filter={`url(#ew-glow-${modifier.startFrame ?? 0})`}
              />
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
