import assert from "node:assert/strict";
import test from "node:test";
import { parseAnalysisJson } from "../articleAnalyzer.js";
import type { RawArticle } from "../types.js";

const article: RawArticle = {
  title: "AI 公司发布新模型",
  content: "某 AI 公司发布新模型，推理成本下降。",
  sourceName: "示例新闻网",
  sourceUrl: "https://example.com/news/1",
};

test("parseAnalysisJson parses fenced JSON", () => {
  const result = parseAnalysisJson(
    "```json\n{\"title\":\"AI 公司发布新模型\",\"hook\":\"AI 成本又降了\",\"facts\":[\"发布新模型\",\"推理成本下降\"],\"impact\":\"企业部署 AI 的门槛可能降低\",\"conclusion\":\"AI 应用竞争会继续加速\",\"recommendedTemplate\":\"data\",\"templateReason\":\"内容包含成本变化\"}\n```",
    article
  );

  assert.equal(result.title, "AI 公司发布新模型");
  assert.equal(result.sourceName, "示例新闻网");
  assert.equal(result.sourceUrl, "https://example.com/news/1");
  assert.equal(result.recommendedTemplate, "data");
  assert.deepEqual(result.facts, ["发布新模型", "推理成本下降"]);
});

test("parseAnalysisJson rejects invalid template", () => {
  assert.throws(
    () =>
      parseAnalysisJson(
        "{\"title\":\"x\",\"hook\":\"x\",\"facts\":[\"a\",\"b\"],\"impact\":\"x\",\"conclusion\":\"x\",\"recommendedTemplate\":\"bad\",\"templateReason\":\"x\"}",
        article
      ),
    /模板必须是/
  );
});
