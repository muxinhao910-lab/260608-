# Codex Task Template

Use this template for future Codex tasks.

## Current Branch

`<current-branch>`

## Goal

Describe the exact user-facing outcome.

Example:

The Developer Mode button should open `/admin/builder`, and `/admin/builder` should show a real visual editor.

## User Problem

Describe what currently feels wrong.

Example:

The page opens, but it is only a dashboard and does not let the user add or edit website components.

## Required Changes

List concrete files or areas to inspect.

Example:

- `src/components/DeveloperModeEntry.tsx`
- `src/app/admin/builder/page.tsx`
- `src/components/admin/PageBuilderEditor.tsx`
- `src/lib/cms-store.ts`

## Do Not Do

List scope limits.

Example:

- Do not redesign the homepage.
- Do not restore scroll animations.
- Do not commit to main.
- Do not force push.
- Do not delete existing pages.

## Acceptance Criteria

The task is complete only if:

- `npm run build` passes.
- The relevant URL opens.
- The expected UI is visible.
- The expected interaction works.
- The change is committed.
- The change is pushed unless network failure prevents it.

## Required Report

At the end, report:

1. Current branch
2. Latest commit hash
3. Files changed
4. What was implemented
5. URLs tested
6. Interactions tested
7. Build result
8. Push status
9. Known limitations
