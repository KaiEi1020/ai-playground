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
