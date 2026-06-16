import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { VideoProject as VideoProjectType, Scene } from "../types/schema";
import { ThemeProvider } from "../theme/ThemeProvider";
import { getTransitionInStyle } from "../animation/transitions";
import { AudioTrack } from "../audio/AudioTrack";

// ── Scene components ─────────────────────────────────────────────
import { TitleReveal } from "../scenes/TitleReveal";
import { KineticText } from "../scenes/KineticText";
import { DashboardShowcase } from "../scenes/DashboardShowcase";
import { CTASection } from "../scenes/CTASection";
import { TestimonialCards } from "../scenes/TestimonialCards";
import { PricingTable } from "../scenes/PricingTable";
import { FeatureGrid } from "../scenes/FeatureGrid";
import { StatsCounter } from "../scenes/StatsCounter";
import { LogoShowcase } from "../scenes/LogoShowcase";
import { SplitScreen } from "../scenes/SplitScreen";
import { ChartShowcase } from "../scenes/ChartShowcase";
import { ComparisonScene } from "../scenes/ComparisonScene";
import { InteractiveCodeMockup } from "../scenes/InteractiveCodeMockup";

// ── Gemini Flow Scenes ───────────────────────────────────────────
import { PromptCard } from "../scenes/PromptCard";
import { OverlayHeadline } from "../scenes/OverlayHeadline";
import { GalleryGrid } from "../scenes/GalleryGrid";
import { WorkspaceShowcase } from "../scenes/WorkspaceShowcase";
import { ContentWall } from "../scenes/ContentWall";
import { ProductReveal } from "../scenes/ProductReveal";

// ── Design Studio Scenes ─────────────────────────────────────────
import { ToolbarMockup } from "../scenes/ToolbarMockup";
import { RotatedWordStack } from "../scenes/RotatedWordStack";
import { TiltedCardCarousel } from "../scenes/TiltedCardCarousel";
import { CircleMotifTransition } from "../scenes/CircleMotifTransition";
import { LogoRevealOutro } from "../scenes/LogoRevealOutro";

// ── Overlay components ───────────────────────────────────────────
import { TextOverlay } from "../overlays/TextOverlay";
import { CursorOverlay } from "../overlays/CursorOverlay";
import { BadgeOverlay } from "../overlays/BadgeOverlay";
import { ArrowOverlay } from "../overlays/ArrowOverlay";
import { ZoomFocusOverlay } from "../overlays/ZoomFocusOverlay";
import type { OverlayLayer } from "../types/schema";

interface VideoProjectProps {
  project?: VideoProjectType;
}

/**
 * Renders a single scene component based on its type.
 */
function renderScene(scene: Scene): React.ReactNode {
  const props = scene.props as Record<string, unknown>;

  switch (scene.type) {
    case "TitleReveal":
      return (
        <TitleReveal
          headline={(props.headline as string) ?? "Your Headline"}
          tagline={props.tagline as string | undefined}
          subtitle={props.subtitle as string | undefined}
          taglineStart={props.taglineStart as number | undefined}
          headlineStart={props.headlineStart as number | undefined}
          subtitleStart={props.subtitleStart as number | undefined}
        />
      );

    case "KineticText":
      return (
        <KineticText
          lines={
            (props.lines as Array<{
              text: string;
              fontSize?: number;
              fontWeight?: number;
              color?: string;
            }>) ?? [{ text: "Sample Text" }]
          }
          startFrame={props.startFrame as number | undefined}
          lineStagger={props.lineStagger as number | undefined}
        />
      );

    case "DashboardShowcase":
      return (
        <DashboardShowcase
          url={props.url as string | undefined}
          screenshotUrl={props.screenshotUrl as string | undefined}
          browserWidth={props.browserWidth as number | undefined}
          browserHeight={props.browserHeight as number | undefined}
          cursorKeyframes={
            props.cursorKeyframes as
              | Array<{
                  frame: number;
                  x: number;
                  y: number;
                  click?: boolean;
                }>
              | undefined
          }
          enterFrame={props.enterFrame as number | undefined}
          highlights={
            props.highlights as
              | Array<{
                  text: string;
                  x: number;
                  y: number;
                  showAtFrame: number;
                }>
              | undefined
          }
        />
      );

    case "CTASection":
      return (
        <CTASection
          headline={(props.headline as string) ?? "Get Started Today"}
          description={props.description as string | undefined}
          buttonText={props.buttonText as string | undefined}
          pricingText={props.pricingText as string | undefined}
          features={props.features as string[] | undefined}
          enterFrame={props.enterFrame as number | undefined}
        />
      );

    case "TestimonialCards":
      return (
        <TestimonialCards
          heading={props.heading as string | undefined}
          testimonials={
            (props.testimonials as Array<{
              quote: string;
              name: string;
              role: string;
              company: string;
              avatarInitials?: string;
              avatarColor?: string;
            }>) ?? []
          }
          headingStart={props.headingStart as number | undefined}
          cardsStart={props.cardsStart as number | undefined}
          cardStagger={props.cardStagger as number | undefined}
        />
      );

    case "PricingTable":
      return (
        <PricingTable
          heading={props.heading as string | undefined}
          subtitle={props.subtitle as string | undefined}
          tiers={
            (props.tiers as Array<{
              name: string;
              price: string;
              period?: string;
              description?: string;
              features: string[];
              buttonText?: string;
              highlighted?: boolean;
              badge?: string;
            }>) ?? []
          }
          headingStart={props.headingStart as number | undefined}
          tiersStart={props.tiersStart as number | undefined}
          tierStagger={props.tierStagger as number | undefined}
        />
      );

    case "FeatureGrid":
      return (
        <FeatureGrid
          heading={props.heading as string | undefined}
          subtitle={props.subtitle as string | undefined}
          features={
            (props.features as Array<{
              icon: string;
              title: string;
              description: string;
            }>) ?? []
          }
          columns={props.columns as number | undefined}
          headingStart={props.headingStart as number | undefined}
          gridStart={props.gridStart as number | undefined}
          itemStagger={props.itemStagger as number | undefined}
        />
      );

    case "StatsCounter":
      return (
        <StatsCounter
          heading={props.heading as string | undefined}
          stats={
            (props.stats as Array<{
              value: string;
              label: string;
              prefix?: string;
              suffix?: string;
            }>) ?? []
          }
          headingStart={props.headingStart as number | undefined}
          statsStart={props.statsStart as number | undefined}
          statStagger={props.statStagger as number | undefined}
        />
      );

    case "LogoShowcase":
      return (
        <LogoShowcase
          heading={props.heading as string | undefined}
          logos={
            (props.logos as Array<{
              name: string;
              color?: string;
            }>) ?? []
          }
          headingStart={props.headingStart as number | undefined}
          logosStart={props.logosStart as number | undefined}
          logoStagger={props.logoStagger as number | undefined}
        />
      );

    case "SplitScreen":
      return (
        <SplitScreen
          layout={
            props.layout as
              | "image-left"
              | "image-right"
              | "text-only"
              | undefined
          }
          headline={(props.headline as string) ?? "Headline"}
          description={props.description as string | undefined}
          items={
            props.items as Array<{ icon?: string; text: string }> | undefined
          }
          imageUrl={props.imageUrl as string | undefined}
          imagePlaceholder={props.imagePlaceholder as string | undefined}
          headlineStart={props.headlineStart as number | undefined}
          contentStart={props.contentStart as number | undefined}
          imageStart={props.imageStart as number | undefined}
        />
      );

    case "ChartShowcase":
      return (
        <ChartShowcase
          chartType={props.chartType as "line" | "bar"}
          heading={props.heading as string | undefined}
          subtitle={props.subtitle as string | undefined}
          data={(props.data as Array<{ label: string; value: number }>) ?? []}
          chartWidth={props.chartWidth as number | undefined}
          chartHeight={props.chartHeight as number | undefined}
          headingStart={props.headingStart as number | undefined}
          chartStart={props.chartStart as number | undefined}
          showValues={props.showValues as boolean | undefined}
          showLabels={props.showLabels as boolean | undefined}
        />
      );

    case "ComparisonScene":
      return (
        <ComparisonScene
          heading={props.heading as string | undefined}
          subheading={props.subheading as string | undefined}
          leftTitle={props.leftTitle as string | undefined}
          leftItems={props.leftItems as string[] | undefined}
          rightTitle={props.rightTitle as string | undefined}
          rightItems={props.rightItems as string[] | undefined}
          leftHeaderColor={props.leftHeaderColor as string | undefined}
          rightHeaderColor={props.rightHeaderColor as string | undefined}
          leftIcon={props.leftIcon as string | undefined}
          rightIcon={props.rightIcon as string | undefined}
          headingStart={props.headingStart as number | undefined}
          contentStart={props.contentStart as number | undefined}
        />
      );

    case "InteractiveCodeMockup":
      return (
        <InteractiveCodeMockup
          heading={props.heading as string | undefined}
          subtitle={props.subtitle as string | undefined}
          codeLines={props.codeLines as string[] | undefined}
          fileName={props.fileName as string | undefined}
          highlightedLines={props.highlightedLines as number[] | undefined}
          headingStart={props.headingStart as number | undefined}
          mockupStart={props.mockupStart as number | undefined}
          typingSpeed={props.typingSpeed as number | undefined}
        />
      );

    case "PromptCard":
      return (
        <PromptCard
          prompt={(props.prompt as string) ?? ""}
          placeholder={props.placeholder as string | undefined}
          showSubmitButton={props.showSubmitButton as boolean | undefined}
          typingSpeed={props.typingSpeed as number | undefined}
          startFrame={props.startFrame as number | undefined}
        />
      );

    case "OverlayHeadline":
      return (
        <OverlayHeadline
          title={(props.title as string) ?? ""}
          subtitle={props.subtitle as string | undefined}
          align={props.align as "left" | "center" | "right" | undefined}
          titleStartFrame={props.titleStartFrame as number | undefined}
          subtitleStartFrame={props.subtitleStartFrame as number | undefined}
        />
      );

    case "GalleryGrid":
      return (
        <GalleryGrid
          images={(props.images as string[]) ?? []}
          columns={props.columns as number | undefined}
          startFrame={props.startFrame as number | undefined}
          itemStagger={props.itemStagger as number | undefined}
        />
      );

    case "WorkspaceShowcase":
      return (
        <WorkspaceShowcase
          image={props.image as string | undefined}
          title={props.title as string | undefined}
          subtitle={props.subtitle as string | undefined}
          zoomAmount={props.zoomAmount as number | undefined}
          panAmount={props.panAmount as number | undefined}
          startFrame={props.startFrame as number | undefined}
        />
      );

    case "ProductReveal":
      return (
        <ProductReveal
          image={(props.image as string) ?? ""}
          title={(props.title as string) ?? ""}
          subtitle={props.subtitle as string | undefined}
          startFrame={props.startFrame as number | undefined}
          titleStartFrame={props.titleStartFrame as number | undefined}
          subtitleStartFrame={props.subtitleStartFrame as number | undefined}
          imageStartFrame={props.imageStartFrame as number | undefined}
          sweepStartFrame={props.sweepStartFrame as number | undefined}
          sweepDurationInFrames={props.sweepDurationInFrames as number | undefined}
          aspectRatio={props.aspectRatio as string | undefined}
        />
      );

    case "ContentWall":
      return (
        <ContentWall
          items={(props.items as string[]) ?? []}
          columns={props.columns as number | undefined}
          scrollSpeed={props.scrollSpeed as number | undefined}
          startFrame={props.startFrame as number | undefined}
        />
      );

    case "ToolbarMockup":
      return (
        <ToolbarMockup
          startFrame={props.startFrame as number | undefined}
          iconStagger={props.iconStagger as number | undefined}
        />
      );

    case "RotatedWordStack":
      return (
        <RotatedWordStack
          phrases={props.phrases as string[] | undefined}
          rotationDeg={props.rotationDeg as number | undefined}
          startFrame={props.startFrame as number | undefined}
        />
      );

    case "TiltedCardCarousel":
      return (
        <TiltedCardCarousel
          startFrame={props.startFrame as number | undefined}
          cardStagger={props.cardStagger as number | undefined}
        />
      );

    case "CircleMotifTransition":
      return (
        <CircleMotifTransition
          startFrame={props.startFrame as number | undefined}
          circleStagger={props.circleStagger as number | undefined}
        />
      );

    case "LogoRevealOutro":
      return (
        <LogoRevealOutro
          startFrame={props.startFrame as number | undefined}
          title={props.title as string | undefined}
          subtitle={props.subtitle as string | undefined}
        />
      );

    default:
      return null;
  }
}

/**
 * Renders overlay layers for a scene.
 */
function renderOverlays(overlays: OverlayLayer[]): React.ReactNode[] {
  return overlays.map((overlay) => {
    const props = overlay.props as Record<string, unknown>;

    switch (overlay.type) {
      case "text":
        return (
          <TextOverlay
            key={overlay.id}
            text={(props.text as string) ?? ""}
            position={overlay.position}
            startFrame={overlay.startTimeFrame}
            durationFrames={overlay.durationFrames}
            fontSize={props.fontSize as number | undefined}
            animationType={overlay.animation.type as "pop" | "fade" | "float"}
          />
        );

      case "cursor":
        return (
          <CursorOverlay
            key={overlay.id}
            position={overlay.position}
            startFrame={overlay.startTimeFrame}
            durationFrames={overlay.durationFrames}
            label={props.label as string | undefined}
          />
        );

      case "badge":
        return (
          <BadgeOverlay
            key={overlay.id}
            text={(props.text as string) ?? ""}
            position={overlay.position}
            startFrame={overlay.startTimeFrame}
            durationFrames={overlay.durationFrames}
            icon={props.icon as string | undefined}
          />
        );

      case "arrow":
        return (
          <ArrowOverlay
            key={overlay.id}
            from={overlay.position}
            to={{
              x: (props.toX as number) ?? overlay.position.x + 100,
              y: (props.toY as number) ?? overlay.position.y,
            }}
            startFrame={overlay.startTimeFrame}
            durationFrames={overlay.durationFrames}
          />
        );

      case "zoom-focus":
        return (
          <ZoomFocusOverlay
            key={overlay.id}
            position={{
              x: overlay.position.x,
              y: overlay.position.y,
              width: overlay.position.width ?? 100,
              height: overlay.position.height ?? 60,
            }}
            startFrame={overlay.startTimeFrame}
            durationFrames={overlay.durationFrames}
            label={props.label as string | undefined}
          />
        );

      default:
        return null;
    }
  });
}

/**
 * SceneWrapper — wraps a scene with transition-in effects.
 */
const SceneWrapper: React.FC<{
  scene: Scene;
  children: React.ReactNode;
}> = ({ scene, children }) => {
  const frame = useCurrentFrame();

  if (!scene.transitionIn || scene.transitionIn.type === "none") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const styles = getTransitionInStyle(
    scene.transitionIn.type,
    frame,
    scene.transitionIn.durationFrames,
  );

  return (
    <AbsoluteFill
      style={{
        opacity: styles.opacity,
        transform: styles.transform,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * VideoProject — The main composition component.
 * Reads a VideoProject configuration and sequences scenes, overlays,
 * and audio into a Remotion timeline.
 */
export const VideoProject: React.FC<VideoProjectProps> = ({ project }) => {
  if (!project) return null;
  const { theme, scenes, audio } = project;

  // Calculate frame offsets for each scene
  let currentFrame = 0;
  const sceneEntries = scenes.map((scene) => {
    const entry = { scene, startFrame: currentFrame };
    currentFrame += scene.durationFrames;
    return entry;
  });

  return (
    <ThemeProvider theme={theme}>
      <AbsoluteFill>
        {/* Scenes */}
        {sceneEntries.map(({ scene, startFrame }) => (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={scene.durationFrames}
            premountFor={15}
          >
            <SceneWrapper scene={scene}>
              {renderScene(scene)}

              {/* Overlays within this scene */}
              {scene.overlays && renderOverlays(scene.overlays)}
            </SceneWrapper>
          </Sequence>
        ))}

        {/* Audio track */}
        {audio?.musicUrl && (
          <Sequence layout="none">
            <AudioTrack
              src={audio.musicUrl}
              volume={audio.musicVolume ?? 0.3}
            />
          </Sequence>
        )}
      </AbsoluteFill>
    </ThemeProvider>
  );
};
