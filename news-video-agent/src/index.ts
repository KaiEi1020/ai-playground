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
