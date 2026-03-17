import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const CPIScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 60 },
  });

  const cpiValue = interpolate(numberProgress, [0, 1], [0, 1.3]);

  const points = [
    "2月CPI同比上涨1.3%",
    "春节错月因素拉动，非持续性上涨",
    "扣除季节因素后趋势平稳",
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f3460 0%, #533483 100%)",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "0 120px",
      }}
    >
      <div
        style={{
          fontSize: 36,
          color: "rgba(255,255,255,0.6)",
          marginBottom: 20,
          opacity: interpolate(frame, [0, fps * 0.5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        CPI 同比涨幅
      </div>
      <div
        style={{
          fontSize: 140,
          fontWeight: 900,
          color: "#e94560",
          opacity: numberProgress,
        }}
      >
        {cpiValue.toFixed(1)}%
      </div>
      <div style={{ marginTop: 60, width: "100%" }}>
        {points.map((point, i) => {
          const delay = fps * 2 + i * fps * 1.2;
          const opacity = interpolate(frame, [delay, delay + fps * 0.8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const translateY = interpolate(
            frame,
            [delay, delay + fps * 0.8],
            [20, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                fontSize: 32,
                color: "#ffffff",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#e94560",
                  flexShrink: 0,
                }}
              />
              {point}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
