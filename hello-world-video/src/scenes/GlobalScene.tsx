import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const GlobalScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const points = [
    { text: "全球大通胀都是需求扩张超过供给", icon: "🌍" },
    { text: "美欧：财政刺激 → 消费过热 → 物价飞涨", icon: "📈" },
    { text: "中国：制造业投资为主，消费刺激有限", icon: "🏭" },
    { text: "中国不具备需求拉动型通胀条件", icon: "🔒" },
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
          fontSize: 44,
          fontWeight: 800,
          color: "#ffffff",
          marginBottom: 60,
          opacity: titleOpacity,
        }}
      >
        全球对比
      </div>
      <div style={{ width: "100%", maxWidth: 1100 }}>
        {points.map((point, i) => {
          const delay = fps * 0.8 + i * fps * 1;
          const opacity = interpolate(frame, [delay, delay + fps * 0.6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const translateX = interpolate(
            frame,
            [delay, delay + fps * 0.6],
            [-60, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateX(${translateX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginBottom: 30,
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "24px 32px",
                borderLeft: "4px solid #f9a826",
              }}
            >
              <span style={{ fontSize: 36 }}>{point.icon}</span>
              <span style={{ fontSize: 28, color: "#ffffff", lineHeight: 1.4 }}>
                {point.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
