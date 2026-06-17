import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface TrueFocusProps {
  sentence: string;
  startFrame?: number;
  wordDurationFrames?: number;
  blurAmount?: number;
  fontSize?: number;
  borderColor?: string;
  glowColor?: string;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence,
  startFrame = 0,
  wordDurationFrames = 30,
  blurAmount = 8,
  fontSize = 54,
  borderColor,
  glowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const words = sentence.split(" ");
  const local = frame - startFrame;

  const resolvedBorderColor = borderColor ?? theme.colors.primary;
  const resolvedGlowColor = glowColor ?? theme.colors.primary + "66"; // translucent version

  // Total frames in a full sentence cycle
  const loopDuration = words.length * wordDurationFrames;
  const cycleLocal = local >= 0 ? local % loopDuration : -1;

  // Compute active word index based on cycle
  const activeIndex = cycleLocal >= 0 ? Math.floor(cycleLocal / wordDurationFrames) : -1;

  // Local frame progress within the current active word cycle (for focus frame animation)
  const currentWordFrame = local >= 0 ? local % wordDurationFrames : 0;
  const activeSpring = spring({
    frame: currentWordFrame,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px 24px",
          maxWidth: "80%",
          lineHeight: "1.4em",
          textAlign: "center",
        }}
      >
        {words.map((word, index) => {
          // Calculate active midpoint of this word
          const wordMidpoint = index * wordDurationFrames + wordDurationFrames / 2;

          // Circular distance calculation
          let diff = cycleLocal - wordMidpoint;
          if (diff > loopDuration / 2) diff -= loopDuration;
          if (diff < -loopDuration / 2) diff += loopDuration;

          const distFromMid = Math.abs(diff);
          const halfDuration = wordDurationFrames / 2;
          const transitionFrames = Math.min(5, wordDurationFrames / 4);

          // Interpolate visual states frame-by-frame
          const opacityVal = interpolate(
            distFromMid,
            [halfDuration - transitionFrames, halfDuration],
            [1.0, 0.4],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const blurVal = interpolate(
            distFromMid,
            [halfDuration - transitionFrames, halfDuration],
            [0, blurAmount],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const scaleVal = interpolate(
            distFromMid,
            [halfDuration - transitionFrames, halfDuration],
            [1.05, 1.0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const isActive = index === activeIndex;

          return (
            <span
              key={index}
              style={{
                position: "relative",
                display: "inline-block",
                fontFamily: theme.resolvedFonts.heading,
                fontSize,
                fontWeight: 700,
                color: theme.colors.text,
                filter: `blur(${blurVal}px)`,
                opacity: opacityVal,
                transform: `scale(${scaleVal})`,
              }}
            >
              {word}

              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    inset: "-8px -12px",
                    border: `1.5px solid ${resolvedBorderColor}`,
                    boxShadow: `0 0 10px ${resolvedGlowColor}`,
                    pointerEvents: "none",
                    borderRadius: 4,
                    opacity: activeSpring,
                    transform: `scale(${0.9 + activeSpring * 0.1})`,
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Neon brackets corners */}
                  <span
                    style={{
                      position: "absolute",
                      top: -2,
                      left: -2,
                      width: 8,
                      height: 8,
                      borderLeft: `2.5px solid ${resolvedBorderColor}`,
                      borderTop: `2.5px solid ${resolvedBorderColor}`,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRight: `2.5px solid ${resolvedBorderColor}`,
                      borderTop: `2.5px solid ${resolvedBorderColor}`,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: -2,
                      width: 8,
                      height: 8,
                      borderLeft: `2.5px solid ${resolvedBorderColor}`,
                      borderBottom: `2.5px solid ${resolvedBorderColor}`,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
                      width: 8,
                      height: 8,
                      borderRight: `2.5px solid ${resolvedBorderColor}`,
                      borderBottom: `2.5px solid ${resolvedBorderColor}`,
                    }}
                  />
                </div>
              )}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
