import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { SPRING_PRESETS } from "../animation/springs";

interface AppDemoHeroProps {
  /** Brand/creator name shown at top */
  brandName?: string;
  /** Brand logo emoji or short text */
  brandLogo?: string;
  /** The fixed bold headline that stays throughout the video */
  headline?: string;
  /** Optional sub-label below headline */
  subLabel?: string;
  /** App icon emoji or text */
  appIcon?: string;
  /** Background color of the app icon */
  appIconBg?: string;
  headlineStart?: number;
  appIconStart?: number;
}

/**
 * AppDemoHero — The opening scene of a HeyLemon-style app demo video.
 * Black top zone with brand + headline, white bottom zone with app icon.
 * The headline stays fixed as a persistent header throughout the video series.
 */
export const AppDemoHero: React.FC<AppDemoHeroProps> = ({
  brandName = "techinsixty",
  brandLogo = "⑥",
  headline = "Control your entire computer\nwithout touching it.",
  appIcon = "🌸",
  appIconBg = "#1a1a1a",
  headlineStart = 8,
  appIconStart = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Brand row fade in
  const brandOpacity = interpolate(frame, [0, 12], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Headline words stagger
  const headlineWords = headline.replace(/\n/g, " \n ").split(" ");

  // App icon entrance
  const iconSpring = spring({
    frame: frame - appIconStart,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 30,
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0.4, 1]);
  const iconOpacity = interpolate(frame - appIconStart, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const BLACK_ZONE = height * 0.42;
  const WHITE_ZONE = height * 0.43;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* ── Black top zone ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: BLACK_ZONE,
          backgroundColor: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: "52px 48px 0",
        }}
      >
        {/* Brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: brandOpacity,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 900,
              color: "#000",
              fontFamily: "sans-serif",
              flexShrink: 0,
            }}
          >
            {brandLogo}
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "#ffffff",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.3px",
            }}
          >
            {brandName}
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0 16px",
            maxWidth: width - 96,
          }}
        >
          {headlineWords.map((word, i) => {
            if (word === "\n") {
              return (
                <div key={`br-${i}`} style={{ width: "100%", height: 0 }} />
              );
            }
            const delay = headlineStart + i * 4;
            const wordSpring = spring({
              frame: frame - delay,
              fps,
              config: SPRING_PRESETS.smooth,
              durationInFrames: 28,
            });
            const wordY = interpolate(wordSpring, [0, 1], [32, 0]);
            const wordOpacity = interpolate(frame - delay, [0, 14], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <span
                key={`${word}-${i}`}
                style={{
                  display: "inline-block",
                  fontSize: 52,
                  fontWeight: 800,
                  color: "#ffffff",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.15,
                  letterSpacing: "-1.5px",
                  transform: `translateY(${wordY}px)`,
                  opacity: wordOpacity,
                  willChange: "transform, opacity",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── White bottom zone ── */}
      <div
        style={{
          position: "absolute",
          top: BLACK_ZONE,
          left: 0,
          right: 0,
          height: WHITE_ZONE,
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* App icon */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 26,
            backgroundColor: appIconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 60,
            transform: `scale(${iconScale})`,
            opacity: iconOpacity,
            willChange: "transform, opacity",
            boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          }}
        >
          {appIcon}
        </div>
      </div>

      {/* ── Bottom black strip ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height - BLACK_ZONE - WHITE_ZONE,
          backgroundColor: "#000000",
        }}
      />
    </AbsoluteFill>
  );
};
