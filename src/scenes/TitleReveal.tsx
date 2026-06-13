import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";

interface TitleRevealProps {
  /** Small tagline above the headline */
  tagline?: string;
  /** Main headline text */
  headline: string;
  /** Optional subtitle below the headline */
  subtitle?: string;
  /** Frame at which the tagline starts appearing. Default: 10 */
  taglineStart?: number;
  /** Frame at which the headline starts appearing. Default: 25 */
  headlineStart?: number;
  /** Frame at which the subtitle starts appearing. Default: 50 */
  subtitleStart?: number;
  /** Typography animation style: "reveal" | "bounce" | "neon" */
  animationType?: "reveal" | "bounce" | "neon";
}

/**
 * TitleReveal — Full-screen scene that sequentially reveals
 * a tagline, headline, and subtitle with staggered spring animations.
 */
export const TitleReveal: React.FC<TitleRevealProps> = ({
  tagline,
  headline,
  subtitle,
  taglineStart = 10,
  headlineStart = 25,
  subtitleStart = 50,
  animationType = "reveal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // ── Tagline animation ──────────────────────────────────────
  const taglineOpacity = tagline
    ? interpolate(frame - taglineStart, [0, 15], [0, 1], {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const taglineY = tagline
    ? interpolate(
        spring({
          frame: frame - taglineStart,
          fps,
          config: SPRING_PRESETS.snappy,
          durationInFrames: 25,
        }),
        [0, 1],
        [20, 0]
      )
    : 0;

  // ── Decorative line animation ──────────────────────────────
  const lineWidth = interpolate(
    frame - headlineStart + 10,
    [0, 20],
    [0, 60],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill>
      <GradientBackground />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: 24,
        }}
      >
        {/* Tagline */}
        {tagline && (
          <div
            style={{
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: lineWidth,
                height: 2,
                backgroundColor: theme.colors.primary,
                borderRadius: 1,
              }}
            />
            <span
              style={{
                fontFamily: theme.resolvedFonts.body,
                fontSize: 18,
                fontWeight: 600,
                color: theme.colors.primary,
                textTransform: "uppercase",
                letterSpacing: 3,
              }}
            >
              {tagline}
            </span>
            <div
              style={{
                width: lineWidth,
                height: 2,
                backgroundColor: theme.colors.primary,
                borderRadius: 1,
              }}
            />
          </div>
        )}

        {/* Headline */}
        <AnimatedText
          text={headline}
          splitBy="words"
          staggerFrames={4}
          startFrame={headlineStart}
          fontSize={72}
          fontWeight={800}
          lineHeight={1.15}
          maxWidth={1000}
          isHeading
          animationType={animationType}
        />

        {/* Subtitle */}
        {subtitle && (
          <AnimatedText
            text={subtitle}
            splitBy="words"
            staggerFrames={2}
            startFrame={subtitleStart}
            fontSize={24}
            fontWeight={400}
            color={theme.colors.mutedText}
            lineHeight={1.5}
            maxWidth={700}
            isHeading={false}
            animationType={animationType}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
