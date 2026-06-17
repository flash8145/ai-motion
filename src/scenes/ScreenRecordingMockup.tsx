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
  subHeadline?: string;
  appIcon?: string;
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

const MockAppUI: React.FC<{ device: "macbook" | "iphone" }> = ({ device }) => {
  const isMac = device === "macbook";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#111115",
        color: "#e1e1e6",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: isMac ? "row" : "column",
        fontSize: isMac ? 11 : 8,
        overflow: "hidden",
      }}
    >
      {/* Sidebar (MacBook only) */}
      {isMac && (
        <div
          style={{
            width: "24%",
            height: "100%",
            backgroundColor: "#16161a",
            borderRight: "1px solid #282830",
            padding: "12px",
            paddingTop: 60, // Clear the voice bar area
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            textAlign: "left",
          }}
        >
          <div style={{ fontWeight: 700, color: "#fff", fontSize: 12, marginBottom: 4 }}>Workspace</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ color: "#ff9a5c", fontWeight: 600 }}># research-doc</div>
            <div style={{ opacity: 0.6 }}># general</div>
            <div style={{ opacity: 0.6 }}># project-notes</div>
          </div>
          <div style={{ marginTop: "auto", opacity: 0.4 }}>Lemon v1.0</div>
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: isMac ? "24px" : "12px",
          paddingTop: isMac ? 60 : 36, // Shift content down below voice bar!
          display: "flex",
          flexDirection: "column",
          gap: isMac ? 12 : 6,
          boxSizing: "border-box",
          overflow: "hidden",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h3 style={{ margin: 0, fontSize: isMac ? 14 : 10, fontWeight: 700, color: "#fff" }}>
            AI Search Visibility Report
          </h3>
          <span style={{ fontSize: isMac ? 9 : 7, opacity: 0.4 }}>Last edited 2m ago by Lemon</span>
        </div>
        
        <div style={{ height: "1px", backgroundColor: "#282830", width: "100%" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 6, opacity: 0.85, lineHeight: 1.4 }}>
          <div>
            <strong>Executive Summary:</strong>
          </div>
          <div>
            As search engine algorithms shift from traditional page links to AI-synthesized responses, maximizing brand visibility in LLM queries is paramount.
          </div>
          {isMac && (
            <>
              <div style={{ marginTop: 4 }}>
                <strong>Key Action Items:</strong>
              </div>
              <div style={{ paddingLeft: 8 }}>
                • Implement clean JSON-LD schema markup.<br />
                • Focus content on high-intent natural language questions.<br />
                • Build structured tables for comparative feature indexing.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tab Bar (iPhone only) */}
      {!isMac && (
        <div
          style={{
            height: 32,
            backgroundColor: "#16161a",
            borderTop: "1px solid #282830",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            fontSize: 7,
            color: "#888",
            paddingBottom: 2,
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#ff9a5c", fontWeight: 600 }}>Docs</span>
          <span>Search</span>
          <span>Settings</span>
        </div>
      )}
    </div>
  );
};

export const ScreenRecordingMockup: React.FC<ScreenRecordingMockupProps> = ({
  headline = "Control your entire computer\nwithout touching it.",
  subHeadline,
  appIcon = "🌸",
  deviceType = "macbook",
  screenshotSrc,
  voiceText = "Hey Lemon, I forgot to do the report he's asking for",
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

  // Device sizes and vertical layout constraints
  const isMac = deviceType === "macbook";

  // MacBook metrics
  const mbWidth = width * 0.88;
  const mbHeight = mbWidth * 0.62;
  const mbX = (width - mbWidth) / 2;
  const mbY = (WHITE_ZONE - mbHeight) / 2;
  const screenInset = mbWidth * 0.03;
  const titleBarH = mbHeight * 0.05;

  // iPhone metrics: constraint to WHITE_ZONE height
  const maxIpHeight = WHITE_ZONE * 0.84;
  const ipHeight = maxIpHeight;
  const ipWidth = ipHeight / 2.16;
  const ipX = (width - ipWidth) / 2;
  const ipY = (WHITE_ZONE - ipHeight) / 2;
  const ipScreenInset = ipWidth * 0.045;
  const ipStatusBarH = ipHeight * 0.055;
  const ipBorderRadius = ipWidth * 0.12;

  // Select metrics based on active device
  const devX = isMac ? mbX : ipX;
  const devY = isMac ? mbY : ipY;
  const devWidth = isMac ? mbWidth : ipWidth;
  const devHeight = isMac ? mbHeight : ipHeight;
  const devScreenInset = isMac ? screenInset : ipScreenInset;
  const devTitleBarH = isMac ? titleBarH : ipStatusBarH;

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

  // Voice bar slide entrance
  const barSpring = spring({
    frame: frame - barStart,
    fps,
    config: { damping: 16, mass: 0.6, stiffness: 120 },
    durationInFrames: 28,
  });
  const barY = interpolate(barSpring, [0, 1], [-20, 0]);
  const barOpacity = interpolate(frame - barStart, [0, 14], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sub-Headline spring reveal
  const subHeadlineSpring = spring({
    frame: frame - headlineStart,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 25,
  });
  const subHeadlineYOffset = interpolate(subHeadlineSpring, [0, 1], [12, 0]);
  const subHeadlineOpacity = interpolate(frame - headlineStart, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter for voice bar text
  const typingStart = barStart + 8;
  const charsVisible = Math.max(0, Math.floor((frame - typingStart) * 2.5));
  const displayText = voiceText.slice(0, charsVisible);
  const cursorVisible = frame % 18 < 10;

  // Waveform heights
  const waveHeights = [0.5, 0.85, 0.65, 1.0, 0.75, 0.55, 0.9, 0.6];

  // Dynamic bar scaling factors to fit narrow mobile layouts
  const barFontSize = isMac ? 13 : 8;
  const barIconSize = isMac ? 15 : 10;
  const barPadding = isMac ? "10px 14px" : "6px 8px";
  const barGap = isMac ? 10 : 6;
  const barWaveH = isMac ? 20 : 12;
  const barWaveW = isMac ? 2.5 : 1.5;
  const barWaveGap = isMac ? 2 : 1;
  const barBorderRadius = isMac ? 12 : 8;

  // Animate the background glow behind the bar (pulse effect)
  const glowPulse = 0.92 + 0.08 * Math.sin(frame * 0.12);

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
        {/* Dynamic Sub-Headline */}
        {subHeadline && (
          <div
            style={{
              position: "absolute",
              top: isMac ? devY - 48 : devY - 36,
              left: 0,
              right: 0,
              textAlign: "center",
              transform: `translateY(${subHeadlineYOffset}px)`,
              opacity: subHeadlineOpacity,
              willChange: "transform, opacity",
              zIndex: 5,
            }}
          >
            <span
              style={{
                fontSize: isMac ? 28 : 20,
                fontWeight: 700,
                color: "#111",
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.5px",
              }}
            >
              {subHeadline}
            </span>
          </div>
        )}

        {/* Device frame container */}
        <div
          style={{
            position: "absolute",
            left: devX,
            top: devY,
            width: devWidth,
            height: devHeight,
            transform: `translateY(${deviceY}px)`,
            opacity: deviceOpacity,
            willChange: "transform, opacity",
          }}
        >
          {isMac ? (
            /* MacBook frame */
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#d0d0d0",
                borderRadius: mbWidth * 0.018,
                padding: devScreenInset,
                boxSizing: "border-box",
                boxShadow: "0 30px 60px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                border: "1px solid #b5b5b5",
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
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Camera notch */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: mbWidth * 0.12,
                    height: mbHeight * 0.035,
                    backgroundColor: "#1e1e1e",
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 6,
                    zIndex: 20,
                  }}
                />

                {/* macOS menu bar */}
                <div
                  style={{
                    height: devTitleBarH,
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
                    <div key={ci} style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c }} />
                  ))}
                  <div style={{ flex: 1 }} />
                  <span style={{ fontSize: 9, color: "#888", fontFamily: "Inter, sans-serif", paddingRight: 10 }}>
                    Mon Jun 5  9:41 AM
                  </span>
                </div>

                {/* Screen content */}
                <div style={{ flex: 1, width: "100%", overflow: "hidden", position: "relative" }}>
                  {screenshotSrc ? (
                    <Img src={screenshotSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <MockAppUI device="macbook" />
                  )}
                </div>

                {/* Floating voice bar overlay inside screen */}
                <div
                  style={{
                    position: "absolute",
                    top: devTitleBarH + 8,
                    left: "15%",
                    right: "15%",
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
                      left: -24,
                      right: -24,
                      height: "200%",
                      background: `linear-gradient(90deg, transparent 0%, ${barGradientColor}55 30%, ${barGradientColor}55 70%, transparent 100%)`,
                      borderRadius: 12,
                      pointerEvents: "none",
                      transform: `scale(${glowPulse})`,
                      opacity: 0.9,
                    }}
                  />
                  {/* Dark pill bar */}
                  <div
                    style={{
                      backgroundColor: "rgba(26, 26, 26, 0.85)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      borderRadius: barBorderRadius,
                      padding: barPadding,
                      display: "flex",
                      alignItems: "center",
                      gap: barGap,
                      position: "relative",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div style={{ width: barIconSize, height: barIconSize, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {renderAppIcon(appIcon)}
                    </div>
                    <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: barFontSize, color: "#ffffff", fontFamily: "Inter, sans-serif", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden" }}>
                        {displayText}
                        {cursorVisible && charsVisible < voiceText.length && (
                          <span style={{ display: "inline-block", width: 1.5, height: barFontSize, backgroundColor: "#fff", marginLeft: 1, verticalAlign: "text-bottom" }} />
                        )}
                      </span>
                    </div>
                    {/* Waveform */}
                    <div style={{ display: "flex", alignItems: "center", gap: barWaveGap, height: barWaveH, flexShrink: 0 }}>
                      {waveHeights.map((h, wi) => {
                        const animOffset = (frame * 0.15 + wi * 0.5) % (Math.PI * 2);
                        const animH = h * (0.6 + 0.4 * Math.sin(animOffset));
                        return <div key={wi} style={{ width: barWaveW, height: barWaveH * animH, backgroundColor: "#fff", borderRadius: 2, opacity: 0.85 }} />;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* iPhone titanium frame */
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#202022",
                borderRadius: ipBorderRadius,
                padding: devScreenInset,
                boxSizing: "border-box",
                boxShadow: "0 20px 50px rgba(0,0,0,0.22), 0 4px 15px rgba(0,0,0,0.15)",
                border: "2px solid #3c3c3e",
                position: "relative",
              }}
            >
              {/* Screen area */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#000",
                  borderRadius: ipBorderRadius * 0.85,
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Dynamic Island Notch */}
                <div
                  style={{
                    position: "absolute",
                    top: ipHeight * 0.024,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: ipWidth * 0.32,
                    height: ipHeight * 0.028,
                    backgroundColor: "#000",
                    borderRadius: 14,
                    zIndex: 25,
                    border: "0.5px solid rgba(255, 255, 255, 0.05)",
                  }}
                />

                {/* iPhone status bar */}
                <div
                  style={{
                    height: devTitleBarH,
                    backgroundColor: "#111115",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    boxSizing: "border-box",
                    flexShrink: 0,
                    zIndex: 20,
                  }}
                >
                  <span style={{ fontSize: 7, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>9:41</span>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <div style={{ width: 8, height: 5, border: "0.5px solid #fff", borderRadius: 1.5, position: "relative", display: "flex", alignItems: "center" }}>
                      <div style={{ width: 5, height: "100%", backgroundColor: "#fff", marginLeft: 0.5 }} />
                    </div>
                  </div>
                </div>

                {/* Screen content */}
                <div style={{ flex: 1, width: "100%", overflow: "hidden", position: "relative" }}>
                  {screenshotSrc ? (
                    <Img src={screenshotSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <MockAppUI device="iphone" />
                  )}
                </div>

                {/* Floating voice bar overlay inside iPhone screen */}
                <div
                  style={{
                    position: "absolute",
                    top: devTitleBarH + 8,
                    left: "8%",
                    right: "8%",
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
                      top: -4,
                      left: -12,
                      right: -12,
                      height: "200%",
                      background: `linear-gradient(90deg, transparent 0%, ${barGradientColor}55 30%, ${barGradientColor}55 70%, transparent 100%)`,
                      borderRadius: 8,
                      pointerEvents: "none",
                      transform: `scale(${glowPulse})`,
                      opacity: 0.9,
                    }}
                  />
                  {/* Dark pill bar */}
                  <div
                    style={{
                      backgroundColor: "rgba(26, 26, 26, 0.9)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      borderRadius: barBorderRadius,
                      padding: barPadding,
                      display: "flex",
                      alignItems: "center",
                      gap: barGap,
                      position: "relative",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08) inset",
                      border: "0.5px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div style={{ width: barIconSize, height: barIconSize, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {renderAppIcon(appIcon)}
                    </div>
                    <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: barFontSize, color: "#ffffff", fontFamily: "Inter, sans-serif", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden" }}>
                        {displayText}
                        {cursorVisible && charsVisible < voiceText.length && (
                          <span style={{ display: "inline-block", width: 1, height: barFontSize, backgroundColor: "#fff", marginLeft: 1, verticalAlign: "text-bottom" }} />
                        )}
                      </span>
                    </div>
                    {/* Waveform */}
                    <div style={{ display: "flex", alignItems: "center", gap: barWaveGap, height: barWaveH, flexShrink: 0 }}>
                      {waveHeights.map((h, wi) => {
                        const animOffset = (frame * 0.15 + wi * 0.5) % (Math.PI * 2);
                        const animH = h * (0.6 + 0.4 * Math.sin(animOffset));
                        return <div key={wi} style={{ width: barWaveW, height: barWaveH * animH, backgroundColor: "#fff", borderRadius: 1, opacity: 0.85 }} />;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom black strip ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: height - BLACK_ZONE - WHITE_ZONE, backgroundColor: "#000" }} />
    </AbsoluteFill>
  );
};
