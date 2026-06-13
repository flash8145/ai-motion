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
import { GlassPanel } from "../components/primitives/GlassPanel";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { SPRING_PRESETS } from "../animation/springs";

type Layout = "image-left" | "image-right" | "text-only";

interface ComparisonItem {
  icon?: string;
  text: string;
}

interface SplitScreenProps {
  layout?: Layout;
  headline: string;
  description?: string;
  /** Bullet points or comparison items */
  items?: ComparisonItem[];
  /** Image URL for the visual side */
  imageUrl?: string;
  /** Placeholder content if no image */
  imagePlaceholder?: string;
  headlineStart?: number;
  contentStart?: number;
  imageStart?: number;
}

/**
 * SplitScreen — Two-panel layout with text + image or comparison items.
 * Supports image-left, image-right, or text-only layouts.
 */
export const SplitScreen: React.FC<SplitScreenProps> = ({
  layout = "image-right",
  headline,
  description,
  items = [],
  imageUrl,
  imagePlaceholder = "Visual Preview",
  headlineStart = 5,
  contentStart = 18,
  imageStart = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // ── Text side animation ────────────────────────────────────
  const textSpring = spring({
    frame: frame - headlineStart,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 35,
  });

  const textX =
    layout === "image-left"
      ? interpolate(textSpring, [0, 1], [40, 0])
      : interpolate(textSpring, [0, 1], [-40, 0]);

  const textOpacity = interpolate(
    frame - headlineStart,
    [0, 15],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ── Image side animation ───────────────────────────────────
  const imageSpring = spring({
    frame: frame - imageStart,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 40,
  });

  const imageScale = interpolate(imageSpring, [0, 1], [0.9, 1]);
  const imageOpacity = interpolate(
    frame - imageStart,
    [0, 18],
    [0, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const textPanel = (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 20,
        padding: "0 40px",
        transform: `translateX(${textX}px)`,
        opacity: textOpacity,
      }}
    >
      <AnimatedText
        text={headline}
        splitBy="words"
        staggerFrames={3}
        startFrame={headlineStart}
        fontSize={40}
        fontWeight={700}
        lineHeight={1.2}
        textAlign="left"
        isHeading
      />

      {description && (
        <AnimatedText
          text={description}
          splitBy="words"
          staggerFrames={1}
          startFrame={headlineStart + 10}
          fontSize={17}
          fontWeight={400}
          color={theme.colors.mutedText}
          lineHeight={1.6}
          textAlign="left"
          isHeading={false}
        />
      )}

      {items.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 8,
          }}
        >
          {items.map((item, i) => {
            const itemDelay = contentStart + i * 5;
            const itemOpacity = interpolate(
              frame - itemDelay,
              [0, 10],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            const itemX = interpolate(
              spring({
                frame: frame - itemDelay,
                fps,
                config: SPRING_PRESETS.snappy,
                durationInFrames: 20,
              }),
              [0, 1],
              [20, 0]
            );

            return (
              <div
                key={`item-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: itemOpacity,
                  transform: `translateX(${itemX}px)`,
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>
                  {item.icon ?? "→"}
                </span>
                <span
                  style={{
                    fontFamily: theme.resolvedFonts.body,
                    fontSize: 15,
                    color: theme.colors.text,
                  }}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const imagePanel = layout !== "text-only" && (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        transform: `scale(${imageScale})`,
        opacity: imageOpacity,
      }}
    >
      <GlassPanel padding={0} style={{ overflow: "hidden", width: "100%" }}>
        {imageUrl ? (
          <Img
            src={imageUrl}
            style={{
              width: "100%",
              height: 400,
              objectFit: "cover",
              borderRadius: theme.borderRadius,
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${theme.colors.primary}11`,
              borderRadius: theme.borderRadius,
            }}
          >
            <span
              style={{
                fontFamily: theme.resolvedFonts.body,
                fontSize: 18,
                color: theme.colors.mutedText,
              }}
            >
              {imagePlaceholder}
            </span>
          </div>
        )}
      </GlassPanel>
    </div>
  );

  return (
    <AbsoluteFill>
      <GradientBackground opacity={0.4} />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "40px 60px",
        }}
      >
        {layout === "image-left" ? (
          <>
            {imagePanel}
            {textPanel}
          </>
        ) : (
          <>
            {textPanel}
            {imagePanel}
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
