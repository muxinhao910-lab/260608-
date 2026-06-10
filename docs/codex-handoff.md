# Codex Handoff Report

## Repository
GitHub repo URL:
https://github.com/muxinhao910-lab/260608-

## Branches
- 当前本地分支：`codex/phase0-function-fix`
- 当前最新代码来源：`rollback/20260609-1808-20260609-1241-before-change`
- 正式工作分支：`codex/phase0-function-fix`
- main 状态：`main` 目前不是最新开发状态，暂时不要基于 `main` 修复。
- rollback 分支状态：`rollback/20260609-1808-20260609-1241-before-change` 保留为最新代码来源，不删除。

## Git Status
本报告会在 Phase 0 修改后随代码状态一起更新。当前工作应继续保持在 `codex/phase0-function-fix`，不要直接修改 `main`。

## Phase 0 Starting Problems
1. 首页 4 个板块只有第一个能点击。
2. 右下角开发者模式点击无反应。
3. Admin 菜单和内部 tab 多数不可用。
4. Builder 功能尚未稳定。
5. 首页滑动动效暂时不优先。

## Phase 0 Status In This Branch
- 首页 4 个产业入口已改回直接链接跳转。
- `/sector/semiconductor`、`/sector/ai`、`/sector/optical` 有最小占位页承接。
- 右下角开发者模式按钮已补打开状态反馈。
- Admin 在开发环境可直接进入并切换左侧菜单与 dashboard 内部 tab。
- 未恢复首页滑动动效，未继续 Builder Phase 2 / 3。

## Phase 0 Scope
只做基础功能止血：
1. 修复首页 4 个模块跳转。
2. 修复开发者模式按钮。
3. 修复 Admin 菜单和 tab。
4. 明确 Admin 和 Builder 分工。
5. 不恢复首页滑动动效。
6. 不继续做复杂 Builder Phase 2 / 3。

## Admin And Builder Responsibility Split
Builder / 开发者模式负责：
- 页面视觉布局
- 添加基础组件
- 拖动位置
- 缩放尺寸
- 编辑按钮、文字、图片
- 创建页面画布
- 调整页面结构

Admin 后台负责：
- 内容数据管理
- 首页文字
- 产业板块数据
- 公司资料
- 信息卡片数据
- 可信度规则
- 后续接 Supabase 或本地数据

Admin 不做拖拽页面搭建。
Builder 不做长期股票/产业链数据维护。

## Next Recommended Task
Phase 0 验收后，再决定是否进入下一阶段。不要在 Phase 0 中恢复首页动效，也不要继续 Builder Phase 2 / 3。

## Review Workflow
1. 后续每次 Codex 修改都在 `codex/*` 独立分支进行。
2. 不要直接在 `main` 上大改。
3. 每次修改完成后，把 GitHub 分支链接、diff 或 PR 链接，以及本报告发给 ChatGPT 审查。
