import React from "react";
import { AbsoluteFill, useCurrentFrame, Img } from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { resolveKeyframeTracks, type KeyframeTrack } from "../engine/KeyframeEngine";

export interface FreeformElementTransform {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
  width?: number;
  height?: number;
}

export interface FreeformElement {
  id: string;
  kind: "text" | "rect" | "circle" | "image" | "icon";
  content?: string;
  initial: FreeformElementTransform;
  tracks?: KeyframeTrack[];
  style?: {
    fontSize?: number;
    fontWeight?: number;
    color?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    borderRadius?: number;
  };
}

interface FreeformAnimationProps {
  /** Free-form, individually keyframed elements — the After Effects "layer timeline" scene type. */
  elements: FreeformElement[];
  background?: "theme" | "transparent" | string;
}

function renderElementContent(element: FreeformElement, color: string): React.ReactNode {
  switch (element.kind) {
    case "text":
      return (
        <div
          style={{
            fontSize: element.style?.fontSize ?? 48,
            fontWeight: element.style?.fontWeight ?? 600,
            color: element.style?.color ?? color,
            whiteSpace: "nowrap",
          }}
        >
          {element.content ?? ""}
        </div>
      );

    case "rect":
      return (
        <div
          style={{
            width: element.initial.width ?? 200,
            height: element.initial.height ?? 200,
            backgroundColor: element.style?.fill ?? color,
            borderRadius: element.style?.borderRadius ?? 0,
          }}
        />
      );

    case "circle":
      return (
        <div
          style={{
            width: element.initial.width ?? 200,
            height: element.initial.height ?? 200,
            backgroundColor: element.style?.fill ?? color,
            borderRadius: "50%",
          }}
        />
      );

    case "image":
      return (
        <Img
          src={element.content ?? ""}
          style={{
            width: element.initial.width ?? 400,
            height: element.initial.height ?? "auto",
            objectFit: "cover",
          }}
        />
      );

    case "icon":
      return (
        <svg
          width={element.initial.width ?? 64}
          height={element.initial.height ?? 64}
          viewBox="0 0 24 24"
        >
          <path
            d={element.content ?? ""}
            fill={element.style?.fill ?? "none"}
            stroke={element.style?.stroke ?? color}
            strokeWidth={element.style?.strokeWidth ?? 1.5}
          />
        </svg>
      );

    default:
      return null;
  }
}

/**
 * FreeformAnimation — generic, per-element keyframe-driven scene.
 * Each element carries its own x/y/scale/rotation/opacity tracks,
 * resolved by KeyframeEngine — the direct equivalent of an After
 * Effects composition's layer timeline.
 */
export const FreeformAnimation: React.FC<FreeformAnimationProps> = ({
  elements,
  background = "transparent",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const backgroundColor =
    background === "theme"
      ? theme.colors.background
      : background === "transparent"
        ? "transparent"
        : background;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {elements.map((element) => {
        const resolved = element.tracks?.length
          ? resolveKeyframeTracks(frame, element.tracks)
          : {};

        const x = resolved.x ?? element.initial.x;
        const y = resolved.y ?? element.initial.y;
        const scale = resolved.scale ?? element.initial.scale ?? 1;
        const rotation = resolved.rotation ?? element.initial.rotation ?? 0;
        const opacity = resolved.opacity ?? element.initial.opacity ?? 1;

        return (
          <div
            key={element.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
              willChange: "transform, opacity",
            }}
          >
            {renderElementContent(element, theme.colors.text)}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
