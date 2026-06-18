/**
 * GlowFrame — a glowing neon border framing the scene, with a bright light arc
 * that travels around the rounded perimeter (conic-gradient + mask-composite
 * border trick) over a softly pulsing base glow.
 *
 * params:
 *   color (#5B8CFF), inset (40), thickness (3), radius (28)
 *   glow (24)        — base glow blur in px
 *   pulse (1|0)
 *   travelPeriod (90) — frames for the light arc to circle once
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  type ModifierComponentProps,
  getModifierProgress,
  readNumber,
  readString,
} from "../types";

export const GlowFrame: React.FC<ModifierComponentProps> = ({
  modifier,
  sceneDurationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const color = readString(params, "color", "#5B8CFF");
  const inset = readNumber(params, "inset", 40);
  const thickness = readNumber(params, "thickness", 3);
  const radius = readNumber(params, "radius", 28);
  const glow = readNumber(params, "glow", 24);
  const pulse = readNumber(params, "pulse", 1);
  const travelPeriod = readNumber(params, "travelPeriod", 90);

  // Border draws in over the first ~20 frames.
  const draw = getModifierProgress(
    frame,
    { ...modifier, durationFrames: 20 },
    sceneDurationFrames,
  );
  const pulseK = pulse >= 1 ? 0.7 + 0.3 * Math.sin((frame - start) * 0.12) : 1;
  const angle = ((frame - start) / travelPeriod) * 360;

  // Mask-composite ring (paints only the border band of the inset box).
  const arcStyle = {
    position: "absolute",
    inset,
    borderRadius: radius,
    padding: thickness,
    background: `conic-gradient(from ${angle}deg, transparent 0deg, ${color} 35deg, #ffffff 50deg, ${color} 65deg, transparent 110deg)`,
    WebkitMask:
      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    filter: `drop-shadow(0 0 8px ${color})`,
  } as React.CSSProperties;

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: draw }}>
        {/* Base glow border */}
        <div
          style={{
            position: "absolute",
            inset,
            borderRadius: radius,
            border: `${thickness}px solid ${color}`,
            opacity: 0.45,
            boxShadow: `0 0 ${glow * pulseK}px ${color}, inset 0 0 ${glow * pulseK}px ${color}`,
          }}
        />
        {/* Traveling light arc */}
        <div style={arcStyle} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
