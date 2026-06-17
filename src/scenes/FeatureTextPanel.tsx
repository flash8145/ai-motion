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

interface FeatureTextPanelProps {
  headline?: string;
  featureText?: string;
  /** Small descriptive label above voice bar */
  voiceLabel?: string;
  voiceText?: string;
  barGradientColor?: string;
  featureStart?: number;
  barStart?: number;
  headlineStart?: number;
}

/**
 * FeatureTextPanel — Large bold text describing a feature fills most of
 * the white zone. A small voice input bar appears below it, exactly like
 * the HeyLemon "Then turn that research into polished slides" scene.
 */
export const FeatureTextPanel: React.FC<FeatureTextPanelProps> = ({
  headline = "Control your entire computer\nwithout touching it.",
  featureText = "Then turn that research\ninto polished slides,\nreports and more",
  voiceText = "Great. Add those suggestions to the research doc and turn",
  barGradientColor = "#ff9a5c",
  featureStart = 8,
  barStart = 22,
  headlineStart = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const BLACK_ZONE = height * 0.42;
  const WHITE_ZONE = height * 0.43;
  const headlineWords = headline.replace(/\n/g, " \n ").split(" ");

  // Feature text lines entrance
  const featureLines = featureText.split("\n");

  // Bar entrance
  const barSpring = spring({
    frame: frame - barStart,
    fps,
    config: { damping: 16, mass: 0.6, stiffness: 120 },
    durationInFrames: 28,
  });
  const barY = interpolate(barSpring, [0, 1], [30, 0]);
  const barOpacity = interpolate(frame - barStart, [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter
  const typingStart = barStart + 6;
  const charsVisible = Math.max(0, Math.floor((frame - typingStart) * 2.2));
  const displayText = voiceText.slice(0, charsVisible);
  const cursorVisible = frame % 18 < 10;
  const waveHeights = [0.5, 0.85, 0.65, 1.0, 0.75, 0.55, 0.9, 0.6];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* ── Black top zone ── */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: BLACK_ZONE,
          backgroundColor: "#000",
          display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start",
          padding: "52px 48px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#000" }}>⑥</div>
          <span style={{ fontSize: 28, fontWeight: 500, color: "#fff", fontFamily: "Inter, sans-serif" }}>techinsixty</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
          {headlineWords.map((word, i) => {
            if (word === "\n") return <div key={`br-${i}`} style={{ width: "100%", height: 0 }} />;
            const delay = headlineStart + i * 3;
            const ws = spring({ frame: frame - delay, fps, config: SPRING_PRESETS.smooth, durationInFrames: 28 });
            return (
              <span key={`${word}-${i}`} style={{ display: "inline-block", fontSize: 52, fontWeight: 800, color: "#fff", fontFamily: "Inter, sans-serif", lineHeight: 1.15, letterSpacing: "-1.5px", transform: `translateY(${interpolate(ws, [0, 1], [32, 0])}px)`, opacity: interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), willChange: "transform, opacity" }}>
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── White bottom zone ── */}
      <div
        style={{
          position: "absolute", top: BLACK_ZONE, left: 0, right: 0, height: WHITE_ZONE,
          backgroundColor: "#ffffff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 36px",
          gap: 24,
        }}
      >
        {/* Feature text - large serif */}
        <div style={{ textAlign: "center" }}>
          {featureLines.map((line, i) => {
            const delay = featureStart + i * 8;
            const lineSpring = spring({
              frame: frame - delay,
              fps,
              config: SPRING_PRESETS.smooth,
              durationInFrames: 28,
            });
            const lineY = interpolate(lineSpring, [0, 1], [24, 0]);
            const lineOpacity = interpolate(frame - delay, [0, 16], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: "#111",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1.3,
                  transform: `translateY(${lineY}px)`,
                  opacity: lineOpacity,
                  willChange: "transform, opacity",
                  letterSpacing: "-0.3px",
                }}
              >
                {line}
              </div>
            );
          })}
        </div>

        {/* Voice bar */}
        <div
          style={{
            opacity: barOpacity,
            transform: `translateY(${barY}px)`,
            willChange: "transform, opacity",
            width: "88%",
            maxWidth: 560,
          }}
        >
          <div style={{ position: "relative" }}>
            {/* Gradient strip */}
            <div
              style={{
                position: "absolute",
                top: -4,
                left: -16,
                right: -16,
                bottom: -4,
                background: `linear-gradient(90deg, transparent 0%, ${barGradientColor}44 25%, ${barGradientColor}44 75%, transparent 100%)`,
                borderRadius: 14,
                pointerEvents: "none",
              }}
            />
            {/* Dark pill */}
            <div
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: 16,
                padding: "14px 18px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                position: "relative",
                boxShadow: "0 6px 28px rgba(0,0,0,0.2)",
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🌸</span>
              <span style={{ flex: 1, fontSize: 15, color: "#fff", fontFamily: "Inter, sans-serif", lineHeight: 1.5, fontWeight: 400 }}>
                {displayText}
                {cursorVisible && charsVisible < voiceText.length && (
                  <span style={{ display: "inline-block", width: 1.5, height: 14, backgroundColor: "#fff", marginLeft: 1, verticalAlign: "text-bottom" }} />
                )}
              </span>
              {/* Waveform */}
              <div style={{ display: "flex", alignItems: "center", gap: 2.5, height: 22, flexShrink: 0 }}>
                {waveHeights.map((h, wi) => {
                  const animH = h * (0.6 + 0.4 * Math.sin((frame * 0.15 + wi * 0.5) % (Math.PI * 2)));
                  return <div key={wi} style={{ width: 3, height: 22 * animH, backgroundColor: "#fff", borderRadius: 2, opacity: 0.8 }} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom black strip ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: height - BLACK_ZONE - WHITE_ZONE, backgroundColor: "#000" }} />
    </AbsoluteFill>
  );
};
