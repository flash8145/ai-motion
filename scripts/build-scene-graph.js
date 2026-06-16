const fs = require('fs');
const path = require('path');

const fps = 24;
const width = 1920;
const height = 1080;
const totalDurationFrames = 76 * fps;

function makeScene(id, templateRef, startFrame, durationFrames, cameraProfile, layers, transitionOut) {
  return { id, templateRef, startFrame, durationFrames, cameraProfile, layers, transitionOut };
}

const sceneGraph = {
  version: '2.0.0',
  metadata: {
    title: 'Google Flow / Gemini Omni - Reverse-Engineered Composition',
    width,
    height,
    fps,
    totalDurationFrames,
    sourceDurationSec: 75.93
  },
  theme: {
    stylePreset: 'DarkUI',
    colors: {
      background: '#0A0A0A',
      surface: '#111111',
      surfaceElevated: '#1A1A1A',
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
      mutedText: '#71717A',
      accent: '#8B5CF6',
      border: 'rgba(255,255,255,0.08)',
      overlay: 'rgba(0,0,0,0.55)'
    },
    typography: {
      headingFont: 'SF Pro Display, Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      monoFont: 'JetBrains Mono, monospace'
    },
    borderRadius: 24,
    glassmorphism: true
  },
  defs: {
    easings: {
      easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
      easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
      easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      linear: 'linear',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    animationPresets: {
      fadeIn: {
        property: 'opacity',
        keyframes: [
          { frame: 0, value: 0, easing: 'easeOutCubic' },
          { frame: 1, value: 1, easing: 'easeOutCubic' }
        ]
      },
      slideUp: {
        property: 'translateY',
        keyframes: [
          { frame: 0, value: 40, easing: 'easeOutExpo' },
          { frame: 1, value: 0, easing: 'easeOutExpo' }
        ]
      },
      slideRight: {
        property: 'translateHoz',
        keyframes: [
          { frame: 0, value: -60, easing: 'easeOutExpo' },
          { frame: 1, value: 0, easing: 'easeOutExpo' }
        ]
      },
      slideFromRight: {
        property: 'translateX',
        keyframes: [
          { frame: 0, value: 100, easing: 'easeOutExpo' },
          { frame: 1, value: 0, easing: 'easeOutExpo' }
        ]
      },
      scaleUp: {
        property: 'scale',
        keyframes: [
          { frame: 0, value: 0.85, easing: 'spring' },
          { frame: 1, value: 1, easing: 'spring' }
        ]
      },
      blurIn: {
        property: 'blur',
        keyframes: [
          { frame: 0, value: 8, easing: 'easeOutCubic' },
          { frame: 1, value: 0, easing: 'easeOutCubic' }
        ]
      },
      typewriter: {
        property: 'clipPathReveal',
        keyframes: [
          { frame: 0, value: 0, easing: 'linear' },
          { frame: 1, value: 1, easing: 'linear' }
        ]
      },
      glowPulse: {
        property: 'boxShadowGlow',
        keyframes: [
          { frame: 0, value: '0 0 0 rgba(255,255,255,0)', easing: 'easeInOutCubic' },
          { frame: 0.5, value: '0 0 24px rgba(139,92,246,0.4)', easing: 'easeInOutCubic' },
          { frame: 1, value: '0 0 0 rgba(255,255,255,0)', easing: 'easeInOutCubic' }
        ]
      },
      progressReveal: {
        property: 'grayscale',
        keyframes: [
          { frame: 0, value: 1, easing: 'linear' },
          { frame: 1, value: 0, easing: 'linear' }
        ]
      }
    },
    effects: {
      dropShadow: {
        type: 'boxShadow',
        value: '0 12px 36px rgba(0,0,0,0.35)'
      },
      lightSweep: {
        type: 'gradientOverlay',
        config: {
          angle: '45deg',
          stops: ['rgba(255,255,255,0) 0%', 'rgba(255,255,255,0.15) 50%', 'rgba(255,255,255,0) 100%'],
          motion: { translateX: [-500, 500], durationFrames: 60 }
        }
      },
      depthOfField: {
        type: 'blur',
        config: { blurAmount: 6, maskByDepth: true }
      },
      glassSurface: {
        type: 'background',
        config: {
          background: 'rgba(26,26,26,0.65)',
          backdropFilter: 'blur(12px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24
        }
      }
    },
    cameraProfiles: {
      dollyIn: {
        property: 'scale',
        keyframes: [
          { frame: 0, value: 0.9, easing: 'easeOutCubic' },
          { frame: 1, value: 1.3, easing: 'easeOutCubic' }
        ]
      },
      panLeft: {
        property: 'translateX',
        keyframes: [
          { frame: 0, value: 0, easing: 'easeInOutCubic' },
          { frame: 1, value: -200, easing: 'easeInOutCubic' }
        ]
      },
      panRight: {
        property: 'translateX',
        keyframes: [
          { frame: 0, value: 0, easing: 'easeInOutCubic' },
          { frame: 1, value: 200, easing: 'easeInOutCubic' }
        ]
      },
      gentleOrbit: {
        property: 'rotateY',
        keyframes: [
          { frame: 0, value: -5, easing: 'easeInOutCubic' },
          { frame: 0.5, value: 0, easing: 'easeInOutCubic' },
          { frame: 1, value: 5, easing: 'easeInOutCubic' }
        ]
      }
    },
    componentTemplates: {
      TextOverlay: {
        type: 'text',
        defaultStyle: {
          fontFamily: 'headingFont',
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.2
        },
        animatableProps: ['opacity', 'translateY', 'translateX', 'scale', 'blur', 'letterSpacing'],
        acceptedOverrides: ['text', 'fontSize', 'fontWeight', 'color', 'maxWidth', 'lineClamp']
      },
      PromptBar: {
        type: 'UI element',
        defaultStyle: {
          background: 'surfaceElevated',
          borderRadius: 56,
          padding: [16, 24],
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        },
        animatableProps: ['opacity', 'translateY', 'scale', 'width'],
        acceptedOverrides: ['placeholder', 'typedText', 'cursorBlink', 'suggestions']
      },
      ChatPanel: {
        type: 'UI element',
        defaultStyle: {
          width: 480,
          background: 'surface',
          borderRadius: 24,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        },
        animatableProps: ['opacity', 'translateX', 'translateY', 'scale'],
        acceptedOverrides: ['messages', 'typingIndicators', 'title']
      },
      ImageGrid: {
        type: 'image',
        defaultStyle: {
          display: 'grid',
          gap: 12,
          borderRadius: 24,
          overflow: 'hidden'
        },
        animatableProps: ['opacity', 'scale', 'translateY', 'rotate'],
        acceptedOverrides: ['columns', 'images', 'staggerDelay', 'aspectRatio']
      },
      VideoPlayer: {
        type: 'UI element',
        defaultStyle: {
          background: 'surface',
          borderRadius: 16,
          overflow: 'hidden'
        },
        animatableProps: ['opacity', 'scale', 'translateX', 'translateY'],
        acceptedOverrides: ['src', 'poster', 'controls', 'progress']
      },
      UIBoard: {
        type: 'UI element',
        defaultStyle: {
          background: 'transparent',
          perspective: 1200,
          transformStyle: 'preserve-3d'
        },
        animatableProps: ['translateX', 'translateY', 'translateZ', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'blur'],
        acceptedOverrides: ['panels', 'panelCount', 'cameraTarget']
      },
      ProgressCell: {
        type: 'image',
        defaultStyle: {
          borderRadius: 16,
          overflow: 'hidden',
          filter: 'grayscale(1)'
        },
        animatableProps: ['opacity', 'scale', 'grayscale', 'progress'],
        acceptedOverrides: ['src', 'progress', 'label', 'colorizeOnComplete']
      },
      EndCardLogo: {
        type: 'UI element',
        defaultStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16
        },
        animatableProps: ['opacity', 'scale', 'glowIntensity'],
        acceptedOverrides: ['logoSrc', 'tagline', 'disclaimer']
      }
    }
  },
  scenes: [],
  effects: {
    global: [
      { type: 'depthOfField', targetLayerId: 'focus-image', intensity: 0.5 }
    ],
    perScene: [
      { sceneId: 'scene-intro-reveal', type: 'blur', value: 12, easing: 'easeInOutCubic' },
      { sceneId: 'scene-board-orbit', type: 'lightSweep', value: 1 },
      { sceneId: 'scene-end-card', type: 'lightSweep', value: 1 }
    ]
  },
  transitions: {
    default: { type: 'crossfade', durationFrames: 18, easing: 'easeInOutCubic' }
  }
};

// Scene 1: Intro
sceneGraph.scenes.push(makeScene('scene-intro-reveal', 'TextOverlay', 0, 72, null, [
  {
    id: 'bg-collage',
    componentType: 'ImageGrid',
    zIndex: 0,
    transform: { x: 0, y: 0, scale: 1.1, opacity: 0.25, rotate: 0 },
    animations: [
      { preset: 'scaleUp', durationFrames: 72, startFrame: 0 },
      { preset: 'fadeIn', durationFrames: 24, startFrame: 0 }
    ]
  },
  {
    id: 'headline-intro',
    componentType: 'TextOverlay',
    zIndex: 10,
    transform: { x: 960, y: 540, scale: 1, opacity: 0 },
    style: { fontSize: 88, fontWeight: 600, maxWidth: 1400, textAlign: 'center' },
    animations: [
      { preset: 'slideUp', durationFrames: 48, startFrame: 8 },
      { preset: 'fadeIn', durationFrames: 32, startFrame: 8 }
    ],
    props: { text: 'Amplify your vision and unlock your best work' }
  }
], { type: 'blur', durationFrames: 18, easing: 'easeInOutCubic' }));

// Scene 2: UI Narrative
sceneGraph.scenes.push(makeScene('scene-ui-narrative', 'UIBoard', 72, 120, 'gentleOrbit', [
  {
    id: 'ui-board-intro',
    componentType: 'UIBoard',
    zIndex: 0,
    transform: { x: 960, y: 540, scale: 0.9, opacity: 0, rotateY: -8 },
    animations: [
      { preset: 'scaleUp', durationFrames: 60, startFrame: 0 },
      { preset: 'fadeIn', durationFrames: 40, startFrame: 0 },
      { preset: 'blurIn', durationFrames: 40, startFrame: 0 }
    ],
    props: { panels: 6, panelImages: [], layout: 'grid-3-2' }
  },
  {
    id: 'overlay-ui-text',
    componentType: 'TextOverlay',
    zIndex: 20,
    transform: { x: 960, y: 540, scale: 1, opacity: 0 },
    animations: [
      { preset: ', // hmm I will stop and review)
