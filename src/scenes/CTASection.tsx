import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { GlassPanel } from "../components/primitives/GlassPanel";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";

interface CTASectionProps {
  /** Main CTA headline */
  headline: string;
  /** Description text */
  description?: string;
  /** Primary button label */
  buttonText?: string;
  /** Secondary text (e.g. pricing) */
  pricingText?: string;
  /** Features list (bullet points inside the card) */
  features?: string[];
  /** Frame at which the card enters. Default: 8 */
  enterFrame?: number;
}

/**
 * CTASection — Outro/CTA scene with a glassmorphic card containing
 * headline, description, feature list, and an animated button pulse.
 */
export const CTASection: React.FC<CTASectionProps> = ({
  headline,
  description,
  buttonText = "Get Started",
  pricingText,
  features = [],
  enterFrame = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // ── Card entrance ──────────────────────────────────────────
  const cardSpring = spring({
    frame: frame - enterFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 40,
  });

  const cardY = interpolate(cardSpring, [0, 1], [50, 0]);
  const cardScale = interpolate(cardSpring, [0, 1], [0.95, 1]);
  const cardOpacity = interpolate(
    frame - enterFrame,
    [0, 15],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ── Button pulse animation ─────────────────────────────────
  const buttonDelay = enterFrame + 35;
  const buttonSpring = spring({
    frame: frame - buttonDelay,
    fps,
    config: SPRING_PRESETS.snappy,
    durationInFrames: 20,
  });

  const buttonScale = interpolate(buttonSpring, [0, 1], [0.8, 1]);
  const buttonOpacity = interpolate(
    frame - buttonDelay,
    [0, 10],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Subtle glow pulse on the button
  const glowIntensity = interpolate(
    Math.sin((frame - buttonDelay) * 0.08),
    [-1, 1],
    [0.3, 0.7]
  );

  return (
    <AbsoluteFill>
      <GradientBackground />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `translateY(${cardY}px) scale(${cardScale})`,
            opacity: cardOpacity,
            willChange: "transform, opacity",
          }}
        >
          <GlassPanel
            padding={48}
            style={{
              width: 560,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Headline */}
            <AnimatedText
              text={headline}
              splitBy="words"
              staggerFrames={3}
              startFrame={enterFrame + 8}
              fontSize={40}
              fontWeight={700}
              lineHeight={1.2}
              maxWidth={480}
              isHeading
            />

            {/* Description */}
            {description && (
              <AnimatedText
                text={description}
                splitBy="words"
                staggerFrames={1}
                startFrame={enterFrame + 18}
                fontSize={17}
                fontWeight={400}
                color={theme.colors.mutedText}
                lineHeight={1.6}
                maxWidth={440}
                isHeading={false}
              />
            )}

            {/* Pricing text */}
            {pricingText && (
              <div
                style={{
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize: 28,
                  fontWeight: 800,
                  color: theme.colors.primary,
                  opacity: interpolate(
                    frame - enterFrame - 25,
                    [0, 12],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }
                  ),
                }}
              >
                {pricingText}
              </div>
            )}

            {/* Feature list */}
            {features.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  width: "100%",
                  paddingLeft: 40,
                }}
              >
                {features.map((feat, i) => {
                  const featDelay = enterFrame + 22 + i * 4;
                  const featOpacity = interpolate(
                    frame - featDelay,
                    [0, 10],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }
                  );

                  const featX = interpolate(
                    spring({
                      frame: frame - featDelay,
                      fps,
                      config: SPRING_PRESETS.snappy,
                      durationInFrames: 20,
                    }),
                    [0, 1],
                    [20, 0]
                  );

                  return (
                    <div
                      key={`feat-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        opacity: featOpacity,
                        transform: `translateX(${featX}px)`,
                      }}
                    >
                      <span style={{ color: theme.colors.primary, fontSize: 16 }}>
                        ✓
                      </span>
                      <span
                        style={{
                          fontFamily: theme.resolvedFonts.body,
                          fontSize: 15,
                          color: theme.colors.text,
                        }}
                      >
                        {feat}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTA Button */}
            <div
              style={{
                marginTop: 8,
                transform: `scale(${buttonScale})`,
                opacity: buttonOpacity,
              }}
            >
              <div
                style={{
                  padding: "14px 40px",
                  borderRadius: theme.borderRadius,
                  backgroundColor: theme.colors.primary,
                  color: "#FFFFFF",
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize: 17,
                  fontWeight: 700,
                  textAlign: "center",
                  boxShadow: `0 0 ${20 + glowIntensity * 20}px ${theme.colors.primary}${Math.round(glowIntensity * 99)
                    .toString()
                    .padStart(2, "0")}`,
                  cursor: "pointer",
                }}
              >
                {buttonText}
              </div>
            </div>
          </GlassPanel>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
