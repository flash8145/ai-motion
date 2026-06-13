/**
 * Font loading module using @remotion/google-fonts.
 *
 * Each font is loaded with specific weights and latin subset only
 * to keep bundle size minimal. Call the appropriate loader at the
 * top of your component or in ThemeProvider.
 */

import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { loadFont as loadFiraCode } from "@remotion/google-fonts/FiraCode";
import { loadFont as loadRobotoMono } from "@remotion/google-fonts/RobotoMono";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

// ─── Load All Fonts ─────────────────────────────────────────────
// We load them eagerly so they are available project-wide.

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const outfit = loadOutfit("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const roboto = loadRoboto("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

const firaCode = loadFiraCode("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

const robotoMono = loadRobotoMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

const jetBrainsMono = loadJetBrainsMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

// ─── Font Family Map ────────────────────────────────────────────
// Maps user-facing font names (from the theme preset) to their
// loaded fontFamily CSS strings.

export const FONT_FAMILIES: Record<string, string> = {
  Inter: inter.fontFamily,
  Outfit: outfit.fontFamily,
  Roboto: roboto.fontFamily,
  "Fira Code": firaCode.fontFamily,
  "Roboto Mono": robotoMono.fontFamily,
  "JetBrains Mono": jetBrainsMono.fontFamily,
};

/**
 * Resolves a font name from the theme to a CSS fontFamily value.
 * Falls back to the raw name if no loaded font matches.
 */
export function resolveFontFamily(fontName: string): string {
  return FONT_FAMILIES[fontName] ?? fontName;
}
