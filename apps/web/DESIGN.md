# Design

<!-- impeccable:design-schema 1 -->

## Scope

One system for marketing and product, called **signage**. Tokens live in
`src/app/globals.css`; this file explains them. It replaces both the indigo
"Trackflow" system this file used to describe and the Microsoft Fluent tokens
that were actually shipping.

## The idea

TeamUp's argument is that it contains almost nothing: three statuses, no
workflow builder, no permission matrix. The design borrows from wayfinding
signage to make that emptiness read as confidence rather than absence:

- A few marks set large on a wide, quiet field.
- Hierarchy carried by size and width, not by decoration.
- Colour used only as a signal, never as ornament.

The things you navigate by (page titles, project names, column counts) are big.
Everything else is small and quiet. There is nothing in between.

## Color

| Token | Value | Role |
| --- | --- | --- |
| `field` | `#eaece5` | page ground; a cool green-grey, deliberately not cream |
| `field-deep` | `#dfe2d9` | sidebar, board column trays |
| `surface` | `#ffffff` | panels, rows, cards, inputs |
| `ink` | `#000000` | display type, primary text, done marks. True black, never tinted. |
| `graphite` | `#4a4c46` | body text (9.5:1 on surface, 8.4:1 on field) |
| `slate` | `#62655e` | meta, placeholders, keys (5.7:1 on surface, 4.5:1 on field) |
| `rule` | `#d7d9d0` | dividers between rows; decorative only |
| `edge` | `#8a8d83` | control borders (3.4:1 on surface, so inputs are findable) |
| `signal` | `#f2c230` | work in progress, the primary action, selection |
| `signal-deep` | `#d9a916` | hover on signal fills |
| `signal-wash` | `#fdf3d6` | drop target while dragging |
| `alert` | `#b32d1c` | destructive actions only (7.7:1 on surface) |

**The signal rule.** Black on `signal` is 12.7:1, the most legible pair there
is, which is why signage uses it. It stays scarce. A screen has **at most one
yellow button**; if two things are yellow, neither is the signal. When a second
call to action shares a viewport, it uses the outline style (black border, which
inverts to solid black on hover).

Yellow on white is only about 1.6:1, so yellow is never the sole boundary of a
mark. The in-progress status icon is a black ring *filled* with yellow.

## Status

Status is a drawn form first and a colour second, so it survives greyscale and
every kind of colour blindness. The three states step light, mid, dark:

| Status | Icon | Column band | Plate |
| --- | --- | --- | --- |
| Todo | dashed hollow ring, `edge` grey | 3px `edge` grey | outline |
| In progress | black ring, half filled `signal` | 3px `signal` | yellow |
| Done | filled `ink` disc, white check | 3px `ink` | black |

There is no green and no traffic-light palette.

## Type

**Archivo**, one variable family with two widths. There is no second typeface
and no monospace.

- **Display** (`display` utility): 125% width, weight 800, -0.021em tracking.
  Used on the hero, page titles, project names, dialog titles and column counts.
  Never on body copy.
- **Body**: 100% width, weight 400; labels and names at 600.
- **Keys and counts** (`keyline` utility): 87.5% width, weight 600, tabular
  figures, so columns of `TU-142` align without a monospace face.

Scale (px): 11 / 13 / 15 / 17 / 22 / 30, then `mark`,
`clamp(44px, 8.5vw, 100px)`. The gap between 30 and `mark` is deliberate. Body
is 15px; the old 13px-everywhere had no hierarchy. Labels are sentence case and
never set in tracked caps.

## Shape and elevation

- Radius: 2px (`mark`) on buttons, inputs and plates; 3px (`panel`) on panels
  and cards. Nothing is pill-shaped.
- **No decorative shadows.** A white panel separates from the page because the
  page is greige. The only shadow, `float`, goes on things that really sit above
  the page: dialogs, menus, and a card while it is being dragged. Anything that
  floats also gets a 1px `ink` border.
- The active sidebar item is marked by a 4px black bar at the left edge, the
  way a platform sign marks where you are standing, plus a white fill.
- Focus is a 2px black outline at 2px offset, everywhere. A yellow ring would
  vanish on the yellow buttons.

## Motion

One orchestrated moment, on the landing page only. The hero board's columns
settle in reading order; then one issue ("Rotate refresh tokens on every use")
leaves In progress, the counts change, and the issue opens into the top of Done.
Moving items collapse and expand through `max-height`, so a column closes the
gap an issue leaves.

Everything starts from its final state. Under `prefers-reduced-motion`, only the
end state renders. In the app, motion only answers actions: press (1px nudge),
dialog open (scale from 0.97), drag.

## Copy

- The product's noun is **issue**, everywhere. Never "task" in the UI, even
  though the API model is `Task`.
- An action keeps its name through the flow: "New project" opens a dialog whose
  button is "Create project"; "Add issue" adds an issue.
- Empty states say what to do next ("Type one into the box above. It lands in
  Todo, ready to move."), not how the screen feels.
- Nothing implies a feature that isn't built. The disabled search, Inbox,
  Settings and the ⌘K palette were removed for this reason; see PRODUCT.md.

## Known gaps

- The app shell has no mobile layout: the 240px sidebar is always visible.
  PRODUCT.md scopes use to desktop, but the sidebar should collapse below `md`
  before anyone uses TeamUp on a phone.
- The landing components below were orphaned by this redesign, still use the
  retired tokens, and can be deleted: `landing/hero-app.tsx`,
  `landing/feature-cards.tsx`, `landing/showcase.tsx`, `landing/primitives.tsx`,
  `landing/icons.tsx`, `marketing/board-preview.tsx`.
