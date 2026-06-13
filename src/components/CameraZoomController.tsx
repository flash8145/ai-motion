import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASINGS } from "../animation/easings";

export interface CameraZoomControllerProps {
  children: React.ReactNode;
  startScale?: number;
  endScale?: number;
  duration?: number;
  startFrame?: number;
  origin?: string;
  motionBlur?: boolean;
  translateX?: [number, number];
  translateY?: [number, number];
}

export const CameraZoomController: React.FC<CameraZoomControllerProps> = ({
  children,
  startScale = 1,
  endScale = 1.12,
  duration = 90,
  startFrame = 0,
  origin = "50% 50%",
  motionBlur = false,
  translateX = [0, 0],
  translateY = [0, 0],
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
    easing: Easing.bezier(...EASINGS.easeInOutSmooth),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [startScale, endScale]);
  const x = interpolate(progress, [0, 1], translateX);
  const y = interpolate(progress, [0, 1], translateY);
  const blur = motionBlur
    ? interpolate(progress, [0, 0.5, 1], [0, 1.4, 0])
    : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transformOrigin: origin,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        filter: `blur(${blur}px)`,
        willChange: "transform, filter",
      }}
    >
      {children}
    </div>
  );
};

export const CameraZoomControllerExample: React.FC = () => (
  <CameraZoomController startScale={0.94} endScale={1.06} motionBlur>
    <div style={{ width: "100%", height: "100%", background: "#FFFFFF" }} />
  </CameraZoomController>
);
