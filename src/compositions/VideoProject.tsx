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

// ── Explainer / Keyframe Engine Scenes ───────────────────────────
import { FreeformAnimation, type FreeformElement } from "../scenes/FreeformAnimation";
import { PathDrawScene, type DrawnPathConfig, type PathLabel } from "../scenes/PathDrawScene";
import { IconMorph } from "../scenes/IconMorph";
import { ProcessFlow, type ProcessFlowStep } from "../scenes/ProcessFlow";
import { LottieScene } from "../scenes/LottieScene";
import { WhiteboardReveal } from "../scenes/WhiteboardReveal";
import type { LottieAnimationData } from "@remotion/lottie";

// ── 3D / VFX Scenes ──────────────────────────────────────────────
import { Product3DReveal } from "../scenes/Product3DReveal";
import { ParticleField } from "../scenes/ParticleField";
import { GlobeAnimation, type GlobePin, type GlobeArc } from "../scenes/GlobeAnimation";
import { LogoExtrude3D } from "../scenes/LogoExtrude3D";
import { ShaderBackground3D } from "../scenes/ShaderBackground3D";

// ── Effect Library Scenes ────────────────────────────────────────
import { GlitchTextReveal } from "../scenes/GlitchTextReveal";
import { ShinyTextSweep } from "../scenes/ShinyTextSweep";
import { DecryptText } from "../scenes/DecryptText";
import { LogoMarquee } from "../scenes/LogoMarquee";
import { TrueFocus } from "../scenes/TrueFocus";
import { VariableProximity } from "../scenes/VariableProximity";
import { ClickSpark, type SparkTrigger } from "../scenes/ClickSpark";
import { PixelTransition } from "../scenes/PixelTransition";
import { ElectricBorderOverlay } from "../overlays/ElectricBorderOverlay";

// ── Dark Neon Scenes ─────────────────────────────────────────────
import { NeonTextReveal } from "../scenes/NeonTextReveal";
import { OrbitalCircles } from "../scenes/OrbitalCircles";
import { NeonWaveLines, type NeonWaveLine } from "../scenes/NeonWaveLines";
import { AppLogoReveal } from "../scenes/AppLogoReveal";
import { CleanCardPromo } from "../scenes/CleanCardPromo";
import { EyeOutlineScene } from "../scenes/EyeOutlineScene";

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

    case "FreeformAnimation":
      return (
        <FreeformAnimation
          elements={(props.elements as FreeformElement[]) ?? []}
          background={props.background as "theme" | "transparent" | string | undefined}
        />
      );

    case "PathDrawScene":
      return (
        <PathDrawScene
          paths={(props.paths as DrawnPathConfig[]) ?? []}
          viewBoxWidth={props.viewBoxWidth as number | undefined}
          viewBoxHeight={props.viewBoxHeight as number | undefined}
          heading={props.heading as string | undefined}
          headingStart={props.headingStart as number | undefined}
          labels={props.labels as PathLabel[] | undefined}
          background={props.background as "theme" | "transparent" | undefined}
        />
      );

    case "IconMorph":
      return (
        <IconMorph
          icons={(props.icons as string[]) ?? []}
          labels={props.labels as string[] | undefined}
          startFrame={props.startFrame as number | undefined}
          holdDurationFrames={props.holdDurationFrames as number | undefined}
          morphDurationFrames={props.morphDurationFrames as number | undefined}
          size={props.size as number | undefined}
          color={props.color as string | undefined}
          viewBox={props.viewBox as string | undefined}
        />
      );

    case "ProcessFlow":
      return (
        <ProcessFlow
          steps={(props.steps as ProcessFlowStep[]) ?? []}
          direction={props.direction as "horizontal" | "vertical" | undefined}
          heading={props.heading as string | undefined}
          headingStart={props.headingStart as number | undefined}
          stepsStart={props.stepsStart as number | undefined}
          stepStagger={props.stepStagger as number | undefined}
          accentColor={props.accentColor as string | undefined}
          canvasWidth={props.canvasWidth as number | undefined}
          canvasHeight={props.canvasHeight as number | undefined}
        />
      );

    case "LottieScene":
      return (
        <LottieScene
          src={props.src as string | undefined}
          animationData={props.animationData as LottieAnimationData | undefined}
          loop={props.loop as boolean | undefined}
          playbackRate={props.playbackRate as number | undefined}
          width={props.width as number | undefined}
          height={props.height as number | undefined}
          background={props.background as "theme" | "transparent" | undefined}
        />
      );

    case "WhiteboardReveal":
      return (
        <WhiteboardReveal
          sketchPath={(props.sketchPath as string) ?? ""}
          sketchViewBox={props.sketchViewBox as string | undefined}
          title={props.title as string | undefined}
          description={props.description as string | undefined}
          icon={props.icon as string | undefined}
          drawStartFrame={props.drawStartFrame as number | undefined}
          drawDurationFrames={props.drawDurationFrames as number | undefined}
          contentStartFrame={props.contentStartFrame as number | undefined}
          accentColor={props.accentColor as string | undefined}
          background={props.background as "theme" | "transparent" | "paper" | undefined}
        />
      );

    case "Product3DReveal":
      return (
        <Product3DReveal
          shape={props.shape as "rounded-box" | "cylinder" | "sphere" | undefined}
          color={props.color as string | undefined}
          title={props.title as string | undefined}
          subtitle={props.subtitle as string | undefined}
          startFrame={props.startFrame as number | undefined}
          titleStartFrame={props.titleStartFrame as number | undefined}
          rotationSpeed={props.rotationSpeed as number | undefined}
          cameraDistance={props.cameraDistance as number | undefined}
        />
      );

    case "ParticleField":
      return (
        <ParticleField
          count={props.count as number | undefined}
          color={props.color as string | undefined}
          spread={props.spread as number | undefined}
          speed={props.speed as number | undefined}
          background={props.background as "theme" | "transparent" | string | undefined}
        />
      );

    case "GlobeAnimation":
      return (
        <GlobeAnimation
          pins={props.pins as GlobePin[] | undefined}
          arcs={props.arcs as GlobeArc[] | undefined}
          rotationSpeed={props.rotationSpeed as number | undefined}
          startFrame={props.startFrame as number | undefined}
          radius={props.radius as number | undefined}
          color={props.color as string | undefined}
          heading={props.heading as string | undefined}
          headingStart={props.headingStart as number | undefined}
        />
      );

    case "LogoExtrude3D":
      return (
        <LogoExtrude3D
          path={(props.path as string) ?? ""}
          color={props.color as string | undefined}
          depth={props.depth as number | undefined}
          startFrame={props.startFrame as number | undefined}
          title={props.title as string | undefined}
          titleStartFrame={props.titleStartFrame as number | undefined}
        />
      );

    case "ShaderBackground3D":
      return (
        <ShaderBackground3D
          variant={
            props.variant as
              | "gradient-flow"
              | "light-rays"
              | "grain-noise"
              | "aurora"
              | "metaballs"
              | "liquid-chrome"
              | "balatro"
              | "threads"
              | undefined
          }
          colorA={props.colorA as string | undefined}
          colorB={props.colorB as string | undefined}
          speed={props.speed as number | undefined}
          heading={props.heading as string | undefined}
          headingStart={props.headingStart as number | undefined}
        />
      );

    case "GlitchTextReveal":
      return (
        <GlitchTextReveal
          headline={(props.headline as string) ?? ""}
          subtitle={props.subtitle as string | undefined}
          startFrame={props.startFrame as number | undefined}
          glitchDurationFrames={props.glitchDurationFrames as number | undefined}
          fontSize={props.fontSize as number | undefined}
          color={props.color as string | undefined}
        />
      );

    case "ShinyTextSweep":
      return (
        <ShinyTextSweep
          text={(props.text as string) ?? ""}
          subtitle={props.subtitle as string | undefined}
          startFrame={props.startFrame as number | undefined}
          sweepDurationFrames={props.sweepDurationFrames as number | undefined}
          loop={props.loop as boolean | undefined}
          loopGapFrames={props.loopGapFrames as number | undefined}
          fontSize={props.fontSize as number | undefined}
          baseColor={props.baseColor as string | undefined}
          shineColor={props.shineColor as string | undefined}
        />
      );

    case "DecryptText":
      return (
        <DecryptText
          text={(props.text as string) ?? ""}
          subtitle={props.subtitle as string | undefined}
          startFrame={props.startFrame as number | undefined}
          scrambleDurationFrames={props.scrambleDurationFrames as number | undefined}
          charStagger={props.charStagger as number | undefined}
          fontSize={props.fontSize as number | undefined}
          color={props.color as string | undefined}
          sequential={props.sequential as boolean | undefined}
          revealDirection={props.revealDirection as "start" | "end" | "center" | undefined}
          useOriginalCharsOnly={props.useOriginalCharsOnly as boolean | undefined}
          characters={props.characters as string | undefined}
        />
      );

    case "LogoMarquee":
      return (
        <LogoMarquee
          items={(props.items as string[]) ?? []}
          heading={props.heading as string | undefined}
          speed={props.speed as number | undefined}
          itemGap={props.itemGap as number | undefined}
          fontSize={props.fontSize as number | undefined}
          direction={props.direction as "left" | "right" | undefined}
        />
      );

    case "TrueFocus":
      return (
        <TrueFocus
          sentence={(props.sentence as string) ?? ""}
          startFrame={props.startFrame as number | undefined}
          wordDurationFrames={props.wordDurationFrames as number | undefined}
          blurAmount={props.blurAmount as number | undefined}
          fontSize={props.fontSize as number | undefined}
          borderColor={props.borderColor as string | undefined}
          glowColor={props.glowColor as string | undefined}
        />
      );

    case "VariableProximity":
      return (
        <VariableProximity
          label={(props.label as string) ?? ""}
          startFrame={props.startFrame as number | undefined}
          sweepDurationInFrames={props.sweepDurationInFrames as number | undefined}
          fromWeight={props.fromWeight as number | undefined}
          toWeight={props.toWeight as number | undefined}
          fromWidth={props.fromWidth as number | undefined}
          toWidth={props.toWidth as number | undefined}
          radius={props.radius as number | undefined}
          fontSize={props.fontSize as number | undefined}
        />
      );

    case "ClickSpark":
      return (
        <ClickSpark
          triggers={props.triggers as SparkTrigger[]}
          sparkColor={props.sparkColor as string | undefined}
          sparkSize={props.sparkSize as number | undefined}
          sparkRadius={props.sparkRadius as number | undefined}
          sparkCount={props.sparkCount as number | undefined}
          durationFrames={props.durationFrames as number | undefined}
        />
      );

    case "PixelTransition":
      return (
        <PixelTransition
          SceneA={renderScene(props.sceneA as Scene)}
          SceneB={renderScene(props.sceneB as Scene)}
          gridSize={props.gridSize as number | undefined}
          durationFrames={props.durationFrames as number | undefined}
          startFrame={props.startFrame as number | undefined}
          seed={props.seed as number | undefined}
        />
      );

    case "NeonTextReveal":
      return (
        <NeonTextReveal
          text={(props.text as string) ?? "Hello"}
          fontSize={props.fontSize as number | undefined}
          fontWeight={props.fontWeight as number | undefined}
          textColor={props.textColor as string | undefined}
          glowColor={props.glowColor as string | undefined}
          glowBlur={props.glowBlur as number | undefined}
          cursorColor={props.cursorColor as string | undefined}
          charStaggerFrames={props.charStaggerFrames as number | undefined}
          startFrame={props.startFrame as number | undefined}
          cursorSize={props.cursorSize as number | undefined}
        />
      );

    case "OrbitalCircles":
      return (
        <OrbitalCircles
          circleCount={props.circleCount as number | undefined}
          ringRadius={props.ringRadius as number | undefined}
          circleSize={props.circleSize as number | undefined}
          strokeColor={props.strokeColor as string | undefined}
          strokeWidth={props.strokeWidth as number | undefined}
          activeIndex={props.activeIndex as number | undefined}
          eclipseColorA={props.eclipseColorA as string | undefined}
          eclipseColorB={props.eclipseColorB as string | undefined}
          centerText={props.centerText as string | undefined}
          centerTextColor={props.centerTextColor as string | undefined}
          centerTextSize={props.centerTextSize as number | undefined}
          staggerFrames={props.staggerFrames as number | undefined}
          startFrame={props.startFrame as number | undefined}
        />
      );

    case "NeonWaveLines":
      return (
        <NeonWaveLines
          waves={props.waves as NeonWaveLine[] | undefined}
          canvasWidth={props.canvasWidth as number | undefined}
          canvasHeight={props.canvasHeight as number | undefined}
          glowBlur={props.glowBlur as number | undefined}
          centerY={props.centerY as number | undefined}
        />
      );

    case "AppLogoReveal":
      return (
        <AppLogoReveal
          logoSrc={(props.logoSrc as string) ?? ""}
          logoSize={props.logoSize as number | undefined}
          logoStartFrame={props.logoStartFrame as number | undefined}
          logoGlowColor={props.logoGlowColor as string | undefined}
          label={props.label as string | undefined}
          labelColor={props.labelColor as string | undefined}
          labelSize={props.labelSize as number | undefined}
          labelStartFrame={props.labelStartFrame as number | undefined}
          labelStagger={props.labelStagger as number | undefined}
          bottomText={props.bottomText as string | undefined}
          bottomTextColor={props.bottomTextColor as string | undefined}
          bottomTextSize={props.bottomTextSize as number | undefined}
          bottomTextStartFrame={props.bottomTextStartFrame as number | undefined}
        />
      );

    case "CleanCardPromo":
      return (
        <CleanCardPromo
          headline={props.headline as string | undefined}
          subtitle={props.subtitle as string | undefined}
          cardWidth={props.cardWidth as number | undefined}
          cardHeight={props.cardHeight as number | undefined}
          hasBorderGlow={props.hasBorderGlow as boolean | undefined}
          borderGlowSpeed={props.borderGlowSpeed as number | undefined}
          icon={props.icon as "none" | "star" | "plus" | "dots" | "circle-ring" | undefined}
          iconPosition={props.iconPosition as "top" | "left" | "right" | "orbit" | undefined}
          startFrame={props.startFrame as number | undefined}
          themeBackground={props.themeBackground as boolean | undefined}
          glowColor={props.glowColor as string | undefined}
        />
      );

    case "EyeOutlineScene":
      return (
        <EyeOutlineScene
          textA={(props.textA as string) ?? ""}
          textB={props.textB as string | undefined}
          switchFrame={props.switchFrame as number | undefined}
          startFrame={props.startFrame as number | undefined}
          drawDurationFrames={props.drawDurationFrames as number | undefined}
          borderColor={props.borderColor as string | undefined}
          capsuleColor={props.capsuleColor as string | undefined}
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

      case "electric-border":
        return (
          <ElectricBorderOverlay
            key={overlay.id}
            position={overlay.position}
            startFrame={overlay.startTimeFrame}
            durationFrames={overlay.durationFrames}
            color={props.color as string | undefined}
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
