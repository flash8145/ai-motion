import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, interpolateColors } from "remotion";
import { useTheme } from "../theme/ThemeProvider";

interface CleanCardPromoProps {
  headline?: string;
  subtitle?: string;
  cardWidth?: number;
  cardHeight?: number;
  hasBorderGlow?: boolean;
  borderGlowSpeed?: number;
  icon?: "none" | "star" | "plus" | "dots" | "circle-ring";
  iconPosition?: "top" | "left" | "right" | "orbit";
  startFrame?: number;
  themeBackground?: boolean;
  glowColor?: string;
}

export const CleanCardPromo: React.FC<CleanCardPromoProps> = ({
  headline,
  subtitle,
  cardWidth = 500,
  cardHeight = 280,
  hasBorderGlow = true,
  borderGlowSpeed = 3,
  icon = "none",
  iconPosition = "top",
  startFrame = 0,
  themeBackground = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const local = frame - startFrame;

  // Spring animation for card pop-in
  const cardSpring = spring({
    frame: local,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const cardScale = interpolate(cardSpring, [0, 1], [0.8, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // Neon border gradient rotation angle
  const angle = (frame * borderGlowSpeed) % 360;

  const resolvedPrimary = theme.colors.primary;
  const resolvedAccent = theme.colors.accent;
  const resolvedSecondary = theme.colors.secondary;

  // Icon spring entry
  const iconSpring = spring({
    frame: local - 10,
    fps,
    config: { damping: 10, stiffness: 120 },
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Render specific SVG icons
  const renderIcon = () => {
    if (icon === "none") return null;

    if (icon === "star") {
      return (
        <div style={{ transform: `scale(${iconScale}) rotate(${iconScale * 90}deg)` }}>
          <svg width="60" height="60" viewBox="-40 -40 80 80">
            <path
              d="M 0 -35 Q 0 0 35 0 Q 0 0 0 35 Q 0 0 -35 0 Q 0 0 0 -35 Z"
              fill={resolvedAccent}
              style={{
                filter: `drop-shadow(0 0 12px ${resolvedAccent})`,
              }}
            />
          </svg>
        </div>
      );
    }

    if (icon === "plus") {
      return (
        <div style={{ transform: `scale(${iconScale})` }}>
          <svg width="50" height="50" viewBox="0 0 50 50">
            {/* White plus crosshair */}
            <line x1="25" y1="5" x2="25" y2="45" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="5" y1="25" x2="45" y2="25" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="25" cy="25" r="5" fill="#FFFFFF" />
          </svg>
        </div>
      );
    }

    if (icon === "dots") {
      return (
        <div
          style={{
            transform: `scale(${iconScale})`,
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FFD60A, #FF9F0A)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(255, 159, 10, 0.5)",
          }}
        >
          <svg width="40" height="10" viewBox="0 0 40 10">
            <circle cx="8" cy="5" r="4" fill="#FFFFFF" />
            <circle cx="20" cy="5" r="4" fill="#FFFFFF" />
            <circle cx="32" cy="5" r="4" fill="#FFFFFF" />
          </svg>
        </div>
      );
    }

    return null;
  };

  // Specialized orbital circle motif rendering
  if (icon === "circle-ring" && iconPosition === "orbit") {
    const totalCircles = 8;
    const orbitRadius = 130;

    return (
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: themeBackground ? theme.colors.background : "transparent",
        }}
      >
        <div style={{ position: "relative", width: orbitRadius * 2.8, height: orbitRadius * 2.8 }}>
          {/* Central text */}
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              zIndex: 10,
            }}
          >
            {headline && (
              <h1
                style={{
                  fontFamily: theme.resolvedFonts.heading,
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme.colors.text,
                  margin: 0,
                  textAlign: "center",
                  maxWidth: 180,
                }}
              >
                {headline}
              </h1>
            )}
          </AbsoluteFill>

          {/* Orbit rings */}
          {Array.from({ length: totalCircles }).map((_, i) => {
            const circleAngle = (i * 2 * Math.PI) / totalCircles;
            const cx = orbitRadius * Math.cos(circleAngle);
            const cy = orbitRadius * Math.sin(circleAngle);

            const cSpring = spring({
              frame: local - i * 3,
              fps,
              config: { damping: 10 },
            });
            const cScale = interpolate(cSpring, [0, 1], [0, 1]);

            // Calculate active state transition smoothly without wall-clock CSS transitions
            const cycleFrames = totalCircles * 6;
            const cycleTime = local % cycleFrames;
            const targetTime = i * 6;
            
            let diff = cycleTime - targetTime;
            if (diff < -cycleFrames / 2) diff += cycleFrames;
            if (diff > cycleFrames / 2) diff -= cycleFrames;
            
            let activeVal = 0;
            if (diff >= 0 && diff < 6) {
              activeVal = spring({
                frame: diff,
                fps,
                config: { damping: 12, stiffness: 100 },
              });
            } else if (diff >= 6 && diff < 12) {
              const shrinkSpring = spring({
                frame: diff - 6,
                fps,
                config: { damping: 12, stiffness: 100 },
              });
              activeVal = interpolate(shrinkSpring, [0, 1], [1, 0]);
            } else {
              activeVal = 0;
            }

            const circleScale = cScale * (1.0 + activeVal * 0.25);
            const resolvedBorder = `${interpolate(activeVal, [0, 1], [1.5, 2.0])}px solid ${interpolateColors(
              activeVal,
              [0, 1],
              [theme.colors.border, resolvedAccent]
            )}`;
            const resolvedBg = interpolateColors(
              activeVal,
              [0, 1],
              ["transparent", resolvedAccent]
            );

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${cx}px - 25px)`,
                  top: `calc(50% + ${cy}px - 25px)`,
                  width: 50,
                  height: 50,
                  transform: `scale(${circleScale})`,
                  borderRadius: "50%",
                  border: resolvedBorder,
                  backgroundColor: resolvedBg,
                  boxShadow: activeVal > 0 ? `0 0 ${activeVal * 15}px ${resolvedAccent}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeBackground ? theme.colors.background : "transparent",
      }}
    >
      <div
        style={{
          position: "relative",
          width: cardWidth,
          height: cardHeight,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          willChange: "transform, opacity",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Glow backdrop layer */}
        {hasBorderGlow && (
          <div
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: theme.borderRadius,
              background: `linear-gradient(${angle}deg, ${resolvedPrimary}, ${resolvedAccent}, ${resolvedSecondary})`,
              filter: "blur(12px)",
              opacity: 0.6,
              zIndex: -1,
            }}
          />
        )}

        {/* Shifting neon border container */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: theme.borderRadius,
            background: hasBorderGlow
              ? `linear-gradient(${angle}deg, ${resolvedPrimary}, ${resolvedAccent}, ${resolvedSecondary})`
              : theme.colors.border,
            padding: hasBorderGlow ? 2.5 : 1, // Border width
            zIndex: 1,
          }}
        >
          {/* Inner card content */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius - 2,
              display: "flex",
              flexDirection: iconPosition === "top" ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: "24px 32px",
              boxSizing: "border-box",
            }}
          >
            {iconPosition === "top" && renderIcon()}
            {iconPosition === "left" && renderIcon()}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: iconPosition === "top" ? "center" : "flex-start",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {headline && (
                <h2
                  style={{
                    fontFamily: theme.resolvedFonts.heading,
                    fontSize: 28,
                    fontWeight: 800,
                    color: theme.colors.text,
                    margin: 0,
                    textAlign: iconPosition === "top" ? "center" : "left",
                    lineHeight: 1.2,
                  }}
                >
                  {headline}
                </h2>
              )}

              {subtitle && (
                <p
                  style={{
                    fontFamily: theme.resolvedFonts.body,
                    fontSize: 16,
                    color: theme.colors.mutedText,
                    margin: 0,
                    textAlign: iconPosition === "top" ? "center" : "left",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {iconPosition === "right" && renderIcon()}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
