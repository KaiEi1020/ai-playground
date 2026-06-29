export type TemplateKind = "briefing" | "data" | "opinion";

export type NewsVideoData = {
  title: string;
  hook: string;
  facts: string[];
  impact: string;
  conclusion: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt?: string;
  template: TemplateKind;
};

const defaultData: NewsVideoData = {
  title: "AI 新闻快讯",
  hook: "一条值得关注的新变化",
  facts: ["核心事实正在发生", "行业影响开始显现"],
  impact: "相关公司和用户都可能受到影响",
  conclusion: "后续进展值得继续观察",
  sourceName: "示例来源",
  sourceUrl: "https://example.com",
  template: "briefing",
};

let generatedData: Partial<NewsVideoData> = {};

try {
  generatedData = require("./news-video-data.generated.json");
} catch {
  generatedData = {};
}

export const newsVideoData: NewsVideoData = {
  ...defaultData,
  ...generatedData,
  facts: generatedData.facts && generatedData.facts.length >= 2 ? generatedData.facts : defaultData.facts,
};
