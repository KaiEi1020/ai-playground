import assert from "node:assert/strict";
import test from "node:test";
import { extractArticleFromHtml } from "../newsInput.js";

const html = `
<html>
  <head>
    <title>AI 公司发布新模型 - 示例新闻</title>
    <meta property="og:site_name" content="示例新闻网" />
    <meta property="article:published_time" content="2026-06-26T08:00:00+08:00" />
  </head>
  <body>
    <article>
      <p>某 AI 公司今天发布新一代模型，该模型在推理速度和成本上都有明显改善。</p>
      <p>业内认为，这可能影响企业级 AI 应用的部署节奏，多家公司已开始评估接入方案。</p>
      <p>分析师指出，此次发布或将加速行业竞争格局的变化。</p>
    </article>
  </body>
</html>`;

test("extractArticleFromHtml extracts title, source, time, and article paragraphs", () => {
  const article = extractArticleFromHtml(html, "https://example.com/news/1");

  assert.equal(article.title, "AI 公司发布新模型 - 示例新闻");
  assert.equal(article.sourceName, "示例新闻网");
  assert.equal(article.sourceUrl, "https://example.com/news/1");
  assert.equal(article.publishedAt, "2026-06-26T08:00:00+08:00");
  assert.match(article.content, /某 AI 公司今天发布新一代模型/);
  assert.match(article.content, /企业级 AI 应用/);
});

test("extractArticleFromHtml throws when content is too short", () => {
  assert.throws(
    () => extractArticleFromHtml("<html><head><title>短新闻</title></head><body><p>太短</p></body></html>", "https://example.com"),
    /未能提取有效内容/
  );
});
