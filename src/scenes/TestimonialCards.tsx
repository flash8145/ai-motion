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
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { SPRING_PRESETS } from "../animation/springs";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Avatar initials (e.g. "JD") shown if no avatarUrl */
  avatarInitials?: string;
  /** Avatar background color */
  avatarColor?: string;
}

interface TestimonialCardsProps {
  /** Section heading */
  heading?: string;
  /** List of testimonials to display (max 3 recommended) */
  testimonials: Testimonial[];
  /** Frame at which the heading starts. Default: 5 */
  headingStart?: number;
  /** Frame at which cards start appearing. Default: 20 */
  cardsStart?: number;
  /** Stagger delay between cards in frames. Default: 10 */
  cardStagger?: number;
}

/**
 * TestimonialCards — Displays a heading followed by staggered
 * glassmorphic testimonial cards with avatar, quote, and attribution.
 */
export const TestimonialCards: React.FC<TestimonialCardsProps> = ({
  heading = "What Our Customers Say",
  testimonials,
  headingStart = 5,
  cardsStart = 20,
  cardStagger = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  return (
    <AbsoluteFill>
      <GradientBackground opacity={0.5} />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
          gap: 40,
        }}
      >
        {/* Heading */}
        <AnimatedText
          text={heading}
          splitBy="words"
          staggerFrames={3}
          startFrame={headingStart}
          fontSize={48}
          fontWeight={700}
          lineHeight={1.2}
          isHeading
        />

        {/* Cards row */}
        <div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: 1200,
          }}
        >
          {testimonials.map((t, index) => {
            const delay = cardsStart + index * cardStagger;

            const cardSpring = spring({
              frame: frame - delay,
              fps,
              config: SPRING_PRESETS.smooth,
              durationInFrames: 35,
            });

            const cardY = interpolate(cardSpring, [0, 1], [50, 0]);
            const cardOpacity = interpolate(
              frame - delay,
              [0, 15],
              [0, 1],
              {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            const avatarColor =
              t.avatarColor ??
              theme.colors.charts[index % theme.colors.charts.length];

            return (
              <div
                key={`testimonial-${index}`}
                style={{
                  transform: `translateY(${cardY}px)`,
                  opacity: cardOpacity,
                  willChange: "transform, opacity",
                  width: 340,
                }}
              >
                <GlassPanel padding={28} style={{ height: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      height: "100%",
                    }}
                  >
                    {/* Quote mark */}
                    <span
                      style={{
                        fontSize: 36,
                        lineHeight: 1,
                        color: theme.colors.primary,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      "
                    </span>

                    {/* Quote text */}
                    <p
                      style={{
                        fontFamily: theme.resolvedFonts.body,
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: theme.colors.text,
                        flex: 1,
                      }}
                    >
                      {t.quote}
                    </p>

                    {/* Attribution */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginTop: 8,
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: avatarColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: theme.resolvedFonts.heading,
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#FFFFFF",
                          flexShrink: 0,
                        }}
                      >
                        {t.avatarInitials ?? t.name.charAt(0)}
                      </div>

                      <div>
                        <div
                          style={{
                            fontFamily: theme.resolvedFonts.heading,
                            fontSize: 14,
                            fontWeight: 600,
                            color: theme.colors.text,
                          }}
                        >
                          {t.name}
                        </div>
                        <div
                          style={{
                            fontFamily: theme.resolvedFonts.body,
                            fontSize: 12,
                            color: theme.colors.mutedText,
                          }}
                        >
                          {t.role}, {t.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
