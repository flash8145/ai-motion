import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SPRING_PRESETS } from "../animation/springs";

export type FeatureCardEnterDirection = "bottom" | "top" | "left" | "right";

export interface WhiteFeatureCardProps {
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  cornerRadius?: number;
  enterDirection?: FeatureCardEnterDirection;
  shadowStrength?: number;
  startFrame?: number;
  padding?: number;
  style?: React.CSSProperties;
}

const getOffset = (
  direction: FeatureCardEnterDirection,
  distance: number,
): { x: number; y: number } => {
  if (direction === "top") {
    return { x: 0, y: -distance };
  }

  if (direction === "left") {
    return { x: -distance, y: 0 };
  }

  if (direction === "right") {
    return { x: distance, y: 0 };
  }

  return { x: 0, y: distance };
};

export const WhiteFeatureCard: React.FC<WhiteFeatureCardProps> = ({
  children,
  width = 1180,
  height = 720,
  cornerRadius = 42,
  enterDirection = "bottom",
  shadowStrength = 0.22,
  startFrame = 0,
  padding = 56,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 54,
  });

  const opacity = interpolate(frame - startFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const offset = getOffset(enterDirection, 180);
  const translateX = interpolate(entry, [0, 1], [offset.x, 0]);
  const translateY = interpolate(entry, [0, 1], [offset.y, 0]);
  const scale = interpolate(entry, [0, 1], [0.985, 1]);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: cornerRadius,
        padding,
        backgroundColor: "#FFFFFF",
        color: "#0A0A0A",
        boxShadow: [
          `0 42px 120px rgba(0, 0, 0, ${shadowStrength})`,
          "0 1px 0 rgba(255, 255, 255, 0.9) inset",
          "0 0 0 1px rgba(0, 0, 0, 0.04)",
        ].join(", "),
        overflow: "hidden",
        opacity,
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const WhiteFeatureCardExample: React.FC = () => (
  <WhiteFeatureCard width={1040} height={640} cornerRadius={36}>
    <div style={{ fontSize: 56, fontWeight: 700 }}>Reply to emails</div>
  </WhiteFeatureCard>
);
