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
