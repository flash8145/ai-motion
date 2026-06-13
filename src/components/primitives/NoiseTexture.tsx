import React, { useMemo } from "react";
import { AbsoluteFill, random } from "remotion";

interface NoiseTextureProps {
  /** Opacity of the noise overlay. Default: 0.03 */
  opacity?: number;
  /** Noise grain size (pixel density). Default: 200 */
  size?: number;
  /** Random seed for consistent renders */
  seed?: string;
}

/**
 * NoiseTexture — Film-grain overlay rendered via an inline SVG
 * noise filter. Applied as an absolute overlay with pointer-events disabled.
 *
 * Uses Remotion's random() for deterministic seeded output.
 */
export const NoiseTexture: React.FC<NoiseTextureProps> = ({
  opacity = 0.03,
  size = 200,
  seed = "noise-texture",
}) => {
  const seedVal = useMemo(() => random(seed) * 1000, [seed]);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <filter id={`noise-${seedVal}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={size / 10000}
              numOctaves={4}
              seed={Math.round(seedVal)}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter={`url(#noise-${seedVal})`}
          opacity={1}
        />
      </svg>
    </AbsoluteFill>
  );
};
