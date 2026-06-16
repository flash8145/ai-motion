import React, { useEffect, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender } from "remotion";
import { Lottie, type LottieAnimationData } from "@remotion/lottie";
import { useTheme } from "../theme/ThemeProvider";

interface LottieSceneProps {
  /** URL of a Lottie JSON file. Ignored if `animationData` is provided directly. */
  src?: string;
  /** Inline Lottie animation data, if already available. */
  animationData?: LottieAnimationData;
  loop?: boolean;
  playbackRate?: number;
  width?: number;
  height?: number;
  background?: "theme" | "transparent";
}

/**
 * LottieScene — embeds a frame-accurate Lottie animation (e.g. exported
 * from After Effects via Bodymovin) into the video timeline.
 */
export const LottieScene: React.FC<LottieSceneProps> = ({
  src,
  animationData: providedData,
  loop = false,
  playbackRate = 1,
  width,
  height,
  background = "transparent",
}) => {
  const theme = useTheme();
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(
    providedData ?? null
  );

  useEffect(() => {
    if (providedData || !src) return;

    const handle = delayRender(`Loading Lottie animation: ${src}`);
    fetch(src)
      .then((res) => res.json())
      .then((json) => {
        setAnimationData(json as LottieAnimationData);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [src, providedData]);

  const backgroundColor =
    background === "theme" ? theme.colors.background : "transparent";

  if (!animationData) {
    return <AbsoluteFill style={{ backgroundColor }} />;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        playbackRate={playbackRate}
        style={{ width: width ?? "auto", height: height ?? "auto" }}
      />
    </AbsoluteFill>
  );
};
