import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface TextOverlayProps {
  text: string;
  position: { x: number; y: number };
  startFrame: number;
  durationFrames: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  animationType?: "pop" | "fade" | "float";
}

/**
 * TextOverlay — Floating text label that appears on top of a scene.
 */
export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  position,
  startFrame,
  durationFrames,
  fontSize = 16,
  fontWeight = 600,
  color,
  backgroundColor,
  animationType = "fade",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const localFrame = frame - startFrame;
  const endFrame = durationFrames;

  if (localFrame < 0 || localFrame > endFrame) return null;

  // Entrance
  const enterProgress = interpolate(localFrame, [0, 10], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit
  const exitProgress = interpolate(
    localFrame,
    [endFrame - 10, endFrame],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = Math.min(enterProgress, exitProgress);

  let transform = "none";
  if (animationType === "pop") {
    const scale = interpolate(enterProgress, [0, 1], [0.5, 1]);
    transform = `scale(${scale})`;
  } else if (animationType === "float") {
    const y = interpolate(localFrame, [0, endFrame], [0, -8]);
    transform = `translateY(${y}px)`;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        opacity,
        transform,
        fontFamily: theme.resolvedFonts.body,
        fontSize,
        fontWeight,
        color: color ?? theme.colors.text,
        backgroundColor: backgroundColor ?? `${theme.colors.surface}DD`,
        padding: "8px 16px",
        borderRadius: theme.borderRadius / 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {text}
    </div>
  );
};
