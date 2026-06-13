import React from "react";
import { useTheme } from "../../theme/ThemeProvider";

interface GlassPanelProps {
  children: React.ReactNode;
  /** Blur intensity in px. Default: 12 */
  blur?: number;
  /** Border radius override. Falls back to theme. */
  borderRadius?: number;
  /** Padding in px. Default: 32 */
  padding?: number;
  /** Additional styles */
  style?: React.CSSProperties;
}

/**
 * GlassPanel — A glassmorphic panel with backdrop-blur, subtle border,
 * and shadow. Automatically adapts to the active theme.
 */
export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  blur = 12,
  borderRadius: customRadius,
  padding = 32,
  style,
}) => {
  const theme = useTheme();

  const radius = customRadius ?? theme.borderRadius;

  const glassStyle: React.CSSProperties = theme.glassmorphism
    ? {
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: `${theme.colors.surface}CC`,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
      }
    : {
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
      };

  return (
    <div
      style={{
        borderRadius: radius,
        padding,
        ...glassStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
