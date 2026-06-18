import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useTheme } from "../theme/ThemeProvider";
import { SPRING_PRESETS } from "../animation/springs";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  title?: string;
  accentColor?: string;
  backgroundColor?: string;
  startFrame?: number;
  /** Frames between messages. Default 24 */
  messageStagger?: number;
  /** Show a typing indicator before assistant messages. Default true */
  showTyping?: boolean;
}

/**
 * ChatPanel — an AI chat conversation that plays out message by message, with a
 * typing indicator before assistant replies. Product-agnostic; themed to the
 * user's brand. Ideal for AI-assistant / agent products.
 */
export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  title = "Assistant",
  accentColor,
  backgroundColor,
  startFrame = 6,
  messageStagger = 24,
  showTyping = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const accent = accentColor ?? theme.colors.primary;

  const schedule = useMemo(
    () => messages.map((m, i) => ({ ...m, appearAt: startFrame + i * messageStagger })),
    [messages, startFrame, messageStagger],
  );

  const typingDur = 14;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor ?? theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 680,
          maxWidth: "84%",
          height: "78%",
          backgroundColor: theme.colors.surface,
          borderRadius: 22,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: "0 40px 90px rgba(0,0,0,0.32)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "18px 22px",
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ✦
          </div>
          <span
            style={{
              fontFamily: theme.resolvedFonts.body,
              fontSize: 18,
              fontWeight: 700,
              color: theme.colors.text,
            }}
          >
            {title}
          </span>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            justifyContent: "flex-end",
          }}
        >
          {schedule.map((m, i) => {
            const isUser = m.role === "user";
            const showTypingNow =
              showTyping &&
              !isUser &&
              frame >= m.appearAt - typingDur &&
              frame < m.appearAt;

            if (frame < m.appearAt - (showTypingNow ? typingDur : 0)) return null;

            if (showTypingNow) {
              return (
                <TypingBubble key={`typing-${i}`} color={theme.colors.background} accent={theme.colors.mutedText} frame={frame} />
              );
            }

            const s = spring({
              frame: frame - m.appearAt,
              fps,
              config: SPRING_PRESETS.snappy,
              durationInFrames: 22,
            });
            const y = interpolate(s, [0, 1], [16, 0]);
            const opacity = interpolate(frame - m.appearAt, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={`msg-${i}`}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "76%",
                  padding: "14px 18px",
                  borderRadius: 18,
                  borderBottomRightRadius: isUser ? 4 : 18,
                  borderBottomLeftRadius: isUser ? 18 : 4,
                  backgroundColor: isUser ? accent : theme.colors.background,
                  color: isUser ? "#FFFFFF" : theme.colors.text,
                  border: isUser ? "none" : `1px solid ${theme.colors.border}`,
                  fontFamily: theme.resolvedFonts.body,
                  fontSize: 19,
                  lineHeight: 1.4,
                  transform: `translateY(${y}px)`,
                  opacity,
                  willChange: "transform, opacity",
                }}
              >
                {m.text}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TypingBubble: React.FC<{ color: string; accent: string; frame: number }> = ({
  color,
  accent,
  frame,
}) => (
  <div
    style={{
      alignSelf: "flex-start",
      display: "flex",
      gap: 6,
      padding: "16px 18px",
      borderRadius: 18,
      borderBottomLeftRadius: 4,
      backgroundColor: color,
    }}
  >
    {[0, 1, 2].map((d) => {
      const o = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame * 0.3 - d * 0.9));
      return (
        <div
          key={d}
          style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: accent, opacity: o }}
        />
      );
    })}
  </div>
);
