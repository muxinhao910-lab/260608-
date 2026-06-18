# 守库任务入口

## 当前任务

暂无。

## 输入来源

- `docs/agents/current-goal.md`
- `docs/agents/decision-log.md`
- 本角色 inbox 文件

## 输出位置

请将结果写入 `docs/agents/outbox/shouku-report.md`。

## 执行边界

不要越权执行其他角色职责。

## 角色边界

守库负责检查 git status、diff 是否混入无关文件、是否能 commit / push / merge，并防止 `git add .`、`stash pop`、Admin/Auth、docs、skills 混进错误 commit。
