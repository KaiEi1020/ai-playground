# 热点新闻视频自动生成器设计文档

> **日期:** 2026-06-26  
> **状态:** 待用户确认  
> **作者:** brainstorming 流程

---

## 1. 产品概述

一个 Agent 驱动的热点新闻视频自动生成器。用户粘贴一条新闻链接，Agent 自动分析内容、推荐渲染模式，经用户确认后生成 20-30 秒竖屏短视频（9:16）。

首版聚焦：财经、AI 方向新闻，手动输入链接，无配音（仅背景音乐），3 种可复用渲染模板。

---

## 2. 用户流程

```
1. 用户粘贴新闻链接
   ↓
2. Agent 抓取网页正文（axios + cheerio）
   ↓
3. Agent 用 LLM 分析：标题、摘要、事实、影响、结论
   ↓
4. Agent 推荐渲染模式（快讯 / 数据 / 观点）
   ↓
5. 用户确认生成，可切换模式
   ↓
6. 生成统一 video-data.json
   ↓
7. Remotion 自动渲染 1080×1920 mp4
   ↓
8. 输出本地文件
```

---

## 3. 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    news-video-agent                      │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ newsInput │→ │articleAnalyzer│→ │ templateSelector│   │
│  │ (抓取)    │  │ (LLM 分析)    │  │ (模式推荐)       │   │
│  └──────────┘  └──────────────┘  └─────────────────┘   │
│                          ↓                              │
│                   ┌────────────┐                        │
│                   │ videoData   │                        │
│                   │ (统一 JSON) │                        │
│                   └────────────┘                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   hello-world-video                      │
│  ┌──────────────────────────────────────────────────┐    │
│  │              Remotion 渲染引擎                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │    │
│  │  │Briefing  │  │  Data    │  │ Opinion  │        │    │
│  │  │  Video   │  │  Video   │  │  Video   │        │    │
│  │  │ (快讯)   │  │ (数据)   │  │ (观点)   │        │    │
│  │  └──────────┘  └──────────┘  └──────────┘        │    │
│  └──────────────────────────────────────────────────┘    │
│                          ↓                              │
│                      1080×1920 mp4                      │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 数据模型

### 4.1 统一视频输入（Remotion 侧）

```typescript
// src/data/news-video-data.ts
export type NewsVideoData = {
  title: string;           // 新闻标题
  hook: string;            // 钩子：为什么值得看
  facts: string[];         // 事实：发生了什么（2-3 条）
  impact: string;          // 影响：对市场/行业/普通人的影响
  conclusion: string;      // 结论：一句话判断
  sourceName: string;      // 来源名称（如"财联社"）
  sourceUrl: string;       // 原始链接
  publishedAt?: string;    // 发布时间 ISO 格式
  template: "briefing" | "data" | "opinion";  // 渲染模式
};
```

### 4.2 LLM 分析输出（Agent 侧）

```typescript
// news-video-agent/src/types.ts
export type ArticleAnalysis = {
  title: string;
  hook: string;
  facts: string[];
  impact: string;
  conclusion: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt?: string;
  recommendedTemplate: "briefing" | "data" | "opinion";
  templateReason: string;  // 推荐理由，展示给用户
};
```

---

## 5. 模块设计

### 5.1 news-video-agent

#### newsInput.ts
- **职责**: 接收新闻链接，抓取网页内容
- **输入**: `url: string`
- **输出**: `{ title: string, content: string, sourceName: string, publishedAt?: string }`
- **实现**: `axios` 请求 + `cheerio` 解析，提取 `<title>`、`<meta description>`、正文段落
- **错误处理**: 超时 10s、非 200 状态码、无内容时抛出明确错误

#### articleAnalyzer.ts
- **职责**: 用 LLM 分析新闻内容，生成结构化卡片
- **输入**: `{ title, content, sourceName, publishedAt }`
- **输出**: `ArticleAnalysis`
- **实现**: 调用 Claude API，使用结构化 prompt 要求输出 JSON
- **Prompt 要点**: 
  - 提取 2-3 条关键事实（每条不超过 15 字）
  - 判断影响范围（市场/行业/个人）
  - 给出一句结论性判断
  - 根据内容特征推荐模板：有数字→data，有观点→opinion，纯事件→briefing

#### templateSelector.ts
- **职责**: 根据 LLM 推荐，输出模板选择结果
- **输入**: `ArticleAnalysis`
- **输出**: `{ template: "briefing" | "data" | "opinion", reason: string }`
- **实现**: 直接读取 `recommendedTemplate` 和 `templateReason`

#### videoData.ts
- **职责**: 将分析结果转换为 Remotion 统一输入格式
- **输入**: `ArticleAnalysis`
- **输出**: `NewsVideoData`
- **实现**: 字段映射，添加 `template` 字段

#### CLI 入口
- **职责**: 串联整个流程，提供交互式确认
- **命令**: `npx tsx src/index.ts <news-url>`
- **交互**:
  1. 显示分析结果（标题、摘要、推荐模式、推荐理由）
  2. 询问是否确认生成（y/n）
  3. 允许切换模式（输入 1/2/3 选择）
  4. 确认后生成 `video-data.json` 到 `hello-world-video/src/data/`

### 5.2 hello-world-video（Remotion 扩展）

#### 统一数据层
- `src/data/news-video-data.ts`: 导出 `NewsVideoData` 类型和默认数据
- `src/data/default-data.ts`: 默认示例数据，用于开发调试

#### 3 个渲染模板

| 模板 | 文件 | 画面结构 | 时长 |
|---|---|---|---|
| 快讯 | `BriefingVideo.tsx` | 大标题(2s) → 事实列表(8s) → 影响(5s) → 来源(3s) | 20-25s |
| 数据 | `DataVideo.tsx` | 标题+数字高亮(3s) → 对比卡片(10s) → 影响(5s) → 结论(3s) | 25-30s |
| 观点 | `OpinionVideo.tsx` | 观点标签(2s) → 论据(10s) → 结论(5s) → 来源(3s) | 20-25s |

每个模板：
- 固定 1080×1920 画布（9:16 竖屏）
- 统一字体：NotoSansSC（已加载）
- 统一配色：深色背景 + 高亮强调色
- 统一转场：fade 过渡 15 帧
- 统一背景音乐占位：预留音频轨道接口

#### 入口更新
- `Root.tsx`: 注册 3 个 Composition，根据 `video-data.json` 中的 `template` 字段决定渲染哪个
- `Article.tsx`: 保留现有财经视频作为参考，新增 `NewsVideo` composition

---

## 6. 项目结构

```
ai-playground/
├── news-video-agent/              # 新增：新闻分析与数据生成
│   ├── src/
│   │   ├── index.ts               # CLI 入口
│   │   ├── newsInput.ts           # 新闻抓取
│   │   ├── articleAnalyzer.ts     # LLM 分析
│   │   ├── templateSelector.ts   # 模板推荐
│   │   ├── videoData.ts           # 统一数据生成
│   │   └── types.ts               # 类型定义
│   ├── package.json
│   └── tsconfig.json
│
└── hello-world-video/             # 扩展：Remotion 渲染
    ├── src/
    │   ├── data/
    │   │   ├── news-video-data.ts # 统一输入类型
    │   │   └── default-data.ts    # 默认示例数据
    │   ├── templates/
    │   │   ├── BriefingVideo.tsx  # 快讯模板
    │   │   ├── DataVideo.tsx      # 数据模板
    │   │   └── OpinionVideo.tsx   # 观点模板
    │   ├── scenes/                # 现有场景（保留参考）
    │   ├── Root.tsx               # 更新：注册新 Composition
    │   ├── Article.tsx            # 保留现有
    │   └── index.ts               # 更新导出
    ├── package.json               # 更新 scripts
    └── tsconfig.json
```

---

## 7. 技术栈

| 组件 | 技术 | 版本 |
|---|---|---|
| 新闻抓取 | axios + cheerio | latest |
| 内容分析 | Claude API | 当前会话模型 |
| 视频渲染 | Remotion | ^4.0.435（已有） |
| 字体 | @remotion/google-fonts/NotoSansSC | 已有 |
| 转场 | @remotion/transitions | 已有 |
| 运行时 | Node.js + tsx | 20+ |

---

## 8. 错误处理

| 场景 | 处理方式 |
|---|---|
| 链接无法访问 | 明确提示"链接抓取失败，请检查 URL 或稍后重试" |
| 网页无正文内容 | 提示"未能提取有效内容，请尝试其他链接" |
| LLM 分析失败 | 重试 1 次，仍失败则提示"分析失败，请手动输入关键信息" |
| 用户取消确认 | 优雅退出，不生成任何文件 |
| Remotion 渲染失败 | 输出详细错误日志，保留 video-data.json 便于调试 |

---

## 9. 首版范围（MVP）

**包含：**
- [x] 手动粘贴新闻链接
- [x] 自动抓取网页内容
- [x] LLM 分析生成结构化卡片
- [x] 推荐 + 人工确认渲染模式
- [x] 3 种 Remotion 渲染模板
- [x] 输出 1080×1920 mp4

**不包含（后续迭代）：**
- [ ] 自动抓取热点（RSS/API 源）
- [ ] AI 配音 / TTS
- [ ] 背景音乐自动匹配
- [ ] 多平台发布
- [ ] 视频封面生成
- [ ] 批量生成
- [ ] 反爬处理（browser-use）

---

## 10. 成功标准

1. 粘贴一条财经或 AI 新闻链接，5 分钟内输出可观看的竖屏视频
2. 视频内容准确反映新闻要点，无事实错误
3. 3 种模板视觉风格统一，切换自然
4. 用户确认流程顺畅，可切换模式

---

## 附录：视频结构参考

### 20-30 秒标准结构

| 时段 | 内容 | 画面 |
|---|---|---|
| 0-3s | 钩子 | 大标题 + 来源标识 |
| 3-10s | 事实 | 2-3 条关键信息，逐条出现 |
| 10-18s | 影响 | 对市场/行业/个人的影响判断 |
| 18-25s | 结论 | 一句话总结 + 来源标注 |
| 25-30s | 收尾 | 品牌标识 / 关注引导（可选） |

### 快讯模板（Briefing）

适合：突发新闻、政策发布、公司公告

画面：极简，大标题占 30% 高度，事实列表居中，来源底部

### 数据模板（Data）

适合：财报、融资、股价、AI 模型参数

画面：标题 + 关键数字高亮（放大 + 颜色强调），对比卡片展示变化

### 观点模板（Opinion）

适合：行业分析、趋势判断、专家观点

画面：观点标签（如"利好""利空""中性"），论据逐条展开，结论醒目

---

> **设计完成，待用户确认。**
