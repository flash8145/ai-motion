import React from "react";
import { useTheme } from "../../theme/ThemeProvider";

interface BrowserChromeProps {
  /** URL shown in the address bar */
  url?: string;
  /** Content rendered inside the browser viewport */
  children: React.ReactNode;
  /** Width of the browser frame. Default: 960 */
  width?: number;
  /** Height of the browser frame. Default: 600 */
  height?: number;
  /** Additional styles on the outer wrapper */
  style?: React.CSSProperties;
}

/**
 * BrowserChrome — An OS-styled mock browser container with
 * traffic-light buttons, address bar, and clean shadow.
 */
export const BrowserChrome: React.FC<BrowserChromeProps> = ({
  url = "https://app.example.com",
  children,
  width = 960,
  height = 600,
  style,
}) => {
  const theme = useTheme();

  const isDark =
    theme.colors.background === "#000000" ||
    theme.colors.background.startsWith("#0") ||
    theme.colors.background.startsWith("#1");

  const chromeBackground = isDark ? "#1E1E1E" : "#F5F5F5";
  const barBackground = isDark ? "#2A2A2A" : "#E8E8E8";
  const barTextColor = isDark ? "#AAAAAA" : "#666666";

  return (
    <div
      style={{
        width,
        borderRadius: theme.borderRadius,
        overflow: "hidden",
        boxShadow: isDark
          ? "0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.06)"
          : "0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {/* ─── Title Bar ──────────────────────────────────── */}
      <div
        style={{
          height: 44,
          backgroundColor: chromeBackground,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          paddingRight: 16,
          gap: 8,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 7, marginRight: 12 }}>
          {(["#FF5F57", "#FEBC2E", "#28C840"] as const).map((c) => (
            <div
              key={c}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: c,
              }}
            />
          ))}
        </div>

        {/* Address bar */}
        <div
          style={{
            flex: 1,
            height: 28,
            borderRadius: 6,
            backgroundColor: barBackground,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          {/* Lock icon */}
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginRight: 6, flexShrink: 0 }}
          >
            <path
              d="M17 11V7a5 5 0 0 0-10 0v4M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z"
              stroke={barTextColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: theme.resolvedFonts.body,
              fontSize: 12,
              color: barTextColor,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {url}
          </span>
        </div>
      </div>

      {/* ─── Viewport ───────────────────────────────────── */}
      <div
        style={{
          height: height - 44,
          backgroundColor: theme.colors.background,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};
