import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
  Img,
} from "remotion";
import { SPRING_PRESETS } from "../animation/springs";

interface ScreenRecordingMockupProps {
  headline?: string;
  /** "macbook" or "iphone" */
  deviceType?: "macbook" | "iphone";
  /** URL or staticFile path to the screenshot */
  screenshotSrc?: string;
  /** Text typed in the voice bar */
  voiceText?: string;
  /** Tint color of the gradient strip behind the bar */
  barGradientColor?: string;
  screenshotStart?: number;
  barStart?: number;
  headlineStart?: number;
}

/**
 * ScreenRecordingMockup — Shows the actual app in a device frame
 * (MacBook or iPhone) with a floating dark voice bar at the top.
 * Warm peach gradient strip behind the bar mimics the Lemon UI style.
 */
export const ScreenRecordingMockup: React.FC<ScreenRecordingMockupProps> = ({
  headline = "Control your entire computer\nwithout touching it.",
  screenshotSrc,
  voiceText = "Hey Lemon, I forgot to do the report he's asking",
  barGradientColor = "#ff9a5c",
  screenshotStart = 8,
  barStart = 18,
  headlineStart = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const BLACK_ZONE = height * 0.42;
  const WHITE_ZONE = height * 0.43;
  const headlineWords = headline.replace(/\n/g, " \n ").split(" ");

  // Device frame entrance
  const deviceSpring = spring({
    frame: frame - screenshotStart,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 32,
  });
  const deviceY = interpolate(deviceSpring, [0, 1], [40, 0]);
  const deviceOpacity = interpolate(frame - screenshotStart, [0, 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Voice bar slide
  const barSpring = spring({
    frame: frame - barStart,
    fps,
    config: { damping: 16, mass: 0.6, stiffness: 120 },
    durationInFrames: 28,
  });
  const barY = interpolate(barSpring, [0, 1], [-28, 0]);
  const barOpacity = interpolate(frame - barStart, [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter for voice bar text
  const typingStart = barStart + 8;
  const charsVisible = Math.max(0, Math.floor((frame - typingStart) * 2.5));
  const displayText = voiceText.slice(0, charsVisible);
  const cursorVisible = frame % 18 < 10;

  // Waveform
  const waveHeights = [0.5, 0.85, 0.65, 1.0, 0.75, 0.55, 0.9, 0.6];

  // MacBook frame dimensions inside white zone
  const mbWidth = width * 0.88;
  const mbHeight = mbWidth * 0.62;
  const mbX = (width - mbWidth) / 2;
  const mbY = (WHITE_ZONE - mbHeight) / 2;
  const screenInset = mbWidth * 0.03;
  const titleBarH = mbHeight * 0.05;

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
          backgroundColor: "#f5f5f5",
          overflow: "hidden",
        }}
      >
        {/* MacBook frame */}
        <div
          style={{
            position: "absolute",
            left: mbX,
            top: mbY,
            width: mbWidth,
            height: mbHeight,
            transform: `translateY(${deviceY}px)`,
            opacity: deviceOpacity,
            willChange: "transform, opacity",
          }}
        >
          {/* Outer shell */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#d0d0d0",
              borderRadius: mbWidth * 0.018,
              padding: screenInset,
              boxSizing: "border-box",
              boxShadow: "0 16px 48px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {/* Screen area */}
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#111",
                borderRadius: mbWidth * 0.008,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* macOS menu bar */}
              <div
                style={{
                  height: titleBarH,
                  backgroundColor: "#1e1e1e",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 10,
                  gap: 6,
                  flexShrink: 0,
                  borderBottom: "1px solid #333",
                }}
              >
                {["#ff5f57", "#febc2e", "#28c840"].map((c, ci) => (
                  <div key={ci} style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c }} />
                ))}
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: "#888", fontFamily: "Inter, sans-serif", paddingRight: 10 }}>
                  Mon Jun 5  9:41 AM
                </span>
              </div>

              {/* Screen content */}
              <div style={{ flex: 1, width: "100%", height: "calc(100% - " + titleBarH + "px)", backgroundColor: "#1a1a2e", backgroundImage: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {screenshotSrc ? (
                  <Img src={screenshotSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ color: "#ffffff44", fontSize: 14, fontFamily: "Inter, sans-serif" }}>App Screenshot</span>
                )}
              </div>

              {/* Floating voice bar overlay inside screen */}
              <div
                style={{
                  position: "absolute",
                  top: titleBarH + 8,
                  left: "18%",
                  right: "18%",
                  transform: `translateY(${barY}px)`,
                  opacity: barOpacity,
                  willChange: "transform, opacity",
                  zIndex: 10,
                }}
              >
                {/* Gradient strip behind bar */}
                <div
                  style={{
                    position: "absolute",
                    top: -6,
                    left: -20,
                    right: -20,
                    height: "200%",
                    background: `linear-gradient(90deg, transparent 0%, ${barGradientColor}55 30%, ${barGradientColor}55 70%, transparent 100%)`,
                    borderRadius: 12,
                    pointerEvents: "none",
                  }}
                />
                {/* Dark pill bar */}
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: 12,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    position: "relative",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🌸</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, color: "#ffffff", fontFamily: "Inter, sans-serif", lineHeight: 1.45, fontWeight: 400 }}>
                      {displayText}
                      {cursorVisible && charsVisible < voiceText.length && (
                        <span style={{ display: "inline-block", width: 1.5, height: 13, backgroundColor: "#fff", marginLeft: 1, verticalAlign: "text-bottom" }} />
                      )}
                    </span>
                  </div>
                  {/* Waveform */}
                  <div style={{ display: "flex", alignItems: "center", gap: 2, height: 20, flexShrink: 0 }}>
                    {waveHeights.map((h, wi) => {
                      const animOffset = (frame * 0.15 + wi * 0.5) % (Math.PI * 2);
                      const animH = h * (0.6 + 0.4 * Math.sin(animOffset));
                      return <div key={wi} style={{ width: 2.5, height: 20 * animH, backgroundColor: "#fff", borderRadius: 2, opacity: 0.8 }} />;
                    })}
                  </div>
                </div>
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
