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
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";

// ─── Props ───────────────────────────────────────────────────────
export interface OverlayHeadlineProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  /** Frame at which the title words begin revealing. Default: 10 */
  titleStartFrame?: number;
  /** Frame at which the subtitle fades in. Default: auto (after title) */
  subtitleStartFrame?: number;
}

// ─── Constants ───────────────────────────────────────────────────
const WORD_STAGGER = 3;
const HEADLINE_FONT_SIZE = 96;
const SUBTITLE_FONT_SIZE = 24;

/**
 * OverlayHeadline — Full-screen cinematic typography overlay.
 * Each word reveals with blur → sharp, scale-up, and letter-spacing
 * narrowing, staggered in sequence. Optional subtitle fades in afterwards.
 * All animation via Remotion spring() / interpolate().
 */
export const OverlayHeadline: React.FC<OverlayHeadlineProps> = ({
  title,
  subtitle,
  align = "center",
  titleStartFrame = 10,
  subtitleStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const words = title.split(/\s+/).filter(Boolean);

  // Auto-compute subtitle start if not provided:
  // last word's start + generous buffer for the spring to settle
  const autoSubtitleStart =
    titleStartFrame + words.length * WORD_STAGGER + 25;
  const effectiveSubtitleStart = subtitleStartFrame ?? autoSubtitleStart;

  // ── Flex alignment mapping ─────────────────────────────────────
  const flexAlign =
    align === "left"
      ? "flex-start"
      : align === "right"
        ? "flex-end"
        : "center";

  const textAlign = align;

  // ── Subtitle animation ────────────────────────────────────────
  const subtitleSpring = subtitle
    ? spring({
        frame: frame - effectiveSubtitleStart,
        fps,
        config: SPRING_PRESETS.smooth,
        durationInFrames: 30,
      })
    : 0;

  const subtitleOpacity = subtitle
    ? interpolate(
        frame - effectiveSubtitleStart,
        [0, 20],
        [0, 1],
        {
          easing: Easing.bezier(...EASINGS.easeOutQuart),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 0;

  const subtitleY = subtitle
    ? interpolate(subtitleSpring, [0, 1], [18, 0])
    : 0;

  return (
    <AbsoluteFill>
      <GradientBackground />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: flexAlign,
          justifyContent: "center",
          padding: "0 100px",
          gap: 32,
        }}
      >
        {/* ── Title words ──────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: flexAlign,
            gap: "0 18px",
            textAlign,
            maxWidth: 1200,
          }}
        >
          {words.map((word, index) => {
            const delay = titleStartFrame + index * WORD_STAGGER;

            // Spring drives scale and blur
            const wordSpring = spring({
              frame: frame - delay,
              fps,
              config: SPRING_PRESETS.slow,
              durationInFrames: 40,
            });

            // Opacity separate for crisp fade-in
            const wordOpacity = interpolate(
              frame - delay,
              [0, 16],
              [0, 1],
              {
                easing: Easing.bezier(...EASINGS.easeOutQuart),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            const wordScale = interpolate(wordSpring, [0, 1], [0.9, 1]);
            const wordBlur = interpolate(wordSpring, [0, 1], [20, 0]);
            const wordLetterSpacing = interpolate(
              wordSpring,
              [0, 1],
              [12, 0],
            );

            return (
              <span
                key={`word-${index}`}
                style={{
                  display: "inline-block",
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize: HEADLINE_FONT_SIZE,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: theme.colors.text,
                  opacity: wordOpacity,
                  transform: `scale(${wordScale})`,
                  filter: `blur(${wordBlur}px)`,
                  letterSpacing: wordLetterSpacing,
                  willChange: "transform, filter, opacity, letter-spacing",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* ── Subtitle ─────────────────────────────────────────── */}
        {subtitle && (
          <div
            style={{
              fontFamily: theme.resolvedFonts.body,
              fontSize: SUBTITLE_FONT_SIZE,
              fontWeight: 400,
              lineHeight: 1.6,
              color: theme.colors.mutedText,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              textAlign,
              maxWidth: 800,
              willChange: "transform, opacity",
            }}
          >
            {subtitle}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
