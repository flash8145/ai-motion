import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from "remotion";
import { ImageWithFallback } from "./ImageWithFallback";
import { SPRING_PRESETS } from "../animation/springs";

export type DeviceType = "macbook" | "browser" | "tablet";
export interface DeviceMediaSource {
  src: string;
  type?: "image" | "video";
  objectFit?: React.CSSProperties["objectFit"];
}

export type DeviceMedia =
  | string
  | DeviceMediaSource
  | React.ReactElement;

export interface DeviceMockupFrameProps {
  deviceType?: DeviceType;
  media?: DeviceMedia;
  scaleAnimation?: boolean;
  shadow?: boolean;
  width?: number;
  startFrame?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
}

const renderMedia = (
  media: DeviceMedia | undefined,
  children: React.ReactNode,
): React.ReactNode => {
  if (children) {
    return children;
  }

  if (!media) {
    return null;
  }

  if (React.isValidElement(media)) {
    return media;
  }

  if (typeof media === "string") {
    return (
      <ImageWithFallback
        src={media}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  if (media.type === "video") {
    return (
      <Video
        src={media.src}
        muted
        style={{
          width: "100%",
          height: "100%",
          // eslint-disable-next-line @remotion/no-object-fit-on-media-video
          objectFit: media.objectFit ?? "cover",
        }}
      />
    );
  }

  return (
    <ImageWithFallback
      src={media.src}
      style={{
        width: "100%",
        height: "100%",
        objectFit: media.objectFit ?? "cover",
      }}
    />
  );
};

export const DeviceMockupFrame: React.FC<DeviceMockupFrameProps> = ({
  deviceType = "macbook",
  media,
  scaleAnimation = true,
  shadow = true,
  width = 1180,
  startFrame = 0,
  backgroundColor = "#111111",
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 56,
  });

  const scale = scaleAnimation ? interpolate(entry, [0, 1], [0.86, 1]) : 1;
  const translateY = scaleAnimation ? interpolate(entry, [0, 1], [48, 0]) : 0;
  const opacity = interpolate(frame - startFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const aspectRatio =
    deviceType === "tablet" ? "4 / 3" : deviceType === "browser" ? "16 / 10" : "16 / 10";
  const bezel = deviceType === "tablet" ? 22 : 14;
  const topBarHeight = deviceType === "browser" ? 42 : 0;
  const radius = deviceType === "tablet" ? 34 : 22;

  return (
    <div
      style={{
        width,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        willChange: "opacity, transform",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio,
          borderRadius: radius,
          padding: bezel,
          paddingTop: bezel + topBarHeight,
          background: "linear-gradient(145deg, #2E2E32 0%, #070707 100%)",
          boxShadow: shadow
            ? "0 48px 120px rgba(0,0,0,0.42), 0 12px 32px rgba(0,0,0,0.28)"
            : undefined,
          overflow: "hidden",
        }}
      >
        {deviceType === "browser" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: topBarHeight,
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingLeft: 18,
              backgroundColor: "#F3F3F3",
            }}
          >
            {["#FF5F57", "#FEBC2E", "#28C840"].map((color) => (
              <div
                key={color}
                style={{ width: 11, height: 11, borderRadius: 99, backgroundColor: color }}
              />
            ))}
          </div>
        )}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: Math.max(10, radius - bezel),
            backgroundColor,
            overflow: "hidden",
          }}
        >
          {renderMedia(media, children)}
        </div>
      </div>
      {deviceType === "macbook" && (
        <div
          style={{
            height: 22,
            width: "82%",
            margin: "0 auto",
            borderRadius: "0 0 22px 22px",
            background: "linear-gradient(180deg, #B9BBC1 0%, #74767B 100%)",
            boxShadow: shadow ? "0 18px 42px rgba(0,0,0,0.18)" : undefined,
          }}
        />
      )}
    </div>
  );
};

export const DeviceMockupFrameExample: React.FC = () => (
  <DeviceMockupFrame deviceType="browser" width={1080}>
    <div style={{ width: "100%", height: "100%", background: "#F8F8F8" }} />
  </DeviceMockupFrame>
);
