/**
 * NeonLine — one or more glowing neon lines that draw in and pulse. Great as
 * structural accents (underlines, dividers, frame edges) in neon/dark styles.
 *
 * params:
 *   lines: array of {
 *     orientation: "h"|"v" (default "h"),
 *     pos: number (% on the cross axis, default 50),
 *     start: number (% start along the axis, default 10),
 *     length: number (% length, default 80),
 *     color: string, thickness: number (3), glow: number (16),
 *     drawFrames: number (18), delay: number (frames)
 *   }
 *   Defaults to a single centered horizontal line in theme primary-ish blue.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { EASINGS } from "../../animation/easings";
import { type ModifierComponentProps } from "../types";

interface LineSpec {
  orientation?: "h" | "v";
  pos?: number;
  start?: number;
  length?: number;
  color?: string;
  thickness?: number;
  glow?: number;
  drawFrames?: number;
  delay?: number;
}

export const NeonLine: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const start = modifier.startFrame ?? 0;
  const raw = modifier.params?.lines;
  const lines: LineSpec[] = Array.isArray(raw) ? (raw as LineSpec[]) : [{}];

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
        {lines.map((l, i) => {
          const horizontal = (l.orientation ?? "h") === "h";
          const color = l.color ?? "#4FC3F7";
          const thickness = l.thickness ?? 3;
          const glow = l.glow ?? 16;
          const pos = l.pos ?? 50;
          const startPct = l.start ?? 10;
          const length = l.length ?? 80;
          const drawFrames = l.drawFrames ?? 18;
          const delay = l.delay ?? 0;

          const draw = interpolate(
            frame - start - delay,
            [0, drawFrames],
            [0, 1],
            {
              easing: Easing.bezier(...EASINGS.easeOutQuart),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );
          const flicker = 0.88 + 0.12 * Math.sin((frame - start) * 0.4 + i);

          const base: React.CSSProperties = {
            position: "absolute",
            background: `linear-gradient(${horizontal ? "90deg" : "0deg"}, transparent, ${color} 12%, ${color} 88%, transparent)`,
            boxShadow: `0 0 ${glow}px ${color}, 0 0 ${glow * 2}px ${color}`,
            opacity: draw * flicker,
            willChange: "transform, opacity",
          };

          if (horizontal) {
            return (
              <div
                key={`nl-${i}`}
                style={{
                  ...base,
                  left: `${startPct}%`,
                  top: `${pos}%`,
                  width: `${length}%`,
                  height: thickness,
                  transform: `scaleX(${draw})`,
                  transformOrigin: "left center",
                }}
              />
            );
          }
          return (
            <div
              key={`nl-${i}`}
              style={{
                ...base,
                top: `${startPct}%`,
                left: `${pos}%`,
                height: `${length}%`,
                width: thickness,
                transform: `scaleY(${draw})`,
                transformOrigin: "center top",
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
