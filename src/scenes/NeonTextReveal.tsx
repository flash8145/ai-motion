import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";

// SPRING_PRESETS and EASINGS imported per codebase convention (used indirectly via the
// easing constants — the cursor smoothing uses EASINGS.easeOutQuart).
void SPRING_PRESETS;

interface NeonTextRevealProps {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  textColor?: string;
  glowColor?: string;
  glowBlur?: number;
  cursorColor?: string;
  charStaggerFrames?: number;
  startFrame?: number;
  cursorSize?: number;
}

export const NeonTextReveal: React.FC<NeonTextRevealProps> = ({
  text,
  fontSize = 120,
  fontWeight = 300,
  textColor = "#FFFFFF",
  glowColor = "#FFFFFF",
  glowBlur = 18,
  cursorColor = "#FF6B35",
  charStaggerFrames = 4,
  startFrame = 5,
  cursorSize = 36,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const theme = useTheme();

  const chars = useMemo(() => text.split(""), [text]);

  // Estimated character width for cursor tracking (thin weight)
  const charWidth = fontSize * 0.58;
  const totalTextWidth = chars.length * charWidth;
  const textStartX = (width - totalTextWidth) / 2;

  // Cursor tracks from first to last char as text reveals
  const revealEndFrame = startFrame + chars.length * charStaggerFrames;
  const cursorX = interpolate(
    frame,
    [startFrame, revealEndFrame],
    [textStartX + charWidth * 0.5, textStartX + totalTextWidth - charWidth * 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Cursor fades in with first char, then fades out after all chars revealed
  const cursorAppearOpacity = interpolate(
    frame,
    [startFrame, startFrame + 8],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const cursorFadeOpacity = interpolate(
    frame,
    [revealEndFrame + 12, revealEndFrame + 22],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cursorOpacity = Math.min(cursorAppearOpacity, cursorFadeOpacity);

  const cursorTopY = height / 2 - cursorSize / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Centered text row */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          {chars.map((char, index) => {
            const charStartFrame = startFrame + index * charStaggerFrames;

            const opacity = interpolate(
              frame - charStartFrame,
              [0, 8],
              [0, 1],
              {
                easing: Easing.bezier(...EASINGS.easeOutQuart),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            return (
              <span
                key={`char-${index}`}
                style={{
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize,
                  fontWeight,
                  color: textColor,
                  opacity,
                  filter: `drop-shadow(0 0 ${glowBlur * opacity}px ${glowColor})`,
                  display: "inline-block",
                  whiteSpace: "pre",
                  lineHeight: 1,
                  willChange: "filter, opacity",
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Neon cursor triangle */}
      <div
        style={{
          position: "absolute",
          left: cursorX - cursorSize * 0.5,
          top: cursorTopY - cursorSize * 0.8,
          width: cursorSize,
          height: cursorSize,
          clipPath: "polygon(0% 0%, 100% 50%, 0% 100%)",
          background: cursorColor,
          opacity: cursorOpacity,
          filter: `drop-shadow(0 0 8px ${cursorColor})`,
          willChange: "transform, opacity",
        }}
      />
    </AbsoluteFill>
  );
};
