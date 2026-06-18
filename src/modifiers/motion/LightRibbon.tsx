/**
 * LightRibbon — a soft flowing ribbon of light (aurora-like band) that drifts
 * and undulates across the frame. A filled SVG band with a gradient fill and
 * gaussian softness.
 *
 * params:
 *   colorA (#5B8CFF), colorB (#A66BFF)
 *   yPos (50)        — vertical centre in %
 *   amplitude (70), thickness (120), frequency (1.1)
 *   speed (0.05), softness (24), opacity (0.55)
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { type ModifierComponentProps, readNumber, readString } from "../types";

export const LightRibbon: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const colorA = readString(params, "colorA", "#5B8CFF");
  const colorB = readString(params, "colorB", "#A66BFF");
  const yPos = readNumber(params, "yPos", 50);
  const amplitude = readNumber(params, "amplitude", 70);
  const thickness = readNumber(params, "thickness", 120);
  const frequency = readNumber(params, "frequency", 1.1);
  const speed = readNumber(params, "speed", 0.05);
  const softness = readNumber(params, "softness", 24);
  const opacity = readNumber(params, "opacity", 0.55);

  const t = (frame - start) * speed;
  const cy = (yPos / 100) * height;
  const steps = 48;
  const id = `lr-${start}`;

  // Top edge L→R, then bottom edge R→L, closed band.
  let top = "";
  let bottom = "";
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const wave = Math.sin((i / steps) * Math.PI * 2 * frequency + t) * amplitude;
    const yTop = cy + wave - thickness / 2;
    top += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${yTop.toFixed(1)} `;
  }
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * width;
    const wave = Math.sin((i / steps) * Math.PI * 2 * frequency + t) * amplitude;
    const yBot = cy + wave + thickness / 2;
    bottom += `L ${x.toFixed(1)} ${yBot.toFixed(1)} `;
  }
  const d = `${top} ${bottom} Z`;

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorA} stopOpacity="0.2" />
              <stop offset="50%" stopColor={colorB} />
              <stop offset="100%" stopColor={colorA} stopOpacity="0.2" />
            </linearGradient>
            <filter id={`${id}-soft`}>
              <feGaussianBlur stdDeviation={softness} />
            </filter>
          </defs>
          <path d={d} fill={`url(#${id}-grad)`} filter={`url(#${id}-soft)`} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
