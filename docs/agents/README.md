# Agent Inbox / Outbox Workflow

This directory is the repository-based handoff system for the project.

It does not make ChatGPT or Codex windows communicate automatically. Instead, each role reads and writes Markdown files in the repository so tasks can survive long conversations, window switches, and memory loss.

## How To Use

1. Read `docs/agents/current-goal.md` first.
2. Read `docs/agents/decision-log.md` next.
3. Open the inbox file for the role that should act next.
4. The role writes its result to the matching outbox report file.
5. The user reviews the outbox report and decides the next step.

## Roles

- 司南: planning, task breakdown, phase priority, and role assignment.
- Codex: code execution, build, verify, local run, screenshot checks, commit, and push when allowed.
- 守库: Git safety, diff scope, commit boundary, PR safety, and merge readiness.
- 墨衡: code quality, architecture review, regression risk, and test coverage.
- 霓渊: UI, aesthetic direction, interaction quality, and visual consistency.
- 造物: Builder, visual editor, component library, property panel, save/reset, and tool engineering.
- 观澜: data sources, industry data structure, update strategy, credibility, and API/data-layer design.
- 用户本人: final acceptance and direction confirmation.

## File Roles

- `current-goal.md`: the single current goal.
- `decision-log.md`: decisions that should not be forgotten.
- `inbox/*.md`: tasks assigned to each role.
- `outbox/*.md`: reports produced by each role.

## Operating Rules

- Keep one active goal at a time.
- Do not use chat history as the source of truth.
- Do not let a role execute another role's responsibilities without explicit permission.
- Do not merge, force push, reset, clean, or stash pop through this workflow.
- Codex may only commit and push when the user's current Git rules allow it.

## Handoff Routing Rules

Every role must end its outbox report with a `下一步交接` section.

The section must tell the user which role should work next and why. It must also include a short instruction that the user can copy directly into the next role window.

If the role cannot confidently decide the next role, it must hand the task back to 司南. 司南 should then read `current-goal.md`, `decision-log.md`, and all relevant outbox reports before assigning the next task.

Default routing:

- 造物完成 Builder 检查后，通常交给守库或司南。
- 守库完成 PR 安全检查后，通常交给墨衡或司南。
- 墨衡完成代码质量检查后，通常交给霓渊或司南。
- 霓渊完成视觉检查后，通常交给司南做最终合并判断。
- 观澜完成数据源规划后，通常交给司南或 Codex。
- Codex 完成执行任务后，通常交给守库。
- 不确定时，一律交回司南。

An outbox report cannot only say "done". It must explain the next step clearly.
