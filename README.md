# University Course Evaluation System

## Overview
A web application for managing university course evaluations. Students
submit evaluations for their courses, and academic administration gets a
dashboard to track and analyze the results.

## Track: Software Engineering | Tool: IBM Bob | Mode: Individual

## Tech stack
- Frontend + Backend: Next.js (App Router), React
- Database: Supabase (PostgreSQL)

## Database structure
[Paste an ERD or a short description of the courses and evaluations tables here]

## API documentation
[Paste the endpoint table Bob gives you at the end of Step 2 — Endpoint / Method / Input / Output]

## Running locally
\`\`\`bash
npm install
# Create .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
npm run dev
\`\`\`

## Live link
[Vercel link here]

## Scope and limitations of the current version
- No real login/identity verification — replaced with role selection
  and a free-text student ID, a deliberate decision due to the tight
  submission timeline (7-day task, actual build completed in under 4
  hours on the final day)
- Courses are fixed seed data, not manageable through a UI
- RLS policies allow open public read/write, suitable for a demo only,
  not production-ready
