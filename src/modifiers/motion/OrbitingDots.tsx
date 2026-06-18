/**
 * OrbitingDots — glowing dots orbiting a centre on a tilted ellipse, with
 * front/back depth (dots scale and dim as they pass "behind"). A clean tech /
 * loader motif.
 *
 * params:
 *   originX (50), originY (50), count (6)
 *   radiusX (260), radiusY (90)   — ellipse radii in px (tilt via the ratio)
 *   speed (0.03), color (#4FC3F7), dotSize (16)
 *   showOrbit (1|0)               — faint orbit path
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type ModifierComponentProps, readNumber, readString } from "../types";

export const OrbitingDots: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const ox = readNumber(params, "originX", 50);
  const oy = readNumber(params, "originY", 50);
  const count = Math.max(1, Math.round(readNumber(params, "count", 6)));
  const radiusX = readNumber(params, "radiusX", 260);
  const radiusY = readNumber(params, "radiusY", 90);
  const speed = readNumber(params, "speed", 0.03);
  const color = readString(params, "color", "#4FC3F7");
  const dotSize = readNumber(params, "dotSize", 16);
  const showOrbit = readNumber(params, "showOrbit", 1);

  const t = (frame - start) * speed;

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
        <div style={{ position: "absolute", left: `${ox}%`, top: `${oy}%` }}>
          {showOrbit >= 1 && (
            <div
              style={{
                position: "absolute",
                width: radiusX * 2,
                height: radiusY * 2,
                marginLeft: -radiusX,
                marginTop: -radiusY,
                borderRadius: "50%",
                border: `1px solid ${color}`,
                opacity: 0.18,
              }}
            />
          )}
          {Array.from({ length: count }).map((_, i) => {
            const angle = t + (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radiusX;
            const y = Math.sin(angle) * radiusY;
            // Depth: dots at the front (sin>0) are larger / brighter.
            const depth = (Math.sin(angle) + 1) / 2; // 0 back → 1 front
            const size = dotSize * (0.6 + depth * 0.8);
            return (
              <div
                key={`od-${i}`}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 ${10 + depth * 14}px ${color}`,
                  opacity: 0.35 + depth * 0.65,
                  willChange: "transform, opacity",
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
