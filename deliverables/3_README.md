# University Course Evaluation System

A full-stack web application that allows students to anonymously evaluate their courses and enables administrators to view aggregated feedback across all courses.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| DB Client | `@supabase/supabase-js` (server-side only) |
| Hosting (local) | Node.js via `npm run dev` |

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── courses/route.ts              # GET /api/courses
│   │   ├── evaluations/route.ts          # POST /api/evaluations
│   │   └── evaluations/summary/route.ts  # GET /api/evaluations/summary
│   ├── evaluate/
│   │   ├── page.tsx                      # Student page (SSR)
│   │   └── EvaluateForm.tsx              # Interactive form (client component)
│   ├── dashboard/
│   │   └── page.tsx                      # Admin dashboard (SSR)
│   ├── layout.tsx                        # Root layout (Navbar + footer)
│   ├── page.tsx                          # Home page (role selection)
│   └── globals.css                       # Global Tailwind styles
├── components/
│   ├── Navbar.tsx                        # Top navigation bar
│   ├── StarRating.tsx                    # Interactive + read-only star component
│   └── CourseCard.tsx                    # Dashboard course card
├── lib/
│   ├── supabase.ts                       # Server-only Supabase client singleton
│   └── types.ts                          # Shared TypeScript interfaces
├── deliverables/                         # Project submission documents
├── .env.local                            # Environment variables (not committed)
└── package.json
```

---

## Pages

| Route | Role | Description |
|---|---|---|
| `/` | Everyone | Home page — choose Student or Admin |
| `/evaluate` | Student | Select a course, submit star rating + optional comment |
| `/dashboard` | Admin | View all courses with aggregated ratings and comments |

---

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later
- A **Supabase** project with the following tables already created (see `deliverables/1_database_schema.md` for the SQL)

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/university-course-eval.git
cd university-course-eval
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Supabase — server-side ONLY (no NEXT_PUBLIC_ prefix)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Base URL for internal server-side fetch calls
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local`** — it is listed in `.gitignore` and must stay off version control.

### 4. Set up the database

Run the SQL from `deliverables/1_database_schema.md` in your Supabase SQL Editor to create the `courses` and `evaluations` tables.

Insert at least a few sample courses so the student page has something to display.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm start` | Start production server (after build) |
| `npm run lint` | Run ESLint |

---

## API Summary

| Endpoint | Method | Description |
|---|---|---|
| `/api/courses` | `GET` | Returns all courses sorted by name |
| `/api/evaluations` | `POST` | Submits a student evaluation |
| `/api/evaluations/summary` | `GET` | Returns per-course aggregated stats |

See `deliverables/2_api_documentation.md` for the full API reference.

---

## Key Design Decisions

- **Server-side Supabase only** — `@supabase/supabase-js` is imported exclusively in `lib/supabase.ts` and the API route files. It never ships to the browser bundle.
- **No auth system** — intentionally omitted; student identification is by a typed Student ID, and the admin dashboard is open access.
- **Duplicate prevention** — enforced at the database level via a `UNIQUE` constraint on `(course_id, student_identifier, semester)`. The API returns a clear `409 Conflict` response which the frontend displays as a user-friendly message.
- **Semester auto-filled** — the student never types a semester; it is read automatically from the selected course object.
- **Aggregation in JavaScript** — the summary route fetches both tables and aggregates in memory. Suitable for a university-scale dataset; a PostgreSQL view would be the upgrade path for larger deployments.

---

## Environment Variables Reference

| Variable | Scope | Required | Description |
|---|---|---|---|
| `SUPABASE_URL` | Server only | ✅ | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Server only | ✅ | Your Supabase anon/public API key |
| `NEXT_PUBLIC_APP_URL` | Client + Server | ✅ | App base URL (e.g. `http://localhost:3000`) |

---

## License

Academic project — University submission. All rights reserved.
