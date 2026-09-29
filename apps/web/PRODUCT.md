# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Small software teams of roughly 2–15 people, at work, actively comparing TeamUp
against Jira, Trello, and Linear. The person on the page is usually the one who
would have to migrate the team, so they are deciding "is this enough, and is
switching worth it" rather than browsing.

## Product Purpose

Track projects and the tasks inside them on a board. A team creates a project,
adds tasks, assigns the people doing them, and moves each task through Todo →
In progress → Done. Success is a team working from the board on day one with no
configuration step in between.

## Positioning

The scope itself is the product: TeamUp deliberately omits the machinery that
makes Jira expensive to adopt — no workflow builder, no permission matrix, no
story points or velocity charts, no nested epics. It is free, open source, and
self-hostable, so it also has no per-seat price that grows with the team. A
competitor could copy the board; it could not truthfully copy "there is nothing
to configure and nothing to pay per seat."

## Operating Context

The visitor already runs a tracker and is mid-comparison, often with a
competitor open in another tab. Work is grouped into projects owned by one
person; tasks carry a title, an optional description, a status, and an optional
assignee. Everything happens in a browser on a desktop during the workday.

## Capabilities and Constraints

Confirmed and built:

- Register and sign in; JWT access tokens plus rotating refresh tokens
- Projects: create, list, read, update, delete, scoped to their owner
- Tasks nested under a project: create, list, update, delete
- `TaskStatus` is exactly `TODO`, `IN_PROGRESS`, `DONE`
- Optional assignee per task
- Stack: Next.js web app, Express API, PostgreSQL via Prisma, pnpm monorepo
- Intended hosting: Railway (API + database) and Vercel (web)

Explicitly undecided, and not to be implied as shipping: team invites, comments,
notifications, activity feed, search and filters, role-based permissions.

Not yet built but featured on the landing page at the owner's request: the
command palette (⌘K). Build it or remove it from the page before launch.

## Brand Commitments

- Name: TeamUp.
- Light mode only. No dark theme.
- Marketing and product both follow the Trackflow design system from Figma
  (file `yFa3t3hhno6p4L7pz2u94d`), adapted to a light theme. See DESIGN.md.
- "Trackflow" is the design system's name, not the product's. The product is
  TeamUp; the marketing name lives in `src/components/landing/brand.ts`.

## Evidence on Hand

Real: the working application itself — authentication, projects, tasks,
statuses, and assignment all function against the API.

Absent, and never to be fabricated: customers, logos, testimonials, user counts,
funding, press, benchmarks, uptime figures, and any pricing table. There is no
social proof of any kind yet.

## Product Principles

1. Absence is the feature. What TeamUp leaves out is the argument for adopting
   it, so omissions are stated plainly rather than hidden.
2. The board is the entire surface area of the product. Anything that is not the
   board is support for it.
3. The page must survive a side-by-side comparison with Jira. A visitor should be
   able to answer "why switch" without scrolling far.
4. Free, open source, and self-hostable is a durable differentiator against
   per-seat pricing, and it is true, so it is said directly.
5. No invented proof. Until real users exist, credibility comes from showing the
   product working, not from claiming adoption.

## Accessibility & Inclusion

Light theme only, so contrast is checked against light surfaces: body and
placeholder text at or above 4.5:1, large text at or above 3:1. Interactive
controls keep a visible keyboard focus state, and motion is gated behind
`prefers-reduced-motion`.
