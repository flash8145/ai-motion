import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { ContentStack } from "./ContentStack";
import { DeviceMockupFrame, type DeviceMedia, type DeviceType } from "./DeviceMockupFrame";
import { PremiumTextReveal } from "./PremiumTextReveal";
import { ScreenshotShowcase, type PanDirection } from "./ScreenshotShowcase";
import { WhiteFeatureCard } from "./WhiteFeatureCard";

export interface ProductFeature {
  title: string;
  subtitle?: string;
  deviceType?: DeviceType;
  media?: DeviceMedia;
  screenshot?: string;
  panDirection?: PanDirection;
  backgroundColor?: string;
}

export interface ProductFeatureSequenceProps {
  features: ProductFeature[];
  durationPerFeature?: number;
  startFrame?: number;
  cardWidth?: number;
  cardHeight?: number;
}

export const ProductFeatureSequence: React.FC<ProductFeatureSequenceProps> = ({
  features,
  durationPerFeature = 150,
  startFrame = 0,
  cardWidth = 1220,
  cardHeight = 760,
}) => {
  useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      {features.map((feature, index) => {
        const sequenceFrom = startFrame + index * durationPerFeature;
        const showScreenshot = Boolean(feature.screenshot);

        return (
          <Sequence
            key={`${feature.title}-${index}`}
            from={sequenceFrom}
            durationInFrames={durationPerFeature}
          >
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: feature.backgroundColor ?? "#000000",
                padding: 64,
              }}
            >
              <ContentStack gap={34} startFrame={4} stagger={8}>
                <PremiumTextReveal
                  text={feature.title}
                  fontSize={72}
                  color="#FFFFFF"
                  stagger={3}
                />
                {feature.subtitle && (
                  <PremiumTextReveal
                    text={feature.subtitle}
                    fontSize={30}
                    fontWeight={450}
                    color="rgba(255,255,255,0.7)"
                    stagger={2}
                    startFrame={8}
                  />
                )}
                <WhiteFeatureCard
                  width={cardWidth}
                  height={cardHeight}
                  cornerRadius={38}
                  startFrame={22}
                  padding={24}
                >
                  {showScreenshot && feature.screenshot ? (
                    <ScreenshotShowcase
                      image={feature.screenshot}
                      panDirection={feature.panDirection ?? "up"}
                      borderRadius={24}
                    />
                  ) : (
                    <DeviceMockupFrame
                      deviceType={feature.deviceType ?? "macbook"}
                      media={feature.media}
                      width={cardWidth - 96}
                      startFrame={26}
                    />
                  )}
                </WhiteFeatureCard>
              </ContentStack>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const ProductFeatureSequenceExample: React.FC = () => (
  <ProductFeatureSequence
    features={[
      { title: "Meet", subtitle: "A voice-first workspace", deviceType: "browser" },
      { title: "Reply to emails", subtitle: "Without touching the keyboard" },
    ]}
  />
);
