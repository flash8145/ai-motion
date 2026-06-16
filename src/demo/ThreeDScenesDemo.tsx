import React from "react";
import { AbsoluteFill } from "remotion";
import { ThemeProvider } from "../theme/ThemeProvider";
import { getPreset } from "../theme/presets";
import { Product3DReveal } from "../scenes/Product3DReveal";
import { ParticleField } from "../scenes/ParticleField";
import { GlobeAnimation } from "../scenes/GlobeAnimation";
import { LogoExtrude3D } from "../scenes/LogoExtrude3D";
import { ShaderBackground3D } from "../scenes/ShaderBackground3D";

const theme = getPreset("Apple");

const ICON_BOLT = "M13 2 3 14h7l-1 8 11-12h-7z";

export const Product3DRevealDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <Product3DReveal
        shape="rounded-box"
        title="Designed in 3D."
        subtitle="A new dimension of product storytelling."
        startFrame={5}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const ParticleFieldDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <ParticleField background="theme" count={500} />
    </AbsoluteFill>
  </ThemeProvider>
);

export const GlobeAnimationDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <GlobeAnimation
        heading="Available worldwide"
        pins={[
          { lat: 37.77, lng: -122.42, showAtFrame: 40 },
          { lat: 51.51, lng: -0.13, showAtFrame: 50 },
          { lat: 35.68, lng: 139.69, showAtFrame: 60 },
          { lat: -33.87, lng: 151.21, showAtFrame: 70 },
        ]}
        arcs={[
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3 },
        ]}
      />
    </AbsoluteFill>
  </ThemeProvider>
);

export const LogoExtrude3DDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <LogoExtrude3D path={ICON_BOLT} title="Bolt" startFrame={5} />
    </AbsoluteFill>
  </ThemeProvider>
);

export const ShaderBackground3DDemo: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      <ShaderBackground3D variant="light-rays" heading="Premium Visuals" />
    </AbsoluteFill>
  </ThemeProvider>
);
