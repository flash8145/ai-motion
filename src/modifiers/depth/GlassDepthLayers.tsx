/**
 * GlassDepthLayers — translucent frosted-glass panels stacked at different
 * depths, parallaxing slowly in front of the scene. The scene stays visible
 * through them (backdrop-filter blur) while borders + highlights sell the
 * glassmorphism. Premium SaaS / Apple "panes of glass" depth.
 *
 * params:
 *   layerCount (3)
 *   blur (12)                   — frost strength in px
 *   tint ("rgba(255,255,255,0.07)")
 *   borderColor ("rgba(255,255,255,0.22)")
 *   radius (28)
 *   parallax (16)               — drift amplitude in px
 *   seed (3)
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  type ModifierComponentProps,
  readNumber,
  readString,
} from "../types";
import { mulberry32 } from "./depthUtils";

interface Panel {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  phase: number;
}

export const GlassDepthLayers: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;

  const layerCount = Math.round(readNumber(params, "layerCount", 3));
  const blur = readNumber(params, "blur", 12);
  const tint = readString(params, "tint", "rgba(255,255,255,0.07)");
  const borderColor = readString(
    params,
    "borderColor",
    "rgba(255,255,255,0.22)",
  );
  const radius = readNumber(params, "radius", 28);
  const parallax = readNumber(params, "parallax", 16);
  const seed = readNumber(params, "seed", 3);

  const panels = useMemo<Panel[]>(() => {
    const rng = mulberry32(seed);
    return Array.from({ length: layerCount }, (_, i) => {
      const depth = (i + 1) / layerCount;
      return {
        x: 18 + rng() * 40,
        y: 16 + rng() * 40,
        w: 30 + rng() * 28,
        h: 26 + rng() * 30,
        depth,
        phase: rng() * Math.PI * 2,
      };
    });
  }, [layerCount, seed]);

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {panels.map((panel, i) => {
          const amp = parallax * panel.depth;
          const dx = Math.sin(frame * 0.01 + panel.phase) * amp;
          const dy = Math.cos(frame * 0.008 + panel.phase) * amp * 0.6;
          return (
            <div
              key={`glass-${i}`}
              style={{
                position: "absolute",
                left: `${panel.x}%`,
                top: `${panel.y}%`,
                width: `${panel.w}%`,
                height: `${panel.h}%`,
                borderRadius: radius,
                background: tint,
                border: `1px solid ${borderColor}`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 30px 60px rgba(0,0,0,0.25)`,
                backdropFilter: `blur(${blur * panel.depth}px)`,
                WebkitBackdropFilter: `blur(${blur * panel.depth}px)`,
                transform: `translate(${dx}px, ${dy}px)`,
                opacity: 0.5 + panel.depth * 0.4,
                willChange: "transform",
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
