---
name: muxinbai-website-workflow
description: Project-specific workflow for the MUXINBAI personal stock industry-chain information website. Must be used before all tasks in this project, especially edits involving checkpoints, page routing, Design Review Overlay annotations, Page Builder insertions, React/Next.js implementation, visual design, motion, debugging, rollback, and delivery reporting.
---

# MUXINBAI Website Workflow

Use this skill first for every task in this project. It is the project-level guardrail for the personal stock industry information website.

## Project Positioning

This website is an industry-chain information query and tracking tool for A-shares, Hong Kong stocks, ETFs, and US stocks.

It is not a normal stock quote or K-line chart website. The core value is long-term industry variable tracking: customers, orders, revenue exposure, gross margin, capacity expansion, supply-chain position, evidence sources, and credibility.

## Required Preflight

Before modifying files:

1. Work in the current project workspace, not an old personal-site folder or a temporary directory.
2. Check git status.
3. Create a checkpoint.
4. State the task scope clearly.
5. Do not perform large unrelated refactors.

Use a checkpoint before every code, content, style, workflow, or configuration change.

## Page Targeting Rules

Never assume the target is the homepage.

If the user refers to a subpage, route, annotation, pathname, pageId, or page-specific issue:

1. Read the target pathname or pageId.
2. Identify the matching route/component/module.
3. Modify only that page or the necessary shared component.
4. Do not edit `/` unless the target page is explicitly `/`.

For Design Review Overlay feedback, always inspect:

- target page
- full URL
- pathname
- target section
- associated element
- `data-review-page`
- `data-review-id`
- nearby text
- scroll position and page coordinates

## Page Builder Insertions

When the user asks to add content, insert a module, add a card, add a block, or place something in a page:

1. Prefer Page Builder identifiers over visual guessing.
2. Use `pageId`, `sectionId`, and `insertIndex` when available.
3. If these identifiers are missing, inspect existing page/module data before deciding where to insert.
4. Do not rely only on screenshot coordinates unless no structured target exists.

## Skill Selection

Use additional skills only when they match the task.

- For homepage visual design, black high-tech style, premium hero sections, mouse motion, parallax, 3D-feeling interactions, or polished visual exploration, use `frontend-design`. If available and useful, also use `web-design-engineer`.
- For React or Next.js components, page implementation, performance, client/server boundaries, and bundle-sensitive work, use `react-best-practices`.
- For UI review, accessibility, visual consistency, interaction inspection, and design QA, use `web-design-guidelines`.
- For bugs, route mistakes, wrong insertion position, data structure issues, rollback, Git workflow, or annotation coordinate fixes, do not call design skills unless the bug is visual design-specific.

Using a design skill is not permission to redesign the whole project.

## Visual Change Rules

For large visual changes:

1. Create a checkpoint first.
2. Keep the change modular and page-scoped.
3. Preserve unrelated layouts and routes.
4. Use before/after screenshots when possible.
5. If `before-and-after` is unavailable, say so and use the available browser or screenshot workflow as a substitute.

## Delivery Report

After finishing, always tell the user:

- which files changed
- why they changed
- how to preview
- how to roll back
- whether `npm run build` was run

If `npm run build` was not run, explain why.

## Rollback Rule

If the user says "not satisfied", "go back", "rollback", or "退回上一版":

1. Prefer Git rollback/revert.
2. Do not manually guess how to restore files.
3. Avoid destructive commands such as `git reset --hard` unless the user explicitly confirms a forced rollback.

