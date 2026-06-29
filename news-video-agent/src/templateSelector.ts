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
