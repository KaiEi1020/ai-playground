import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;
export const VIDEO_DURATION_FRAMES = 750;

export const colors = {
  background: "#080B14",
  panel: "rgba(255,255,255,0.09)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.68)",
  accent: "#32D3FF",
  warning: "#FFD166",
  opinion: "#A78BFA",
};

export function TemplateShell({ children, accent = colors.accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 20% 10%, ${accent}44 0, transparent 34%), linear-gradient(160deg, #080B14 0%, #111827 100%)`,
        color: colors.text,
        fontFamily: "Noto Sans SC, sans-serif",
        padding: 72,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 40,
          border: "2px solid rgba(255,255,255,0.08)",
          borderRadius: 44,
        }}
      />
      {children}
    </AbsoluteFill>
  );
}

export function AnimatedText({
  children,
  start,
  style,
}: {
  children: React.ReactNode;
  start: number;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [start, start + 18], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>
      {children}
    </div>
  );
}

export function SourceBadge({ sourceName }: { sourceName: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        bottom: 64,
        fontSize: 28,
        color: colors.muted,
        padding: "14px 22px",
        background: colors.panel,
        borderRadius: 999,
      }}
    >
      来源：{sourceName}
    </div>
  );
}
