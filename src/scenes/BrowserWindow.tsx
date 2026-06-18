import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  OffthreadVideo,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";
import { resolveAssetUrl } from "../utils/assetLoader";

interface BrowserWindowProps {
  /** The user's real product asset. */
  mediaSrc?: string;
  /** "image" (default) or "video". Video uses OffthreadVideo (render-safe). */
  mediaType?: "image" | "video";
  /** Address-bar text. */
  url?: string;
  /** Chrome style. Default "dark". */
  variant?: "light" | "dark";
  backgroundColor?: string;
  /** Fraction of canvas width the window occupies. Default 0.8 */
  widthFraction?: number;
  /** For tall screenshots: scroll from→to as % of image height over the scene. */
  scrollFrom?: number;
  scrollTo?: number;
  scrollStart?: number;
  scrollEnd?: number;
  startFrame?: number;
}

/**
 * BrowserWindow — premium browser chrome that FRAMES the user's own product
 * screenshot or screen recording. This is the framing primitive: the point is
 * to make the user's real UI look great (and give cursor overlays a surface to
 * drive), not to fake a product.
 */
export const BrowserWindow: React.FC<BrowserWindowProps> = ({
  mediaSrc,
  mediaType = "image",
  url = "app.yourproduct.com",
  variant = "dark",
  backgroundColor,
  widthFraction = 0.8,
  scrollFrom = 0,
  scrollTo = 0,
  scrollStart = 20,
  scrollEnd,
  startFrame = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, durationInFrames } = useVideoConfig();
  const theme = useTheme();

  const dark = variant === "dark";
  const chromeBg = dark ? "#1e1e22" : "#ECECEE";
  const barBg = dark ? "#2a2a30" : "#FFFFFF";
  const barText = dark ? "#c8c8d0" : "#4a4a52";

  // Entrance.
  const s = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 32,
  });
  const enterY = interpolate(s, [0, 1], [60, 0]);
  const scale = interpolate(s, [0, 1], [0.94, 1]);
  const opacity = interpolate(frame - startFrame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scroll (image only).
  const scroll = interpolate(
    frame,
    [scrollStart, scrollEnd ?? durationInFrames - 10],
    [scrollFrom, scrollTo],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Resolve remote URLs as-is and local public/ paths via staticFile.
  const resolvedSrc = mediaSrc ? resolveAssetUrl(mediaSrc) : undefined;

  const winW = width * widthFraction;
  const winH = winW * 0.6;
  const barH = Math.max(36, winH * 0.085);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* soft backdrop glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${theme.colors.primary}22, transparent 60%)`,
        }}
      />
      <div
        style={{
          width: winW,
          height: winH,
          transform: `translateY(${enterY}px) scale(${scale})`,
          opacity,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: chromeBg,
          boxShadow: "0 40px 90px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.25)",
          border: `1px solid ${dark ? "#000000" : "#d0d0d6"}`,
          willChange: "transform, opacity",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: barH,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 16px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div
                key={c}
                style={{ width: 13, height: 13, borderRadius: "50%", backgroundColor: c }}
              />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              height: barH * 0.56,
              backgroundColor: barBg,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: barText,
              fontFamily: theme.resolvedFonts.body,
              fontSize: Math.max(13, barH * 0.32),
            }}
          >
            <span style={{ opacity: 0.6 }}>🔒</span>
            {url}
          </div>
        </div>

        {/* Content viewport */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: winH - barH,
            overflow: "hidden",
            backgroundColor: dark ? "#0d0d10" : "#ffffff",
          }}
        >
          {resolvedSrc ? (
            mediaType === "video" ? (
              <OffthreadVideo
                src={resolvedSrc}
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Img
                src={resolvedSrc}
                style={{
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `translateY(${-scroll}%)`,
                  willChange: "transform",
                }}
              />
            )
          ) : (
            // No asset supplied — neutral placeholder prompting the user.
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.mutedText,
                fontFamily: theme.resolvedFonts.body,
                fontSize: 22,
              }}
            >
              Your product screenshot or recording
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
