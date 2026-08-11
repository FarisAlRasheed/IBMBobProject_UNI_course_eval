# University Course Evaluation System

## Overview
A web application for managing university course evaluations. Students submit ratings and comments for their courses, and academic administration gets a live dashboard to track and analyze the results — supporting the goals of the challenge: increasing data collection efficiency, enabling reliable decision-making indicators, and maintaining security, scalability, and performance quality.

## Project details
- **Track:** Software Engineering
- **Challenge:** University Course Evaluation System
- **Work mode:** Individual
- **Tool used:** IBM Bob
- **Task duration:** 7 days (actual build executed in a single ~4-hour session on the final day)
- **Submission date:** August 11, 2026

## Tech stack
- **Frontend:** Next.js (App Router), React
- **Backend:** Next.js Route Handlers (`app/api/...`) — a dedicated API layer, not direct client-side database access
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel

## Database structure

**courses**
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| code | text | e.g. CSC101 |
| name | text | course name |
| instructor_name | text | |
| semester | text | default '2026-1' |
| created_at | timestamptz | |

**evaluations**
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| course_id | uuid | foreign key → courses.id |
| student_identifier | text | free-text student ID, no identity verification |
| rating | int | 1–5, enforced by check constraint |
| comment | text | optional |
| semester | text | default '2026-1' |
| created_at | timestamptz | |

Unique constraint on `(course_id, student_identifier, semester)` — prevents a student from evaluating the same course twice in the same semester at the database level.

```
courses ||--o{ evaluations : "has"
```

## API documentation

| Endpoint | Method | Input | Output |
|---|---|---|---|
| `/api/courses` | GET | none | List of all courses |
| `/api/evaluations` | POST | `{ course_id, student_identifier, rating, comment }` | 201 on success; 409 with error message if the course was already evaluated by that student this semester |
| `/api/evaluations/summary` | GET | none | Per course: average rating, evaluation count, list of comments — sorted highest-rated to lowest |

*[Replace this table with the exact one IBM Bob returns after generating the code, if it differs from what was requested.]*

## Running locally
```bash
npm install
```
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
```bash
npm run dev
```

## Live deployment
**[Add your Vercel URL here once deployed]**

## Deliverables checklist
- [x] Integrated application: frontend + backend (Next.js pages + Route Handler API)
- [x] Database schema / data models (Supabase/PostgreSQL, documented above)
- [x] API documentation + README (this file)
- [x] Responsible AI report (below)

## Scope and limitations of this version
- No real login/identity verification system — replaced with a role-selection landing page ("I'm a student" / "I'm an admin") and a free-text student ID field. This was a deliberate scope decision made necessary by the compressed timeline (see Responsible AI report, decision #2).
- Courses are fixed seed data entered directly via SQL, not manageable through an admin UI.
- Supabase Row Level Security policies allow public read access and public insert on evaluations. This is appropriate for a graded demo but is explicitly **not** a production-ready security posture — a real deployment would need per-user write scoping tied to actual authentication.
- No automated test suite — verification was manual (see Responsible AI report, section 4).

---

# Responsible AI report — IBM Bob usage

## 1. Stages where the tool was used

| Stage | Tool used | Notes |
|---|---|---|
| Requirements analysis / scope planning | Not Bob — planned manually (with Claude as a thinking partner) before touching the tool | Ensured the prompt to Bob was precise instead of open-ended |
| Database schema design | Not Bob — written directly as SQL and applied via the Supabase SQL editor | Guaranteed correct constraints (unique, check, foreign key) from the start rather than relying on generated schema |
| Backend API generation | IBM Bob | Single comprehensive prompt specifying exact routes, inputs, and outputs |
| Frontend generation | IBM Bob | Same prompt, requesting a specific visual direction (modern, blue/white) rather than accepting a generic default |
| Deployment | Not Bob — done manually via GitHub + Vercel | Bob does not deploy; it only generates code |
| Documentation (this file) | Not Bob | Written directly to keep it accurate to what was actually decided and built |

## 2. Decisions made personally instead of delegating to the tool

1. **Database schema design.** The schema — including the unique constraint preventing duplicate evaluations and the check constraint on rating range — was designed and written manually before any interaction with Bob, rather than asking the tool to design it. This removed a class of correctness risk (an AI-generated schema missing a constraint) from the critical path.

2. **Dropping the real authentication system.** Given the task was 7 days but the actual build happened in roughly 4 hours on the final day, a conscious decision was made to replace real login with a role-selection flow and a free-text student identifier. This is documented openly in the README's "Scope and limitations" section rather than presented as a finished auth system — an example of choosing transparency over the appearance of completeness.

3. **Requiring a real backend/API layer instead of direct client-side database calls.** The first draft of the plan had the frontend calling Supabase directly. On review, this was corrected before sending the prompt to Bob, because the project explicitly requires "Backend" and "API Documentation" as separate deliverables — a direct-client-call architecture would have made both of those hollow. The prompt was rewritten to require Next.js Route Handlers as a genuine API layer.

4. *[Add a fourth entry here once you've reviewed Bob's actual generated code — e.g., a specific piece of generated logic you corrected, or a UI choice you overrode.]*

## 3. Outputs from Bob that were modified or rejected
*[Fill in after building. Example format: "Bob's first draft of the dashboard queried all evaluations client-side and aggregated them in the browser; this was rejected because it duplicates logic that belongs in `/api/evaluations/summary` and would leak row-level data unnecessarily — the prompt/response was corrected to keep aggregation server-side."]*

## 4. Verifying correctness and safety of outputs
- Row Level Security policies were written and reviewed manually (not generated by Bob) before being applied to the database.
- The database schema's constraints (unique, check, foreign key) were verified by direct inspection of the SQL, not by trusting a generated description of them.
- *[Add: the end-to-end test you actually performed — e.g., "Submitted a test evaluation as a student and confirmed it appeared correctly in the admin dashboard with the correct average," and "Attempted to submit a duplicate evaluation and confirmed the 409 error displayed correctly."]*
- *[Add: any bug you found in Bob's output and how you fixed it.]*

## 5. Relevant Responsible AI principles

- **Transparency.** The system's real limitations — no true identity verification, open RLS policies, seed-data courses — are documented plainly in the README instead of being hidden or glossed over as if this were a finished production system.
- **Human oversight.** The architecture's foundational decisions (database schema and constraints, the requirement for a real API layer, the scope cut on authentication) were made by the developer before and independent of the tool's output, not accepted passively from whatever the tool proposed first.
- **Accountability.** Every deviation from the "ideal" full-featured system (no auth, seed data, open RLS) is attributed to an explicit, reasoned tradeoff under time constraint — not left unexplained.
