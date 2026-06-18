# Current Goal

## 当前唯一目标

建立仓库内 Agent Inbox / Outbox 协作机制，让不同角色通过 `docs/agents/` 下的 Markdown 文件交接任务，减少用户在多个窗口之间复制大段文字。

## 当前阶段限制

- 只建立或修正 `docs/agents/` 协作机制文档。
- 不改业务代码。
- 不改首页。
- 不改 Builder 功能。
- 不改 Admin/Auth。
- 不改 `.agents/skills/`。
- 不执行 `git add .`、`git stash pop`、`git reset --hard`、`git clean`、`git push --force`。

## 下一步判断

根据 `docs/current-state.md` 和 `docs/decision-log.md`，项目下一步应继续围绕 `/admin/builder` 的真实可用性进行验收和修复。

建议下一步打开：造物窗口。

原因：造物负责 Builder / 工具工程，包括组件库、添加组件、选中模块、属性面板、保存、刷新保留和重置。
