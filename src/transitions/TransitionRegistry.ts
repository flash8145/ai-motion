/**
 * TransitionRegistry — maps rich transition `type` strings to their wrapper
 * components. The legacy style-based transitions (fade/slide-up/slide-left/
 * zoom/none) are NOT here — they stay in animation/transitions.ts. SceneWrapper
 * checks this registry first and falls back to the legacy style path.
 */
import type React from "react";
import type { TransitionComponentProps } from "./util";

import { MorphTransition } from "./MorphTransition";
import { ScaleTransition } from "./ScaleTransition";
import { SlideTransition } from "./SlideTransition";
import { BlurTransition } from "./BlurTransition";
import { GridTransition } from "./GridTransition";
import { PortalTransition } from "./PortalTransition";
import { CardFlip } from "./CardFlip";
import { PageTurn } from "./PageTurn";

export const TransitionRegistry: Record<
  string,
  React.FC<TransitionComponentProps>
> = {
  morph: MorphTransition,
  scale: ScaleTransition,
  slide: SlideTransition,
  blur: BlurTransition,
  grid: GridTransition,
  portal: PortalTransition,
  "card-flip": CardFlip,
  "page-turn": PageTurn,
};
