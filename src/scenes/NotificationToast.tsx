import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";

interface ToastItem {
  title: string;
  body?: string;
  icon?: string;
  appName?: string;
  accent?: string;
}

interface NotificationToastProps {
  notifications: ToastItem[];
  backgroundColor?: string;
  /** "center" (hero) or "top-right" (corner stack). Default center. */
  position?: "center" | "top-right";
  startFrame?: number;
  stagger?: number;
}

/**
 * NotificationToast — themeable notification toasts sliding in as a stack.
 * Product-agnostic: branded with the user's colors and copy. A common
 * marketing beat ("ding — you got paid").
 */
export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  backgroundColor,
  position = "center",
  startFrame = 6,
  stagger = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const corner = position === "top-right";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        flexDirection: "column",
        alignItems: corner ? "flex-end" : "center",
        justifyContent: corner ? "flex-start" : "center",
        padding: corner ? 48 : 0,
        gap: 18,
      }}
    >
      {notifications.map((n, i) => {
        const itemStart = startFrame + i * stagger;
        const s = spring({
          frame: frame - itemStart,
          fps,
          config: SPRING_PRESETS.snappy,
          durationInFrames: 26,
        });
        const x = interpolate(s, [0, 1], [60, 0]);
        const opacity = interpolate(frame - itemStart, [0, 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const accent = n.accent ?? theme.colors.primary;
        return (
          <div
            key={`toast-${i}`}
            style={{
              width: 540,
              maxWidth: "82%",
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              padding: "18px 20px",
              borderRadius: 18,
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
              transform: `translateX(${x}px)`,
              opacity,
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 13,
                background: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                flexShrink: 0,
              }}
            >
              {n.icon ?? "🔔"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.resolvedFonts.body,
                    fontSize: 15,
                    fontWeight: 700,
                    color: theme.colors.text,
                  }}
                >
                  {n.appName ?? n.title}
                </span>
                <span
                  style={{
                    fontFamily: theme.resolvedFonts.body,
                    fontSize: 13,
                    color: theme.colors.mutedText,
                  }}
                >
                  now
                </span>
              </div>
              {n.appName && (
                <div
                  style={{
                    fontFamily: theme.resolvedFonts.body,
                    fontSize: 17,
                    fontWeight: 600,
                    color: theme.colors.text,
                    marginTop: 2,
                  }}
                >
                  {n.title}
                </div>
              )}
              {n.body && (
                <div
                  style={{
                    fontFamily: theme.resolvedFonts.body,
                    fontSize: 15,
                    lineHeight: 1.4,
                    color: theme.colors.mutedText,
                    marginTop: 3,
                  }}
                >
                  {n.body}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
