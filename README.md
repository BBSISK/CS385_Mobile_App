# MintedMU: CS385 Student Marketplace

A free swap marketplace for Maynooth University students. Students give away things they no longer need to other students, and **earn carbon credits for every completed exchange**.

The **MVP covers clothing**. Books, electrical goods, furniture and kitchenware will follow once the clothing loop works end to end.

Built for **CS385 Mobile Apps Development** (Maynooth University, 2026–27) under the module theme **"A sustainable environment"**.

![CI](https://github.com/BBSISK/CS385_Mobile_App/actions/workflows/ci.yml/badge.svg)

---

## Current status (20 November 2026, Sprint 5)

| Area                                                                        | Status                                                                 |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| App shell, navigation and UI (Home, Browse, Item detail, Wardrobe, Profile) | ✅ Built with mock data                                                |
| Carbon calculator (kg CO₂e and points per clothing item)                    | ✅ Done, using a Climatiq / UK government factor                       |
| Carbon estimate on Item detail                                              | ✅ Done                                                                |
| Credit ledger rules (awarded once, both users, campus totals)               | ✅ Done as tested pure functions                                       |
| Profile carbon totals                                                       | ✅ Calculated from a mock ledger through `src/api`                     |
| Climatiq client (request, error handling, fallback)                         | ✅ Done and tested (`supabase/functions/_shared/climatiq.ts`)          |
| Supabase backend (auth, tables, security rules)                             | 🔄 In progress. Spec for the carbon tables: `docs/carbon-data-spec.md` |
| Profile and admin totals read from Supabase instead of mock data            | ⏳ Waiting on the Supabase project (only `src/api/carbon.ts` changes)  |
| `refresh-carbon-factors` Edge Function                                      | ⏳ Waiting on the Supabase project                                     |
| Upload ("List") screen                                                      | ⏳ Placeholder                                                         |
| Messages                                                                    | ⏳ Placeholder                                                         |
| Admin dashboard                                                             | ⏳ Not started                                                         |
| Tooling: ESLint, Prettier, Husky, Jest, CI                                  | ✅ Done                                                                |

---

## Why it fits "A sustainable environment"

- **Reuse over buying new.** Every swap keeps an item in use and out of landfill.
- **Visible impact.** Each completed exchange awards carbon credits and an estimated kg CO2e saved, shown to the user on their Account screen.
- **Campus-wide picture.** The admin dashboard shows total exchanges, credits awarded and CO2e saved across the university.

---

## Features

| Screen            | File                                        | What it does                                                                                            | Status                |
| ----------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------- |
| **Home**          | `src/app/index.tsx`                         | Search and filter chips (All, Women, Men, Sportswear, Designer) over the latest items                   | Built (mock data)     |
| **Browse**        | `src/app/browse.tsx`, `category/[name].tsx` | Category tiles (Tops, Bottoms, Outerwear, Dresses, Footwear, Accessories, Bags), then a searchable list | Built (mock data)     |
| **Item detail**   | `src/app/item/[id].tsx`                     | Photos, condition, size, pickup, **carbon saving and points**, Request and Like                         | Built (mock data)     |
| **List (Upload)** | `src/app/list.tsx`                          | List an item with up to 3 photos, title, description, sub-category, condition and pickup location       | Placeholder           |
| **Wardrobe**      | `src/app/wardrobe.tsx`                      | My items (Active / Liked / Completed), Messages, Scheduled hand-overs and Requests                      | Built except Messages |
| **Profile**       | `src/app/profile.tsx`                       | Dashboard (**carbon points**, items donated, review average, **kg CO₂e saved**), Reviews, Notifications | Built (mock data)     |
| **Admin**         | —                                           | All transactions with filters, analytics (KPI tiles and charts), and moderation of reported listings    | Not started           |

Ideas still to decide: an analytics deep-dive on carbon credits, and messaging between students.

### The exchange loop

```
Upload item → Another student requests it → Owner accepts
   → Both confirm hand-over → Exchange completed → Carbon credits awarded to both
```

- Credits are awarded **once only** per completed exchange, written to an append-only ledger.
- Sign-up is restricted to **Maynooth University email addresses**.

---

## Tech stack

| Area               | Choice                                                                            |
| ------------------ | --------------------------------------------------------------------------------- |
| App                | React Native 0.88 with **Expo SDK 58** (React 19.3)                               |
| Language           | **TypeScript** (strict mode)                                                      |
| UI                 | **React Native Paper** (Material 3), designed from the Figma Material 3 kit       |
| Navigation         | Expo Router, routes in `src/app` (tabs: Home, Browse, List, Wardrobe, Profile)    |
| Backend            | **Supabase** (in progress): auth, Postgres, Row Level Security, Edge Functions    |
| Carbon data        | **Climatiq** API (UK government clothing factor), with an offline fallback table  |
| Data fetching      | Typed data layer in `src/api` with hooks; screens never call the backend directly |
| Testing            | Jest, React Native Testing Library; end-to-end flow test planned                  |
| Quality            | ESLint, Prettier, Husky pre-commit hooks, GitHub Actions CI                       |
| Project management | Jira (Scrum, 1-week sprints): space **CS385**                                     |

---

## Getting started

### Prerequisites

- Node.js (LTS) and npm
- Git
- The **Expo Go** app on your phone (iOS or Android), updated to support **SDK 58**. Each Expo Go version runs only one SDK, so an out-of-date Expo Go shows a loading circle and then "Something went wrong".

### Run the app

```bash
git clone https://github.com/BBSISK/CS385_Mobile_App.git
cd CS385_Mobile_App
npm install
npx expo start
```

Scan the QR code from inside the Expo Go app (Android) or with the Camera app (iOS).

**On campus Wi-Fi** (eduroam blocks phone-to-laptop connections), use a tunnel instead:

```bash
npx expo start -c --tunnel ngrok
```

Once Supabase is connected, the backend keys will go in a `.env` file (ask the team; never commit it).

### Useful scripts

```bash
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run format:check  # Prettier
npm test              # Jest unit and component tests
```

CI runs all four on every pull request, and the `check` job must pass before merging. A `seed` script for demo data is planned once Supabase is ready.

```bash
npx expo install --check   # are our packages the versions SDK 58 expects?
```

---

## Project structure

```
src/
  app/               Screens and routes (Expo Router): index, browse, list, wardrobe, profile,
                     item/[id], category/[name], _layout (tab bar)
  api/               Data layer and hooks, e.g. useCarbonSummary(); mock data now, Supabase later
  components/        Shared UI (TopBar, ItemCard, ChipRow, StatCard, CarbonImpact…)
  constants/         Theme (paperTheme.ts) and mock data (mockData.ts, mockExchanges.ts)
  lib/               Pure, unit-tested logic: carbon.ts (estimates), ledger.ts (credit rules)
  hooks/             Colour-scheme helpers
supabase/functions/  Server-side code for Supabase Edge Functions (holds secret keys; the app must never import it)
  _shared/climatiq.ts  Climatiq client: fetches the clothing factor, handles errors, falls back
docs/                Carbon method and sources, Supabase data spec
.github/             PR template and CI workflow
```

Tests sit next to the code they test, in `__tests__` folders.

A lint rule stops any file in `src/` importing from `supabase/functions`, so API keys can't end up in the app bundle.

---

## Data model (draft)

| Entity           | Key fields                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **User**         | id, email (Maynooth), displayName, course, role (`student` / `admin`)                                                       |
| **Item**         | id, ownerId, title, description, category, condition, pickupLocation, photos[], status (`available` → `reserved` → `given`) |
| **Request**      | id, itemId, requesterId, message, status (`pending` / `accepted` / `declined`)                                              |
| **Exchange**     | id, itemId, giverId, receiverId, status (`accepted` → `completed` / `cancelled`), giverConfirmed, receiverConfirmed         |
| **CreditLedger** | id, exchangeId, userId, role (`giver` / `receiver`), points, kgCO2e, createdAt (append-only; unique per exchange and user)  |
| **CarbonFactor** | subcategory, weightKg, kgCO2ePerKg, source, climatiqActivityId, updatedAt                                                   |

The Supabase tables, security rules and `complete_exchange()` function for the carbon data are specified in `docs/carbon-data-spec.md`.

### Carbon credits

Each clothing sub-category has a typical weight. The saving from a swap is:

```
kg CO₂e saved = typical weight (kg) × 22.31 kg CO₂e per kg × 0.646
points        = round(kg CO₂e saved × 10)
```

- **22.31 kg CO₂e per kg** is the UK government (BEIS/DESNZ) clothing factor, via Climatiq.
- **0.646** is WRAP's displacement rate: about 65% of second-hand purchases replace buying new.
- The estimate is deliberately conservative: it covers material production only, not transport, retail or washing.

| Sub-category | kg CO₂e | Points |
| ------------ | ------- | ------ |
| Accessories  | 1.4     | 14     |
| Tops         | 3.6     | 36     |
| Dresses      | 4.3     | 43     |
| Bottoms      | 7.2     | 72     |
| Bags         | 8.6     | 86     |
| Footwear     | 13.0    | 130    |
| Outerwear    | 17.3    | 173    |

**Rules:** both the giver and the receiver earn the full points; campus totals count each exchange's CO₂e once; credits are awarded once only per exchange and user.

**Code:** `src/lib/carbon.ts` (estimates), `src/lib/ledger.ts` (credit rules), `src/components/CarbonImpact.tsx` (Item detail card), `src/api/carbon.ts` (data layer), `supabase/functions/_shared/climatiq.ts` (Climatiq client). Method, sources and limitations: `docs/carbon-credits.md`.

---

## How we work

### Branches, commits and PRs

Every piece of work starts from a Jira ticket. Putting the ticket key in all three places links the work to Jira automatically:

|          | Format                      | Example                           |
| -------- | --------------------------- | --------------------------------- |
| Branch   | `CS385-<ticket>-short-desc` | `CS385-27-upload-form`            |
| Commit   | `CS385-<ticket> message`    | `CS385-27 add title validation`   |
| PR title | `CS385-<ticket> Title`      | `CS385-27 Upload form validation` |

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

| Sprint            | Dates          | Goal                                                                                    |
| ----------------- | -------------- | --------------------------------------------------------------------------------------- |
| 1 – Foundations   | 19–25 Oct      | Idea approved against the theme; repo, scaffold, wireframes, backend chosen, data model |
| 2 – Auth & API    | 26 Oct – 1 Nov | Maynooth-email sign-up and login; typed API layer; CI; UI kit                           |
| 3 – Upload        | 2–8 Nov        | Post an item with photos; security rules; admin role                                    |
| 4 – Marketplace   | 9–15 Nov       | Browse, search, item detail, request an item; unit tests                                |
| 5 – Exchanges     | 16–22 Nov      | Full exchange loop; carbon credits awarded exactly once                                 |
| 6 – Account       | 23–29 Nov      | Account status screen; seed data; analytics queries                                     |
| 7 – Admin         | 30 Nov – 6 Dec | Transactions, analytics charts, moderation; **feature-complete**                        |
| 8 – Test & polish | 7–13 Dec       | Feature freeze; end-to-end test; accessibility; commenting pass                         |
| 9 – Submit        | 14–18 Dec      | Screencast recorded; code and video submitted                                           |

---

## Coursework deliverables

- [ ] All source code, **commented properly**
- [ ] A short **screencast video** of the app working (a working demo)
- [ ] Submitted before the deadline: **12:00 noon (Maynooth time)**. We are planning to **Friday 18 December 2026** until the lecturer confirms the exact date.

Individual engagement is assessed in the **6 project labs**. Each member's work should be traceable through their Jira tickets, commits, PRs and code reviews (see `docs/contributions.md`).

---

## Team

| Member        | Role                |
| ------------- | ------------------- |
| Barry Sisk    | Lead / Scrum Master |
| Aisha Hussein | _TBC_               |
| Sean Keane    | _TBC_               |
| _TBC_         | _TBC_               |

Roles: **Lead / Scrum Master**, **Frontend**, **Backend**, **QA / Design**. Everyone writes code, tests and comments.

---

## Licence

Coursework for CS385 at Maynooth University. All rights reserved by the team members unless stated otherwise.
