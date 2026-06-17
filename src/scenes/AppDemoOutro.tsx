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

interface AppDemoOutroProps {
  appName?: string;
  appIcon?: string;
  tagline?: string;
  ctaText?: string;
  subText?: string;
  brandName?: string;
  appIconBg?: string;
  iconStart?: number;
  textStart?: number;
  ctaStart?: number;
}

/**
 * AppDemoOutro — Clean black + white closing card with centered app icon,
 * name, tagline and CTA button. Minimal and premium.
 */
export const AppDemoOutro: React.FC<AppDemoOutroProps> = ({
  appName = "Lemon",
  appIcon = "🌸",
  tagline = "Your voice. Your computer.\nYour way.",
  ctaText = "Try Lemon Free",
  subText = "Available on macOS",
  brandName = "techinsixty",
  appIconBg = "#1a1a1a",
  iconStart = 5,
  textStart = 18,
  ctaStart = 32,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const BLACK_ZONE = height * 0.42;
  const WHITE_ZONE = height * 0.43;

  // Icon entrance
  const iconSpring = spring({ frame: frame - iconStart, fps, config: SPRING_PRESETS.smooth, durationInFrames: 30 });
  const iconScale = interpolate(iconSpring, [0, 1], [0.3, 1]);
  const iconOpacity = interpolate(frame - iconStart, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // App name entrance
  const nameSpring = spring({ frame: frame - textStart, fps, config: SPRING_PRESETS.smooth, durationInFrames: 28 });
  const nameY = interpolate(nameSpring, [0, 1], [20, 0]);
  const nameOpacity = interpolate(frame - textStart, [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline
  const tagSpring = spring({ frame: frame - (textStart + 8), fps, config: SPRING_PRESETS.smooth, durationInFrames: 28 });
  const tagY = interpolate(tagSpring, [0, 1], [16, 0]);
  const tagOpacity = interpolate(frame - (textStart + 8), [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA button
  const ctaSpring = spring({ frame: frame - ctaStart, fps, config: SPRING_PRESETS.smooth, durationInFrames: 28 });
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.85, 1]);
  const ctaOpacity = interpolate(frame - ctaStart, [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle CTA pulse after it appears
  const pulseProgress = Math.max(0, frame - (ctaStart + 20));
  const pulse = 1 + 0.025 * Math.sin(pulseProgress * 0.12);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* ── Black top zone (brand header) ── */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: BLACK_ZONE,
          backgroundColor: "#000",
          display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start",
          padding: "52px 48px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 60 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#000" }}>⑥</div>
          <span style={{ fontSize: 28, fontWeight: 500, color: "#fff", fontFamily: "Inter, sans-serif" }}>{brandName}</span>
        </div>
      </div>

      {/* ── White bottom zone ── */}
      <div
        style={{
          position: "absolute", top: BLACK_ZONE, left: 0, right: 0, height: WHITE_ZONE,
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {/* App icon */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 22,
            backgroundColor: appIconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            transform: `scale(${iconScale})`,
            opacity: iconOpacity,
            willChange: "transform, opacity",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
        >
          {appIcon}
        </div>

        {/* App name */}
        <div
          style={{
            transform: `translateY(${nameY}px)`,
            opacity: nameOpacity,
            willChange: "transform, opacity",
          }}
        >
          <span style={{ fontSize: 42, fontWeight: 800, color: "#111", fontFamily: "Inter, sans-serif", letterSpacing: "-1px" }}>
            {appName}
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            transform: `translateY(${tagY}px)`,
            opacity: tagOpacity,
            textAlign: "center",
            willChange: "transform, opacity",
          }}
        >
          {tagline.split("\n").map((line, i) => (
            <div key={i} style={{ fontSize: 20, fontWeight: 400, color: "#555", fontFamily: "Georgia, serif", lineHeight: 1.4 }}>
              {line}
            </div>
          ))}
        </div>

        {/* CTA button */}
        <div
          style={{
            transform: `scale(${ctaScale * pulse})`,
            opacity: ctaOpacity,
            willChange: "transform, opacity",
            marginTop: 8,
          }}
        >
          <div
            style={{
              backgroundColor: "#111",
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              borderRadius: 50,
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 40,
              paddingRight: 40,
              display: "inline-block",
              letterSpacing: "-0.2px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
          >
            {ctaText}
          </div>
        </div>

        {/* Sub text */}
        <div style={{ opacity: ctaOpacity * 0.6 }}>
          <span style={{ fontSize: 14, color: "#999", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            {subText}
          </span>
        </div>
      </div>

      {/* ── Bottom black strip ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: height - BLACK_ZONE - WHITE_ZONE, backgroundColor: "#000" }} />
    </AbsoluteFill>
  );
};
