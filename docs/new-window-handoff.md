# 新窗口交接文档：MUXINBAI 产业链投资研究雷达

把这份文档贴给新开的 Codex 窗口，让它先读完再动手。

## 绝对工作目录

必须在这个目录工作：

```text
D:\workspace\260608个人网站
```

不要回到旧目录：

```text
C:\Users\木辛\Documents\个人站
```

也不要去临时目录做项目改动。

## 项目定位

这是个人股票产业信息网站，名称/方向是「产业链投资研究雷达」。

网站不是普通行情/K线网站，而是用于长期跟踪 A股、港股、ETF、美股背后的产业链信息。核心关注变量包括：

- 公司在产业链里的位置
- 客户、订单、收入占比
- 毛利率、产能扩张
- 供应链位置
- 信息来源、可信度评分
- 产业变量对长期价值的影响

当前重点页面是机器人产业分析页：

```text
/sector/robotics
```

## 技术栈

项目是 Next.js + React + Tailwind CSS，并已安装/使用：

- Next.js 16
- React 19
- Tailwind CSS 4
- GSAP / ScrollTrigger
- Framer Motion
- Three.js / React Three Fiber

`package.json` 常用命令：

```bash
npm run dev
npm run build
npm run checkpoint
npm run history
npm run rollback:last
npm run diff:last
```

## Git 和回退纪律

每次修改前必须先创建 checkpoint：

```bash
npm run checkpoint
```

不要默认使用破坏性命令，例如：

```bash
git reset --hard
git clean -fd
```

除非用户明确说“确认强制回退”。

如果用户说“不满意，退回上一版”，优先用 Git revert/rollback，不要手动猜测恢复文件。

最近重要提交：

```text
ac42195 fix: replace robotics radar with image hover stage
387f4b8 chore: add muxinbai website workflow skill
93e3779 chore: install project agent skills
29eab1c fix: add hover dynamics to robotics radar
ce9fa45 Revert "feat: add robotics page hover interaction"
```

最近 checkpoint：

```text
checkpoint/20260609-2109-before-change
checkpoint/20260609-2047-before-change
checkpoint/20260609-1924-before-change
checkpoint/20260609-1906-before-change
checkpoint/20260609-1904-before-radar-hover
```

## 项目专用 Skill

每个任务必须优先遵守项目专用 skill：

```text
.agents/skills/muxinbai-website-workflow/SKILL.md
```

核心规则：

- 每次修改前先 checkpoint。
- 不允许直接大规模重构。
- 如果用户说的是子页面，必须根据 pathname/pageId 修改对应页面，不允许默认改主页。
- 如果用户要求添加内容，优先使用 Page Builder 的 `pageId`、`sectionId`、`insertIndex`，不要靠坐标猜位置。
- 如果用户提供 Design Review Overlay 标注反馈，必须读取目标页面、目标 section、关联元素、滚动位置、页面坐标。
- 如果用户要求首页视觉、动效、黑色科技风格，再调用 `frontend-design`。
- 如果用户要求修 bug、路由、插入位置、数据结构，不要调用 design skill。
- 每次完成后说明：改了哪些文件、为什么这么改、如何预览、如何回退、是否运行 `npm run build`。
- 视觉修改前后尽量做截图对比；如果 `before-and-after` 不可用，说明原因并用可用浏览器/截图替代。

## 已安装项目级 Skills

安装在：

```text
.codex/skills
```

已有：

```text
.codex/skills/frontend-design
.codex/skills/react-best-practices
.codex/skills/web-design-guidelines
.codex/skills/web-design-engineer
```

没有安装成功：

```text
next-best-practices
building-components
before-and-after
```

原因：`vercel-labs/agent-skills` 当前公开仓库中没有这些精确目录，安装器返回 `Skill path not found`。

## Design Review Overlay

已实现开发环境标注反馈系统：

- 只在 dev 环境显示。
- 标注数据按页面路径保存，localStorage key 类似：

```text
design-review:/
design-review:/sector/robotics
```

- 标注系统使用页面文档坐标，不再固定在视口上。
- 复制反馈时会包含：
  - 目标页面
  - 完整 URL
  - 页面标题
  - 视口尺寸
  - 当前滚动位置
  - 页面坐标和视口坐标
  - 关联元素信息

关键文件：

```text
src/components/DesignReviewOverlay.tsx
src/app/globals.css
src/app/layout.tsx
```

## 当前页面结构重点

机器人页路由：

```text
src/app/sector/[slug]/page.tsx
```

机器人产业分析页根节点：

```tsx
<main data-review-page="robot-analysis">
```

关键 review id：

```text
robot-analysis-hero
robot-analysis-radar-stage
robot-analysis-radar-model
robot-company-detail
robot-company-list
robot-sector-cards
```

如果用户标注目标页面是 `/sector/robotics`，不要改首页 `/`。

## 最近一次视觉修改状态

用户多次要求参考 `https://landonorris.com/` 首页的交互气质，但明确要求：

- 不复制它的代码。
- 不复制它的素材。
- 不复制它的品牌、文案、颜色。
- 只参考高级交互气质：黑色背景、强视觉舞台、鼠标 hover/滚动推进、图层切换、轻微 3D/视差/缩放动效。

最近提交 `ac42195` 已经把 `/sector/robotics` 左侧雷达区域从 Three.js Canvas 简化模型替换为图片驱动舞台：

```text
src/components/RobotRadarModel.tsx
src/app/globals.css
src/app/sector/[slug]/page.tsx
public/images/robot-exterior.png
public/images/robot-interior.png
```

当前机器人图资源：

```text
public/images/robot-exterior.png
public/images/robot-interior.png
```

来源：

```text
C:\Users\木辛\OneDrive\桌面\个人网站素材\使用.png
C:\Users\木辛\OneDrive\桌面\个人网站素材\使用2.png
```

不是从 Lando 网站下载的。

当前效果：

- 左侧机器人产业链图片舞台使用两张图叠放。
- 默认显示 exterior。
- 鼠标 hover 后切到 interior。
- 使用 opacity / clip-path / transform 做过渡。
- 有热点标签、扫描光、背景光效、轻微鼠标视差。
- 修复了旧 Canvas/两栏 stretch 导致白色区域或视觉区异常拉长的问题：
  - 目标页 grid 加了 `items-start`
  - 图片舞台固定视觉高度
  - 移除了目标区内的 R3F canvas

验证过：

```bash
npm run build
```

通过。

还用本地请求确认：

- `/sector/robotics` 返回 200
- `/` 主页没有新舞台类名
- 两张图片返回 200
- Headless Chrome hover 后 `data-view` 切换到 `interior`

## 用户偏好和踩坑记录

用户很在意：

- 不要把子页面问题改到主页。
- 不要在用户没要求的位置新增大模块。
- 不要大改布局。
- 不要把“鼠标滑过动效”做成“按钮切换”。
- 不要手动猜测回退，必须用 Git。
- 修改前必须 checkpoint。
- 需要清楚说明下载/复制了什么资源、放在哪里。
- 需要可回退、可对比、可标注反馈。

如果用户给 Design Review Overlay 文本，第一优先级是里面的：

```text
【目标页面】
【重要要求】
【标注】
【关联元素】
【期望】
```

## 后续建议处理方式

新窗口开始任何任务时：

1. 先说明使用哪些 skills，以及为什么不用其他 skills。
2. 确认目标页面，不要默认 `/`。
3. `git status --short --branch`
4. `npm run checkpoint`
5. 只读相关文件。
6. 小范围修改。
7. `npm run build`
8. 如果是视觉任务，尽量截图验证。
9. 提交或至少说明回退命令。

## 当前分支和工作区

当前分支：

```text
rollback/20260609-1808-20260609-1241-before-change
```

截至写本文档时，工作区在创建文档前是干净的。

