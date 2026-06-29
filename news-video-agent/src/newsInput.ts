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
