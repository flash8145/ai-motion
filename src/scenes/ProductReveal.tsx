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
import { useTheme } from "../theme/ThemeProvider";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { EASINGS } from "../animation/easings";
import { GLOW_BORDER_GRADIENT } from "../theme/GeminiFlowTheme";

export interface ProductRevealProps {
  /** The URL or source path of the product image/mockup */
  image: string;
  /** Main title text */
  title: string;
  /** Optional subtitle below the main title */
  subtitle?: string;
  /** Frame at which the entire sequence starts. Default: 0 */
  startFrame?: number;
  /** Frame offset at which title reveals. Default: 10 */
  titleStartFrame?: number;
  /** Frame offset at which subtitle reveals. Default: 20 */
  subtitleStartFrame?: number;
  /** Frame offset at which the image starts scaling in. Default: 30 */
  imageStartFrame?: number;
  /** Frame offset at which the light sweep triggers. Default: 65 */
  sweepStartFrame?: number;
  /** Duration of the light sweep animation in frames. Default: 30 */
  sweepDurationInFrames?: number;
  /** Custom aspect ratio for the mockup card. Default: "16 / 10" */
  aspectRatio?: string;
}

/**
 * ProductReveal — A premium SaaS-style product launch scene.
 *
 * Renders a full-screen scene with:
 * - Fluid radial gradients & moving blurred orbs in background
 * - Staggered title and subtitle reveals via AnimatedText
 * - A 3D Mockup Card containing the hero image that scales up from depth via spring motion
 * - A bright, organic light sweep glinting across the mockup card
 * - Parallax depth float/drift after the card lands
 */
export const ProductReveal: React.FC<ProductRevealProps> = ({
  image,
  title,
  subtitle,
  startFrame = 0,
  titleStartFrame = 10,
  subtitleStartFrame = 20,
  imageStartFrame = 30,
  sweepStartFrame = 65,
  sweepDurationInFrames = 30,
  aspectRatio = "16 / 10",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = useTheme();

  const relativeFrame = frame - startFrame;

  // ─── BACKGROUND ANIMATION (Orbs) ───────────────────────────────
  // We'll create floating orbital light globs that drift in the background
  const time = relativeFrame / fps;
  const orb1X = interpolate(Math.sin(time * 0.4), [-1, 1], [20, 40]);
  const orb1Y = interpolate(Math.cos(time * 0.3), [-1, 1], [30, 50]);
  const orb2X = interpolate(Math.cos(time * 0.5), [-1, 1], [60, 80]);
  const orb2Y = interpolate(Math.sin(time * 0.4), [-1, 1], [50, 70]);

  // ─── IMAGE ENTRANCE (SPRING 3D REVEAL) ─────────────────────────
  const imageFrame = relativeFrame - imageStartFrame;

  // Entrance spring with custom overshoot settings
  const entrySpring = spring({
    frame: imageFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 85,
      mass: 0.8,
    },
    durationInFrames: 45,
  });

  // Interpolations for the 3D card entrance
  const cardScale = interpolate(entrySpring, [0, 1], [0.65, 1]);
  const cardRotateX = interpolate(entrySpring, [0, 1], [24, 0]);
  const cardRotateY = interpolate(entrySpring, [0, 1], [-18, 0]);
  const cardTranslateY = interpolate(entrySpring, [0, 1], [180, 0]);
  const cardTranslateZ = interpolate(entrySpring, [0, 1], [-200, 0]);
  const cardOpacity = interpolate(imageFrame, [0, 15], [0, 1], {
    easing: Easing.bezier(...EASINGS.easeOutQuart),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── ORGANIC CAMERA FLOAT (HOVER) ──────────────────────────────
  // Subtle periodic floating movement after the card completes its entrance
  const floatActive = interpolate(imageFrame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const floatY = Math.sin(time * Math.PI * 0.6) * 6 * floatActive;
  const floatRotateX = Math.cos(time * Math.PI * 0.4) * 0.8 * floatActive;
  const floatRotateY = Math.sin(time * Math.PI * 0.5) * 1.2 * floatActive;

  // ─── LIGHT SWEEP EFFECT ─────────────────────────────────────────
  const sweepFrame = relativeFrame - sweepStartFrame;
  const sweepProgress = interpolate(
    sweepFrame,
    [0, sweepDurationInFrames],
    [0, 1],
    {
      easing: Easing.bezier(0.25, 1, 0.5, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Sweep goes from left (-150%) to right (+150%)
  const sweepTranslateX = interpolate(sweepProgress, [0, 1], [-150, 150]);
  const sweepOpacity = interpolate(
    sweepFrame,
    [0, 5, sweepDurationInFrames - 5, sweepDurationInFrames],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ─── MOCKUP FALLBACK (if image is missing or empty) ─────────────
  const hasImage = image && image.trim().length > 0;
  const placeholderGradient = `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.background} 100%)`;

  // Dynamic responsive width configuration
  const cardWidth = Math.min(1080, width - 160);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* ─── Animated Parallax Background ─── */}
      <GradientBackground opacity={0.4} />

      {/* Floating Ambient Glowing Lights */}
      <div
        style={{
          position: "absolute",
          top: `${orb1Y}%`,
          left: `${orb1X}%`,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.primary}22 0%, transparent 70%)`,
          filter: "blur(80px)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${orb2Y}%`,
          left: `${orb2X}%`,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.secondary}1a 0%, transparent 70%)`,
          filter: "blur(90px)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      <NoiseTexture opacity={0.015} />

      {/* ─── Main Scene Layout ─── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 40px 80px 40px",
          zIndex: 10,
        }}
      >
        {/* Header container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center",
            width: "100%",
            maxWidth: 800,
          }}
        >
          <AnimatedText
            text={title}
            splitBy="words"
            staggerFrames={3}
            startFrame={startFrame + titleStartFrame}
            fontSize={52}
            fontWeight={800}
            lineHeight={1.15}
            isHeading
          />

          {subtitle && (
            <AnimatedText
              text={subtitle}
              splitBy="words"
              staggerFrames={2}
              startFrame={startFrame + subtitleStartFrame}
              fontSize={20}
              fontWeight={400}
              color={theme.colors.mutedText}
              lineHeight={1.5}
              maxWidth={640}
              isHeading={false}
            />
          )}
        </div>

        {/* 3D Card Container (Perspective Wrapper) */}
        <div
          style={{
            perspective: 1200,
            width: cardWidth,
            aspectRatio,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            maxHeight: height - 320,
            marginTop: 40,
          }}
        >
          {/* Mockup Surface (animated) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              opacity: cardOpacity,
              transform: `translateY(${cardTranslateY + floatY}px) scale(${cardScale}) rotateX(${cardRotateX + floatRotateX}deg) rotateY(${cardRotateY + floatRotateY}deg) translateZ(${cardTranslateZ}px)`,
              transformStyle: "preserve-3d",
              willChange: "transform, opacity",
              borderRadius: theme.borderRadius,
              boxShadow: `0 40px 100px rgba(0, 0, 0, 0.65), 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.surface,
              overflow: "hidden",
            }}
          >
            {/* Ambient Card Border Glow (Stripe/Linear style) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: theme.borderRadius,
                border: "2px solid transparent",
                backgroundImage: theme.glassmorphism ? GLOW_BORDER_GRADIENT : undefined,
                backgroundOrigin: "border-box",
                backgroundClip: "border-box",
                maskImage: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                WebkitMaskImage: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "destination-out",
                opacity: 0.25,
                pointerEvents: "none",
                zIndex: 5,
              }}
            />

            {/* Inner Sheen / Reflection */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
                pointerEvents: "none",
                borderRadius: theme.borderRadius,
                zIndex: 2,
              }}
            />

            {/* Product Mockup Render */}
            <AbsoluteFill style={{ overflow: "hidden", borderRadius: theme.borderRadius }}>
              {hasImage ? (
                <Img
                  src={image}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                /* Premium SaaS Mockup Fallback UI */
                <AbsoluteFill
                  style={{
                    background: placeholderGradient,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Mock Browser Title Bar */}
                  <div
                    style={{
                      height: 38,
                      backgroundColor: `${theme.colors.background}bb`,
                      borderBottom: `1px solid ${theme.colors.border}`,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 16px",
                      gap: 6,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#FF5F57" }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#FEBC2E" }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#28C840" }} />
                    <div
                      style={{
                        marginLeft: 16,
                        height: 20,
                        flex: 1,
                        maxWidth: 320,
                        backgroundColor: "rgba(255,255,255,0.04)",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 8px",
                      }}
                    >
                      <div style={{ fontSize: 9, color: theme.colors.mutedText, fontFamily: theme.resolvedFonts.mono, opacity: 0.6 }}>
                        https://app.productreveal.io
                      </div>
                    </div>
                  </div>

                  {/* Mock content showing charts and elements */}
                  <div style={{ display: "flex", flex: 1, padding: 20, gap: 16 }}>
                    {/* Mock Sidebar */}
                    <div
                      style={{
                        width: 140,
                        backgroundColor: "rgba(255,255,255,0.02)",
                        borderRadius: theme.borderRadius * 0.4,
                        border: `1px solid ${theme.colors.border}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        padding: 12,
                      }}
                    >
                      <div style={{ height: 16, width: "70%", backgroundColor: theme.colors.primary, opacity: 0.3, borderRadius: 3 }} />
                      <div style={{ height: 12, width: "90%", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3 }} />
                      <div style={{ height: 12, width: "80%", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3 }} />
                      <div style={{ height: 12, width: "85%", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3 }} />
                      <div style={{ height: 12, width: "60%", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3 }} />
                    </div>

                    {/* Mock Main Section */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Top metrics row */}
                      <div style={{ display: "flex", gap: 12, height: "40%" }}>
                        <div
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(255,255,255,0.02)",
                            borderRadius: theme.borderRadius * 0.4,
                            border: `1px solid ${theme.colors.border}`,
                            padding: 12,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ fontSize: 10, color: theme.colors.mutedText }}>Monthly Revenue</div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.primary }}>$142,380</div>
                        </div>
                        <div
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(255,255,255,0.02)",
                            borderRadius: theme.borderRadius * 0.4,
                            border: `1px solid ${theme.colors.border}`,
                            padding: 12,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ fontSize: 10, color: theme.colors.mutedText }}>Conversion Rate</div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.secondary }}>4.82%</div>
                        </div>
                      </div>

                      {/* Large chart mock */}
                      <div
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(255,255,255,0.02)",
                          borderRadius: theme.borderRadius * 0.4,
                          border: `1px solid ${theme.colors.border}`,
                          padding: 16,
                          position: "relative",
                          display: "flex",
                          alignItems: "flex-end",
                          gap: 8,
                        }}
                      >
                        {/* Mock chart bars */}
                        <div style={{ height: "40%", width: 20, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "3px 3px 0 0" }} />
                        <div style={{ height: "60%", width: 20, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "3px 3px 0 0" }} />
                        <div style={{ height: "55%", width: 20, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "3px 3px 0 0" }} />
                        <div style={{ height: "85%", width: 20, backgroundColor: theme.colors.primary, opacity: 0.8, borderRadius: "3px 3px 0 0" }} />
                        <div style={{ height: "70%", width: 20, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "3px 3px 0 0" }} />
                        <div style={{ height: "95%", width: 20, backgroundColor: theme.colors.secondary, opacity: 0.8, borderRadius: "3px 3px 0 0" }} />
                      </div>
                    </div>
                  </div>
                </AbsoluteFill>
              )}
            </AbsoluteFill>

            {/* ─── Light Sweep Overlay ─── */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                transform: `translateX(${sweepTranslateX}%)`,
                opacity: sweepOpacity,
                background: "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.0) 40%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0.0) 60%, transparent 70%)",
                mixBlendMode: "overlay",
                pointerEvents: "none",
                zIndex: 10,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
