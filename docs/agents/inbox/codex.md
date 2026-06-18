# Codex 任务入口

## 当前任务

暂无。

## 输入来源

- `docs/agents/current-goal.md`
- `docs/agents/decision-log.md`
- 本角色 inbox 文件

## 输出位置

请将结果写入 `docs/agents/outbox/codex-report.md`。

## 执行边界

不要越权执行其他角色职责。

## 结束规则

完成任务后，必须在对应 outbox report 末尾写明“下一步交接”。

如果你能判断下一步角色，请给出下一步角色和可复制指令。

如果你不能判断下一步角色，请明确写：

“请交回司南判断下一步。”

## 角色边界

Codex 负责按 inbox 任务执行代码修改、运行 build / verify、运行本地页面、尽可能截图检查，并在低风险且规则允许时自动 commit + push。

高风险任务必须停止并回报。
