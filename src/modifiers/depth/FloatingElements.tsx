/**
 * FloatingElements — crisp geometric shapes (rings, squares, plus signs) that
 * float and rotate with parallax in front of the scene. Decorative "design
 * confetti" that adds dimensional motion without blurring the content.
 *
 * params:
 *   count (10)
 *   colors (["#5B8CFF","#A66BFF","#FF6F91","#28E0B0"])
 *   maxSize (70)
 *   speed (0.6)                 — float amplitude scale
 *   intensity (0.85)            — opacity
 *   seed (7)
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type ModifierComponentProps, readNumber } from "../types";
import { generateField } from "./depthUtils";

const SHAPES = ["ring", "square", "plus"] as const;

export const FloatingElements: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;

  const count = Math.round(readNumber(params, "count", 10));
  const maxSize = readNumber(params, "maxSize", 70);
  const speed = readNumber(params, "speed", 0.6);
  const intensity = readNumber(params, "intensity", 0.85);
  const seed = readNumber(params, "seed", 7);

  const rawColors = params?.colors;
  const colors: string[] =
    Array.isArray(rawColors) && rawColors.every((c) => typeof c === "string")
      ? (rawColors as string[])
      : ["#5B8CFF", "#A66BFF", "#FF6F91", "#28E0B0"];

  const field = useMemo(
    () => generateField(count, seed, maxSize * 0.4, maxSize),
    [count, seed, maxSize],
  );

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {field.map((el, i) => {
          const shape = SHAPES[i % SHAPES.length];
          const color = colors[el.colorIndex % colors.length];
          const amp = (6 + el.depth * 14) * speed;
          const dx = Math.sin(frame * 0.012 + el.phase) * amp;
          const dy = Math.cos(frame * 0.01 + el.phase) * amp;
          const rot = frame * el.rotSpeed;
          const size = el.size;
          const opacity = intensity * (0.4 + el.depth * 0.6);

          const base: React.CSSProperties = {
            position: "absolute",
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: size,
            height: size,
            opacity,
            transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
            willChange: "transform",
          };

          if (shape === "ring") {
            return (
              <div
                key={`fe-${i}`}
                style={{
                  ...base,
                  borderRadius: "50%",
                  border: `${Math.max(2, size * 0.08)}px solid ${color}`,
                }}
              />
            );
          }
          if (shape === "square") {
            return (
              <div
                key={`fe-${i}`}
                style={{
                  ...base,
                  borderRadius: size * 0.18,
                  background: color,
                }}
              />
            );
          }
          // plus sign — two crossed bars
          const bar = size * 0.22;
          return (
            <div key={`fe-${i}`} style={base}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  width: "100%",
                  height: bar,
                  marginTop: -bar / 2,
                  borderRadius: bar,
                  background: color,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  height: "100%",
                  width: bar,
                  marginLeft: -bar / 2,
                  borderRadius: bar,
                  background: color,
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
