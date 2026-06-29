import { NewsVideoData } from "../data/news-video-data";
import { AnimatedText, SourceBadge, TemplateShell, colors } from "./shared";

export const DataVideo = ({ data }: { data: NewsVideoData }) => {
  const [firstFact, ...restFacts] = data.facts;

  return (
    <TemplateShell accent={colors.warning}>
      <AnimatedText start={0} style={{ fontSize: 42, color: colors.warning, fontWeight: 900 }}>
        数据焦点
      </AnimatedText>
      <AnimatedText start={18} style={{ marginTop: 80, fontSize: 68, lineHeight: 1.18, fontWeight: 900 }}>
        {data.title}
      </AnimatedText>
      <AnimatedText
        start={96}
        style={{
          marginTop: 100,
          fontSize: 72,
          lineHeight: 1.15,
          fontWeight: 900,
          color: colors.warning,
          padding: "46px 40px",
          borderRadius: 36,
          background: "rgba(255,209,102,0.14)",
        }}
      >
        {firstFact || data.hook}
      </AnimatedText>
      <div style={{ marginTop: 54, display: "grid", gap: 28 }}>
        {restFacts.slice(0, 2).map((fact, index) => (
          <AnimatedText key={fact} start={180 + index * 48} style={{ fontSize: 40, padding: 30, borderRadius: 28, background: colors.panel }}>
            {fact}
          </AnimatedText>
        ))}
      </div>
      <AnimatedText start={390} style={{ position: "absolute", left: 72, right: 72, bottom: 240, fontSize: 46, lineHeight: 1.32 }}>
        {data.impact}
      </AnimatedText>
      <AnimatedText start={540} style={{ position: "absolute", left: 72, right: 72, bottom: 145, fontSize: 44, color: colors.warning, fontWeight: 900 }}>
        {data.conclusion}
      </AnimatedText>
      <SourceBadge sourceName={data.sourceName} />
    </TemplateShell>
  );
};
