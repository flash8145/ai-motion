import React, { useMemo } from "react";
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
import { SPRING_PRESETS } from "../animation/springs";
import { EASINGS } from "../animation/easings";

interface AppLogoRevealProps {
  logoSrc: string;
  logoSize?: number;
  logoStartFrame?: number;
  logoGlowColor?: string;
  label?: string;
  labelColor?: string;
  labelSize?: number;
  labelStartFrame?: number;
  labelStagger?: number;
  bottomText?: string;
  bottomTextColor?: string;
  bottomTextSize?: number;
  bottomTextStartFrame?: number;
}

export const AppLogoReveal: React.FC<AppLogoRevealProps> = ({
  logoSrc,
  logoSize = 140,
  logoStartFrame = 5,
  logoGlowColor = "rgba(255,255,255,0.15)",
  label = "",
  labelColor = "#4CAF50",
  labelSize = 28,
  labelStartFrame = 25,
  labelStagger = 3,
  bottomText = "",
  bottomTextColor = "#888888",
  bottomTextSize = 22,
  bottomTextStartFrame = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Logo spring scale
  const logoSpring = spring({
    frame: frame - logoStartFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 35,
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);
  const logoOpacity = interpolate(
    frame - logoStartFrame,
    [0, 15],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Label character reveal
  const labelChars = useMemo(() => label.split(""), [label]);

  // Bottom text fade-in
  const bottomTextOpacity = interpolate(
    frame,
    [bottomTextStartFrame, bottomTextStartFrame + 10],
    [0, 1],
    {
      easing: Easing.bezier(...EASINGS.easeOutQuart),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Logo + label centered */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        {/* Logo image */}
        <div
          style={{
            width: logoSize,
            height: logoSize,
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            boxShadow: `0 0 40px 10px ${logoGlowColor}`,
            willChange: "transform, opacity",
          }}
        >
          <Img
            src={logoSrc}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Label character-by-character reveal */}
        {label && (
          <div style={{ display: "flex", flexDirection: "row" }}>
            {labelChars.map((char, index) => {
              const charStartFrame = labelStartFrame + index * labelStagger;
              const charOpacity = interpolate(
                frame - charStartFrame,
                [0, 10],
                [0, 1],
                {
                  easing: Easing.bezier(...EASINGS.easeOutQuart),
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );
              const charY = interpolate(
                frame - charStartFrame,
                [0, 10],
                [8, 0],
                {
                  easing: Easing.bezier(...EASINGS.easeOutQuart),
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              return (
                <span
                  key={`label-${index}`}
                  style={{
                    fontFamily: theme.resolvedFonts.heading,
                    fontSize: labelSize,
                    fontWeight: 500,
                    color: labelColor,
                    opacity: charOpacity,
                    transform: `translateY(${charY}px)`,
                    display: "inline-block",
                    whiteSpace: "pre",
                    lineHeight: 1,
                    willChange: "transform, opacity",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        )}
      </AbsoluteFill>

      {/* Bottom footnote text */}
      {bottomText && (
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: theme.resolvedFonts.body,
            fontSize: bottomTextSize,
            fontWeight: 400,
            color: bottomTextColor,
            opacity: bottomTextOpacity,
            willChange: "opacity",
          }}
        >
          {bottomText}
        </div>
      )}
    </AbsoluteFill>
  );
};
