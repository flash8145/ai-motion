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

interface NotificationItem {
  text: string;
  icon?: string;
}

interface NotificationStackProps {
  headline?: string;
  appName?: string;
  appTagline?: string;
  appIcon?: string;
  notifications?: NotificationItem[];
  cardsStart?: number;
  headlineStart?: number;
}

/**
 * NotificationStack — HeyLemon-style scene showing notification cards
 * staggering in from the top, with a radial yellow/warm glow behind the
 * central app logo and tagline.
 */
export const NotificationStack: React.FC<NotificationStackProps> = ({
  headline = "Control your entire computer\nwithout touching it.",
  appName = "Lemon",
  appTagline = "Turn what you say\ninto what gets done",
  appIcon = "🌸",
  notifications = [
    { text: "Done! Your email reply is ready for review.", icon: "🌸" },
    { text: "Fixed: I've rewritten your Slack message to be more concise.", icon: "🌸" },
    { text: "Found it: The report is in your Downloads folder.", icon: "🌸" },
    { text: "Search Complete: Here are your restaurant recommendations.", icon: "🌸" },
    { text: "Updated: I've saved your writing preferences.", icon: "🌸" },
  ],
  cardsStart = 10,
  headlineStart = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const BLACK_ZONE = height * 0.42;
  const WHITE_ZONE = height * 0.43;

  // Headline words
  const headlineWords = headline.replace(/\n/g, " \n ").split(" ");

  // Radial glow behind the center
  const glowOpacity = interpolate(frame - cardsStart, [0, 25], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          backgroundColor: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: "52px 48px 0",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 900,
              color: "#000",
            }}
          >
            ⑥
          </div>
          <span style={{ fontSize: 28, fontWeight: 500, color: "#fff", fontFamily: "Inter, sans-serif" }}>
            techinsixty
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
          {headlineWords.map((word, i) => {
            if (word === "\n") return <div key={`br-${i}`} style={{ width: "100%", height: 0 }} />;
            const delay = headlineStart + i * 3;
            const ws = spring({ frame: frame - delay, fps, config: SPRING_PRESETS.smooth, durationInFrames: 28 });
            return (
              <span
                key={`${word}-${i}`}
                style={{
                  display: "inline-block",
                  fontSize: 52,
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.15,
                  letterSpacing: "-1.5px",
                  transform: `translateY(${interpolate(ws, [0, 1], [32, 0])}px)`,
                  opacity: interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
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
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Warm radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,220,100,0.55) 0%, rgba(255,200,60,0.18) 45%, transparent 72%)",
            opacity: glowOpacity,
            pointerEvents: "none",
          }}
        />

        {/* Notification cards above center */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            width: "100%",
            paddingLeft: 28,
            paddingRight: 28,
            marginBottom: 18,
          }}
        >
          {notifications.slice(0, 3).map((notif, i) => {
            const delay = cardsStart + i * 8;
            const cardSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 16, mass: 0.6, stiffness: 120 },
              durationInFrames: 30,
            });
            const cardY = interpolate(cardSpring, [0, 1], [-40, 0]);
            const cardOpacity = interpolate(frame - delay, [0, 15], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: "#1a1a1a",
                  borderRadius: 50,
                  paddingLeft: 14,
                  paddingRight: 22,
                  paddingTop: 11,
                  paddingBottom: 11,
                  maxWidth: 520,
                  transform: `translateY(${cardY}px)`,
                  opacity: cardOpacity,
                  willChange: "transform, opacity",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: "#2a2a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {notif.icon ?? "🌸"}
                </div>
                <span style={{ fontSize: 16, color: "#fff", fontFamily: "Inter, sans-serif", lineHeight: 1.3, fontWeight: 400 }}>
                  {notif.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* App name + tagline center */}
        {(() => {
          const centerDelay = cardsStart + 10;
          const centerOpacity = interpolate(frame - centerDelay, [0, 18], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const centerY = interpolate(
            spring({ frame: frame - centerDelay, fps, config: SPRING_PRESETS.smooth, durationInFrames: 28 }),
            [0, 1], [16, 0]
          );
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: centerOpacity,
                transform: `translateY(${centerY}px)`,
                marginBottom: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 26, }}>{appIcon}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "Inter, sans-serif", letterSpacing: "-0.5px" }}>
                  {appName}
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                {appTagline.split("\n").map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: i === 1 ? 22 : 20,
                      fontWeight: i === 1 ? 700 : 400,
                      color: "#111",
                      fontFamily: "Georgia, serif",
                      lineHeight: 1.35,
                      fontStyle: i === 1 ? "italic" : "normal",
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Bottom notification cards */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", paddingLeft: 28, paddingRight: 28 }}>
          {notifications.slice(3).map((notif, i) => {
            const delay = cardsStart + 24 + i * 8;
            const cardSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 16, mass: 0.6, stiffness: 120 },
              durationInFrames: 30,
            });
            const cardY = interpolate(cardSpring, [0, 1], [40, 0]);
            const cardOpacity = interpolate(frame - delay, [0, 15], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: "#1a1a1a",
                  borderRadius: 50,
                  paddingLeft: 14,
                  paddingRight: 22,
                  paddingTop: 11,
                  paddingBottom: 11,
                  maxWidth: 520,
                  transform: `translateY(${cardY}px)`,
                  opacity: cardOpacity,
                  willChange: "transform, opacity",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: "#2a2a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {notif.icon ?? "🌸"}
                </div>
                <span style={{ fontSize: 16, color: "#fff", fontFamily: "Inter, sans-serif", lineHeight: 1.3, fontWeight: 400 }}>
                  {notif.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom black strip ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: height - BLACK_ZONE - WHITE_ZONE, backgroundColor: "#000" }} />
    </AbsoluteFill>
  );
};
