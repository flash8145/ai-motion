/**
 * ForegroundParticles — soft out-of-focus bokeh drifting in the foreground,
 * adding atmospheric depth in front of the scene. Particles float upward with
 * a gentle sway; nearer (higher-depth) ones are larger, blurrier, and faster.
 *
 * params:
 *   count (18)
 *   color (#FFFFFF)
 *   maxSize (90)                — px diameter of the nearest particles
 *   speed (0.12)                — upward drift (% of height per frame)
 *   intensity (0.5)             — overall opacity
 *   seed (1)
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  type ModifierComponentProps,
  readNumber,
  readString,
} from "../types";
import { generateField, wrap } from "./depthUtils";

export const ForegroundParticles: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;

  const count = Math.round(readNumber(params, "count", 18));
  const color = readString(params, "color", "#FFFFFF");
  const maxSize = readNumber(params, "maxSize", 90);
  const speed = readNumber(params, "speed", 0.12);
  const intensity = readNumber(params, "intensity", 0.5);
  const seed = readNumber(params, "seed", 1);

  const field = useMemo(
    () => generateField(count, seed, maxSize * 0.25, maxSize),
    [count, seed, maxSize],
  );

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
        {field.map((el, i) => {
          const driftSpeed = speed * (0.4 + el.depth);
          const y = wrap(el.y - frame * driftSpeed, 120) - 10;
          const x = el.x + Math.sin(frame * 0.01 + el.phase) * (4 + el.depth * 6);
          const size = el.size;
          return (
            <div
              key={`fp-${i}`}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color}, transparent 70%)`,
                opacity: intensity * (0.25 + el.depth * 0.55),
                filter: `blur(${2 + el.depth * 8}px)`,
                willChange: "transform, opacity",
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
