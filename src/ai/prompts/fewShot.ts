export const FEW_SHOT_EXAMPLES = [
  {
    role: "user" as const,
    content: "Create a product launch video for a premium laptop featuring high-fidelity reveal transitions, 3D perspective camera panning, and glassmorphism styling in the style of Apple."
  },
  {
    role: "assistant" as const,
    content: JSON.stringify({
      version: "1.0.0",
      metadata: {
        title: "Apple Macbook Pro Launch",
        width: 1920,
        height: 1080,
        fps: 60,
        totalDurationSec: 15
      },
      theme: {
        stylePreset: "Apple",
        colors: {
          background: "#000000",
          surface: "#111111",
          primary: "#FFFFFF",
          secondary: "#86868B",
          text: "#F5F5F7",
          mutedText: "#86868B",
          accent: "#0066CC",
          border: "#2C2C2E",
          charts: ["#0066CC", "#34C759", "#FF9F0A"]
        },
        typography: {
          headingFont: "Inter",
          bodyFont: "Inter",
          monoFont: "JetBrains Mono"
        },
        glassmorphism: true,
        borderRadius: 20
      },
      scenes: [
        {
          id: "hero-text-reveal",
          type: "OverlayHeadline",
          durationFrames: 180,
          transitionIn: { type: "fade", durationFrames: 20 },
          camera: {
            type: "perspective",
            fov: 50,
            position: { "x": 0, "y": 0, "z": 900 }
          },
          textLayer: {
            tracking: 1.5,
            maskReveal: true,
            variableWeight: true
          },
          props: {
            title: "Mind-blowing. Head-turning.",
            subtitle: "MacBook Pro blasts forward with the M4 family of chips.",
            align: "center",
            titleStartFrame: 15,
            subtitleStartFrame: 60
          }
        },
        {
          id: "product-3d-reveal",
          type: "ProductReveal",
          durationFrames: 360,
          transitionIn: { type: "none", durationFrames: 0 },
          keyframes: [
            {
              "frame": 0,
              "value": 0.9,
              "easing": {
                "type": "cubic-bezier",
                "x1": 0.16,
                "y1": 1,
                "x2": 0.3,
                "y2": 1
              }
            },
            {
              "frame": 120,
              "value": 1.05
            }
          ],
          staggerGroup: {
            children: ["title", "subtitle", "image"],
            offsetFrames: 10,
            direction: "forward"
          },
          camera: {
            type: "perspective",
            fov: 48,
            position: { "x": 0, "y": 0, "z": 850 }
          },
          textLayer: {
            tracking: 2.0,
            maskReveal: true,
            variableWeight: true
          },
          props: {
            image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1920",
            title: "Pro. Beyond.",
            subtitle: "Liquid Retina XDR. The best display ever on a laptop.",
            startFrame: 0,
            titleStartFrame: 20,
            subtitleStartFrame: 70,
            imageStartFrame: 50,
            sweepStartFrame: 120,
            sweepDurationInFrames: 80,
            aspectRatio: "16 / 10"
          }
        },
        {
          id: "outro",
          type: "LogoRevealOutro",
          durationFrames: 360,
          transitionIn: { type: "fade", durationFrames: 20 },
          props: {
            startFrame: 0
          }
        }
      ]
    }, null, 2)
  },
  {
    role: "user" as const,
    content: "Create a SaaS launch video showing a high-fidelity interactive dashboard showcase, a modern line chart tracking financial growth, and a call-to-action section in the style of Stripe."
  },
  {
    role: "assistant" as const,
    content: JSON.stringify({
      version: "1.0.0",
      metadata: {
        title: "Stripe Finance Platform",
        width: 1920,
        height: 1080,
        fps: 60,
        totalDurationSec: 18
      },
      theme: {
        stylePreset: "Stripe",
        colors: {
          background: "#0A0D14",
          surface: "#121620",
          primary: "#635BFF",
          secondary: "#00D4B2",
          text: "#F6F9FC",
          mutedText: "#ADBDCC",
          accent: "#635BFF",
          border: "rgba(99, 91, 255, 0.15)",
          charts: ["#635BFF", "#00D4B2", "#FF5E84"]
        },
        typography: {
          headingFont: "Inter",
          bodyFont: "Inter",
          monoFont: "Fira Code"
        },
        glassmorphism: true,
        borderRadius: 16
      },
      scenes: [
        {
          id: "dashboard-tour",
          type: "DashboardShowcase",
          durationFrames: 360,
          transitionIn: { type: "slide-up", durationFrames: 20 },
          props: {
            url: "dashboard.stripe.com/payments",
            screenshotUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1920",
            browserWidth: 1400,
            browserHeight: 850,
            cursorKeyframes: [
              { "frame": 0, "x": 100, "y": 700 },
              { "frame": 90, "x": 600, "y": 300, "click": true },
              { "frame": 180, "x": 900, "y": 450, "click": true }
            ],
            enterFrame: 15,
            highlights: [
              { "text": "Volume Peak", "x": 600, "y": 300, "showAtFrame": 100 },
              { "text": "Instant Payouts Enabled", "x": 900, "y": 450, "showAtFrame": 190 }
            ]
          }
        },
        {
          id: "growth-chart",
          type: "ChartShowcase",
          durationFrames: 360,
          transitionIn: { type: "slide-left", durationFrames: 18 },
          props: {
            chartType: "line",
            heading: "Scale Globally, Faster.",
            subtitle: "Support instant payout rails in 40+ countries.",
            data: [
              { "label": "Jan", "value": 45000 },
              { "label": "Mar", "value": 98000 },
              { "label": "May", "value": 150000 },
              { "label": "Jul", "value": 290000 },
              { "label": "Sep", "value": 420000 },
              { "label": "Nov", "value": 680000 }
            ],
            chartWidth: 900,
            chartHeight: 400,
            headingStart: 10,
            chartStart: 40,
            showValues: true,
            showLabels: true
          }
        },
        {
          id: "cta",
          type: "CTASection",
          durationFrames: 360,
          transitionIn: { type: "fade", durationFrames: 20 },
          props: {
            headline: "Start Building with Stripe",
            description: "Join millions of companies using Stripe to scale their payments and operations.",
            buttonText: "Create Account",
            pricingText: "Pay-as-you-go pricing • No setup fees",
            features: [
              "99.99% Core API uptime",
              "Embedded checkout optimization",
              "Built-in fraud detection"
            ],
            enterFrame: 15
          }
        }
      ]
    }, null, 2)
  },
  {
    role: "user" as const,
    content: "Create a modern AI agent launch video with typewriter prompt card submission, followed by a Workspace timeline presentation panning/zooming, and a grid gallery of outputs."
  },
  {
    role: "assistant" as const,
    content: JSON.stringify({
      version: "1.0.0",
      metadata: {
        title: "Gemini Agent Orchestration",
        width: 1920,
        height: 1080,
        fps: 60,
        totalDurationSec: 18
      },
      theme: {
        stylePreset: "Futuristic",
        colors: {
          background: "#080710",
          surface: "#100F22",
          primary: "#7C3AED",
          secondary: "#06B6D4",
          text: "#F8FAFC",
          mutedText: "#64748B",
          accent: "#8B5CF6",
          border: "rgba(124, 58, 237, 0.2)",
          charts: ["#7C3AED", "#06B6D4", "#EC4899"]
        },
        typography: {
          headingFont: "Plus Jakarta Sans",
          bodyFont: "Inter",
          monoFont: "JetBrains Mono"
        },
        glassmorphism: true,
        borderRadius: 24
      },
      scenes: [
        {
          id: "prompt-input",
          type: "PromptCard",
          durationFrames: 360,
          transitionIn: { type: "fade", durationFrames: 15 },
          props: {
            prompt: "Design a luxury electric watch model, model it in WebGL with procedural carbon fiber textures, and compile a 3D reveal timeline.",
            placeholder: "Instruct Gemini Agent...",
            showSubmitButton: true,
            typingSpeed: 1.2,
            startFrame: 20
          }
        },
        {
          id: "agent-workspace",
          type: "WorkspaceShowcase",
          durationFrames: 360,
          transitionIn: { type: "slide-left", durationFrames: 20 },
          props: {
            title: "Autonomous Agent Execution",
            subtitle: "Watch the model build, compile, and render frame sequences.",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920",
            zoomAmount: 0.08,
            panAmount: 20,
            startFrame: 15
          }
        },
        {
          id: "gallery-output",
          type: "GalleryGrid",
          durationFrames: 360,
          transitionIn: { type: "slide-up", durationFrames: 20 },
          props: {
            images: [
              "#7C3AED",
              "#06B6D4",
              "#EC4899",
              "#3B82F6",
              "#10B981",
              "#F59E0B"
            ],
            columns: 3,
            startFrame: 20,
            itemStagger: 10
          }
        }
      ]
    }, null, 2)
  }
];
