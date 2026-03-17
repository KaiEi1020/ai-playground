import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BarChart: React.FC<{
  label: string;
  value: number;
  maxValue: number;
  color: string;
  progress: number;
}> = ({ label, value, maxValue, color, progress }) => {
  const width = interpolate(progress, [0, 1], [0, (value / maxValue) * 100]);
  return (
    <div style={{ marginBottom: 24, width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontSize: 22,
          color: "rgba(255,255,255,0.8)",
        }}
      >
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>
          {(value * progress).toFixed(1)}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 20,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 10,
          }}
        />
      </div>
    </div>
  );
};

export const SupplyScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 50 },
  });

  const bigNumber = interpolate(numberProgress, [0, 1], [0, 74.4]);

  const barProgress = spring({
    frame: Math.max(0, frame - fps * 2),
    fps,
    config: { damping: 15, stiffness: 60 },
  });

  const labelOpacity = interpolate(frame, [fps * 1, fps * 1.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
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
          marginBottom: 10,
          opacity: interpolate(frame, [0, fps * 0.5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        工业产能利用率
      </div>
      <div
        style={{
          fontSize: 160,
          fontWeight: 900,
          color: "#f9a826",
          opacity: numberProgress,
        }}
      >
        {bigNumber.toFixed(1)}%
      </div>
      <div
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 50,
          opacity: labelOpacity,
        }}
      >
        供强需弱 · 产能过剩
      </div>
      <div style={{ width: "100%", maxWidth: 900 }}>
        <BarChart
          label="供给能力"
          value={92}
          maxValue={100}
          color="#4ecdc4"
          progress={barProgress}
        />
        <BarChart
          label="实际需求"
          value={68}
          maxValue={100}
          color="#e94560"
          progress={barProgress}
        />
        <BarChart
          label="产能利用率"
          value={74.4}
          maxValue={100}
          color="#f9a826"
          progress={barProgress}
        />
      </div>
    </AbsoluteFill>
  );
};
