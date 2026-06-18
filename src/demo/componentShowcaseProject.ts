/**
 * componentShowcaseProject — a self-contained reel that exercises the newer
 * component library: typography scenes, UI (framing + atoms), cursor overlays,
 * rich transitions, and the modifier layer (camera / lighting / motion design).
 *
 * Registered as the "ComponentShowcase" composition in Root.tsx.
 * Render:  npx remotion render ComponentShowcase out/component-showcase.mp4
 */
import type { VideoProject } from "../types/schema";
import { getPreset } from "../theme/presets";

const BLUE = "#3A86FF";
const PURPLE = "#8338EC";
const PINK = "#FF006E";

export const componentShowcaseProject: VideoProject = {
  version: "1.0.0",
  metadata: {
    title: "Component Showcase",
    width: 1920,
    height: 1080,
    fps: 30,
    totalDurationSec: 25, // 750 frames — matches the scene durations below
  },
  theme: getPreset("Midnight"),
  scenes: [
    // 1 — Title (gradient headline) with a push-in + god rays
    {
      id: "s1-title",
      type: "GradientHeadline",
      durationFrames: 90,
      transitionIn: { type: "portal", durationFrames: 22, params: { ringColor: BLUE } },
      props: {
        text: "MOTION PLATFORM",
        subtitle: "A component library for premium AI video",
        colors: [BLUE, PURPLE, PINK],
        fontSize: 130,
      },
      modifiers: [
        { type: "CameraPushIn", params: { toScale: 1.08 } },
        { type: "VolumetricLight", params: { originY: 0, color: BLUE, intensity: 0.3 } },
      ],
    },

    // 2 — Split text reveal inside a glowing frame
    {
      id: "s2-split",
      type: "SplitTextReveal",
      durationFrames: 80,
      transitionIn: { type: "blur", durationFrames: 18 },
      props: { text: "Sixty components. One pipeline.", fontSize: 92 },
      modifiers: [{ type: "GlowFrame", params: { color: BLUE, glow: 26 } }],
    },

    // 3 — Typewriter "terminal" with a scan line
    {
      id: "s3-typer",
      type: "TypewriterPro",
      durationFrames: 100,
      transitionIn: { type: "slide", durationFrames: 16, params: { direction: "up" } },
      props: {
        lines: [
          "$ motion generate --prompt \"launch video\"",
          "✓ scene graph built  ·  12 scenes",
          "✓ rendering 1920×1080 @ 30fps …",
        ],
        fontSize: 48,
        cursorColor: BLUE,
      },
      modifiers: [{ type: "ScanLine", params: { color: BLUE, crt: 1, period: 80 } }],
    },

    // 4 — Command palette (atom) with a subtle push-in
    {
      id: "s4-cmd",
      type: "CommandPalette",
      durationFrames: 90,
      transitionIn: { type: "scale", durationFrames: 18, params: { from: 0.6 } },
      props: {
        query: "add neon glow",
        results: [
          { icon: "✨", label: "Add GlowFrame modifier", hint: "⌘G" },
          { icon: "⚡", label: "Insert ScanLine", hint: "⌘L" },
          { icon: "🎥", label: "Frame product screenshot", hint: "⌘F" },
        ],
        activeIndex: 0,
        accentColor: BLUE,
      },
      modifiers: [{ type: "CameraPushIn", params: { toScale: 1.05 } }],
    },

    // 5 — AI chat panel, flipping in, with a roaming glow
    {
      id: "s5-chat",
      type: "ChatPanel",
      durationFrames: 110,
      transitionIn: { type: "card-flip", durationFrames: 22 },
      props: {
        title: "AI Director",
        accentColor: PURPLE,
        messages: [
          { role: "user", text: "Make me a launch video for my SaaS." },
          { role: "assistant", text: "On it — drafting a 12-scene reel with your brand colors." },
          { role: "user", text: "Add a product demo with a cursor." },
          { role: "assistant", text: "Done. Framed your screenshot and animated the click-through." },
        ],
        messageStagger: 24,
      },
      modifiers: [{ type: "MovingGlow", params: { color: PURPLE, intensity: 0.35 } }],
    },

    // 6 — Browser frame (product framing) driven by a human cursor + ripples
    {
      id: "s6-browser",
      type: "BrowserWindow",
      durationFrames: 120,
      transitionIn: { type: "morph", durationFrames: 20 },
      props: { url: "app.yourproduct.com", variant: "dark", widthFraction: 0.82 },
      modifiers: [{ type: "EdgeLight", params: { color: BLUE, intensity: 0.4 } }],
      overlays: [
        {
          id: "ov-cursor",
          type: "human-cursor",
          startTimeFrame: 12,
          durationFrames: 105,
          position: { x: 0, y: 0 },
          animation: { type: "fade", durationFrames: 8 },
          props: {
            color: "#FFFFFF",
            rippleColor: BLUE,
            path: [
              { x: 430, y: 820 },
              { x: 880, y: 360, click: true, label: "Dashboard" },
              { x: 1320, y: 600, click: true },
              { x: 760, y: 520 },
            ],
          },
        },
        {
          id: "ov-ripple",
          type: "click-ripple",
          startTimeFrame: 12,
          durationFrames: 105,
          position: { x: 0, y: 0 },
          animation: { type: "fade", durationFrames: 6 },
          props: {
            color: BLUE,
            clicks: [
              { x: 880, y: 360, atFrame: 28 },
              { x: 1320, y: 600, atFrame: 62 },
            ],
          },
        },
      ],
    },

    // 7 — Notification toasts sliding in, with a light sweep
    {
      id: "s7-notify",
      type: "NotificationToast",
      durationFrames: 80,
      transitionIn: { type: "slide", durationFrames: 16, params: { direction: "right" } },
      props: {
        notifications: [
          { appName: "Motion", title: "Render complete", body: "component-showcase.mp4 is ready", icon: "✅", accent: BLUE },
          { appName: "Stripe", title: "Payment received", body: "$2,400 from Acme Inc.", icon: "💳", accent: PURPLE },
        ],
        stagger: 16,
      },
      modifiers: [{ type: "LightSweep", params: { color: "#FFFFFF", intensity: 0.5 } }],
    },

    // 8 — Kinetic outro with a pulse ring + orbiting dots
    {
      id: "s8-outro",
      type: "KineticTypography",
      durationFrames: 80,
      transitionIn: { type: "grid", durationFrames: 20, params: { rows: 4, cols: 8 } },
      props: {
        lines: [
          { text: "Prompt in.", fontSize: 84, motion: "slide" },
          { text: "Premium video out.", fontSize: 104, color: BLUE, highlight: "rgba(58,134,255,0.12)", motion: "pop" },
        ],
        lineStagger: 10,
      },
      modifiers: [
        { type: "PulseRing", params: { color: BLUE, ringCount: 3 } },
        { type: "OrbitingDots", params: { color: PURPLE, count: 8, radiusX: 520, radiusY: 160 } },
      ],
    },
  ],
};
