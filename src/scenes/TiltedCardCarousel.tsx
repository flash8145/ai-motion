import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { SPRING_PRESETS } from "../animation/springs";

interface TiltedCardCarouselProps {
  startFrame?: number;
  cardStagger?: number;
}

const CARD_COUNT = 5;
const CARD_WIDTH = 200;
const CARD_HEIGHT = 280;
const GAP = 20;

const SERVICE_NAMES = ["Branding", "Digital", "Motion", "", "Strategy"];

// Per-card tilt presets: rotateY, skewX, translateY
const CARD_TRANSFORMS = [
  { rotateY: -15, skewX: -3, translateY: -20 },
  { rotateY: -7, skewX: -1.5, translateY: -10 },
  { rotateY: 0, skewX: 0, translateY: 0 },
  { rotateY: 7, skewX: 1.5, translateY: -10 },
  { rotateY: 15, skewX: 3, translateY: -20 },
];

export const TiltedCardCarousel: React.FC<TiltedCardCarouselProps> = ({
  startFrame = 5,
  cardStagger = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const charts = theme.colors.charts;

  const renderGradientCard = (index: number) => {
    const c1 = charts[index % charts.length];
    const c2 = charts[(index + 1) % charts.length];

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          borderRadius: theme.borderRadius,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
            borderRadius: theme.borderRadius,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "12px 16px",
            fontFamily: theme.resolvedFonts.body,
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }}
        >
          {SERVICE_NAMES[index]}
        </div>
      </div>
    );
  };

  const renderBrandedCard = () => {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {/* Circular logo badge */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "2px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.resolvedFonts.heading,
            fontSize: 16,
            fontWeight: 700,
            color: theme.colors.text,
            letterSpacing: 2,
          }}
        >
          SDS
        </div>
        {/* "Trusted Since" text */}
        <div
          style={{
            fontFamily: theme.resolvedFonts.heading,
            fontSize: 13,
            fontWeight: 500,
            color: theme.colors.mutedText,
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          Trusted Since
        </div>
        {/* Year */}
        <div
          style={{
            fontFamily: theme.resolvedFonts.heading,
            fontSize: 32,
            fontWeight: 700,
            color: theme.colors.text,
            lineHeight: 1,
            marginTop: -4,
          }}
        >
          2018
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <GradientBackground />
      <NoiseTexture />

      {/* Card row container */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1200,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: GAP,
          }}
        >
          {Array.from({ length: CARD_COUNT }).map((_, i) => {
            const cardStart = startFrame + i * cardStagger;

            const enterProgress = spring({
              frame: frame - cardStart,
              fps,
              config: SPRING_PRESETS.smooth,
            });

            const finalTransform = CARD_TRANSFORMS[i];

            // Animate translateX from 400 to 0
            const translateX = 400 * (1 - enterProgress);

            // Animate rotateY from -40 to final tilt
            const rotateY =
              -40 + (finalTransform.rotateY - -40) * enterProgress;

            // Animate skewX from 0 to final
            const skewX = finalTransform.skewX * enterProgress;

            // Animate translateY from 0 to final offset
            const translateY = finalTransform.translateY * enterProgress;

            // Opacity fades in with the spring
            const opacity = enterProgress;

            const isCenter = i === 2;

            return (
              <div
                key={i}
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  borderRadius: theme.borderRadius,
                  background: `${theme.colors.surface}CC`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                  opacity,
                  transform: [
                    `translateX(${translateX}px)`,
                    `translateY(${translateY}px)`,
                    `rotateY(${rotateY}deg)`,
                    `skewX(${skewX}deg)`,
                  ].join(" "),
                  transformStyle: "preserve-3d",
                }}
              >
                {isCenter ? renderBrandedCard() : renderGradientCard(i)}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
