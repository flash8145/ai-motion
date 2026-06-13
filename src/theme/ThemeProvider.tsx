import React, { createContext, useContext, useMemo } from "react";
import type { Theme } from "../types/schema";
import { getPreset } from "./presets";
import { resolveFontFamily } from "./fonts";

// ─── Resolved Theme (with CSS-ready font families) ──────────────
export interface ResolvedTheme extends Theme {
  resolvedFonts: {
    heading: string;
    body: string;
    mono: string;
  };
}

const ThemeContext = createContext<ResolvedTheme | null>(null);

interface ThemeProviderProps {
  theme: Theme;
  children: React.ReactNode;
}

/**
 * Provides a resolved theme via React context. Resolves font names
 * to actual CSS fontFamily strings from @remotion/google-fonts.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  children,
}) => {
  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    return {
      ...theme,
      resolvedFonts: {
        heading: resolveFontFamily(theme.typography.headingFont),
        body: resolveFontFamily(theme.typography.bodyFont),
        mono: resolveFontFamily(theme.typography.monoFont),
      },
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access the current resolved theme.
 * Must be used inside a <ThemeProvider>.
 */
export function useTheme(): ResolvedTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback to Apple preset if used outside provider
    const fallback = getPreset("Apple");
    return {
      ...fallback,
      resolvedFonts: {
        heading: resolveFontFamily(fallback.typography.headingFont),
        body: resolveFontFamily(fallback.typography.bodyFont),
        mono: resolveFontFamily(fallback.typography.monoFont),
      },
    };
  }
  return ctx;
}
