import assert from "node:assert/strict";
import test from "node:test";
import { selectTemplate } from "../templateSelector.js";
import type { ArticleAnalysis } from "../types.js";

const analysis: ArticleAnalysis = {
  title: "AI 公司发布新模型",
  hook: "AI 成本又降了",
  facts: ["发布新模型", "推理成本下降"],
  impact: "企业部署 AI 的门槛可能降低",
  conclusion: "AI 应用竞争会继续加速",
  sourceName: "示例新闻网",
  sourceUrl: "https://example.com/news/1",
  recommendedTemplate: "data",
  templateReason: "内容包含成本变化",
};

test("selectTemplate uses recommended template by default", () => {
  assert.deepEqual(selectTemplate(analysis), {
    template: "data",
    reason: "内容包含成本变化",
  });
});

test("selectTemplate accepts user override", () => {
  assert.deepEqual(selectTemplate(analysis, "briefing"), {
    template: "briefing",
    reason: "用户手动切换为 briefing",
  });
});
