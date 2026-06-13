import React from "react";
import { Audio } from "@remotion/media";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface AudioTrackProps {
  /** URL of the audio file (remote or staticFile path) */
  src: string;
  /** Volume level 0..1. Default: 0.5 */
  volume?: number;
  /** Fade in duration in frames. Default: 30 */
  fadeInFrames?: number;
  /** Fade out duration in frames. Default: 30 */
  fadeOutFrames?: number;
}

/**
 * AudioTrack — Wraps Remotion's <Audio> with fade-in/out volume control.
 */
export const AudioTrack: React.FC<AudioTrackProps> = ({
  src,
  volume: maxVolume = 0.5,
  fadeInFrames = 30,
  fadeOutFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in
  const fadeIn = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeOutFrames, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const volume = Math.min(fadeIn, fadeOut) * maxVolume;

  return <Audio src={src} volume={volume} />;
};
