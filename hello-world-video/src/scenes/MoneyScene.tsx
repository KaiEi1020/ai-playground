import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FlowRow: React.FC<{
  items: string[];
  color: string;
  progress: number;
}> = ({ items, color, progress }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {items.map((item, i) => {
        const itemProgress = interpolate(
          progress,
          [i / items.length, (i + 1) / items.length],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                opacity: itemProgress,
                transform: `scale(${interpolate(itemProgress, [0, 1], [0.5, 1])})`,
                backgroundColor: `${color}20`,
                border: `2px solid ${color}60`,
                borderRadius: 16,
                padding: "14px 24px",
                fontSize: 24,
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              {item}
            </div>
            {i < items.length - 1 && (
              <div
                style={{
                  opacity: itemProgress,
                  fontSize: 28,
                  color,
                }}
              >
                →
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const MoneyScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const usProgress = spring({
    frame: Math.max(0, frame - fps * 0.5),
    fps,
    config: { damping: 20, stiffness: 60 },
    durationInFrames: fps * 3,
  });

  const cnProgress = spring({
    frame: Math.max(0, frame - fps * 3.5),
    fps,
    config: { damping: 20, stiffness: 60 },
    durationInFrames: fps * 3,
  });

  const usY = interpolate(usProgress, [0, 1], [40, 0]);
  const cnY = interpolate(cnProgress, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #2b2d42 0%, #1a1a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "60px 80px",
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
        货币传导机制对比
      </div>

      {/* US section */}
      <div
        style={{
          opacity: usProgress,
          transform: `translateY(${usY}px)`,
          width: "100%",
          marginBottom: 50,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#e94560",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          🇺🇸 美国：发钱 → 通胀循环
        </div>
        <FlowRow
          items={["印钱发钱", "消费暴涨", "供不应求", "物价上涨", "工资上涨"]}
          color="#e94560"
          progress={usProgress}
        />
      </div>

      {/* CN section */}
      <div
        style={{
          opacity: cnProgress,
          transform: `translateY(${cnY}px)`,
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#4ecdc4",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          🇨🇳 中国：制造业 → 通缩循环
        </div>
        <FlowRow
          items={["产能扩张", "供给过剩", "价格下降", "利润压缩", "需求不足"]}
          color="#4ecdc4"
          progress={cnProgress}
        />
      </div>
    </AbsoluteFill>
  );
};
