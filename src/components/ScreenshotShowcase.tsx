import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ImageWithFallback } from "./ImageWithFallback";

export type PanDirection = "up" | "down" | "left" | "right" | "none";

export interface ScreenshotShowcaseProps {
  image: string;
  zoomAmount?: number;
  panDirection?: PanDirection;
  width?: number | string;
  height?: number | string;
  startFrame?: number;
  duration?: number;
  borderRadius?: number;
  shadow?: boolean;
  objectFit?: React.CSSProperties["objectFit"];
}

const panForDirection = (
  direction: PanDirection,
  progress: number,
): { x: number; y: number } => {
  const amount = interpolate(progress, [0, 1], [-18, 18]);

  if (direction === "left") {
    return { x: amount, y: 0 };
  }

  if (direction === "right") {
    return { x: -amount, y: 0 };
  }

  if (direction === "up") {
    return { x: 0, y: amount };
  }

  if (direction === "down") {
    return { x: 0, y: -amount };
  }

  return { x: 0, y: 0 };
};

export const ScreenshotShowcase: React.FC<ScreenshotShowcaseProps> = ({
  image,
  zoomAmount = 0.06,
  panDirection = "up",
  width = "100%",
  height = "100%",
  startFrame = 0,
  duration = 160,
  borderRadius = 28,
  shadow = true,
  objectFit = "cover",
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  useVideoConfig();

  const scale = interpolate(progress, [0, 1], [1, 1 + zoomAmount]);
  const pan = panForDirection(panDirection, progress);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius,
        overflow: "hidden",
        boxShadow: shadow
          ? "0 42px 110px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.08)"
          : undefined,
      }}
    >
      <ImageWithFallback
        src={image}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
          willChange: "transform",
        }}
      />
    </div>
  );
};

export const ScreenshotShowcaseExample: React.FC<{ image: string }> = ({
  image,
}) => <ScreenshotShowcase image={image} zoomAmount={0.045} panDirection="right" />;
