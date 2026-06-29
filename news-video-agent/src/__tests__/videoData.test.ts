import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { toNewsVideoData, writeNewsVideoData } from "../videoData.js";
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

test("toNewsVideoData maps analysis to Remotion payload", () => {
  const data = toNewsVideoData(analysis, "opinion");

  assert.equal(data.template, "opinion");
  assert.equal(data.title, analysis.title);
  assert.deepEqual(data.facts, analysis.facts);
  assert.equal(data.sourceUrl, analysis.sourceUrl);
});

test("writeNewsVideoData writes pretty JSON", async () => {
  const dir = await mkdtemp(join(tmpdir(), "news-video-"));
  const outputPath = join(dir, "news-video-data.generated.json");

  try {
    const data = toNewsVideoData(analysis, "data");
    await writeNewsVideoData(data, outputPath);
    const file = await readFile(outputPath, "utf8");
    assert.match(file, /"template": "data"/);
    assert.doesNotThrow(() => JSON.parse(file));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
