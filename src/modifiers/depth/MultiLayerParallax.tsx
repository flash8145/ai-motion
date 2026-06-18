/**
 * MultiLayerParallax — drives a multi-plane parallax: a virtual camera pans
 * back and forth, the scene (far plane) drifts slowest, and a field of soft
 * foreground orbs drifts proportionally faster by depth. The differential
 * motion reads as real 3D separation.
 *
 * params:
 *   count (12)                  — foreground orbs
 *   color (#FFFFFF)
 *   panAmplitude (40)           — virtual camera travel in px
 *   panPeriod (260)             — frames per pan cycle
 *   overscan (1.1)              — scene overscan to hide drift edges
 *   intensity (0.4)             — orb opacity
 *   seed (5)
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CameraStage } from "../camera/CameraStage";
import {
  type ModifierComponentProps,
  readNumber,
  readString,
} from "../types";
import { generateField } from "./depthUtils";

export const MultiLayerParallax: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const frame = useCurrentFrame();
  const params = modifier.params;
  const start = modifier.startFrame ?? 0;

  const count = Math.round(readNumber(params, "count", 12));
  const color = readString(params, "color", "#FFFFFF");
  const panAmplitude = readNumber(params, "panAmplitude", 40);
  const panPeriod = readNumber(params, "panPeriod", 260);
  const overscan = readNumber(params, "overscan", 1.1);
  const intensity = readNumber(params, "intensity", 0.4);
  const seed = readNumber(params, "seed", 5);

  const field = useMemo(
    () => generateField(count, seed, 80, 260),
    [count, seed],
  );

  // Virtual camera pan shared by every plane.
  const pan = Math.sin(((frame - start) / panPeriod) * Math.PI * 2) * panAmplitude;

  return (
    <AbsoluteFill>
      {/* Far plane: the scene, drifting slowest. */}
      <CameraStage transform={`scale(${overscan}) translateX(${pan * 0.25}px)`}>
        {children}
      </CameraStage>

      {/* Foreground planes: orbs drift faster the nearer they are. */}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
        {field.map((el, i) => {
          const planeShift = pan * (0.6 + el.depth * 1.2);
          const sway = Math.cos(frame * 0.01 + el.phase) * el.depth * 10;
          return (
            <div
              key={`mlp-${i}`}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: el.size,
                height: el.size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color}, transparent 70%)`,
                opacity: intensity * (0.2 + el.depth * 0.5),
                filter: `blur(${4 + el.depth * 12}px)`,
                transform: `translate(${planeShift}px, ${sway}px)`,
                willChange: "transform",
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
