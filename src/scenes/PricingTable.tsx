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

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  buttonText?: string;
  /** Whether this tier should be visually highlighted */
  highlighted?: boolean;
  /** Badge text (e.g. "Most Popular") */
  badge?: string;
}

interface PricingTableProps {
  heading?: string;
  subtitle?: string;
  tiers: PricingTier[];
  headingStart?: number;
  tiersStart?: number;
  tierStagger?: number;
}

/**
 * PricingTable — Animated pricing comparison with highlighted tier,
 * feature lists, and staggered spring entrance.
 */
export const PricingTable: React.FC<PricingTableProps> = ({
  heading = "Simple, Transparent Pricing",
  subtitle,
  tiers,
  headingStart = 5,
  tiersStart = 22,
  tierStagger = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const tierWidth = Math.min(300, (1100 - (tiers.length - 1) * 20) / tiers.length);

  return (
    <AbsoluteFill>
      <GradientBackground opacity={0.4} />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
          gap: 32,
        }}
      >
        {/* Heading */}
        <AnimatedText
          text={heading}
          splitBy="words"
          staggerFrames={3}
          startFrame={headingStart}
          fontSize={44}
          fontWeight={700}
          lineHeight={1.2}
          isHeading
        />

        {subtitle && (
          <AnimatedText
            text={subtitle}
            splitBy="words"
            staggerFrames={2}
            startFrame={headingStart + 8}
            fontSize={18}
            fontWeight={400}
            color={theme.colors.mutedText}
            lineHeight={1.5}
            isHeading={false}
          />
        )}

        {/* Tiers row */}
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "stretch",
            justifyContent: "center",
          }}
        >
          {tiers.map((tier, index) => {
            const delay = tiersStart + index * tierStagger;

            const tierSpring = spring({
              frame: frame - delay,
              fps,
              config: SPRING_PRESETS.smooth,
              durationInFrames: 35,
            });

            const tierY = interpolate(tierSpring, [0, 1], [60, 0]);
            const tierScale = tier.highlighted
              ? interpolate(tierSpring, [0, 1], [0.9, 1.02])
              : interpolate(tierSpring, [0, 1], [0.9, 1]);
            const tierOpacity = interpolate(
              frame - delay,
              [0, 15],
              [0, 1],
              {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            return (
              <div
                key={`tier-${index}`}
                style={{
                  transform: `translateY(${tierY}px) scale(${tierScale})`,
                  opacity: tierOpacity,
                  willChange: "transform, opacity",
                  width: tierWidth,
                  position: "relative",
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: theme.colors.primary,
                      color: "#FFFFFF",
                      fontFamily: theme.resolvedFonts.body,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 14px",
                      borderRadius: 12,
                      whiteSpace: "nowrap",
                      zIndex: 10,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {tier.badge}
                  </div>
                )}

                <GlassPanel
                  padding={28}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    border: tier.highlighted
                      ? `2px solid ${theme.colors.primary}`
                      : undefined,
                  }}
                >
                  {/* Tier name */}
                  <div
                    style={{
                      fontFamily: theme.resolvedFonts.heading,
                      fontSize: 18,
                      fontWeight: 600,
                      color: theme.colors.text,
                    }}
                  >
                    {tier.name}
                  </div>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span
                      style={{
                        fontFamily: theme.resolvedFonts.heading,
                        fontSize: 40,
                        fontWeight: 800,
                        color: tier.highlighted
                          ? theme.colors.primary
                          : theme.colors.text,
                      }}
                    >
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span
                        style={{
                          fontFamily: theme.resolvedFonts.body,
                          fontSize: 14,
                          color: theme.colors.mutedText,
                        }}
                      >
                        /{tier.period}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {tier.description && (
                    <p
                      style={{
                        fontFamily: theme.resolvedFonts.body,
                        fontSize: 13,
                        color: theme.colors.mutedText,
                        lineHeight: 1.5,
                      }}
                    >
                      {tier.description}
                    </p>
                  )}

                  {/* Divider */}
                  <div
                    style={{
                      height: 1,
                      backgroundColor: theme.colors.border,
                      margin: "4px 0",
                    }}
                  />

                  {/* Features */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                    }}
                  >
                    {tier.features.map((feat, fi) => (
                      <div
                        key={`feat-${fi}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            color: theme.colors.primary,
                            fontSize: 13,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </span>
                        <span
                          style={{
                            fontFamily: theme.resolvedFonts.body,
                            fontSize: 13,
                            color: theme.colors.text,
                            lineHeight: 1.4,
                          }}
                        >
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <div
                    style={{
                      padding: "10px 0",
                      borderRadius: theme.borderRadius / 2,
                      backgroundColor: tier.highlighted
                        ? theme.colors.primary
                        : "transparent",
                      border: tier.highlighted
                        ? "none"
                        : `1px solid ${theme.colors.border}`,
                      color: tier.highlighted ? "#FFFFFF" : theme.colors.text,
                      fontFamily: theme.resolvedFonts.heading,
                      fontSize: 14,
                      fontWeight: 600,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    {tier.buttonText ?? "Get Started"}
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
