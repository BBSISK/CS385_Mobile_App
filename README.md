# CS385 Student Marketplace Oct 2026

A free swap marketplace for Maynooth University students. Students give away things they no longer need (clothes, electrical items, books, furniture, kitchenware) to other students, and **earn carbon credits for every completed exchange**.

Built for **CS385 Mobile Apps Development** (Maynooth University, 2026–27) under the module theme **"A sustainable environment"**.

![CI](https://github.com/BBSISK/CS385_Mobile_App/actions/workflows/ci.yml/badge.svg)

---

## Why it fits "A sustainable environment"

- **Reuse over buying new.** Every swap keeps an item in use and out of landfill.
- **Visible impact.** Each completed exchange awards carbon credits and an estimated kg CO2e saved, shown to the user on their Account screen.
- **Campus-wide picture.** The admin dashboard shows total exchanges, credits awarded and CO2e saved across the university.

---

## Features

| Screen | What it does |
|---|---|
| **Upload** | List an item with up to 3 photos (camera or gallery), title, description, category, condition and campus pickup location |
| **Marketplace** | Browse, search and filter available items; view item details; request an item |
| **Account status** | Your carbon-credit balance (with analytics deepdive), CO2e saved, requests made and received, and exchange history |
| **Account Profile** | Collection of User's listed items , reviews / feedback , cross reference to carbon credit balance, Messaging ? |
| **Admin** | All transactions with filters, analytics (KPI tiles and charts), and moderation of reported listings |

### The exchange loop

```
Upload item → Another student requests it → Owner accepts
   → Both confirm hand-over → Exchange completed → Carbon credits awarded to both
```

- Credits are awarded **once only** per completed exchange, written to an append-only ledger.
- Sign-up is restricted to **Maynooth University email addresses**.

---

## Tech stack

| Area | Choice |
|---|---|
| App | React Native with **Expo** |
| Language | **TypeScript** (strict mode) |
| Navigation | Expo Router (tabs: Marketplace, Upload, Account; admin-only route) |
| Backend | *To be decided in Sprint 1: Firebase or Supabase* (see `docs/adr-001-backend.md`) |
| Data fetching | Typed API layer in `src/api` with query hooks |
| Testing | Jest, React Native Testing Library, end-to-end flow test |
| Quality | ESLint, Prettier, Husky pre-commit hooks, GitHub Actions CI |
| Project management | Jira (Scrum, 1-week sprints): space **CS385** |

---

## Getting started

### Prerequisites

- Node.js (LTS) and npm
- Git
- The **Expo Go** app on your phone (iOS or Android), or an iOS Simulator / Android Emulator

### Run the app

```bash
git clone https://github.com/BBSISK/CS385_Mobile_App.git
cd CS385_Mobile_App
npm install
cp .env.example .env      # then fill in the backend keys (ask the team; never commit .env)
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

### Useful scripts

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Jest unit and component tests
npm run seed        # load demo users, items and exchanges (dev database only)
```

---

## Project structure (planned)

```
app/                 Screens and routes (Expo Router)
  (tabs)/marketplace
  (tabs)/upload
  (tabs)/account
  admin/
src/
  api/               Typed API client and data hooks; screens never call the backend directly
  components/        Shared UI kit (Button, Card, TextInput, Chip, EmptyState…)
  lib/               Pure logic, e.g. calculateCredits(), validation
  types/             Shared TypeScript types
  theme/             Colours, spacing, typography
docs/                Decision records, data model, carbon-credit sources, contributions log
.github/             PR template and CI workflow
```

---

## Data model (draft)

| Entity | Key fields |
|---|---|
| **User** | id, email (Maynooth), displayName, course, role (`student` / `admin`) |
| **Item** | id, ownerId, title, description, category, condition, pickupLocation, photos[], status (`available` → `reserved` → `given`) |
| **Request** | id, itemId, requesterId, message, status (`pending` / `accepted` / `declined`) |
| **Exchange** | id, itemId, giverId, receiverId, status (`accepted` → `completed` / `cancelled`), giverConfirmed, receiverConfirmed |
| **CreditLedger** | id, userId, exchangeId, credits, kgCO2e, createdAt (append-only) |

### Carbon credits

Credits depend on the item's category: larger or more carbon-intensive items earn more (e.g. Electrical > Clothes > Books). The credits are split between giver and receiver. Values and the sources for the CO2e estimates are documented in `docs/carbon-credits.md`. The logic lives in the pure, unit-tested function `calculateCredits()`.

---

## How we work

### Branches, commits and PRs

Every piece of work starts from a Jira ticket. Putting the ticket key in all three places links the work to Jira automatically:

| | Format | Example |
|---|---|---|
| Branch | `CS385-<ticket>-short-desc` | `CS385-27-upload-form` |
| Commit | `CS385-<ticket> message` | `CS385-27 add title validation` |
| PR title | `CS385-<ticket> Title` | `CS385-27 Upload form validation` |

- `main` is protected: all changes go through a **pull request with 1 approval**, and force pushes are blocked.
- Fill in the PR template checklist on every PR.
- Each member reviews at least one teammate's PR every sprint.

### Definition of Done

A ticket is **Done** when:

- [ ] Acceptance criteria on the Jira ticket are met
- [ ] Code is **properly commented**: TSDoc on every exported component, hook and function, and "why" comments on non-obvious logic
- [ ] Code reviewed and approved by a teammate
- [ ] Tests added/updated and passing in CI
- [ ] Demoed on a real device or simulator

### Sprint rhythm (1-week sprints)

- **Monday:** sprint planning
- **2–3× per week:** short stand-up
- **Friday:** sprint review and retro
- **Before each project lab:** board up to date and every member ready to show their own tickets

---

## Sprint plan

| Sprint | Dates | Goal |
|---|---|---|
| 1 – Foundations | 19–25 Oct | Idea approved against the theme; repo, scaffold, wireframes, backend chosen, data model |
| 2 – Auth & API | 26 Oct – 1 Nov | Maynooth-email sign-up and login; typed API layer; CI; UI kit |
| 3 – Upload | 2–8 Nov | Post an item with photos; security rules; admin role |
| 4 – Marketplace | 9–15 Nov | Browse, search, item detail, request an item; unit tests |
| 5 – Exchanges | 16–22 Nov | Full exchange loop; carbon credits awarded exactly once |
| 6 – Account | 23–29 Nov | Account status screen; seed data; analytics queries |
| 7 – Admin | 30 Nov – 6 Dec | Transactions, analytics charts, moderation; **feature-complete** |
| 8 – Test & polish | 7–13 Dec | Feature freeze; end-to-end test; accessibility; commenting pass |
| 9 – Submit | 14–18 Dec | Screencast recorded; code and video submitted |

---

## Coursework deliverables

- [ ] All source code, **commented properly**
- [ ] A short **screencast video** of the app working (a working demo)
- [ ] Submitted before the deadline: **12:00 noon (Maynooth time)**. We are planning to **Friday 18 December 2026** until the lecturer confirms the exact date.

Individual engagement is assessed in the **6 project labs**. Each member's work should be traceable through their Jira tickets, commits, PRs and code reviews (see `docs/contributions.md`).

---

## Team

| Member | Role |
|---|---|
| Barry Sisk | Lead / Scrum Master |
| Aisha Hussein | *TBC* |
| Sean Keane | *TBC* |
| *TBC* | *TBC* |

Roles: **Lead / Scrum Master**, **Frontend**, **Backend**, **QA / Design**. Everyone writes code, tests and comments.

---

## Licence

Coursework for CS385 at Maynooth University. All rights reserved by the team members unless stated otherwise.
