# API Documentation — University Course Evaluation System

## Overview

All API endpoints are implemented as **Next.js Route Handlers** (`app/api/...`).  
The Supabase client runs **server-side only** — no database credentials are exposed to the browser.  
All requests and responses use `application/json`.

**Base URL (local):** `http://localhost:3000`

---

## Endpoints

---

### 1. `GET /api/courses`

Returns the full list of courses, sorted alphabetically by name.

#### Request

```
GET /api/courses
```

No parameters, no body, no authentication required.

#### Success Response — `200 OK`

```json
{
  "courses": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "code": "CS401",
      "name": "Advanced Web Development",
      "instructor_name": "Dr. Sarah Al-Rashid",
      "semester": "Fall 2025"
    }
  ]
}
```

#### Error Response — `500 Internal Server Error`

```json
{
  "error": "Database error message"
}
```

---

### 2. `POST /api/evaluations`

Submits a student evaluation for a course. Enforces one submission per student per course per semester via a database unique constraint.

#### Request

```
POST /api/evaluations
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `course_id` | `string` (uuid) | ✅ | ID of the course being evaluated |
| `student_identifier` | `string` | ✅ | Student ID (e.g. `S1234567`) |
| `rating` | `integer` | ✅ | Rating from 1 (poor) to 5 (excellent) |
| `comment` | `string` | ❌ | Optional free-text feedback |
| `semester` | `string` | ✅ | Semester of the course (taken automatically from the selected course on the frontend) |

**Example Body:**

```json
{
  "course_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "student_identifier": "S1234567",
  "rating": 4,
  "comment": "Well-structured course, great examples.",
  "semester": "Fall 2025"
}
```

#### Success Response — `201 Created`

```json
{
  "evaluation": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "course_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "student_identifier": "S1234567",
    "rating": 4,
    "comment": "Well-structured course, great examples.",
    "semester": "Fall 2025",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### Error Responses

| Status | Condition | Body |
|---|---|---|
| `400 Bad Request` | Missing or invalid field (e.g. rating not 1–5) | `{ "error": "rating must be an integer between 1 and 5." }` |
| `409 Conflict` | Student already submitted for this course this semester | `{ "error": "You have already submitted an evaluation for this course this semester." }` |
| `500 Internal Server Error` | Unexpected database error | `{ "error": "Database error message" }` |

---

### 3. `GET /api/evaluations/summary`

Returns aggregated evaluation statistics for every course — average rating, number of submissions, and the list of text comments. Results are sorted by average rating descending (highest-rated courses first).

#### Request

```
GET /api/evaluations/summary
```

No parameters, no body, no authentication required.

#### Success Response — `200 OK`

```json
{
  "summary": [
    {
      "course_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "course_name": "Advanced Web Development",
      "course_code": "CS401",
      "instructor_name": "Dr. Sarah Al-Rashid",
      "semester": "Fall 2025",
      "average_rating": 4.3,
      "evaluation_count": 12,
      "comments": [
        "Well-structured course, great examples.",
        "The instructor explains concepts very clearly."
      ]
    },
    {
      "course_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "course_name": "Database Systems",
      "course_code": "CS302",
      "instructor_name": "Prof. Ahmad Khalil",
      "semester": "Fall 2025",
      "average_rating": 3.8,
      "evaluation_count": 7,
      "comments": []
    }
  ]
}
```

**Notes:**
- Courses with zero evaluations are included with `average_rating: 0` and `evaluation_count: 0`.
- `comments` contains only non-null, non-empty strings.
- `average_rating` is rounded to one decimal place.
- Results are sorted by `average_rating` descending; ties are broken alphabetically by `course_name`.

#### Error Response — `500 Internal Server Error`

```json
{
  "error": "Database error message"
}
```

---

## Rating Scale Reference

| Value | Label |
|---|---|
| 1 | Poor |
| 2 | Fair |
| 3 | Good |
| 4 | Very Good |
| 5 | Excellent |

---

## Implementation Notes

- All routes live under `app/api/` and use the Next.js App Router Route Handler convention (`export async function GET/POST()`).
- The Supabase client (`lib/supabase.ts`) is a server-side singleton initialized from `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables — these are never exposed to the client bundle.
- Duplicate submission detection uses Postgres error code `23505` (unique constraint violation).
- Aggregation (average, count, comments) is performed in JavaScript after fetching both tables, keeping the route logic explicit and readable.
