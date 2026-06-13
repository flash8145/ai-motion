import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";

interface BadgeOverlayProps {
  text: string;
  position: { x: number; y: number };
  startFrame: number;
  durationFrames: number;
  color?: string;
  backgroundColor?: string;
  icon?: string;
}

/**
 * BadgeOverlay — A small pill badge that pops in with a spring animation.
 */
export const BadgeOverlay: React.FC<BadgeOverlayProps> = ({
  text,
  position,
  startFrame,
  durationFrames,
  color,
  backgroundColor,
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > durationFrames) return null;

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_PRESETS.snappy,
    durationInFrames: 18,
  });

  const exitOpacity = interpolate(
    localFrame,
    [durationFrames - 10, durationFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(enterSpring, [0, 1], [0.3, 1]);
  const opacity = Math.min(enterSpring, exitOpacity);

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: `scale(${scale})`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 6,
        backgroundColor: backgroundColor ?? theme.colors.primary,
        color: color ?? "#FFFFFF",
        fontFamily: theme.resolvedFonts.body,
        fontSize: 13,
        fontWeight: 600,
        padding: "6px 14px",
        borderRadius: 20,
        boxShadow: `0 4px 12px ${(backgroundColor ?? theme.colors.primary)}55`,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {icon && <span>{icon}</span>}
      {text}
    </div>
  );
};
