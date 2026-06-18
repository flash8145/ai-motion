/**
 * CameraStage — shared presentational shell for every camera modifier.
 *
 * In a 2D Remotion context a "camera" is a transform applied to the whole
 * content layer. CameraStage gives each camera component a consistent crop
 * (overflow hidden) and an optional perspective wrapper for 3D-ish moves
 * (orbit / tilt). The inner layer carries the animated transform/filter.
 */

import React from "react";
import { AbsoluteFill } from "remotion";

export interface CameraStageProps {
  /** CSS transform applied to the content layer. */
  transform?: string;
  /** CSS filter (e.g. blur for rack-focus / whip-pan motion blur). */
  filter?: string;
  /** When set, wraps the stage in a perspective context (px) for rotateX/Y. */
  perspective?: number;
  /** transform-origin for the content layer. Defaults to centre. */
  transformOrigin?: string;
  children: React.ReactNode;
}

export const CameraStage: React.FC<CameraStageProps> = ({
  transform = "none",
  filter,
  perspective,
  transformOrigin = "50% 50%",
  children,
}) => {
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        ...(perspective ? { perspective: `${perspective}px` } : {}),
      }}
    >
      <AbsoluteFill
        style={{
          transform,
          transformOrigin,
          ...(filter ? { filter } : {}),
          willChange: "transform, filter",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
