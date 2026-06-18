/**
 * DepthBlur — tilt-shift / shallow depth-of-field. A focus band stays sharp
 * while the scene blurs toward the edges, faking a shallow focal plane. Uses
 * backdrop-filter so it blurs the scene beneath WITHOUT re-rendering it.
 *
 * params:
 *   focusY (50)                 — centre of the sharp band in % (vertical mode)
 *   focusBand (34)              — height of the fully-sharp band in %
 *   blur (10)                   — max blur in px at the edges
 *   shape ("vertical")          — "vertical" tilt-shift | "radial" centre focus
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { type ModifierComponentProps, readNumber, readString } from "../types";

export const DepthBlur: React.FC<ModifierComponentProps> = ({
  modifier,
  children,
}) => {
  const params = modifier.params;
  const focusY = readNumber(params, "focusY", 50);
  const band = readNumber(params, "focusBand", 34);
  const blur = readNumber(params, "blur", 10);
  const shape = readString(params, "shape", "vertical");

  const top = Math.max(0, focusY - band / 2);
  const bottom = Math.min(100, focusY + band / 2);

  // Opaque where we WANT blur (edges), transparent across the focus band.
  const mask =
    shape === "radial"
      ? `radial-gradient(ellipse ${100 - band}% ${100 - band}% at 50% ${focusY}%, transparent 40%, black 100%)`
      : `linear-gradient(180deg, black 0%, transparent ${top}%, transparent ${bottom}%, black 100%)`;

  const overlay: React.CSSProperties = {
    pointerEvents: "none",
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    maskImage: mask,
    WebkitMaskImage: mask,
  };

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={overlay} />
    </AbsoluteFill>
  );
};
