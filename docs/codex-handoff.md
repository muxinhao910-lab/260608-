# Codex Handoff Report

## Repository
GitHub repo URL:
https://github.com/muxinhao910-lab/260608-

## Branches
- 当前本地分支：`codex/phase0-function-fix`
- 当前最新代码来源：`rollback/20260609-1808-20260609-1241-before-change`
- 正式工作分支：`codex/phase0-function-fix`
- main 状态：`main` 目前不是最新开发状态，暂时不要基于 `main` 修复。
- rollback 分支状态：`rollback/20260609-1808-20260609-1241-before-change` 是当前最新代码来源，保留不删除。

## Git Status
```text
## codex/phase0-function-fix
```

## Recent Commits
```text
105b38b docs: update handoff after GitHub upload
a11e5d7 assets: add website robot image materials
4e37bf5 docs: add codex handoff report
bcbdfba chore: upload current website state before further fixes
5e41d0d checkpoint/20260610-0908-before-change
```

## Current Known Problems
1. 首页 4 个板块只有第一个能点击。
2. 右下角开发者模式点击无反应。
3. Admin 菜单和内部 tab 多数不可用。
4. Builder 功能尚未稳定。
5. 首页滑动动效暂时不优先。

## Next Recommended Task
下一步只做 Phase 0 功能止血：
1. 修复首页 4 个模块跳转。
2. 修复开发者模式按钮。
3. 修复 Admin 菜单和 tab。
4. 明确 Admin 和 Builder 分工。
5. 不恢复首页滑动动效。
6. 不继续做复杂 Builder Phase 2 / 3。

## Review Workflow
- 后续功能修复都在 `codex/*` 独立分支上进行。
- Phase 0 修复应从 `codex/phase0-function-fix` 继续，不要从 `main` 开始。
- 每次修复完成后，将 GitHub 分支链接、diff 或 PR 链接，以及本报告发给 ChatGPT 审查。
- 本次只整理分支和更新 handoff，没有修复网站功能、没有改首页/Admin/Builder 逻辑。
