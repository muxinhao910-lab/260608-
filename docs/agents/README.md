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
