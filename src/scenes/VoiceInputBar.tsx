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

interface VoiceInputBarProps {
  headline?: string;
  sectionLabel?: string;
  promptText?: string;
  appIcon?: string;
  headlineStart?: number;
  labelStart?: number;
  barStart?: number;
}

const renderAppIcon = (icon: string) => {
  if (icon === "🌸") {
    return (
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        fontSize: "inherit",
        lineHeight: 1,
      }}>
        🌸
      </div>
    );
  }
  // Custom fallback for Lemon logo: yellow square with white flower
  if (icon === "lemon" || icon === "Lemon") {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ borderRadius: "20%" }}>
          <rect width="100" height="100" rx="20" fill="#FFC93C" />
          <circle cx="50" cy="50" r="12" fill="#FFF" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 50 + 26 * Math.cos(rad);
            const cy = 50 + 26 * Math.sin(rad);
            return <circle key={angle} cx={cx} cy={cy} r="10" fill="#FFF" />;
          })}
        </svg>
      </div>
    );
  }
  return <span style={{ fontSize: "inherit", lineHeight: 1 }}>{icon}</span>;
};

/**
 * VoiceInputBar — HeyLemon-style scene showing the voice input interface.
 * Dark pill bar slides up from bottom with typewriter text.
 * Warm peach/orange gradient fills the content zone.
 */
export const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  headline = "Control your entire computer\nwithout touching it.",
  sectionLabel = "Describe your task",
  promptText = "Can you please summarize this for me?",
  appIcon = "🌸",
  headlineStart = 5,
  labelStart = 10,
  barStart = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const BLACK_ZONE = height * 0.42;
  const WHITE_ZONE = height * 0.43;

  const headlineWords = headline.replace(/\n/g, " \n ").split(" ");

  // Section label fade
  const labelOpacity = interpolate(frame - labelStart, [0, 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(
    spring({ frame: frame - labelStart, fps, config: SPRING_PRESETS.smooth, durationInFrames: 26 }),
    [0, 1], [20, 0]
  );

  // Bar slide up
  const barSpring = spring({
    frame: frame - barStart,
    fps,
    config: { damping: 18, mass: 0.7, stiffness: 130 },
    durationInFrames: 32,
  });
  const barY = interpolate(barSpring, [0, 1], [60, 0]);
  const barOpacity = interpolate(frame - barStart, [0, 16], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter effect
  const typingStart = barStart + 12;
  const charsVisible = Math.max(0, Math.floor((frame - typingStart) * 2.2));
  const displayText = promptText.slice(0, charsVisible);

  // Cursor blink
  const cursorVisible = frame % 18 < 10;

  // Waveform bars animation
  const waveHeights = [0.4, 0.9, 0.6, 1.0, 0.7, 0.5, 0.85, 0.65, 0.45, 0.8];

  // Animate the background glow behind the bar (pulse effect)
  const glowPulse = 0.94 + 0.06 * Math.sin(frame * 0.12);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* ── Black top zone (persistent header) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: BLACK_ZONE,
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: "52px 48px 0",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#000" }}>⑥</div>
          <span style={{ fontSize: 28, fontWeight: 500, color: "#fff", fontFamily: "Inter, sans-serif" }}>techinsixty</span>
        </div>

        {/* Headline */}
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

      {/* ── White / warm bottom zone ── */}
      <div
        style={{
          position: "absolute",
          top: BLACK_ZONE,
          left: 0,
          right: 0,
          height: WHITE_ZONE,
          backgroundColor: "#fff8f0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        {/* Warm gradient bar across middle */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: 0,
            right: 0,
            height: 110,
            background: "linear-gradient(90deg, rgba(255,180,80,0.55) 0%, rgba(255,140,60,0.45) 50%, rgba(255,160,80,0.55) 100%)",
            pointerEvents: "none",
            transform: `scaleY(${glowPulse})`,
            opacity: 0.9,
          }}
        />

        {/* Section label */}
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
            willChange: "transform, opacity",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#111",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.5px",
            }}
          >
            {sectionLabel}
          </span>
        </div>

        {/* Voice input pill bar */}
        <div
          style={{
            opacity: barOpacity,
            transform: `translateY(${barY}px)`,
            willChange: "transform, opacity",
            zIndex: 2,
            width: "82%",
            maxWidth: 540,
          }}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 20,
              padding: "18px 22px 18px 22px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.14)",
            }}
          >
            {/* Top row: icon + waveform */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {renderAppIcon(appIcon)}
              </div>
              {/* Waveform */}
              <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
                {waveHeights.map((h, i) => {
                  const animOffset = (frame * 0.15 + i * 0.6) % (Math.PI * 2);
                  const animH = h * (0.7 + 0.3 * Math.sin(animOffset));
                  return (
                    <div
                      key={i}
                      style={{
                        width: 3,
                        height: 28 * animH,
                        backgroundColor: "#ffffff",
                        borderRadius: 2,
                        opacity: 0.85,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Typing text */}
            <div
              style={{
                fontSize: 17,
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                lineHeight: 1.5,
                minHeight: 26,
              }}
            >
              {displayText}
              {cursorVisible && charsVisible < promptText.length && (
                <span style={{ display: "inline-block", width: 2, height: 18, backgroundColor: "#fff", marginLeft: 2, verticalAlign: "text-bottom" }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom black strip ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: height - BLACK_ZONE - WHITE_ZONE, backgroundColor: "#000" }} />
    </AbsoluteFill>
  );
};
