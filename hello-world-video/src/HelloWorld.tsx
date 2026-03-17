import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const HelloWorld = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for smooth entrance (0 -> 1)
  const progress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Fly in from left: -1200px -> 0px
  const translateX = interpolate(progress, [0, 1], [-1200, 0]);

  // Rotation: 720deg -> 0deg (two full spins)
  const rotation = interpolate(progress, [0, 1], [720, 0]);

  // Scale: 0 -> 1
  const scale = interpolate(progress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `translateX(${translateX}px) rotate(${rotation}deg) scale(${scale})`,
          fontSize: 100,
          fontWeight: "bold",
          color: "white",
          fontFamily: "Arial, sans-serif",
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        Hello World
      </div>
    </AbsoluteFill>
  );
};
