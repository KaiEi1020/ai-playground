import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const ConclusionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainProgress = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const mainScale = interpolate(mainProgress, [0, 1], [0.6, 1]);

  const subOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subY = interpolate(frame, [fps * 1.5, fps * 2.5], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          opacity: mainProgress,
          transform: `scale(${mainScale})`,
          fontSize: 64,
          fontWeight: 900,
          color: "#4ecdc4",
          textAlign: "center",
          lineHeight: 1.4,
          maxWidth: 1200,
          padding: "0 80px",
        }}
      >
        不会通胀
      </div>
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          fontSize: 36,
          color: "rgba(255,255,255,0.7)",
          marginTop: 40,
          textAlign: "center",
          maxWidth: 1000,
          lineHeight: 1.6,
        }}
      >
        中国正在努力打破通缩
      </div>
      <div
        style={{
          opacity: interpolate(frame, [fps * 3, fps * 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 22,
          color: "rgba(255,255,255,0.3)",
          marginTop: 80,
        }}
      >
        数据来源：国家统计局 · 2025年2月
      </div>
    </AbsoluteFill>
  );
};
