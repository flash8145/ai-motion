/**
 * PulseRing — concentric rings that expand and fade outward from a point on a
 * loop, like a beacon / sonar ping. Several rings are staggered for a steady
 * rhythm.
 *
 * params:
 *   originX (50), originY (50), color (#4FC3F7)
 *   ringCount (3), period (60)  — frames per ring emission
 *   maxRadius (420)             — px the ring grows to
 *   thickness (3)
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type ModifierComponentProps, readNumber, readString } from "../types";

export const PulseRing: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const ox = readNumber(params, "originX", 50);
  const oy = readNumber(params, "originY", 50);
  const color = readString(params, "color", "#4FC3F7");
  const ringCount = Math.max(1, Math.round(readNumber(params, "ringCount", 3)));
  const period = readNumber(params, "period", 60);
  const maxRadius = readNumber(params, "maxRadius", 420);
  const thickness = readNumber(params, "thickness", 3);

  const local = frame - start;

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
        {Array.from({ length: ringCount }).map((_, i) => {
          // Each ring is phase-shifted by a fraction of the period.
          const phase = ((local + (i * period) / ringCount) % period) / period;
          const size = phase * maxRadius * 2;
          const opacity = (1 - phase) * 0.85;
          return (
            <div
              key={`pr-${i}`}
              style={{
                position: "absolute",
                left: `${ox}%`,
                top: `${oy}%`,
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                borderRadius: "50%",
                border: `${thickness}px solid ${color}`,
                boxShadow: `0 0 18px ${color}`,
                opacity,
                willChange: "width, height, opacity",
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
