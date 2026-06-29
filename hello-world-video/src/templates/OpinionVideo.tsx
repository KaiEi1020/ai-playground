import { NewsVideoData } from "../data/news-video-data";
import { AnimatedText, SourceBadge, TemplateShell, colors } from "./shared";

export const OpinionVideo = ({ data }: { data: NewsVideoData }) => {
  return (
    <TemplateShell accent={colors.opinion}>
      <AnimatedText start={0} style={{ fontSize: 42, color: colors.opinion, fontWeight: 900 }}>
        影响判断
      </AnimatedText>
      <AnimatedText start={24} style={{ marginTop: 86, fontSize: 74, lineHeight: 1.18, fontWeight: 900 }}>
        {data.hook}
      </AnimatedText>
      <AnimatedText
        start={112}
        style={{
          marginTop: 90,
          fontSize: 48,
          lineHeight: 1.35,
          padding: 36,
          borderRadius: 34,
          background: "rgba(167,139,250,0.14)",
          border: `2px solid ${colors.opinion}66`,
        }}
      >
        {data.impact}
      </AnimatedText>
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 28 }}>
        {data.facts.slice(0, 3).map((fact, index) => (
          <AnimatedText key={fact} start={240 + index * 42} style={{ fontSize: 38, color: colors.muted, lineHeight: 1.35 }}>
            · {fact}
          </AnimatedText>
        ))}
      </div>
      <AnimatedText start={530} style={{ position: "absolute", left: 72, right: 72, bottom: 150, fontSize: 54, lineHeight: 1.24, fontWeight: 900, color: colors.opinion }}>
        {data.conclusion}
      </AnimatedText>
      <SourceBadge sourceName={data.sourceName} />
    </TemplateShell>
  );
};
