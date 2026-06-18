/**
 * GridPulse — a tech grid overlaid on the scene with a glow that travels across
 * it, making the grid pulse with light as it passes. Sci-fi / dashboard energy.
 *
 * params:
 *   cell (60)          — grid cell size in px
 *   lineColor (#4FC3F7), glowColor (#7C5CFF)
 *   lineOpacity (0.18), period (200)
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type ModifierComponentProps, readNumber, readString } from "../types";

export const GridPulse: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const cell = readNumber(params, "cell", 60);
  const lineColor = readString(params, "lineColor", "#4FC3F7");
  const glowColor = readString(params, "glowColor", "#7C5CFF");
  const lineOpacity = readNumber(params, "lineOpacity", 0.18);
  const period = readNumber(params, "period", 200);

  const t = ((frame - start) % period) / period;
  // Travelling glow centre (Lissajous so it roams the grid).
  const cx = 50 + 40 * Math.sin(t * Math.PI * 2);
  const cy = 50 + 30 * Math.cos(t * Math.PI * 2 * 0.7);

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
        {/* Grid lines */}
        <AbsoluteFill
          style={{
            opacity: lineOpacity,
            backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`,
            backgroundSize: `${cell}px ${cell}px, ${cell}px ${cell}px`,
          }}
        />
        {/* Travelling pulse glow */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle 28% at ${cx}% ${cy}%, ${glowColor}, transparent 60%)`,
            opacity: 0.5,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
