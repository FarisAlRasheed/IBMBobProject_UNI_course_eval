# University Course Evaluation System — Implementation Plan

## Top-Level Overview

**Goal:** Build a full-stack Next.js 14 (App Router) + TypeScript application called "University Course Evaluation System". The app has a real backend API layer implemented as Next.js Route Handlers that use `@supabase/supabase-js` on the server side only. The frontend uses `fetch()` to call these routes — never the Supabase client directly.

**Scope:**
- Scaffold a brand-new Next.js 14 + TypeScript + Tailwind CSS project via `create-next-app`
- Install `@supabase/supabase-js`
- Build 3 API route handlers
- Build 2 frontend pages (student `/evaluate`, admin `/dashboard`) plus a home page with two links
- Shared UI components (StarRating, CourseCard, etc.)
- Professional blue-and-white university aesthetic via Tailwind

**Non-goals:**
- Authentication / auth system
- Database migrations (tables already exist)
- Dark mode
- Any direct client-side Supabase calls

**Stack:** Next.js 14 App Router · TypeScript (strict) · Tailwind CSS · @supabase/supabase-js (server-only)

---

## Sub-Task 1 — Project Scaffolding & Dependencies

**Intent:** Bootstrap the Next.js project with all required dependencies so every subsequent sub-task has a working foundation to build on.

**Expected Outcomes:**
- `package.json` present with `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `@supabase/supabase-js` listed
- `tsconfig.json` with `strict: true`
- `tailwind.config.ts` and `postcss.config.js` generated
- `next.config.ts` present
- `.env.local` template created with `NEXT_PUBLIC_` prefix intentionally absent (Supabase vars are server-only)
- Project can be started with `npm run dev` (even if pages are placeholder)

**Todo List:**
1. Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"` in the workspace root
2. Install `@supabase/supabase-js`: `npm install @supabase/supabase-js`
3. Create `.env.local` with two server-only variables: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (no `NEXT_PUBLIC_` prefix — these must never be exposed to the browser)
4. Verify `tsconfig.json` has `"strict": true`
5. Clean up the boilerplate `app/page.tsx` to a minimal placeholder

**Relevant Context:** Workspace is completely empty. TypeScript + Tailwind confirmed by user.

**Status:** [ ] pending

---

## Sub-Task 2 — Supabase Server Client & Shared Types

**Intent:** Create a single server-side Supabase client factory and shared TypeScript types so all API routes share the same setup and type definitions.

**Expected Outcomes:**
- `lib/supabase.ts` — exports a `createClient()` call using `SUPABASE_URL` + `SUPABASE_ANON_KEY` env vars
- `lib/types.ts` — exports `Course`, `Evaluation`, and `EvaluationSummary` TypeScript interfaces matching the DB schema
- No Supabase import anywhere outside `lib/supabase.ts` and the API route handlers

**Todo List:**
1. Create `lib/supabase.ts`:
   - Import `createClient` from `@supabase/supabase-js`
   - Read `process.env.SUPABASE_URL` and `process.env.SUPABASE_ANON_KEY`
   - Export a single `supabase` client instance (singleton is fine for Route Handlers)
2. Create `lib/types.ts`:
   - `Course`: `{ id: string; code: string; name: string; instructor_name: string; semester: string }`
   - `Evaluation`: `{ id: string; course_id: string; student_identifier: string; rating: number; comment: string | null; semester: string; created_at: string }`
   - `EvaluationSummary`: `{ course_id: string; course_name: string; course_code: string; instructor_name: string; semester: string; average_rating: number; evaluation_count: number; comments: string[] }`

**Relevant Context:** Sub-Task 1 must be complete. Files go in `lib/` at the project root.

**Status:** [ ] pending

---

## Sub-Task 3 — API Route: GET /api/courses

**Intent:** Expose a server-side endpoint that fetches all rows from the `courses` table and returns them as JSON. The frontend will call this to populate the course selection dropdown.

**Expected Outcomes:**
- `app/api/courses/route.ts` exists
- `GET /api/courses` returns `200` with `{ courses: Course[] }` (ordered by `name` ascending)
- Returns `500` with `{ error: string }` on Supabase failure
- Uses the `supabase` client from `lib/supabase.ts`, never imported in any client component

**Todo List:**
1. Create `app/api/courses/route.ts`
2. Export an async `GET` handler (Next.js Route Handler convention)
3. Query `supabase.from('courses').select('*').order('name')`
4. On error → return `NextResponse.json({ error: data.error.message }, { status: 500 })`
5. On success → return `NextResponse.json({ courses: data })`

**Relevant Context:** Sub-Task 2 must be complete. Follow Next.js App Router Route Handler patterns (`export async function GET()`).

**Status:** [ ] pending

---

## Sub-Task 4 — API Route: POST /api/evaluations

**Intent:** Accept a student's evaluation submission, insert it into the `evaluations` table, and handle the unique constraint violation (duplicate submission) gracefully with a 409 response.

**Expected Outcomes:**
- `app/api/evaluations/route.ts` exists
- `POST /api/evaluations` with body `{ course_id, student_identifier, rating, comment }` inserts a row
- Success → `201` with `{ evaluation: Evaluation }`
- Duplicate (Postgres error code `23505`) → `409` with `{ error: "You have already submitted an evaluation for this course this semester." }`
- Invalid body (missing fields or rating out of 1–5 range) → `400` with `{ error: string }`
- Other DB errors → `500`
- The `semester` field on the inserted row is taken from the course's semester (fetched first) OR accepted as part of the body — **accept it as part of the POST body** to keep the route simple (the frontend will include it)

**Todo List:**
1. Create `app/api/evaluations/route.ts`
2. Export an async `POST` handler
3. Parse and validate the JSON body — check that `course_id`, `student_identifier`, `rating` are present; `rating` must be an integer 1–5
4. Insert into `evaluations` via `supabase.from('evaluations').insert({...}).select().single()`
5. Check `error.code === '23505'` → return 409
6. Other errors → return 500
7. Success → return 201

**Relevant Context:** Sub-Task 2 must be complete. Postgres unique-constraint violation error code is `23505`.

**Status:** [ ] pending

---

## Sub-Task 5 — API Route: GET /api/evaluations/summary

**Intent:** Aggregate evaluation data per course — average rating, count, and comments — and return it sorted by average rating descending. This powers the admin dashboard.

**Expected Outcomes:**
- `app/api/evaluations/summary/route.ts` exists
- `GET /api/evaluations/summary` returns `200` with `{ summary: EvaluationSummary[] }` sorted by `average_rating` descending
- Each item has: `course_id`, `course_name`, `course_code`, `instructor_name`, `semester`, `average_rating` (rounded to 1 decimal), `evaluation_count`, `comments` (array of non-null comment strings)
- Returns `500` on DB failure

**Todo List:**
1. Create `app/api/evaluations/summary/route.ts`
2. Export an async `GET` handler
3. Fetch all courses from `courses` table
4. Fetch all evaluations from `evaluations` table (select all columns)
5. In JavaScript, group evaluations by `course_id`, compute average rating and collect comments
6. Join with courses data to attach `course_name`, `course_code`, `instructor_name`, `semester`
7. Sort by `average_rating` descending
8. Return the result — include courses that have zero evaluations (average = 0, count = 0)

**Relevant Context:** Sub-Task 2 must be complete. Aggregation done in JS (not raw SQL) to keep things explicit and testable.

**Status:** [ ] pending

---

## Sub-Task 6 — Shared UI Components

**Intent:** Build reusable, styled components that both pages will use. This isolates design work and keeps pages thin.

**Expected Outcomes:**
- `components/StarRating.tsx` — interactive star input (hover + selected states) for the student form; also a read-only display variant for the dashboard cards
- `components/CourseCard.tsx` — admin dashboard card showing course name, instructor, average star rating (read-only stars), evaluation count, and scrollable comments list
- `components/Navbar.tsx` — top navigation bar with the university name/logo on the left and "Student" / "Admin" links on the right
- All components are styled with Tailwind utility classes — blue-and-white palette, rounded corners, shadows, good spacing

**Todo List:**
1. Create `components/StarRating.tsx`:
   - Props: `value: number`, `onChange?: (v: number) => void`, `readOnly?: boolean`
   - 5 star icons (use Unicode ★/☆ or SVG) that light up on hover and stay lit when selected
   - Interactive state when `onChange` is provided; static display when `readOnly={true}`
   - Color: filled = amber/yellow (`text-yellow-400`), empty = gray (`text-gray-300`)
2. Create `components/CourseCard.tsx`:
   - Props: `summary: EvaluationSummary`
   - White card with shadow, course code + name as title, instructor subtitle
   - Read-only `StarRating` + numeric average + evaluation count
   - Comments section: each comment in a subtle quoted block
   - If zero comments, show "No comments yet"
3. Create `components/Navbar.tsx`:
   - Blue background (`bg-blue-700`), white text, full-width
   - University name on the left, two navigation links on the right
   - Responsive: links stack or use a hamburger on small screens (simple approach: always show both links)

**Relevant Context:** Sub-Tasks 1 and 2 must be complete. Components are `"use client"` only when they hold state (StarRating input). CourseCard and Navbar can be server components.

**Status:** [ ] pending

---

## Sub-Task 7 — Home Page & Layout

**Intent:** Set up the root layout (fonts, Tailwind base styles, Navbar) and the home page with two large navigation cards: "I'm a Student" and "I'm an Admin".

**Expected Outcomes:**
- `app/layout.tsx` — includes `<Navbar />`, sets `<html lang="en">`, applies global Tailwind styles
- `app/page.tsx` — full-width hero area with university branding, two large clickable cards linking to `/evaluate` and `/dashboard`
- Blue-and-white design consistent with the rest of the app

**Todo List:**
1. Update `app/layout.tsx`:
   - Import and render `<Navbar />`
   - Set page background to off-white (`bg-gray-50`)
   - Include appropriate `<meta>` title tag: "University Course Evaluation System"
2. Replace `app/page.tsx` with the home page:
   - Hero heading: "University Course Evaluation System"
   - Subheading describing the purpose
   - Two large cards side-by-side (stack on mobile): "I'm a Student →" linking to `/evaluate` and "I'm an Admin →" linking to `/dashboard`
   - Cards styled with blue border/icon, white background, hover shadow

**Relevant Context:** Sub-Task 6 (Navbar) must be complete before this sub-task.

**Status:** [ ] pending

---

## Sub-Task 8 — Student Evaluation Page (`/evaluate`)

**Intent:** Build the full student-facing page where students select a course, enter their ID, pick a star rating, optionally add a comment, and submit the form. Handle success and 409 duplicate errors clearly.

**Expected Outcomes:**
- `app/evaluate/page.tsx` — server component that fetches courses on render (SSR via `fetch('/api/courses')`) — OR a client component that fetches on mount
- `app/evaluate/EvaluateForm.tsx` — `"use client"` component containing the interactive form
- Course list displayed as a styled `<select>` dropdown
- `StarRating` component used for rating input
- Student ID text field
- Optional comment `<textarea>`
- Submit button (blue, disabled while submitting)
- Success message shown after successful POST
- Error message shown on 409 (duplicate) or other errors
- Form resets after successful submission

**Todo List:**
1. Create `app/evaluate/page.tsx` as a server component:
   - Fetch courses from `GET /api/courses` using absolute URL (use `headers()` to get host, or use an environment variable `NEXT_PUBLIC_APP_URL` for the base URL)
   - Pass `courses` as a prop to `<EvaluateForm />`
2. Create `app/evaluate/EvaluateForm.tsx` as a `"use client"` component:
   - State: `selectedCourseId`, `studentId`, `rating`, `comment`, `status` (idle/submitting/success/error), `errorMessage`
   - On course select, update `selectedCourseId`; also retrieve and store the selected course's `semester` value to include in the POST body
   - On submit: call `POST /api/evaluations` with `{ course_id, student_identifier: studentId, rating, comment, semester }`
   - Check response status: 201 → set success; 409 → set duplicate error message; other → set generic error
   - After success: show green success banner; reset form fields
3. Style with Tailwind: white card, centered max-width container, proper label/input spacing

**Relevant Context:** Sub-Tasks 3, 4, 6 must be complete. The page uses the internal API — use a relative URL `/api/courses` inside a Server Component via `fetch` with `{ cache: 'no-store' }`. For absolute URL in server components, construct from `process.env.NEXT_PUBLIC_APP_URL` (add this to `.env.local` as `http://localhost:3000`).

**Status:** [ ] pending

---

## Sub-Task 9 — Admin Dashboard Page (`/dashboard`)

**Intent:** Build the admin-facing page that shows all courses with their aggregated evaluation data as cards, sorted by average rating descending.

**Expected Outcomes:**
- `app/dashboard/page.tsx` — server component that fetches summary data via `GET /api/evaluations/summary` on each request
- Renders a responsive grid of `<CourseCard />` components
- Shows a friendly message if no evaluations exist yet
- Professional page heading ("Evaluation Dashboard") and subtitle

**Todo List:**
1. Create `app/dashboard/page.tsx` as a server component:
   - Fetch from `GET /api/evaluations/summary` with `{ cache: 'no-store' }`
   - Handle fetch errors gracefully (show error message)
   - If summary array is empty, show "No evaluations have been submitted yet"
2. Render a CSS grid (2 columns on desktop, 1 on mobile) of `<CourseCard summary={item} />` for each item
3. Style the page header area consistently with the rest of the app

**Relevant Context:** Sub-Tasks 5 and 6 must be complete.

**Status:** [ ] pending

---

## Sub-Task 10 — Final Polish & Deliverables Summary

**Intent:** Verify the full app works end-to-end, fix any TypeScript errors, and produce the documentation deliverables requested by the user.

**Expected Outcomes:**
- `npm run build` completes without TypeScript errors or missing module errors
- `.env.local` has correct variable names documented
- All files are listed in the plan
- API endpoint table is ready for the user

**Todo List:**
1. Run `npm run build` and fix any TypeScript or lint errors
2. Verify `.env.local` contains: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`
3. Confirm no `@supabase/supabase-js` import exists outside `lib/supabase.ts` and `app/api/` files
4. Confirm `"use client"` directives are only on components that need them (`EvaluateForm`, `StarRating` input variant)
5. Produce final file list and API documentation table as part of the completion message

**Relevant Context:** All previous sub-tasks must be complete.

**Status:** [ ] pending

---

## File Map (expected on completion)

```
.env.local
next.config.ts
tailwind.config.ts
tsconfig.json
package.json
lib/
  supabase.ts
  types.ts
components/
  Navbar.tsx
  StarRating.tsx
  CourseCard.tsx
app/
  layout.tsx
  page.tsx
  globals.css
  api/
    courses/
      route.ts
    evaluations/
      route.ts
    evaluations/
      summary/
        route.ts
  evaluate/
    page.tsx
    EvaluateForm.tsx
  dashboard/
    page.tsx
```

## API Endpoint Table

| Endpoint | Method | Input | Output |
|---|---|---|---|
| `/api/courses` | GET | — | `{ courses: Course[] }` sorted by name |
| `/api/evaluations` | POST | JSON body: `course_id`, `student_identifier`, `rating` (1–5), `comment` (optional), `semester` | 201 `{ evaluation }` · 409 duplicate · 400 invalid · 500 error |
| `/api/evaluations/summary` | GET | — | `{ summary: EvaluationSummary[] }` sorted by avg rating desc |

## Environment Variables

| Variable | Where used | Description |
|---|---|---|
| `SUPABASE_URL` | `lib/supabase.ts` (server only) | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | `lib/supabase.ts` (server only) | Your Supabase anon/public key |
| `NEXT_PUBLIC_APP_URL` | `app/evaluate/page.tsx` | Base URL for server-side fetch calls (e.g. `http://localhost:3000`) |
