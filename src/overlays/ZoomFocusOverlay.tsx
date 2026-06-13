import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";

interface ZoomFocusOverlayProps {
  position: { x: number; y: number; width: number; height: number };
  startFrame: number;
  durationFrames: number;
  borderColor?: string;
  label?: string;
}

/**
 * ZoomFocusOverlay — Highlights an area with an animated border ring
 * to draw attention to a specific UI element.
 */
export const ZoomFocusOverlay: React.FC<ZoomFocusOverlayProps> = ({
  position,
  startFrame,
  durationFrames,
  borderColor,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > durationFrames) return null;

  const ringColor = borderColor ?? theme.colors.primary;

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 25,
  });

  const exitOpacity = interpolate(
    localFrame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(enterSpring, [0, 1], [1.2, 1]);
  const opacity = Math.min(enterSpring, exitOpacity);

  // Pulsing glow
  const pulsePhase = Math.sin(localFrame * 0.15);
  const glowSize = interpolate(pulsePhase, [-1, 1], [4, 10]);

  return (
    <>
      {/* Focus ring */}
      <div
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          width: position.width,
          height: position.height,
          border: `2px solid ${ringColor}`,
          borderRadius: theme.borderRadius / 2,
          transform: `scale(${scale})`,
          opacity,
          boxShadow: `0 0 ${glowSize}px ${ringColor}88, inset 0 0 ${glowSize}px ${ringColor}22`,
          pointerEvents: "none",
          zIndex: 100,
        }}
      />

      {/* Label */}
      {label && (
        <div
          style={{
            position: "absolute",
            left: position.x + position.width + 12,
            top: position.y + position.height / 2 - 12,
            opacity: opacity * 0.9,
            fontFamily: theme.resolvedFonts.body,
            fontSize: 13,
            fontWeight: 600,
            color: ringColor,
            backgroundColor: `${theme.colors.surface}EE`,
            padding: "5px 12px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};
