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

interface ComparisonSceneProps {
  heading?: string;
  subheading?: string;
  leftTitle?: string;
  leftItems?: string[];
  rightTitle?: string;
  rightItems?: string[];
  leftHeaderColor?: string;
  rightHeaderColor?: string;
  leftIcon?: string;
  rightIcon?: string;
  headingStart?: number;
  contentStart?: number;
}

export const ComparisonScene: React.FC<ComparisonSceneProps> = ({
  heading = "Before & After",
  subheading = "See the difference in content automation",
  leftTitle = "Traditional Way",
  leftItems = [
    "Manual frame editing",
    "Slow rendering on local CPU",
    "No schema validation",
    "Error-prone pipeline",
  ],
  rightTitle = "Antigravity Motion",
  rightItems = [
    "Declarative JSON rendering",
    "Safe concurrent processing",
    "Strict Ajv schema checking",
    "Instant high-res output",
  ],
  leftHeaderColor = "#FF4B4B",
  rightHeaderColor = "#00E676",
  leftIcon = "❌",
  rightIcon = "✅",
  headingStart = 5,
  contentStart = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Panels entrance spring animation
  const panelSpring = spring({
    frame: frame - contentStart,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 35,
  });

  // Stagger left and right panel slightly
  const rightPanelSpring = spring({
    frame: frame - (contentStart + 6),
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 35,
  });

  const leftPanelY = interpolate(panelSpring, [0, 1], [60, 0]);
  const leftPanelOpacity = interpolate(panelSpring, [0, 1], [0, 1]);
  const rightPanelY = interpolate(rightPanelSpring, [0, 1], [60, 0]);
  const rightPanelOpacity = interpolate(rightPanelSpring, [0, 1], [0, 1]);

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
          padding: "40px 60px",
          gap: 24,
        }}
      >
        {/* Titles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          {heading && (
            <AnimatedText
              text={heading}
              splitBy="words"
              staggerFrames={3}
              startFrame={headingStart}
              fontSize={44}
              fontWeight={700}
              isHeading
            />
          )}

          {subheading && (
            <AnimatedText
              text={subheading}
              splitBy="words"
              staggerFrames={2}
              startFrame={headingStart + 8}
              fontSize={18}
              fontWeight={400}
              color={theme.colors.mutedText}
              isHeading={false}
            />
          )}
        </div>

        {/* Columns Row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            maxWidth: 1100,
            gap: 32,
            marginTop: 16,
          }}
        >
          {/* Left Column (Negative / Before) */}
          <div
            style={{
              flex: 1,
              transform: `translateY(${leftPanelY}px)`,
              opacity: leftPanelOpacity,
              willChange: "transform, opacity",
            }}
          >
            <GlassPanel
              padding={32}
              style={{
                height: 380,
                display: "flex",
                flexDirection: "column",
                border: theme.glassmorphism ? undefined : `1px solid ${theme.colors.border}`,
                backgroundColor: theme.glassmorphism
                  ? undefined
                  : theme.colors.surface,
              }}
            >
              <h3
                style={{
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize: 24,
                  fontWeight: 700,
                  color: leftHeaderColor,
                  marginBottom: 24,
                  marginTop: 0,
                }}
              >
                {leftTitle}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {leftItems.map((item, index) => {
                  const itemDelay = contentStart + 10 + index * 6;
                  const itemSpring = spring({
                    frame: frame - itemDelay,
                    fps,
                    config: SPRING_PRESETS.snappy,
                    durationInFrames: 20,
                  });
                  const itemX = interpolate(itemSpring, [0, 1], [-20, 0]);
                  const itemOpacity = interpolate(frame - itemDelay, [0, 10], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });

                  return (
                    <div
                      key={`left-item-${index}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        transform: `translateX(${itemX}px)`,
                        opacity: itemOpacity,
                      }}
                    >
                      <span style={{ fontSize: 18, filter: "grayscale(30%)" }}>
                        {leftIcon}
                      </span>
                      <span
                        style={{
                          fontFamily: theme.resolvedFonts.body,
                          fontSize: 16,
                          color: theme.colors.mutedText,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          </div>

          {/* Right Column (Positive / After) */}
          <div
            style={{
              flex: 1,
              transform: `translateY(${rightPanelY}px)`,
              opacity: rightPanelOpacity,
              willChange: "transform, opacity",
            }}
          >
            <GlassPanel
              padding={32}
              style={{
                height: 380,
                display: "flex",
                flexDirection: "column",
                border: theme.glassmorphism
                  ? `1px solid ${theme.colors.primary}33`
                  : `1px solid ${theme.colors.border}`,
                boxShadow: theme.glassmorphism
                  ? `0 8px 32px ${theme.colors.primary}15`
                  : undefined,
                backgroundColor: theme.glassmorphism
                  ? undefined
                  : theme.colors.surface,
              }}
            >
              <h3
                style={{
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize: 24,
                  fontWeight: 700,
                  color: rightHeaderColor,
                  marginBottom: 24,
                  marginTop: 0,
                }}
              >
                {rightTitle}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {rightItems.map((item, index) => {
                  const itemDelay = contentStart + 15 + index * 6;
                  const itemSpring = spring({
                    frame: frame - itemDelay,
                    fps,
                    config: SPRING_PRESETS.snappy,
                    durationInFrames: 20,
                  });
                  const itemX = interpolate(itemSpring, [0, 1], [20, 0]);
                  const itemOpacity = interpolate(frame - itemDelay, [0, 10], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });

                  return (
                    <div
                      key={`right-item-${index}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        transform: `translateX(${itemX}px)`,
                        opacity: itemOpacity,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{rightIcon}</span>
                      <span
                        style={{
                          fontFamily: theme.resolvedFonts.body,
                          fontSize: 16,
                          fontWeight: 500,
                          color: theme.colors.text,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
