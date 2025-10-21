# Expense Tracker — with Scrum

A lightweight web app to add, edit, delete, categorize, and summarize expenses. Data persists in LocalStorage. The project is developed using Scrum with 1-week sprints.

## How to run locally

- Just open `index.html` in your browser. No backend required.
- Recommended: use a local HTTP server for better file access behavior on some browsers.

## Features

- Expense management: add, edit, delete
- Fields: amount, category, date, description
- Categories: e.g., Supermarket, Food, Transport, Transfer, Others
- Summary views: totals per category and by date (line + pie charts using Chart.js)
- Budgets: set per-category budgets; get confirm alert when exceeding on add; budget exceed highlighting in UI
- Persistence: all data saved and loaded from LocalStorage
- Accessibility: tab UI enhanced with ARIA roles and keyboard navigation (Left/Right arrows)

## Data & storage

- LocalStorage keys
  - `expenses`: array of expense objects
  - `budgets`: object map `{ [category: string]: number }`
- Expense shape (example)

```json
{
  "id": "uuid",
  "amount": 23.5,
  "category": "Food",
  "note": "Lunch",
  "occurredAt": "2025-10-20"
}
```

## Charts

- Pie chart: totals by category
- Line chart: totals by date (dates sorted ascending)
- Tabbed UI with fade-in/out animation when switching charts

## Budgets & alerts

- Set budgets per category on `setting.html`
- Budgets are stored under `budgets` in LocalStorage
- When adding an expense that exceeds its category budget, a `confirm` prompt asks whether to proceed
- Exceeded categories can be highlighted in red via `checkBudgetExceed()` after rendering the list

## Accessibility

- Tabs include ARIA roles: `role="tablist"`, `role="tab"`, `role="tabpanel"`
- `aria-selected`, `aria-controls`, and `aria-labelledby` wired
- Keyboard support: ArrowLeft/ArrowRight switches tabs and focus

## Scrum summary

### Sprint 1 — Core CRUD + basic UI

- Goal: Core CRUD with LocalStorage and responsive UI
- Dates: 2025‑09‑30 → 2025‑10‑05
- Roles: PO Nelson, SM Shintaroo, Devs Nelson / shintaro / Matheus
- Key stories: add expense, delete expense, list expenses

### Sprint 2 — Summaries & Categories

- Goal: Edit expense, category filters, monthly view, summary with chart baseline
- Dates: 2025‑10‑15 → 2025‑10‑19
- Roles: PO Nelson, SM Shintaroo, Devs Nelson / shintaro / Matheus
- Key stories: edit flow, filter by category, monthly view, basic chart integration

### Sprint 3 — Budgets & Polish

- Goal: Budgets per category + alerts, accessibility polish, docs/testing
- Dates: 2025‑10‑20 → 2025‑10‑23
- Roles: PO Nelson, SM Shintaroo, Devs Nelson / shintaro / Matheus
- Key stories: budget UI (setting.html), alert triggers, a11y improvements, README updates

## Known limitations

- LocalStorage only (no backend sync)
- Data validation minimal (amount/date formats)
- Charts require data present; empty states kept simple
- Possible browser differences for date parsing; use ISO `YYYY-MM-DD`
- No authentication; data is per-browser

## Project structure (subset)

- `index.html` — main UI
- `setting.html` — budgets settings UI
- `js/event.js` — expense list rendering, delete flow, etc.
- `js/storage.js` — storage helpers (expenses, budgets)
- `js/chart.js` — chart rendering and tab UI
- `Scrum/` — Scrum artifacts per sprint (plan, daily, review, retro)
