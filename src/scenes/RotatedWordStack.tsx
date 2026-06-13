import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { EASINGS } from "../animation/easings";

interface RotatedWordStackProps {
  phrases?: string[];
  rotationDeg?: number;
  startFrame?: number;
}

const DEFAULT_PHRASES = [
  "Brand Identity",
  "Brand Strategy",
  "Brand Story",
  "Graphic Design",
  "Video Production",
  "Video Editing",
  "Content Creation",
];

export const RotatedWordStack: React.FC<RotatedWordStackProps> = ({
  phrases = DEFAULT_PHRASES,
  rotationDeg = -8,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const theme = useTheme();

  const relativeFrame = Math.max(0, frame - startFrame);
  const totalFrames = durationInFrames - startFrame;

  const lineSpacing = 70;

  // Total scroll distance: enough to move first phrase from below center to last phrase above center
  const totalScrollDistance = (phrases.length - 1) * lineSpacing;
  const startOffset = totalScrollDistance / 2;
  const endOffset = -totalScrollDistance / 2;

  // Smooth scrolling offset using easeInOutSmooth easing
  const scrollProgress = interpolate(
    relativeFrame,
    [0, totalFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EASINGS.easeInOutSmooth),
    }
  );

  const scrollOffset =
    startOffset + scrollProgress * (endOffset - startOffset);

  return (
    <AbsoluteFill>
      <GradientBackground />
      <NoiseTexture />

      {/* "to play" label */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 12,
          fontWeight: 500,
          fontFamily: theme.resolvedFonts.body,
          color: theme.colors.mutedText,
          opacity: 0.6,
          textTransform: "uppercase",
          letterSpacing: 2,
          zIndex: 2,
        }}
      >
        to play
      </div>

      {/* Rotated word stack */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `rotate(${rotationDeg}deg)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${scrollOffset}px)`,
          }}
        >
          {phrases.map((phrase, index) => {
            // Compute each line's current Y position relative to viewport center
            const lineBaseY = index * lineSpacing;
            const currentY = lineBaseY + scrollOffset;
            const distanceFromCenter = Math.abs(currentY);

            const opacity = interpolate(
              distanceFromCenter,
              [0, 150, 300],
              [1, 0.35, 0.15],
              {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              }
            );

            return (
              <div
                key={index}
                style={{
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize: 56,
                  fontWeight: 700,
                  color: "white",
                  lineHeight: `${lineSpacing}px`,
                  opacity,
                  whiteSpace: "nowrap",
                }}
              >
                {phrase}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
