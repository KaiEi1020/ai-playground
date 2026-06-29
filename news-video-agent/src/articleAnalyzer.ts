import Anthropic from "@anthropic-ai/sdk";
import type { ArticleAnalysis, RawArticle, TemplateKind } from "./types.js";

const VALID_TEMPLATES: TemplateKind[] = ["briefing", "data", "opinion"];

export async function analyzeArticle(article: RawArticle): Promise<ArticleAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("缺少 ANTHROPIC_API_KEY 环境变量");
  }

  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1200,
    messages: [
      {
        role: "user",
        content: buildPrompt(article),
      },
    ],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return parseAnalysisJson(text, article);
}

export function parseAnalysisJson(text: string, article: RawArticle): ArticleAnalysis {
  const jsonText = stripJsonFence(text);
  const parsed = JSON.parse(jsonText) as Partial<ArticleAnalysis>;

  assertText(parsed.title, "title");
  assertText(parsed.hook, "hook");
  assertFacts(parsed.facts);
  assertText(parsed.impact, "impact");
  assertText(parsed.conclusion, "conclusion");
  assertTemplate(parsed.recommendedTemplate);
  assertText(parsed.templateReason, "templateReason");

  return {
    title: parsed.title.trim(),
    hook: parsed.hook.trim(),
    facts: parsed.facts.map((fact) => fact.trim()).slice(0, 3),
    impact: parsed.impact.trim(),
    conclusion: parsed.conclusion.trim(),
    sourceName: article.sourceName,
    sourceUrl: article.sourceUrl,
    publishedAt: article.publishedAt,
    recommendedTemplate: parsed.recommendedTemplate,
    templateReason: parsed.templateReason.trim(),
  };
}

function buildPrompt(article: RawArticle): string {
  return `请把下面新闻改写成一个 20-30 秒竖屏短视频的数据。只输出 JSON，不要解释。

要求：
- 面向抖音/视频号
- 不要夸大，不要添加原文没有的信息
- hook 不超过 18 个汉字
- facts 生成 2-3 条，每条不超过 18 个汉字
- impact 不超过 28 个汉字
- conclusion 不超过 24 个汉字
- recommendedTemplate 只能是 briefing、data、opinion
- 有关键数字、涨跌幅、金额、参数、成本变化时选 data
- 纯事件快讯选 briefing
- 行业趋势、政策影响、判断解读选 opinion

输出 JSON 结构：
{
  "title": "",
  "hook": "",
  "facts": ["", ""],
  "impact": "",
  "conclusion": "",
  "recommendedTemplate": "briefing",
  "templateReason": ""
}

新闻标题：${article.title}
来源：${article.sourceName}
正文：
${article.content.slice(0, 6000)}`;
}

function stripJsonFence(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenced ? fenced[1].trim() : trimmed;
}

function assertText(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`字段 ${field} 必须是非空字符串`);
  }
}

function assertFacts(value: unknown): asserts value is string[] {
  if (!Array.isArray(value) || value.length < 2 || value.some((item) => typeof item !== "string" || item.trim().length === 0)) {
    throw new Error("facts 必须至少包含 2 条非空字符串");
  }
}

function assertTemplate(value: unknown): asserts value is TemplateKind {
  if (!VALID_TEMPLATES.includes(value as TemplateKind)) {
    throw new Error("模板必须是 briefing、data 或 opinion");
  }
}
