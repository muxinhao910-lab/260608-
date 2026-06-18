# Acceptance Checklist

## Basic Build Check

Every coding task should run:

```bash
npm run build
```

If available, also run:

```bash
npm run verify
```

## Basic Route Check

The following routes should not return 404 or crash:

```txt
/
/admin
/admin/dashboard
/admin/builder
/sector/robotics
/sector/semiconductor
/sector/ai
/sector/optical
```

## Developer Mode Check

- The global Developer Mode entry should be visible in local development.
- Clicking Developer Mode should enter `/admin/builder`.
- Developer Mode should be reachable from homepage and sector pages.

## Builder Check

`/admin/builder` should support:

- adding a heading block
- adding a paragraph block
- adding a button block
- adding a banner block
- adding an info card block
- adding a sector card block
- adding a divider block
- selecting a block
- editing selected block properties
- saving blocks
- refreshing the page and keeping saved blocks
- resetting to default blocks

## Do Not Count As Complete

Do not count a task as complete if:

- a route exists but the target UI does not render
- a button exists but cannot be clicked
- a save button exists but refresh does not preserve data
- a component is imported but not actually rendered
- a page only shows a placeholder when the user requested real functionality
- build was not run
