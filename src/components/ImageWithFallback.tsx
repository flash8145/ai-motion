import React, { useState } from "react";
import { Img, ImgProps } from "remotion";

export interface ImageWithFallbackProps extends Omit<ImgProps, "src"> {
  src?: string;
  fallback?: React.ReactNode;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallback,
  style,
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !src || src.trim().length === 0) {
    if (fallback) {
      return <>{fallback}</>;
    }
    // Default fallback - a simple styled div placeholder
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #121620 0%, #0A0D14 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.4)",
          fontSize: 14,
          ...style,
        }}
      >
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <Img
      src={src}
      onError={() => {
        console.warn(`Failed to load image: ${src}. Falling back.`);
        setError(true);
      }}
      style={style}
      {...props}
    />
  );
};
