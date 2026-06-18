/**
 * ScanLine — a bright scanning bar that sweeps across the scene on a loop, with
 * a soft trailing gradient and glow (scanner / CRT readout feel). Optional faint
 * static CRT scanlines underneath.
 *
 * params:
 *   color (#4FC3F7), direction ("vertical"|"horizontal", default vertical)
 *   thickness (4), period (90), trail (180) px, glow (24)
 *   crt (0|1)   — overlay faint static scanlines
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { type ModifierComponentProps, readNumber, readString } from "../types";

export const ScanLine: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const color = readString(params, "color", "#4FC3F7");
  const direction = readString(params, "direction", "vertical");
  const thickness = readNumber(params, "thickness", 4);
  const period = readNumber(params, "period", 90);
  const trail = readNumber(params, "trail", 180);
  const glow = readNumber(params, "glow", 24);
  const crt = readNumber(params, "crt", 0);

  const vertical = direction === "vertical";
  const span = vertical ? height : width;
  const t = ((frame - start) % period) / period;
  const pos = t * (span + trail) - trail; // travels with trail entering first

  const barStyle: React.CSSProperties = vertical
    ? {
        position: "absolute",
        left: 0,
        right: 0,
        top: pos,
        height: thickness,
        background: color,
        boxShadow: `0 0 ${glow}px ${color}, 0 0 ${glow * 2}px ${color}`,
      }
    : {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: pos,
        width: thickness,
        background: color,
        boxShadow: `0 0 ${glow}px ${color}, 0 0 ${glow * 2}px ${color}`,
      };

  const trailStyle: React.CSSProperties = vertical
    ? {
        position: "absolute",
        left: 0,
        right: 0,
        top: pos - trail,
        height: trail,
        background: `linear-gradient(180deg, transparent, ${color}44)`,
      }
    : {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: pos - trail,
        width: trail,
        background: `linear-gradient(90deg, transparent, ${color}44)`,
      };

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
        {crt >= 1 && (
          <AbsoluteFill
            style={{
              opacity: 0.12,
              backgroundImage: `repeating-linear-gradient(0deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 4px)`,
            }}
          />
        )}
        <div style={trailStyle} />
        <div style={barStyle} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
