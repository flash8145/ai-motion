/**
 * CursorPointer — the cursor glyph itself (macOS-style arrow). Shared by every
 * cursor overlay. `pressed` (0–1) scales it down for a click; `variant` swaps
 * to a grabbing hand for drag interactions.
 */
import React from "react";

interface CursorPointerProps {
  color?: string;
  size?: number;
  /** 0–1 click press depth. */
  pressed?: number;
  variant?: "arrow" | "grab";
  /** Optional glow color (AI cursor). */
  glow?: string;
}

export const CursorPointer: React.FC<CursorPointerProps> = ({
  color = "#FFFFFF",
  size = 24,
  pressed = 0,
  variant = "arrow",
  glow,
}) => {
  const scale = 1 - pressed * 0.16;
  const filter = glow
    ? `drop-shadow(0 0 8px ${glow}) drop-shadow(0 1px 2px rgba(0,0,0,0.4))`
    : "drop-shadow(0 1px 2px rgba(0,0,0,0.4))";

  if (variant === "grab") {
    const w = size * 1.1;
    return (
      <svg
        width={w}
        height={w}
        viewBox="0 0 32 32"
        fill="none"
        style={{ transform: `scale(${scale})`, filter }}
      >
        {/* simplified grabbing hand */}
        <path
          d="M9 14V9.5a2 2 0 014 0V13m0 0V8.5a2 2 0 014 0V13m0 0V9.5a2 2 0 014 0V15c0 5-3 8-7 8s-7-2-7-7v-2a2 2 0 014 0v1"
          fill={color}
          stroke="rgba(0,0,0,0.35)"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 24 31"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: "top left", filter }}
    >
      <path
        d="M1 1L1 22.5L6.5 17.5L11.5 27.5L15.5 25.5L10.5 15.5L18 15.5L1 1Z"
        fill={color}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={1.2}
      />
    </svg>
  );
};
