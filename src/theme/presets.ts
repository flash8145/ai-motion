import type { Theme, StylePreset } from "../types/schema";

/**
 * Curated theme presets for the motion graphics platform.
 * Each preset defines a complete visual identity: colors, typography,
 * border radius, and glassmorphism toggle.
 */
export const THEME_PRESETS: Record<StylePreset, Theme> = {
  Apple: {
    stylePreset: "Apple",
    colors: {
      background: "#000000",
      surface: "#1C1C1E",
      primary: "#0A84FF",
      secondary: "#5E5CE6",
      text: "#FFFFFF",
      mutedText: "#98989D",
      accent: "#FF375F",
      border: "rgba(255, 255, 255, 0.08)",
      charts: ["#0A84FF", "#30D158", "#FF9F0A", "#FF375F", "#BF5AF2"],
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      monoFont: "Fira Code",
    },
    glassmorphism: true,
    borderRadius: 16,
  },

  Stripe: {
    stylePreset: "Stripe",
    colors: {
      background: "#0A2540",
      surface: "#163456",
      primary: "#635BFF",
      secondary: "#00D4AA",
      text: "#FFFFFF",
      mutedText: "#ADBDCC",
      accent: "#80E9D0",
      border: "rgba(255, 255, 255, 0.1)",
      charts: ["#635BFF", "#00D4AA", "#FF6B6B", "#FFD93D", "#6BCB77"],
    },
    typography: {
      headingFont: "Outfit",
      bodyFont: "Inter",
      monoFont: "Fira Code",
    },
    glassmorphism: true,
    borderRadius: 12,
  },

  Linear: {
    stylePreset: "Linear",
    colors: {
      background: "#111111",
      surface: "#1A1A1A",
      primary: "#5E6AD2",
      secondary: "#8B5CF6",
      text: "#EEEEEE",
      mutedText: "#7C7C7C",
      accent: "#C084FC",
      border: "rgba(255, 255, 255, 0.06)",
      charts: ["#5E6AD2", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"],
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      monoFont: "JetBrains Mono",
    },
    glassmorphism: false,
    borderRadius: 8,
  },

  Notion: {
    stylePreset: "Notion",
    colors: {
      background: "#FFFFFF",
      surface: "#F7F6F3",
      primary: "#2F3437",
      secondary: "#9B9A97",
      text: "#37352F",
      mutedText: "#9B9A97",
      accent: "#E16259",
      border: "rgba(55, 53, 47, 0.09)",
      charts: ["#2F3437", "#E16259", "#4DA8DA", "#91C483", "#F7C948"],
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      monoFont: "Roboto Mono",
    },
    glassmorphism: false,
    borderRadius: 6,
  },

  ModernSaaS: {
    stylePreset: "ModernSaaS",
    colors: {
      background: "#0F0F1A",
      surface: "#1A1A2E",
      primary: "#6C63FF",
      secondary: "#3F3D56",
      text: "#FFFFFF",
      mutedText: "#A0A0B2",
      accent: "#F50057",
      border: "rgba(108, 99, 255, 0.15)",
      charts: ["#6C63FF", "#F50057", "#00BFA5", "#FF6E40", "#AA00FF"],
    },
    typography: {
      headingFont: "Outfit",
      bodyFont: "Inter",
      monoFont: "Fira Code",
    },
    glassmorphism: true,
    borderRadius: 14,
  },

  Enterprise: {
    stylePreset: "Enterprise",
    colors: {
      background: "#F8F9FA",
      surface: "#FFFFFF",
      primary: "#1A73E8",
      secondary: "#5F6368",
      text: "#202124",
      mutedText: "#80868B",
      accent: "#EA4335",
      border: "rgba(0, 0, 0, 0.08)",
      charts: ["#1A73E8", "#EA4335", "#FBBC04", "#34A853", "#FF6D01"],
    },
    typography: {
      headingFont: "Roboto",
      bodyFont: "Roboto",
      monoFont: "Roboto Mono",
    },
    glassmorphism: false,
    borderRadius: 8,
  },

  Futuristic: {
    stylePreset: "Futuristic",
    colors: {
      background: "#0A0A0F",
      surface: "#12121A",
      primary: "#00F0FF",
      secondary: "#FF00E5",
      text: "#E0E0FF",
      mutedText: "#6B6B8D",
      accent: "#7B61FF",
      border: "rgba(0, 240, 255, 0.12)",
      charts: ["#00F0FF", "#FF00E5", "#7B61FF", "#00FF88", "#FFE600"],
    },
    typography: {
      headingFont: "Outfit",
      bodyFont: "Inter",
      monoFont: "JetBrains Mono",
    },
    glassmorphism: true,
    borderRadius: 12,
  },

  Neon: {
    stylePreset: "Neon",
    colors: {
      background: "#09090E",
      surface: "#14141F",
      primary: "#00FF66",
      secondary: "#00FFFF",
      text: "#FFFFFF",
      mutedText: "#9EA2C0",
      accent: "#FF0055",
      border: "rgba(0, 255, 102, 0.15)",
      charts: ["#00FF66", "#00FFFF", "#FF0055", "#FFFF00", "#9900FF"],
    },
    typography: {
      headingFont: "Outfit",
      bodyFont: "Inter",
      monoFont: "Fira Code",
    },
    glassmorphism: true,
    borderRadius: 10,
  },

  Minimal: {
    stylePreset: "Minimal",
    colors: {
      background: "#FFFFFF",
      surface: "#F8F9FA",
      primary: "#000000",
      secondary: "#4B5563",
      text: "#111827",
      mutedText: "#9CA3AF",
      accent: "#374151",
      border: "rgba(0, 0, 0, 0.08)",
      charts: ["#111827", "#4B5563", "#9CA3AF", "#D1D5DB", "#E5E7EB"],
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      monoFont: "JetBrains Mono",
    },
    glassmorphism: false,
    borderRadius: 0,
  },

  Warm: {
    stylePreset: "Warm",
    colors: {
      background: "#FAF6F0",
      surface: "#F3EBE0",
      primary: "#8C6239",
      secondary: "#D4A373",
      text: "#4A3B32",
      mutedText: "#A08A7C",
      accent: "#E07A5F",
      border: "rgba(140, 98, 57, 0.12)",
      charts: ["#8C6239", "#D4A373", "#E07A5F", "#F2CC8F", "#81B29A"],
    },
    typography: {
      headingFont: "Outfit",
      bodyFont: "Inter",
      monoFont: "Fira Code",
    },
    glassmorphism: false,
    borderRadius: 16,
  },

  Ocean: {
    stylePreset: "Ocean",
    colors: {
      background: "#0A192F",
      surface: "#172A45",
      primary: "#64FFDA",
      secondary: "#00B4D8",
      text: "#CCD6F6",
      mutedText: "#8892B0",
      accent: "#0077B6",
      border: "rgba(100, 255, 218, 0.12)",
      charts: ["#64FFDA", "#00B4D8", "#0077B6", "#90E0EF", "#0A192F"],
    },
    typography: {
      headingFont: "Outfit",
      bodyFont: "Inter",
      monoFont: "Fira Code",
    },
    glassmorphism: true,
    borderRadius: 12,
  },

  Sunset: {
    stylePreset: "Sunset",
    colors: {
      background: "#1A0B2E",
      surface: "#2D124D",
      primary: "#FF6B6B",
      secondary: "#FFBE0B",
      text: "#FFF0F5",
      mutedText: "#C5A3E8",
      accent: "#FF007F",
      border: "rgba(255, 107, 107, 0.15)",
      charts: ["#FF6B6B", "#FFBE0B", "#FF007F", "#8338EC", "#3A86C8"],
    },
    typography: {
      headingFont: "Outfit",
      bodyFont: "Inter",
      monoFont: "Fira Code",
    },
    glassmorphism: true,
    borderRadius: 20,
  },

  Midnight: {
    stylePreset: "Midnight",
    colors: {
      background: "#030303",
      surface: "#0D0D0D",
      primary: "#3A86FF",
      secondary: "#212529",
      text: "#E9ECEF",
      mutedText: "#6C757D",
      accent: "#8338EC",
      border: "rgba(255, 255, 255, 0.05)",
      charts: ["#3A86FF", "#8338EC", "#FF006E", "#FFBE0B", "#212529"],
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      monoFont: "JetBrains Mono",
    },
    glassmorphism: true,
    borderRadius: 8,
  },
};

/**
 * Gets a theme preset by name, falling back to Apple if not found.
 */
export function getPreset(preset: StylePreset): Theme {
  return THEME_PRESETS[preset] ?? THEME_PRESETS.Apple;
}
