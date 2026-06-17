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

interface AppIcon {
  emoji: string;
  bg: string;
  label?: string;
}

interface AppIconOrbitProps {
  headline?: string;
  sectionHeadline?: string;
  icons?: AppIcon[];
  iconsStart?: number;
  headlineStart?: number;
  labelStart?: number;
}

const DEFAULT_ICONS: AppIcon[] = [
  { emoji: "N", bg: "#fff", label: "Notion" },
  { emoji: "📧", bg: "#EA4335", label: "Gmail" },
  { emoji: "🔵", bg: "#4285F4", label: "Chrome" },
  { emoji: "✦", bg: "#000", label: "Linear" },
  { emoji: "🤖", bg: "#10a37f", label: "ChatGPT" },
  { emoji: "△", bg: "#fff", label: "Vercel" },
  { emoji: "📁", bg: "#4285F4", label: "Drive" },
  { emoji: "#", bg: "#4A154B", label: "Slack" },
  { emoji: "📅", bg: "#1a73e8", label: "Calendar" },
  { emoji: "💬", bg: "#25D366", label: "Messages" },
];

/**
 * AppIconOrbit — Icons arranged in a circle, each one dropping in
 * with a staggered 3D rotateX + scale spring entrance.
 * Center shows a text label like "Lemon works everywhere you do".
 */
export const AppIconOrbit: React.FC<AppIconOrbitProps> = ({
  headline = "Control your entire computer\nwithout touching it.",
  sectionHeadline = "Lemon works everywhere\nyou do",
  icons = DEFAULT_ICONS,
  iconsStart = 10,
  headlineStart = 5,
  labelStart = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const BLACK_ZONE = height * 0.42;
  const WHITE_ZONE = height * 0.43;
  const headlineWords = headline.replace(/\n/g, " \n ").split(" ");

  // Center of the orbit in the white zone
  const orbitCenterX = width / 2;
  const orbitCenterY = WHITE_ZONE / 2;
  const orbitRadius = Math.min(WHITE_ZONE * 0.36, 155);
  const iconSize = 72;

  // Section headline
  const labelOpacity = interpolate(frame - labelStart, [0, 20], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* ── Black top zone ── */}
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
          position: "absolute",
          top: BLACK_ZONE,
          left: 0,
          right: 0,
          height: WHITE_ZONE,
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* Center label */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%)`,
            textAlign: "center",
            opacity: labelOpacity,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {sectionHeadline.split("\n").map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#111",
                fontFamily: "Georgia, serif",
                lineHeight: 1.35,
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Orbiting icons */}
        {icons.map((icon, i) => {
          const totalIcons = icons.length;
          const angle = (i / totalIcons) * Math.PI * 2 - Math.PI / 2;
          const x = orbitCenterX + Math.cos(angle) * orbitRadius - iconSize / 2;
          const y = orbitCenterY + Math.sin(angle) * orbitRadius - iconSize / 2;

          const delay = iconsStart + i * 5;
          const iconSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, mass: 0.55, stiffness: 130 },
            durationInFrames: 30,
          });

          const scale = interpolate(iconSpring, [0, 1], [0.2, 1]);
          const rotateX = interpolate(iconSpring, [0, 1], [-40, 0]);
          const opacity = interpolate(frame - delay, [0, 14], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: iconSize,
                height: iconSize,
                borderRadius: 16,
                backgroundColor: icon.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 900,
                color: icon.bg === "#fff" ? "#000" : "#fff",
                fontFamily: "Inter, sans-serif",
                boxShadow: "0 6px 24px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08)",
                border: icon.bg === "#fff" ? "1px solid #e5e5e5" : "none",
                transform: `scale(${scale}) perspective(600px) rotateX(${rotateX}deg)`,
                opacity,
                willChange: "transform, opacity",
                zIndex: 1,
              }}
            >
              {icon.emoji}
            </div>
          );
        })}
      </div>

      {/* ── Bottom black strip ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: height - BLACK_ZONE - WHITE_ZONE, backgroundColor: "#000" }} />
    </AbsoluteFill>
  );
};
