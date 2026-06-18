/**
 * ModifierRegistry — maps modifier `type` strings (from the Scene Graph JSON)
 * to their wrapper component implementations, mirroring SceneRegistry.
 *
 * Modifiers are nested around a scene by `applyModifiers()` in VideoProject.
 */
import React from "react";
import type { ModifierComponentProps } from "./types";

// ── Camera modifiers ─────────────────────────────────────────────
import { CameraPushIn } from "./camera/CameraPushIn";
import { CameraPullOut } from "./camera/CameraPullOut";
import { CameraDolly } from "./camera/CameraDolly";
import { CameraPan } from "./camera/CameraPan";
import { CameraTilt } from "./camera/CameraTilt";
import { CameraOrbit } from "./camera/CameraOrbit";
import { CameraRackFocus } from "./camera/CameraRackFocus";
import { CameraParallax } from "./camera/CameraParallax";
import { CameraWhipPan } from "./camera/CameraWhipPan";
import { CameraFollowPath } from "./camera/CameraFollowPath";

// ── Lighting modifiers ───────────────────────────────────────────
import { LightSweep } from "./lighting/LightSweep";
import { VolumetricLight } from "./lighting/VolumetricLight";
import { MovingGlow } from "./lighting/MovingGlow";
import { LensBloom } from "./lighting/LensBloom";
import { EdgeLight } from "./lighting/EdgeLight";
import { SpotlightReveal } from "./lighting/SpotlightReveal";
import { LightLeakOverlay } from "./lighting/LightLeakOverlay";
import { GradientWash } from "./lighting/GradientWash";

// ── Depth modifiers ──────────────────────────────────────────────
import { MultiLayerParallax } from "./depth/MultiLayerParallax";
import { DepthBlur } from "./depth/DepthBlur";
import { ForegroundParticles } from "./depth/ForegroundParticles";
import { FloatingElements } from "./depth/FloatingElements";
import { GlassDepthLayers } from "./depth/GlassDepthLayers";
import { PerspectiveWarp } from "./depth/PerspectiveWarp";

// ── Motion design modifiers ──────────────────────────────────────
import { GlowFrame } from "./motion/GlowFrame";
import { NeonLine } from "./motion/NeonLine";
import { EnergyWave } from "./motion/EnergyWave";
import { LightRibbon } from "./motion/LightRibbon";
import { PulseRing } from "./motion/PulseRing";
import { OrbitingDots } from "./motion/OrbitingDots";
import { GridPulse } from "./motion/GridPulse";
import { ScanLine } from "./motion/ScanLine";

export const ModifierRegistry: Record<
  string,
  React.FC<ModifierComponentProps>
> = {
  // Camera
  CameraPushIn,
  CameraPullOut,
  CameraDolly,
  CameraPan,
  CameraTilt,
  CameraOrbit,
  CameraRackFocus,
  CameraParallax,
  CameraWhipPan,
  CameraFollowPath,

  // Lighting
  LightSweep,
  VolumetricLight,
  MovingGlow,
  LensBloom,
  EdgeLight,
  SpotlightReveal,
  LightLeakOverlay,
  GradientWash,

  // Depth
  MultiLayerParallax,
  DepthBlur,
  ForegroundParticles,
  FloatingElements,
  GlassDepthLayers,
  PerspectiveWarp,

  // Motion design
  GlowFrame,
  NeonLine,
  EnergyWave,
  LightRibbon,
  PulseRing,
  OrbitingDots,
  GridPulse,
  ScanLine,
};

export type ModifierRegistryKey = keyof typeof ModifierRegistry;
