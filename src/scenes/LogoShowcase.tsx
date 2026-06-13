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
import { AnimatedText } from "../components/primitives/AnimatedText";
import { SPRING_PRESETS } from "../animation/springs";

interface LogoItem {
  name: string;
  /** Optional hex color for the logo placeholder */
  color?: string;
}

interface LogoShowcaseProps {
  heading?: string;
  logos: LogoItem[];
  headingStart?: number;
  logosStart?: number;
  logoStagger?: number;
}

/**
 * LogoShowcase — "Trusted by" section displaying company logos
 * (rendered as styled placeholders with company initials).
 */
export const LogoShowcase: React.FC<LogoShowcaseProps> = ({
  heading = "Trusted by Industry Leaders",
  logos,
  headingStart = 5,
  logosStart = 20,
  logoStagger = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  return (
    <AbsoluteFill>
      <GradientBackground opacity={0.3} />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: 48,
        }}
      >
        <AnimatedText
          text={heading}
          splitBy="words"
          staggerFrames={3}
          startFrame={headingStart}
          fontSize={36}
          fontWeight={600}
          color={theme.colors.mutedText}
          lineHeight={1.2}
          isHeading
        />

        <div
          style={{
            display: "flex",
            gap: 40,
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: 1000,
          }}
        >
          {logos.map((logo, index) => {
            const delay = logosStart + index * logoStagger;

            const logoSpring = spring({
              frame: frame - delay,
              fps,
              config: SPRING_PRESETS.gentle,
              durationInFrames: 25,
            });

            const logoOpacity = interpolate(
              frame - delay,
              [0, 15],
              [0, 0.7],
              {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            const logoScale = interpolate(logoSpring, [0, 1], [0.85, 1]);

            return (
              <div
                key={`logo-${index}`}
                style={{
                  opacity: logoOpacity,
                  transform: `scale(${logoScale})`,
                  willChange: "transform, opacity",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {/* Logo icon placeholder */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor:
                      logo.color ??
                      theme.colors.charts[index % theme.colors.charts.length],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: theme.resolvedFonts.heading,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#FFFFFF",
                  }}
                >
                  {logo.name.charAt(0)}
                </div>
                <span
                  style={{
                    fontFamily: theme.resolvedFonts.heading,
                    fontSize: 18,
                    fontWeight: 600,
                    color: theme.colors.mutedText,
                  }}
                >
                  {logo.name}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
