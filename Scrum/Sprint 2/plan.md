# Sprint 2 Plan

**Project:** Expense Tracker  
**Sprint Goal:** Summaries & Categories

## Sprint Dates
Start: 2025‑10-15
End: 2025‑10‑19

## Roles (Rotate each sprint)
- Product Owner: Nelson 
- Scrum Master: Shintaroo Miyata
- Developers: Nelson Llanes, shintaro Miyata, Matheus Paternez

## Selected Stories (from Product Backlog)
| ID | Story | Priority | Estimate | Acceptance Criteria (summary) |
|---|---|---|---|---|
| 1 | As a user, I want to edit an expense (amount, category, date, description). | High | 3 | Changes persist in LocalStorage and update the list view. |
| 2 | As a user, I want to filter expenses by category and view them monthly. | Medium | 5 | Filters apply dynamically; monthly view updates totals. |
| 3 | As a user, I want to see a summary of expenses by category with basic chart integration. | Low | 8 | Chart displays category totals; optional for this sprint. |


## Task Breakdown

| Story ID | Task Name | Task Owner | Estimate | Status |
|---|---|---|---|---|
| 1 | Build expense edit form (HTML/CSS) | Nelson | 2 days | Not-Started |
| 1 | Implement edit functionality (JS) | Nelson | 3 days | Not-Started |
| 1 | Save edited expense to LocalStorage | Nelson | 2 days | Not-Started |
| 2 | Create category filter dropdown (HTML/CSS) | Matheus | 2 days | Not-Started |
| 2 | Implement filter logic (JS) | Matheus | 3 days | Not-Started |
| 2 | Add monthly view toggle (HTML/JS) | Matheus | 2 days | Not-Started |
| 3 | Design basic chart UI (HTML/CSS) | Shintaro | 1 days | Not-Started |
| 3 | Integrate chart library (JS) | Shintaro | 1 days | Not-Started |
| 3 | Calculate category totals (JS) | Shintaro | 1 days | Not-Started |

## Risks / Assumptions

- Risk: Inconsistent LocalStorage schema → **Mitigation:** define a single `expenses` array shape up front.

- Risk: Time underestimated for UI polish → **Mitigation:** keep styles minimal this sprint.
