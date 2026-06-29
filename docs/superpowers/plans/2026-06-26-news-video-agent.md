# News Video Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a link-driven agent that turns one finance or AI news URL into confirmed Remotion input data and renders a reusable 20-30 second vertical news video.

**Architecture:** Create a separate `news-video-agent` TypeScript CLI for fetching, analyzing, template selection, confirmation, and JSON generation. Extend the existing `hello-world-video` Remotion project with three reusable 9:16 compositions that consume a shared `NewsVideoData` payload.

**Tech Stack:** Node.js 20+, TypeScript, axios, cheerio, @anthropic-ai/sdk, tsx, Remotion 4.0.435, React 19.

## Global Constraints

- Output video format: 1080×1920, 9:16 vertical, 30 fps.
- Video duration: 20-30 seconds.
- Supported templates: `briefing`, `data`, `opinion`.
- MVP news source: user manually provides one news URL.
- MVP audio: no voiceover; optional local background music only.
- MVP confirmation: user must approve before writing Remotion data.
- Agent and renderer stay separate: `news-video-agent/` writes data into `hello-world-video/src/data/`.
- Existing Remotion compositions `HelloWorld` and `Article` must remain working.

---

## File Structure

### Create

| Path | Responsibility |
|---|---|
| `news-video-agent/package.json` | CLI package scripts and dependencies |
| `news-video-agent/tsconfig.json` | TypeScript config for the agent |
| `news-video-agent/src/types.ts` | Shared agent and Remotion-compatible types |
| `news-video-agent/src/newsInput.ts` | Fetch and extract article text from URL |
| `news-video-agent/src/articleAnalyzer.ts` | Analyze article into structured short-video content |
| `news-video-agent/src/templateSelector.ts` | Normalize and override template selection |
| `news-video-agent/src/videoData.ts` | Convert analysis into Remotion JSON and write file |
| `news-video-agent/src/index.ts` | CLI workflow and user confirmation |
| `news-video-agent/src/__tests__/newsInput.test.ts` | Fetch/extraction tests |
| `news-video-agent/src/__tests__/articleAnalyzer.test.ts` | Analysis JSON parsing tests |
| `news-video-agent/src/__tests__/templateSelector.test.ts` | Template selection tests |
| `news-video-agent/src/__tests__/videoData.test.ts` | JSON mapping/writing tests |
| `hello-world-video/src/data/news-video-data.ts` | Remotion video data type, loader, default data |
| `hello-world-video/src/templates/shared.tsx` | Shared visual primitives and constants |
| `hello-world-video/src/templates/BriefingVideo.tsx` | Briefing template composition |
| `hello-world-video/src/templates/DataVideo.tsx` | Data template composition |
| `hello-world-video/src/templates/OpinionVideo.tsx` | Opinion template composition |
| `hello-world-video/src/NewsVideo.tsx` | Chooses the correct Remotion template from data |

### Modify

| Path | Responsibility |
|---|---|
| `hello-world-video/src/Root.tsx` | Register `NewsVideo` vertical composition |
| `hello-world-video/package.json` | Add `render:news` script |
| `.gitignore` | Ignore generated `news-video-data.generated.json` and rendered mp4 files if missing |

---

### Task 1: Create Agent Types and Package

**Files:**
- Create: `news-video-agent/package.json`
- Create: `news-video-agent/tsconfig.json`
- Create: `news-video-agent/src/types.ts`

**Interfaces:**
- Produces: `TemplateKind`, `RawArticle`, `ArticleAnalysis`, `NewsVideoData`
- Consumes: none

- [ ] **Step 1: Create package manifest**

Create `news-video-agent/package.json`:

```json
{
  "name": "news-video-agent",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts",
    "test": "node --test --import tsx 'src/__tests__/*.test.ts'",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "latest",
    "axios": "latest",
    "cheerio": "latest",
    "tsx": "latest",
    "typescript": "latest"
  },
  "devDependencies": {}
}
```

- [ ] **Step 2: Create TypeScript config**

Create `news-video-agent/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create shared types**

Create `news-video-agent/src/types.ts`:

```ts
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
```

- [ ] **Step 4: Install dependencies**

Run:

```bash
cd news-video-agent && npm install
```

Expected: `package-lock.json` is created and install exits with code 0.

- [ ] **Step 5: Typecheck**

Run:

```bash
cd news-video-agent && npm run typecheck
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add news-video-agent/package.json news-video-agent/package-lock.json news-video-agent/tsconfig.json news-video-agent/src/types.ts
git commit -m "feat: scaffold news video agent types"
```

---

### Task 2: Implement News Fetching

**Files:**
- Create: `news-video-agent/src/newsInput.ts`
- Create: `news-video-agent/src/__tests__/newsInput.test.ts`

**Interfaces:**
- Consumes: `RawArticle` from `./types.js`
- Produces: `extractArticleFromHtml(html: string, sourceUrl: string): RawArticle`, `fetchArticle(url: string): Promise<RawArticle>`

- [ ] **Step 1: Write failing extraction tests**

Create `news-video-agent/src/__tests__/newsInput.test.ts`:

```ts
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
      <p>某 AI 公司今天发布新一代模型。</p>
      <p>该模型在推理速度和成本上都有明显改善。</p>
      <p>业内认为，这可能影响企业级 AI 应用的部署节奏。</p>
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
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
cd news-video-agent && npm test
```

Expected: FAIL because `../newsInput.js` cannot be found.

- [ ] **Step 3: Implement news extraction and fetching**

Create `news-video-agent/src/newsInput.ts`:

```ts
import axios from "axios";
import * as cheerio from "cheerio";
import type { RawArticle } from "./types.js";

const MIN_CONTENT_LENGTH = 80;

export function extractArticleFromHtml(html: string, sourceUrl: string): RawArticle {
  const $ = cheerio.load(html);

  $("script, style, noscript, iframe, svg, nav, footer, header").remove();

  const title = cleanText(
    $("meta[property='og:title']").attr("content") ||
      $("meta[name='twitter:title']").attr("content") ||
      $("title").first().text()
  );

  const sourceName = cleanText(
    $("meta[property='og:site_name']").attr("content") ||
      new URL(sourceUrl).hostname.replace(/^www\./, "")
  );

  const publishedAt =
    $("meta[property='article:published_time']").attr("content") ||
    $("meta[name='pubdate']").attr("content") ||
    $("time").first().attr("datetime") ||
    undefined;

  const articleText = collectParagraphs($, "article p");
  const mainText = articleText.length >= MIN_CONTENT_LENGTH ? articleText : collectParagraphs($, "main p");
  const fallbackText = mainText.length >= MIN_CONTENT_LENGTH ? mainText : collectParagraphs($, "p");

  if (!title) {
    throw new Error("未能提取新闻标题");
  }

  if (fallbackText.length < MIN_CONTENT_LENGTH) {
    throw new Error("未能提取有效内容，请尝试其他链接");
  }

  return {
    title,
    content: fallbackText,
    sourceName,
    sourceUrl,
    publishedAt,
  };
}

export async function fetchArticle(url: string): Promise<RawArticle> {
  validateUrl(url);

  const response = await axios.get<string>(url, {
    timeout: 10_000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    responseType: "text",
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`链接抓取失败，HTTP 状态码：${response.status}`);
  }

  return extractArticleFromHtml(response.data, url);
}

function collectParagraphs($: cheerio.CheerioAPI, selector: string): string {
  return $(selector)
    .map((_, el) => cleanText($(el).text()))
    .get()
    .filter((text) => text.length >= 8)
    .join("\n");
}

function cleanText(value: string | undefined): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

function validateUrl(url: string): void {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("仅支持 HTTP 或 HTTPS 链接");
    }
  } catch {
    throw new Error("请输入有效的新闻 URL");
  }
}
```

- [ ] **Step 4: Run tests to verify pass**

Run:

```bash
cd news-video-agent && npm test
```

Expected: PASS, 2 tests pass.

- [ ] **Step 5: Typecheck**

Run:

```bash
cd news-video-agent && npm run typecheck
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add news-video-agent/src/newsInput.ts news-video-agent/src/__tests__/newsInput.test.ts
git commit -m "feat: extract news article content"
```

---

### Task 3: Implement Article Analysis

**Files:**
- Create: `news-video-agent/src/articleAnalyzer.ts`
- Create: `news-video-agent/src/__tests__/articleAnalyzer.test.ts`

**Interfaces:**
- Consumes: `RawArticle`, `ArticleAnalysis`, `TemplateKind`
- Produces: `parseAnalysisJson(text: string, article: RawArticle): ArticleAnalysis`, `analyzeArticle(article: RawArticle): Promise<ArticleAnalysis>`

- [ ] **Step 1: Write failing parser tests**

Create `news-video-agent/src/__tests__/articleAnalyzer.test.ts`:

```ts
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
        "{\"title\":\"x\",\"hook\":\"x\",\"facts\":[\"a\"],\"impact\":\"x\",\"conclusion\":\"x\",\"recommendedTemplate\":\"bad\",\"templateReason\":\"x\"}",
        article
      ),
    /模板必须是/
  );
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
cd news-video-agent && npm test
```

Expected: FAIL because `../articleAnalyzer.js` cannot be found.

- [ ] **Step 3: Implement analyzer**

Create `news-video-agent/src/articleAnalyzer.ts`:

```ts
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
```

- [ ] **Step 4: Run tests**

Run:

```bash
cd news-video-agent && npm test
```

Expected: PASS, analyzer and existing tests pass.

- [ ] **Step 5: Typecheck**

Run:

```bash
cd news-video-agent && npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add news-video-agent/src/articleAnalyzer.ts news-video-agent/src/__tests__/articleAnalyzer.test.ts
git commit -m "feat: analyze news into video structure"
```

---

### Task 4: Implement Template Selection and Video Data Writing

**Files:**
- Create: `news-video-agent/src/templateSelector.ts`
- Create: `news-video-agent/src/videoData.ts`
- Create: `news-video-agent/src/__tests__/templateSelector.test.ts`
- Create: `news-video-agent/src/__tests__/videoData.test.ts`

**Interfaces:**
- Consumes: `ArticleAnalysis`, `NewsVideoData`, `TemplateKind`
- Produces: `selectTemplate(analysis: ArticleAnalysis, override?: TemplateKind): { template: TemplateKind; reason: string }`, `toNewsVideoData(analysis: ArticleAnalysis, template: TemplateKind): NewsVideoData`, `writeNewsVideoData(data: NewsVideoData, outputPath: string): Promise<void>`

- [ ] **Step 1: Write failing tests**

Create `news-video-agent/src/__tests__/templateSelector.test.ts`:

```ts
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
```

Create `news-video-agent/src/__tests__/videoData.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
cd news-video-agent && npm test
```

Expected: FAIL because modules do not exist.

- [ ] **Step 3: Implement template selector**

Create `news-video-agent/src/templateSelector.ts`:

```ts
import type { ArticleAnalysis, TemplateKind } from "./types.js";

export function selectTemplate(
  analysis: ArticleAnalysis,
  override?: TemplateKind
): { template: TemplateKind; reason: string } {
  if (override) {
    return {
      template: override,
      reason: `用户手动切换为 ${override}`,
    };
  }

  return {
    template: analysis.recommendedTemplate,
    reason: analysis.templateReason,
  };
}
```

- [ ] **Step 4: Implement video data mapping**

Create `news-video-agent/src/videoData.ts`:

```ts
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { ArticleAnalysis, NewsVideoData, TemplateKind } from "./types.js";

export function toNewsVideoData(analysis: ArticleAnalysis, template: TemplateKind): NewsVideoData {
  return {
    title: analysis.title,
    hook: analysis.hook,
    facts: analysis.facts.slice(0, 3),
    impact: analysis.impact,
    conclusion: analysis.conclusion,
    sourceName: analysis.sourceName,
    sourceUrl: analysis.sourceUrl,
    publishedAt: analysis.publishedAt,
    template,
  };
}

export async function writeNewsVideoData(data: NewsVideoData, outputPath: string): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
```

- [ ] **Step 5: Run tests**

Run:

```bash
cd news-video-agent && npm test
```

Expected: PASS.

- [ ] **Step 6: Typecheck**

Run:

```bash
cd news-video-agent && npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add news-video-agent/src/templateSelector.ts news-video-agent/src/videoData.ts news-video-agent/src/__tests__/templateSelector.test.ts news-video-agent/src/__tests__/videoData.test.ts
git commit -m "feat: prepare Remotion news video data"
```

---

### Task 5: Implement CLI Confirmation Flow

**Files:**
- Create: `news-video-agent/src/index.ts`

**Interfaces:**
- Consumes: `fetchArticle(url)`, `analyzeArticle(article)`, `selectTemplate(analysis, override)`, `toNewsVideoData(analysis, template)`, `writeNewsVideoData(data, outputPath)`
- Produces: CLI command `npm run dev -- <news-url>`

- [ ] **Step 1: Implement CLI entrypoint**

Create `news-video-agent/src/index.ts`:

```ts
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { resolve } from "node:path";
import { analyzeArticle } from "./articleAnalyzer.js";
import { fetchArticle } from "./newsInput.js";
import { selectTemplate } from "./templateSelector.js";
import type { TemplateKind } from "./types.js";
import { toNewsVideoData, writeNewsVideoData } from "./videoData.js";

const TEMPLATE_CHOICES: Record<string, TemplateKind> = {
  "1": "briefing",
  "2": "data",
  "3": "opinion",
};

async function main(): Promise<void> {
  const url = process.argv[2];
  if (!url) {
    throw new Error("用法：npm run dev -- <news-url>");
  }

  console.log("正在抓取新闻...");
  const article = await fetchArticle(url);

  console.log("正在分析新闻...");
  const analysis = await analyzeArticle(article);
  const recommended = selectTemplate(analysis);

  printAnalysis(analysis, recommended.template, recommended.reason);

  const rl = createInterface({ input, output });
  try {
    const answer = (await rl.question("确认生成视频？输入 y 确认，n 取消，1/2/3 切换模板：")).trim().toLowerCase();

    if (answer === "n" || answer === "no") {
      console.log("已取消，未生成文件。");
      return;
    }

    const override = TEMPLATE_CHOICES[answer];
    const selected = selectTemplate(analysis, override);

    if (answer !== "y" && answer !== "yes" && !override) {
      throw new Error("输入无效，请输入 y、n、1、2 或 3");
    }

    const data = toNewsVideoData(analysis, selected.template);
    const outputPath = resolve("../hello-world-video/src/data/news-video-data.generated.json");
    await writeNewsVideoData(data, outputPath);

    console.log(`已生成 Remotion 数据：${outputPath}`);
    console.log("下一步运行：cd ../hello-world-video && npm run render:news");
  } finally {
    rl.close();
  }
}

function printAnalysis(analysis: { title: string; hook: string; facts: string[]; impact: string; conclusion: string }, template: TemplateKind, reason: string): void {
  console.log("\n=== 分析结果 ===");
  console.log(`标题：${analysis.title}`);
  console.log(`钩子：${analysis.hook}`);
  console.log("事实：");
  analysis.facts.forEach((fact, index) => console.log(`  ${index + 1}. ${fact}`));
  console.log(`影响：${analysis.impact}`);
  console.log(`结论：${analysis.conclusion}`);
  console.log(`推荐模板：${template}`);
  console.log(`推荐理由：${reason}`);
  console.log("模板选项：1=briefing，2=data，3=opinion\n");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
```

- [ ] **Step 2: Typecheck**

Run:

```bash
cd news-video-agent && npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Run tests**

Run:

```bash
cd news-video-agent && npm test
```

Expected: PASS.

- [ ] **Step 4: Verify missing URL error**

Run:

```bash
cd news-video-agent && npm run dev
```

Expected: FAIL with `用法：npm run dev -- <news-url>`.

- [ ] **Step 5: Commit**

```bash
git add news-video-agent/src/index.ts
git commit -m "feat: add news video agent cli"
```

---

### Task 6: Add Remotion Data Loader and Shared UI

**Files:**
- Create: `hello-world-video/src/data/news-video-data.ts`
- Create: `hello-world-video/src/templates/shared.tsx`

**Interfaces:**
- Produces: `NewsVideoData`, `newsVideoData`, `VIDEO_WIDTH`, `VIDEO_HEIGHT`, `VIDEO_FPS`, `VIDEO_DURATION_FRAMES`, `TemplateShell`, `AnimatedText`, `SourceBadge`
- Consumes: generated JSON file `hello-world-video/src/data/news-video-data.generated.json` when present

- [ ] **Step 1: Create Remotion data loader**

Create `hello-world-video/src/data/news-video-data.ts`:

```ts
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
```

- [ ] **Step 2: Create shared visual primitives**

Create `hello-world-video/src/templates/shared.tsx`:

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;
export const VIDEO_DURATION_FRAMES = 750;

export const colors = {
  background: "#080B14",
  panel: "rgba(255,255,255,0.09)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.68)",
  accent: "#32D3FF",
  warning: "#FFD166",
  opinion: "#A78BFA",
};

export function TemplateShell({ children, accent = colors.accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 20% 10%, ${accent}44 0, transparent 34%), linear-gradient(160deg, #080B14 0%, #111827 100%)`,
        color: colors.text,
        fontFamily: "Noto Sans SC, sans-serif",
        padding: 72,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 40,
          border: "2px solid rgba(255,255,255,0.08)",
          borderRadius: 44,
        }}
      />
      {children}
    </AbsoluteFill>
  );
}

export function AnimatedText({
  children,
  start,
  style,
}: {
  children: React.ReactNode;
  start: number;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [start, start + 18], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>
      {children}
    </div>
  );
}

export function SourceBadge({ sourceName }: { sourceName: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        bottom: 64,
        fontSize: 28,
        color: colors.muted,
        padding: "14px 22px",
        background: colors.panel,
        borderRadius: 999,
      }}
    >
      来源：{sourceName}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck Remotion project**

Run:

```bash
cd hello-world-video && npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add hello-world-video/src/data/news-video-data.ts hello-world-video/src/templates/shared.tsx
git commit -m "feat: add news video data primitives"
```

---

### Task 7: Add Three Remotion Templates

**Files:**
- Create: `hello-world-video/src/templates/BriefingVideo.tsx`
- Create: `hello-world-video/src/templates/DataVideo.tsx`
- Create: `hello-world-video/src/templates/OpinionVideo.tsx`

**Interfaces:**
- Consumes: `NewsVideoData` from `../data/news-video-data`, `TemplateShell`, `AnimatedText`, `SourceBadge`, `colors`
- Produces: `BriefingVideo`, `DataVideo`, `OpinionVideo` React components with prop `{ data: NewsVideoData }`

- [ ] **Step 1: Create briefing template**

Create `hello-world-video/src/templates/BriefingVideo.tsx`:

```tsx
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
```

- [ ] **Step 2: Create data template**

Create `hello-world-video/src/templates/DataVideo.tsx`:

```tsx
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
```

- [ ] **Step 3: Create opinion template**

Create `hello-world-video/src/templates/OpinionVideo.tsx`:

```tsx
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
```

- [ ] **Step 4: Typecheck**

Run:

```bash
cd hello-world-video && npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add hello-world-video/src/templates/BriefingVideo.tsx hello-world-video/src/templates/DataVideo.tsx hello-world-video/src/templates/OpinionVideo.tsx
git commit -m "feat: add reusable news video templates"
```

---

### Task 8: Register NewsVideo Composition

**Files:**
- Create: `hello-world-video/src/NewsVideo.tsx`
- Modify: `hello-world-video/src/Root.tsx`
- Modify: `hello-world-video/package.json`

**Interfaces:**
- Consumes: `newsVideoData`, `VIDEO_DURATION_FRAMES`, `VIDEO_FPS`, `VIDEO_HEIGHT`, `VIDEO_WIDTH`, `BriefingVideo`, `DataVideo`, `OpinionVideo`
- Produces: Remotion composition id `NewsVideo`

- [ ] **Step 1: Create composition switcher**

Create `hello-world-video/src/NewsVideo.tsx`:

```tsx
import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import { newsVideoData } from "./data/news-video-data";
import { BriefingVideo } from "./templates/BriefingVideo";
import { DataVideo } from "./templates/DataVideo";
import { OpinionVideo } from "./templates/OpinionVideo";

loadFont("normal", {
  weights: ["400", "700", "900"],
  ignoreTooManyRequestsWarning: true,
});

export const NewsVideo = () => {
  if (newsVideoData.template === "data") {
    return <DataVideo data={newsVideoData} />;
  }

  if (newsVideoData.template === "opinion") {
    return <OpinionVideo data={newsVideoData} />;
  }

  return <BriefingVideo data={newsVideoData} />;
};
```

- [ ] **Step 2: Update Root composition registry**

Modify `hello-world-video/src/Root.tsx` to exactly:

```tsx
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Article, ARTICLE_DURATION } from "./Article";
import { NewsVideo } from "./NewsVideo";
import {
  VIDEO_DURATION_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./templates/shared";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Article"
        component={Article}
        durationInFrames={ARTICLE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NewsVideo"
        component={NewsVideo}
        durationInFrames={VIDEO_DURATION_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
```

- [ ] **Step 3: Add render script**

Modify `hello-world-video/package.json` scripts to include:

```json
"render:news": "remotion render NewsVideo out/news-video.mp4"
```

The full scripts block should be:

```json
"scripts": {
  "start": "remotion studio",
  "render": "remotion render HelloWorld out/hello-world.mp4",
  "render:article": "remotion render Article out/article.mp4",
  "render:news": "remotion render NewsVideo out/news-video.mp4"
}
```

- [ ] **Step 4: Typecheck**

Run:

```bash
cd hello-world-video && npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5: Render smoke test**

Run:

```bash
cd hello-world-video && npm run render:news
```

Expected: PASS and creates `hello-world-video/out/news-video.mp4`.

- [ ] **Step 6: Commit**

```bash
git add hello-world-video/src/NewsVideo.tsx hello-world-video/src/Root.tsx hello-world-video/package.json hello-world-video/out/news-video.mp4
git commit -m "feat: register news video composition"
```

---

### Task 9: Ignore Generated Files and Document Usage

**Files:**
- Modify: `.gitignore`
- Create: `news-video-agent/README.md`

**Interfaces:**
- Consumes: CLI command from Task 5 and render script from Task 8
- Produces: documented local workflow

- [ ] **Step 1: Update gitignore**

Append to `.gitignore` if not already present:

```gitignore
# News video agent generated files
hello-world-video/src/data/news-video-data.generated.json
hello-world-video/out/*.mp4
```

- [ ] **Step 2: Create README**

Create `news-video-agent/README.md`:

```md
# News Video Agent

将一条财经或 AI 新闻链接转换为 20-30 秒竖屏 Remotion 视频数据。

## Setup

```bash
cd news-video-agent
npm install
export ANTHROPIC_API_KEY="your-api-key"
```

## Generate Video Data

```bash
npm run dev -- "https://example.com/news"
```

CLI 会：

1. 抓取新闻正文
2. 分析标题、钩子、事实、影响、结论
3. 推荐 `briefing`、`data` 或 `opinion` 模板
4. 等待用户确认
5. 写入 `../hello-world-video/src/data/news-video-data.generated.json`

## Render Video

```bash
cd ../hello-world-video
npm run render:news
```

输出文件：

```text
hello-world-video/out/news-video.mp4
```

## Templates

| Template | Use case |
|---|---|
| `briefing` | 突发新闻、公司公告、政策发布 |
| `data` | 财报、融资、涨跌幅、模型参数、成本变化 |
| `opinion` | 行业趋势、政策影响、分析判断 |
```

- [ ] **Step 3: Verify docs paths**

Run:

```bash
test -f news-video-agent/README.md && test -f docs/superpowers/specs/2026-06-26-news-video-agent-design.md && echo ok
```

Expected: `ok`.

- [ ] **Step 4: Commit**

```bash
git add .gitignore news-video-agent/README.md
git commit -m "docs: document news video agent workflow"
```

---

### Task 10: End-to-End Verification

**Files:**
- Modify only if verification reveals defects in files created above.

**Interfaces:**
- Consumes: all previous tasks
- Produces: verified MVP workflow

- [ ] **Step 1: Run agent tests**

Run:

```bash
cd news-video-agent && npm test
```

Expected: PASS.

- [ ] **Step 2: Typecheck agent**

Run:

```bash
cd news-video-agent && npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Typecheck Remotion project**

Run:

```bash
cd hello-world-video && npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 4: Render default news video**

Run:

```bash
cd hello-world-video && npm run render:news
```

Expected: PASS and `hello-world-video/out/news-video.mp4` exists.

- [ ] **Step 5: Verify generated JSON path manually**

Run:

```bash
cat > hello-world-video/src/data/news-video-data.generated.json <<'JSON'
{
  "title": "测试新闻：AI 成本下降",
  "hook": "AI 成本又降了",
  "facts": ["新模型发布", "推理成本下降", "企业部署加速"],
  "impact": "企业级 AI 应用门槛可能降低",
  "conclusion": "AI 应用竞争会继续加速",
  "sourceName": "测试来源",
  "sourceUrl": "https://example.com/test",
  "template": "data"
}
JSON
cd hello-world-video && npm run render:news
```

Expected: PASS and rendered video uses the data template.

- [ ] **Step 6: Remove manual generated JSON**

Run:

```bash
rm hello-world-video/src/data/news-video-data.generated.json
```

Expected: file is removed; it is ignored by git after Task 9.

- [ ] **Step 7: Check git status**

Run:

```bash
git status --short
```

Expected: only intentional source/doc changes are present; generated JSON and mp4 files are ignored.

- [ ] **Step 8: Commit any verification fixes**

If Step 7 shows fixes from this task, commit them:

```bash
git add <fixed-files>
git commit -m "fix: verify news video generation workflow"
```

Expected: commit succeeds if fixes were needed. If no fixes were needed, skip this step.

---

## Self-Review

| Check | Result |
|---|---|
| Spec coverage | Covered link input, article extraction, LLM analysis, template recommendation, user confirmation, data writing, three Remotion templates, vertical rendering, and local mp4 output. |
| Placeholder scan | No TBD/TODO/fill-later placeholders. All code steps include exact content. |
| Type consistency | `TemplateKind`, `ArticleAnalysis`, and `NewsVideoData` signatures are consistent across agent and Remotion tasks. |
| Scope | Focused on MVP; RSS/API hot crawling, TTS, auto publishing, and browser-use are excluded. |
