import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  CameraZoomController,
  ContentStack,
  DeviceMockupFrame,
  HeroHeadline,
  PremiumTextReveal,
  ProductFeatureSequence,
  SectionTransition,
  SerifFeatureTitle,
  WhiteFeatureCard,
} from "../components";
import { ThemeProvider } from "../theme/ThemeProvider";
import { getPreset } from "../theme/presets";

const screenshotDataUri =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="780" viewBox="0 0 1200 780">
  <rect width="1200" height="780" fill="#f6f7f9"/>
  <rect x="38" y="34" width="1124" height="712" rx="34" fill="#ffffff"/>
  <rect x="80" y="82" width="190" height="620" rx="24" fill="#101114"/>
  <rect x="316" y="92" width="360" height="154" rx="26" fill="#eaf2ff"/>
  <rect x="706" y="92" width="374" height="154" rx="26" fill="#f1ecff"/>
  <rect x="316" y="284" width="764" height="344" rx="30" fill="#111318"/>
  <path d="M370 557 C460 474 540 512 616 428 C696 340 790 392 892 304 C948 256 1008 250 1044 238" fill="none" stroke="#6aa7ff" stroke-width="12" stroke-linecap="round"/>
  <rect x="126" y="148" width="84" height="14" rx="7" fill="#ffffff" opacity="0.92"/>
  <rect x="126" y="204" width="96" height="12" rx="6" fill="#ffffff" opacity="0.38"/>
  <rect x="126" y="246" width="118" height="12" rx="6" fill="#ffffff" opacity="0.28"/>
  <rect x="126" y="288" width="76" height="12" rx="6" fill="#ffffff" opacity="0.28"/>
</svg>`);

const MockInbox: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#F7F8FA",
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      fontFamily: "Inter, sans-serif",
    }}
  >
    <div style={{ backgroundColor: "#101114", padding: 26 }}>
      <div
        style={{
          width: 82,
          height: 14,
          borderRadius: 999,
          backgroundColor: "#FFFFFF",
          marginBottom: 46,
        }}
      />
      {["Inbox", "Drafts", "Sent", "Archive"].map((label, index) => (
        <div
          key={label}
          style={{
            height: 38,
            borderRadius: 12,
            color: index === 0 ? "#101114" : "rgba(255,255,255,0.68)",
            backgroundColor: index === 0 ? "#FFFFFF" : "transparent",
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {label}
        </div>
      ))}
    </div>
    <div style={{ padding: 36 }}>
      <div
        style={{
          height: 78,
          borderRadius: 22,
          backgroundColor: "#FFFFFF",
          boxShadow: "0 12px 36px rgba(0,0,0,0.06)",
          marginBottom: 22,
        }}
      />
      <div
        style={{
          height: 312,
          borderRadius: 28,
          backgroundColor: "#FFFFFF",
          boxShadow: "0 18px 50px rgba(0,0,0,0.08)",
          padding: 34,
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 800, marginBottom: 22 }}>
          Reply drafted
        </div>
        <div
          style={{
            height: 16,
            width: "86%",
            backgroundColor: "#DDE2EA",
            borderRadius: 999,
            marginBottom: 14,
          }}
        />
        <div
          style={{
            height: 16,
            width: "72%",
            backgroundColor: "#DDE2EA",
            borderRadius: 999,
            marginBottom: 34,
          }}
        />
        <div
          style={{
            width: 172,
            height: 48,
            borderRadius: 16,
            backgroundColor: "#101114",
          }}
        />
      </div>
    </div>
  </div>
);

const FeatureCardScene: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    <CameraZoomController startScale={0.96} endScale={1.04} duration={110}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <WhiteFeatureCard width={940} height={1180} cornerRadius={46} startFrame={8}>
          <ContentStack gap={34} startFrame={18}>
            <SerifFeatureTitle text="Meet" fontSize={118} blurAmount={12} />
            <PremiumTextReveal
              text="A reusable launch-video system for AI product demos"
              fontSize={42}
              fontWeight={520}
              color="#2F3137"
              stagger={3}
              startFrame={14}
            />
            <DeviceMockupFrame
              deviceType="browser"
              width={720}
              startFrame={34}
              shadow
            >
              <MockInbox />
            </DeviceMockupFrame>
          </ContentStack>
        </WhiteFeatureCard>
      </AbsoluteFill>
    </CameraZoomController>
  </AbsoluteFill>
);

export const PremiumLaunchLibraryDemo: React.FC = () => (
  <ThemeProvider theme={getPreset("Apple")}>
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence durationInFrames={88}>
        <HeroHeadline
          text="Launch motion, assembled in React"
          fontSize={82}
          revealDuration={28}
          scaleAmount={0.028}
          wordStagger={4}
        />
      </Sequence>

      <Sequence from={88} durationInFrames={42}>
        <SectionTransition transitionType="black-to-white" duration={42} />
      </Sequence>

      <Sequence from={120} durationInFrames={118}>
        <FeatureCardScene />
      </Sequence>

      <Sequence from={238} durationInFrames={38}>
        <SectionTransition transitionType="white-to-black" duration={38} />
      </Sequence>

      <Sequence from={276} durationInFrames={164}>
        <ProductFeatureSequence
          durationPerFeature={82}
          cardWidth={880}
          cardHeight={720}
          features={[
            {
              title: "Text",
              subtitle: "Premium reveals with blur and stagger",
              screenshot: screenshotDataUri,
              panDirection: "right",
            },
            {
              title: "Device",
              subtitle: "Mockups and screenshots on rails",
              deviceType: "macbook",
            },
          ]}
        />
      </Sequence>
    </AbsoluteFill>
  </ThemeProvider>
);
