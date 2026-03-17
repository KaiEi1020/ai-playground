import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const Card: React.FC<{
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  progress: number;
  fromLeft: boolean;
}> = ({ title, subtitle, color, icon, progress, fromLeft }) => {
  const translateX = interpolate(progress, [0, 1], [fromLeft ? -200 : 200, 0]);
  return (
    <div
      style={{
        opacity: progress,
        transform: `translateX(${translateX}px)`,
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 24,
        padding: "50px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: `2px solid ${color}40`,
      }}
    >
      <div style={{ fontSize: 60, marginBottom: 20 }}>{icon}</div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 800,
          color,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 26,
          color: "rgba(255,255,255,0.8)",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

export const CorePointScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const rightProgress = spring({
    frame: Math.max(0, frame - fps * 0.6),
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #533483 0%, #2b2d42 100%)",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "0 100px",
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
        核心观点
      </div>
      <div
        style={{
          display: "flex",
          gap: 50,
          width: "100%",
        }}
      >
        <Card
          title="A股 · 中债"
          subtitle="无需担心通胀"
          color="#4ecdc4"
          icon="✅"
          progress={leftProgress}
          fromLeft
        />
        <Card
          title="美股 · 美债"
          subtitle="需要担心通胀"
          color="#e94560"
          icon="⚠️"
          progress={rightProgress}
          fromLeft={false}
        />
      </div>
    </AbsoluteFill>
  );
};
