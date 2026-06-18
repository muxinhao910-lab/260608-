# Agent Workflow Decision Log

## Decision 001 - Repository files are the role handoff medium

Agent roles should use `docs/agents/inbox/` and `docs/agents/outbox/` as the handoff station.

The user should not need to manually copy long task blocks between windows when a repository file can carry the same task.

## Decision 002 - One current goal at a time

`docs/agents/current-goal.md` is the current goal anchor.

If the project starts drifting across multiple tasks, return to this file and decide the next single role to act.

## Decision 003 - Role boundaries stay explicit

Each role should read its own inbox and write its own outbox report.

Roles should not silently take over another role's responsibilities.

## Decision 004 - Builder work belongs to 造物

Tasks about `/admin/builder`, visual editing, component libraries, selected block editing, property panels, save, refresh persistence, reset, and low-code editing belong to 造物.

Git safety remains 守库's responsibility. Product priority remains 司南's responsibility.
