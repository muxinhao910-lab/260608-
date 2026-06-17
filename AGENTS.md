# AGENTS.md — Project Agent Loop Rules

## Role

You are working on this repository as a coding agent.

Your job is not only to write code, but to complete a closed loop:

Observe → Plan → Implement → Verify → Fix → Report.

Never stop at a plan if the user asked for implementation.

## Core Loop

For every coding task, follow this loop:

1. Observe
   - Inspect the current branch, relevant files, existing routes, components, and data structures.
   - Do not rely only on the user's description.
   - Confirm the real current state before editing.

2. Plan
   - Write a short implementation plan.
   - Keep the plan minimal and directly tied to the user's request.
   - Do not expand scope without permission.

3. Implement
   - Make the smallest safe code changes needed to satisfy the task.
   - Reuse existing components, data stores, layouts, and styles where possible.
   - Avoid duplicating data sources or creating disconnected mock systems.

4. Verify
   - Run required checks after implementation.
   - At minimum, run:

   ```bash
   npm run build
   ```

   - For UI tasks, also verify the relevant local URLs and interactions.

5. Fix

   - If build, routing, rendering, or interaction checks fail, do not stop.
   - Read the error, fix the issue, and run verification again.
   - Continue until the task passes or until you hit a real blocker.

6. Report

   - Report exactly what changed.
   - Include modified files, latest commit hash, build result, tested URLs, and known limitations.
   - Be honest about anything not completed.

## Definition of Done

A task is not complete until all of the following are true:

- The requested feature or fix exists in actual code.
- The feature is reachable through the intended UI path.
- The relevant page renders in the browser.
- The expected buttons, links, forms, or components actually work.
- `npm run build` passes.
- The working tree is clean after commit.
- The change is committed to the current task branch.
- The change is pushed to the current remote branch unless network failure prevents it.

## Git Rules

- Work on the current task branch unless the user explicitly says otherwise.
- Do not commit to `main`.
- Do not modify rollback branches.
- Do not create unrelated new branches.
- Do not use force push.
- Do not use `git reset --hard` unless the user explicitly approves.
- Do not discard user changes.
- Do not merge pull requests automatically.

Allowed normal flow:

```bash
git status -sb
git add .
git commit -m "<clear task-based commit message>"
git pull --rebase origin <current-branch>
git push -u origin <current-branch>
```

## Scope Control

Do not turn a small task into a large rewrite.

Unless explicitly requested, do not:

- Redesign the whole homepage.
- Restore or rebuild scroll animations.
- Replace the design system.
- Rewrite the app architecture.
- Delete existing pages.
- Replace working routes with mock pages.
- Build unrelated admin features.
- Change investment content or business logic unnecessarily.

## Website-Specific Rules

This project is a personal website for A股、港股、ETF、美股产业链信息查询.

It is not a normal K-line stock chart website.

The intended style is:

- artistic
- high visual impact
- 3D feeling
- strong scroll and interaction design later
- functional correctness comes before animation recovery

Current priority:

1. Make routes work.
2. Make sector pages work.
3. Make Developer Mode / Builder real and usable.
4. Only later restore advanced visual effects.

## Builder Rules

When working on Developer Mode or Builder:

- Developer Mode must enter `/admin/builder`, not a useless dashboard.
- `/admin/builder` must be a real visual editor, not a placeholder.
- The builder should support adding, selecting, editing, saving, refreshing, and resetting page blocks.
- A UI component is not considered implemented unless it can be clicked and affects visible state.
- A save feature is not considered implemented unless refresh preserves the saved content.
- Do not claim Builder is complete if the editor component is imported but not rendered.

## Verification Report Format

At the end of every task, report:

1. Current branch
2. Latest commit hash
3. Files changed
4. What was implemented
5. What URLs were tested
6. What interactions were tested
7. `npm run build` result
8. Push status
9. Known limitations or unfinished parts

## Project Memory Rule

Chat history is not the source of truth.

Repository documentation is the source of truth.

At the start of every task, inspect these files when relevant:

- `docs/project-memory.md`
- `docs/current-state.md`
- `docs/decision-log.md`
- `docs/product-vision.md`
- `docs/acceptance-checklist.md`

If the task involves a specific role, also inspect the corresponding file in:

- `docs/role-cards/`

At the end of a task, report whether any new decision should be added to `docs/decision-log.md` or `docs/current-state.md`.

Never say “done” without evidence.
