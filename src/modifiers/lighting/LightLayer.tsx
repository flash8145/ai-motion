/**
 * LightLayer — shared shell for lighting modifiers.
 *
 * Lighting is additive: the scene renders underneath, then one or more
 * full-frame light overlays are composited on top (usually with
 * mix-blend-mode "screen" so blacks vanish and only the light shows). Each
 * overlay is just a styled AbsoluteFill; components compute the gradients /
 * transforms / masks per frame via interpolate().
 */
import React from "react";
import { AbsoluteFill } from "remotion";

export interface LightLayerProps {
  children: React.ReactNode;
  /** Full-frame overlay styles, painted in order on top of the scene. */
  layers: React.CSSProperties[];
}

export const LightLayer: React.FC<LightLayerProps> = ({ children, layers }) => {
  return (
    <AbsoluteFill>
      {children}
      {layers.map((style, i) => (
        <AbsoluteFill
          key={`light-${i}`}
          style={{
            pointerEvents: "none",
            mixBlendMode: "screen",
            willChange: "opacity, transform",
            ...style,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
