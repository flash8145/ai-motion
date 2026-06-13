import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { GlassPanel } from "../components/primitives/GlassPanel";
import { GradientBackground } from "../components/primitives/GradientBackground";
import { NoiseTexture } from "../components/primitives/NoiseTexture";
import { AnimatedText } from "../components/primitives/AnimatedText";
import { SPRING_PRESETS } from "../animation/springs";

interface InteractiveCodeMockupProps {
  heading?: string;
  subtitle?: string;
  codeLines?: string[];
  fileName?: string;
  highlightedLines?: number[]; // 1-indexed
  headingStart?: number;
  mockupStart?: number;
  typingSpeed?: number; // characters per frame
}

// Simple syntax highligher for javascript/typescript/json
function highlightCode(text: string, themeColors: { mutedText: string; secondary: string; accent: string }): React.ReactNode[] {
  // Regex for keywords, comments, strings
  const tokens = text.split(/(\/\/.*|"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\b(?:import|from|const|let|var|function|return|async|await|if|else|true|false|class|extends|new|export|default|type|interface|from)\b|\s+)/g);

  return tokens.map((token, i) => {
    if (token.startsWith("//")) {
      // Comment
      return <span key={i} style={{ color: themeColors.mutedText, opacity: 0.7, fontStyle: "italic" }}>{token}</span>;
    }
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
      // String
      return <span key={i} style={{ color: themeColors.secondary }}>{token}</span>;
    }
    if (/^(?:import|from|const|let|var|function|return|async|await|if|else|true|false|class|extends|new|export|default|type|interface|from)$/.test(token)) {
      // Keyword
      return <span key={i} style={{ color: themeColors.accent, fontWeight: "bold" }}>{token}</span>;
    }
    // Default text
    return <span key={i}>{token}</span>;
  });
}

export const InteractiveCodeMockup: React.FC<InteractiveCodeMockupProps> = ({
  heading = "Declarative Video Coding",
  subtitle = "Write React code, render video dynamically at scale",
  codeLines = [
    "import { renderMedia } from \"@remotion/renderer\";",
    "import { bundle } from \"@remotion/bundler\";",
    "",
    "// Render your Video Project",
    "const bundled = await bundle({",
    "  entryPoint: \"src/index.ts\",",
    "});",
    "",
    "await renderMedia({",
    "  composition: \"VideoProject\",",
    "  serveUrl: bundled,",
    "  codec: \"h264\",",
    "  concurrency: 2,",
    "});"
  ],
  fileName = "render.ts",
  highlightedLines = [9, 10, 11, 12, 13, 14],
  headingStart = 5,
  mockupStart = 20,
  typingSpeed = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Entrance spring animation
  const entranceSpring = spring({
    frame: frame - mockupStart,
    fps,
    config: SPRING_PRESETS.smooth,
    durationInFrames: 35,
  });

  const mockupY = interpolate(entranceSpring, [0, 1], [50, 0]);
  const mockupScale = interpolate(entranceSpring, [0, 1], [0.95, 1]);
  const mockupOpacity = interpolate(frame - mockupStart, [0, 15], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flat text calculations
  const fullText = useMemo(() => codeLines.join("\n"), [codeLines]);
  const typingStartFrame = mockupStart + 15;
  const typedCharCount = Math.max(0, Math.floor((frame - typingStartFrame) * typingSpeed));
  const isTypingDone = typedCharCount >= fullText.length;

  // Split typed text back into lines
  const currentLines = useMemo(() => {
    const lines = [];
    let charsRemaining = typedCharCount;
    for (const line of codeLines) {
      if (charsRemaining <= 0) break;
      if (charsRemaining >= line.length) {
        lines.push(line);
        charsRemaining -= line.length + 1; // +1 for the newline character
      } else {
        lines.push(line.slice(0, charsRemaining));
        charsRemaining = 0;
      }
    }
    return lines;
  }, [codeLines, typedCharCount]);

  // Cursor blinking
  const showCursor = !isTypingDone || Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill>
      <GradientBackground opacity={0.4} />
      <NoiseTexture />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 60px",
          gap: 20,
        }}
      >
        {/* Titles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
          {heading && (
            <AnimatedText
              text={heading}
              splitBy="words"
              staggerFrames={3}
              startFrame={headingStart}
              fontSize={40}
              fontWeight={700}
              isHeading
            />
          )}

          {subtitle && (
            <AnimatedText
              text={subtitle}
              splitBy="words"
              staggerFrames={2}
              startFrame={headingStart + 8}
              fontSize={18}
              fontWeight={400}
              color={theme.colors.mutedText}
              isHeading={false}
            />
          )}
        </div>

        {/* IDE mockup container */}
        <div
          style={{
            width: "100%",
            maxWidth: 860,
            transform: `translateY(${mockupY}px) scale(${mockupScale})`,
            opacity: mockupOpacity,
            willChange: "transform, opacity",
          }}
        >
          <GlassPanel
            padding={0}
            style={{
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
              borderRadius: theme.borderRadius,
            }}
          >
            {/* Header bar */}
            <div
              style={{
                height: 44,
                backgroundColor: `${theme.colors.surface}88`,
                borderBottom: `1px solid ${theme.colors.border}`,
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                position: "relative",
              }}
            >
              {/* Mac-like traffic light dots */}
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5F56" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27C93F" }} />
              </div>

              {/* Tab Title */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: theme.resolvedFonts.body,
                  fontSize: 13,
                  fontWeight: 500,
                  color: theme.colors.text,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>📄</span>
                {fileName}
              </div>
            </div>

            {/* Code Body area */}
            <div
              style={{
                padding: "24px 20px",
                display: "flex",
                flexDirection: "row",
                minHeight: 320,
                backgroundColor: theme.colors.surface,
              }}
            >
              {/* Line Numbers */}
              <div
                style={{
                  width: 32,
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: theme.resolvedFonts.mono,
                  fontSize: 14,
                  lineHeight: "22px",
                  color: theme.colors.mutedText,
                  opacity: 0.5,
                  textAlign: "right",
                  paddingRight: 12,
                  userSelect: "none",
                  borderRight: `1px solid ${theme.colors.border}`,
                }}
              >
                {codeLines.map((_, idx) => (
                  <div key={`ln-${idx}`}>{idx + 1}</div>
                ))}
              </div>

              {/* Code content Editor */}
              <div
                style={{
                  flex: 1,
                  fontFamily: theme.resolvedFonts.mono,
                  fontSize: 14,
                  lineHeight: "22px",
                  color: theme.colors.text,
                  paddingLeft: 16,
                  whiteSpace: "pre",
                  position: "relative",
                }}
              >
                {codeLines.map((line, idx) => {
                  const isLineHighlight = highlightedLines.includes(idx + 1) && isTypingDone;
                  // Highlight opacity spring
                  const highlightSpring = spring({
                    frame: frame - (typingStartFrame + (fullText.length / typingSpeed) + idx * 2),
                    fps,
                    config: SPRING_PRESETS.snappy,
                    durationInFrames: 15,
                  });
                  const highlightOpacity = interpolate(highlightSpring, [0, 1], [0, 0.12]);

                  const typedLine = currentLines[idx];
                  const hasContent = typedLine !== undefined;
                  const isCurrentTypingLine = idx === currentLines.length - 1 && !isTypingDone;

                  return (
                    <div
                      key={`code-line-${idx}`}
                      style={{
                        position: "relative",
                        minHeight: 22,
                        backgroundColor: isLineHighlight
                          ? `${theme.colors.primary}ff`
                          : "transparent",
                        borderRadius: 4,
                      }}
                    >
                      {/* Highlight Backdrop */}
                      {isLineHighlight && (
                        <div
                          style={{
                            position: "absolute",
                            left: -16,
                            right: -20,
                            top: 0,
                            bottom: 0,
                            backgroundColor: theme.colors.primary,
                            opacity: highlightOpacity,
                            pointerEvents: "none",
                          }}
                        />
                      )}

                      {/* Content */}
                      <span style={{ position: "relative", zIndex: 2 }}>
                        {hasContent ? highlightCode(typedLine, theme.colors) : ""}
                      </span>

                      {/* Typing Cursor */}
                      {isCurrentTypingLine && showCursor && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 8,
                            height: 15,
                            backgroundColor: theme.colors.primary,
                            marginLeft: 1,
                            verticalAlign: "middle",
                            boxShadow: `0 0 8px ${theme.colors.primary}`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Final idle blinking cursor at the end of typing */}
                {isTypingDone && showCursor && (
                  <span
                    style={{
                      position: "absolute",
                      left: 16 + (currentLines[currentLines.length - 1]?.length || 0) * 8.4, // approximate character width offset
                      bottom: 24, // adjust to match last line
                      display: "inline-block",
                      width: 2,
                      height: 16,
                      backgroundColor: theme.colors.primary,
                    }}
                  />
                )}
              </div>
            </div>
          </GlassPanel>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
