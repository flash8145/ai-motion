/**
 * ClickRipple — expanding ripple rings at click points; pure tap/click
 * feedback (no cursor). Use alongside a cursor overlay, or alone to punctuate
 * interactions. Each click can emit several staggered rings.
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../theme/ThemeProvider";

interface ClickPoint {
  x: number;
  y: number;
  /** Frame (relative to overlay start) the click fires. Auto-spaced if omitted. */
  atFrame?: number;
}

interface ClickRippleProps {
  clicks: ClickPoint[];
  startFrame: number;
  durationFrames: number;
  color?: string;
  maxSize?: number;
  /** Rings emitted per click. Default 2 */
  rings?: number;
  /** Show a solid dot at the click point. Default true */
  dot?: boolean;
}

const RING_LIFE = 24;

export const ClickRipple: React.FC<ClickRippleProps> = ({
  clicks,
  startFrame,
  durationFrames,
  color,
  maxSize = 70,
  rings = 2,
  dot = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const local = frame - startFrame;

  if (local < 0 || local > durationFrames || !clicks?.length) return null;

  const c = color ?? theme.colors.primary;
  const n = clicks.length;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 110 }}>
      {clicks.map((click, i) => {
        const clickFrame =
          typeof click.atFrame === "number"
            ? click.atFrame
            : (i + 0.5) * (durationFrames / n);
        const age = local - clickFrame;
        if (age < 0 || age > RING_LIFE + rings * 4) return null;

        const dotOpacity = interpolate(age, [0, 3, 10], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div key={`cr-${i}`} style={{ position: "absolute", left: click.x, top: click.y }}>
            {Array.from({ length: rings }).map((_, r) => {
              const ringAge = age - r * 4;
              if (ringAge < 0 || ringAge > RING_LIFE) return null;
              const t = ringAge / RING_LIFE;
              const size = interpolate(t, [0, 1], [6, maxSize]);
              const ringOpacity = interpolate(t, [0, 1], [0.85, 0]);
              return (
                <div
                  key={`ring-${r}`}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: size,
                    height: size,
                    marginLeft: -size / 2,
                    marginTop: -size / 2,
                    borderRadius: "50%",
                    border: `2px solid ${c}`,
                    opacity: ringOpacity,
                  }}
                />
              );
            })}
            {dot && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 14,
                  height: 14,
                  marginLeft: -7,
                  marginTop: -7,
                  borderRadius: "50%",
                  background: c,
                  opacity: dotOpacity,
                  boxShadow: `0 0 12px ${c}`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
