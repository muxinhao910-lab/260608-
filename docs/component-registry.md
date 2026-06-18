# Component Registry

This file records the current and planned website components.

## Current Builder Blocks

### heading

Purpose: page title or section title.

Fields:

- `id`
- `type: "heading"`
- `text`
- `level: 1 | 2 | 3`

Editable:

- text
- level

### paragraph

Purpose: normal text content.

Fields:

- `id`
- `type: "paragraph"`
- `text`

Editable:

- text

### button

Purpose: clickable link button.

Fields:

- `id`
- `type: "button"`
- `text`
- `href`

Editable:

- text
- href

### banner

Purpose: large visual callout area.

Fields:

- `id`
- `type: "banner"`
- `title`
- `subtitle`

Editable:

- title
- subtitle

### card

Purpose: information card.

Fields:

- `id`
- `type: "card"`
- `title`
- `description`

Editable:

- title
- description

### sector-card

Purpose: entry card for a sector page.

Fields:

- `id`
- `type: "sector-card"`
- `title`
- `description`
- `href`

Editable:

- title
- description
- href

### divider

Purpose: visual separator.

Fields:

- `id`
- `type: "divider"`

Editable:

- no fields

## Future Components

Possible future components:

- company search box
- industrial-chain graph
- ETF monitor card
- supply-chain timeline
- financial indicator card
- monthly revenue tracker
- chip price trend card
- macro signal card

Do not add future components unless the user explicitly requests them.
