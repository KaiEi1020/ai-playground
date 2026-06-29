export type TemplateKind = "briefing" | "data" | "opinion";

export type RawArticle = {
  title: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt?: string;
};

export type ArticleAnalysis = {
  title: string;
  hook: string;
  facts: string[];
  impact: string;
  conclusion: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt?: string;
  recommendedTemplate: TemplateKind;
  templateReason: string;
};

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
