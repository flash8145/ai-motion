import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { EASINGS } from "../animation/easings";

export type SectionTransitionType =
  | "black-to-white"
  | "white-to-black"
  | "slide-wipe"
  | "mask-reveal"
  | "scale";

export interface SectionTransitionProps {
  transitionType?: SectionTransitionType;
  duration?: number;
  startFrame?: number;
  fromColor?: string;
  toColor?: string;
  direction?: "up" | "down" | "left" | "right";
  children?: React.ReactNode;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  transitionType = "black-to-white",
  duration = 36,
  startFrame = 0,
  fromColor,
  toColor,
  direction = "up",
  children,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
    easing: Easing.bezier(...EASINGS.easeInOutSmooth),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resolvedFrom =
    fromColor ?? (transitionType === "white-to-black" ? "#FFFFFF" : "#000000");
  const resolvedTo =
    toColor ?? (transitionType === "white-to-black" ? "#000000" : "#FFFFFF");

  if (transitionType === "scale") {
    const scale = interpolate(progress, [0, 1], [1.08, 1]);
    const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1]);

    return (
      <AbsoluteFill style={{ backgroundColor: resolvedTo, overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            opacity,
            transform: `scale(${scale})`,
            willChange: "opacity, transform",
          }}
        >
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  if (transitionType === "mask-reveal") {
    const radius = interpolate(progress, [0, 1], [0, 155]);

    return (
      <AbsoluteFill style={{ backgroundColor: resolvedFrom }}>
        <AbsoluteFill
          style={{
            backgroundColor: resolvedTo,
            clipPath: `circle(${radius}% at 50% 50%)`,
            willChange: "clip-path",
          }}
        >
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  const translate =
    direction === "left" || direction === "right"
      ? `translateX(${interpolate(progress, [0, 1], [direction === "left" ? 100 : -100, 0])}%)`
      : `translateY(${interpolate(progress, [0, 1], [direction === "up" ? 100 : -100, 0])}%)`;

  return (
    <AbsoluteFill style={{ backgroundColor: resolvedFrom, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundColor: resolvedTo,
          transform:
            transitionType === "slide-wipe" ||
            transitionType === "black-to-white" ||
            transitionType === "white-to-black"
              ? translate
              : undefined,
          willChange: "transform",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SectionTransitionExample: React.FC = () => (
  <SectionTransition transitionType="black-to-white" duration={40} />
);
