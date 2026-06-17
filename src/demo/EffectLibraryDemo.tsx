import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { getPreset } from "../theme/presets";
import { GlitchTextReveal } from "../scenes/GlitchTextReveal";
import { ShinyTextSweep } from "../scenes/ShinyTextSweep";
import { DecryptText } from "../scenes/DecryptText";
import { LogoMarquee } from "../scenes/LogoMarquee";
import { ShaderBackground3D } from "../scenes/ShaderBackground3D";
import { ElectricBorderOverlay } from "../overlays/ElectricBorderOverlay";

// New scene imports
import { TrueFocus } from "../scenes/TrueFocus";
import { VariableProximity } from "../scenes/VariableProximity";
import { ClickSpark } from "../scenes/ClickSpark";
import { PixelTransition } from "../scenes/PixelTransition";

const theme = getPreset("Apple");

export const GlitchTextRevealDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <GlitchTextReveal headline="SYSTEM ONLINE" subtitle="Welcome to the future" startFrame={5} />
    </AbsoluteFill>
  </ThemeProvider>
);

export const ShinyTextSweepDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <ShinyTextSweep text="Premium Quality" subtitle="Crafted with care" startFrame={5} loop loopGapFrames={40} />
    </AbsoluteFill>
  </ThemeProvider>
);

export const DecryptTextDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <DecryptText 
        text="ACCESS GRANTED" 
        subtitle="Initializing system..." 
        startFrame={5} 
        sequential={true}
        revealDirection="center"
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const LogoMarqueeDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <LogoMarquee
        heading="Trusted by teams at"
        items={["Acme", "Globex", "Initech", "Umbrella", "Stark Industries", "Wayne Enterprises"]}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const AuroraBackgroundDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <ShaderBackground3D variant="aurora" heading="Northern Lights" colorA="#000000" colorB="#0A84FF" />
    </AbsoluteFill>
  </ThemeProvider>
);

export const MetaballsBackgroundDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <ShaderBackground3D variant="metaballs" heading="Fluid Motion" colorA="#000000" colorB="#5E5CE6" />
    </AbsoluteFill>
  </ThemeProvider>
);

export const LiquidChromeBackgroundDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <ShaderBackground3D variant="liquid-chrome" heading="Liquid Chrome Flow" colorA="#080808" colorB="#0AFFEF" speed={1.2} />
    </AbsoluteFill>
  </ThemeProvider>
);

export const BalatroBackgroundDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <ShaderBackground3D variant="balatro" heading="Balatro Swirl" colorA="#DE443B" colorB="#006BB4" speed={1.5} />
    </AbsoluteFill>
  </ThemeProvider>
);

export const ThreadsBackgroundDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill style={{ backgroundColor: "#080808" }}>
      <ShaderBackground3D variant="threads" heading="Waving Noise Strands" colorA="#080808" colorB="#FF375F" speed={0.8} />
    </AbsoluteFill>
  </ThemeProvider>
);

export const TrueFocusDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <TrueFocus
        sentence="Focused Caption Typography In Motion Platform"
        startFrame={5}
        wordDurationFrames={20}
        blurAmount={6}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const VariableProximityDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <VariableProximity
        label="VARIABLE SPOTLIGHT DEFORMATION"
        startFrame={10}
        sweepDurationInFrames={90}
        radius={0.35}
        fromWeight={200}
        toWeight={900}
        fromWidth={90}
        toWidth={200}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const ClickSparkDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <ShaderBackground3D variant="gradient-flow" colorA="#050505" colorB="#1c1c1c" speed={0.5} />
      <ClickSpark
        triggers={[
          { frame: 15, x: 500, y: 300 },
          { frame: 35, x: 1400, y: 700 },
          { frame: 60, x: 960, y: 540 },
          { frame: 85, x: 300, y: 800 },
          { frame: 110, x: 1600, y: 200 }
        ]}
        sparkColor="#0AFFEF"
        sparkRadius={90}
        sparkCount={12}
        durationFrames={18}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const PixelTransitionDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <PixelTransition
      SceneA={
        <AbsoluteFill style={{ backgroundColor: "#0A84FF", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ color: "#fff", fontSize: 64, fontFamily: theme.typography.headingFont, fontWeight: 800 }}>Scene A</h1>
        </AbsoluteFill>
      }
      SceneB={
        <AbsoluteFill style={{ backgroundColor: "#FF375F", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ color: "#fff", fontSize: 64, fontFamily: theme.typography.headingFont, fontWeight: 800 }}>Scene B</h1>
        </AbsoluteFill>
      }
      gridSize={12}
      durationFrames={30}
      startFrame={15}
      seed={88}
    />
  </ThemeProvider>
);

export const ElectricBorderOverlayDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.background, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 400,
          height: 240,
          borderRadius: 16,
          backgroundColor: theme.colors.surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.text,
          fontFamily: theme.typography.headingFont,
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        New Feature
      </div>
      <Sequence layout="none">
        <ElectricBorderOverlay
          position={{ x: 760, y: 420, width: 400, height: 240 }}
          startFrame={10}
          durationFrames={130}
        />
      </Sequence>
    </AbsoluteFill>
  </ThemeProvider>
);
