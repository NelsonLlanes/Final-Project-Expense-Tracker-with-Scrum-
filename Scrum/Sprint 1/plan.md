# Sprint 1 Plan

**Project:** Expense Tracker  
**Sprint Goal:** Core CRUD with LocalStorage + basic responsive UI

## Sprint Dates
Start: 2025‑09‑30  
End: 2025‑10‑05

## Roles (Rotate each sprint)
- Product Owner: Nelson 
- Scrum Master: Shintaroo Miyata
- Developers: Nelson Llanes, shintaro Miyata, Matheus Paternez

## Selected Stories (from Product Backlog)
| ID | Story | Priority | Estimate | Acceptance Criteria (summary) |
|---|---|---|---|---|
| 1 | As a user, I want to add an expense (amount, category, date, description). | High | 3 | Item appears in list and persists on reload. |
| 2 | As a user, I want to delete an expense. | High | 2 | Deleting removes item and updates totals. |
| 3 | As a user, I want to see a list of expenses. | High | 2 | Renders latest first; basic responsive layout. |

## Task Breakdown
| Story ID | Task  Owner | Estimate | Status 
|---|---|---|---|---|

| 1 | Build expense form (HTML/CSS)   
| Matheus            | 4 days | in-progress |  

| 1 | Hook form submit → JS handler    
| shintaroo          | 4 days | in-progress |

| 1 | Save expense to LocalStorage   
| Shintaroo           | 4 days | in-progress |

| 3 | Render list from LocalStorage   
| Nelson             | 4 days | in-progress |
| 2 

| Implement delete action (UI + JS)   
| Nelson         | 4 days | to-do   

| 3 | Basic responsive styling (mobile first)   
| Matheus  | 4 days | To‑Do |


## Risks / Assumptions
- Risk: Inconsistent LocalStorage schema → **Mitigation:** define a single `expenses` array shape up front.
- Risk: Time underestimated for UI polish → **Mitigation:** keep styles minimal this sprint.
