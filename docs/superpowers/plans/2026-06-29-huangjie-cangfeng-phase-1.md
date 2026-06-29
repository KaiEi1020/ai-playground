# 《荒界藏锋》第一阶段 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `novel/荒界藏锋/` production workspace, turn the approved design spec into canonical novel docs, and complete the first executable slice: Volume 1 outline, the first 30 chapter briefs, and chapters 001-010.

**Architecture:** Treat [2026-06-29-huangjie-cangfeng-design.md](/Users/edy/test/ai-playground/docs/superpowers/specs/2026-06-29-huangjie-cangfeng-design.md) as the only source of truth, then fan it out into focused Markdown files under `novel/荒界藏锋/`. Lock the repeatable writing process with one full reference package for Volume 1 before scaling the same pattern to the remaining 290 chapters in later plans.

**Tech Stack:** Markdown, UTF-8 text files, shell validation commands (`test`, `rg`, `wc`, `find`), git.

## Global Constraints

- All novel files live under `novel/荒界藏锋/`.
- Reference `《斗破苍穹》` only at the growth-arc and pacing level; do not reuse names, places, power terms, signature setups, or any 100+ character passage.
- Default perspective: third-person, close to the protagonist.
- Default style: restrained, cold, low on slogans, high on action and judgment.
- Default chapter rhythm: every chapter must move plot, reveal risk, or cash out a prior setup.
- Default chapter ending: every chapter ends on a hook, reversal, or new danger.
- Default prose length: 2000-3000 Chinese characters per chapter unless a transition chapter justifies a small variance.
- Single female lead only; do not introduce harem ambiguity.
- The residual soul may guide, warn, and explain history, but may not fight for the protagonist or solve decisive battles.
- The protagonist is a “风控型苟王”: he avoids unnecessary risk, layers retreat lines, and only gambles when family core, true allies, or border survival leave no cleaner option.
- No body chapter may be drafted before its volume outline and chapter brief exist.

## Scope Boundary

This plan intentionally covers the smallest end-to-end production slice that can be reviewed on its own:

- canonical novel docs
- the full Volume 1 package
- the first 10 body chapters

Do not attempt Volumes 2-10 body prose in this plan. Use the same process in follow-on plans after Volume 1 voice, pacing, and anti-collision checks are approved.

---

## File Structure

### Create

| Path | Responsibility |
|---|---|
| `novel/荒界藏锋/00-总设定.md` | One-page source of truth for premise, core sell, and hard rules |
| `novel/荒界藏锋/01-世界观.md` | World history, border geography, human factions, alien factions, ancient ruins |
| `novel/荒界藏锋/02-修炼体系.md` | `荒息/命火/界纹` rules, realm table, combat logic |
| `novel/荒界藏锋/03-人物档案.md` | Main cast dossiers and relationship edges |
| `novel/荒界藏锋/04-十卷总纲.md` | Ten-volume macro outline with stakes and hooks |
| `novel/荒界藏锋/05-感情线设计.md` | Single-female-lead structure and scene boundaries |
| `novel/荒界藏锋/06-防撞线与禁用元素.md` | Allowed references, forbidden similarities, self-check list |
| `novel/荒界藏锋/卷纲/第01卷-灰寨藏锋.md` | Detailed Volume 1 outline |
| `novel/荒界藏锋/章纲/第01卷-01至30章.md` | Detailed chapter briefs for chapters 1-30 |
| `novel/荒界藏锋/正文/第001章.md` through `第010章.md` | First 10 full chapters |

### Modify

| Path | Responsibility |
|---|---|
| `novel/荒界藏锋/00-总设定.md` | Tighten if world, romance, or tone decisions shift while outlining Volume 1 |
| `novel/荒界藏锋/03-人物档案.md` | Add first-volume rivals and allies discovered during detailed outlining |
| `novel/荒界藏锋/04-十卷总纲.md` | Update hooks only if Volume 1 work reveals a contradiction |

---

### Task 1: Scaffold the Novel Workspace

**Files:**
- Create: `novel/荒界藏锋/00-总设定.md`
- Create: `novel/荒界藏锋/01-世界观.md`
- Create: `novel/荒界藏锋/02-修炼体系.md`
- Create: `novel/荒界藏锋/03-人物档案.md`
- Create: `novel/荒界藏锋/04-十卷总纲.md`
- Create: `novel/荒界藏锋/05-感情线设计.md`
- Create: `novel/荒界藏锋/06-防撞线与禁用元素.md`
- Create: `novel/荒界藏锋/卷纲/第01卷-灰寨藏锋.md`
- Create: `novel/荒界藏锋/章纲/第01卷-01至30章.md`
- Create: `novel/荒界藏锋/正文/第001章.md` through `第010章.md`

**Interfaces:**
- Consumes: approved spec at `docs/superpowers/specs/2026-06-29-huangjie-cangfeng-design.md`
- Produces: the on-disk workspace layout every later task depends on

- [ ] **Step 1: Verify the target workspace is not already populated**

Run:

```bash
find novel -maxdepth 2 -path 'novel/荒界藏锋*'
```

Expected: no output for `novel/荒界藏锋/`.

- [ ] **Step 2: Create the directory tree**

Run:

```bash
mkdir -p novel/荒界藏锋/卷纲 novel/荒界藏锋/章纲 novel/荒界藏锋/正文
```

Expected: exit code `0`.

- [ ] **Step 3: Create document shells with the exact top-level headings below**

Each file must start with these headings:

```md
# 《荒界藏锋》总设定
## 一句话故事
## 核心卖点
## 主线问题
## 主角模型
## 女主模型
## 创作硬约束
```

```md
# 《荒界藏锋》世界观
## 烬北荒
## 沉日断界
## 人族格局
## 异族格局
## 古遗地规则
## 旧史谎言
```

```md
# 《荒界藏锋》修炼体系
## 荒息
## 命火
## 界纹
## 境界表
## 战斗原则
## 主角专属优势
```

```md
# 《荒界藏锋》人物档案
## 主角
## 残魂
## 宁见秋
## 家族核心成员
## 第一卷压迫者
## 第一卷潜在盟友
```

```md
# 《荒界藏锋》十卷总纲
## 第一卷 灰寨藏锋
## 第二卷 断谷埋火
## 第三卷 黑沙立烽
## 第四卷 夜渡残关
## 第五卷 荒碑照血
## 第六卷 百寨同盟
## 第七卷 镇关风起
## 第八卷 旧史无名
## 第九卷 烽天裂界
## 第十卷 补天人间
```

```md
# 《荒界藏锋》感情线设计
## 关系起点
## 四段推进
## 高光场面
## 绝对禁区
## 与主线衔接
```

```md
# 《荒界藏锋》防撞线与禁用元素
## 允许借鉴
## 明确禁用
## 自检问题
## 出现既视感时怎么改
```

```md
# 第一卷 灰寨藏锋
## 本卷承诺
## 本卷主冲突
## 本卷反派压力
## 本卷地图与势力
## 本卷情感推进
## 本卷六段节奏
## 本卷卷尾钩子
```

```md
# 第一卷 01-30 章纲
## 使用规则
## 第01章
## 第02章
## 第03章
```

```md
# 第001章
```

- [ ] **Step 4: Verify the workspace files exist**

Run:

```bash
find novel/荒界藏锋 -maxdepth 2 -type f | sort
```

Expected: all base docs plus `卷纲/第01卷-灰寨藏锋.md` and `章纲/第01卷-01至30章.md` appear; `正文/` contains `第001章.md` through `第010章.md`.

- [ ] **Step 5: Commit**

```bash
git add novel/荒界藏锋
git commit -m "docs: scaffold Huangjie Cangfeng novel workspace"
```

---

### Task 2: Populate Core Setting Docs

**Files:**
- Modify: `novel/荒界藏锋/00-总设定.md`
- Modify: `novel/荒界藏锋/01-世界观.md`
- Modify: `novel/荒界藏锋/02-修炼体系.md`

**Interfaces:**
- Consumes: the approved spec, especially sections 3-7
- Produces: canonical setting files that every later outline and chapter must follow

- [ ] **Step 1: Fill `00-总设定.md` with the exact six sections below**

The file must contain:

```md
## 一句话故事
一个被故意藏起的边荒少年，在苟活翻身中逼近一场被篡改的断界旧史。

## 核心卖点
- 风控型苟王男主
- 边荒压迫感与生存感
- 退一步是布局，不是认输
- 残魂指路但绝不代打
- 家族翻身线、守土线、旧史真相线三线并进

## 主线问题
主角到底为何被封？家族当年守住了什么？“沉日断界”为什么会被整片边荒同时说成另一套版本？

## 主角模型
- 出身：落魄世家旁支
- 外在印象：弱、忍、低调
- 内在逻辑：先算退路，再算赢法
- 底线触发：血亲、真盟友、边荒守土

## 女主模型
- 单女主：宁见秋
- 关系路线：互疑、试探、托底、认定

## 创作硬约束
- 第三人称贴主角
- 每章 2000-3000 字
- 每章末尾必须留钩子
- 禁用退婚、异火、炼药师、老师代打
```

- [ ] **Step 2: Fill `01-世界观.md` with concrete world rules**

The file must explain:

```md
## 烬北荒
人族困守重城、堡寨、附属氏族，城外是裂谷、荒原、古战场和异族地带。

## 沉日断界
三百年前灾变之后，天穹裂开、地脉紊乱、古遗地周期性苏醒，旧史被系统篡改。

## 人族格局
重城 > 堡寨 > 氏族的依附结构；合作与压榨并存。

## 异族格局
异族不是铁板一块，而是分支众多、利益不一、可敌可用。

## 古遗地规则
古遗地会“吐机缘也吞活人”，并且与旧时代残留界纹有关。

## 旧史谎言
当代教条把断界之战简化成“异族灭旧世”，真实原因包含人族内部选择。
```

- [ ] **Step 3: Fill `02-修炼体系.md` with the approved system**

The file must include:

```md
## 荒息
杂乱暴烈，不能直接吸收。

## 命火
修行者把荒息炼成稳定火种，用来定身和承载后续提升。

## 界纹
命火在骨、脉、窍、灵台中刻下的秩序痕迹，是强度与上限的关键。

## 境界表
拾烬境 / 铭骨境 / 燃窍境 / 立烽境 / 开城境 / 镇关境 / 观墟境 / 补天境 / 渡界境

## 战斗原则
战斗看命火稳定度、界纹完整度、地势是否相克，少写公平擂台，多写夜袭、守城、断后、埋伏、争遗地。

## 主角专属优势
残魂帮助辨认古界纹、规避错误、提前嗅到风险，但绝不替主角出手。
```

- [ ] **Step 4: Verify headings and key terms**

Run:

```bash
rg -n "风控型苟王|沉日断界|荒息|命火|界纹|宁见秋" novel/荒界藏锋/00-总设定.md novel/荒界藏锋/01-世界观.md novel/荒界藏锋/02-修炼体系.md
```

Expected: all six terms are found.

- [ ] **Step 5: Commit**

```bash
git add novel/荒界藏锋/00-总设定.md novel/荒界藏锋/01-世界观.md novel/荒界藏锋/02-修炼体系.md
git commit -m "docs: add Huangjie Cangfeng core setting"
```

---

### Task 3: Populate Character, Romance, and Anti-Collision Docs

**Files:**
- Modify: `novel/荒界藏锋/03-人物档案.md`
- Modify: `novel/荒界藏锋/05-感情线设计.md`
- Modify: `novel/荒界藏锋/06-防撞线与禁用元素.md`

**Interfaces:**
- Consumes: Tasks 1-2 output
- Produces: character motivations, romance rules, and anti-collision checks used by every outline and chapter draft

- [ ] **Step 1: Fill `03-人物档案.md` with six dossiers**

Each dossier must use the same fields:

```md
### 姓名/称呼
### 身份
### 外在印象
### 真正动机
### 擅长手段
### 与主角的关系
### 第一卷任务
### 绝不能写歪的点
```

Required characters:

- 主角
- 残魂
- 宁见秋
- 至少 2 名家族核心成员
- 至少 1 名第一卷压迫者
- 至少 1 名第一卷潜在盟友

- [ ] **Step 2: Fill `05-感情线设计.md` with the exact progression model**

The file must include:

```md
## 关系起点
宁见秋先盯上主角，怀疑他藏了不该有的秘密。

## 四段推进
1. 互疑
2. 试探
3. 托底
4. 认定

## 高光场面
- 她表面查他，实际替他遮痕
- 他第一次把关键退路让给她
- 两人在死局里默认对方一定会来

## 绝对禁区
- 不写一见钟情
- 不写后宫暧昧
- 不让女主沦为获救挂件

## 与主线衔接
感情推进必须落在边荒任务、遗地任务、守关任务里，不能单独抽离成长主线。
```

- [ ] **Step 3: Fill `06-防撞线与禁用元素.md` with a self-review checklist**

The file must contain:

```md
## 允许借鉴
- 爽感节奏
- 少年成长弧线
- 地图递进和势力升级

## 明确禁用
- 退婚开局
- 斗气式同构命名
- 异火争夺
- 炼药师主轴
- 老师代打
- 原作地名、人名、宗门名、功法名

## 自检问题
- 这一章的冲突来源是否能在不参考原作时也成立？
- 地图、势力、能力逻辑是不是自己的？
- 主角赢法是不是“风控+布局”而不是原作式热血强压？

## 出现既视感时怎么改
- 先改地点
- 再改对手动机
- 再改能力规则
- 最后改结果和代价
```

- [ ] **Step 4: Verify required fields**

Run:

```bash
rg -n "### 身份|### 真正动机|## 四段推进|## 自检问题" novel/荒界藏锋/03-人物档案.md novel/荒界藏锋/05-感情线设计.md novel/荒界藏锋/06-防撞线与禁用元素.md
```

Expected: each heading appears at least once.

- [ ] **Step 5: Commit**

```bash
git add novel/荒界藏锋/03-人物档案.md novel/荒界藏锋/05-感情线设计.md novel/荒界藏锋/06-防撞线与禁用元素.md
git commit -m "docs: add Huangjie Cangfeng character and guardrail docs"
```

---

### Task 4: Write the Ten-Volume Macro Outline

**Files:**
- Modify: `novel/荒界藏锋/04-十卷总纲.md`

**Interfaces:**
- Consumes: Tasks 2-3 output
- Produces: the macro arc, volume promises, and cross-volume continuity every detailed outline will inherit

- [ ] **Step 1: Use one repeated section template for all ten volumes**

Each volume section must contain:

```md
## 第一卷 灰寨藏锋
### 章节范围
### 本卷一句话
### 明线推进
### 暗线推进
### 主要敌人
### 主要盟友
### 主角成长节点
### 感情线进度
### 卷末钩子
```

- [ ] **Step 2: Fill all ten volumes with concrete story movement**

The macro beats must match the approved design:

```md
第一卷：家族与堡寨夹缝求生，第一次靠多重后手翻盘。
第二卷：断谷生存与异族接触，第一次意识到边荒史有问题。
第三卷：边城外围博弈，主角靠假身份和借刀换资格。
第四卷：穿越残关，第一次实锤守界者旧迹。
第五卷：古遗地爆发，主角确认自身封印和家族旧秘相连。
第六卷：异族压境，主角在暗处拼出脆弱同盟。
第七卷：边关大战，主角第一次改变一座关隘命运。
第八卷：旧史翻面，人族内部旧罪浮出水面。
第九卷：诸族洗牌，主角被推到大局中心。
第十卷：残魂复原，断界真相完全揭开，主角完成最终选择。
```

- [ ] **Step 3: Verify all ten volume headings exist**

Run:

```bash
rg -n "^## 第[一二三四五六七八九十]卷" novel/荒界藏锋/04-十卷总纲.md
```

Expected: 10 matches.

- [ ] **Step 4: Commit**

```bash
git add novel/荒界藏锋/04-十卷总纲.md
git commit -m "docs: add Huangjie Cangfeng ten-volume outline"
```

---

### Task 5: Write the Detailed Volume 1 Outline

**Files:**
- Modify: `novel/荒界藏锋/卷纲/第01卷-灰寨藏锋.md`
- Modify: `novel/荒界藏锋/03-人物档案.md`

**Interfaces:**
- Consumes: Tasks 2-4 output
- Produces: the detailed Volume 1 conflict map and any missing first-volume cast details

- [ ] **Step 1: Write the opening promise and pressure model**

The top of `第01卷-灰寨藏锋.md` must include:

```md
## 本卷承诺
这一卷要让读者爱上“苟不是怂，而是活法”的男主，并且在 30 章内看到一次清晰、痛快、带后手的翻盘。

## 本卷主冲突
家族被堡寨与更强势力挤压，主角必须在看似毫无胜算的局面里找到一条活路。

## 本卷反派压力
- 外部压迫：堡寨、税役、资源卡脖子
- 内部轻视：家族里有人看不起主角的苟法
- 生存环境：边荒资源、夜路、异兽、旧迹风险
```

- [ ] **Step 2: Write the six-part volume rhythm**

The section `## 本卷六段节奏` must break chapters into:

```md
1. 第01-05章：灰寨压顶，主角露出“弱”和“忍”
2. 第06-10章：第一次借残魂纠错，拿到微型主动权
3. 第11-15章：外线试探，发现更大压迫者盯上家族
4. 第16-20章：主角开始布假线、退路和备用身份
5. 第21-25章：局势失控，主角被迫把后手一层层翻出来
6. 第26-30章：小翻盘完成，并抛出必须离寨或外出的卷尾钩子
```

- [ ] **Step 3: Patch missing cast details back into `03-人物档案.md`**

If Task 3 did not already name them, add:

```md
## 家族核心成员
- 主角的长辈：信主角，但未必理解他的打法
- 同辈对照组：敢冲但不够稳，衬托主角风控差异

## 第一卷压迫者
- 堡寨实权人物：负责对家族施压
- 对应动机：图资源、图旧物、图试探主角家底

## 第一卷潜在盟友
- 外线接触者：既可能卖主角，也可能被主角反向利用
```

- [ ] **Step 4: Verify the six rhythm blocks exist**

Run:

```bash
rg -n "第01-05章|第06-10章|第11-15章|第16-20章|第21-25章|第26-30章" novel/荒界藏锋/卷纲/第01卷-灰寨藏锋.md
```

Expected: 6 matches.

- [ ] **Step 5: Commit**

```bash
git add novel/荒界藏锋/卷纲/第01卷-灰寨藏锋.md novel/荒界藏锋/03-人物档案.md
git commit -m "docs: add Huangjie Cangfeng volume one outline"
```

---

### Task 6: Write the Chapter Briefs for Chapters 1-30

**Files:**
- Modify: `novel/荒界藏锋/章纲/第01卷-01至30章.md`

**Interfaces:**
- Consumes: Tasks 2-5 output
- Produces: thirty short chapter blueprints used directly by body-chapter drafting

- [ ] **Step 1: Add a reusable chapter entry template at the top of the file**

`## 使用规则` must define this structure:

```md
## 第01章 章名
- 本章目标：
- 明面冲突：
- 主角后手：
- 出场人物：
- 新增信息：
- 章末钩子：
- 防撞提醒：
```

- [ ] **Step 2: Fill chapters 01-10 with concrete beats**

The first ten chapters must cover:

```md
第01章：家族受压与主角表面隐忍
第02章：主角第一次借残魂纠错修行
第03章：家族内部轻视主角的冲突
第04章：主角用小布局自保
第05章：外部压迫者第一次正面登场
第06章：主角踩线试探外线环境
第07章：残魂指出家族旧物异常
第08章：主角埋第一条撤退线
第09章：宁见秋以可疑观察者身份登场
第10章：主角拿到一个危险但可用的机会
```

- [ ] **Step 3: Fill chapters 11-30 with grouped escalation**

The remaining twenty chapters must cover:

```md
第11-15章：外线试探、家族新压迫、主角试做假线
第16-20章：堡寨与家族矛盾升级，宁见秋开始盯主角
第21-25章：主角部分后手失效，被迫启用更深一层布局
第26-30章：翻盘兑现、压迫者吃亏、卷尾抛出外出或离寨的强钩子
```

- [ ] **Step 4: Verify all 30 chapter headings exist**

Run:

```bash
rg -n "^## 第(0[1-9]|1[0-9]|2[0-9]|30)章" novel/荒界藏锋/章纲/第01卷-01至30章.md
```

Expected: 30 matches.

- [ ] **Step 5: Commit**

```bash
git add novel/荒界藏锋/章纲/第01卷-01至30章.md
git commit -m "docs: add Huangjie Cangfeng chapter briefs for volume one"
```

---

### Task 7: Draft Chapters 001-005

**Files:**
- Modify: `novel/荒界藏锋/正文/第001章.md`
- Modify: `novel/荒界藏锋/正文/第002章.md`
- Modify: `novel/荒界藏锋/正文/第003章.md`
- Modify: `novel/荒界藏锋/正文/第004章.md`
- Modify: `novel/荒界藏锋/正文/第005章.md`

**Interfaces:**
- Consumes: Tasks 2-6 output
- Produces: the opening prose batch that locks voice, pacing, and the protagonist’s risk-management pattern

- [ ] **Step 1: Draft Chapter 001 with these required beats**

`第001章.md` must:

```md
- 用家族现实压力开场，不要先讲大设定
- 在 300 字内让读者看见主角“弱、忍、被低估”
- 埋下主角不是纯废物的第一个细节
- 最后一段出现残魂苏醒的微弱异动或提示
```

- [ ] **Step 2: Draft Chapters 002-005 with the progression below**

Required beats:

```md
第002章：修行纠错，主角发现自己以前练错了路
第003章：家族内部冲突，主角被当成无用之人
第004章：主角用极小代价换一次自保或试探成功
第005章：第一卷外部压迫者正面施压，主角被迫准备更深后手
```

- [ ] **Step 3: Validate length and headings**

Run:

```bash
wc -m novel/荒界藏锋/正文/第001章.md novel/荒界藏锋/正文/第002章.md novel/荒界藏锋/正文/第003章.md novel/荒界藏锋/正文/第004章.md novel/荒界藏锋/正文/第005章.md
```

Expected: each file lands near 2000-3000 Chinese characters; any chapter under 1800 or over 3200 must be revised before moving on.

- [ ] **Step 4: Manual hook check**

Read the last two paragraphs of each file and confirm they end on one of these:

```md
- 新风险
- 新信息
- 新误判
- 新选择
```

If any chapter ends flat, revise the ending before continuing.

- [ ] **Step 5: Commit**

```bash
git add novel/荒界藏锋/正文/第001章.md novel/荒界藏锋/正文/第002章.md novel/荒界藏锋/正文/第003章.md novel/荒界藏锋/正文/第004章.md novel/荒界藏锋/正文/第005章.md
git commit -m "feat: draft Huangjie Cangfeng chapters 001 to 005"
```

---

### Task 8: Draft Chapters 006-010

**Files:**
- Modify: `novel/荒界藏锋/正文/第006章.md`
- Modify: `novel/荒界藏锋/正文/第007章.md`
- Modify: `novel/荒界藏锋/正文/第008章.md`
- Modify: `novel/荒界藏锋/正文/第009章.md`
- Modify: `novel/荒界藏锋/正文/第010章.md`

**Interfaces:**
- Consumes: Tasks 2-7 output
- Produces: the second prose batch, including the first outside movement and the first appearance of the female lead

- [ ] **Step 1: Draft Chapters 006-008 around external probing and retreat lines**

Required beats:

```md
第006章：主角试着离开家族安全区，观察边荒外线规则
第007章：残魂点出一件与家族旧史有关的异常物件或痕迹
第008章：主角主动埋下一条撤退线或备用身份
```

- [ ] **Step 2: Draft Chapters 009-010 around surveillance and dangerous opportunity**

Required beats:

```md
第009章：宁见秋登场，她先观察、怀疑、记住主角，不要直接暧昧
第010章：主角获得一份危险机会，收益可观，但失败代价极高
```

- [ ] **Step 3: Validate length and female-lead entry tone**

Run:

```bash
wc -m novel/荒界藏锋/正文/第006章.md novel/荒界藏锋/正文/第007章.md novel/荒界藏锋/正文/第008章.md novel/荒界藏锋/正文/第009章.md novel/荒界藏锋/正文/第010章.md
```

Expected: each file lands near 2000-3000 Chinese characters.

Manual checks:

```md
- 宁见秋首登场必须先承担“观察者/怀疑者”功能
- 第010章结尾必须能推动读者继续看第011章
- 主角每章至少有一处“风险判断”而不是单纯挨打
```

- [ ] **Step 4: Commit**

```bash
git add novel/荒界藏锋/正文/第006章.md novel/荒界藏锋/正文/第007章.md novel/荒界藏锋/正文/第008章.md novel/荒界藏锋/正文/第009章.md novel/荒界藏锋/正文/第010章.md
git commit -m "feat: draft Huangjie Cangfeng chapters 006 to 010"
```

---

### Task 9: Validate the Phase 1 Slice

**Files:**
- Modify: `novel/荒界藏锋/00-总设定.md`
- Modify: `novel/荒界藏锋/03-人物档案.md`
- Modify: `novel/荒界藏锋/04-十卷总纲.md`
- Modify: `novel/荒界藏锋/正文/第001章.md` through `第010章.md`

**Interfaces:**
- Consumes: Tasks 1-8 output
- Produces: a review-ready Phase 1 package with contradictions resolved and the first continuation point clearly identified

- [ ] **Step 1: Run the anti-collision keyword check**

Run:

```bash
rg -n "斗气|异火|炼药|退婚|药老|萧|云岚" novel/荒界藏锋
```

Expected: no matches in the newly created project files.

- [ ] **Step 2: Run the structural completeness check**

Run:

```bash
rg -n "^## 第(0[1-9]|1[0-9]|2[0-9]|30)章" novel/荒界藏锋/章纲/第01卷-01至30章.md && find novel/荒界藏锋/正文 -maxdepth 1 -name '第0*.md' | sort
```

Expected: chapter outline has 30 entries and body folder lists `第001章.md` through `第010章.md`.

- [ ] **Step 3: Reconcile any contradictions**

Manual review checklist:

```md
- 主角的“苟”和“翻盘”有没有同时成立？
- 宁见秋是不是先以任务角色出现，而不是恋爱角色？
- 残魂有没有越界去代打或代决策？
- Volume 1 和十卷总纲有没有互相打架？
```

If any answer is “yes, there is a contradiction,” patch the smallest number of files needed and re-run Steps 1-2.

- [ ] **Step 4: Commit**

```bash
git add novel/荒界藏锋
git commit -m "docs: validate Huangjie Cangfeng phase one slice"
```

---
