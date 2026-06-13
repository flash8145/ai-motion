import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";

// ─── Props ───────────────────────────────────────────────────────
export interface PromptCardProps {
  prompt: string;
  placeholder?: string;
  showSubmitButton?: boolean;
  /** Characters revealed per frame. Default: 0.7 */
  typingSpeed?: number;
  /** Frame at which the card entrance begins. Default: 8 */
  startFrame?: number;
}

// ─── Constants ───────────────────────────────────────────────────
const CARD_MAX_WIDTH = 720;
const CARD_PADDING_X = 40;
const CARD_PADDING_Y = 36;

/**
 * PromptCard — Full-screen scene showing a centred glassmorphic AI
 * prompt input card with a typing animation and animated conic-gradient
 * glow border. Uses Remotion spring() / interpolate() exclusively.
 */
export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  placeholder = "Ask me anything…",
  showSubmitButton = true,
  typingSpeed = 0.7,
  startFrame = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // ── Card entrance spring (smooth preset) ───────────────────────
  const entranceSpring = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 35,
  });

  const cardScale = interpolate(entranceSpring, [0, 1], [0.9, 1]);
  const cardOpacity = interpolate(
    frame - startFrame,
    [0, 18],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // ── Rotating conic-gradient glow ───────────────────────────────
  // Full rotation every ~90 frames (≈3 s at 30 fps)
  const glowRotation = interpolate(
    frame,
    [0, 90],
    [0, 360],
    { extrapolateRight: "extend" },
  );

  const glowGradient = `conic-gradient(
    from ${glowRotation}deg,
    ${theme.colors.primary}00 0%,
    ${theme.colors.primary}88 25%,
    ${theme.colors.secondary}88 50%,
    ${theme.colors.accent}88 75%,
    ${theme.colors.primary}00 100%
  )`;

  // Glow border opacity ramps in slightly after card appears
  const glowOpacity = interpolate(
    frame - startFrame,
    [10, 30],
    [0, 0.7],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // ── Typing animation ──────────────────────────────────────────
  const typingStart = startFrame + 20; // begin typing after card is mostly visible
  const charsRevealed = Math.max(
    0,
    Math.floor((frame - typingStart) * typingSpeed),
  );
  const displayedText = prompt.slice(0, Math.min(charsRevealed, prompt.length));
  const isTypingDone = charsRevealed >= prompt.length;

  // Blinking cursor (toggle every 15 frames)
  const showCursor = !isTypingDone || Math.floor(frame / 15) % 2 === 0;

  // ── Placeholder fade ──────────────────────────────────────────
  const placeholderOpacity = interpolate(
    charsRevealed,
    [0, 1],
    [0.45, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ── Submit button ─────────────────────────────────────────────
  // Appears after typing finishes
  const typingDoneFrame = useMemo(
    () => typingStart + Math.ceil(prompt.length / typingSpeed),
    [typingStart, prompt.length, typingSpeed],
  );

  const submitSpring = spring({
    frame: frame - typingDoneFrame - 8,
    fps,
    config: SPRING_PRESETS.snappy,
    durationInFrames: 20,
  });

  const submitOpacity = interpolate(
    frame - typingDoneFrame - 8,
    [0, 12],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const submitScale = interpolate(submitSpring, [0, 1], [0.85, 1]);

  // Subtle glow pulse on the submit button
  const pulsePhase = Math.sin(((frame - typingDoneFrame) / fps) * Math.PI * 1.2);
  const submitGlowIntensity = interpolate(pulsePhase, [-1, 1], [6, 18]);

  return (
    <AbsoluteFill>
      <GradientBackground />
      <NoiseTexture />

      {/* Centred layout */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
        }}
      >
        {/* Card wrapper — contains glow border + glass card */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: CARD_MAX_WIDTH,
            transform: `scale(${cardScale})`,
            opacity: cardOpacity,
            willChange: "transform, opacity",
          }}
        >
          {/* ── Conic-gradient glow border (pseudo-container) ──── */}
          <div
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: 26,
              background: glowGradient,
              opacity: glowOpacity,
              filter: "blur(6px)",
              pointerEvents: "none",
            }}
          />

          {/* Mask that clips glow to a thin border ring */}
          <div
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: 26,
              background: glowGradient,
              opacity: glowOpacity,
              pointerEvents: "none",
              // Create a hollow mask so only the outer 2 px ring of gradient is visible
              WebkitMaskImage:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: 2,
            }}
          />

          {/* ── Glassmorphic card ──────────────────────────────── */}
          <div
            style={{
              position: "relative",
              background: "rgba(14, 14, 26, 0.6)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(124, 58, 237, 0.12)",
              borderRadius: 24,
              padding: `${CARD_PADDING_Y}px ${CARD_PADDING_X}px`,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Label */}
            <div
              style={{
                fontFamily: theme.resolvedFonts.body,
                fontSize: 14,
                fontWeight: 500,
                color: theme.colors.mutedText,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              Prompt
            </div>

            {/* Text area simulation */}
            <div
              style={{
                position: "relative",
                minHeight: 80,
                fontFamily: theme.resolvedFonts.mono,
                fontSize: 20,
                lineHeight: 1.6,
                color: theme.colors.text,
              }}
            >
              {/* Placeholder */}
              {placeholderOpacity > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    color: theme.colors.mutedText,
                    opacity: placeholderOpacity,
                    pointerEvents: "none",
                    fontFamily: theme.resolvedFonts.body,
                    fontStyle: "italic",
                  }}
                >
                  {placeholder}
                </span>
              )}

              {/* Typed prompt text */}
              <span>{displayedText}</span>

              {/* Cursor */}
              {showCursor && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 22,
                    backgroundColor: theme.colors.primary,
                    marginLeft: 2,
                    verticalAlign: "middle",
                    boxShadow: `0 0 10px ${theme.colors.primary}`,
                    borderRadius: 1,
                  }}
                />
              )}
            </div>

            {/* Submit button */}
            {showSubmitButton && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    opacity: submitOpacity,
                    transform: `scale(${submitScale})`,
                    willChange: "transform, opacity",
                  }}
                >
                  <div
                    style={{
                      fontFamily: theme.resolvedFonts.heading,
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#ffffff",
                      backgroundColor: theme.colors.primary,
                      padding: "12px 32px",
                      borderRadius: 12,
                      cursor: "default",
                      letterSpacing: 0.5,
                      boxShadow: `0 0 ${submitGlowIntensity}px ${theme.colors.primary}88, 0 4px 16px rgba(0,0,0,0.3)`,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>Generate</span>
                    <span style={{ fontSize: 18 }}>→</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
