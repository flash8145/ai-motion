import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SPRING_PRESETS } from "../animation/springs";

export interface ContentStackProps {
  children: React.ReactNode;
  gap?: number;
  alignment?: "start" | "center" | "end" | "stretch";
  startFrame?: number;
  stagger?: number;
  animated?: boolean;
  width?: number | string;
  style?: React.CSSProperties;
}

const alignMap: Record<
  NonNullable<ContentStackProps["alignment"]>,
  React.CSSProperties["alignItems"]
> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

export const ContentStack: React.FC<ContentStackProps> = ({
  children,
  gap = 28,
  alignment = "center",
  startFrame = 0,
  stagger = 6,
  animated = true,
  width = "100%",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = React.Children.toArray(children);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: alignMap[alignment],
        gap,
        width,
        ...style,
      }}
    >
      {items.map((child, index) => {
        const delay = startFrame + index * stagger;
        const entry = spring({
          frame: frame - delay,
          fps,
          config: SPRING_PRESETS.smooth,
          durationInFrames: 34,
        });
        const opacity = animated
          ? interpolate(frame - delay, [0, 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 1;
        const translateY = animated ? interpolate(entry, [0, 1], [24, 0]) : 0;

        return (
          <div
            key={`stack-item-${index}`}
            style={{
              width: alignment === "stretch" ? "100%" : undefined,
              opacity,
              transform: `translateY(${translateY}px)`,
              willChange: animated ? "opacity, transform" : undefined,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export const ContentStackExample: React.FC = () => (
  <ContentStack gap={20}>
    <div>Meet</div>
    <div>Reply to emails</div>
  </ContentStack>
);
