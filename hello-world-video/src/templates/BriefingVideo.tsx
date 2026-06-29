import { NewsVideoData } from "../data/news-video-data";
import { AnimatedText, SourceBadge, TemplateShell, colors } from "./shared";

export const BriefingVideo = ({ data }: { data: NewsVideoData }) => {
  return (
    <TemplateShell accent={colors.accent}>
      <AnimatedText start={0} style={{ fontSize: 42, color: colors.accent, fontWeight: 900 }}>
        热点快讯
      </AnimatedText>
      <AnimatedText start={20} style={{ marginTop: 90, fontSize: 76, lineHeight: 1.18, fontWeight: 900 }}>
        {data.hook}
      </AnimatedText>
      <div style={{ marginTop: 100, display: "flex", flexDirection: "column", gap: 34 }}>
        {data.facts.slice(0, 3).map((fact, index) => (
          <AnimatedText
            key={fact}
            start={90 + index * 42}
            style={{
              fontSize: 44,
              lineHeight: 1.35,
              padding: "30px 34px",
              borderRadius: 28,
              background: colors.panel,
              borderLeft: `8px solid ${colors.accent}`,
            }}
          >
            {fact}
          </AnimatedText>
        ))}
      </div>
      <AnimatedText start={330} style={{ marginTop: 90, fontSize: 46, lineHeight: 1.35, color: colors.muted }}>
        {data.impact}
      </AnimatedText>
      <AnimatedText start={520} style={{ position: "absolute", left: 72, right: 72, bottom: 150, fontSize: 52, lineHeight: 1.25, fontWeight: 900 }}>
        {data.conclusion}
      </AnimatedText>
      <SourceBadge sourceName={data.sourceName} />
    </TemplateShell>
  );
};
